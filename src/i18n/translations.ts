import type { AppLanguage } from '../types/practice';

export interface TranslationStrings {
  tabs: {
    home: string;
    pradakshina: string;
    japa: string;
    history: string;
    settings: string;
  };
  common: {
    backHome: string;
    backSetup: string;
    session: string;
    sessions: string;
    savedPresets: string;
    savePreset: string;
    cancel: string;
    confirm: string;
  };
  home: {
    eyebrow: string;
    title: string;
    subtitle: string;
    pradakshinaBadge: string;
    pradakshinaTitle: string;
    pradakshinaDesc: string;
    japaBadge: string;
    japaTitle: string;
    japaDesc: string;
    todaySadhana: string;
    noSadhanaToday: string;
    startPractice: string;
    japaSubtitle: string;
    pradakshinaSubtitle: string;
  };
  pradakshina: {
    eyebrow: string;
    title: string;
    subtitle: string;
    templeLabel: string;
    templePlaceholder: string;
    targetLabel: string;
    startButton: string;
    errorTemple: string;
    errorTarget: string;
    fallbackLabel: string;
    autoLoopTitle: string;
    autoLoopSubtitle: string;
    manualMode: string;
    autoLoopMode: string;
    startCalibration: string;
    completeCalibration: string;
    calibratingHint: string;
    calibratedBadge: string;
    pocketHint: string;
    stepsCount: string;
    recalibrate: string;
    minStepsWarning: string;
  };
  japa: {
    eyebrow: string;
    title: string;
    subtitle: string;
    mantraLabel: string;
    mantraPlaceholder: string;
    suggestedLabel: string;
    customLabel: string;
    startButton: string;
    errorTarget: string;
    fallbackLabel: string;
    browseLibrary: string;
    newMantra: string;
    searchMantras: string;
    sanskritTab: string;
    teluguTab: string;
    englishTab: string;
    selectMantra: string;
    createMantraTitle: string;
    mantraNameField: string;
    deityField: string;
    sanskritTextField: string;
    teluguTextField: string;
    englishTextField: string;
    defaultTargetField: string;
    saveMantraButton: string;
    mantraStatsSessions: string;
    mantraStatsReps: string;
    allMantras: string;
    favoriteMantras: string;
    customMantras: string;
    viewMantraCard: string;
    hideMantraCard: string;
  };
  counter: {
    remaining: string;
    tapHintScreen: string;
    tapHintBackTap: string;
    tapHintPaused: string;
    undo: string;
    pause: string;
    resume: string;
    reset: string;
    alwaysOnDim: string;
    exitDim: string;
    pocketMode: string;
    stopPocketMode: string;
    pocketModeActive: string;
    pocketModeUnavailable: string;
    confirmResetTitle: string;
    confirmResetBody: string;
    confirmExitTitle: string;
    confirmExitBody: string;
    confirmHomeTitle: string;
    confirmHomeBody: string;
    confirmHomeAction: string;
    completeEyebrow: string;
    completePradakshina: string;
    completeJapa: string;
    repeat: string;
    malaSingular: string;
    malaPlural: string;
    meruReached: string;
    meruPausedHint: string;
  };
  history: {
    today: string;
    thisMonth: string;
    lifetimeJapa: string;
    lifetimePradakshina: string;
    completedTitle: string;
    empty: string;
    clearButton: string;
    confirmClearTitle: string;
    confirmClearBody: string;
    clearConfirm: string;
  };
  settings: {
    languageTitle: string;
    languageDesc: string;
    keepAwakeTitle: string;
    keepAwakeDesc: string;
    backTapTitle: string;
    backTapDesc: string;
    sensitivityTitle: string;
    sensitivityDesc: string;
    selected: string;
    low: string;
    lowHint: string;
    medium: string;
    mediumHint: string;
    high: string;
    highHint: string;
    calibrationTitle: string;
    calibrationDesc: string;
    calibrationStart: string;
    calibrationStop: string;
    calibrationReset: string;
    calibrationPeak: string;
    calibrationThreshold: string;
    calibrationDetectedCount: string;
    calibrationIdle: string;
    calibrationListening: string;
    calibrationTap1: string;
    calibrationDetected: string;
    calibrationGyroRejected: string;
    calibrationUnavailable: string;
    calibrationSwitchHint: string;
    malaTitle: string;
    malaDesc: string;
    mala108: string;
    mala108Hint: string;
    mala27: string;
    mala27Hint: string;
    meruTitle: string;
    meruDesc: string;
    meruContinue: string;
    meruContinueHint: string;
    meruPause: string;
    meruPauseHint: string;
    malaHapticTitle: string;
    malaHapticDesc: string;
    dailyPanchangamReminder: string;
    dailyPanchangamReminderHint: string;
    notesTitle: string;
    notesBody: string;
  };
  menu: {
    menuTitle: string;
    ashtothramTitle: string;
    ashtothramDesc: string;
    japaTitle: string;
    japaDesc: string;
    pradakshinaTitle: string;
    pradakshinaDesc: string;
    mantraLibraryTitle: string;
    mantraLibraryDesc: string;
    panchangamTitle: string;
    panchangamDesc: string;
    historyTitle: string;
    historyDesc: string;
    settingsTitle: string;
    settingsDesc: string;
    aboutTitle: string;
    aboutDesc: string;
    nityaPoojaTitle: string;
    nityaPoojaDesc: string;
  };
  nityaPooja: {
    cardBadge: string;
    cardTitle: string;
    cardDesc: string;
    title: string;
    subtitle: string;
    modeLaghu: string;
    modeShodasa: string;
    modeLaghuHint: string;
    modeShodasaHint: string;
    stepCount: string;
    actionTitle: string;
    mantraTitle: string;
    meaningTitle: string;
    nextStep: string;
    prevStep: string;
    completePooja: string;
    poojaCompletedTitle: string;
    poojaCompletedDesc: string;
    poojaDoneButton: string;
    selectDeityPrompt: string;
    ashtothramNamesCount: string;
    changeDeity: string;
  };
  ashtothram: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    deitiesCount: string;
    namesCount: string;
    startArchana: string;
    allDeities: string;
    currentNama: string;
    viewAllNames: string;
    closeView: string;
    cardHomeBadge: string;
    cardHomeTitle: string;
    cardHomeDesc: string;
    fontSizeRegular: string;
    fontSizeLarge: string;
    fontSizeXLarge: string;
    tapToHighlight: string;
  };
  panchangam: {
    title: string;
    subtitle: string;
    today: string;
    yesterday: string;
    tomorrow: string;
    samvatsara: string;
    ayana: string;
    ritu: string;
    masa: string;
    paksha: string;
    tithi: string;
    nakshatra: string;
    yoga: string;
    karana: string;
    vaara: string;
    timingsSection: string;
    auspiciousTimings: string;
    inauspiciousTimings: string;
    rahuKalam: string;
    yamagandam: string;
    gulikaKalam: string;
    durmuhurtham: string;
    abhijit: string;
    specialDay: string;
    close: string;
    quickHomeHint: string;
    panchangamTab: string;
    sankalpamTab: string;
    datePickerTitle: string;
    selectDate: string;
    jumpToUgadi: string;
    jumpToToday: string;
    jumpToEndYear: string;
    ugadiToUgadiRange: string;
    tradition: string;
    smartha: string;
    vaishnava: string;
    purpose: string;
    poojaPurpose: string;
    pratahSandhya: string;
    madhyahnikaSandhya: string;
    sayamSandhya: string;
    gayatriJapa: string;
    japaPurpose: string;
    gotramLabel: string;
    nameLabel: string;
    includeFamilyLabel: string;
    copySankalpam: string;
    copiedSankalpam: string;
    bhavarthaTitle: string;
    scriptToggleTe: string;
    scriptToggleEn: string;
    personalDetails: string;
    personalDetailsHint: string;
    calendarButton: string;
    shareWhatsApp: string;
    shareShort: string;
    shareSankalpamWhatsApp: string;
    shareSuccess: string;
  };
  notifications: {
    pradakshinaTitle: string;
    japaTitle: string;
    pradakshinaUnit: string;
    japaUnit: string;
    panchangaReminderTitle: string;
    panchangaReminderBody: string;
  };
}

export const translations: Record<AppLanguage, TranslationStrings> = {
  en: {
    tabs: {
      home: 'Home',
      pradakshina: 'Pradakshina',
      japa: 'Japa',
      history: 'History',
      settings: 'Settings',
    },
    common: {
      backHome: 'Home',
      backSetup: '← Back to Setup',
      session: 'session',
      sessions: 'sessions',
      savedPresets: 'Saved Presets',
      savePreset: 'Save for quick reuse',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
    home: {
      eyebrow: 'Remember the Divine.',
      title: 'SMARANA',
      subtitle: 'Your companion for Japa, Pradakshina and daily Sadhana.',
      pradakshinaBadge: 'TEMPLE CIRCUMAMBULATION',
      pradakshinaTitle: 'Pradakshina',
      pradakshinaDesc:
        'Track temple rounds with tap counting, pause/resume, and completion alerts.',
      japaBadge: 'MANTRA REPETITION',
      japaTitle: 'Japa',
      japaDesc:
        'Count down from 108 or custom targets (11, 27, 54, 1008) with calm haptics.',
      todaySadhana: "Today's Sadhana",
      noSadhanaToday: "Ready to begin today's practice",
      startPractice: 'Start',
      japaSubtitle: 'Mala Counter · 108 Beads',
      pradakshinaSubtitle: 'Temple Circumambulation',
    },
    pradakshina: {
      eyebrow: 'TEMPLE CIRCUMAMBULATION',
      title: 'New Pradakshina',
      subtitle: 'Enter the temple name and your target number of rounds.',
      templeLabel: 'Temple Name',
      templePlaceholder: 'e.g. Sri Venkateswara Temple',
      targetLabel: 'Target Pradakshinas',
      startButton: 'Start Pradakshina',
      errorTemple: 'Please enter the temple name.',
      errorTarget: 'Please enter a valid target of 1 or more.',
      fallbackLabel: 'Temple Pradakshina',
      autoLoopTitle: 'Smart Auto-Loop',
      autoLoopSubtitle: 'Walk 1st round to calibrate. Phone auto-counts remaining rounds in pocket.',
      manualMode: 'Manual Tap',
      autoLoopMode: 'Auto-Loop',
      startCalibration: '🚶‍♂️ Start Round 1 (Calibrate)',
      completeCalibration: '✅ Finish Round 1 · Set Loop',
      calibratingHint: 'Walk Round 1 around the shrine. Tap "Finish Round 1" when back at start.',
      calibratedBadge: 'Loop Calibrated',
      pocketHint: 'Keep phone in pocket. Phone will vibrate on every completed round.',
      stepsCount: 'steps',
      recalibrate: 'Re-calibrate',
      minStepsWarning: 'Please walk at least 10 steps before setting loop.',
    },
    japa: {
      eyebrow: 'MANTRA REPETITION',
      title: 'New Japa',
      subtitle: 'Optionally enter a mantra and choose a repetition target.',
      mantraLabel: 'Mantra Name (Optional)',
      mantraPlaceholder: 'e.g. Om Namah Shivaya',
      suggestedLabel: 'Suggested Targets',
      customLabel: 'Custom Target',
      startButton: 'Start Japa',
      errorTarget: 'Please enter a valid repetition count of 1 or more.',
      fallbackLabel: 'Japa Practice',
      browseLibrary: 'Mantra Library',
      newMantra: '+ Custom Mantra',
      searchMantras: 'Search mantras or deities...',
      sanskritTab: 'Sanskrit',
      teluguTab: 'Telugu',
      englishTab: 'English',
      selectMantra: 'Select',
      createMantraTitle: 'Create Custom Mantra',
      mantraNameField: 'Mantra Name',
      deityField: 'Deity / Devata (Optional)',
      sanskritTextField: 'Sanskrit Text (Optional)',
      teluguTextField: 'Telugu Text (Optional)',
      englishTextField: 'English Transliteration (Optional)',
      defaultTargetField: 'Default Target Repetitions',
      saveMantraButton: 'Save Mantra',
      mantraStatsSessions: 'sessions',
      mantraStatsReps: 'reps',
      allMantras: 'All',
      favoriteMantras: 'Favorites',
      customMantras: 'Custom',
      viewMantraCard: 'View Mantra Text',
      hideMantraCard: 'Hide Mantra Text',
    },
    counter: {
      remaining: 'REMAINING',
      tapHintScreen: 'Tap anywhere here to count',
      tapHintBackTap: 'Tap screen or double-tap back',
      tapHintPaused: 'Paused — tap Resume below',
      undo: 'Undo',
      pause: 'Pause',
      resume: 'Resume',
      reset: 'Reset',
      alwaysOnDim: 'Dim Mode',
      exitDim: 'Exit Dim Mode',
      pocketMode: 'Pocket Mode',
      stopPocketMode: 'Stop Pocket',
      pocketModeActive: 'Pocket Mode active — safe to lock screen',
      pocketModeUnavailable:
        'Pocket Mode (locked-screen counting) requires the Android APK or development build, as Expo Go does not support custom foreground services.',
      confirmResetTitle: 'Reset Session?',
      confirmResetBody: 'Your current progress will be reset back to the target count.',
      confirmExitTitle: 'Leave Active Session?',
      confirmExitBody: 'Your current session progress will be cleared.',
      confirmHomeTitle: 'Pause & Return Home?',
      confirmHomeBody:
        'Your current progress is saved and the session will pause while you leave.',
      confirmHomeAction: 'Go Home',
      completeEyebrow: 'SESSION COMPLETE',
      completePradakshina: 'Pradakshinas',
      completeJapa: 'Japa repetitions',
      repeat: 'Repeat',
      malaSingular: 'Mala',
      malaPlural: 'Malas',
      meruReached: 'Meru reached — Mala complete',
      meruPausedHint: 'Paused at Meru — turn Mala and tap Resume',
    },
    history: {
      today: 'TODAY',
      thisMonth: 'THIS MONTH',
      lifetimeJapa: 'ALL-TIME JAPA',
      lifetimePradakshina: 'ALL-TIME PRADAKSHINA',
      completedTitle: 'Completed Sessions',
      empty:
        'No completed sessions yet. Finish a Pradakshina or Japa session to see it saved here offline.',
      clearButton: 'Clear',
      confirmClearTitle: 'Clear History?',
      confirmClearBody:
        'All completed Japa and Pradakshina records and stats will be permanently deleted.',
      clearConfirm: 'Clear All',
    },
    settings: {
      languageTitle: 'Language / భాష',
      languageDesc: 'Choose the display language for the app.',
      keepAwakeTitle: 'Keep Screen Awake',
      keepAwakeDesc:
        'Prevent the display from sleeping while a Japa or Pradakshina session is active.',
      backTapTitle: 'Back-of-Phone Double-Tap',
      backTapDesc:
        'Count down by double-tapping the back of your phone while a session is active.',
      sensitivityTitle: 'Tap Sensitivity',
      sensitivityDesc:
        'Adjust how firm the double-tap must be to avoid accidental counts.',
      selected: 'Selected',
      low: 'Low',
      lowHint: 'Requires a firmer double-tap; best while walking.',
      medium: 'Medium',
      mediumHint: 'Balanced sensitivity for everyday use.',
      high: 'High',
      highHint: 'Lighter double-tap; best when seated for Japa.',
      calibrationTitle: 'Live Calibration',
      calibrationDesc:
        'Test double-tapping the back of your phone to verify detection and tune sensitivity for your device and case.',
      calibrationStart: 'Start Live Test',
      calibrationStop: 'Stop Test',
      calibrationReset: 'Reset',
      calibrationPeak: 'Peak Impulse',
      calibrationThreshold: 'Threshold',
      calibrationDetectedCount: 'Detected',
      calibrationIdle:
        'Tap "Start Live Test", hold your phone naturally, and double-tap the back.',
      calibrationListening: 'Listening — double-tap the back of your phone',
      calibrationTap1: 'First tap felt — tap once more...',
      calibrationDetected: 'Double-tap detected!',
      calibrationGyroRejected:
        'Too much movement — hold steady and double-tap',
      calibrationUnavailable:
        'Accelerometer sensor is unavailable on this device.',
      calibrationSwitchHint:
        'Tip: Switch Low / Medium / High above while testing to compare.',
      malaTitle: 'Mala Bead Count',
      malaDesc:
        'Choose whether each Mala ring tracks 108 beads (full Mala) or 27 beads (quarter Mala).',
      mala108: '108 Beads',
      mala108Hint: 'Traditional full Japa Mala.',
      mala27: '27 Beads',
      mala27Hint: 'Compact quarter-Mala ring.',
      meruTitle: 'Meru Bead Behaviour',
      meruDesc:
        'Choose what happens when you complete a Mala and reach the top Meru bead.',
      meruContinue: 'Continue Seamlessly',
      meruContinueHint:
        'Show the Mala milestone and continue directly into the next Mala.',
      meruPause: 'Pause at Meru',
      meruPauseHint:
        'Pause after each Mala so you can mindfully turn your Mala before resuming.',
      malaHapticTitle: 'Mala Completion Haptic',
      malaHapticDesc:
        'Play a gentle double-pulse vibration whenever a full Mala is completed.',
      dailyPanchangamReminder: 'Daily Morning Panchangam (6:00 AM)',
      dailyPanchangamReminderHint:
        'Receive a gentle notification at 6:00 AM to view and share today\'s Panchangam on WhatsApp.',
      notesTitle: 'Android Background & Button Notes',
      notesBody:
        '• Back-tap detection currently runs while the app is open on screen.\n• Reliable locked-screen detection and hardware volume-button counting require a native Android build (Expo dev client) and foreground-service testing.',
    },
    menu: {
      menuTitle: 'Smarana Menu',
      nityaPoojaTitle: 'Nitya Pooja Vidhanam',
      nityaPoojaDesc: 'Step-by-step guided daily worship',
      ashtothramTitle: 'Ashtothram',
      ashtothramDesc: '108 sacred names for Archana & Japa',
      japaTitle: 'Japa Counter',
      japaDesc: 'Count with 108 Mala ring & haptics',
      pradakshinaTitle: 'Pradakshina Counter',
      pradakshinaDesc: 'Temple circumambulation counter',
      mantraLibraryTitle: 'Mantra Library',
      mantraLibraryDesc: 'Browse and save sacred mantras',
      panchangamTitle: 'Panchangam',
      panchangamDesc: 'Telugu Daily Panchangam & Timings',
      historyTitle: 'Practice History',
      historyDesc: 'View daily and total Sadhana',
      settingsTitle: 'Settings & Calibration',
      settingsDesc: 'Mala size, back-tap, and haptics',
      aboutTitle: 'About Smarana',
      aboutDesc:
        'Offline-first, privacy-first companion for Japa, Pradakshina and daily Sadhana.',
    },
    nityaPooja: {
      cardBadge: 'DAILY WORSHIP',
      cardTitle: 'Nitya Pooja Vidhanam',
      cardDesc:
        'Step-by-step guided daily pooja from lamp lighting to Mangala Harati with slokas, actions, and meaning.',
      title: 'Nitya Pooja Vidhanam',
      subtitle: 'Daily Vedic Worship Procedure',
      modeLaghu: 'Laghu Pooja (5 Mins)',
      modeShodasa: 'Shodashopachara (16 Steps)',
      modeLaghuHint: '11 essential steps for busy weekday mornings',
      modeShodasaHint: 'Full 16 canonical upacharas for sacred days',
      stepCount: 'Step',
      actionTitle: 'Action (చేయవలసిన క్రియ)',
      mantraTitle: 'Mantra / Sloka (శ్లోకం)',
      meaningTitle: 'Sacred Meaning (భావార్థం)',
      nextStep: 'Next Step (తదుపరి) →',
      prevStep: '← Previous (వెనుకకు)',
      completePooja: '🪷 Complete Pooja (సమర్పణ)',
      poojaCompletedTitle: 'Pooja Sampoornam!',
      poojaCompletedDesc:
        'May the Divine bless you and your family with health, peace, and spiritual well-being.',
      poojaDoneButton: 'Close & Return Home',
      selectDeityPrompt: 'Select Deity for Pushparchana',
      ashtothramNamesCount: '108 Divine Names',
      changeDeity: 'Change Deity',
    },
    ashtothram: {
      badge: '108 DIVINE NAMES',
      title: 'Ashtottara Shatanamavali',
      subtitle:
        '108 sacred names of deities for daily Archana, Pushpanjali, and Japa.',
      searchPlaceholder: 'Search deities or names...',
      deitiesCount: '8 Deities',
      namesCount: '108 Sacred Names',
      startArchana: 'Start 108 Archana / Japa',
      allDeities: 'All Deities',
      currentNama: 'Nama',
      viewAllNames: 'View All 108 Names',
      closeView: 'Close',
      cardHomeBadge: 'DIVINE 108 NAMES',
      cardHomeTitle: 'Ashtothram',
      cardHomeDesc:
        'Recite and count 108 names for Ganesha, Shiva, Venkateswara, Lakshmi, Hanuman, and more with Devanagari, Telugu, and English.',
      fontSizeRegular: 'Standard',
      fontSizeLarge: 'Large',
      fontSizeXLarge: 'Extra Large',
      tapToHighlight: 'Tap any name to bookmark chant',
    },
    panchangam: {
      title: 'Telugu Panchangam',
      subtitle: 'Daily Drik Ganitha Panchangam for Andhra Pradesh & Telangana',
      today: 'Today',
      yesterday: 'Yesterday',
      tomorrow: 'Tomorrow',
      samvatsara: 'Samvatsaram',
      ayana: 'Ayanam',
      ritu: 'Rithuvu',
      masa: 'Masam',
      paksha: 'Paksham',
      tithi: 'Thithi',
      nakshatra: 'Nakshatram',
      yoga: 'Yogam',
      karana: 'Karanam',
      vaara: 'Vaaram',
      timingsSection: 'Daily Timings',
      auspiciousTimings: 'Auspicious Timings',
      inauspiciousTimings: 'Inauspicious Timings',
      rahuKalam: 'Rahu Kalam',
      yamagandam: 'Yamagandam',
      gulikaKalam: 'Gulika Kalam',
      durmuhurtham: 'Durmuhurtham',
      abhijit: 'Abhijit Muhurtham',
      specialDay: 'Sacred Vratam / Day',
      close: 'Close',
      quickHomeHint: 'Today’s Panchangam',
      panchangamTab: 'Panchangam',
      sankalpamTab: 'Sankalpam',
      datePickerTitle: 'Telugu Year (Ugadi to Ugadi)',
      selectDate: 'Select Date',
      jumpToUgadi: 'Ugadi',
      jumpToToday: 'Today',
      jumpToEndYear: 'Year End',
      ugadiToUgadiRange: 'Ugadi to Ugadi Cycle',
      tradition: 'Tradition',
      smartha: 'Smartha (Parameshwara)',
      vaishnava: 'Vaishnava (Narayana)',
      purpose: 'Sankalpa Purpose',
      poojaPurpose: 'Nitya Devatarchana / Pooja',
      pratahSandhya: 'Pratah Sandhyavandanam',
      madhyahnikaSandhya: 'Madhyahnika Sandhya',
      sayamSandhya: 'Sayam Sandhyavandanam',
      gayatriJapa: 'Gayatri Mahamantra Japa',
      japaPurpose: 'Ishta Devata Japa',
      gotramLabel: 'Gotram (optional)',
      nameLabel: 'Name (optional)',
      includeFamilyLabel: 'Include Family (Sahakutumbasya)',
      copySankalpam: 'Share / Copy Sankalpam',
      copiedSankalpam: 'Sankalpam Copied!',
      bhavarthaTitle: 'Sacred Meaning (Bhavartha)',
      scriptToggleTe: 'తెలుగు లిపి',
      scriptToggleEn: 'English (IAST)',
      personalDetails: 'Personal Gotram & Name',
      personalDetailsHint: 'Customize Sankalpam with your Gotra and Sharma',
      calendarButton: 'Ugadi Calendar',
      shareWhatsApp: 'Share on WhatsApp',
      shareShort: 'Share',
      shareSankalpamWhatsApp: 'Share Sankalpam on WhatsApp',
      shareSuccess: 'Opening WhatsApp...',
    },
    notifications: {
      pradakshinaTitle: 'Pradakshina Complete',
      japaTitle: 'Japa Complete',
      pradakshinaUnit: 'Pradakshinas',
      japaUnit: 'repetitions',
      panchangaReminderTitle: "Today's Panchangam",
      panchangaReminderBody:
        "Today's Tithi, Nakshatra, and timings are ready. Tap to share with family on WhatsApp.",
    },
  },
  te: {
    tabs: {
      home: 'హోమ్',
      pradakshina: 'ప్రదక్షిణ',
      japa: 'జపం',
      history: 'చరిత్ర',
      settings: 'సెట్టింగ్స్',
    },
    common: {
      backHome: 'హోమ్',
      backSetup: '← వెనుకకు',
      session: 'సెషన్',
      sessions: 'సెషన్లు',
      savedPresets: 'సేవ్ చేసినవి',
      savePreset: 'త్వరిత వినియోగానికి సేవ్ చేయి',
      cancel: 'రద్దు',
      confirm: 'నిర్ధారించు',
    },
    home: {
      eyebrow: 'దివ్య స్మరణ',
      title: 'స్మరణ (SMARANA)',
      subtitle: 'జపం, ప్రదక్షిణ మరియు నిత్య సాధనకు మీ సహచరి.',
      pradakshinaBadge: 'ఆలయ ప్రదక్షిణలు',
      pradakshinaTitle: 'ప్రదక్షిణ',
      pradakshinaDesc:
        'ఆలయ ప్రదక్షిణలను ట్యాప్ కౌంటింగ్, విరామం మరియు అలర్ట్‌లతో ట్రాక్ చేయండి.',
      japaBadge: 'మంత్ర జపం',
      japaTitle: 'జపం',
      japaDesc:
        '108 లేదా 11, 27, 54, 1008 లక్ష్యాలతో ప్రశాంతంగా జపం లెక్కించండి.',
      todaySadhana: 'ఈ రోజు సాధన',
      noSadhanaToday: 'నేటి సాధనను ప్రారంభించండి',
      startPractice: 'ప్రారంభించు',
      japaSubtitle: 'మాల జపం · 108 నామాలు',
      pradakshinaSubtitle: 'ఆలయ ప్రదక్షిణలు',
    },
    pradakshina: {
      eyebrow: 'ఆలయ ప్రదక్షిణలు',
      title: 'కొత్త ప్రదక్షిణ',
      subtitle: 'ఆలయ పేరు మరియు లక్ష్య ప్రదక్షిణల సంఖ్యను నమోదు చేయండి.',
      templeLabel: 'ఆలయ పేరు',
      templePlaceholder: 'ఉదా. శ్రీ వేంకటేశ్వర ఆలయం',
      targetLabel: 'లక్ష్య ప్రదక్షిణలు',
      startButton: 'ప్రదక్షిణ ప్రారంభించు',
      errorTemple: 'దయచేసి ఆలయ పేరు నమోదు చేయండి.',
      errorTarget: 'దయచేసి 1 లేదా అంతకంటే ఎక్కువ సంఖ్యను నమోదు చేయండి.',
      fallbackLabel: 'ఆలయ ప్రదక్షిణ',
      autoLoopTitle: 'స్మార్ట్ ఆటో-లూప్',
      autoLoopSubtitle: 'మొదటి రౌండ్ పూర్తి చేసి లూప్ సెట్ చేయండి. మిగిలినవి జేబులో ఉంచినా యాప్ ఆటోమేటిక్‌గా లెక్కిస్తుంది.',
      manualMode: 'సాధారణ ట్యాప్',
      autoLoopMode: 'స్మార్ట్ ఆటో-లూప్',
      startCalibration: '🚶‍♂️ మొదటి రౌండ్ ప్రారంభించు',
      completeCalibration: '✅ రౌండ్ 1 పూర్తయింది · లూప్ సెట్ చేయి',
      calibratingHint: 'గర్భగుడి చుట్టూ 1వ రౌండ్ నడవండి. ప్రారంభ స్థానానికి రాగానే "రౌండ్ 1 పూర్తయింది" నొక్కండి.',
      calibratedBadge: 'లూప్ నమోదైంది',
      pocketHint: 'ఫోన్ జేబులో ఉంచుకోండి. ప్రతి రౌండ్ పూర్తికాగానే వైబ్రేషన్ వస్తుంది.',
      stepsCount: 'అడుగులు',
      recalibrate: 'మళ్లీ సెట్ చేయి',
      minStepsWarning: 'దయచేసి కనీసం 10 అడుగులు నడిచిన తర్వాత లూప్ సెట్ చేయండి.',
    },
    japa: {
      eyebrow: 'మంత్ర జపం',
      title: 'కొత్త జపం',
      subtitle: 'ఐచ్ఛికంగా మంత్రం పేరు రాసి జప సంఖ్యను ఎంచుకోండి.',
      mantraLabel: 'మంత్రం పేరు (ఐచ్ఛికం)',
      mantraPlaceholder: 'ఉదా. ఓం నమః శివాయ',
      suggestedLabel: 'సూచించిన లక్ష్యాలు',
      customLabel: 'ఇతర లక్ష్యం',
      startButton: 'జపం ప్రారంభించు',
      errorTarget: 'దయచేసి 1 లేదా అంతకంటే ఎక్కువ జప సంఖ్యను నమోదు చేయండి.',
      fallbackLabel: 'జప సాధన',
      browseLibrary: 'మంత్ర గ్రంథాలయం',
      newMantra: '+ సొంత మంత్రం',
      searchMantras: 'మంత్రాలు లేదా దేవతలు వెతకండి...',
      sanskritTab: 'సంస్కృతం',
      teluguTab: 'తెలుగు',
      englishTab: 'English',
      selectMantra: 'ఎంచుకో',
      createMantraTitle: 'సొంత మంత్రం జోడించు',
      mantraNameField: 'మంత్రం పేరు',
      deityField: 'దేవత (ఐచ్ఛికం)',
      sanskritTextField: 'సంస్కృత పాఠం (ఐచ్ఛికం)',
      teluguTextField: 'తెలుగు పాఠం (ఐచ్ఛికం)',
      englishTextField: 'ఆంగ్ల లిప్యంతరీకరణ (ఐచ్ఛికం)',
      defaultTargetField: 'డిఫాల్ట్ జప సంఖ్య',
      saveMantraButton: 'మంత్రం సేవ్ చేయి',
      mantraStatsSessions: 'సెషన్లు',
      mantraStatsReps: 'సార్లు',
      allMantras: 'అన్నీ',
      favoriteMantras: 'ఇష్టమైనవి',
      customMantras: 'సొంతవి',
      viewMantraCard: 'మంత్ర పాఠం చూడు',
      hideMantraCard: 'దాచు',
    },
    counter: {
      remaining: 'మిగిలినవి',
      tapHintScreen: 'లెక్కించడానికి ఇక్కడ ట్యాప్ చేయండి',
      tapHintBackTap: 'స్క్రీన్ ట్యాప్ లేదా ఫోన్ వెనుక డబుల్-ట్యాప్ చేయండి',
      tapHintPaused: 'విరామం — కొనసాగించడానికి Resume నొక్కండి',
      undo: 'వెనక్కి',
      pause: 'విరామం',
      resume: 'కొనసాగించు',
      reset: 'రీసెట్',
      alwaysOnDim: 'డిమ్ మోడ్',
      exitDim: 'డిమ్ మోడ్ ముగించు',
      pocketMode: 'పాకెట్ మోడ్',
      stopPocketMode: 'పాకెట్ ఆపు',
      pocketModeActive: 'పాకెట్ మోడ్ యాక్టివ్ — స్క్రీన్ లాక్ చేయవచ్చు',
      pocketModeUnavailable:
        'స్క్రీన్ లాక్‌లో లెక్కించే పాకెట్ మోడ్ కోసం Android APK లేదా డెవలప్‌మెంట్ బిల్డ్ అవసరం (Expo Goలో ఇది పనిచేయదు).',
      confirmResetTitle: 'సెషన్ రీసెట్ చేయాలా?',
      confirmResetBody: 'ప్రస్తుత ప్రగతి ప్రారంభ సంఖ్యకు రీసెట్ అవుతుంది.',
      confirmExitTitle: 'సెషన్ వదిలి వెళ్లాలా?',
      confirmExitBody: 'ప్రస్తుత సెషన్ ప్రగతి క్లియర్ అవుతుంది.',
      confirmHomeTitle: 'సెషన్ ఆపి హోమ్‌కు వెళ్లాలా?',
      confirmHomeBody:
        'మీ ప్రస్తుత ప్రగతి సేవ్ చేయబడుతుంది మరియు సెషన్ విరామంలో ఉంటుంది.',
      confirmHomeAction: 'హోమ్‌కు వెళ్ళు',
      completeEyebrow: 'సాధన పూర్తయింది',
      completePradakshina: 'ప్రదక్షిణలు పూర్తయ్యాయి',
      completeJapa: 'జపం పూర్తయింది',
      repeat: 'మళ్లీ చేయి',
      malaSingular: 'మాల',
      malaPlural: 'మాలలు',
      meruReached: 'మేరు పూస చేరారు — మాల పూర్తయింది',
      meruPausedHint: 'మేరు వద్ద విరామం — మాల తిప్పి Resume నొక్కండి',
    },
    history: {
      today: 'ఈరోజు',
      thisMonth: 'ఈ నెల',
      lifetimeJapa: 'మొత్తం జపం',
      lifetimePradakshina: 'మొత్తం ప్రదక్షిణలు',
      completedTitle: 'పూర్తయిన సెషన్లు',
      empty:
        'ఇంకా పూర్తయిన సెషన్లు లేవు. ప్రదక్షిణ లేదా జపం పూర్తి చేసిన తర్వాత ఇక్కడ కనిపిస్తాయి.',
      clearButton: 'క్లియర్',
      confirmClearTitle: 'చరిత్రను క్లియర్ చేయాలా?',
      confirmClearBody:
        'పూర్తయిన అన్ని జపం మరియు ప్రదక్షిణ రికార్డులు మరియు గణాంకాలు శాశ్వతంగా తొలగించబడతాయి.',
      clearConfirm: 'అన్నీ తొలగించు',
    },
    settings: {
      languageTitle: 'భాష / Language',
      languageDesc: 'యాప్ ప్రదర్శన భాషను ఎంచుకోండి.',
      keepAwakeTitle: 'స్క్రీన్ ఆన్‌లో ఉంచు',
      keepAwakeDesc:
        'జపం లేదా ప్రదక్షిణ నడుస్తున్నప్పుడు స్క్రీన్ ఆఫ్ కాకుండా ఉంచండి.',
      backTapTitle: 'ఫోన్ వెనుక డబుల్-ట్యాప్',
      backTapDesc:
        'సెషన్ నడుస్తున్నప్పుడు ఫోన్ వెనుక భాగంలో రెండుసార్లు తట్టి లెక్కించండి.',
      sensitivityTitle: 'ట్యాప్ సున్నితత్వం',
      sensitivityDesc:
        'నడిచేటప్పుడు పొరపాటున కౌంట్ కాకుండా సున్నితత్వాన్ని సర్దుబాటు చేయండి.',
      selected: 'ఎంచుకున్నది',
      low: 'తక్కువ (Low)',
      lowHint: 'గట్టిగా డబుల్-ట్యాప్ అవసరం; నడిచేటప్పుడు ఉత్తమం.',
      medium: 'మధ్యస్థం (Medium)',
      mediumHint: 'రోజువారీ వినియోగానికి సమతుల్య సున్నితత్వం.',
      high: 'ఎక్కువ (High)',
      highHint: 'తేలికపాటి డబుల్-ట్యాప్; కూర్చుని జపం చేయడానికి ఉత్తమం.',
      calibrationTitle: 'లైవ్ కాలిబ్రేషన్',
      calibrationDesc:
        'మీ ఫోన్ మరియు కవర్‌కు తగిన సున్నితత్వాన్ని ఎంచుకోవడానికి ఇక్కడ వెనుక డబుల్-ట్యాప్ పరీక్షించండి.',
      calibrationStart: 'లైవ్ టెస్ట్ ప్రారంభించు',
      calibrationStop: 'టెస్ట్ ఆపు',
      calibrationReset: 'రీసెట్',
      calibrationPeak: 'పీక్ ఇంపల్స్',
      calibrationThreshold: 'పరిమితి',
      calibrationDetectedCount: 'గుర్తించినవి',
      calibrationIdle:
        '"లైవ్ టెస్ట్ ప్రారంభించు" నొక్కి, ఫోన్‌ను సహజంగా పట్టుకుని వెనుక రెండుసార్లు తట్టండి.',
      calibrationListening: 'వింటోంది — ఫోన్ వెనుక రెండుసార్లు తట్టండి',
      calibrationTap1: 'మొదటి ట్యాప్ గుర్తించబడింది — మరోసారి తట్టండి...',
      calibrationDetected: 'డబుల్-ట్యాప్ గుర్తించబడింది!',
      calibrationGyroRejected:
        'కదలిక ఎక్కువగా ఉంది — ఫోన్‌ను స్థిరంగా పట్టుకుని తట్టండి',
      calibrationUnavailable:
        'ఈ పరికరంలో యాక్సిలరోమీటర్ సెన్సార్ అందుబాటులో లేదు.',
      calibrationSwitchHint:
        'సూచన: పరీక్షిస్తున్నప్పుడే పైన Low / Medium / High మార్చి చూడవచ్చు.',
      malaTitle: 'మాల పూసల సంఖ్య',
      malaDesc:
        'ప్రతి మాల వలయం 108 పూసలు లేదా 27 పూసలు లెక్కించాలో ఎంచుకోండి.',
      mala108: '108 పూసలు',
      mala108Hint: 'సంప్రదాయ పూర్తి జపమాల.',
      mala27: '27 పూసలు',
      mala27Hint: 'చిన్న క్వార్టర్-మాల వలయం.',
      meruTitle: 'మేరు పూస ప్రవర్తన',
      meruDesc:
        'ఒక మాల పూర్తయి పై మేరు పూసను చేరినప్పుడు ఏమి జరగాలో ఎంచుకోండి.',
      meruContinue: 'నిరంతరంగా కొనసాగించు',
      meruContinueHint:
        'మాల పూర్తయిన సూచన చూపి తదుపరి మాలను నేరుగా కొనసాగిస్తుంది.',
      meruPause: 'మేరు వద్ద విరామం',
      meruPauseHint:
        'ప్రతి మాల పూర్తయ్యాక విరామం ఇస్తుంది; Resume నొక్కి కొనసాగించవచ్చు.',
      malaHapticTitle: 'మాల పూర్తయినప్పుడు హ్యాప్టిక్',
      malaHapticDesc:
        'ఒక మాల పూర్తయినప్పుడు సున్నితమైన డబుల్-పల్స్ వైబ్రేషన్ ఇస్తుంది.',
      dailyPanchangamReminder: 'దినసరి ఉదయ పంచాంగం (6:00 AM)',
      dailyPanchangamReminderHint:
        'రోజూ ఉదయం 6:00 గంటలకు పంచాంగాన్ని వీక్షించడానికి మరియు వాట్సాప్‌లో షేర్ చేయడానికి గుర్తుచేస్తుంది.',
      notesTitle: 'ఆండ్రాయిడ్ బ్యాక్‌గ్రౌండ్ & బటన్ వివరాలు',
      notesBody:
        '• ప్రస్తుతం యాప్ స్క్రీన్‌పై తెరిచి ఉన్నప్పుడు బ్యాక్-ట్యాప్ పనిచేస్తుంది.\n• స్క్రీన్ లాక్‌లో మరియు వాల్యూమ్ బటన్ కౌంటింగ్ కోసం నేటివ్ ఆండ్రాయిడ్ బిల్డ్ అవసరం.',
    },
    menu: {
      menuTitle: 'స్మరణ మెనూ',
      nityaPoojaTitle: 'నిత్య పూజా విధానం',
      nityaPoojaDesc: 'దశలవారీగా చేయవలసిన దిన పూజా పద్ధతి',
      ashtothramTitle: 'అష్టోత్తర శతనామావళి',
      ashtothramDesc: 'అర్చన మరియు జపానికి 108 నామాలు',
      japaTitle: 'జప కౌంటర్',
      japaDesc: '108 మాల పూసలతో జప సాధన',
      pradakshinaTitle: 'ప్రదక్షిణ కౌంటర్',
      pradakshinaDesc: 'ఆలయ ప్రదక్షిణల లెక్కింపు',
      mantraLibraryTitle: 'మంత్ర గ్రంథాలయం',
      mantraLibraryDesc: 'పవిత్ర మంత్రాల సంగ్రహం',
      panchangamTitle: 'తెలుగు పంచాంగం',
      panchangamDesc: 'దిన పంచాంగం, తిథి & రాహుకాలం',
      historyTitle: 'సాధన చరిత్ర',
      historyDesc: 'రోజువారీ సాధన వివరాలు',
      settingsTitle: 'సెట్టింగ్స్ & కాలిబ్రేషన్',
      settingsDesc: 'మాల సైజు, బ్యాక్-ట్యాప్ సెట్టింగ్స్',
      aboutTitle: 'స్మరణ గురించి',
      aboutDesc:
        'జపం, ప్రదక్షిణ మరియు నిత్య సాధనకు ఆఫ్‌లైన్, గోప్యమైన సాధన సహచరి.',
    },
    nityaPooja: {
      cardBadge: 'నిత్య పూజా విధానం',
      cardTitle: 'నిత్య పూజా విధానం',
      cardDesc:
        'దీపారాధన నుండి హారతి వరకు వరుసగా చేయవలసిన క్రియలు, శ్లోకాలు, మరియు భావార్థాలతో కూడిన పూజా మార్గదర్శిని.',
      title: 'నిత్య పూజా విధానం',
      subtitle: 'ఆంధ్ర సంప్రదాయ దిన పూజా పద్ధతి',
      modeLaghu: 'లఘు పూజ (5 ని॥)',
      modeShodasa: 'షోడశోపచార పూజ (16 ఉపచారాలు)',
      modeLaghuHint: 'రోజువారీ ఉదయపు సమయానికి 11 ముఖ్యమైన ఉపచారాలు',
      modeShodasaHint: 'విశేష పర్వదినాలు & శుక్రవారాలకు సంపూర్ణ 16 ఉపచారాలు',
      stepCount: 'క్రమం',
      actionTitle: 'చేయవలసిన క్రియ',
      mantraTitle: 'శ్లోకం / మంత్రం',
      meaningTitle: 'భావార్థం',
      nextStep: 'తదుపరి క్రియ →',
      prevStep: '← వెనుకకు',
      completePooja: '🪷 పూజ సంపూర్ణం (సమర్పణ)',
      poojaCompletedTitle: 'పూజ సంపూర్ణమయింది!',
      poojaCompletedDesc:
        'భగవదనుగ్రహం మీ కుటుంబానికి ఆయురారోగ్య ఐశ్వర్యాలు మరియు ప్రశాంతతను ప్రసాదించుగాక.',
      poojaDoneButton: 'ముగించి హోమ్‌కు వెళ్ళు',
      selectDeityPrompt: 'పుష్పార్చనకు ఇష్టదేవతను ఎంచుకోండి',
      ashtothramNamesCount: '108 దివ్య నామాలు',
      changeDeity: 'దేవతను మార్చు',
    },
    ashtothram: {
      badge: '108 దివ్య నామాలు',
      title: 'అష్టోత్తర శతనామావళి',
      subtitle:
        'నిత్య పూజ, అర్చన, పుష్పాంజలి మరియు జపం కొరకు 108 దివ్య నామాలు.',
      searchPlaceholder: 'దేవతలను లేదా నామాలను వెతకండి...',
      deitiesCount: '8 దేవతలు',
      namesCount: '108 దివ్య నామాలు',
      startArchana: '108 అర్చన / జపం ప్రారంభించు',
      allDeities: 'అన్ని దేవతలు',
      currentNama: 'నామం',
      viewAllNames: '108 నామాలు చూడండి',
      closeView: 'మూసివేయి',
      cardHomeBadge: '108 దివ్య నామాలు',
      cardHomeTitle: 'అష్టోత్తర శతనామావళి',
      cardHomeDesc:
        'గణేశుడు, శివుడు, వేంకటేశ్వరుడు, లక్ష్మి, హనుమాన్ తదితర దేవతల 108 నామాలను సంస్కృతం, తెలుగు మరియు ఆంగ్లంలో పఠించండి.',
      fontSizeRegular: 'సాధారణం',
      fontSizeLarge: 'పెద్దది',
      fontSizeXLarge: 'మరింత పెద్దది',
      tapToHighlight: 'జప స్థానాన్ని గుర్తించడానికి నామంపై తాకండి',
    },
    panchangam: {
      title: 'తెలుగు పంచాంగం',
      subtitle: 'ఆంధ్రప్రదేశ్ & తెలంగాణ దిన దృక్సిద్ధాంత పంచాంగం',
      today: 'నేడు',
      yesterday: 'నిన్న',
      tomorrow: 'రేపు',
      samvatsara: 'సంవత్సరం',
      ayana: 'ఆయనం',
      ritu: 'ఋతువు',
      masa: 'మాసం',
      paksha: 'పక్షం',
      tithi: 'తిథి',
      nakshatra: 'నక్షత్రం',
      yoga: 'యోగం',
      karana: 'కరణం',
      vaara: 'వారం',
      timingsSection: 'దిన సమయాలు',
      auspiciousTimings: 'శుభ సమయాలు',
      inauspiciousTimings: 'అశుభ సమయాలు',
      rahuKalam: 'రాహుకాలం',
      yamagandam: 'యమగండం',
      gulikaKalam: 'గుళిక కాలం',
      durmuhurtham: 'దుర్ముహూర్తం',
      abhijit: 'అభిజిత్ ముహూర్తం',
      specialDay: 'విశేష పర్వదినం / వ్రతం',
      close: 'మూసివేయి',
      quickHomeHint: 'నేటి పంచాంగం',
      panchangamTab: 'పంచాంగం',
      sankalpamTab: 'సంకల్పం',
      datePickerTitle: 'తెలుగు సంవత్సరం (ఉగాది నుండి ఉగాది)',
      selectDate: 'తేదీ ఎంపిక చేయండి',
      jumpToUgadi: 'ఉగాది ప్రారంభం',
      jumpToToday: 'నేడు',
      jumpToEndYear: 'సంవత్సరాంతం',
      ugadiToUgadiRange: 'ఉగాది నుండి ఉగాది వరకు',
      tradition: 'సంప్రదాయం',
      smartha: 'స్మార్త (శ్రీపరమేశ్వర ప్రీత్యర్థం)',
      vaishnava: 'వైష్ణవ (శ్రీమన్నారాయణ ప్రీత్యర్థం)',
      purpose: 'సంకల్ప ప్రయోజనం',
      poojaPurpose: 'నిత్య పూజ / దేవతార్చన',
      pratahSandhya: 'ప్రాతః సంధ్యావందనం',
      madhyahnikaSandhya: 'మాధ్యాహ్నిక సంధ్యావందనం',
      sayamSandhya: 'సాయం సంధ్యావందనం',
      gayatriJapa: 'గాయత్రీ మహామంత్ర జపం',
      japaPurpose: 'ఇష్టదేవతా జప సాధన',
      gotramLabel: 'గోత్రం (ఐచ్ఛికం)',
      nameLabel: 'పేరు (శర్మ / వర్మ / నామధేయం)',
      includeFamilyLabel: 'కుటుంబ సభ్యులతో (సహకుటుంబస్య)',
      copySankalpam: 'సంకల్పం షేర్ / కాపీ చేయి',
      copiedSankalpam: 'సంకల్పం కాపీ చేయబడింది!',
      bhavarthaTitle: 'సంకల్ప అర్థం (భావార్థం)',
      scriptToggleTe: 'తెలుగు లిపి',
      scriptToggleEn: 'English (IAST)',
      personalDetails: 'గోత్ర నామాలు (ఐచ్ఛికం)',
      personalDetailsHint: 'మీ గోత్రం మరియు పేరుతో సంకల్పాన్ని తయారుచేయండి',
      calendarButton: 'ఉగాది క్యాలెండర్',
      shareWhatsApp: 'వాట్సాప్‌లో పంచాంగం షేర్ చేయండి',
      shareShort: 'షేర్',
      shareSankalpamWhatsApp: 'సంకల్పాన్ని వాట్సాప్‌లో షేర్ చేయండి',
      shareSuccess: 'వాట్సాప్ తెరుస్తోంది...',
    },
    notifications: {
      pradakshinaTitle: 'ప్రదక్షిణ పూర్తయింది',
      japaTitle: 'జపం పూర్తయింది',
      pradakshinaUnit: 'ప్రదక్షిణలు',
      japaUnit: 'సార్లు',
      panchangaReminderTitle: 'నేటి పంచాంగం సిద్ధంగా ఉంది',
      panchangaReminderBody:
        'నేటి తిథి, నక్షత్రం మరియు శుభ సమయాలను వాట్సాప్‌లో కుటుంబంతో షేర్ చేయండి.',
    },
  },
};
