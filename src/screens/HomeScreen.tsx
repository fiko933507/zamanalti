import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { FeatureCard } from '../components/FeatureCard';
import { TimeRadar } from '../components/TimeRadar';
import { PLACES } from '../data/places';
import { COLORS, RADII } from '../theme';

type FeatureKey = 'hidden' | 'nearby' | 'route' | 'deep';

const FEATURE_COPY: Record<FeatureKey, { title: string; body: string }> = {
  hidden: {
    title: 'Gizli Katman',
    body: 'Bulunduğun mekânın görünmeyen dönemlerini üst üste aç. Her katman farklı bir tarih, insan ve hikâye gösterir.',
  },
  nearby: {
    title: 'Yakındaki İzler',
    body: 'Yakınındaki yapı, sokak ve nesnelerde saklı anlatıları keşfet. Mesafe yerine hikâye yoğunluğuna göre ilerle.',
  },
  route: {
    title: 'Hafıza Rotası',
    body: 'Bir şehri bugünkü sokaklardan değil; geçmişte yaşanmış olaylar, kişiler ve anılar üzerinden dolaş.',
  },
  deep: {
    title: 'Derin Mod',
    body: 'Kısa bilgi kartları yerine uzun anlatımlar, sesli gezi ve birbirine bağlanan zaman çizgileriyle mekâna daha derinden gir.',
  },
};

function EraChip({
  year,
  label,
  active,
  onPress,
}: {
  year: string;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.eraChip, active && styles.eraChipActive]}
    >
      <Text style={[styles.eraYear, active && styles.eraYearActive]}>{year}</Text>
      <Text numberOfLines={1} style={styles.eraLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

export function HomeScreen() {
  const { width } = useWindowDimensions();
  const radarSize = Math.min(width - 36, 390);
  const [selectedPlaceId, setSelectedPlaceId] = useState(PLACES[0]!.id);
  const [activeFeature, setActiveFeature] = useState<FeatureKey>('hidden');
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);

  const selectedPlace = useMemo(
    () => PLACES.find((item) => item.id === selectedPlaceId) ?? PLACES[0]!,
    [selectedPlaceId],
  );

  const choosePlace = (id: string) => {
    setSelectedPlaceId(id);
    setSelectedLayerIndex(0);
  };

  return (
    <View style={styles.root}>
      <View style={styles.blueAmbient} />
      <View style={styles.orangeAmbient} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Pressable style={styles.locationPill}>
            <Text style={styles.locationIcon}>⌖</Text>
            <Text style={styles.locationText}>İstanbul</Text>
            <Text style={styles.locationChevron}>⌄</Text>
          </Pressable>

          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <Text style={styles.brandLetter}>A</Text>
              <View style={styles.brandDot} />
            </View>
            <Text style={styles.brandName}>
              ZAMAN<Text style={styles.brandAccent}>ALTI</Text>
            </Text>
          </View>

          <Pressable style={styles.searchButton}>
            <Text style={styles.searchIcon}>⌕</Text>
          </Pressable>
        </View>

        <View style={styles.heroCopy}>
          <Text style={styles.kicker}>AYNI ŞEHİR · BAŞKA ZAMANLAR</Text>
          <Text style={styles.heroTitle}>
            ŞİMDİ{'
'}
            <Text style={styles.heroAccent}>KEŞFET</Text>
          </Text>
          <Text style={styles.heroBody}>
            Şehri yalnızca bulunduğun yerde değil, zamanın katmanlarında keşfet.
          </Text>
        </View>

        <View style={styles.radarShell}>
          <View style={styles.radarHalo} />
          <TimeRadar
            size={radarSize}
            places={PLACES}
            selectedId={selectedPlaceId}
            onSelect={choosePlace}
          />
          <View style={styles.radarCaptionRow}>
            <Text style={styles.radarCaption}>ZAMAN HARİTASI</Text>
            <Text style={styles.radarMeta}>4 aktif iz</Text>
          </View>
        </View>

        <View style={styles.placeFocus}>
          <View style={styles.placeTitleRow}>
            <View style={styles.placeMonogram}>
              <Text style={styles.placeMonogramText}>{selectedPlace.glyph}</Text>
            </View>
            <View style={styles.placeCopy}>
              <Text style={styles.placeName}>{selectedPlace.name}</Text>
              <Text style={styles.placeMeta}>
                {selectedPlace.district} · {selectedPlace.distance}
              </Text>
            </View>
            <Pressable style={styles.enterButton}>
              <Text style={styles.enterButtonText}>AÇ</Text>
            </Pressable>
          </View>
          <Text style={styles.placeHook}>{selectedPlace.hook}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>MEKÂNI ZAMANDA AÇ</Text>
            <Text style={styles.sectionTitle}>Zaman Katmanları</Text>
          </View>
          <Text style={styles.sectionCount}>{selectedPlace.layers.length} dönem</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eraRow}
        >
          {selectedPlace.layers.map((layer, index) => (
            <EraChip
              key={layer.year + layer.label}
              year={layer.year}
              label={layer.label}
              active={selectedLayerIndex === index}
              onPress={() => setSelectedLayerIndex(index)}
            />
          ))}
        </ScrollView>

        <View style={styles.layerPreview}>
          <View style={styles.layerTimeline}>
            <View style={styles.timelineGlow} />
            <View style={styles.timelineDot} />
          </View>
          <View style={styles.layerPreviewCopy}>
            <Text style={styles.layerPreviewYear}>
              {selectedPlace.layers[selectedLayerIndex]?.year}
            </Text>
            <Text style={styles.layerPreviewTitle}>
              {selectedPlace.layers[selectedLayerIndex]?.label}
            </Text>
            <Text style={styles.layerPreviewBody}>
              Bu katmanda mekânın mimarisi, insanları, olayları ve bugüne kalan
              izleri tek anlatı içinde açılacak.
            </Text>
          </View>
          <Pressable style={styles.listenButton}>
            <Text style={styles.listenIcon}>▶</Text>
            <Text style={styles.listenText}>Sesli katmanı başlat</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>MENÜ DEĞİL · DENEYİM</Text>
            <Text style={styles.sectionTitle}>Katmana Gir</Text>
          </View>
        </View>

        <View style={styles.featureGrid}>
          <FeatureCard
            title="Gizli Katman"
            subtitle="Görünmeyeni keşfet"
            icon="◉"
            tone="blue"
            active={activeFeature === 'hidden'}
            onPress={() => setActiveFeature('hidden')}
          />
          <FeatureCard
            title="Yakındaki İzler"
            subtitle="Etrafındaki hikâyeler"
            icon="⌖"
            tone="lime"
            active={activeFeature === 'nearby'}
            onPress={() => setActiveFeature('nearby')}
          />
          <FeatureCard
            title="Hafıza Rotası"
            subtitle="Zamanın içinde yolculuk"
            icon="⌁"
            tone="orange"
            active={activeFeature === 'route'}
            onPress={() => setActiveFeature('route')}
          />
          <FeatureCard
            title="Derin Mod"
            subtitle="Şehri başka bir gözle gör"
            icon="◇"
            tone="cyan"
            active={activeFeature === 'deep'}
            onPress={() => setActiveFeature('deep')}
          />
        </View>

        <View style={styles.featureDetail}>
          <View style={styles.featureDetailTop}>
            <Text style={styles.featureDetailLabel}>AKTİF DENEYİM</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>CANLI</Text>
            </View>
          </View>
          <Text style={styles.featureDetailTitle}>
            {FEATURE_COPY[activeFeature].title}
          </Text>
          <Text style={styles.featureDetailBody}>
            {FEATURE_COPY[activeFeature].body}
          </Text>
          <Pressable style={styles.primaryAction}>
            <Text style={styles.primaryActionText}>DENEYİMİ AÇ</Text>
            <Text style={styles.primaryActionArrow}>→</Text>
          </Pressable>
        </View>

        <View style={styles.memoryPanel}>
          <View style={styles.memoryOrb}>
            <Text style={styles.memoryOrbText}>∞</Text>
          </View>
          <View style={styles.memoryCopy}>
            <Text style={styles.memoryEyebrow}>SENİN ZAMAN KATMANIN</Text>
            <Text style={styles.memoryTitle}>Bir anı bırak.</Text>
            <Text style={styles.memoryBody}>
              Bir mekâna bugünden bir not, ses veya anı bırak; gelecekte yeniden
              açılmak üzere zaman kapsülüne dönüştür.
            </Text>
          </View>
          <Pressable style={styles.memoryAction}>
            <Text style={styles.memoryActionText}>GELECEĞE BIRAK</Text>
          </Pressable>
        </View>

        <Text style={styles.footerText}>
          ZAMANALTI · MEKÂN · ZAMAN · İNSAN · HİKÂYE
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  blueAmbient: {
    position: 'absolute',
    width: 310,
    height: 310,
    borderRadius: 155,
    backgroundColor: COLORS.blue,
    opacity: 0.08,
    top: 120,
    right: -170,
  },
  orangeAmbient: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: COLORS.orange,
    opacity: 0.055,
    top: 700,
    left: -150,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 54,
  },
  header: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationPill: {
    minWidth: 96,
    height: 38,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    color: COLORS.cyan,
    fontSize: 15,
    marginRight: 6,
  },
  locationText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  locationChevron: {
    color: COLORS.muted,
    fontSize: 14,
    marginLeft: 5,
    marginTop: -2,
  },
  brand: {
    alignItems: 'center',
  },
  brandMark: {
    width: 26,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  brandLetter: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '900',
    transform: [{ scaleX: 0.75 }],
  },
  brandDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.lime,
    position: 'absolute',
    top: 8,
  },
  brandName: {
    color: COLORS.text,
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 2.5,
  },
  brandAccent: {
    color: COLORS.lime,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    color: COLORS.text,
    fontSize: 22,
    marginTop: -2,
  },
  heroCopy: {
    paddingTop: 26,
    paddingBottom: 8,
  },
  kicker: {
    color: COLORS.muted,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '700',
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 44,
    lineHeight: 42,
    fontWeight: '900',
    letterSpacing: -1.6,
    marginTop: 12,
  },
  heroAccent: {
    color: COLORS.lime,
  },
  heroBody: {
    color: COLORS.muted,
    maxWidth: 310,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
  },
  radarShell: {
    marginTop: 4,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(4,10,15,0.78)',
    overflow: 'hidden',
    paddingTop: 8,
    paddingBottom: 14,
  },
  radarHalo: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.lime,
    opacity: 0.035,
    alignSelf: 'center',
    top: 70,
  },
  radarCaptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -3,
  },
  radarCaption: {
    color: COLORS.muted,
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '800',
  },
  radarMeta: {
    color: COLORS.lime,
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: '700',
  },
  placeFocus: {
    marginTop: 14,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.24)',
    backgroundColor: COLORS.surface,
    padding: 16,
  },
  placeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeMonogram: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(23,109,255,0.14)',
    borderWidth: 1,
    borderColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeMonogramText: {
    color: COLORS.cyan,
    fontSize: 19,
    fontWeight: '900',
  },
  placeCopy: {
    flex: 1,
    paddingHorizontal: 12,
  },
  placeName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
  },
  placeMeta: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 3,
  },
  enterButton: {
    height: 36,
    minWidth: 52,
    borderRadius: 18,
    backgroundColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  enterButtonText: {
    color: '#050700',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  placeHook: {
    color: '#B9C4C9',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 13,
  },
  sectionHeader: {
    marginTop: 28,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sectionEyebrow: {
    color: COLORS.lime,
    fontSize: 9,
    letterSpacing: 1.8,
    fontWeight: '800',
    marginBottom: 5,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
  },
  sectionCount: {
    color: COLORS.muted,
    fontSize: 11,
  },
  eraRow: {
    paddingRight: 18,
  },
  eraChip: {
    width: 132,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginRight: 9,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  eraChipActive: {
    borderColor: COLORS.lime,
    backgroundColor: 'rgba(203,255,0,0.055)',
  },
  eraYear: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },
  eraYearActive: {
    color: COLORS.lime,
  },
  eraLabel: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 4,
  },
  layerPreview: {
    marginTop: 12,
    borderRadius: RADII.lg,
    backgroundColor: '#060B0F',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    overflow: 'hidden',
  },
  layerTimeline: {
    height: 3,
    backgroundColor: '#12222B',
    borderRadius: 2,
    overflow: 'visible',
    marginBottom: 16,
  },
  timelineGlow: {
    height: 3,
    width: '48%',
    borderRadius: 2,
    backgroundColor: COLORS.cyan,
  },
  timelineDot: {
    position: 'absolute',
    left: '46%',
    top: -4,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.lime,
  },
  layerPreviewCopy: {
    paddingRight: 6,
  },
  layerPreviewYear: {
    color: COLORS.orange,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  layerPreviewTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 5,
  },
  layerPreviewBody: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  listenButton: {
    marginTop: 16,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(23,109,255,0.15)',
    borderWidth: 1,
    borderColor: COLORS.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listenIcon: {
    color: COLORS.cyan,
    fontSize: 12,
    marginRight: 8,
  },
  listenText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  featureDetail: {
    marginTop: 12,
    borderRadius: RADII.lg,
    padding: 18,
    backgroundColor: '#080D0F',
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.28)',
  },
  featureDetailTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureDetailLabel: {
    color: COLORS.muted,
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '800',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    height: 25,
    borderRadius: 13,
    backgroundColor: 'rgba(203,255,0,0.08)',
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
    letterSpacing: 1.2,
    fontWeight: '900',
  },
  featureDetailTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 14,
  },
  featureDetailBody: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },
  primaryAction: {
    marginTop: 18,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lime,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryActionText: {
    color: '#050700',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  primaryActionArrow: {
    color: '#050700',
    fontSize: 20,
    fontWeight: '700',
  },
  memoryPanel: {
    marginTop: 24,
    borderRadius: 30,
    padding: 20,
    backgroundColor: '#07101A',
    borderWidth: 1,
    borderColor: 'rgba(23,109,255,0.38)',
    overflow: 'hidden',
  },
  memoryOrb: {
    position: 'absolute',
    width: 126,
    height: 126,
    borderRadius: 63,
    right: -34,
    top: -40,
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.25)',
    backgroundColor: 'rgba(23,109,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memoryOrbText: {
    color: COLORS.cyan,
    fontSize: 44,
    opacity: 0.65,
  },
  memoryCopy: {
    paddingRight: 64,
  },
  memoryEyebrow: {
    color: COLORS.cyan,
    fontSize: 9,
    letterSpacing: 1.8,
    fontWeight: '900',
  },
  memoryTitle: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 8,
  },
  memoryBody: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  memoryAction: {
    alignSelf: 'flex-start',
    marginTop: 18,
    minHeight: 42,
    paddingHorizontal: 16,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memoryActionText: {
    color: COLORS.cyan,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  footerText: {
    color: '#42515A',
    textAlign: 'center',
    fontSize: 8,
    letterSpacing: 1.8,
    marginTop: 32,
  },
});
