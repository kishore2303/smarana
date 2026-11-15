# Google Play Store Listing & Submission Kit for Smarana (స్మరణ)

---

## 📱 1. Store Listing Details

### App Title (Max 30 characters)
```text
Smarana: Telugu Pooja & Japa
```
*(Length: 28 characters)*

### Short Description (Max 80 characters)
```text
Authentic Telugu Panchangam, Nitya Pooja Vidhanam, 108 Ashtottaram & Japa Mala.
```
*(Length: 79 characters)*

### Full Description (Up to 4,000 characters)
```text
స్మరణ (Smarana) – నిశ్శబ్దమైన, పవిత్రమైన, అంతర్జాలం అవసరం లేని నిత్య సాధన సహచరి.
Smarana is a 100% offline, privacy-first devotional companion designed for daily Telugu Panchangam, guided Nitya Pooja, 108 Ashtottaram, Japa Mala, and Pradakshina.

🔒 100% PRIVACY & OFFLINE (జీరో ప్రకటనలు · లాగిన్ అవసరం లేదు)
• No accounts, no sign-in, and zero advertisements.
• Works completely offline. Your sadhana, gotram, and prayer counts stay securely on your phone.

📅 ప్రామాణిక తెలుగు పంచాంగం & సంకల్పం (DAILY PANCHANGAM & SANKALPAM)
• Authentic Andhra Pradesh & Telangana Drik Panchangam calculated with precision astronomy.
• Today's Samvatsaram, Ayanam, Ritu, Masam, Paksham, Tithi, Nakshatram & Padam, Yogam, and Karanam.
• Auspicious & Inauspicious timings: Abhijit Muhurtham, Rahu Kalam, Yamagandam, Gulika Kalam, and Durmuhurtham.
• Authentic Sanskrit Sankalpam generator for Daily Pooja, Sandhyavandanam, and Gayatri Japa, customized with your Gotram and Sharma.
• Full Ugadi-to-Ugadi Telugu calendar view.

🪔 నిత్య పూజా విధానం (STEP-BY-STEP POOJA STEPPER)
• Overcome "order paralysis" with clear, ritual sequencing designed for modern homes.
• Dual Modes: Quick 5-minute Laghu Pooja (లఘు పూజ · 11 steps) for busy weekday mornings, and Shodashopachara Pooja (షోడశోపచార పూజ · 16 steps) for peaceful weekends and festivals.
• 3-Tier Visual Guidance:
  1. Action Box: Exact physical cue (e.g., "Offer water into the arghya plate thrice").
  2. Mantra Box: Sacred Sanskrit slokas in clear Telugu script and English phonetics.
  3. Meaning Box: Sacred Bhavartha explaining why the ritual is performed.
• Live Integration: Today's dynamic Sankalpam and 108 Ashtottaram Pushparchana are built directly into the stepper.
• Altar UX: 52px large touch targets for wet/sandalwood-coated fingers, plus 4-level font scaling for viewing from 1.5–2 ft away.

📲 1-TAP WHATSAPP SHARING (ఉదయ పంచాంగం షేర్)
• Share today's sacred Panchangam, Tithi, Nakshatram, and auspicious timings to family and temple WhatsApp groups with a single tap.
• Optional 6:00 AM daily morning reminder notification.

🌸 108 అష్టోత్తర శతనామావళి (108 DIVINE NAMES)
• Complete 108 divine names for 8 major deities: Lord Ganesha, Lord Shiva, Sri Venkateswara Swamy, Goddess Lakshmi, Lord Hanuman, Sri Krishna, Sri Rama, and Goddess Durga.
• Available in Telugu Lipi, Devanagari Sanskrit, and English (IAST).
• Interactive Pushparchana bookmarking to keep track of your active chant.

🚶‍♂️ స్మార్ట్ ప్రదక్షిణ ఆటో-లూప్ (SMART PRADAKSHINA TRACKER)
• Accelerometer-powered lap counter around the sanctum sanctorum (Garbhagudi).
• 1-Round Calibration: Walk 1 round and tap "Finish Round 1" to calibrate your step pace.
• Pocket Mode: Put your phone in your pocket and receive a clear double-vibration at the completion of every round. Never stare at a screen during circumambulation.

📿 జపమాల & బ్యాక్-ట్యాప్ కౌంటర్ (JAPA MALA COUNTER)
• 108 and 27 bead digital Mala rings.
• Gentle Meru bead haptic indication when completing 108 chants.
• Back-of-Phone Double-Tap: Count chants by gently double-tapping the back of your phone without touching the display.

👓 పెద్దల కోసం ప్రత్యేక శ్రద్ధ (ELDERLY-FRIENDLY DESIGN)
• High-contrast Vedic Gold and Slate colors gentle on tired eyes.
• Dynamic 4-level font scale (Normal, Large, Extra Large, Jumbo).
• Quick 1-tap Telugu ↔ English language toggle in the top header.

సమస్త సన్మంగళాని భవంతు · May your daily sadhana bring peace, focus, and divine grace.
```

---

## 🛡️ 2. Google Play Console Policy Answers

### Data Safety Form
* **Does your app collect or share any user data?** ➔ **No**
* **Is all user data encrypted in transit?** ➔ **N/A** (No network data transfer)
* **Do you provide a way for users to request data deletion?** ➔ **Yes** (All data can be wiped by clearing app storage or uninstalling)
* **Target Audience & Content**:
  * Age Group: **13 and older** (or **All Ages**)
  * Could this app appeal to children? **No** (Devotional utility for adults/families)

### Advertising & Ads
* **Does your app contain advertisements?** ➔ **No**

### App Category & Contact Information
* **Category**: **Lifestyle** or **Books & Reference**
* **Tags**: Devotional, Religion, Productivity, Lifestyle
* **Privacy Policy URL**: `https://github.com/kishore2303/smarana/blob/main/PRIVACY_POLICY.md`

---

## ⚙️ 3. Foreground Service Special Use Declaration (Android 14+ Requirement)

When prompted by Google Play Console regarding `FOREGROUND_SERVICE_SPECIAL_USE`:

* **Permission**: `android.permission.FOREGROUND_SERVICE_SPECIAL_USE`
* **Short Description of Use Case**:
  ```text
  Detects deliberate back-of-phone double-tap gestures during active Japa or Pradakshina sessions when the screen is locked or in pocket.
  ```
* **Detailed Explanation for Google Play Reviewer**:
  ```text
  Smarana is a devotional meditation and prayer counter app. When users perform Japa (chanting) or Pradakshina (temple circumambulation), they place the phone in their pocket to maintain reverent focus without looking at the screen. 
  
  The foreground service runs exclusively while an active user-initiated countdown session is in progress, maintaining a background sensor listener to detect deliberate back-of-phone double-taps and step cycles, and delivers silent haptic vibration when milestones (e.g. 108 chants or completed laps) are reached. The foreground service displays an ongoing notification showing current session progress and terminates immediately when the user pauses or completes the session.
  ```
