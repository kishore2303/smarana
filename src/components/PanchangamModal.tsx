import React, { useMemo, useState } from 'react';
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontSizeControl, ReadingFontSize } from './FontSizeControl';
import { PanchangaDatePickerModal } from './PanchangaDatePickerModal';
import { TabIcon } from './TabIcon';
import { TopLanguageToggle } from './TopLanguageToggle';
import {
  generateSankalpa,
  getPanchanga,
  SankalpaType,
  TraditionType,
} from '../engine/panchangamEngine';
import {
  formatPanchangaWhatsAppMessage,
  sharePanchangaWhatsApp,
} from '../utils/panchangaShare';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';

interface PanchangamModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PanchangamModal({ visible, onClose }: PanchangamModalProps) {
  const insets = useSafeAreaInsets();
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';

  // Active date for Panchangam & Sankalpam calculations
  const [activeDate, setActiveDate] = useState<Date>(() => new Date());

  // Date picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Active top-level tab: 'panchangam' | 'sankalpam'
  const [activeTab, setActiveTab] = useState<'panchangam' | 'sankalpam'>('panchangam');

  // Sankalpam configuration state
  const [sankalpaType, setSankalpaType] = useState<SankalpaType>('pooja');
  const [tradition, setTradition] = useState<TraditionType>('smartha');
  const [gotra, setGotra] = useState('');
  const [kartaName, setKartaName] = useState('');
  const [includeFamily, setIncludeFamily] = useState(true);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [readingFontSize, setReadingFontSize] = useState<ReadingFontSize>('large');

  const fontScale = {
    normal: { primary: 13, secondary: 11, line: 22, cardTitle: 14 },
    large: { primary: 16, secondary: 13, line: 26, cardTitle: 16 },
    xlarge: { primary: 19, secondary: 15, line: 31, cardTitle: 18 },
    jumbo: { primary: 23, secondary: 17, line: 37, cardTitle: 21 },
  }[readingFontSize];

  // Compute Panchangam for the active date
  const panchanga = useMemo(() => {
    return getPanchanga(activeDate);
  }, [activeDate]);

  // Compute Sankalpam for the active date & options
  const sankalpa = useMemo(() => {
    return generateSankalpa(panchanga, {
      type: sankalpaType,
      tradition,
      gotra,
      name: kartaName,
      includeFamily,
    });
  }, [panchanga, sankalpaType, tradition, gotra, kartaName, includeFamily]);

  // Check if activeDate is today
  const isToday = useMemo(() => {
    const now = new Date();
    return (
      activeDate.getDate() === now.getDate() &&
      activeDate.getMonth() === now.getMonth() &&
      activeDate.getFullYear() === now.getFullYear()
    );
  }, [activeDate]);

  const formattedCalendarDate = activeDate.toLocaleDateString(
    isTelugu ? 'te-IN' : 'en-US',
    {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );

  // Navigation handlers
  const handlePrevDay = () => {
    Haptics.selectionAsync().catch(() => {});
    setActiveDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() - 1);
      return next;
    });
  };

  const handleNextDay = () => {
    Haptics.selectionAsync().catch(() => {});
    setActiveDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 1);
      return next;
    });
  };

  const handleResetToToday = () => {
    Haptics.selectionAsync().catch(() => {});
    setActiveDate(new Date());
  };

  // Share Panchangam via WhatsApp (1-Tap)
  const handleSharePanchangamWhatsApp = async () => {
    Haptics.selectionAsync().catch(() => {});
    await sharePanchangaWhatsApp(panchanga, language);
  };

  // Quick copy or fallback share for Panchangam
  const handleCopyPanchangam = async () => {
    Haptics.selectionAsync().catch(() => {});
    const message = formatPanchangaWhatsAppMessage(panchanga, language);
    try {
      await Share.share({
        message,
        title: isTelugu ? 'నేటి తెలుగు పంచాంగం' : 'Daily Telugu Panchangam',
      });
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    } catch {
      // User dismissed
    }
  };

  // Share Sankalpam via WhatsApp (1-Tap)
  const handleShareSankalpamWhatsApp = async () => {
    Haptics.selectionAsync().catch(() => {});
    const textToShare = isTelugu
      ? `🪷 *${sankalpa.telugu.title}*\n\n${sankalpa.telugu.fullText}\n\n*[${t.panchangam.bhavarthaTitle}]*\n${sankalpa.telugu.bhavartha}\n\n🙏 *స్మరణ (Smarana)*`
      : `🪷 *${sankalpa.english.title}*\n\n${sankalpa.english.fullText}\n\n*[${t.panchangam.bhavarthaTitle}]*\n${sankalpa.english.bhavartha}\n\n🙏 *Shared via Smarana*`;

    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(textToShare)}`;
    try {
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
        return;
      }
    } catch {
      // Fallback
    }

    try {
      await Share.share({
        message: textToShare,
        title: isTelugu ? sankalpa.telugu.title : sankalpa.english.title,
      });
    } catch {}
  };

  // Share / Copy Sankalpam
  const handleShareSankalpam = async () => {
    Haptics.selectionAsync().catch(() => {});
    const textToShare = isTelugu
      ? `${sankalpa.telugu.title}\n\n${sankalpa.telugu.fullText}\n\n[${t.panchangam.bhavarthaTitle}]\n${sankalpa.telugu.bhavartha}`
      : `${sankalpa.english.title}\n\n${sankalpa.english.fullText}\n\n[${t.panchangam.bhavarthaTitle}]\n${sankalpa.english.bhavartha}`;

    try {
      await Share.share({
        message: textToShare,
        title: isTelugu ? sankalpa.telugu.title : sankalpa.english.title,
      });
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    } catch {
      // User dismissed share sheet
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleWrap}>
            <View style={styles.headerBadgeRow}>
              <TabIcon name="Panchangam" color={colors.goldSoft} size={16} />
              <Text style={styles.headerEyebrow}>
                {isTelugu ? 'ఆంధ్ర సంప్రదాయం' : 'TELUGU DRIK GANITHA'}
              </Text>
            </View>
            <Text style={styles.headerTitle}>{t.panchangam.title}</Text>
          </View>

          <View style={styles.headerRightGroup}>
            <FontSizeControl
              size={readingFontSize}
              onChangeSize={setReadingFontSize}
              compact
            />
            <TopLanguageToggle compact />
            <Pressable
              style={styles.closeBtn}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t.panchangam.close}
              hitSlop={10}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>
        </View>

        {/* Tab Switcher: Panchangam vs Sankalpam */}
        <View style={styles.tabSwitcher}>
          <Pressable
            style={[
              styles.tabBtn,
              activeTab === 'panchangam' && styles.tabBtnActive,
            ]}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              setActiveTab('panchangam');
            }}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'panchangam' && styles.tabBtnTextActive,
              ]}
            >
              📜 {t.panchangam.panchangamTab}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tabBtn,
              activeTab === 'sankalpam' && styles.tabBtnActive,
            ]}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              setActiveTab('sankalpam');
            }}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'sankalpam' && styles.tabBtnTextActive,
              ]}
            >
              🪷 {t.panchangam.sankalpamTab}
            </Text>
          </Pressable>
        </View>

        {/* Date Selector Navigation Bar */}
        <View style={styles.dateNavRow}>
          <Pressable
            style={styles.dateNavBtn}
            onPress={handlePrevDay}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Previous Day"
          >
            <Text style={styles.dateNavArrow}>‹</Text>
          </Pressable>

          <Pressable
            style={[
              styles.dateDisplayBtn,
              isToday && styles.dateDisplayBtnActive,
            ]}
            onPress={() => setShowDatePicker(true)}
            accessibilityRole="button"
            accessibilityLabel="Open Ugadi Date Picker"
          >
            <View style={styles.dateDisplayCenter}>
              <Text style={styles.dateDisplayText}>{formattedCalendarDate}</Text>
              <View style={styles.dateDisplaySubRow}>
                <Text style={styles.dateDisplaySubMasa}>
                  {isTelugu ? panchanga.masa.telugu : panchanga.masa.english} ·{' '}
                  {isTelugu ? panchanga.tithi.telugu : panchanga.tithi.english}
                </Text>
                {isToday ? (
                  <View style={styles.todayPill}>
                    <Text style={styles.todayPillText}>{t.panchangam.today}</Text>
                  </View>
                ) : (
                  <Pressable
                    style={styles.jumpTodayPill}
                    onPress={handleResetToToday}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel="Return to today"
                  >
                    <Text style={styles.jumpTodayPillText}>
                      ☀️ {t.panchangam.today}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </Pressable>

          <Pressable
            style={styles.dateNavBtn}
            onPress={handleNextDay}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Next Day"
          >
            <Text style={styles.dateNavArrow}>›</Text>
          </Pressable>

          {/* Quick Calendar Icon Button */}
          <Pressable
            style={styles.calendarIconBtn}
            onPress={() => setShowDatePicker(true)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t.panchangam.calendarButton}
          >
            <Text style={styles.calendarIconText}>📅</Text>
          </Pressable>
        </View>

        {/* MAIN CONTENT AREA */}
        {activeTab === 'panchangam' ? (
          /* PANCHANGAM TAB - CLEAN, UNCLUTTERED, SERENE */
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 1-Tap WhatsApp Share Bar */}
            <View style={styles.shareActionBar}>
              <Pressable
                style={({ pressed }) => [
                  styles.whatsAppShareBtn,
                  pressed && styles.whatsAppShareBtnPressed,
                ]}
                onPress={handleSharePanchangamWhatsApp}
                accessibilityRole="button"
                accessibilityLabel={t.panchangam.shareWhatsApp}
              >
                <TabIcon name="WhatsApp" color="#FFFFFF" size={17} />
                <Text style={styles.whatsAppShareBtnText}>
                  {t.panchangam.shareWhatsApp}
                </Text>
              </Pressable>
              <Pressable
                style={styles.quickCopyBtn}
                onPress={handleCopyPanchangam}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Copy or Share"
              >
                <Text style={styles.quickCopyBtnText}>
                  {copyFeedback
                    ? (isTelugu ? '✓ కాపీ అయింది' : '✓ Copied')
                    : (isTelugu ? '📋 కాపీ / ఇతర' : '📋 Copy / Other')}
                </Text>
              </Pressable>
            </View>

            {/* Special Day Banner (Ekadashi, Pradosham, Pournami, etc.) */}
            {panchanga.specialDayNotes.telugu ? (
              <View style={styles.specialBanner}>
                <Text style={styles.specialBannerIcon}>🪷</Text>
                <View style={styles.specialBannerTextWrap}>
                  <Text style={styles.specialBannerTitle}>
                    {t.panchangam.specialDay}
                  </Text>
                  <Text style={styles.specialBannerText}>
                    {isTelugu
                      ? panchanga.specialDayNotes.telugu
                      : panchanga.specialDayNotes.english ||
                        panchanga.specialDayNotes.telugu}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* 1. Serene Panchanga Header Strip (Samvatsara, Ayana, Ritu, Masa) */}
            <View style={styles.sereneHeaderCard}>
              <View style={styles.sereneHeaderTop}>
                <Text style={styles.sereneSamvatsaraText}>
                  {isTelugu
                    ? `శ్రీ ${panchanga.samvatsara.telugu} నామ సంవత్సరం`
                    : `Sri ${panchanga.samvatsara.english} Nama Samvatsaram`}
                </Text>
                <View style={styles.sereneAyanaPill}>
                  <Text style={styles.sereneAyanaText}>
                    {isTelugu ? panchanga.ayana.telugu : panchanga.ayana.english}
                  </Text>
                </View>
              </View>
              <Text style={styles.sereneSubText}>
                {isTelugu
                  ? `${panchanga.ritu.telugu} · ${panchanga.masa.telugu} మాసం`
                  : `${panchanga.ritu.english.split(' ')[0]} Ritu · ${panchanga.masa.english}`}
              </Text>
            </View>

            {/* 2. Unified 5 Angas Card (Pancha Angalu) */}
            <View style={styles.cardContainer}>
              <View style={styles.cardHeaderRow}>
                <TabIcon name="Panchangam" color={colors.gold} size={14} />
                <Text style={styles.cardHeaderTitle}>
                  {isTelugu ? 'పంచ అంగాలు (దివ్య విశేషాలు)' : 'The 5 Limbs (Pancha Angas)'}
                </Text>
              </View>

              <View style={styles.angaGrid}>
                {/* 1. Tithi */}
                <View style={styles.angaGridItem}>
                  <Text style={styles.angaItemLabel}>{t.panchangam.tithi}</Text>
                  <Text style={[styles.angaItemValue, { fontSize: fontScale.primary }]}>
                    {isTelugu ? panchanga.tithi.fullTelugu : panchanga.tithi.fullEnglish}
                  </Text>
                </View>

                {/* 2. Vaaram */}
                <View style={styles.angaGridItem}>
                  <Text style={styles.angaItemLabel}>{t.panchangam.vaara}</Text>
                  <Text style={[styles.angaItemValue, { fontSize: fontScale.primary }]}>
                    {isTelugu ? panchanga.dayOfWeek.telugu : panchanga.dayOfWeek.english}
                  </Text>
                </View>

                {/* 3. Nakshatra with Pada */}
                <View style={styles.angaGridItem}>
                  <Text style={styles.angaItemLabel}>{t.panchangam.nakshatra}</Text>
                  <Text style={[styles.angaItemValue, { fontSize: fontScale.primary }]}>
                    {isTelugu
                      ? `${panchanga.nakshatra.telugu} (${panchanga.nakshatra.pada}వ పాదం)`
                      : `${panchanga.nakshatra.english} (Pada ${panchanga.nakshatra.pada})`}
                  </Text>
                  <Text style={[styles.angaItemSub, { fontSize: fontScale.secondary }]}>
                    {isTelugu ? `అధిదేవత: ${panchanga.nakshatra.deity}` : `Deity: ${panchanga.nakshatra.deity}`}
                  </Text>
                </View>

                {/* 4. Yoga */}
                <View style={styles.angaGridItem}>
                  <Text style={styles.angaItemLabel}>{t.panchangam.yoga}</Text>
                  <Text style={[styles.angaItemValue, { fontSize: fontScale.primary }]}>
                    {isTelugu ? panchanga.yoga.telugu : panchanga.yoga.english}
                  </Text>
                </View>

                {/* 5. Karana */}
                <View style={[styles.angaGridItem, { borderBottomWidth: 0 }]}>
                  <Text style={styles.angaItemLabel}>{t.panchangam.karana}</Text>
                  <Text style={[styles.angaItemValue, { fontSize: fontScale.primary }]}>
                    {isTelugu ? panchanga.karana.telugu : panchanga.karana.english}
                  </Text>
                </View>

                {/* Paksha limb detail */}
                <View style={[styles.angaGridItem, { borderBottomWidth: 0 }]}>
                  <Text style={styles.angaItemLabel}>{t.panchangam.paksha}</Text>
                  <Text style={[styles.angaItemValue, { fontSize: fontScale.primary }]}>
                    {isTelugu ? panchanga.paksha.telugu : panchanga.paksha.english}
                  </Text>
                </View>
              </View>
            </View>

            {/* 3. Unified Daily Timings Card */}
            <View style={styles.cardContainer}>
              <View style={styles.cardHeaderRow}>
                <TabIcon name="History" color={colors.gold} size={14} />
                <Text style={styles.cardHeaderTitle}>
                  {t.panchangam.timingsSection}
                </Text>
              </View>

              {/* Primary Auspicious / Inauspicious Highlights */}
              <View style={styles.timingHighlightRow}>
                {/* Abhijit Muhurtham */}
                <View style={styles.timingHighlightBox}>
                  <Text style={styles.timingHighlightLabelGold}>
                    ☀️ {t.panchangam.abhijit}
                  </Text>
                  <Text style={styles.timingHighlightValueGold}>
                    {panchanga.timings.abhijitMuhurtham}
                  </Text>
                </View>

                {/* Rahu Kalam */}
                <View style={[styles.timingHighlightBox, styles.timingHighlightBoxDanger]}>
                  <Text style={styles.timingHighlightLabelDanger}>
                    ⚠️ {t.panchangam.rahuKalam}
                  </Text>
                  <Text style={styles.timingHighlightValueDanger}>
                    {panchanga.timings.rahuKalam}
                  </Text>
                </View>
              </View>

              {/* Secondary Timings List */}
              <View style={styles.secondaryTimingsList}>
                <View style={styles.secondaryTimingRow}>
                  <Text style={styles.secondaryTimingLabel}>{t.panchangam.yamagandam}:</Text>
                  <Text style={styles.secondaryTimingValue}>{panchanga.timings.yamagandam}</Text>
                </View>
                <View style={styles.secondaryTimingRow}>
                  <Text style={styles.secondaryTimingLabel}>{t.panchangam.gulikaKalam}:</Text>
                  <Text style={styles.secondaryTimingValue}>{panchanga.timings.gulikaKalam}</Text>
                </View>
                <View style={styles.secondaryTimingRow}>
                  <Text style={styles.secondaryTimingLabel}>{t.panchangam.durmuhurtham}:</Text>
                  <Text style={styles.secondaryTimingValueDanger}>{panchanga.timings.durmuhurtham}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        ) : (
          /* SANKALPAM TAB - STREAMLINED & SACRED */
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Purpose Selector Pills */}
            <View style={styles.sankalpaSection}>
              <Text style={styles.sankalpaSectionLabel}>
                {t.panchangam.purpose}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.purposePillsScroll}
              >
                <Pressable
                  style={[
                    styles.purposePill,
                    sankalpaType === 'pooja' && styles.purposePillActive,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setSankalpaType('pooja');
                  }}
                >
                  <Text
                    style={[
                      styles.purposePillText,
                      sankalpaType === 'pooja' && styles.purposePillTextActive,
                    ]}
                  >
                    🪷 {t.panchangam.poojaPurpose}
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.purposePill,
                    sankalpaType === 'sandhya_pratah' && styles.purposePillActive,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setSankalpaType('sandhya_pratah');
                  }}
                >
                  <Text
                    style={[
                      styles.purposePillText,
                      sankalpaType === 'sandhya_pratah' &&
                        styles.purposePillTextActive,
                    ]}
                  >
                    🌅 {t.panchangam.pratahSandhya}
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.purposePill,
                    sankalpaType === 'sandhya_madhyahnika' &&
                      styles.purposePillActive,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setSankalpaType('sandhya_madhyahnika');
                  }}
                >
                  <Text
                    style={[
                      styles.purposePillText,
                      sankalpaType === 'sandhya_madhyahnika' &&
                        styles.purposePillTextActive,
                    ]}
                  >
                    ☀️ {t.panchangam.madhyahnikaSandhya}
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.purposePill,
                    sankalpaType === 'sandhya_sayam' && styles.purposePillActive,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setSankalpaType('sandhya_sayam');
                  }}
                >
                  <Text
                    style={[
                      styles.purposePillText,
                      sankalpaType === 'sandhya_sayam' &&
                        styles.purposePillTextActive,
                    ]}
                  >
                    🌇 {t.panchangam.sayamSandhya}
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.purposePill,
                    sankalpaType === 'gayatri_japa' && styles.purposePillActive,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setSankalpaType('gayatri_japa');
                  }}
                >
                  <Text
                    style={[
                      styles.purposePillText,
                      sankalpaType === 'gayatri_japa' &&
                        styles.purposePillTextActive,
                    ]}
                  >
                    📿 {t.panchangam.gayatriJapa}
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.purposePill,
                    sankalpaType === 'japa' && styles.purposePillActive,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setSankalpaType('japa');
                  }}
                >
                  <Text
                    style={[
                      styles.purposePillText,
                      sankalpaType === 'japa' && styles.purposePillTextActive,
                    ]}
                  >
                    🙏 {t.panchangam.japaPurpose}
                  </Text>
                </Pressable>
              </ScrollView>
            </View>

            {/* Tradition Control Only (Language toggle removed, follows Settings) */}
            <View style={styles.traditionRow}>
              <Text style={styles.traditionLabel}>{t.panchangam.tradition}</Text>
              <View style={styles.segmentedToggle}>
                <Pressable
                  style={[
                    styles.segmentBtn,
                    tradition === 'smartha' && styles.segmentBtnActive,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setTradition('smartha');
                  }}
                >
                  <Text
                    style={[
                      styles.segmentBtnText,
                      tradition === 'smartha' && styles.segmentBtnTextActive,
                    ]}
                  >
                    {isTelugu ? 'స్మార్త (పరమేశ్వర)' : 'Smartha'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.segmentBtn,
                    tradition === 'vaishnava' && styles.segmentBtnActive,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setTradition('vaishnava');
                  }}
                >
                  <Text
                    style={[
                      styles.segmentBtnText,
                      tradition === 'vaishnava' && styles.segmentBtnTextActive,
                    ]}
                  >
                    {isTelugu ? 'వైష్ణవ (నారాయణ)' : 'Vaishnava'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Optional Personal Details Accordion */}
            <View style={styles.personalDetailsCard}>
              <Pressable
                style={styles.personalDetailsHeader}
                onPress={() => setShowPersonalDetails((prev) => !prev)}
                accessibilityRole="button"
              >
                <View style={styles.personalDetailsHeaderLeft}>
                  <Text style={styles.personalDetailsTitle}>
                    {t.panchangam.personalDetails}
                  </Text>
                  <Text style={styles.personalDetailsSub} numberOfLines={1}>
                    {gotra || kartaName
                      ? `${gotra ? `గోత్రం: ${gotra}  ` : ''}${
                          kartaName ? `పేరు: ${kartaName}` : ''
                        }`
                      : t.panchangam.personalDetailsHint}
                  </Text>
                </View>
                <Text style={styles.accordionArrow}>
                  {showPersonalDetails ? '▲' : '▼'}
                </Text>
              </Pressable>

              {showPersonalDetails && (
                <View style={styles.personalDetailsBody}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      {t.panchangam.gotramLabel}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      value={gotra}
                      onChangeText={setGotra}
                      placeholder={
                        isTelugu ? 'ఉదా: శ్రీవత్స, కాశ్యప...' : 'e.g. Srivatsa, Kashyapa...'
                      }
                      placeholderTextColor={colors.textMuted}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t.panchangam.nameLabel}</Text>
                    <TextInput
                      style={styles.textInput}
                      value={kartaName}
                      onChangeText={setKartaName}
                      placeholder={
                        isTelugu ? 'ఉదా: కృష్ణ శర్మ, రామ...' : 'e.g. Krishna Sharma...'
                      }
                      placeholderTextColor={colors.textMuted}
                      autoCapitalize="words"
                    />
                  </View>

                  <Pressable
                    style={styles.checkboxRow}
                    onPress={() => setIncludeFamily((prev) => !prev)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        includeFamily && styles.checkboxActive,
                      ]}
                    >
                      {includeFamily ? <Text style={styles.checkmark}>✓</Text> : null}
                    </View>
                    <Text style={styles.checkboxLabel}>
                      {t.panchangam.includeFamilyLabel}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Sacred Sankalpa Card */}
            <View style={styles.sankalpaCard}>
              <View style={styles.sankalpaCardHeader}>
                <Text style={styles.sankalpaCardLotus}>🪷</Text>
                <Text style={styles.sankalpaCardTitle}>
                  {isTelugu ? sankalpa.telugu.title : sankalpa.english.title}
                </Text>
              </View>

              {/* Tokens Highlights Summary */}
              <View style={styles.tokenPillRow}>
                <View style={styles.tokenChip}>
                  <Text style={styles.tokenChipText}>
                    {sankalpa.tokens.samvatsara}
                  </Text>
                </View>
                <View style={styles.tokenChip}>
                  <Text style={styles.tokenChipText}>{sankalpa.tokens.masa}</Text>
                </View>
                <View style={styles.tokenChip}>
                  <Text style={styles.tokenChipText}>{sankalpa.tokens.tithi}</Text>
                </View>
                <View style={styles.tokenChip}>
                  <Text style={styles.tokenChipText}>{sankalpa.tokens.vaara}</Text>
                </View>
              </View>

              <View style={styles.sankalpaDivider} />

              {/* Sanskrit Text Content */}
              <Text
                style={[
                  styles.sankalpaText,
                  { fontSize: fontScale.primary, lineHeight: fontScale.line },
                ]}
              >
                {isTelugu ? sankalpa.telugu.fullText : sankalpa.english.fullText}
              </Text>
            </View>

            {/* Bhavartha / Meaning Card */}
            <View style={styles.bhavarthaCard}>
              <Text style={styles.bhavarthaHeader}>
                {t.panchangam.bhavarthaTitle}
              </Text>
              <Text
                style={[
                  styles.bhavarthaBody,
                  {
                    fontSize: fontScale.secondary,
                    lineHeight: fontScale.line - 6,
                  },
                ]}
              >
                {isTelugu
                  ? sankalpa.telugu.bhavartha
                  : sankalpa.english.bhavartha}
              </Text>
            </View>

            {/* Copy / Share Button */}
            <View style={styles.sankalpaActionRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.sankalpaWhatsAppBtn,
                  pressed && styles.whatsAppShareBtnPressed,
                ]}
                onPress={handleShareSankalpamWhatsApp}
                accessibilityRole="button"
                accessibilityLabel={t.panchangam.shareSankalpamWhatsApp}
              >
                <TabIcon name="WhatsApp" color="#FFFFFF" size={17} />
                <Text style={styles.whatsAppShareBtnText}>
                  {t.panchangam.shareSankalpamWhatsApp}
                </Text>
              </Pressable>

              <Pressable
                style={styles.shareBtn}
                onPress={handleShareSankalpam}
                accessibilityRole="button"
              >
                <Text style={styles.shareBtnIcon}>📋</Text>
                <Text style={styles.shareBtnText}>
                  {copyFeedback
                    ? t.panchangam.copiedSankalpam
                    : t.panchangam.copySankalpam}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        )}

        {/* Ugadi Date Picker Modal */}
        <PanchangaDatePickerModal
          visible={showDatePicker}
          activeDate={activeDate}
          onSelectDate={(newDate) => {
            setActiveDate(newDate);
          }}
          onClose={() => setShowDatePicker(false)}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  headerEyebrow: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },

  /* Tab Switcher */
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  tabBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: colors.gold,
    fontWeight: '700',
  },

  /* Date Navigation Row */
  dateNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  dateNavBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNavArrow: {
    color: colors.gold,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
  },
  dateDisplayBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  dateDisplayBtnActive: {
    borderColor: colors.gold,
  },
  dateDisplayCenter: {
    alignItems: 'center',
  },
  dateDisplayText: {
    color: colors.ivoryWarm,
    fontSize: 14,
    fontWeight: '700',
  },
  dateDisplaySubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  dateDisplaySubMasa: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: '500',
  },
  todayPill: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.goldSoft,
  },
  todayPillText: {
    color: colors.gold,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  jumpTodayPill: {
    backgroundColor: '#1E352B',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  jumpTodayPillText: {
    color: colors.gold,
    fontSize: 9,
    fontWeight: '700',
  },
  calendarIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarIconText: {
    fontSize: 16,
  },

  /* Scroll Area */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 24,
  },

  /* Special Banner */
  specialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A1B0E',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 12,
    padding: 11,
    marginBottom: 10,
    gap: 10,
  },
  specialBannerIcon: {
    fontSize: 22,
  },
  specialBannerTextWrap: {
    flex: 1,
  },
  specialBannerTitle: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  specialBannerText: {
    color: colors.ivoryWarm,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },

  /* 1. Serene Header Strip (Samvatsara & Ritu/Masa) */
  sereneHeaderCard: {
    backgroundColor: '#10221A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  sereneHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  sereneSamvatsaraText: {
    color: colors.ivoryWarm,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  sereneAyanaPill: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.goldSoft,
  },
  sereneAyanaText: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: '700',
  },
  sereneSubText: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: '500',
  },

  /* Card Containers */
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 13,
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardHeaderTitle: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  /* 2. 5 Angas Grid */
  angaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  angaGridItem: {
    width: '50%',
    paddingVertical: 7,
    paddingRight: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  angaItemLabel: {
    color: colors.goldSoft,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  angaItemValue: {
    color: colors.ivoryWarm,
    fontSize: 13,
    fontWeight: '700',
  },
  angaItemSub: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 1,
  },

  /* 3. Daily Timings */
  timingHighlightRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  timingHighlightBox: {
    flex: 1,
    backgroundColor: '#16281F',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.35)',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  timingHighlightBoxDanger: {
    backgroundColor: '#251714',
    borderColor: 'rgba(217, 107, 67, 0.35)',
  },
  timingHighlightLabelGold: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  timingHighlightValueGold: {
    color: colors.ivoryWarm,
    fontSize: 12,
    fontWeight: '700',
  },
  timingHighlightLabelDanger: {
    color: colors.danger,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  timingHighlightValueDanger: {
    color: colors.ivoryWarm,
    fontSize: 12,
    fontWeight: '700',
  },
  secondaryTimingsList: {
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 4,
  },
  secondaryTimingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secondaryTimingLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  secondaryTimingValue: {
    color: colors.ivoryWarm,
    fontSize: 11,
    fontWeight: '600',
  },
  secondaryTimingValueDanger: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: '600',
  },

  /* SANKALPAM TAB STYLES */
  sankalpaSection: {
    marginBottom: 10,
  },
  sankalpaSectionLabel: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  purposePillsScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  purposePill: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  purposePillActive: {
    backgroundColor: '#1E352B',
    borderColor: colors.gold,
  },
  purposePillText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  purposePillTextActive: {
    color: colors.gold,
    fontWeight: '700',
  },
  traditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  traditionLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  segmentedToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    padding: 2,
  },
  segmentBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 7,
  },
  segmentBtnActive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  segmentBtnText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  segmentBtnTextActive: {
    color: colors.gold,
    fontWeight: '700',
  },

  /* Personal Details Accordion */
  personalDetailsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  personalDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 11,
  },
  personalDetailsHeaderLeft: {
    flex: 1,
  },
  personalDetailsTitle: {
    color: colors.ivoryWarm,
    fontSize: 12,
    fontWeight: '700',
  },
  personalDetailsSub: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 1,
  },
  accordionArrow: {
    color: colors.gold,
    fontSize: 10,
    marginLeft: 8,
  },
  personalDetailsBody: {
    padding: 11,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputGroup: {
    marginBottom: 8,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 3,
  },
  textInput: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: colors.ivoryWarm,
    fontSize: 13,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  checkmark: {
    color: colors.textOnGold,
    fontSize: 11,
    fontWeight: '800',
  },
  checkboxLabel: {
    color: colors.ivoryWarm,
    fontSize: 11,
    fontWeight: '600',
  },

  /* Sacred Sankalpa Card */
  sankalpaCard: {
    backgroundColor: '#121A15',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.gold,
    padding: 14,
    marginBottom: 12,
  },
  sankalpaCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sankalpaCardLotus: {
    fontSize: 18,
  },
  sankalpaCardTitle: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  tokenPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 10,
  },
  tokenChip: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tokenChipText: {
    color: colors.goldSoft,
    fontSize: 10,
    fontWeight: '600',
  },
  sankalpaDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 10,
  },
  sankalpaText: {
    color: colors.ivoryWarm,
    fontSize: 13,
    lineHeight: 22,
    letterSpacing: 0.3,
    fontWeight: '500',
  },

  /* Bhavartha Card */
  bhavarthaCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 12,
  },
  bhavarthaHeader: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  bhavarthaBody: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },

  /* 1-Tap WhatsApp Share Bar Styles */
  shareActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  whatsAppShareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1EBE5D',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(37, 211, 102, 0.4)',
  },
  whatsAppShareBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  whatsAppShareBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  quickCopyBtn: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCopyBtnText: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: '600',
  },
  sankalpaWhatsAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1EBE5D',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(37, 211, 102, 0.4)',
  },

  /* Action Row */
  sankalpaActionRow: {
    marginBottom: 10,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.gold,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shareBtnIcon: {
    fontSize: 15,
  },
  shareBtnText: {
    color: colors.textOnGold,
    fontSize: 14,
    fontWeight: '700',
  },
});
