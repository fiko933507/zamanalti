import React, { useMemo, useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import type { Place } from '../data/places';
import { COLORS, RADII } from '../theme';

type Props = {
  place: Place;
  onBack: () => void;
  onOpenDeep: (place: Place) => void;
};

export function PlaceDetailScreen({ place, onBack, onOpenDeep }: Props) {
  const { width } = useWindowDimensions();
  const portalSize = Math.min(width - 40, 330);
  const [activeLayer, setActiveLayer] = useState(0);

  const layer = useMemo(
    () => place.layers[activeLayer] ?? place.layers[0]!,
    [activeLayer, place.layers],
  );

  const openSource = (url: string) => {
    void Linking.openURL(url);
  };

  return (
    <View style={styles.root}>
      <View style={styles.blueGlow} pointerEvents="none" />
      <View style={styles.orangeGlow} pointerEvents="none" />

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

          <Pressable
            style={styles.sourceButton}
            onPress={() => {
              const first = place.sources[0];
              if (first) openSource(first.url);
            }}
          >
            <Text style={styles.sourceButtonText}>KAYNAK</Text>
          </Pressable>
        </View>

        <View style={[styles.portal, { height: portalSize }]}>
          <View
            style={[
              styles.portalRingA,
              {
                width: portalSize * 0.9,
                height: portalSize * 0.9,
                borderRadius: portalSize,
              },
            ]}
          />
          <View
            style={[
              styles.portalRingB,
              {
                width: portalSize * 0.7,
                height: portalSize * 0.7,
                borderRadius: portalSize,
              },
            ]}
          />
          <View
            style={[
              styles.portalRingC,
              {
                width: portalSize * 0.5,
                height: portalSize * 0.5,
                borderRadius: portalSize,
              },
            ]}
          />

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
          {place.district} · {place.city}
        </Text>
        <Text style={styles.placeHook}>{place.hook}</Text>

        <View style={styles.activeLayerPanel}>
          <Text style={styles.eyebrow}>AÇIK ZAMAN KATMANI</Text>
          <Text style={styles.layerYear}>{layer.year}</Text>
          <Text style={styles.layerTitle}>{layer.label}</Text>

          <View style={styles.signal}>
            <View
              style={[
                styles.signalFill,
                {
                  width: `${((activeLayer + 1) / place.layers.length) * 100}%`,
                },
              ]}
            />
            <View
              style={[
                styles.signalDot,
                {
                  left: `${Math.min(
                    96,
                    ((activeLayer + 1) / place.layers.length) * 100,
                  )}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.layerBody}>{layer.body}</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{place.layers.length}</Text>
              <Text style={styles.statLabel}>ZAMAN KATMANI</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{place.chapters.length}</Text>
              <Text style={styles.statLabel}>SESLİ BÖLÜM</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>✓</Text>
              <Text style={styles.statLabel}>KAYNAKLI</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryPanel}>
          <Text style={styles.summaryEyebrow}>MEKÂNIN ÖZETİ</Text>
          <Text style={styles.summaryText}>{place.summary}</Text>
        </View>

        <Text style={styles.sectionLabel}>DOĞRULANMIŞ TEMEL BİLGİLER</Text>

        <View style={styles.factList}>
          {place.facts.map((fact, index) => (
            <View key={fact} style={styles.factRow}>
              <View style={styles.factIndex}>
                <Text style={styles.factIndexText}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
              </View>
              <Text style={styles.factText}>{fact}</Text>
            </View>
          ))}
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
              {place.chapters.length} bölümlük Türkçe sesli anlatımı başlat;
              zaman katmanları anlatımla birlikte ilerlesin.
            </Text>
          </View>
          <Text style={styles.modeArrow}>→</Text>
        </Pressable>

        <View style={styles.splitRow}>
          <View style={styles.smallCard}>
            <Text style={styles.smallAccent}>İZLER</Text>
            <Text style={styles.smallTitle}>Dönemleri karşılaştır</Text>
            <Text style={styles.smallBody}>
              Üstteki tarih düğmelerine dokunarak aynı mekânın farklı
              dönemlerdeki anlamını karşılaştır.
            </Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={[styles.smallAccent, styles.orangeText]}>KAYNAKLAR</Text>
            <Text style={styles.smallTitle}>{place.sources.length} doğrulama noktası</Text>
            <Text style={styles.smallBody}>
              Uygulamadaki tarihsel içerik resmî kurum ve UNESCO kaynaklarıyla
              ilişkilidir.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>KAYNAKLAR</Text>

        <View style={styles.sources}>
          {place.sources.map((source) => (
            <Pressable
              key={source.url}
              style={styles.sourceCard}
              onPress={() => openSource(source.url)}
            >
              <View style={styles.sourceMark}>
                <Text style={styles.sourceMarkText}>↗</Text>
              </View>
              <Text style={styles.sourceTitle}>{source.label}</Text>
              <Text style={styles.sourceArrow}>›</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.notePanel}>
          <Text style={styles.noteTitle}>Kaynak notu</Text>
          <Text style={styles.noteBody}>
            Tarihsel özetler kaynakların sadeleştirilmiş anlatımıdır. Ziyaret
            saatleri, biletler ve erişim kuralları değişebileceği için güncel
            ziyaret bilgisi için kaynak bağlantısını kontrol et.
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
    minHeight: 60,
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
  sourceButton: {
    minWidth: 62,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.38)',
    backgroundColor: 'rgba(203,255,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceButtonText: {
    color: COLORS.lime,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
  },
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
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  portalRingA: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.18)',
  },
  portalRingB: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.34)',
    borderStyle: 'dashed',
    transform: [{ rotate: '13deg' }],
  },
  portalRingC: {
    position: 'absolute',
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
    minWidth: 62,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 17,
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
  nodeOne: { top: '9%', left: '5%' },
  nodeTwo: { top: '18%', right: '4%' },
  nodeThree: { bottom: '18%', left: '1%' },
  nodeFour: { bottom: '10%', right: '7%' },
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
    color: '#B4C0C7',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 11,
    maxWidth: 360,
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
    backgroundColor: '#13232D',
    borderRadius: 2,
    marginTop: 18,
    marginBottom: 17,
    overflow: 'visible',
  },
  signalFill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.cyan,
  },
  signalDot: {
    position: 'absolute',
    top: -4,
    width: 11,
    height: 11,
    borderRadius: 6,
    marginLeft: -6,
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
    letterSpacing: 0.8,
    marginTop: 5,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.white12,
  },
  summaryPanel: {
    marginTop: 12,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#05090C',
    padding: 17,
  },
  summaryEyebrow: {
    color: COLORS.cyan,
    fontSize: 8,
    letterSpacing: 1.7,
    fontWeight: '900',
  },
  summaryText: {
    color: '#B4C0C7',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 9,
  },
  sectionLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginTop: 28,
    marginBottom: 12,
  },
  factList: {
    gap: 8,
  },
  factRow: {
    minHeight: 62,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#05090C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  factIndex: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factIndexText: {
    color: COLORS.lime,
    fontSize: 8,
    fontWeight: '900',
  },
  factText: {
    flex: 1,
    color: '#B9C4C9',
    fontSize: 11,
    lineHeight: 17,
    paddingLeft: 11,
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
    minHeight: 142,
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
  sources: {
    gap: 8,
  },
  sourceCard: {
    minHeight: 64,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#05090D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  sourceMark: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(67,215,255,0.08)',
    borderWidth: 1,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceMarkText: {
    color: COLORS.cyan,
    fontSize: 16,
    fontWeight: '900',
  },
  sourceTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    paddingHorizontal: 11,
  },
  sourceArrow: {
    color: COLORS.muted,
    fontSize: 22,
  },
  notePanel: {
    marginTop: 18,
    borderRadius: RADII.md,
    padding: 16,
    backgroundColor: 'rgba(255,106,0,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(255,106,0,0.2)',
  },
  noteTitle: {
    color: COLORS.orange,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  noteBody: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 7,
  },
});
