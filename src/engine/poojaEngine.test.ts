import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NITYA_POOJA_STEPS,
  getPoojaStepsForMode,
} from '../data/nityaPoojaSteps.ts';

test('Nitya Pooja Steps - Canonical 16 steps validation', () => {
  assert.equal(NITYA_POOJA_STEPS.length, 16, 'Should have exactly 16 canonical steps');

  // Check each step's structure
  NITYA_POOJA_STEPS.forEach((step, index) => {
    assert.equal(step.order, index + 1, `Step ${step.id} should have order ${index + 1}`);
    assert.ok(step.icon && step.icon.length > 0, `Step ${step.id} must have an icon`);
    assert.ok(step.title.telugu.length > 0, `Step ${step.id} must have a Telugu title`);
    assert.ok(step.title.english.length > 0, `Step ${step.id} must have an English title`);
    assert.ok(step.action.telugu.length > 0, `Step ${step.id} must have Telugu action`);
    assert.ok(step.action.english.length > 0, `Step ${step.id} must have English action`);
    assert.ok(step.mantra.telugu.length > 0, `Step ${step.id} must have Telugu mantra`);
    assert.ok(step.mantra.english.length > 0, `Step ${step.id} must have English mantra`);
    assert.ok(step.meaning.telugu.length > 0, `Step ${step.id} must have Telugu meaning`);
    assert.ok(step.meaning.english.length > 0, `Step ${step.id} must have English meaning`);
  });
});

test('Nitya Pooja Modes - Shodasa vs Laghu filtering', () => {
  const shodasaSteps = getPoojaStepsForMode('shodasa');
  assert.equal(shodasaSteps.length, 16, 'Shodasa mode must return all 16 steps');

  const laghuSteps = getPoojaStepsForMode('laghu');
  assert.ok(laghuSteps.length < 16, 'Laghu mode must be a compact subset');
  assert.equal(laghuSteps.length, 11, 'Laghu mode should have exactly 11 essential steps');

  // Verify all laghu steps have isLaghu set to true
  laghuSteps.forEach((step) => {
    assert.equal(step.isLaghu, true, `Step ${step.id} in laghu mode must have isLaghu=true`);
  });

  // Verify key steps are included in laghu
  const stepIds = laghuSteps.map((s) => s.id);
  assert.ok(stepIds.includes('deeparadhana'), 'Laghu must include Deeparadhana');
  assert.ok(stepIds.includes('achamanam'), 'Laghu must include Achamanam');
  assert.ok(stepIds.includes('sankalpam'), 'Laghu must include Sankalpam');
  assert.ok(stepIds.includes('ganapathi'), 'Laghu must include Ganapathi Prarthana');
  assert.ok(stepIds.includes('gandham_kumkuma'), 'Laghu must include Gandham & Kumkuma');
  assert.ok(stepIds.includes('pushparchana'), 'Laghu must include Pushparchana (108 names)');
  assert.ok(stepIds.includes('dhoopam'), 'Laghu must include Dhoopam');
  assert.ok(stepIds.includes('deepam_darshanam'), 'Laghu must include Deepam Darshanam');
  assert.ok(stepIds.includes('naivedyam'), 'Laghu must include Naivedyam');
  assert.ok(stepIds.includes('harati'), 'Laghu must include Mangala Harati');
});

test('Nitya Pooja Special Steps - Sankalpam and Ashtothram integration markers', () => {
  const sankalpaStep = NITYA_POOJA_STEPS.find((s) => s.id === 'sankalpam');
  assert.ok(sankalpaStep, 'Must have sankalpam step');
  assert.equal(sankalpaStep?.specialType, 'sankalpam');

  const pushpaStep = NITYA_POOJA_STEPS.find((s) => s.id === 'pushparchana');
  assert.ok(pushpaStep, 'Must have pushparchana step');
  assert.equal(pushpaStep?.specialType, 'ashtothram');
});
