import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADII } from '../theme';

type Props = {
  onBack: () => void;
};

type DreamMotif = {
  id: string;
  label: string;
  symbol: string;
};

const STORAGE_KEY = '@zamanalti/dreams/v1';

const MOTIFS: Array<{
  id: string;
  label: string;
  symbol: string;
  words: string[];
}> = [
  {
    id: 'night',
    label: 'Gece / Ay',
    symbol: '◐',
    words: ['gece', 'ay', 'yıldız', 'karanlık', 'gökyüzü'],
  },
  {
    id: 'water',
    label: 'Su',
    symbol: '≈',
    words: ['deniz', 'su', 'nehir', 'yağmur', 'göl', 'dalga'],
  },
  {
    id: 'city',
    label: 'Şehir',
    symbol: '▥',
    words: ['şehir', 'sokak', 'ev', 'bina', 'kule', 'köprü'],
  },
  {
    id: 'flight',
    label: 'Uçuş',
    symbol: '⌁',
    words: ['uç', 'uçmak', 'uçuyorum', 'kanat', 'havada'],
  },
  {
    id: 'forest',
    label: 'Orman',
    symbol: '♢',
    words: ['orman', 'ağaç', 'çiçek', 'dağ', 'toprak'],
  },
  {
    id: 'people',
    label: 'İnsan',
    symbol: '●',
    words: ['insan', 'biri', 'arkadaş', 'anne', 'baba', 'çocuk'],
  },
];

const hashText = (text: string) => {
  let value = 0;
  for (let index = 0; index < text.length; index += 1) {
    value = (value * 31 + text.charCodeAt(index)) >>> 0;
  }
  return value || 1;
};

const analyseDream = (text: string): DreamMotif[] => {
  const normalized = text.toLocaleLowerCase('tr-TR');
  const found = MOTIFS.filter((motif) =>
    motif.words.some((word) => normalized.includes(word)),
  ).map(({ id, label, symbol }) => ({ id, label, symbol }));

  if (found.length > 0) return found;

  return [
    { id: 'night', label: 'Rüya Alanı', symbol: '◐' },
    { id: 'city', label: 'Mekân', symbol: '▥' },
  ];
};

export function DreamScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const motion = useRef(new Animated.Value(0)).current;
  const [dream, setDream] = useState(
    'Gece eski bir şehirde yürüyordum. Gökyüzünde büyük bir ay vardı ve sokakların arasından su akıyordu.',
  );
  const [renderedDream, setRenderedDream] = useState(dream);
  const [saved, setSaved] = useState(false);

  const motifs = useMemo(() => analyseDream(renderedDream), [renderedDream]);
  const seed = useMemo(() => hashText(renderedDream), [renderedDream]);

  const hasMotif = (id: string) => motifs.some((motif) => motif.id === id);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(motion, {
          toValue: 1,
          duration: 4200,
          useNativeDriver: true,
        }),
        Animated.timing(motion, {
          toValue: 0,
          duration: 4200,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [motion]);

  const rotateY = motion.interpolate({
    inputRange: [0, 1],
    outputRange: ['-9deg', '9deg'],
  });

  const rotateX = motion.interpolate({
    inputRange: [0, 1],
    outputRange: ['4deg', '-4deg'],
  });

  const drawDream = () => {
    const clean = dream.trim();
    if (!clean) return;

    setRenderedDream(clean);
    setSaved(false);
    motion.setValue(0);
  };

  const saveDream = async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const previous = raw ? (JSON.parse(raw) as Array<Record<string, unknown>>) : [];
    const next = [
      {
        id: Date.now().toString(),
        text: renderedDream,
        motifs: motifs.map((item) => item.id),
        createdAt: new Date().toISOString(),
      },
      ...previous,
    ].slice(0, 20);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(true);
  };

  const hueA = seed % 2 === 0 ? COLORS.cyan : COLORS.orange;
  const hueB = seed % 3 === 0 ? '#A47CFF' : COLORS.lime;

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(52, insets.bottom + 42) },
        ]}
      >
        <View style={styles.topRow}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.back}>‹</Text>
          </Pressable>

          <View style={styles.brandBlock}>
            <Text style={styles.brand}>
              ZAMAN<Text style={styles.brandAccent}>ALTI</Text>
            </Text>
            <Text style={styles.brandSub}>RÜYA 3B</Text>
          </View>

          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>3B</Text>
          </View>
        </View>

        <Text style={styles.eyebrow}>RÜYA YÖNETMENİ · YEREL 3B TASLAK</Text>
        <Text style={styles.title}>Rüyanı sahneye dönüştür.</Text>
        <Text style={styles.subtitle}>
          Rüyanı yaz. Uygulama metindeki mekân, su, gece, uçuş, doğa ve insan
          motiflerini ayıklayıp hareketli perspektif katmanlarından bir 3B rüya
          sahnesi kurar.
        </Text>

        <View style={styles.composer}>
          <Text style={styles.composerLabel}>RÜYANI ANLAT</Text>
          <TextInput
            value={dream}
            onChangeText={(value) => {
              setDream(value);
              setSaved(false);
            }}
            multiline
            maxLength={900}
            placeholder="Örneğin: Bir gece denizin üstünde uçuyordum..."
            placeholderTextColor="#52616A"
            style={styles.input}
          />
          <View style={styles.composerFooter}>
            <Text style={styles.counter}>{dream.length}/900</Text>
            <Pressable
              disabled={!dream.trim()}
              onPress={drawDream}
              style={[
                styles.drawButton,
                !dream.trim() && styles.drawButtonDisabled,
              ]}
            >
              <Text style={styles.drawButtonText}>3B RÜYAYI ÇİZ</Text>
              <Text style={styles.drawArrow}>→</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.sceneFrame}>
          <View style={styles.sceneHeader}>
            <Text style={styles.sceneLabel}>CANLI 3B RÜYA SAHNESİ</Text>
            <Text style={styles.sceneSeed}>#{seed.toString(16).slice(-6)}</Text>
          </View>

          <View style={styles.sceneViewport}>
            <View style={styles.sceneGlowA} />
            <View style={styles.sceneGlowB} />

            <Animated.View
              style={[
                styles.world,
                {
                  transform: [
                    { perspective: 760 },
                    { rotateX },
                    { rotateY },
                  ],
                },
              ]}
            >
              <View
                style={[
                  styles.backPlane,
                  { borderColor: hueA },
                ]}
              />

              {hasMotif('night') && (
                <View
                  style={[
                    styles.moon,
                    {
                      borderColor: hueB,
                      shadowColor: hueB,
                    },
                  ]}
                >
                  <View style={styles.moonCutout} />
                </View>
              )}

              {hasMotif('city') && (
                <View style={styles.cityRow}>
                  {[0, 1, 2, 3, 4].map((index) => (
                    <View
                      key={index}
                      style={[
                        styles.tower,
                        {
                          height: 42 + ((seed >> index) % 48),
                          borderColor: index % 2 === 0 ? hueA : hueB,
                          transform: [
                            { rotateY: index % 2 === 0 ? '-12deg' : '12deg' },
                          ],
                        },
                      ]}
                    >
                      <View style={styles.window} />
                      <View style={styles.window} />
                    </View>
                  ))}
                </View>
              )}

              {hasMotif('water') && (
                <>
                  <View style={[styles.waterPlane, { borderColor: hueA }]} />
                  <View style={[styles.waterLine, { backgroundColor: hueA }]} />
                  <View style={[styles.waterLineTwo, { backgroundColor: hueB }]} />
                </>
              )}

              {hasMotif('forest') && (
                <View style={styles.forestRow}>
                  {[0, 1, 2, 3].map((index) => (
                    <View
                      key={index}
                      style={[
                        styles.tree,
                        {
                          borderBottomColor:
                            index % 2 === 0 ? hueB : COLORS.cyan,
                          transform: [
                            { scale: 0.8 + ((seed >> index) % 4) * 0.08 },
                          ],
                        },
                      ]}
                    />
                  ))}
                </View>
              )}

              {hasMotif('people') && (
                <View style={styles.person}>
                  <View style={[styles.personHead, { borderColor: hueB }]} />
                  <View style={[styles.personBody, { backgroundColor: hueB }]} />
                </View>
              )}

              {hasMotif('flight') && (
                <View style={styles.flightPath}>
                  <View style={[styles.flightDot, { backgroundColor: hueB }]} />
                  <View style={[styles.flightLine, { borderColor: hueB }]} />
                </View>
              )}

              <View style={[styles.portalRing, { borderColor: hueB }]} />
              <View style={[styles.portalCore, { backgroundColor: hueB }]} />
            </Animated.View>
          </View>

          <View style={styles.motifRow}>
            {motifs.map((motif) => (
              <View key={motif.id} style={styles.motifPill}>
                <Text style={styles.motifSymbol}>{motif.symbol}</Text>
                <Text style={styles.motifText}>{motif.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.interpretation}>
          <Text style={styles.interpretationKicker}>SAHNE MANTIĞI</Text>
          <Text style={styles.interpretationTitle}>
            {motifs.map((item) => item.label).join(' · ')}
          </Text>
          <Text style={styles.interpretationBody}>
            Bu prototip rüyayı psikolojik olarak yorumlamaz. Metindeki görsel
            motifleri alıp 3B perspektifli bir sahne kompozisyonuna dönüştürür.
            Daha sonraki sürümde bu sahne üretken görsel/3B model servisine
            bağlanabilir.
          </Text>
        </View>

        <Pressable style={styles.saveButton} onPress={() => void saveDream()}>
          <Text style={styles.saveButtonText}>
            {saved ? 'RÜYA KAYDEDİLDİ' : 'RÜYAYI ZAMAN DEFTERİNE KAYDET'}
          </Text>
          <Text style={styles.saveArrow}>{saved ? '✓' : '→'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 4,
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
  back: {
    color: COLORS.text,
    fontSize: 30,
    marginTop: -4,
  },
  brandBlock: {
    alignItems: 'center',
  },
  brand: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2.5,
  },
  brandAccent: {
    color: COLORS.lime,
  },
  brandSub: {
    color: '#A47CFF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 4,
  },
  modeBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#A47CFF',
    backgroundColor: 'rgba(164,124,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBadgeText: {
    color: '#C8B6FF',
    fontSize: 11,
    fontWeight: '900',
  },
  eyebrow: {
    color: '#A47CFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginTop: 26,
  },
  title: {
    color: COLORS.text,
    fontSize: 36,
    lineHeight: 41,
    fontWeight: '900',
    letterSpacing: -1.2,
    marginTop: 8,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
  },
  composer: {
    marginTop: 22,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: 'rgba(164,124,255,0.3)',
    backgroundColor: '#080B12',
    padding: 16,
  },
  composerLabel: {
    color: '#A47CFF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.7,
  },
  input: {
    minHeight: 132,
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 21,
    textAlignVertical: 'top',
    paddingHorizontal: 0,
    paddingTop: 14,
  },
  composerFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.white08,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counter: {
    color: COLORS.muted,
    fontSize: 8,
  },
  drawButton: {
    minHeight: 42,
    borderRadius: 21,
    backgroundColor: COLORS.lime,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawButtonDisabled: {
    opacity: 0.3,
  },
  drawButtonText: {
    color: '#050700',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  drawArrow: {
    color: '#050700',
    fontSize: 15,
    marginLeft: 7,
  },
  sceneFrame: {
    marginTop: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.28)',
    backgroundColor: '#04080E',
    padding: 14,
    overflow: 'hidden',
  },
  sceneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sceneLabel: {
    color: COLORS.cyan,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  sceneSeed: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: '800',
  },
  sceneViewport: {
    height: 330,
    marginTop: 10,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#03070D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sceneGlowA: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: COLORS.blue,
    opacity: 0.13,
    right: -70,
    top: -40,
  },
  sceneGlowB: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#703CFF',
    opacity: 0.1,
    left: -65,
    bottom: -45,
  },
  world: {
    width: 270,
    height: 270,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPlane: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderWidth: 1,
    borderRadius: 22,
    opacity: 0.25,
    transform: [{ rotateZ: '45deg' }, { scale: 0.78 }],
  },
  moon: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    right: 23,
    top: 24,
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 8,
    overflow: 'hidden',
  },
  moonCutout: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#03070D',
    left: 18,
    top: -4,
  },
  cityRow: {
    position: 'absolute',
    bottom: 58,
    left: 36,
    right: 36,
    height: 102,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  tower: {
    width: 27,
    borderWidth: 1,
    backgroundColor: 'rgba(4,12,18,0.92)',
    padding: 5,
    justifyContent: 'space-around',
  },
  window: {
    height: 4,
    backgroundColor: 'rgba(203,255,0,0.35)',
    marginVertical: 4,
  },
  waterPlane: {
    position: 'absolute',
    width: 205,
    height: 84,
    borderWidth: 1,
    borderRadius: 18,
    bottom: 29,
    opacity: 0.42,
    transform: [{ rotateX: '63deg' }, { rotateZ: '-5deg' }],
  },
  waterLine: {
    position: 'absolute',
    width: 150,
    height: 1,
    bottom: 58,
    opacity: 0.65,
    transform: [{ rotateZ: '-8deg' }],
  },
  waterLineTwo: {
    position: 'absolute',
    width: 125,
    height: 1,
    bottom: 44,
    opacity: 0.5,
    transform: [{ rotateZ: '9deg' }],
  },
  forestRow: {
    position: 'absolute',
    bottom: 54,
    left: 28,
    right: 28,
    height: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  tree: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 58,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    opacity: 0.7,
  },
  person: {
    position: 'absolute',
    left: 46,
    bottom: 72,
    width: 36,
    alignItems: 'center',
  },
  personHead: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  personBody: {
    width: 4,
    height: 40,
    marginTop: 3,
    borderRadius: 2,
  },
  flightPath: {
    position: 'absolute',
    left: 38,
    top: 58,
    width: 155,
    height: 80,
  },
  flightDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  flightLine: {
    position: 'absolute',
    left: 8,
    top: 5,
    width: 142,
    height: 62,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderRadius: 60,
    transform: [{ rotateZ: '-16deg' }],
  },
  portalRing: {
    position: 'absolute',
    width: 98,
    height: 98,
    borderRadius: 49,
    borderWidth: 1,
    opacity: 0.65,
  },
  portalCore: {
    width: 18,
    height: 18,
    borderRadius: 9,
    shadowColor: COLORS.lime,
    shadowOpacity: 0.7,
    shadowRadius: 14,
    elevation: 8,
  },
  motifRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 12,
  },
  motifPill: {
    minHeight: 32,
    borderRadius: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  motifSymbol: {
    color: '#A47CFF',
    fontSize: 11,
    marginRight: 6,
  },
  motifText: {
    color: COLORS.text,
    fontSize: 8,
    fontWeight: '800',
  },
  interpretation: {
    marginTop: 12,
    borderRadius: RADII.lg,
    padding: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#070B10',
  },
  interpretationKicker: {
    color: COLORS.cyan,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  interpretationTitle: {
    color: COLORS.text,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
    marginTop: 7,
  },
  interpretationBody: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 7,
  },
  saveButton: {
    marginTop: 14,
    minHeight: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#A47CFF',
    backgroundColor: 'rgba(164,124,255,0.08)',
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveButtonText: {
    color: '#C8B6FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  saveArrow: {
    color: '#C8B6FF',
    fontSize: 18,
  },
});
