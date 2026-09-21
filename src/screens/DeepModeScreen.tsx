import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Place } from '../data/places';
import { COLORS, RADII } from '../theme';

type Props = {
  place: Place;
  onBack: () => void;
};

const CHAPTERS = [
  { title: 'Önce mekânı dinle', minutes: '00:00–06:30' },
  { title: 'İlk katmanın kurulması', minutes: '06:30–14:00' },
  { title: 'İnsanlar ve gündelik hayat', minutes: '14:00–22:30' },
  { title: 'Dönüşüm anı', minutes: '22:30–29:00' },
  { title: 'Bugüne kalan izler', minutes: '29:00–36:00' },
];

export function DeepModeScreen({ place, onBack }: Props) {
  const [playing, setPlaying] = useState(false);
  const [chapter, setChapter] = useState(0);

  const progress = useMemo(() => 18 + chapter * 17, [chapter]);

  return (
    <View style={styles.root}>
      <View style={styles.blueGlow} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topRow}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <View style={styles.titleBlock}>
            <Text style={styles.brand}>
              ZAMAN<Text style={styles.brandAccent}>ALTI</Text>
            </Text>
            <Text style={styles.modeName}>DERİN MOD</Text>
          </View>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>CANLI</Text>
          </View>
        </View>

        <View style={styles.stage}>
          <View style={styles.stageRingOuter} />
          <View style={styles.stageRingMiddle} />
          <View style={styles.stageRingInner} />
          <View style={styles.stageCore}>
            <Text style={styles.stageGlyph}>{place.glyph}</Text>
          </View>
          <View style={styles.stageSignalA} />
          <View style={styles.stageSignalB} />
        </View>

        <Text style={styles.eyebrow}>36 DAKİKALIK SESLİ YOLCULUK</Text>
        <Text style={styles.placeName}>{place.name}</Text>
        <Text style={styles.subtitle}>
          Ekrana bakmak zorunda olmadığın; mekânın içinde yürürken ses,
          zaman çizgisi ve bağlamsal ipuçlarının birlikte ilerlediği anlatı.
        </Text>

        <View style={styles.player}>
          <View style={styles.progressTop}>
            <Text style={styles.time}>06:42</Text>
            <Text style={styles.time}>36:00</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
            <View style={[styles.progressDot, { left: `${Math.min(progress, 94)}%` }]} />
          </View>

          <View style={styles.controls}>
            <Pressable
              style={styles.sideControl}
              onPress={() => setChapter((value) => Math.max(0, value - 1))}
            >
              <Text style={styles.sideControlText}>−15</Text>
            </Pressable>

            <Pressable
              onPress={() => setPlaying((value) => !value)}
              style={styles.playButton}
            >
              <Text style={styles.playIcon}>{playing ? 'Ⅱ' : '▶'}</Text>
            </Pressable>

            <Pressable
              style={styles.sideControl}
              onPress={() =>
                setChapter((value) => Math.min(CHAPTERS.length - 1, value + 1))
              }
            >
              <Text style={styles.sideControlText}>+15</Text>
            </Pressable>
          </View>

          <Text style={styles.nowLabel}>ŞİMDİ DİNLİYORSUN</Text>
          <Text style={styles.nowTitle}>{CHAPTERS[chapter]?.title}</Text>
        </View>

        <View style={styles.contextStrip}>
          <View style={styles.contextOrb}>
            <Text style={styles.contextOrbText}>
              {place.layers[Math.min(chapter, place.layers.length - 1)]?.year}
            </Text>
          </View>
          <View style={styles.contextCopy}>
            <Text style={styles.contextKicker}>EKRAN, SESİ TAKİP EDİYOR</Text>
            <Text style={styles.contextTitle}>
              {place.layers[Math.min(chapter, place.layers.length - 1)]?.label}
            </Text>
            <Text style={styles.contextBody}>
              Dinlediğin bölüm ilerledikçe ekrandaki dönem, işaretler ve
              bağlantılar otomatik olarak değişir.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Bölümler</Text>
        <View style={styles.chapterList}>
          {CHAPTERS.map((item, index) => (
            <Pressable
              key={item.title}
              onPress={() => setChapter(index)}
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
                <Text style={styles.chapterTime}>{item.minutes}</Text>
              </View>
              <Text
                style={[
                  styles.chapterArrow,
                  index === chapter && styles.chapterArrowActive,
                ]}
              >
                →
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.noScreenPanel}>
          <Text style={styles.noScreenKicker}>CEBİNDE DE ÇALIŞIR</Text>
          <Text style={styles.noScreenTitle}>Ekranı kapat. Yürümeye devam et.</Text>
          <Text style={styles.noScreenBody}>
            Derin Modun hedefi telefona baktırmak değil, kullanıcının gerçek
            mekâna bakmasını sağlamaktır. Sesli anlatım arka planda devam eder.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 48 },
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
    minHeight: 62,
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
  titleBlock: { alignItems: 'center' },
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
    letterSpacing: 2,
    marginTop: 4,
  },
  livePill: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 11,
    backgroundColor: 'rgba(203,255,0,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.22)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.lime,
    marginRight: 6,
  },
  liveText: {
    color: COLORS.lime,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  stage: {
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stageRingOuter: {
    position: 'absolute',
    width: 284,
    height: 284,
    borderRadius: 142,
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.18)',
  },
  stageRingMiddle: {
    position: 'absolute',
    width: 216,
    height: 216,
    borderRadius: 108,
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.35)',
    borderStyle: 'dashed',
  },
  stageRingInner: {
    position: 'absolute',
    width: 146,
    height: 146,
    borderRadius: 73,
    borderWidth: 1,
    borderColor: 'rgba(255,106,0,0.32)',
  },
  stageCore: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#050B0F',
    borderWidth: 2,
    borderColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.lime,
    shadowOpacity: 0.6,
    shadowRadius: 22,
    elevation: 12,
  },
  stageGlyph: {
    color: COLORS.lime,
    fontSize: 39,
    fontWeight: '900',
  },
  stageSignalA: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.cyan,
    top: 72,
    right: 76,
  },
  stageSignalB: {
    position: 'absolute',
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.orange,
    bottom: 68,
    left: 58,
  },
  eyebrow: {
    color: COLORS.lime,
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '900',
  },
  placeName: {
    color: COLORS.text,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1.2,
    marginTop: 7,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 350,
  },
  player: {
    marginTop: 24,
    borderRadius: 30,
    padding: 20,
    backgroundColor: '#071018',
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.28)',
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: { color: COLORS.muted, fontSize: 9, fontWeight: '700' },
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
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideControl: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 18,
  },
  sideControlText: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '800',
  },
  playButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.lime,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  playIcon: { color: '#050700', fontSize: 26, fontWeight: '900' },
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
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 5,
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
    fontSize: 12,
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
    minHeight: 72,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#060B0F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
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
  chapterTime: { color: COLORS.muted, fontSize: 9, marginTop: 4 },
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
