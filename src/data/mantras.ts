import type { MantraEntry } from '../types/practice';

export const BUILT_IN_MANTRAS: Omit<MantraEntry, 'isFavorite'>[] = [
  {
    id: 'builtin-om-namah-shivaya',
    name: 'Om Namah Shivaya',
    deity: 'Shiva',
    textSanskrit: 'ॐ नमः शिवाय',
    textTelugu: 'ఓం నమః శివాయ',
    textEnglish: 'Om Namah Shivaya',
    defaultTarget: 108,
    isBuiltIn: true,
  },
  {
    id: 'builtin-gayatri-mantra',
    name: 'Gayatri Mantra',
    deity: 'Savitur · Gayatri',
    textSanskrit:
      'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
    textTelugu:
      'ఓం భూర్భువస్సువః తత్సవితుర్వరేణ్యం భర్గో దేవస్య ధీమహి ధియో యో నః ప్రచోదయాత్',
    textEnglish:
      'Om Bhur Bhuvah Svah Tat Savitur Varenyam Bhargo Devasya Dhimahi Dhiyo Yo Nah Prachodayat',
    defaultTarget: 108,
    isBuiltIn: true,
  },
  {
    id: 'builtin-maha-mrityunjaya',
    name: 'Maha Mrityunjaya Mantra',
    deity: 'Shiva · Tryambaka',
    textSanskrit:
      'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय माऽमृतात्',
    textTelugu:
      'ఓం త్ర్యంబకం యజామహే సుగంధిం పుష్టివర్ధనమ్ ఉర్వారుకమివ బంధనాన్ మృత్యోర్ముక్షీయ మాఽమృతాత్',
    textEnglish:
      "Om Tryambakam Yajamahe Sugandhim Pushtivardhanam Urvarukamiva Bandhanan Mrityor Mukshiya Ma'mritat",
    defaultTarget: 108,
    isBuiltIn: true,
  },
  {
    id: 'builtin-om-namo-narayanaya',
    name: 'Om Namo Narayanaya',
    deity: 'Vishnu · Narayana',
    textSanskrit: 'ॐ नमो नारायणाय',
    textTelugu: 'ఓం నమో నారాయణాయ',
    textEnglish: 'Om Namo Narayanaya',
    defaultTarget: 108,
    isBuiltIn: true,
  },
  {
    id: 'builtin-vasudevaya',
    name: 'Om Namo Bhagavate Vasudevaya',
    deity: 'Vishnu · Krishna',
    textSanskrit: 'ॐ नमो भगवते वासुदेवाय',
    textTelugu: 'ఓం నమో భగవతే వాసుదేవాయ',
    textEnglish: 'Om Namo Bhagavate Vasudevaya',
    defaultTarget: 108,
    isBuiltIn: true,
  },
  {
    id: 'builtin-ganapati',
    name: 'Om Gam Ganapataye Namah',
    deity: 'Ganesha',
    textSanskrit: 'ॐ गं गणपतये नमः',
    textTelugu: 'ఓం గం గణపతయే నమః',
    textEnglish: 'Om Gam Ganapataye Namah',
    defaultTarget: 27,
    isBuiltIn: true,
  },
  {
    id: 'builtin-rama-taraka',
    name: 'Sri Rama Rama Rameti',
    deity: 'Sri Rama',
    textSanskrit:
      'श्रीराम राम रामेति रमे रामे मनोरमे सहस्रनाम तत्तुल्यं रामनाम वरानने',
    textTelugu:
      'శ్రీరామ రామ రామేతి రమే రామే మనోరమే సహస్రనామ తత్తుల్యం రామనామ వరాననే',
    textEnglish:
      'Sri Rama Rama Rameti Rame Rame Manorame Sahasranama Tattulyam Ramanama Varanane',
    defaultTarget: 108,
    isBuiltIn: true,
  },
  {
    id: 'builtin-hare-krishna',
    name: 'Hare Krishna Maha-Mantra',
    deity: 'Krishna',
    textSanskrit:
      'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे हरे राम हरे राम राम राम हरे हरे',
    textTelugu:
      'హరే కృష్ణ హరే కృష్ణ కృష్ణ కృష్ణ హరే హరే హరే రామ హరే రామ రామ రామ హరే హరే',
    textEnglish:
      'Hare Krishna Hare Krishna Krishna Krishna Hare Hare Hare Rama Hare Rama Rama Rama Hare Hare',
    defaultTarget: 108,
    isBuiltIn: true,
  },
  {
    id: 'builtin-venkatesaya',
    name: 'Om Namo Venkatesaya',
    deity: 'Sri Venkateswara',
    textSanskrit: 'ॐ नमो वेङ्कटेशाय',
    textTelugu: 'ఓం నమో వేంకటేశాయ',
    textEnglish: 'Om Namo Venkatesaya',
    defaultTarget: 108,
    isBuiltIn: true,
  },
  {
    id: 'builtin-hanuman',
    name: 'Om Ham Hanumate Namah',
    deity: 'Hanuman',
    textSanskrit: 'ॐ हं हनुमते नमः',
    textTelugu: 'ఓం హం హనుమతే నమః',
    textEnglish: 'Om Ham Hanumate Namah',
    defaultTarget: 11,
    isBuiltIn: true,
  },
];
