export type PoojaMode = 'laghu' | 'shodasa';

export interface PoojaStep {
  id: string;
  order: number; // 1 to 16
  isLaghu: boolean; // included in 5-min Laghu pooja
  icon: string;
  title: {
    telugu: string;
    english: string;
  };
  subtitle?: {
    telugu: string;
    english: string;
  };
  action: {
    telugu: string;
    english: string;
  };
  mantra: {
    telugu: string;
    english: string;
  };
  meaning: {
    telugu: string;
    english: string;
  };
  specialType?: 'sankalpam' | 'ashtothram' | 'standard';
}

export const NITYA_POOJA_STEPS: PoojaStep[] = [
  {
    id: 'deeparadhana',
    order: 1,
    isLaghu: true,
    icon: '🪔',
    title: {
      telugu: 'దీపారాధన',
      english: 'Deepa Prajvalana (Lighting Lamp)',
    },
    subtitle: {
      telugu: 'పూజా మందిరంలో దీపం వెలిగించుట',
      english: 'Igniting the sacred lamp at the altar',
    },
    action: {
      telugu:
        'కాటన్ వత్తితో ఆవు నెయ్యి లేదా నువ్వుల నూనెతో దీపం వెలిగించి, రెండు చేతులు జోడించి నమస్కరించండి.',
      english:
        'Light the sacred lamp with pure cow ghee or sesame oil with a cotton wick, and fold your hands in reverence.',
    },
    mantra: {
      telugu:
        'దీపజ్యోతిః పరబ్రహ్మ దీపజ్యోతిర్జనార్దనః |\nదీపో హరతు మే పాపం దీపజ్యోతిర్నమోऽస్తు తే ||\n\nశుభం కరోతి కల్యాణమారోగ్యం ధనసంపదః |\nశత్రుబుద్ధివినాశాయ దీపజ్యోతిర్నమోऽస్తు తే ||',
      english:
        'Deepajyotih parabrahma deepajyotir-janardanah |\nDeepo haratu me papam deepajyotir-namo\'stu te ||\n\nShubham karoti kalyanam-aarogyam dhana-sampadah |\nShatrubuddhi-vinaashaaya deepajyotir-namo\'stu te ||',
    },
    meaning: {
      telugu:
        'ఈ దీపజ్యోతి పరబ్రహ్మ స్వరూపం. ఇది సమస్త అజ్ఞానాన్ని, పాపాలను తొలగించి, శుభం, ఆరోగ్యం, మరియు సద్బుద్ధిని ప్రసాదించుగాక.',
      english:
        'The sacred flame represents the Supreme Divine. May it dispel all darkness and negativity, bestowing health, auspiciousness, and clear wisdom.',
    },
    specialType: 'standard',
  },
  {
    id: 'achamanam',
    order: 2,
    isLaghu: true,
    icon: '💧',
    title: {
      telugu: 'ఆచమనం',
      english: 'Achamanam (Inner Purification)',
    },
    subtitle: {
      telugu: 'తీర్థ ప్రాశనం ద్వారా శుద్ధి',
      english: 'Three sacred sips for internal purity',
    },
    action: {
      telugu:
        'ఉద్ధరిణె (చెంచా)తో కుడిచేతి అరచేతిలో కొద్దిగా జలం తీసుకుని, కేశవ, నారాయణ, మాధవ నామాలతో మూడుసార్లు స్వీకరించండి.',
      english:
        'Take a small sip of pure water in the palm of your right hand using the spoon, sipping with Keshavaya, Narayanaya, and Madhavaya namas.',
    },
    mantra: {
      telugu:
        'ఓం కేశవాయ స్వాహా |\nఓం నారాయణాయ స్వాహా |\nఓం మాధవాయ స్వాహా |\n\n(ఓం గోవిందాయ నమః, విష్ణవే నమః, మధుసూదనాయ నమః, త్రివిక్రమాయ నమః, వామనాయ నమః, శ్రీధరాయ నమః, హృషీకేశాయ నమః, పద్మనాభాయ నమః, దామోదరాయ నమః)',
      english:
        'Om Keshavaya Svaha |\nOm Narayanaya Svaha |\nOm Madhavaya Svaha |\n\n(Om Govindaya Namah, Vishnave Namah, Madhusudanaya Namah, Trivikramaya Namah, Vamanaya Namah, Sridharaya Namah, Hrishikeshaya Namah, Padmanabhaya Namah, Damodaraya Namah)',
    },
    meaning: {
      telugu:
        'భగవంతుని పవిత్ర నామాలతో జలాన్ని స్వీకరించడం వల్ల దేహం, వాక్కు మరియు మనస్సు శుద్ధి చెందుతాయి.',
      english:
        'Sipping sacred water while chanting the Lord\'s names purifies the physical body, speech, and inner mind before pooja.',
    },
    specialType: 'standard',
  },
  {
    id: 'ghantanadam',
    order: 3,
    isLaghu: false,
    icon: '🔔',
    title: {
      telugu: 'ఘంటానాదం & భూతోచ్ఛాటన',
      english: 'Ghanta Vadan (Ringing the Bell)',
    },
    subtitle: {
      telugu: 'దివ్య శక్తుల ఆహ్వానం',
      english: 'Inviting divine vibrations & clearing space',
    },
    action: {
      telugu:
        'ఎడమచేత్తో లేదా కుడిచేత్తో పూజా గంటను మధురంగా మ్రోగిస్తూ, మందిరంలోకి దివ్య శక్తులను ఆహ్వానించండి.',
      english:
        'Gently ring the pooja bell to awaken positive spiritual vibrations and clear negative thoughts from the space.',
    },
    mantra: {
      telugu:
        'ఆగమార్థం తు దేవానాం గమనార్థం తు రక్షసాం |\nకుర్వే ఘంటారవం తత్ర దేవతాహ్వాన లాంఛనమ్ ||',
      english:
        'Aagamaartham tu devaanaam gamanaartham tu rakshasaam |\nKurve ghantaaravam tatra devataahvaana laanchanam ||',
    },
    meaning: {
      telugu:
        'దేవతా శక్తులు మందిరంలోకి విచ్చేయడానికి మరియు ప్రతికూల శక్తులు తొలగిపోవడానికి ఈ పవిత్ర ఘంటానాదం చేస్తున్నాను.',
      english:
        'I ring this bell to welcome divine forces into our home altar and to dispel all negative and disturbing energies.',
    },
    specialType: 'standard',
  },
  {
    id: 'sankalpam',
    order: 4,
    isLaghu: true,
    icon: '📜',
    title: {
      telugu: 'ప్రాణాయామం & దిన సంకల్పం',
      english: 'Pranayama & Daily Sankalpam',
    },
    subtitle: {
      telugu: 'నేటి పంచాంగ తిథి మరియు గోత్ర నామాలతో సంకల్పం',
      english: 'Sacred intention set with today\'s Panchangam',
    },
    action: {
      telugu:
        'కొద్దిగా అక్షతలు, పువ్వులను కుడిచేతిలో ఉంచుకుని, క్రింద కనిపించే నేటి దిన సంకల్పాన్ని మనసారా పఠించండి. ముగిశాక ఈశాన్య దిశలో ఉంచండి.',
      english:
        'Hold some sacred rice (akshatas) and a flower in your right palm, recite today\'s personalized Sankalpam below, then place them gently in the plate.',
    },
    mantra: {
      telugu: 'శ్రీ శుభే శోభనే ముహూర్తే శ్రీమహావిష్ణోరాజ్ఞయా ప్రవర్తమానస్య...',
      english: 'Sri Shubhe Shobhane Muhurte Sri Maha-Vishnor-Aajnaya...',
    },
    meaning: {
      telugu:
        'కాలం, ప్రదేశం, మన గోత్ర నామాలు మరియు కుటుంబ శ్రేయస్సును స్మరిస్తూ భగవంతుని ప్రీత్యర్థం ఈ పూజను అర్పిస్తున్నామని మనస్సును కేంద్రీకరించడం.',
      english:
        'Affirming our presence in sacred cosmic time and dedicating this daily worship for the spiritual and physical well-being of our family.',
    },
    specialType: 'sankalpam',
  },
  {
    id: 'kalashapooja',
    order: 5,
    isLaghu: false,
    icon: '🏺',
    title: {
      telugu: 'కలశ పూజ (జల ప్రోక్షణ)',
      english: 'Kalasha Pooja (Holy Waters)',
    },
    subtitle: {
      telugu: 'పూజా జలాన్ని పవిత్ర నదులుగా భావించుట',
      english: 'Invoking sacred rivers into the water vessel',
    },
    action: {
      telugu:
        'పూజా జలపాత్ర (పంచపాత్ర) పై కుడిచేతిని ఉంచి, శ్లోకం చదివి, పువ్వుతో ఆ జలాన్ని పూజా వస్తువులపై మరియు మీపై చల్లుకోండి.',
      english:
        'Place your right palm over the water vessel, chant the mantra to invoke sacred rivers, and sprinkle a few drops onto pooja items and yourself.',
    },
    mantra: {
      telugu:
        'గంగే చ యమునే చైవ గోదావరి సరస్వతి |\nనర్మదే సింధు కావేరి జలేऽస్మిన్ సన్నిధిం కురు ||',
      english:
        'Gange cha Yamune chaiva Godavari Saraswati |\nNarmade Sindhu Kaveri jale\'smin sannidhim kuru ||',
    },
    meaning: {
      telugu:
        'గంగ, యమున, గోదావరి, సరస్వతి, నర్మద, సింధు, కావేరి పవిత్ర నదులు ఈ జలంలో ప్రవేశించి దీనిని తీర్థ సమానంగా చేయుగాక.',
      english:
        'May the sacred rivers Ganga, Yamuna, Godavari, Saraswati, Narmada, Sindhu, and Kaveri sanctify this water for divine service.',
    },
    specialType: 'standard',
  },
  {
    id: 'ganapathi',
    order: 6,
    isLaghu: true,
    icon: '🐘',
    title: {
      telugu: 'గణపతి ప్రార్థన',
      english: 'Ganapathi Prarthana (Removing Obstacles)',
    },
    subtitle: {
      telugu: 'విఘ్నేశ్వరుని స్మరణ',
      english: 'Salutations to Lord Ganesha',
    },
    action: {
      telugu:
        'వినాయకుని రూపం లేదా విగ్రహం వద్ద అక్షతలు, పువ్వు సమర్పించి, ఏ ఆటంకాలు కలగకుండా పూజ సాగాలని నమస్కరించండి.',
      english:
        'Offer akshatas and a flower at Lord Ganesha\'s feet, praying for the peaceful and obstacle-free completion of your daily worship.',
    },
    mantra: {
      telugu:
        'శుక్లాంబరధరం విష్ణుం శశివర్ణం చతుర్భుజమ్ |\nప్రసన్నవదనం ధ్యాయేత్ సర్వవిఘ్నోపశాంతయే ||\n\nవక్రతుండ మహాకాయ సూర్యకోటి సమప్రభ |\nనిర్విఘ్నం కురు మే దేవ సర్వకార్యేషు సర్వదా ||',
      english:
        'Shuklaambaradharam Vishnum shashivarnam chaturbhujam |\nPrasanna-vadanam dhyaayet sarva-vighnopashaantaye ||\n\nVakratunda mahaakaaya sooryakoti samaprabha |\nNirvighnam kuru me deva sarva-kaaryeshu sarvadaa ||',
    },
    meaning: {
      telugu:
        'తెల్లని వస్త్రాలు ధరించి, చంద్రుని వంటి ప్రశాంత ముఖం కలిగిన విఘ్నేశ్వరునికి నమస్కరిస్తున్నాను. నా సమస్త పనులను నిర్విఘ్నంగా నెరవేర్చుము.',
      english:
        'We meditate upon the all-pervading, serene Lord Ganesha to dissolve all obstacles and illuminate our path with auspicious success.',
    },
    specialType: 'standard',
  },
  {
    id: 'dhyanam_avahana',
    order: 7,
    isLaghu: false,
    icon: '🪷',
    title: {
      telugu: 'ఇష్టదేవతా ధ్యానం & ఆవాహన',
      english: 'Dhyanam & Avahanam (Welcoming the Deity)',
    },
    subtitle: {
      telugu: 'మందిర పీఠంపైకి స్వాగతం',
      english: 'Inviting the Beloved Deity into the altar',
    },
    action: {
      telugu:
        'మీ ఇష్టదేవతను మనసారా భావించి, నమస్కార ముద్రతో అక్షతలు, పువ్వులను స్వామి/అమ్మవారి పీఠంపై సమర్పించండి.',
      english:
        'Hold hands in prayer, envision your chosen deity with love and devotion, and offer akshatas and flowers as a sacred welcome seat.',
    },
    mantra: {
      telugu:
        'శ్రీ ఇష్టదేవతాయై నమః ధ్యాయామి |\nశ్రీ ఇష్టదేవతాయై నమః ఆవాహయామి |\nనవరత్న ఖచిత దివ్య స్వర్ణ సింహాసనార్థం అక్షతాన్ సమర్పయామి ||',
      english:
        'Sri Ishta-Devataayai Namah Dhyaayaami |\nSri Ishta-Devataayai Namah Aavaahayaami |\nNavaratna-khachita divya svarna simhaasanaartham akshataan samarpayaami ||',
    },
    meaning: {
      telugu:
        'భగవంతుని నా హృదయ మందిరంలో మరియు ఈ పూజా పీఠంపై ప్రేమతో ఆహ్వానిస్తూ రత్నఖచిత సింహాసనాన్ని సమర్పిస్తున్నాను.',
      english:
        'With deep reverence, I invite the Supreme Deity into our home altar, offering a golden, jewel-bedecked throne of devotion.',
    },
    specialType: 'standard',
  },
  {
    id: 'upachara_snanam',
    order: 8,
    isLaghu: false,
    icon: '✨',
    title: {
      telugu: 'పాద్యం, అర్ఘ్యం & స్నానం',
      english: 'Padyam, Arghyam & Snanam (Sacred Bath)',
    },
    subtitle: {
      telugu: 'అతిథి సత్కార జల సమర్పణ',
      english: 'Offering fresh water for feet, hands, and bath',
    },
    action: {
      telugu:
        'ఉద్ధరిణెతో స్వచ్ఛమైన జలాన్ని తీసుకుని పాత్ర (అర్ఘ్యపాత్ర) లో నాలుగుసార్లు సమర్పించండి.',
      english:
        'Using the pooja spoon, offer a spoonful of pure water into the arghya receptacle for each invocation of holy bath.',
    },
    mantra: {
      telugu:
        'శ్రీ ఇష్టదేవతాయై నమః పాదయోః పాద్యం సమర్పయామి |\nహస్తయోః అర్ఘ్యం సమర్పయామి |\nముఖే శుద్ధాచమనీయం సమర్పయామి |\nశుద్ధోదక స్నానం సమర్పయామి ||',
      english:
        'Sri Ishta-Devataayai Namah Paadayoh Paadyam Samarpayaami |\nHastayoh Arghyam Samarpayaami |\nMukhe Shuddhaachamaneeyam Samarpayaami |\nShuddhodaka Snaanam Samarpayaami ||',
    },
    meaning: {
      telugu:
        'దివ్య అతిథిగా విచ్చేసిన భగవంతునికి పాద ప్రక్షాళన, హస్త ప్రక్షాళన మరియు పవిత్ర జల స్నానాన్ని సమర్పిస్తున్నాను.',
      english:
        'Welcoming the Divine with reverent hospitality—offering fresh water for holy feet, hands, sipping, and a pure sanctifying bath.',
    },
    specialType: 'standard',
  },
  {
    id: 'vastram_yajnopaveetham',
    order: 9,
    isLaghu: false,
    icon: '🧣',
    title: {
      telugu: 'వస్త్రం & యజ్ఞోపవీతం',
      english: 'Vastram & Yajnopaveetham (Sacred Attire)',
    },
    subtitle: {
      telugu: 'వస్త్రార్పణ',
      english: 'Offering sacred cloth and thread',
    },
    action: {
      telugu:
        'దూదితో చేసిన వస్త్రం లేదా అక్షతలను స్వామి/అమ్మవారి వద్ద సమర్పించండి.',
      english:
        'Offer a small piece of sacred cotton vastram or sacred akshatas to the deity.',
    },
    mantra: {
      telugu:
        'శ్రీ ఇష్టదేవతాయై నమః వస్త్రార్థం అక్షతాన్ సమర్పయామి |\nయజ్ఞోపవీతార్థం అక్షతాన్ సమర్పయామి ||',
      english:
        'Sri Ishta-Devataayai Namah Vastraartham Akshataan Samarpayaami |\nYajnopaveetaartham Akshataan Samarpayaami ||',
    },
    meaning: {
      telugu:
        'భగవంతునికి పవిత్ర వస్త్రాన్ని మరియు జ్ఞాన ప్రతీక అయిన యజ్ఞోపవీతాన్ని సమర్పిస్తున్నాను.',
      english:
        'I offer auspicious attire and the sacred thread of wisdom to the Lord.',
    },
    specialType: 'standard',
  },
  {
    id: 'gandham_kumkuma',
    order: 10,
    isLaghu: true,
    icon: '🟡',
    title: {
      telugu: 'గంధం & కుంకుమ సమర్పణ',
      english: 'Gandham & Kumkuma (Sandalwood & Vermilion)',
    },
    subtitle: {
      telugu: 'సుగంధ చందన తిలకం',
      english: 'Adorning with cooling sandalwood and kumkuma',
    },
    action: {
      telugu:
        'ఉంగరపు వేలితో కొద్దిగా గంధాన్ని మరియు కుంకుమను స్వామి/అమ్మవారి విగ్రహానికి లేదా చిత్రపటానికి అలంకరించండి.',
      english:
        'Using your ring finger, gently apply cool fragrant sandalwood paste and auspicious red kumkuma to the deity.',
    },
    mantra: {
      telugu:
        'శ్రీ ఇష్టదేవతాయై నమః దివ్య పరిమళ శ్రీగంధం సమర్పయామి |\nహరిద్రా కుంకుమం చ సమర్పయామి ||\n\nగంధద్వారాం దురాధర్షాం నిత్యపుష్టాం కరీషిణీమ్ |\nఈశ్వరీం సర్వభూతానాం తామిహోపహ్వయే శ్రియమ్ ||',
      english:
        'Sri Ishta-Devataayai Namah Divya Parimala Sreegandham Samarpayaami |\nHaridraa Kumkumam Cha Samarpayaami ||\n\nGandhadvaaraam duraadharshaam nitya-pushtaam kareeshineem |\nEeshvareem sarva-bhootaanaam taam-ihopahvaye shriyam ||',
    },
    meaning: {
      telugu:
        'చందనం మనస్సును ప్రశాంతపరుస్తుంది; కుంకుమ మంగళకరమైన దివ్యతేజస్సును సూచిస్తుంది.',
      english:
        'Fragrant sandalwood brings serene calmness to the mind, while sacred kumkuma invokes divine radiance and auspiciousness.',
    },
    specialType: 'standard',
  },
  {
    id: 'pushparchana',
    order: 11,
    isLaghu: true,
    icon: '🌸',
    title: {
      telugu: 'పుష్పార్చన / 108 దివ్య నామావళి',
      english: 'Pushparchana (108 Divine Names Offering)',
    },
    subtitle: {
      telugu: 'తాజా పుష్పాలతో అష్టోత్తర శతనామ పూజ',
      english: 'Offering flowers with the 108 Sacred Names',
    },
    action: {
      telugu:
        'తాజా పూలతో లేదా అక్షతలతో మీ ఇష్టదేవత 108 నామాలను పఠిస్తూ ప్రతి నామానికి ఒక పువ్వును సమర్పించండి.',
      english:
        'Offer fragrant flowers or flower petals at the deity\'s feet with each divine name from the 108 Ashtottaram catalog below.',
    },
    mantra: {
      telugu:
        'శ్రీ ఇష్టదేవతాయై నమః నానావిధ పరిమళ పత్ర పుష్పాణి సమర్పయామి |\nఅథ అష్టోత్తర శతనామ పూజాం సమర్పయామి ||',
      english:
        'Sri Ishta-Devataayai Namah Naanaavidha Parimala Patra Pushpaani Samarpayaami |\nAtha Ashtottara Shatanaama Poojaam Samarpayaami ||',
    },
    meaning: {
      telugu:
        'పువ్వుల సహజ సుగంధం మరియు మృదుత్వంతో కూడిన నామస్మరణ మనస్సులోని భక్తిభావాన్ని ప్రస్ఫుటపరుస్తుంది.',
      english:
        'Chanting the 108 divine names while offering blossoms channels deep mental focus, gratitude, and surrender.',
    },
    specialType: 'ashtothram',
  },
  {
    id: 'dhoopam',
    order: 12,
    isLaghu: true,
    icon: '💨',
    title: {
      telugu: 'ధూపం సమర్పణ',
      english: 'Dhoopam (Fragrant Incense)',
    },
    subtitle: {
      telugu: 'అగరుబత్తులు చూపించుట',
      english: 'Waving natural fragrant incense',
    },
    action: {
      telugu:
        'వెలిగించిన అగరుబత్తులను కుడిచేతితో పట్టుకుని, భగవంతుని ఎదుట మూడుసార్లు సవ్యదిశలో గుండ్రంగా తిప్పండి.',
      english:
        'Hold the lit incense stick with your right hand and circle it clockwise three times before the deity.',
    },
    mantra: {
      telugu:
        'వనస్పతిరసోద్భూతో గంధాఢ్యో గంధ ఉత్తమః |\nఆఘ్రేయః సర్వదేవానాం ధూపోऽయం ప్రతిగృహ్యతామ్ ||\nశ్రీ ఇష్టదేవతాయై నమః ధూపం ఆఘ్రాపయామి ||',
      english:
        'Vanaspati-rasodbhooto gandhaadhyo gandha uttamah |\nAaghreyah sarva-devaanaam dhoopo\'yam pratigrihyataam ||\nSri Ishta-Devataayai Namah Dhoopam Aaghraapayaami ||',
    },
    meaning: {
      telugu:
        'వనమూలికల సువాసనతో కూడిన ధూపం పరిసరాలను పవిత్రం చేసి, భక్తి భావాన్ని నింపుతుంది.',
      english:
        'The natural herbal fragrance cleanses the atmospheric environment and elevates conscious awareness.',
    },
    specialType: 'standard',
  },
  {
    id: 'deepam_darshanam',
    order: 13,
    isLaghu: true,
    icon: '🕯️',
    title: {
      telugu: 'దీపం దర్శనం',
      english: 'Deepam Darshanam (Offering Light)',
    },
    subtitle: {
      telugu: 'జ్యోతిని సమర్పించుట',
      english: 'Presenting the flame to the deity',
    },
    action: {
      telugu:
        'చిన్న నేతి దీపాన్ని లేదా వత్తిని స్వామి/అమ్మవారి ముందు గౌరవంగా చూపించండి.',
      english:
        'Present the illuminated ghee wick or lamp gently towards the altar.',
    },
    mantra: {
      telugu:
        'సాజ్యం త్రివర్తిసంయుక్తం వహ్నినా యోజితం మయా |\nగృహాణ మంగళం దీపం త్రైలోక్య తిమిరాపహమ్ ||\nశ్రీ ఇష్టదేవతాయై నమః దీపం దర్శయామి ||',
      english:
        'Saajyam trivarti-samyuktam vahninaa yojitam mayaa |\nGrihaana mangalam deepam trailokya timiraapaham ||\nSri Ishta-Devataayai Namah Deepam Darshayaami ||',
    },
    meaning: {
      telugu:
        'మూడు లోకాల అంధకారాన్ని తొలగించే పరమజ్యోతిని నమస్కరిస్తూ భగవంతునికి సమర్పిస్తున్నాను.',
      english:
        'Offering the sacred light that illuminates the universe and dissolves the veil of inner ignorance.',
    },
    specialType: 'standard',
  },
  {
    id: 'naivedyam',
    order: 14,
    isLaghu: true,
    icon: '🍌',
    title: {
      telugu: 'నైవేద్యం సమర్పణ',
      english: 'Naivedyam (Sacred Food Offering)',
    },
    subtitle: {
      telugu: 'పండ్లు, పాలు లేదా భోజనం సమర్పించుట',
      english: 'Offering fruits, milk, jaggery, or food',
    },
    action: {
      telugu:
        'నైవేద్య పళ్ళెం ముందు కొద్దిగా జలాన్ని చుట్టూ ప్రోక్షించి, కుడిచేతి వేళ్ళతో "ఓం ప్రాణాయ స్వాహా..." అంటూ ఆరాధన చేయండి.',
      english:
        'Sprinkle a drop of water around the food offering, and with your right hand gesture gently inward while chanting the Pancha Prana mantras.',
    },
    mantra: {
      telugu:
        'ఓం భూర్భువస్సువః | తత్సవితుర్వరేణ్యం భర్గో దేవస్య ధీమహి ధియో యో నః ప్రచోదయాత్ ||\nసత్యం త్వర్తేన పరిషించామి |\n\nఓం ప్రాణాయ స్వాహా |\nఓం అపానాయ స్వాహా |\nఓం వ్యానాయ స్వాహా |\nఓం ఉదానాయ స్వాహా |\nఓం సమానాయ స్వాహా |\nఓం బ్రహ్మణే స్వాహా ||\nశ్రీ ఇష్టదేవతాయై నమః నైవేద్యం సమర్పయామి ||',
      english:
        'Om Bhoor-Bhuvas-Suvah | Tat-Savitur-Varenyam Bhargo Devasya Dheemahi Dhiyo Yo Nah Prachodayaat ||\nSatyam Tvartena Parishinchaami |\n\nOm Praanaaya Svaahaa |\nOm Apaanaaya Svaahaa |\nOm Vyaanaaya Svaahaa |\nOm Udaanaaya Svaahaa |\nOm Samaanaaya Svaahaa |\nOm Brahmane Svaahaa ||\nSri Ishta-Devataayai Namah Naivedyam Samarpayaami ||',
    },
    meaning: {
      telugu:
        'మనకు ఆహారాన్ని, ప్రాణాన్ని ప్రసాదించిన పరమాత్మకు సంపూర్ణ కృతజ్ఞతతో ఈ ప్రసాదాన్ని సమర్పిస్తున్నాను.',
      english:
        'Offering pure sustenance with deep gratitude to the Supreme Provider who sustains life and all vital energies.',
    },
    specialType: 'standard',
  },
  {
    id: 'harati',
    order: 15,
    isLaghu: true,
    icon: '🔥',
    title: {
      telugu: 'తాంబూలం & మంగళ హారతి',
      english: 'Tamboolam & Mangala Harati (Camphor Flame)',
    },
    subtitle: {
      telugu: 'కర్పూర నీరాజనం',
      english: 'Sacred camphor flame with temple bell',
    },
    action: {
      telugu:
        'తాంబూలం సమర్పించి, కర్పూరం వెలిగించి, గంట వాయిస్తూ స్వామివారి ఎదుట మూడుసార్లు సవ్యదిశలో తిప్పండి. అనంతరం చేతులతో హారతి వెలుగును కళ్ళకు అద్దుకోండి.',
      english:
        'Offer betel leaves or fruit, light the camphor, gently ring the bell while circling the flame three times, then take the warmth to your eyes.',
    },
    mantra: {
      telugu:
        'పూగీఫలసమాయుక్తం నాగవల్లీదళైర్యుతమ్ |\nతాంబూలం ప్రతిగృహ్ణీష్వ పూజితం పరమేశ్వర ||\n\nకర్పూర గౌరం కరుణావతారం సంసారసారం భుజగేంద్రహారమ్ |\nసదా వసంతం హృదయారవిందే భవం భవానీసహితం నమామి ||\nశ్రీ ఇష్టదేవతాయై నమః ఆనంద కర్పూర మంగళ నీరాజనం సమర్పయామి ||',
      english:
        'Poogee-phala-samaayuktam naagavallee-dalair-yutam |\nTaamboolam pratigrihneeshva poojitam parameshvara ||\n\nKarpoora gauram karunaavataaram samsaara-saaram bhujagendra-haaram |\nSadaa vasantam hridayaaravinde bhavam bhavaanee-sahitam namaami ||\nSri Ishta-Devataayai Namah Aananda Karpoora Mangala Neeraajanam Samarpayaami ||',
    },
    meaning: {
      telugu:
        'కర్పూరం కరిగిపోతూ ఎటువంటి మసిని మిగల్చనట్లే, మన అహంకారం కూడా భగవద్భక్తిలో కరిగి పవిత్రంగా మారాలి.',
      english:
        'Just as camphor burns cleanly leaving no residue, may our ego dissolve completely in the radiant light of divine grace.',
    },
    specialType: 'standard',
  },
  {
    id: 'pradakshina_samarpana',
    order: 16,
    isLaghu: true,
    icon: '🙏',
    title: {
      telugu: 'ఆత్మప్రదక్షిణ, నమస్కారం & సమర్పణ',
      english: 'Pradakshina, Namaskaram & Samarpana',
    },
    subtitle: {
      telugu: 'పూజా ఫల సమర్పణ',
      english: 'Circumambulation, prostration & final surrender',
    },
    action: {
      telugu:
        'నిలబడి సవ్యదిశలో మూడుసార్లు ఆత్మప్రదక్షిణ చేసి, సాష్టాంగ లేదా పంచాంగ నమస్కారం చేయండి. చేతులు జోడించి పూజా ఫలాన్ని ఈశ్వరునికి అర్పించండి.',
      english:
        'Stand up, turn clockwise three times in Atma-Pradakshina, offer reverent prostration (Namaskaram), and dedicate all pooja fruit to the Supreme.',
    },
    mantra: {
      telugu:
        'యానికాని చ పాపాని జన్మాంతరకృతాని చ |\nతాని తాని ప్రణశ్యంతి ప్రదక్షిణ పదే పదే ||\n\nకాయేన వాచా మనసేంద్రియైర్వా బుద్ధ్యాత్మనా వా ప్రకృతేః స్వభావాత్ |\nకరోమి యద్యత్ సకలం పరస్మై నారాయణాయేతి సమర్పయామి ||\n\nశ్రీ కృష్ణార్పణమస్తు | సర్వం శ్రీపరమేశ్వరార్పణమస్తు ||',
      english:
        'Yaani kaani cha paapaani janmaantara-kritaani cha |\nTaani taani pranashyanti pradakshina pade pade ||\n\nKaayena vaachaa manasendriyair-vaa buddhyaatmanaa vaa prakriteh svabhaavaat |\nKaromi yadyat sakalam parasmai naaraayanaayeti samarpayaami ||\n\nSri Krishnaarpanamastu | Sarvam Sri Parameshvaraarpanamastu ||',
    },
    meaning: {
      telugu:
        'దేహం, మాట, మనస్సు ద్వారా నేను చేసిన సమస్త కర్మలను శ్రీమన్నారాయణునికి/పరమేశ్వరునికి సమర్పిస్తున్నాను. పూజ సంపూర్ణమయింది.',
      english:
        'Whatever has been done through body, speech, mind, senses, or intellect is wholly surrendered to the Supreme Divine. Pooja is complete.',
    },
    specialType: 'standard',
  },
];

/**
 * Filter steps based on selected mode:
 * - 'laghu': 5-minute essential steps (10 steps)
 * - 'shodasa': Full traditional 16 Upacharas (16 steps)
 */
export function getPoojaStepsForMode(mode: PoojaMode): PoojaStep[] {
  if (mode === 'laghu') {
    return NITYA_POOJA_STEPS.filter((s) => s.isLaghu);
  }
  return NITYA_POOJA_STEPS;
}
