import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Place } from '../data/places';
import { COLORS, RADII } from '../theme';

type Props = {
  place: Place;
  onBack: () => void;
  onOpenDeep: (place: Place) => void;
};

export function PlaceDetailScreen({ place, onBack, onOpenDeep }: Props) {
  const insets = useSafeAreaInsets();
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
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(52, insets.bottom + 42) },
        ]}
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

        <ImageBackground
          source={{ uri: place.image.url }}
          resizeMode="cover"
          style={styles.heroImage}
          imageStyle={styles.heroImageInner}
        >
          <View style={styles.heroShade} />
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>GERÇEK MEKÂN</Text>
            </View>
            <View style={styles.heroYearBadge}>
              <Text style={styles.heroYear}>{layer.year}</Text>
            </View>
          </View>

          <View style={styles.heroBottom}>
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.placeMeta}>
              {place.district} · {place.city}
            </Text>
            <Text numberOfLines={2} style={styles.placeHook}>
              {place.hook}
            </Text>
            <Pressable
              onPress={() => openSource(place.image.sourceUrl)}
              style={styles.photoCreditButton}
            >
              <Text numberOfLines={1} style={styles.photoCredit}>
                Fotoğraf: {place.image.credit} · {place.image.license}
              </Text>
              <Text style={styles.photoCreditArrow}>↗</Text>
            </Pressable>
          </View>
        </ImageBackground>

        <View style={styles.timeDialCard}>
          <Text style={styles.timeDialEyebrow}>ZAMAN DÜĞÜMÜ</Text>
          <View style={styles.timeDial}>
            <View style={styles.dialRingOuter} />
            <View style={styles.dialRingInner} />
            <View style={styles.dialCore}>
              <Text style={styles.dialCoreYear}>{layer.year}</Text>
              <Text numberOfLines={2} style={styles.dialCoreLabel}>
                {layer.label}
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.layerSelector}
          >
            {place.layers.map((item, index) => (
              <Pressable
                key={item.year + item.label}
                onPress={() => setActiveLayer(index)}
                style={[
                  styles.layerChip,
                  index === activeLayer && styles.layerChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.layerChipYear,
                    index === activeLayer && styles.layerChipYearActive,
                  ]}
                >
                  {item.year}
                </Text>
                <Text numberOfLines={1} style={styles.layerChipLabel}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

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

        <Pressable style={styles.modeCard} onPress={() => onOpenDeep(place)}>
          <View style={styles.modeIcon}>
            <Text style={styles.modeIconText}>▶</Text>
          </View>
          <View style={styles.modeCopy}>
            <Text style={styles.modeKicker}>DERİN MOD</Text>
            <Text style={styles.modeTitle}>Bu katmanı dinle</Text>
            <Text style={styles.modeBody}>
              {place.chapters.length} bölümlük Türkçe anlatımı aç; tam metni
              ekranda gör ve telefonun ses motoruyla dinle.
            </Text>
          </View>
          <Text style={styles.modeArrow}>→</Text>
        </Pressable>

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

          <Pressable
            style={styles.sourceCard}
            onPress={() => openSource(place.image.sourceUrl)}
          >
            <View style={styles.sourceMark}>
              <Text style={styles.sourceMarkText}>▣</Text>
            </View>
            <Text style={styles.sourceTitle}>
              Görsel kaynağı · {place.image.credit} · {place.image.license}
            </Text>
            <Text style={styles.sourceArrow}>›</Text>
          </Pressable>
        </View>

        <View style={styles.notePanel}>
          <Text style={styles.noteTitle}>Kaynak notu</Text>
          <Text style={styles.noteBody}>
            Tarihsel özetler belirtilen kaynakların sadeleştirilmiş anlatımıdır.
            Ziyaret saatleri, biletler ve erişim kuralları değişebileceği için
            güncel ziyaret bilgisini ilgili kurum sayfasından kontrol et.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 18, paddingTop: 4 },
  blueGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.blue,
    opacity: 0.07,
    right: -190,
    top: 120,
  },
  orangeGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.orange,
    opacity: 0.06,
    left: -150,
    top: 620,
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
    letterSpacing: 2.7,
  },
  brandAccent: { color: COLORS.lime },
  brandSub: {
    color: COLORS.muted,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginTop: 4,
  },
  heroImage: {
    height: 276,
    marginTop: 8,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.28)',
    justifyContent: 'space-between',
  },
  heroImageInner: {
    borderRadius: 29,
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(1,4,8,0.48)',
  },
  heroTopRow: {
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroBadge: {
    minHeight: 26,
    borderRadius: 13,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(2,6,9,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.45)',
    justifyContent: 'center',
  },
  heroBadgeText: {
    color: COLORS.lime,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroYearBadge: {
    minWidth: 62,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(2,6,9,0.75)',
    borderWidth: 1,
    borderColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroYear: {
    color: COLORS.orange,
    fontSize: 11,
    fontWeight: '900',
  },
  heroBottom: {
    padding: 16,
  },
  placeName: {
    color: COLORS.text,
    fontSize: 35,
    lineHeight: 39,
    fontWeight: '900',
    letterSpacing: -1,
  },
  placeMeta: {
    color: COLORS.cyan,
    fontSize: 9,
    letterSpacing: 1.2,
    fontWeight: '800',
    marginTop: 6,
  },
  placeHook: {
    color: '#D4DCDD',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
    maxWidth: '95%',
  },
  photoCreditButton: {
    marginTop: 12,
    minHeight: 28,
    alignSelf: 'flex-start',
    maxWidth: '100%',
    borderRadius: 14,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(2,6,9,0.68)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoCredit: {
    flexShrink: 1,
    color: '#AAB5BB',
    fontSize: 7,
  },
  photoCreditArrow: {
    color: COLORS.cyan,
    fontSize: 10,
    marginLeft: 7,
  },
  timeDialCard: {
    marginTop: 14,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#050A0E',
    paddingTop: 16,
    paddingBottom: 14,
    overflow: 'hidden',
  },
  timeDialEyebrow: {
    color: COLORS.lime,
    fontSize: 8,
    letterSpacing: 1.6,
    fontWeight: '900',
    paddingHorizontal: 16,
  },
  timeDial: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialRingOuter: {
    position: 'absolute',
    width: 198,
    height: 198,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.23)',
  },
  dialRingInner: {
    position: 'absolute',
    width: 146,
    height: 146,
    borderRadius: 73,
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.4)',
    borderStyle: 'dashed',
  },
  dialCore: {
    width: 106,
    height: 106,
    borderRadius: 53,
    borderWidth: 2,
    borderColor: COLORS.lime,
    backgroundColor: '#071016',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    shadowColor: COLORS.lime,
    shadowOpacity: 0.38,
    shadowRadius: 16,
    elevation: 8,
  },
  dialCoreYear: {
    color: COLORS.lime,
    fontSize: 19,
    fontWeight: '900',
  },
  dialCoreLabel: {
    color: COLORS.text,
    fontSize: 8,
    lineHeight: 11,
    textAlign: 'center',
    marginTop: 5,
  },
  layerSelector: {
    paddingHorizontal: 12,
  },
  layerChip: {
    width: 116,
    minHeight: 54,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  layerChipActive: {
    borderColor: COLORS.lime,
    backgroundColor: 'rgba(203,255,0,0.06)',
  },
  layerChipYear: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '900',
  },
  layerChipYearActive: {
    color: COLORS.lime,
  },
  layerChipLabel: {
    color: COLORS.text,
    fontSize: 8,
    marginTop: 4,
  },
  activeLayerPanel: {
    marginTop: 12,
    padding: 18,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.26)',
  },
  eyebrow: {
    color: COLORS.lime,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.7,
  },
  layerYear: {
    color: COLORS.orange,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginTop: 14,
  },
  layerTitle: {
    color: COLORS.text,
    fontSize: 23,
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
    letterSpacing: 0.7,
    marginTop: 5,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.white12,
  },
  modeCard: {
    marginTop: 12,
    borderRadius: RADII.lg,
    padding: 16,
    backgroundColor: '#07111A',
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(23,109,255,0.16)',
    borderWidth: 1,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIconText: {
    color: COLORS.cyan,
    fontSize: 17,
  },
  modeCopy: {
    flex: 1,
    paddingHorizontal: 12,
  },
  modeKicker: {
    color: COLORS.cyan,
    fontSize: 8,
    letterSpacing: 1.5,
    fontWeight: '900',
  },
  modeTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 4,
  },
  modeBody: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5,
  },
  modeArrow: {
    color: COLORS.lime,
    fontSize: 22,
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
    letterSpacing: 1.6,
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
    letterSpacing: 1.7,
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
    fontSize: 15,
    fontWeight: '900',
  },
  sourceTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 10,
    lineHeight: 15,
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
