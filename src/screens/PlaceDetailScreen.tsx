import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Place } from '../data/places';
import { COLORS, RADII } from '../theme';

type Props = {
  place: Place;
  onBack: () => void;
  onOpenDeep: (place: Place) => void;
};

export function PlaceDetailScreen({ place, onBack, onOpenDeep }: Props) {
  const [activeLayer, setActiveLayer] = useState(0);
  const layer = useMemo(
    () => place.layers[activeLayer] ?? place.layers[0]!,
    [activeLayer, place.layers],
  );

  return (
    <View style={styles.root}>
      <View style={styles.blueGlow} />
      <View style={styles.orangeGlow} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topRow}>
          <Pressable onPress={onBack} style={styles.circleButton}>
            <Text style={styles.back}>‹</Text>
          </Pressable>

          <View style={styles.brandBlock}>
            <Text style={styles.brand}>
              ZAMAN<Text style={styles.brandAccent}>ALTI</Text>
            </Text>
            <Text style={styles.brandSub}>MEKÂN KATMANI</Text>
          </View>

          <View style={styles.circleButton}>
            <Text style={styles.more}>•••</Text>
          </View>
        </View>

        <View style={styles.portal}>
          <View style={styles.portalRingA} />
          <View style={styles.portalRingB} />
          <View style={styles.portalRingC} />
          <View style={styles.portalCore}>
            <Text style={styles.portalGlyph}>{place.glyph}</Text>
          </View>

          {place.layers.map((item, index) => (
            <Pressable
              key={item.year + item.label}
              onPress={() => setActiveLayer(index)}
              style={[
                styles.orbitNode,
                index === 0 && styles.nodeOne,
                index === 1 && styles.nodeTwo,
                index === 2 && styles.nodeThree,
                index === 3 && styles.nodeFour,
                activeLayer === index && styles.orbitNodeActive,
              ]}
            >
              <Text
                style={[
                  styles.orbitYear,
                  activeLayer === index && styles.orbitYearActive,
                ]}
              >
                {item.year}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.placeName}>{place.name}</Text>
        <Text style={styles.placeMeta}>
          {place.district} · {place.distance}
        </Text>
        <Text style={styles.placeHook}>{place.hook}</Text>

        <View style={styles.activeLayerPanel}>
          <Text style={styles.eyebrow}>AÇIK ZAMAN KATMANI</Text>
          <Text style={styles.layerYear}>{layer.year}</Text>
          <Text style={styles.layerTitle}>{layer.label}</Text>

          <View style={styles.signal}>
            <View style={styles.signalFill} />
            <View style={styles.signalDot} />
          </View>

          <Text style={styles.layerBody}>
            Bu ekran, kullanıcıyı yalnızca bilgi okumaya değil mekânın dönemleri
            arasında gezinmeye davet eder. Mimari değişimler, insan hikâyeleri,
            günlük hayat ve bugüne kalan izler tek bir zaman akışında açılır.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>ZAMAN KATMANI</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>30+</Text>
              <Text style={styles.statLabel}>DK DERİN GEZİ</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>∞</Text>
              <Text style={styles.statLabel}>BAĞLANTI</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>BU MEKÂNI NASIL KEŞFETMEK İSTERSİN?</Text>

        <Pressable style={styles.modeCard} onPress={() => onOpenDeep(place)}>
          <View style={styles.modeIcon}>
            <Text style={styles.modeIconText}>▶</Text>
          </View>
          <View style={styles.modeCopy}>
            <Text style={styles.modeKicker}>DERİN MOD</Text>
            <Text style={styles.modeTitle}>Mekânın içine gir</Text>
            <Text style={styles.modeBody}>
              Uzun sesli anlatım, dönemler arası akış ve ekrandaki canlı zaman
              çizgisi birlikte ilerler.
            </Text>
          </View>
          <Text style={styles.modeArrow}>→</Text>
        </Pressable>

        <View style={styles.splitRow}>
          <View style={styles.smallCard}>
            <Text style={styles.smallAccent}>İZLER</Text>
            <Text style={styles.smallTitle}>Bugünde kalanlar</Text>
            <Text style={styles.smallBody}>
              Geçmişten bugüne taşınan detayları bul.
            </Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={[styles.smallAccent, styles.orangeText]}>İNSANLAR</Text>
            <Text style={styles.smallTitle}>Kimler geçti?</Text>
            <Text style={styles.smallBody}>
              Mekânla yolu kesişen yaşamları gör.
            </Text>
          </View>
        </View>

        <View style={styles.quotePanel}>
          <Text style={styles.quoteMark}>“</Text>
          <Text style={styles.quote}>
            Aynı yerin içinde birden fazla zaman yaşar. ZAMANALTI onları tek
            ekranda görünür kılar.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 50 },
  blueGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: COLORS.blue,
    opacity: 0.09,
    right: -180,
    top: 80,
  },
  orangeGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: COLORS.orange,
    opacity: 0.08,
    left: -150,
    top: 450,
  },
  topRow: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleButton: {
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
  more: { color: COLORS.text, fontSize: 15, letterSpacing: 2 },
  brandBlock: { alignItems: 'center' },
  brand: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2.8,
  },
  brandAccent: { color: COLORS.lime },
  brandSub: {
    color: COLORS.muted,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginTop: 4,
  },
  portal: {
    height: 330,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  portalRingA: {
    position: 'absolute',
    width: 296,
    height: 296,
    borderRadius: 148,
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.18)',
  },
  portalRingB: {
    position: 'absolute',
    width: 232,
    height: 232,
    borderRadius: 116,
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.34)',
    borderStyle: 'dashed',
    transform: [{ rotate: '13deg' }],
  },
  portalRingC: {
    position: 'absolute',
    width: 164,
    height: 164,
    borderRadius: 82,
    borderWidth: 1,
    borderColor: 'rgba(255,106,0,0.35)',
  },
  portalCore: {
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor: '#050B0F',
    borderWidth: 2,
    borderColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.lime,
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 10,
  },
  portalGlyph: {
    color: COLORS.lime,
    fontSize: 42,
    fontWeight: '900',
  },
  orbitNode: {
    position: 'absolute',
    minWidth: 58,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#061017',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitNodeActive: {
    borderColor: COLORS.lime,
    backgroundColor: 'rgba(203,255,0,0.08)',
  },
  orbitYear: { color: COLORS.muted, fontSize: 10, fontWeight: '800' },
  orbitYearActive: { color: COLORS.lime },
  nodeOne: { top: 36, left: 24 },
  nodeTwo: { top: 58, right: 18 },
  nodeThree: { bottom: 54, left: 14 },
  nodeFour: { bottom: 38, right: 34 },
  placeName: {
    color: COLORS.text,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  placeMeta: {
    color: COLORS.cyan,
    fontSize: 10,
    letterSpacing: 1.4,
    fontWeight: '800',
    marginTop: 8,
  },
  placeHook: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 11,
    maxWidth: 340,
  },
  activeLayerPanel: {
    marginTop: 22,
    padding: 18,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.26)',
  },
  eyebrow: {
    color: COLORS.lime,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },
  layerYear: {
    color: COLORS.orange,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 15,
  },
  layerTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 3,
  },
  signal: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#13232D',
    marginTop: 18,
    marginBottom: 17,
  },
  signalFill: {
    width: '58%',
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.cyan,
  },
  signalDot: {
    position: 'absolute',
    left: '56%',
    top: -4,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.lime,
  },
  layerBody: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.white08,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: COLORS.text, fontSize: 18, fontWeight: '900' },
  statLabel: {
    color: COLORS.muted,
    fontSize: 7,
    letterSpacing: 1,
    marginTop: 5,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.white12,
  },
  sectionLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginTop: 28,
    marginBottom: 12,
  },
  modeCard: {
    borderRadius: RADII.lg,
    padding: 16,
    backgroundColor: '#07111A',
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(23,109,255,0.16)',
    borderWidth: 1,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIconText: { color: COLORS.cyan, fontSize: 18 },
  modeCopy: { flex: 1, paddingHorizontal: 13 },
  modeKicker: {
    color: COLORS.cyan,
    fontSize: 8,
    letterSpacing: 1.6,
    fontWeight: '900',
  },
  modeTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  modeBody: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5,
  },
  modeArrow: { color: COLORS.lime, fontSize: 23 },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  smallCard: {
    width: '48.5%',
    minHeight: 132,
    borderRadius: RADII.md,
    backgroundColor: '#080D10',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
  },
  smallAccent: {
    color: COLORS.lime,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  orangeText: { color: COLORS.orange },
  smallTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 10,
  },
  smallBody: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 7,
  },
  quotePanel: {
    marginTop: 22,
    minHeight: 132,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#040709',
    padding: 20,
  },
  quoteMark: {
    color: COLORS.orange,
    fontSize: 42,
    lineHeight: 38,
    fontWeight: '900',
  },
  quote: {
    color: '#B9C4C9',
    fontSize: 14,
    lineHeight: 22,
    marginTop: -6,
  },
});
