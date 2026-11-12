import test from 'node:test';
import assert from 'node:assert/strict';
import { countdownReducer, createPracticeSession } from './countdownEngine.ts';

test('creates an active session with sanitized target and trimmed label', () => {
  const session = createPracticeSession({
    id: 's1',
    mode: 'pradakshina',
    label: '  Sri Venkateswara Temple  ',
    targetCount: 11,
    startedAt: '2026-11-12T10:00:00.000Z',
  });

  assert.equal(session.label, 'Sri Venkateswara Temple');
  assert.equal(session.targetCount, 11);
  assert.equal(session.remainingCount, 11);
  assert.equal(session.status, 'active');
});

test('throws when targetCount is less than 1', () => {
  assert.throws(() =>
    createPracticeSession({
      id: 's-bad',
      mode: 'japa',
      label: 'Om Namah Shivaya',
      targetCount: 0,
    })
  );
});

test('decrements down to zero, marks completed, and never goes negative', () => {
  let state = countdownReducer(null, {
    type: 'START',
    payload: {
      id: 's2',
      mode: 'japa',
      label: 'Om Namah Shivaya',
      targetCount: 2,
      startedAt: '2026-11-12T10:00:00.000Z',
    },
  });

  state = countdownReducer(state, { type: 'DECREMENT' });
  assert.equal(state?.remainingCount, 1);
  assert.equal(state?.status, 'active');

  state = countdownReducer(state, {
    type: 'DECREMENT',
    payload: { completedAt: '2026-11-12T10:02:00.000Z' },
  });
  assert.equal(state?.remainingCount, 0);
  assert.equal(state?.status, 'completed');
  assert.equal(state?.completedAt, '2026-11-12T10:02:00.000Z');

  // Extra decrement must not go below zero
  state = countdownReducer(state, { type: 'DECREMENT' });
  assert.equal(state?.remainingCount, 0);
  assert.equal(state?.status, 'completed');
});

test('supports undo without exceeding targetCount', () => {
  let state = countdownReducer(null, {
    type: 'START',
    payload: {
      id: 's3',
      mode: 'pradakshina',
      label: 'Hanuman Temple',
      targetCount: 3,
    },
  });

  // Undo at targetCount is a no-op
  state = countdownReducer(state, { type: 'UNDO' });
  assert.equal(state?.remainingCount, 3);

  state = countdownReducer(state, { type: 'DECREMENT' });
  assert.equal(state?.remainingCount, 2);

  state = countdownReducer(state, { type: 'UNDO' });
  assert.equal(state?.remainingCount, 3);
});

test('supports pause and resume while blocking decrements when paused', () => {
  let state = countdownReducer(null, {
    type: 'START',
    payload: {
      id: 's4',
      mode: 'japa',
      label: '',
      targetCount: 108,
    },
  });

  state = countdownReducer(state, { type: 'PAUSE' });
  assert.equal(state?.status, 'paused');

  // Decrement while paused must be ignored
  state = countdownReducer(state, { type: 'DECREMENT' });
  assert.equal(state?.remainingCount, 108);

  state = countdownReducer(state, { type: 'RESUME' });
  assert.equal(state?.status, 'active');

  state = countdownReducer(state, { type: 'DECREMENT' });
  assert.equal(state?.remainingCount, 107);
});

test('supports reset and clear', () => {
  let state = countdownReducer(null, {
    type: 'START',
    payload: {
      id: 's5',
      mode: 'japa',
      label: 'Gayatri Mantra',
      targetCount: 27,
    },
  });

  state = countdownReducer(state, { type: 'DECREMENT' });
  state = countdownReducer(state, { type: 'DECREMENT' });
  assert.equal(state?.remainingCount, 25);

  state = countdownReducer(state, { type: 'RESET' });
  assert.equal(state?.remainingCount, 27);
  assert.equal(state?.status, 'active');
  assert.equal(state?.completedAt, undefined);

  state = countdownReducer(state, { type: 'CLEAR' });
  assert.equal(state, null);
});

test('syncs external Pocket Mode counts and clamps safely at zero', () => {
  let state = countdownReducer(null, {
    type: 'START',
    payload: {
      id: 's6',
      mode: 'japa',
      label: 'Om Namo Narayanaya',
      targetCount: 108,
    },
  });

  state = countdownReducer(state, {
    type: 'SYNC_EXTERNAL',
    payload: { remainingCount: 95, isPaused: true },
  });
  assert.equal(state?.remainingCount, 95);
  assert.equal(state?.status, 'paused');

  state = countdownReducer(state, {
    type: 'SYNC_EXTERNAL',
    payload: { remainingCount: -2, completedAt: '2026-11-12T15:00:00.000Z' },
  });
  assert.equal(state?.remainingCount, 0);
  assert.equal(state?.status, 'completed');
});
