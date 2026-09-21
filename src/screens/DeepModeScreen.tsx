import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import type { Place } from '../data/places';
import { COLORS, RADII } from '../theme';

type Props = {
  place: Place;
  onBack: () => void;
};

export function DeepModeScreen({ place, onBack }: Props) {
  const [playing, setPlaying] = useState(false);
  const [chapter, setChapter] = useState(0);

  const currentChapter = place.chapters[chapter] ?? place.chapters[0]!;
  const currentLayer =
    place.layers[Math.min(chapter, place.layers.length - 1)] ?? place.layers[0]!;

  const progress = useMemo(
    () => ((chapter + 1) / Math.max(1, place.chapters.length)) * 100,
    [chapter, place.chapters.length],
  );

  useEffect(() => {
    return () => {
      void Speech.stop();
    };
  }, []);

  const stopSpeech = async () => {
    await Speech.stop();
    setPlaying(false);
  };

  const startSpeech = async () => {
    await Speech.stop();
    setPlaying(true);

    Speech.speak(
      `${place.name}. ${currentChapter.title}. ${currentChapter.body}`,
      {
        language: 'tr-TR',
        rate: 0.88,
        pitch: 1.0,
        onDone: () => setPlaying(false),
        onStopped: () => setPlaying(false),
        onError: () => setPlaying(false),
      },
    );
  };

  const toggleSpeech = () => {
    if (playing) {
      void stopSpeech();
    } else {
      void startSpeech();
    }
  };

  const selectChapter = (index: number) => {
    void Speech.stop();
    setPlaying(false);
    setChapter(index);
  };

  const previousChapter = () => {
    selectChapter(Math.max(0, chapter - 1));
  };

  const nextChapter = () => {
    selectChapter(Math.min(place.chapters.length - 1, chapter + 1));
  };

  return (
    <View style={styles.root}>
      <View style={styles.blueGlow} pointerEvents="none" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topRow}>
          <Pressable
            onPress={() => {
              void Speech.stop();
              onBack();
            }}
            style={styles.backButton}
          >
            <Text style={styles.back}>‹</Text>
          </Pressable>

          <View style={styles.titleBlock}>
            <Text style={styles.brand}>
              ZAMAN<Text style={styles.brandAccent}>ALTI</Text>
            </Text>
            <Text style={styles.modeName}>DERİN MOD · SESLİ ANLATIM</Text>
          </View>

          <View style={styles.livePill}>
            <View style={[styles.liveDot, playing && styles.liveDotActive]} />
            <Text style={styles.liveText}>{playing ? 'SES AÇIK' : 'HAZIR'}</Text>
          </View>
        </View>

        <View style={styles.stage}>
          <View style={styles.stageRingOuter} />
          <View style={styles.stageRingMiddle} />
          <View style={styles.stageRingInner} />
          <View style={[styles.stageCore, playing && styles.stageCorePlaying]}>
            <Text style={styles.stageGlyph}>{place.glyph}</Text>
          </View>
          <View style={styles.stageSignalA} />
          <View style={styles.stageSignalB} />
        </View>

        <Text style={styles.eyebrow}>
          {place.chapters.length} BÖLÜMLÜK KAYNAKLI ANLATIM
        </Text>
        <Text style={styles.placeName}>{place.name}</Text>
        <Text style={styles.subtitle}>
          Telefonunun Türkçe metin-okuma sesini kullanır. Bölümü seç, oynat ve
          gerçek mekâna bakarak dinle.
        </Text>

        <View style={styles.player}>
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>
              BÖLÜM {chapter + 1}/{place.chapters.length}
            </Text>
            <Text style={styles.progressLabel}>{Math.round(progress)}%</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
            <View
              style={[
                styles.progressDot,
                { left: `${Math.min(progress, 96)}%` },
              ]}
            />
          </View>

          <View style={styles.controls}>
            <Pressable
              disabled={chapter === 0}
              style={[
                styles.sideControl,
                chapter === 0 && styles.controlDisabled,
              ]}
              onPress={previousChapter}
            >
              <Text style={styles.sideControlText}>‹</Text>
              <Text style={styles.sideControlLabel}>ÖNCEKİ</Text>
            </Pressable>

            <Pressable onPress={toggleSpeech} style={styles.playButton}>
              <Text style={styles.playIcon}>{playing ? 'Ⅱ' : '▶'}</Text>
            </Pressable>

            <Pressable
              disabled={chapter === place.chapters.length - 1}
              style={[
                styles.sideControl,
                chapter === place.chapters.length - 1 &&
                  styles.controlDisabled,
              ]}
              onPress={nextChapter}
            >
              <Text style={styles.sideControlText}>›</Text>
              <Text style={styles.sideControlLabel}>SONRAKİ</Text>
            </Pressable>
          </View>

          <Text style={styles.nowLabel}>
            {playing ? 'ŞİMDİ DİNLİYORSUN' : 'SEÇİLİ BÖLÜM'}
          </Text>
          <Text style={styles.nowTitle}>{currentChapter.title}</Text>
          <Text style={styles.nowBody}>{currentChapter.body}</Text>
        </View>

        <View style={styles.contextStrip}>
          <View style={styles.contextOrb}>
            <Text style={styles.contextOrbText}>{currentLayer.year}</Text>
          </View>
          <View style={styles.contextCopy}>
            <Text style={styles.contextKicker}>ZAMAN BAĞLAMI</Text>
            <Text style={styles.contextTitle}>{currentLayer.label}</Text>
            <Text style={styles.contextBody}>{currentLayer.body}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Bölümler</Text>

        <View style={styles.chapterList}>
          {place.chapters.map((item, index) => (
            <Pressable
              key={item.title}
              onPress={() => selectChapter(index)}
              style={[
                styles.chapter,
                index === chapter && styles.chapterActive,
              ]}
            >
              <View
                style={[
                  styles.chapterIndex,
                  index === chapter && styles.chapterIndexActive,
                ]}
              >
                <Text
                  style={[
                    styles.chapterIndexText,
                    index === chapter && styles.chapterIndexTextActive,
                  ]}
                >
                  {String(index + 1).padStart(2, '0')}
                </Text>
              </View>

              <View style={styles.chapterCopy}>
                <Text style={styles.chapterTitle}>{item.title}</Text>
                <Text numberOfLines={2} style={styles.chapterPreview}>
                  {item.body}
                </Text>
              </View>

              <Text
                style={[
                  styles.chapterArrow,
                  index === chapter && styles.chapterArrowActive,
                ]}
              >
                {index === chapter && playing ? 'Ⅱ' : '→'}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.noScreenPanel}>
          <Text style={styles.noScreenKicker}>GERÇEK MEKÂNA BAK</Text>
          <Text style={styles.noScreenTitle}>
            Telefonu elinde tutmak zorunda değilsin.
          </Text>
          <Text style={styles.noScreenBody}>
            Anlatım başladıktan sonra ekranı aşağı indirip çevrene bakabilirsin.
            Bu prototip sistem metin-okuma kullanır; sonraki üretim aşamasında
            insan sesli kayıtları aynı bölüm yapısına bağlanabilir.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 38 },
  blueGlow: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: COLORS.blue,
    opacity: 0.1,
    top: 120,
    right: -210,
  },
  topRow: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: { color: COLORS.text, fontSize: 30, marginTop: -4 },
  titleBlock: { alignItems: 'center', flexShrink: 1, paddingHorizontal: 6 },
  brand: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2.4,
  },
  brandAccent: { color: COLORS.lime },
  modeName: {
    color: COLORS.cyan,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  livePill: {
    minWidth: 60,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 9,
    backgroundColor: 'rgba(203,255,0,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.22)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.muted,
    marginRight: 6,
  },
  liveDotActive: {
    backgroundColor: COLORS.lime,
  },
  liveText: {
    color: COLORS.lime,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  stage: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stageRingOuter: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.18)',
  },
  stageRingMiddle: {
    position: 'absolute',
    width: 194,
    height: 194,
    borderRadius: 97,
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.35)',
    borderStyle: 'dashed',
  },
  stageRingInner: {
    position: 'absolute',
    width: 136,
    height: 136,
    borderRadius: 68,
    borderWidth: 1,
    borderColor: 'rgba(255,106,0,0.32)',
  },
  stageCore: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#050B0F',
    borderWidth: 2,
    borderColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.lime,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  stageCorePlaying: {
    shadowOpacity: 0.8,
    shadowRadius: 28,
    elevation: 14,
  },
  stageGlyph: {
    color: COLORS.lime,
    fontSize: 38,
    fontWeight: '900',
  },
  stageSignalA: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.cyan,
    top: 62,
    right: 80,
  },
  stageSignalB: {
    position: 'absolute',
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.orange,
    bottom: 58,
    left: 64,
  },
  eyebrow: {
    color: COLORS.lime,
    fontSize: 9,
    letterSpacing: 1.7,
    fontWeight: '900',
  },
  placeName: {
    color: COLORS.text,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: -1.2,
    marginTop: 7,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 360,
  },
  player: {
    marginTop: 24,
    borderRadius: 30,
    padding: 18,
    backgroundColor: '#071018',
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.28)',
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: COLORS.muted,
    fontSize: 8,
    letterSpacing: 0.8,
    fontWeight: '800',
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#18252D',
    marginTop: 10,
    overflow: 'visible',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.cyan,
  },
  progressDot: {
    position: 'absolute',
    top: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.lime,
    marginLeft: -7,
  },
  controls: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideControl: {
    width: 66,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  controlDisabled: {
    opacity: 0.25,
  },
  sideControlText: {
    color: COLORS.text,
    fontSize: 20,
    lineHeight: 19,
    fontWeight: '700',
  },
  sideControlLabel: {
    color: COLORS.muted,
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.lime,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  playIcon: { color: '#050700', fontSize: 25, fontWeight: '900' },
  nowLabel: {
    color: COLORS.cyan,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.7,
    textAlign: 'center',
    marginTop: 19,
  },
  nowTitle: {
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 5,
  },
  nowBody: {
    color: '#A5B2B9',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 15,
  },
  contextStrip: {
    marginTop: 12,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contextOrb: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: COLORS.orange,
    backgroundColor: 'rgba(255,106,0,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextOrbText: {
    color: COLORS.orange,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  contextCopy: { flex: 1, paddingLeft: 13 },
  contextKicker: {
    color: COLORS.muted,
    fontSize: 7,
    letterSpacing: 1.4,
    fontWeight: '900',
  },
  contextTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 5,
  },
  contextBody: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 28,
    marginBottom: 10,
  },
  chapterList: { gap: 8 },
  chapter: {
    minHeight: 82,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#060B0F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  chapterActive: {
    borderColor: COLORS.lime,
    backgroundColor: 'rgba(203,255,0,0.045)',
  },
  chapterIndex: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterIndexActive: { borderColor: COLORS.lime },
  chapterIndexText: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '900',
  },
  chapterIndexTextActive: { color: COLORS.lime },
  chapterCopy: { flex: 1, paddingHorizontal: 12 },
  chapterTitle: { color: COLORS.text, fontSize: 13, fontWeight: '800' },
  chapterPreview: {
    color: COLORS.muted,
    fontSize: 9,
    lineHeight: 13,
    marginTop: 4,
  },
  chapterArrow: { color: COLORS.muted, fontSize: 17 },
  chapterArrowActive: { color: COLORS.lime },
  noScreenPanel: {
    marginTop: 22,
    borderRadius: RADII.lg,
    padding: 20,
    backgroundColor: '#090D09',
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.22)',
  },
  noScreenKicker: {
    color: COLORS.lime,
    fontSize: 8,
    letterSpacing: 1.7,
    fontWeight: '900',
  },
  noScreenTitle: {
    color: COLORS.text,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900',
    marginTop: 8,
  },
  noScreenBody: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 9,
  },
});
