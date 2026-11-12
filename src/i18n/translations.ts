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
    historyTitle: string;
    historyDesc: string;
    settingsTitle: string;
    settingsDesc: string;
    aboutTitle: string;
    aboutDesc: string;
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
  };
  notifications: {
    pradakshinaTitle: string;
    japaTitle: string;
    pradakshinaUnit: string;
    japaUnit: string;
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
      notesTitle: 'Android Background & Button Notes',
      notesBody:
        '• Back-tap detection currently runs while the app is open on screen.\n• Reliable locked-screen detection and hardware volume-button counting require a native Android build (Expo dev client) and foreground-service testing.',
    },
    menu: {
      menuTitle: 'Smarana Menu',
      ashtothramTitle: 'Ashtothram (108 Names)',
      ashtothramDesc: 'Recite and count 108 sacred names for Archana & Japa',
      japaTitle: 'Japa Counter',
      japaDesc: 'Mantra counting with 108 Mala ring & haptics',
      pradakshinaTitle: 'Pradakshina Counter',
      pradakshinaDesc: 'Temple circumambulation counter',
      mantraLibraryTitle: 'Mantra Library',
      mantraLibraryDesc: 'Browse popular and custom sacred mantras',
      historyTitle: 'Practice History',
      historyDesc: 'Review daily and lifetime Sadhana sessions',
      settingsTitle: 'Settings & Calibration',
      settingsDesc: 'Mala size, back-tap sensitivity, language & awake mode',
      aboutTitle: 'About Smarana',
      aboutDesc:
        'Offline-first, privacy-first companion for Japa, Pradakshina and daily Sadhana. No accounts, no data tracking.',
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
    },
    notifications: {
      pradakshinaTitle: 'Pradakshina Complete',
      japaTitle: 'Japa Complete',
      pradakshinaUnit: 'Pradakshinas',
      japaUnit: 'repetitions',
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
      notesTitle: 'ఆండ్రాయిడ్ బ్యాక్‌గ్రౌండ్ & బటన్ వివరాలు',
      notesBody:
        '• ప్రస్తుతం యాప్ స్క్రీన్‌పై తెరిచి ఉన్నప్పుడు బ్యాక్-ట్యాప్ పనిచేస్తుంది.\n• స్క్రీన్ లాక్‌లో మరియు వాల్యూమ్ బటన్ కౌంటింగ్ కోసం నేటివ్ ఆండ్రాయిడ్ బిల్డ్ అవసరం.',
    },
    menu: {
      menuTitle: 'స్మరణ మెనూ',
      ashtothramTitle: 'అష్టోత్తర శతనామావళి (108)',
      ashtothramDesc: 'అర్చన మరియు జపం కొరకు 108 దివ్య నామాలు',
      japaTitle: 'జప కౌంటర్',
      japaDesc: '108 పూసల మాల మరియు ప్రశాంతమైన హ్యాప్టిక్స్',
      pradakshinaTitle: 'ప్రదక్షిణ కౌంటర్',
      pradakshinaDesc: 'ఆలయ ప్రదక్షిణలను సులభంగా ట్రాక్ చేయండి',
      mantraLibraryTitle: 'మంత్ర గ్రంథాలయం',
      mantraLibraryDesc: 'ప్రసిద్ధ మరియు సొంత మంత్రాల సంగ్రహం',
      historyTitle: 'సాధన చరిత్ర',
      historyDesc: 'ఈరోజు మరియు మొత్తం సాధన వివరాలు',
      settingsTitle: 'సెట్టింగ్స్ & కాలిబ్రేషన్',
      settingsDesc: 'మాల సైజు, బ్యాక్-ట్యాప్ సున్నితత్వం, భాష',
      aboutTitle: 'స్మరణ గురించి',
      aboutDesc:
        'జపం, ప్రదక్షిణ మరియు నిత్య సాధనకు ఆఫ్‌లైన్, గోప్యమైన సాధన సహచరి. ఇంటర్నెట్ లేదా ఖాతాలు అవసరం లేదు.',
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
    },
    notifications: {
      pradakshinaTitle: 'ప్రదక్షిణ పూర్తయింది',
      japaTitle: 'జపం పూర్తయింది',
      pradakshinaUnit: 'ప్రదక్షిణలు',
      japaUnit: 'సార్లు',
    },
  },
};
