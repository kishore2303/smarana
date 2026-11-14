/**
 * Smarana Telugu Panchangam Engine
 * Local-first, offline, astronomical calculation for Andhra Pradesh & Telugu culture.
 *
 * Computes:
 * - Telugu Samvatsaram (60-year Jovian cycle)
 * - Ayanam (Uttarayana / Dakshinayana)
 * - Ritu (6 seasons: Vasanta, Greeshma, Varsha, Sharad, Hemanta, Shishira)
 * - Masa (Telugu Chandramana Amavasyanta month)
 * - Paksha (Shukla / Krishna)
 * - Tithi (15 lunar phases per paksha)
 * - Vaara (7 days of the week)
 * - Nakshatra (27 lunar asterisms + 4 padas)
 * - Yoga (27 solar-lunar sum yogas)
 * - Karana (11 half-tithi karanas)
 * - Auspicious & Inauspicious Timings (Rahu Kalam, Yamagandam, Gulika, Durmuhurtham, Abhijit)
 * - Special Vratams (Ekadashi, Pradosham, Sankashta Chaturthi, Pournami, Amavasya)
 */

export interface PanchangaResult {
  dateIso: string;
  dayOfWeek: {
    index: number;
    english: string;
    telugu: string;
  };
  samvatsara: {
    index: number;
    english: string;
    telugu: string;
  };
  ayana: {
    english: 'Uttarayana' | 'Dakshinayana';
    telugu: 'ఉత్తరాయణం' | 'దక్షిణాయనం';
  };
  ritu: {
    index: number;
    english: string;
    telugu: string;
  };
  masa: {
    index: number;
    english: string;
    telugu: string;
  };
  paksha: {
    type: 'shukla' | 'krishna';
    english: string;
    telugu: string;
  };
  tithi: {
    index: number; // 1 to 15
    rawIndex: number; // 0 to 29
    english: string;
    telugu: string;
    fullTelugu: string;
    fullEnglish: string;
  };
  nakshatra: {
    index: number; // 0 to 26
    english: string;
    telugu: string;
    pada: number; // 1 to 4
    deity: string;
  };
  yoga: {
    index: number; // 0 to 26
    english: string;
    telugu: string;
  };
  karana: {
    index: number; // 0 to 10
    english: string;
    telugu: string;
  };
  timings: {
    rahuKalam: string;
    yamagandam: string;
    gulikaKalam: string;
    durmuhurtham: string;
    abhijitMuhurtham: string;
  };
  specialDayNotes: {
    english?: string;
    telugu?: string;
    isEkadashi: boolean;
    isPournami: boolean;
    isAmavasya: boolean;
    isPradosham: boolean;
    isSankashti: boolean;
  };
}

export const TELUGU_SAMVATSARAS = [
  { english: 'Prabhava', telugu: 'ప్రభవ' },
  { english: 'Vibhava', telugu: 'విభవ' },
  { english: 'Shukla', telugu: 'శుక్ల' },
  { english: 'Pramodoota', telugu: 'ప్రమోదూత' },
  { english: 'Prajotpatti', telugu: 'ప్రజోత్పత్తి' },
  { english: 'Aangirasa', telugu: 'ఆంగీరస' },
  { english: 'Sreemukha', telugu: 'శ్రీముఖ' },
  { english: 'Bhaava', telugu: 'భావ' },
  { english: 'Yuva', telugu: 'యువ' },
  { english: 'Dhaata', telugu: 'ధాత' },
  { english: 'Eeshwara', telugu: 'ఈశ్వర' },
  { english: 'Bahudhaanya', telugu: 'బహుధాన్య' },
  { english: 'Pramaadi', telugu: 'ప్రమాది' },
  { english: 'Vikrama', telugu: 'విక్రమ' },
  { english: 'Vrusha', telugu: 'వృష' },
  { english: 'Chitrabhaanu', telugu: 'చిత్రభాను' },
  { english: 'Swabhaanu', telugu: 'స్వభాను' },
  { english: 'Taarana', telugu: 'తారణ' },
  { english: 'Paarthiva', telugu: 'పార్థివ' },
  { english: 'Vyaya', telugu: 'వ్యయ' },
  { english: 'Sarvajittu', telugu: 'సర్వజిత్తు' },
  { english: 'Sarvadhaari', telugu: 'సర్వధారి' },
  { english: 'Virodhi', telugu: 'విరోధి' },
  { english: 'Vikruti', telugu: 'వికృతి' },
  { english: 'Khara', telugu: 'ఖర' },
  { english: 'Nandana', telugu: 'నందన' },
  { english: 'Vijaya', telugu: 'విజయ' },
  { english: 'Jaya', telugu: 'జయ' },
  { english: 'Manmadha', telugu: 'మన్మధ' },
  { english: 'Durmukhi', telugu: 'దుర్ముఖి' },
  { english: 'Hevalambi', telugu: 'హేవళంబి' },
  { english: 'Vilambi', telugu: 'విళంబి' },
  { english: 'Vikaari', telugu: 'వికారి' },
  { english: 'Shaarvari', telugu: 'శార్వరి' },
  { english: 'Plava', telugu: 'ప్లవ' },
  { english: 'Shubhakruthu', telugu: 'శుభకృతు' },
  { english: 'Shobhakruthu', telugu: 'శోభకృతు' },
  { english: 'Krodhi', telugu: 'క్రోధి' },
  { english: 'Vishwaavasu', telugu: 'విశ్వావసు' },
  { english: 'Paraabhava', telugu: 'పరాభవ' },
  { english: 'Plavanga', telugu: 'ప్లవంగ' },
  { english: 'Keelaka', telugu: 'కీలక' },
  { english: 'Soumya', telugu: 'సౌమ్య' },
  { english: 'Sadhaarana', telugu: 'సాధారణ' },
  { english: 'Virodhikruthu', telugu: 'విరోధికృతు' },
  { english: 'Pareedhaavi', telugu: 'పరీధావి' },
  { english: 'Pramaadeecha', telugu: 'ప్రమాదీచ' },
  { english: 'Aananda', telugu: 'ఆనంద' },
  { english: 'Raakshasa', telugu: 'రాక్షస' },
  { english: 'Nala', telugu: 'నల' },
  { english: 'Pingala', telugu: 'పింగళ' },
  { english: 'Kaalayukthi', telugu: 'కాళయుక్తి' },
  { english: 'Siddhaarthi', telugu: 'సిద్ధార్థి' },
  { english: 'Roudri', telugu: 'రౌద్రి' },
  { english: 'Durmathi', telugu: 'దుర్మతి' },
  { english: 'Dundubhi', telugu: 'దుందుభి' },
  { english: 'Rudhirodgaari', telugu: 'రుధిరోద్గారి' },
  { english: 'Rakthaakshi', telugu: 'రక్తాక్షి' },
  { english: 'Krodhana', telugu: 'క్రోధన' },
  { english: 'Kshaya', telugu: 'క్షయ' },
] as const;

export const TELUGU_MASAS = [
  { english: 'Chaitramu', telugu: 'చైత్రము' },
  { english: 'Vaishakhamu', telugu: 'వైశాఖము' },
  { english: 'Jyeshthamu', telugu: 'జ్యేష్ఠము' },
  { english: 'Aashadhamu', telugu: 'ఆషాఢము' },
  { english: 'Shravanamu', telugu: 'శ్రావణము' },
  { english: 'Bhadrapadamu', telugu: 'భాద్రపదము' },
  { english: 'Aashwayujamu', telugu: 'ఆశ్వయుజము' },
  { english: 'Karthikamu', telugu: 'కార్తీకము' },
  { english: 'Margashiramu', telugu: 'మార్గశిరము' },
  { english: 'Pushyamu', telugu: 'పుష్యము' },
  { english: 'Maghamu', telugu: 'మాఘము' },
  { english: 'Phalgunamu', telugu: 'ఫాల్గుణము' },
] as const;

export const TELUGU_RITUS = [
  { english: 'Vasantha Ritu (Spring)', telugu: 'వసంత ఋతువు' },
  { english: 'Greeshma Ritu (Summer)', telugu: 'గ్రీష్మ ఋతువు' },
  { english: 'Varsha Ritu (Monsoon)', telugu: 'వర్ష ఋతువు' },
  { english: 'Sharad Ritu (Autumn)', telugu: 'శరద్ ఋతువు' },
  { english: 'Hemantha Ritu (Pre-winter)', telugu: 'హేమంత ఋతువు' },
  { english: 'Shishira Ritu (Winter)', telugu: 'శిశిర ఋతువు' },
] as const;

export const TELUGU_VAARAMS = [
  { english: 'Aadivaaramu (Sunday)', telugu: 'ఆదివారము' },
  { english: 'Somavaaramu (Monday)', telugu: 'సోమవారము' },
  { english: 'Mangalavaaramu (Tuesday)', telugu: 'మంగళవారము' },
  { english: 'Budhavaaramu (Wednesday)', telugu: 'బుధవారము' },
  { english: 'Guruvaaramu (Thursday)', telugu: 'గురువారము' },
  { english: 'Shukravaaramu (Friday)', telugu: 'శుక్రవారము' },
  { english: 'Shanivaaramu (Saturday)', telugu: 'శనివారము' },
] as const;

export const TELUGU_TITHIS = [
  { english: 'Padyami', telugu: 'పాడ్యమి' },
  { english: 'Vidiya', telugu: 'విదియ' },
  { english: 'Thadiya', telugu: 'తదియ' },
  { english: 'Chavithi', telugu: 'చవితి' },
  { english: 'Panchami', telugu: 'పంచమి' },
  { english: 'Shashti', telugu: 'షష్ఠి' },
  { english: 'Sapthami', telugu: 'సప్తమి' },
  { english: 'Ashtami', telugu: 'అష్టమి' },
  { english: 'Navami', telugu: 'నవమి' },
  { english: 'Dashami', telugu: 'దశమి' },
  { english: 'Ekadashi', telugu: 'ఏకాదశి' },
  { english: 'Dvadashi', telugu: 'ద్వాదశి' },
  { english: 'Trayodashi', telugu: 'త్రయోదశి' },
  { english: 'Chaturdashi', telugu: 'చతుర్దశి' },
  { english: 'Poornima', telugu: 'పూర్ణిమ' }, // Index 14 in Shukla
  // For Krishna 14: Amavasya (అమావాస్య)
] as const;

export const TELUGU_NAKSHATRAS = [
  { english: 'Ashwini', telugu: 'అశ్విని', deity: 'Ashwini Kumaras' },
  { english: 'Bharani', telugu: 'భరణి', deity: 'Yama' },
  { english: 'Krittika', telugu: 'కృత్తిక', deity: 'Agni' },
  { english: 'Rohini', telugu: 'రోహిణి', deity: 'Brahma / Prajapati' },
  { english: 'Mrigashira', telugu: 'మృగశిర', deity: 'Soma / Chandra' },
  { english: 'Arudra', telugu: 'ఆరుద్ర', deity: 'Rudra / Shiva' },
  { english: 'Punarvasu', telugu: 'పునర్వసు', deity: 'Aditi' },
  { english: 'Pushyami', telugu: 'పుష్యమి', deity: 'Brihaspati' },
  { english: 'Ashlesha', telugu: 'ఆశ్లేష', deity: 'Sarpa / Naga' },
  { english: 'Makha', telugu: 'మఖ', deity: 'Pitrus' },
  { english: 'Pubba (Purva Phalguni)', telugu: 'పుబ్బ', deity: 'Bhaga' },
  { english: 'Uttara (Uttara Phalguni)', telugu: 'ఉత్తర', deity: 'Aryama' },
  { english: 'Hastha', telugu: 'హస్త', deity: 'Savita / Surya' },
  { english: 'Chitra', telugu: 'చిత్త', deity: 'Vishwakarma' },
  { english: 'Swati', telugu: 'స్వాతి', deity: 'Vayu' },
  { english: 'Vishakha', telugu: 'విశాఖ', deity: 'Indragni' },
  { english: 'Anuradha', telugu: 'అనూరాధ', deity: 'Mitra' },
  { english: 'Jyeshtha', telugu: 'జ్యేష్ఠ', deity: 'Indra' },
  { english: 'Moola', telugu: 'మూల', deity: 'Nirriti' },
  { english: 'Purvashadha', telugu: 'పూర్వాషాఢ', deity: 'Apas / Varuna' },
  { english: 'Uttarashadha', telugu: 'ఉత్తరాషాఢ', deity: 'Vishwadevas' },
  { english: 'Shravanam', telugu: 'శ్రవణం', deity: 'Vishnu' },
  { english: 'Dhanishta', telugu: 'ధనిష్ఠ', deity: 'Ashta Vasus' },
  { english: 'Shatabhisham', telugu: 'శతభిషం', deity: 'Varuna' },
  { english: 'Purvabhadra', telugu: 'పూర్వాభాద్ర', deity: 'Aja Ekapada' },
  { english: 'Uttarabhadra', telugu: 'ఉత్తరాభాద్ర', deity: 'Ahirbudhnya' },
  { english: 'Revati', telugu: 'రేవతి', deity: 'Poosha' },
] as const;

export const TELUGU_YOGAS = [
  { english: 'Vishkambha', telugu: 'విష్కంభం' },
  { english: 'Preeti', telugu: 'ప్రీతి' },
  { english: 'Aayushman', telugu: 'ఆయుష్మాన్' },
  { english: 'Saubhagya', telugu: 'సౌభాగ్యం' },
  { english: 'Shobhana', telugu: 'శోభనం' },
  { english: 'Atiganda', telugu: 'అతిగండం' },
  { english: 'Sukarma', telugu: 'సుకర్మ' },
  { english: 'Dhriti', telugu: 'ధృతి' },
  { english: 'Shoola', telugu: 'శూలం' },
  { english: 'Ganda', telugu: 'గండం' },
  { english: 'Vriddhi', telugu: 'వృద్ధి' },
  { english: 'Dhruva', telugu: 'ధ్రువం' },
  { english: 'Vyaghata', telugu: 'వ్యాఘాతం' },
  { english: 'Harshana', telugu: 'హర్షణం' },
  { english: 'Vajra', telugu: 'వజ్రం' },
  { english: 'Asiddhi', telugu: 'సిద్ధి' },
  { english: 'Vyatipata', telugu: 'వ్యతీపాతం' },
  { english: 'Variyan', telugu: 'వరీయాన్' },
  { english: 'Parigha', telugu: 'పరిఘం' },
  { english: 'Shiva', telugu: 'శివం' },
  { english: 'Siddha', telugu: 'సిద్ధం' },
  { english: 'Sadhya', telugu: 'సాధ్యం' },
  { english: 'Shubha', telugu: 'శుభం' },
  { english: 'Shukla', telugu: 'శుక్లం' },
  { english: 'Brahma', telugu: 'బ్రహ్మం' },
  { english: 'Indra', telugu: 'ఐంద్రం' },
  { english: 'Vaidhriti', telugu: 'వైధృతి' },
] as const;

export const TELUGU_KARANAS = [
  { english: 'Bava', telugu: 'బవ' },
  { english: 'Balava', telugu: 'బాలవ' },
  { english: 'Kaulava', telugu: 'కౌలవ' },
  { english: 'Taitila', telugu: 'తైతిల' },
  { english: 'Garija', telugu: 'గరజ' },
  { english: 'Vanija', telugu: 'వణిజ' },
  { english: 'Vishti (Bhadra)', telugu: 'విష్టి (భద్ర)' },
  { english: 'Shakuni', telugu: 'శకుని' },
  { english: 'Chatushpada', telugu: 'చతుష్పాద' },
  { english: 'Naga', telugu: 'నాగ' },
  { english: 'Kimstughna', telugu: 'కింస్తుఘ్న' },
] as const;

// Traditional canonical standard timings for South India / Andhra Pradesh
const TIMINGS_TABLE = [
  // 0: Sunday
  {
    rahu: '04:30 PM - 06:00 PM',
    yama: '12:00 PM - 01:30 PM',
    gulika: '03:00 PM - 04:30 PM',
    durmuhurtham: '04:36 PM - 05:24 PM',
    abhijit: '11:45 AM - 12:35 PM',
  },
  // 1: Monday
  {
    rahu: '07:30 AM - 09:00 AM',
    yama: '10:30 AM - 12:00 PM',
    gulika: '01:30 PM - 03:00 PM',
    durmuhurtham: '12:48 PM - 01:36 PM & 03:12 PM - 04:00 PM',
    abhijit: '11:45 AM - 12:35 PM',
  },
  // 2: Tuesday
  {
    rahu: '03:00 PM - 04:30 PM',
    yama: '09:00 AM - 10:30 AM',
    gulika: '12:00 PM - 01:30 PM',
    durmuhurtham: '08:24 AM - 09:12 AM',
    abhijit: '11:45 AM - 12:35 PM',
  },
  // 3: Wednesday
  {
    rahu: '12:00 PM - 01:30 PM',
    yama: '07:30 AM - 09:00 AM',
    gulika: '10:30 AM - 12:00 PM',
    durmuhurtham: '11:58 AM - 12:48 PM',
    abhijit: 'Not recommended (Rahu Kalam)',
  },
  // 4: Thursday
  {
    rahu: '01:30 PM - 03:00 PM',
    yama: '06:00 AM - 07:30 AM',
    gulika: '09:00 AM - 10:30 AM',
    durmuhurtham: '10:18 AM - 11:06 AM & 03:12 PM - 04:00 PM',
    abhijit: '11:45 AM - 12:35 PM',
  },
  // 5: Friday
  {
    rahu: '10:30 AM - 12:00 PM',
    yama: '03:00 PM - 04:30 PM',
    gulika: '07:30 AM - 09:00 AM',
    durmuhurtham: '08:24 AM - 09:12 AM & 12:48 PM - 01:36 PM',
    abhijit: '11:45 AM - 12:35 PM',
  },
  // 6: Saturday
  {
    rahu: '09:00 AM - 10:30 AM',
    yama: '01:30 PM - 03:00 PM',
    gulika: '06:00 AM - 07:30 AM',
    durmuhurtham: '06:48 AM - 07:36 AM',
    abhijit: '11:45 AM - 12:35 PM',
  },
];

/**
 * Ugadi Reference Table for Andhra Pradesh Telugu Chandramana Calendar.
 * Ugadi marks Chaitra Shukla Padyami, the commencement of each Telugu Year.
 */
export const UGADI_TABLE: Record<number, string> = {
  2020: '2020-03-25',
  2021: '2021-04-13',
  2022: '2022-04-02',
  2023: '2023-03-22',
  2024: '2024-04-09',
  2025: '2025-03-30',
  2026: '2026-03-19',
  2027: '2027-04-07',
  2028: '2028-03-27',
  2029: '2029-04-14',
  2030: '2030-04-03',
  2031: '2031-03-24',
  2032: '2032-04-11',
  2033: '2033-03-31',
  2034: '2034-03-20',
  2035: '2035-04-09',
};

export interface UgadiYearRange {
  lunarYear: number;
  startUgadi: Date;
  endUgadi: Date; // Inclusive end of the Telugu year (day before next Ugadi)
  samvatsara: {
    index: number;
    english: string;
    telugu: string;
  };
  gregorianSpan: string;
}

export function parseLocalDate(isoString: string): Date {
  const [y, m, d] = isoString.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0);
}

/**
 * Returns the exact Ugadi date starting the Telugu year for the given Gregorian year.
 */
export function getUgadiDate(year: number): Date {
  if (UGADI_TABLE[year]) {
    return parseLocalDate(UGADI_TABLE[year]);
  }
  // Algorithmic estimation for years outside 2020-2035 based on mean synodic cycles
  const diff = year - 2024;
  const daysOffset = Math.round((diff * 365.2422) % 29.530588);
  const base = new Date(year, 2, 22, 0, 0, 0);
  base.setDate(base.getDate() + (daysOffset > 0 ? daysOffset : daysOffset + 29));
  return base;
}

/**
 * Computes the Ugadi Year Range encompassing the given reference date.
 * Each Telugu year runs from Ugadi (Chaitra Shukla Padyami) to the day before the next Ugadi.
 */
export function getUgadiYearRange(referenceDate: Date = new Date()): UgadiYearRange {
  const y = referenceDate.getFullYear();
  const ugadiThis = getUgadiDate(y);

  // Normalize reference date to local midnight
  const refMidnight = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    0,
    0,
    0
  );

  let startUgadi: Date;
  let endUgadi: Date;
  let lunarYear: number;

  if (refMidnight.getTime() >= ugadiThis.getTime()) {
    startUgadi = ugadiThis;
    const nextUgadi = getUgadiDate(y + 1);
    endUgadi = new Date(nextUgadi.getTime() - 86400000);
    lunarYear = y;
  } else {
    startUgadi = getUgadiDate(y - 1);
    endUgadi = new Date(ugadiThis.getTime() - 86400000);
    lunarYear = y - 1;
  }

  const samvatsaraIndex = (lunarYear - 1987 + 60) % 60;
  const samvatsaraObj = TELUGU_SAMVATSARAS[samvatsaraIndex];

  return {
    lunarYear,
    startUgadi,
    endUgadi,
    samvatsara: {
      index: samvatsaraIndex,
      english: samvatsaraObj.english,
      telugu: samvatsaraObj.telugu,
    },
    gregorianSpan: `${startUgadi.getFullYear()} – ${endUgadi.getFullYear()}`,
  };
}

/**
 * Traditional Saptami Vibhakti (Locative inflected) names for Sankalpam
 */
export const SAPTAMI_MASAS = [
  { english: 'Caitra māse', telugu: 'చైత్ర మాసే' },
  { english: 'Vaiśākha māse', telugu: 'వైశాఖ మాసే' },
  { english: 'Jyeṣṭha māse', telugu: 'జ్యేష్ఠ మాసే' },
  { english: 'Āṣāḍha māse', telugu: 'ఆషాఢ మాసే' },
  { english: 'Śrāvaṇa māse', telugu: 'శ్రావణ మాసే' },
  { english: 'Bhādrapada māse', telugu: 'భాద్రపద మాసే' },
  { english: 'Āśvayuja māse', telugu: 'ఆశ్వయుజ మాసే' },
  { english: 'Kārtīka māse', telugu: 'కార్తీక మాసే' },
  { english: 'Mārgaśira māse', telugu: 'మార్గశిర మాసే' },
  { english: 'Puṣya māse', telugu: 'పుష్య మాసే' },
  { english: 'Māgha māse', telugu: 'మాఘ మాసే' },
  { english: 'Phālguna māse', telugu: 'ఫాల్గున మాసే' },
] as const;

export const SAPTAMI_RITUS = [
  { english: 'Vasanta ṛtau', telugu: 'వసంత ఋతౌ' },
  { english: 'Grīṣma ṛtau', telugu: 'గ్రీష్మ ఋతౌ' },
  { english: 'Varṣa ṛtau', telugu: 'వర్ష ఋతౌ' },
  { english: 'Śarad ṛtau', telugu: 'శరద్ ఋతౌ' },
  { english: 'Hemanta ṛtau', telugu: 'హేమంత ఋతౌ' },
  { english: 'Śiśira ṛtau', telugu: 'శిశిర ఋతౌ' },
] as const;

export const SAPTAMI_VAARAMS = [
  { english: 'Bhānuvāsare', telugu: 'భానువాసరే' },
  { english: 'Induvāsare', telugu: 'ఇందువాసరే' },
  { english: 'Bhaumavāsare', telugu: 'భౌమవాసరే' },
  { english: 'Saumyavāsare', telugu: 'సౌమ్యవాసరే' },
  { english: 'Guruvāsare', telugu: 'గురువాసరే' },
  { english: 'Bhṛguvāsare', telugu: 'భృగువాసరే' },
  { english: 'Sthiravāsare', telugu: 'స్థిరవాసరే' },
] as const;

export const SAPTAMI_TITHIS = [
  { english: 'Prathamāyāṁ śubhatithau', telugu: 'ప్రథమాయాం శుభతిథౌ' },
  { english: 'Dvitīyāyāṁ śubhatithau', telugu: 'ద్వితీయాయాం శుభతిథౌ' },
  { english: 'Tṛtīyāyāṁ śubhatithau', telugu: 'తృతీయాయాం శుభతిథౌ' },
  { english: 'Caturthyāṁ śubhatithau', telugu: 'చతుర్థ్యాం శుభతిథౌ' },
  { english: 'Pañcamyāṁ śubhatithau', telugu: 'పంచమ్యాం శుభతిథౌ' },
  { english: 'Ṣaṣṭhyāṁ śubhatithau', telugu: 'షష్ఠ్యాం శుభతిథౌ' },
  { english: 'Saptamyāṁ śubhatithau', telugu: 'సప్తమ్యాం శుభతిథౌ' },
  { english: 'Aṣṭamyāṁ śubhatithau', telugu: 'అష్టమ్యాం శుభతిథౌ' },
  { english: 'Navamyāṁ śubhatithau', telugu: 'నవమ్యాం శుభతిథౌ' },
  { english: 'Daśamyāṁ śubhatithau', telugu: 'దశమ్యాం శుభతిథౌ' },
  { english: 'Ekādaśyāṁ śubhatithau', telugu: 'ఏకాదశ్యాం శుభతిథౌ' },
  { english: 'Dvādaśyāṁ śubhatithau', telugu: 'ద్వాదశ్యాం శుభతిథౌ' },
  { english: 'Trayodaśyāṁ śubhatithau', telugu: 'త్రయోదశ్యాం శుభతిథౌ' },
  { english: 'Caturdaśyāṁ śubhatithau', telugu: 'చతుర్దశ్యాం శుభతిథౌ' },
  {
    english: 'Pūrṇimāyāṁ śubhatithau',
    telugu: 'పూర్ణిమాయాం శుభతిథౌ',
    amavasyaEn: 'Amāvāsyāyāṁ śubhatithau',
    amavasyaTe: 'అమావాస్యాయాం శుభతిథౌ',
  },
] as const;

export const SAPTAMI_NAKSHATRAS = [
  { english: 'Aśvinī nakṣatrayuktāyāṁ', telugu: 'అశ్విని నక్షత్రయుక్తాయాం' },
  { english: 'Bharaṇī nakṣatrayuktāyāṁ', telugu: 'భరణి నక్షత్రయుక్తాయాం' },
  { english: 'Kṛttikā nakṣatrayuktāyāṁ', telugu: 'కృత్తికా నక్షత్రయుక్తాయాం' },
  { english: 'Rohiṇī nakṣatrayuktāyāṁ', telugu: 'రోహిణీ నక్షత్రయుక్తాయాం' },
  { english: 'Mṛgaśiro nakṣatrayuktāyāṁ', telugu: 'మృగశిరో నక్షత్రయుక్తాయాం' },
  { english: 'Ārudrā nakṣatrayuktāyāṁ', telugu: 'ఆరుద్రా నక్షత్రయుక్తాయాం' },
  { english: 'Punarvasu nakṣatrayuktāyāṁ', telugu: 'పునర్వసు నక్షత్రయుక్తాయాం' },
  { english: 'Puṣyāmī nakṣatrayuktāyāṁ', telugu: 'పుష్యమీ నక్షత్రయుక్తాయాం' },
  { english: 'Āśleṣā nakṣatrayuktāyāṁ', telugu: 'ఆశ్లేషా నక్షత్రయుక్తాయాం' },
  { english: 'Makhā nakṣatrayuktāyāṁ', telugu: 'మఖా నక్షత్రయుక్తాయాం' },
  { english: 'Pūrvaphalgunī nakṣatrayuktāyāṁ', telugu: 'పూర్వఫల్గునీ నక్షత్రయుక్తాయాం' },
  { english: 'Uttaraphalgunī nakṣatrayuktāyāṁ', telugu: 'ఉత్తరఫల్గునీ నక్షత్రయుక్తాయాం' },
  { english: 'Hastā nakṣatrayuktāyāṁ', telugu: 'హస్తా నక్షత్రయుక్తాయాం' },
  { english: 'Citrā nakṣatrayuktāyāṁ', telugu: 'చిత్రా నక్షత్రయుక్తాయాం' },
  { english: 'Svātī nakṣatrayuktāyāṁ', telugu: 'స్వాతీ నక్షత్రయుక్తాయాం' },
  { english: 'Viśākhā nakṣatrayuktāyāṁ', telugu: 'విశాఖా నక్షత్రయుక్తాయాం' },
  { english: 'Anūrādhā nakṣatrayuktāyāṁ', telugu: 'అనూరాధా నక్షత్రయుక్తాయాం' },
  { english: 'Jyeṣṭhā nakṣatrayuktāyāṁ', telugu: 'జ్యేష్ఠా నక్షత్రయుక్తాయాం' },
  { english: 'Mūlā nakṣatrayuktāyāṁ', telugu: 'మూలా నక్షత్రయుక్తాయాం' },
  { english: 'Pūrvāṣāḍhā nakṣatrayuktāyāṁ', telugu: 'పూర్వాషాఢా నక్షత్రయుక్తాయాం' },
  { english: 'Uttarāṣāḍhā nakṣatrayuktāyāṁ', telugu: 'ఉత్తరాషాఢా నక్షత్రయుక్తాయాం' },
  { english: 'Śravaṇa nakṣatrayuktāyāṁ', telugu: 'శ్రవణ నక్షత్రయుక్తాయాం' },
  { english: 'Dhaniṣṭhā nakṣatrayuktāyāṁ', telugu: 'ధనిష్ఠా నక్షత్రయుక్తాయాం' },
  { english: 'Śatabhiṣak nakṣatrayuktāyāṁ', telugu: 'శతభిషక్ నక్షత్రయుక్తాయాం' },
  { english: 'Pūrvābhādrā nakṣatrayuktāyāṁ', telugu: 'పూర్వాభాద్రా నక్షత్రయుక్తాయాం' },
  { english: 'Uttarābhādrā nakṣatrayuktāyāṁ', telugu: 'ఉత్తరాభాద్రా నక్షత్రయుక్తాయాం' },
  { english: 'Revatī nakṣatrayuktāyāṁ', telugu: 'రేవతీ నక్షత్రయుక్తాయాం' },
] as const;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

function normalizeDeg(deg: number): number {
  let val = deg % 360;
  if (val < 0) val += 360;
  return val;
}

/**
 * Calculates Julian Day Number for a given UTC / Local Date.
 */
function getJulianDay(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d =
    date.getDate() +
    date.getHours() / 24 +
    date.getMinutes() / 1440 +
    date.getSeconds() / 86400;

  let year = y;
  let month = m;
  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    d +
    b -
    1524.5
  );
}

/**
 * Computes Lahiri (Chitrapaksha) Ayanamsha for a given Julian Day.
 */
function getLahiriAyanamsha(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  // J2000.0 Lahiri value: 23°51'11" = 23.8530555°
  // Precession rate: 50.29" per tropical year
  return 23.853056 + 1.396971 * t;
}

/**
 * Computes Sun Ecliptic Longitude (Tropical & Sidereal).
 */
function getSunLongitude(jd: number, ayanamsha: number): { tropical: number; sidereal: number } {
  const t = (jd - 2451545.0) / 36525.0;
  const l0 = normalizeDeg(280.46646 + 36000.76983 * t);
  const m = normalizeDeg(357.52911 + 35999.05029 * t);
  const mRad = toRadians(m);

  // Equation of center
  const c =
    (1.914602 - 0.004817 * t) * Math.sin(mRad) +
    (0.019993 - 0.000101 * t) * Math.sin(2 * mRad) +
    0.000289 * Math.sin(3 * mRad);

  const tropical = normalizeDeg(l0 + c);
  const sidereal = normalizeDeg(tropical - ayanamsha);
  return { tropical, sidereal };
}

/**
 * Computes Moon Ecliptic Longitude (Tropical & Sidereal).
 * Includes major lunar perturbations (Evection, Variation, Annual Equation).
 */
function getMoonLongitude(jd: number, ayanamsha: number): { tropical: number; sidereal: number } {
  const t = (jd - 2451545.0) / 36525.0;
  const lp = normalizeDeg(218.3164477 + 481267.88128 * t);
  const d = normalizeDeg(297.8501921 + 445267.1114034 * t);
  const m = normalizeDeg(357.5291092 + 35999.0502909 * t);
  const mp = normalizeDeg(134.9633964 + 477198.8675055 * t);

  const dRad = toRadians(d);
  const mRad = toRadians(m);
  const mpRad = toRadians(mp);

  const perturbation =
    6.288774 * Math.sin(mpRad) +
    1.274027 * Math.sin(2 * dRad - mpRad) +
    0.658314 * Math.sin(2 * dRad) +
    0.213618 * Math.sin(2 * mpRad) -
    0.185116 * Math.sin(mRad) -
    0.114332 * Math.sin(2 * dRad - 2 * mpRad) +
    0.058793 * Math.sin(2 * dRad - mRad) +
    0.057066 * Math.sin(2 * dRad - mRad - mpRad) +
    0.05332 * Math.sin(2 * dRad + mpRad) +
    0.046048 * Math.sin(2 * dRad - mRad) +
    0.041024 * Math.sin(mpRad - mRad) -
    0.03472 * Math.sin(dRad) -
    0.03077 * Math.sin(mpRad + mRad);

  const tropical = normalizeDeg(lp + perturbation);
  const sidereal = normalizeDeg(tropical - ayanamsha);
  return { tropical, sidereal };
}

/**
 * Main function: computes complete Telugu Panchangam for a given Date.
 */
export function getPanchanga(date = new Date()): PanchangaResult {
  // Use 06:00:00 (Standard sunrise) on the local date for traditional daytime Panchangam
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0, 0);
  const jd = getJulianDay(targetDate);
  const ayanamsha = getLahiriAyanamsha(jd);

  const sun = getSunLongitude(jd, ayanamsha);
  const moon = getMoonLongitude(jd, ayanamsha);

  // 1. Vaaram (Day of Week)
  const dayIndex = targetDate.getDay();
  const dayOfWeek = {
    index: dayIndex,
    english: TELUGU_VAARAMS[dayIndex].english.split(' ')[0],
    telugu: TELUGU_VAARAMS[dayIndex].telugu,
  };

  // 2. Tithi
  const deltaLong = normalizeDeg(moon.tropical - sun.tropical);
  const rawTithiIndex = Math.floor(deltaLong / 12); // 0 to 29
  const isShukla = rawTithiIndex < 15;
  const pakshaType: 'shukla' | 'krishna' = isShukla ? 'shukla' : 'krishna';
  const pakshaTelugu = isShukla ? 'శుక్ల పక్షం' : 'కృష్ణ పక్షం';
  const pakshaEnglish = isShukla ? 'Shukla Paksha' : 'Krishna Paksha';

  const tithiIndexInPaksha = rawTithiIndex % 15; // 0 to 14
  let tithiEnglish: string;
  let tithiTelugu: string;

  if (isShukla && tithiIndexInPaksha === 14) {
    tithiEnglish = 'Poornima';
    tithiTelugu = 'పూర్ణిమ';
  } else if (!isShukla && tithiIndexInPaksha === 14) {
    tithiEnglish = 'Amavasya';
    tithiTelugu = 'అమావాస్య';
  } else {
    tithiEnglish = TELUGU_TITHIS[tithiIndexInPaksha].english;
    tithiTelugu = TELUGU_TITHIS[tithiIndexInPaksha].telugu;
  }

  const fullTeluguTithi = `${pakshaTelugu} ${tithiTelugu}`;
  const fullEnglishTithi = `${pakshaEnglish} ${tithiEnglish}`;

  // 3. Nakshatra
  const nakshatraDeg = 360 / 27; // 13.3333°
  const rawNakshatraIndex = Math.floor(moon.sidereal / nakshatraDeg) % 27;
  const nakshatraObj = TELUGU_NAKSHATRAS[rawNakshatraIndex];

  // Pada (1 to 4)
  const padaFraction = (moon.sidereal % nakshatraDeg) / (nakshatraDeg / 4);
  const pada = Math.min(4, Math.floor(padaFraction) + 1);

  // 4. Yoga
  const yogaSum = normalizeDeg(sun.sidereal + moon.sidereal);
  const rawYogaIndex = Math.floor(yogaSum / nakshatraDeg) % 27;
  const yogaObj = TELUGU_YOGAS[rawYogaIndex];

  // 5. Karana
  const rawKaranaIndex = Math.floor(deltaLong / 6) % 60; // 0 to 59
  let karanaIndex = 0;
  if (rawKaranaIndex === 0) {
    karanaIndex = 10; // Kimstughna
  } else if (rawKaranaIndex >= 57) {
    karanaIndex = rawKaranaIndex - 50; // 57 -> Shakuni(7), 58 -> Chatushpada(8), 59 -> Naga(9)
  } else {
    karanaIndex = ((rawKaranaIndex - 1) % 7); // 0 -> Bava ... 6 -> Vishti
  }
  const karanaObj = TELUGU_KARANAS[karanaIndex] || TELUGU_KARANAS[0];

  // 6. Masa (Andhra Pradesh Amavasyanta Month)
  // Sun sidereal longitude tells the solar sign (Rashi):
  // 0° = Mesha (Chaitra), 30° = Vrishabha (Vaishakha) ... 330° = Meena (Phalguna)
  const sunRashi = Math.floor(sun.sidereal / 30) % 12;
  const masaIndex = sunRashi;
  const masaObj = TELUGU_MASAS[masaIndex];

  // 7. Ritu (6 Telugu Seasons)
  const rituIndex = Math.floor(masaIndex / 2) % 6;
  const rituObj = TELUGU_RITUS[rituIndex];

  // 8. Ayana
  const isUttarayana = sun.sidereal >= 270 || sun.sidereal < 90;
  const ayana = {
    english: isUttarayana ? ('Uttarayana' as const) : ('Dakshinayana' as const),
    telugu: isUttarayana ? ('ఉత్తరాయణం' as const) : ('దక్షిణాయనం' as const),
  };

  // 9. Telugu Samvatsara (60-year Jovian Cycle)
  // Ugadi (Chaitra Shukla Padyami) starts the new Samvatsaram.
  const ugadiRange = getUgadiYearRange(targetDate);
  const samvatsaraObj = ugadiRange.samvatsara;
  const samvatsaraIndex = ugadiRange.samvatsara.index;

  // 10. Timings (Rahu Kalam, Yamagandam, Gulika, etc.)
  const timings = {
    rahuKalam: TIMINGS_TABLE[dayIndex].rahu,
    yamagandam: TIMINGS_TABLE[dayIndex].yama,
    gulikaKalam: TIMINGS_TABLE[dayIndex].gulika,
    durmuhurtham: TIMINGS_TABLE[dayIndex].durmuhurtham,
    abhijitMuhurtham: TIMINGS_TABLE[dayIndex].abhijit,
  };

  // 11. Special Vratam & Day Notes
  const isEkadashi = tithiIndexInPaksha === 10; // 11th tithi
  const isPournami = isShukla && tithiIndexInPaksha === 14; // Full moon
  const isAmavasya = !isShukla && tithiIndexInPaksha === 14; // New moon
  const isPradosham = tithiIndexInPaksha === 12; // 13th tithi
  const isSankashti = !isShukla && tithiIndexInPaksha === 3; // Krishna Chaturthi

  let specialNoteTe: string | undefined;
  let specialNoteEn: string | undefined;

  if (isEkadashi) {
    specialNoteTe = 'శ్రీ ఏకాదశి వ్రతం (ఉపవాసం, విష్ణు ఆరాధన)';
    specialNoteEn = 'Sri Ekadashi Vrata (Fast & Vishnu Pooja)';
  } else if (isPournami) {
    specialNoteTe = 'పౌర్ణమి (శ్రీ సత్యనారాయణ వ్రతం, లక్ష్మీ పూజ)';
    specialNoteEn = 'Pournami (Satyanarayana Vrata)';
  } else if (isAmavasya) {
    specialNoteTe = 'సర్వ అమావాస్య (పితృ తర్పణం & దానాలు)';
    specialNoteEn = 'Amavasya (Pitru Tarpana & Charity)';
  } else if (isPradosham) {
    specialNoteTe = 'ప్రదోష వ్రతం (సాయంకాల శివార్చన)';
    specialNoteEn = 'Pradosham (Evening Shiva Pooja)';
  } else if (isSankashti) {
    specialNoteTe = 'సంకష్టహర చవితి (గణపతి సంకష్టహర వ్రతం)';
    specialNoteEn = 'Sankatahara Chaturthi (Ganesha Pooja)';
  }

  const yyyy = targetDate.getFullYear();
  const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  const dd = String(targetDate.getDate()).padStart(2, '0');
  const dateIso = `${yyyy}-${mm}-${dd}`;

  return {
    dateIso,
    dayOfWeek,
    samvatsara: {
      index: samvatsaraIndex,
      english: samvatsaraObj.english,
      telugu: samvatsaraObj.telugu,
    },
    ayana,
    ritu: {
      index: rituIndex,
      english: rituObj.english,
      telugu: rituObj.telugu,
    },
    masa: {
      index: masaIndex,
      english: masaObj.english,
      telugu: masaObj.telugu,
    },
    paksha: {
      type: pakshaType,
      english: pakshaEnglish,
      telugu: pakshaTelugu,
    },
    tithi: {
      index: tithiIndexInPaksha + 1,
      rawIndex: rawTithiIndex,
      english: tithiEnglish,
      telugu: tithiTelugu,
      fullTelugu: fullTeluguTithi,
      fullEnglish: fullEnglishTithi,
    },
    nakshatra: {
      index: rawNakshatraIndex,
      english: nakshatraObj.english,
      telugu: nakshatraObj.telugu,
      pada,
      deity: nakshatraObj.deity,
    },
    yoga: {
      index: rawYogaIndex,
      english: yogaObj.english,
      telugu: yogaObj.telugu,
    },
    karana: {
      index: karanaIndex,
      english: karanaObj.english,
      telugu: karanaObj.telugu,
    },
    timings,
    specialDayNotes: {
      english: specialNoteEn,
      telugu: specialNoteTe,
      isEkadashi,
      isPournami,
      isAmavasya,
      isPradosham,
      isSankashti,
    },
  };
}

export type SankalpaType =
  | 'pooja'
  | 'sandhya_pratah'
  | 'sandhya_madhyahnika'
  | 'sandhya_sayam'
  | 'gayatri_japa'
  | 'japa';

export type TraditionType = 'smartha' | 'vaishnava';

export interface SankalpaOptions {
  type: SankalpaType;
  tradition?: TraditionType;
  gotra?: string;
  name?: string;
  includeFamily?: boolean;
}

export interface SankalpaResult {
  telugu: {
    title: string;
    opening: string;
    deshaKala: string;
    panchangaPortion: string;
    kartaPortion: string;
    purposePortion: string;
    fullText: string;
    bhavartha: string;
  };
  english: {
    title: string;
    opening: string;
    deshaKala: string;
    panchangaPortion: string;
    kartaPortion: string;
    purposePortion: string;
    fullText: string;
    bhavartha: string;
  };
  tokens: {
    samvatsara: string;
    ayana: string;
    ritu: string;
    masa: string;
    paksha: string;
    tithi: string;
    vaara: string;
    nakshatra: string;
    yoga: string;
    karana: string;
  };
}

/**
 * Generates an authentic Telugu / Vedic Sankalpam tailored for:
 * - Nitya Pooja / Devatarchana
 * - Sandhyavandanam (Pratah, Madhyahnika, Sayam)
 * - Gayatri Japa & Mantra Japa
 *
 * Dynamically inflects all 5 Angas and calendar components into proper Sanskrit Saptami Vibhakti.
 */
export function generateSankalpa(
  panchanga: PanchangaResult,
  options: SankalpaOptions
): SankalpaResult {
  const tradition: TraditionType = options.tradition || 'smartha';

  // 1. Panchanga Inflections in Saptami Vibhakti
  const samvatsaraTe = `శ్రీ ${panchanga.samvatsara.telugu} నామ సంవత్సరే`;
  const samvatsaraEn = `śrī ${panchanga.samvatsara.english} nāma saṁvatsare`;

  const ayanaTe =
    panchanga.ayana.english === 'Uttarayana' ? 'ఉత్తరాయణే' : 'దక్షిణాయనే';
  const ayanaEn =
    panchanga.ayana.english === 'Uttarayana' ? 'uttarāyaṇe' : 'dakṣiṇāyane';

  const rituTe =
    SAPTAMI_RITUS[panchanga.ritu.index]?.telugu || 'వసంత ఋతౌ';
  const rituEn =
    SAPTAMI_RITUS[panchanga.ritu.index]?.english || 'vasanta ṛtau';

  const masaTe =
    SAPTAMI_MASAS[panchanga.masa.index]?.telugu || 'చైత్ర మాసే';
  const masaEn =
    SAPTAMI_MASAS[panchanga.masa.index]?.english || 'caitra māse';

  const pakshaTe =
    panchanga.paksha.type === 'shukla' ? 'శుక్ల పక్షే' : 'కృష్ణ పక్షే';
  const pakshaEn =
    panchanga.paksha.type === 'shukla' ? 'śukla pakṣe' : 'kṛṣṇa pakṣe';

  // Tithi inflections
  const tithiObj = SAPTAMI_TITHIS[panchanga.tithi.index - 1];
  let tithiTe: string;
  let tithiEn: string;
  if (panchanga.paksha.type === 'krishna' && panchanga.tithi.index === 15) {
    tithiTe = 'అమావాస్యాయాం శుభతిథౌ';
    tithiEn = 'amāvāsyāyāṁ śubhatithau';
  } else {
    tithiTe = tithiObj?.telugu || 'ప్రథమాయాం శుభతిథౌ';
    tithiEn = tithiObj?.english || 'prathamāyāṁ śubhatithau';
  }

  const vaaraTe =
    SAPTAMI_VAARAMS[panchanga.dayOfWeek.index]?.telugu || 'భానువాసరే';
  const vaaraEn =
    SAPTAMI_VAARAMS[panchanga.dayOfWeek.index]?.english || 'bhānuvāsare';

  const nakshatraTe =
    SAPTAMI_NAKSHATRAS[panchanga.nakshatra.index]?.telugu ||
    'అశ్విని నక్షత్రయుక్తాయాం';
  const nakshatraEn =
    SAPTAMI_NAKSHATRAS[panchanga.nakshatra.index]?.english ||
    'aśvinī nakṣatrayuktāyāṁ';

  const yogaTe = `${panchanga.yoga.telugu} యోగే`;
  const yogaEn = `${panchanga.yoga.english} yoge`;

  const karanaTe = `${panchanga.karana.telugu} కరణే`;
  const karanaEn = `${panchanga.karana.english} karaṇe`;

  // 2. Karta (Yajamana / Practitioner) Formatting
  const gotraTrimmed = options.gotra?.trim();
  const gotraTe = gotraTrimmed
    ? `శ్రీమతః ${gotraTrimmed} గోత్రస్య`
    : 'శ్రీమతః మమ గోత్రస్య';
  const gotraEn = gotraTrimmed
    ? `śrīmataḥ ${gotraTrimmed} gotrasya`
    : 'śrīmataḥ mama gotrasya';

  const nameTrimmed = options.name?.trim();
  const nameTe = nameTrimmed
    ? `${nameTrimmed} శర్మణః (నామధేయస్య) మమ`
    : 'శర్మణః (నామధేయస్య) మమ';
  const nameEn = nameTrimmed
    ? `${nameTrimmed} śarmaṇaḥ (nāmadheyasya) mama`
    : 'śarmaṇaḥ (nāmadheyasya) mama';

  const familyTe =
    options.includeFamily !== false
      ? 'సహకుటుంబస్య, సహకుటుంబానాం'
      : 'ఏకాకినః మమ';
  const familyEn =
    options.includeFamily !== false
      ? 'sahakuṭumbasya, sahakuṭumbānāṁ'
      : 'ekākinaḥ mama';

  // 3. Opening Prayer (Smartha vs Vaishnava)
  const openingTe =
    tradition === 'vaishnava'
      ? 'శుక్లాంబరధరం విష్ణుం శశివర్ణం చతుర్భుజం |\nప్రసన్నవదనం ధ్యాయేత్ సర్వవిఘ్నోపశాంతయే ||\n\nశ్రీభగవదాజ్ఞయా శ్రీమన్నారాయణ ప్రీత్యర్థం'
      : 'ఓం శుక్లాంబరధరం విష్ణుం శశివర్ణం చతుర్భుజం |\nప్రసన్నవదనం ధ్యాయేత్ సర్వవిఘ్నోపశాంతయే ||\n\nమమోపాత్త సమస్త దురితక్షయ ద్వారా శ్రీపరమేశ్వర ప్రీత్యర్థం';

  const openingEn =
    tradition === 'vaishnava'
      ? 'śuklāmbaradharaṁ viṣṇuṁ śaśivarṇaṁ caturbhujaṁ |\nprasannavadanaṁ dhyāyet sarvavighnopaśāntaye ||\n\nśrībhagavadājñayā śrīmannārāyaṇa prītyarthaṁ'
      : 'oṁ śuklāmbaradharaṁ viṣṇuṁ śaśivarṇaṁ caturbhujaṁ |\nprasannavadanaṁ dhyāyet sarvavighnopaśāntaye ||\n\nmamopātta samasta duritakṣaya dvārā śrīparameśvara prītyarthaṁ';

  // 4. Desha - Kala Segment
  const deshaKalaTe =
    'శుభే శోభనే ముహూర్తే, శ్రీమహావిష్ణోరాజ్ఞయా ప్రవర్తమానస్య, అద్య బ్రహ్మణః ద్వితీయ పరార్థే, శ్వేతవరాహ కల్పే, వైవస్వత మన్వంతరే, కలియుగే, ప్రథమ పాదే, జంబూద్వీపే, భరతవర్షే, భరతఖండే, మేరోర్దక్షిణ దిగ్భాగే, శ్రీశైలస్య ఈశాన్య ప్రదేశే, శోభనే గృహే, సమస్త దేవతా బ్రాహ్మణ హరిహర గురుచరణ సన్నిధౌ';

  const deshaKalaEn =
    'śubhe śobhane muhūrte, śrīmahāviṣṇorājñayā pravartamānasya, adya brahmaṇaḥ dvitīya parārdhe, śvetavarāha kalpe, vaivasvata manvantare, kaliyuge, prathama pāde, jambūdvīpe, bharatavarṣe, bharatakhaṇḍe, merordakṣiṇa digbhāge, śrīśailasya īśānya pradeśe, śobhane gṛhe, samasta devatā brāhmaṇa harihara gurucaraṇa sannidhau';

  // 5. Panchanga Portion
  const panchangaPortionTe = `${samvatsaraTe}, ${ayanaTe}, ${rituTe}, ${masaTe}, ${pakshaTe}, ${tithiTe}, ${vaaraTe}, ${nakshatraTe}, ${yogaTe}, ${karanaTe}, ఏవం గుణ విశేషణ విశిష్టాయాం శుభతిథౌ`;

  const panchangaPortionEn = `${samvatsaraEn}, ${ayanaEn}, ${rituEn}, ${masaEn}, ${pakshaEn}, ${tithiEn}, ${vaaraEn}, ${nakshatraEn}, ${yogaEn}, ${karanaEn}, evaṁ guṇa viśeṣaṇa viśiṣṭāyāṁ śubhatithau`;

  // 6. Karta Portion
  const kartaPortionTe = `${gotraTe}, ${nameTe}, ${familyTe}`;
  const kartaPortionEn = `${gotraEn}, ${nameEn}, ${familyEn}`;

  // 7. Purpose Portion & Bhavartha
  let titleTe = '';
  let titleEn = '';
  let purposePortionTe = '';
  let purposePortionEn = '';
  let bhavarthaTe = '';
  let bhavarthaEn = '';

  const supremeDeityTe = tradition === 'vaishnava' ? 'శ్రీమన్నారాయణ' : 'శ్రీపరమేశ్వర';
  const supremeDeityEn = tradition === 'vaishnava' ? 'śrīmannārāyaṇa' : 'śrīparameśvara';

  switch (options.type) {
    case 'pooja':
      titleTe = 'నిత్య దేవతార్చన / పూజా సంకల్పం';
      titleEn = 'Nitya Pooja / Devatarchana Sankalpam';
      purposePortionTe = `క్షేమస్థైర్య ధైర్య విజయ అభయ ఆయురారోగ్య ఐశ్వర్యాభివృద్ధ్యర్థం, ధర్మార్థ కామమోక్ష చతుర్విధ పురుషార్థ ఫలసిద్ధ్యర్థం, మమ ఇష్టకామ్యార్థ సిద్ధ్యర్థం, ${supremeDeityTe} ప్రీత్యర్థం, సంభవిత ప్రకారేణ యథాశక్తి పూజాం కరిష్యే.`;
      purposePortionEn = `kṣemasthairya dhairya vijaya abhaya āyurārogya aiśvaryābhivṛddhyarthaṁ, dharmārtha kāmamokṣa caturvidha puruṣārtha phalasiddhyarthaṁ, mama iṣṭakāmyārtha siddhyarthaṁ, ${supremeDeityEn} prītyarthaṁ, sambhavita prakāreṇa yathāśakti pūjāṁ kariṣye.`;
      bhavarthaTe = `సృష్టికర్త బ్రహ్మదేవుని కాలగణనలో, పవిత్ర భరతఖండంలో, శ్రీశైల క్షేత్ర ఈశాన్య భూభాగంలో, నేటి పవిత్ర దినమున (${panchanga.samvatsara.telugu} నామ సంవత్సరం, ${panchanga.masa.telugu}, ${panchanga.tithi.fullTelugu}) మా కుటుంబ సకల ఆయురారోగ్యాలు, ఐశ్వర్యం మరియు చతుర్విధ పురుషార్థాల సిద్ధి కొరకు భక్తితో ఈ నిత్య పూజను ఆచరిస్తున్నాను.`;
      bhavarthaEn = `Within the cosmic coordinates of time and space in sacred Bharata-khanda, on this auspicious day (${panchanga.samvatsara.english} Samvatsara, ${panchanga.masa.english}, ${panchanga.tithi.fullEnglish}), I perform this sacred worship with devotion for the health, prosperity, and spiritual fulfillment of my family.`;
      break;

    case 'sandhya_pratah':
      titleTe = 'ప్రాతః సంధ్యావందన సంకల్పం';
      titleEn = 'Pratah Sandhyavandana Sankalpam';
      purposePortionTe = `${supremeDeityTe} ప్రీత్యర్థం, ప్రాతః సంధ్యాముపాసిష్యే.`;
      purposePortionEn = `${supremeDeityEn} prītyarthaṁ, prātaḥ saṁdhyāmupāsiṣye.`;
      bhavarthaTe = `సూర్యోదయ ప్రాతఃకాలంలో, సమస్త పాపక్షయం మరియు భగవదనుగ్రహం కొరకు ప్రాతః సంధ్యావందనాన్ని ఆచరిస్తున్నాను.`;
      bhavarthaEn = `At early sunrise, I perform the morning Sandhyavandanam for the cleansing of impurities and the grace of the Supreme Divine.`;
      break;

    case 'sandhya_madhyahnika':
      titleTe = 'మాధ్యాహ్నిక సంధ్యావందన సంకల్పం';
      titleEn = 'Madhyahnika Sandhyavandana Sankalpam';
      purposePortionTe = `${supremeDeityTe} ప్రీత్యర్థం, మాధ్యాహ్నిక సంధ్యాముపాసిష్యే.`;
      purposePortionEn = `${supremeDeityEn} prītyarthaṁ, mādhyāhnika saṁdhyāmupāsiṣye.`;
      bhavarthaTe = `మధ్యాహ్న సంధ్యా సమయంలో, సూర్య భగవానుని సాక్షిగా మాధ్యాహ్నిక సంధ్యావందనాన్ని ఆచరిస్తున్నాను.`;
      bhavarthaEn = `At solar noon, I perform the noon Sandhyavandanam dedicated to the Supreme Lord.`;
      break;

    case 'sandhya_sayam':
      titleTe = 'సాయం సంధ్యావందన సంకల్పం';
      titleEn = 'Sayam Sandhyavandana Sankalpam';
      purposePortionTe = `${supremeDeityTe} ప్రీత్యర్థం, సాయం సంధ్యాముపాసిష్యే.`;
      purposePortionEn = `${supremeDeityEn} prītyarthaṁ, sāyaṁ saṁdhyāmupāsiṣye.`;
      bhavarthaTe = `సూర్యాస్తమయ సాయంకాలంలో, శాంతి మరియు ఆధ్యాత్మిక తేజస్సు కొరకు సాయం సంధ్యావందనాన్ని ఆచరిస్తున్నాను.`;
      bhavarthaEn = `At twilight sunset, I perform the evening Sandhyavandanam for peace and divine illumination.`;
      break;

    case 'gayatri_japa':
      titleTe = 'గాయత్రీ మహామంత్ర జప సంకల్పం';
      titleEn = 'Gayatri Mahamantra Japa Sankalpam';
      purposePortionTe = `${supremeDeityTe} ప్రీత్యర్థం, గాయత్రీ మహామంత్ర జపం కరిష్యే.`;
      purposePortionEn = `${supremeDeityEn} prītyarthaṁ, gāyatrī mahāmantra japaṁ kariṣye.`;
      bhavarthaTe = `బుద్ధి ప్రేరణ, తేజస్సు మరియు సర్వపాప విముక్తి కొరకు వేదమాత గాయత్రీ మహామంత్ర జపాన్ని ఆచరిస్తున్నాను.`;
      bhavarthaEn = `For spiritual brilliance, intellect purification, and universal illumination, I chant the sacred Gayatri Mahamantra.`;
      break;

    case 'japa':
    default:
      titleTe = 'ఇష్టదేవతా మంత్ర జప సాధన సంకల్పం';
      titleEn = 'Ishta Devata Mantra Japa Sankalpam';
      purposePortionTe = `మమ చిత్తశుద్ధి ద్వారా సర్వాభీష్ట సిద్ధ్యర్థం, శ్రీ ఇష్టదేవతా ప్రీత్యర్థం, యథాశక్తి మంత్ర జపం కరిష్యే.`;
      purposePortionEn = `mama cittaśuddhi dvārā sarvābhīṣṭa siddhyarthaṁ, śrī iṣṭadevatā prītyarthaṁ, yathāśakti mantra japaṁ kariṣye.`;
      bhavarthaTe = `మనశ్శాంతి, ఏకాగ్రత మరియు ఇష్టదేవతా కటాక్షం కొరకు భక్తితో ఈ మంత్ర జప సాధనను ఆచరిస్తున్నాను.`;
      bhavarthaEn = `For mental clarity, inner peace, and the blessing of the chosen Deity, I engage in this sacred mantra japa.`;
      break;
  }

  // Full unified texts
  const fullTextTe = `${openingTe}\n\n${deshaKalaTe}\n\n${panchangaPortionTe}\n\n${kartaPortionTe}\n\n${purposePortionTe}`;

  const fullTextEn = `${openingEn}\n\n${deshaKalaEn}\n\n${panchangaPortionEn}\n\n${kartaPortionEn}\n\n${purposePortionEn}`;

  return {
    telugu: {
      title: titleTe,
      opening: openingTe,
      deshaKala: deshaKalaTe,
      panchangaPortion: panchangaPortionTe,
      kartaPortion: kartaPortionTe,
      purposePortion: purposePortionTe,
      fullText: fullTextTe,
      bhavartha: bhavarthaTe,
    },
    english: {
      title: titleEn,
      opening: openingEn,
      deshaKala: deshaKalaEn,
      panchangaPortion: panchangaPortionEn,
      kartaPortion: kartaPortionEn,
      purposePortion: purposePortionEn,
      fullText: fullTextEn,
      bhavartha: bhavarthaEn,
    },
    tokens: {
      samvatsara: samvatsaraTe,
      ayana: ayanaTe,
      ritu: rituTe,
      masa: masaTe,
      paksha: pakshaTe,
      tithi: tithiTe,
      vaara: vaaraTe,
      nakshatra: nakshatraTe,
      yoga: yogaTe,
      karana: karanaTe,
    },
  };
}
