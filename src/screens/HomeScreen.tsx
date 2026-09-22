import React, { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeatureCard } from '../components/FeatureCard';
import { TimeRadar } from '../components/TimeRadar';
import { PLACES, type Place } from '../data/places';
import { useUserLocation } from '../hooks/useUserLocation';
import { distanceKm, formatDistance } from '../utils/geo';
import { COLORS, RADII } from '../theme';

type FeatureKey = 'hidden' | 'nearby' | 'route' | 'deep';

type Props = {
  onOpenPlace: (place: Place) => void;
  onOpenDeep: (place: Place) => void;
  onOpenCapsule: (place: Place) => void;
  onOpenRoute: () => void;
};

const FEATURE_COPY: Record<FeatureKey, { title: string; body: string }> = {
  hidden: {
    title: 'Gizli Katman',
    body: 'Seçtiğin mekânın doğrulanmış tarih katmanlarını aç. Her dönem, kaynaklı bir anlatı ve ayrı zaman çizgisiyle gösterilir.',
  },
  nearby: {
    title: 'Yakındaki İzler',
    body: 'Konum izni verirsen listedeki mekânların gerçek kuş uçuşu mesafesini hesaplar ve en yakındaki tarih katmanını öne çıkarır.',
  },
  route: {
    title: 'Hafıza Rotası',
    body: 'Bir mekândan diğerine geçerken kronoloji yerine hikâye bağlantılarını takip et. İlk sürüm İstanbul koleksiyonuyla başlıyor.',
  },
  deep: {
    title: 'Derin Mod',
    body: 'Kaynaklı metinlerden hazırlanan bölümleri Türkçe sesli anlatımla dinle; dönem bilgisi anlatımla birlikte değişsin.',
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

export function HomeScreen({
  onOpenPlace,
  onOpenDeep,
  onOpenCapsule,
  onOpenRoute,
}: Props) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const radarSize = Math.min(width - 54, 338);

  const [selectedPlaceId, setSelectedPlaceId] = useState(PLACES[0]!.id);
  const [activeFeature, setActiveFeature] = useState<FeatureKey>('hidden');
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const { coordinate, cityLabel, state: locationState, requestLocation } =
    useUserLocation();

  const selectedPlace = useMemo(
    () => PLACES.find((item) => item.id === selectedPlaceId) ?? PLACES[0]!,
    [selectedPlaceId],
  );

  const selectedDistance = useMemo(() => {
    if (!coordinate) return null;
    return distanceKm(coordinate, selectedPlace.coordinates);
  }, [coordinate, selectedPlace]);

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('tr-TR');
    if (!normalized) return PLACES;

    return PLACES.filter((place) =>
      `${place.name} ${place.district} ${place.city}`
        .toLocaleLowerCase('tr-TR')
        .includes(normalized),
    );
  }, [query]);

  useEffect(() => {
    if (!coordinate || activeFeature !== 'nearby') return;

    const nearest = [...PLACES].sort(
      (a, b) =>
        distanceKm(coordinate, a.coordinates) -
        distanceKm(coordinate, b.coordinates),
    )[0];

    if (nearest) {
      setSelectedPlaceId(nearest.id);
      setSelectedLayerIndex(0);
    }
  }, [activeFeature, coordinate]);

  const choosePlace = (id: string) => {
    setSelectedPlaceId(id);
    setSelectedLayerIndex(0);
  };

  const activateNearby = () => {
    setActiveFeature('nearby');
    void requestLocation();
  };

  const locationText =
    locationState === 'loading' ? 'Konum alınıyor' : cityLabel;

  const selectedLayer =
    selectedPlace.layers[selectedLayerIndex] ?? selectedPlace.layers[0]!;

  return (
    <View style={styles.root}>
      <View style={styles.blueAmbient} pointerEvents="none" />
      <View style={styles.orangeAmbient} pointerEvents="none" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(52, insets.bottom + 42) },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.locationPill}
            onPress={() => void requestLocation()}
          >
            <Text style={styles.locationIcon}>⌖</Text>
            <Text numberOfLines={1} style={styles.locationText}>
              {locationText}
            </Text>
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

          <Pressable
            style={[styles.searchButton, searchOpen && styles.searchButtonActive]}
            onPress={() => {
              setSearchOpen((value) => !value);
              setQuery('');
            }}
          >
            <Text style={styles.searchIcon}>{searchOpen ? '×' : '⌕'}</Text>
          </Pressable>
        </View>

        {searchOpen && (
          <View style={styles.searchPanel}>
            <TextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder="Mekân ara: Galata, Ayasofya..."
              placeholderTextColor="#53636D"
              style={styles.searchInput}
            />
            <View style={styles.searchResults}>
              {searchResults.map((place) => {
                const km = coordinate
                  ? distanceKm(coordinate, place.coordinates)
                  : null;

                return (
                  <Pressable
                    key={place.id}
                    style={styles.searchResult}
                    onPress={() => {
                      choosePlace(place.id);
                      setSearchOpen(false);
                      setQuery('');
                    }}
                  >
                    <View style={styles.searchResultGlyph}>
                      <Text style={styles.searchResultGlyphText}>{place.glyph}</Text>
                    </View>
                    <View style={styles.searchResultCopy}>
                      <Text style={styles.searchResultTitle}>{place.name}</Text>
                      <Text style={styles.searchResultMeta}>
                        {place.district}
                        {km !== null ? ` · ${formatDistance(km)}` : ''}
                      </Text>
                    </View>
                    <Text style={styles.searchResultArrow}>→</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.heroCopy}>
          <Text style={styles.kicker}>İSTANBUL · GERÇEK MEKÂNLAR · KAYNAKLI HİKÂYELER</Text>
          <Text style={styles.heroTitle}>ŞİMDİ</Text>
          <Text style={[styles.heroTitle, styles.heroAccent, styles.heroTitleSecond]}>
            KEŞFET
          </Text>
          <Text style={styles.heroBody}>
            Şehri yalnızca bugünkü hâliyle değil, üst üste birikmiş zaman
            katmanlarıyla keşfet.
          </Text>
        </View>

        <View style={styles.radarShell}>
          <View style={styles.radarHalo} pointerEvents="none" />
          <TimeRadar
            size={radarSize}
            places={PLACES}
            selectedId={selectedPlaceId}
            onSelect={choosePlace}
          />
          <View style={styles.radarCaptionRow}>
            <Text style={styles.radarCaption}>ZAMAN HARİTASI</Text>
            <Text style={styles.radarMeta}>{PLACES.length} aktif iz</Text>
          </View>
        </View>

        <Pressable
          style={styles.placeImageCard}
          onPress={() => onOpenPlace(selectedPlace)}
        >
          <ImageBackground
            source={{ uri: selectedPlace.image.url }}
            resizeMode="cover"
            style={styles.placeImage}
            imageStyle={styles.placeImageInner}
          >
            <View style={styles.placeImageShade} />
            <View style={styles.placeImageTop}>
              <View style={styles.realPhotoBadge}>
                <Text style={styles.realPhotoBadgeText}>GERÇEK MEKÂN</Text>
              </View>
              <View style={styles.placeGlyphBadge}>
                <Text style={styles.placeGlyphBadgeText}>{selectedPlace.glyph}</Text>
              </View>
            </View>

            <View style={styles.placeImageBottom}>
              <Text style={styles.placeImageName}>{selectedPlace.name}</Text>
              <Text style={styles.placeImageMeta}>
                {selectedPlace.district}
                {selectedDistance !== null
                  ? ` · ${formatDistance(selectedDistance)}`
                  : ' · mesafe için konuma dokun'}
              </Text>
              <Text numberOfLines={2} style={styles.placeImageHook}>
                {selectedPlace.hook}
              </Text>

              <View style={styles.openRow}>
                <Text numberOfLines={1} style={styles.photoCredit}>
                  Fotoğraf: {selectedPlace.image.credit}
                </Text>
                <View style={styles.openButton}>
                  <Text style={styles.openButtonText}>KATMANI AÇ</Text>
                  <Text style={styles.openButtonArrow}>→</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </Pressable>

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
            <View
              style={[
                styles.timelineGlow,
                {
                  width: `${Math.max(
                    18,
                    ((selectedLayerIndex + 1) / selectedPlace.layers.length) * 100,
                  )}%`,
                },
              ]}
            />
            <View
              style={[
                styles.timelineDot,
                {
                  left: `${Math.min(
                    96,
                    ((selectedLayerIndex + 1) / selectedPlace.layers.length) * 100,
                  )}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.layerPreviewYear}>{selectedLayer.year}</Text>
          <Text style={styles.layerPreviewTitle}>{selectedLayer.label}</Text>
          <Text style={styles.layerPreviewBody}>{selectedLayer.body}</Text>

          <Pressable
            style={styles.listenButton}
            onPress={() => onOpenDeep(selectedPlace)}
          >
            <View style={styles.listenCircle}>
              <Text style={styles.listenIcon}>▶</Text>
            </View>
            <View style={styles.listenCopy}>
              <Text style={styles.listenKicker}>DERİN MOD</Text>
              <Text style={styles.listenText}>Türkçe sesli anlatımı başlat</Text>
            </View>
            <Text style={styles.listenArrow}>→</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>ALT MENÜ YOK · DENEYİM EKRANDA</Text>
            <Text style={styles.sectionTitle}>Katmana Gir</Text>
          </View>
        </View>

        <View style={styles.featureGrid}>
          <FeatureCard
            title="Gizli Katman"
            subtitle="Kaynaklı geçmişi aç"
            icon="◉"
            tone="blue"
            active={activeFeature === 'hidden'}
            onPress={() => setActiveFeature('hidden')}
          />
          <FeatureCard
            title="Yakındaki İzler"
            subtitle="Gerçek mesafeyi hesapla"
            icon="⌖"
            tone="lime"
            active={activeFeature === 'nearby'}
            onPress={activateNearby}
          />
          <FeatureCard
            title="Hafıza Rotası"
            subtitle="Hikâyeler arasında ilerle"
            icon="⌁"
            tone="orange"
            active={activeFeature === 'route'}
            onPress={() => setActiveFeature('route')}
          />
          <FeatureCard
            title="Derin Mod"
            subtitle="Türkçe sesli anlatım"
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
              <Text style={styles.liveText}>HAZIR</Text>
            </View>
          </View>

          <Text style={styles.featureDetailTitle}>
            {FEATURE_COPY[activeFeature].title}
          </Text>
          <Text style={styles.featureDetailBody}>
            {FEATURE_COPY[activeFeature].body}
          </Text>

          {activeFeature === 'nearby' && locationState === 'denied' && (
            <Text style={styles.permissionHint}>
              Konum izni verilmedi. Üstteki konum alanına dokunarak tekrar
              deneyebilirsin.
            </Text>
          )}

          <Pressable
            style={styles.primaryAction}
            onPress={() => {
              if (activeFeature === 'nearby') {
                void requestLocation();
                return;
              }

              if (activeFeature === 'deep') {
                onOpenDeep(selectedPlace);
                return;
              }

              if (activeFeature === 'route') {
                onOpenRoute();
                return;
              }

              onOpenPlace(selectedPlace);
            }}
          >
            <Text style={styles.primaryActionText}>
              {activeFeature === 'nearby' ? 'YAKINDAKİNİ BUL' : 'DENEYİMİ AÇ'}
            </Text>
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
              Bu mekâna bugünden bir not bırak; açılma tarihini belirle ve
              telefonunda kalıcı olarak sakla.
            </Text>
          </View>
          <Pressable
            style={styles.memoryAction}
            onPress={() => onOpenCapsule(selectedPlace)}
          >
            <Text style={styles.memoryActionText}>GELECEĞE BIRAK</Text>
          </Pressable>
        </View>

        <Text style={styles.footerText}>
          ZAMANALTI · MEKÂN · ZAMAN · İNSAN · KAYNAK
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
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: COLORS.blue,
    opacity: 0.07,
    top: 160,
    right: -190,
  },
  orangeAmbient: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.orange,
    opacity: 0.05,
    top: 870,
    left: -160,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 4,
  },
  header: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationPill: {
    maxWidth: 126,
    minWidth: 94,
    height: 38,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    color: COLORS.cyan,
    fontSize: 15,
    marginRight: 6,
  },
  locationText: {
    flexShrink: 1,
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '700',
  },
  brand: {
    alignItems: 'center',
    paddingHorizontal: 5,
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
    letterSpacing: 2.2,
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
  searchButtonActive: {
    borderColor: COLORS.lime,
  },
  searchIcon: {
    color: COLORS.text,
    fontSize: 22,
    marginTop: -2,
  },
  searchPanel: {
    marginTop: 6,
    padding: 12,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#050A0E',
  },
  searchInput: {
    height: 46,
    borderRadius: 15,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.28)',
    color: COLORS.text,
    paddingHorizontal: 14,
    fontSize: 13,
  },
  searchResults: {
    marginTop: 8,
  },
  searchResult: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.white08,
  },
  searchResultGlyph: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResultGlyphText: {
    color: COLORS.cyan,
    fontSize: 13,
    fontWeight: '900',
  },
  searchResultCopy: {
    flex: 1,
    paddingHorizontal: 10,
  },
  searchResultTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '800',
  },
  searchResultMeta: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 3,
  },
  searchResultArrow: {
    color: COLORS.lime,
    fontSize: 16,
  },
  heroCopy: {
    paddingTop: 20,
    paddingBottom: 12,
  },
  kicker: {
    color: COLORS.muted,
    fontSize: 8,
    lineHeight: 13,
    letterSpacing: 1.45,
    fontWeight: '800',
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 44,
    lineHeight: 42,
    fontWeight: '900',
    letterSpacing: -1.8,
    marginTop: 12,
  },
  heroTitleSecond: {
    marginTop: -1,
  },
  heroAccent: {
    color: COLORS.lime,
  },
  heroBody: {
    color: COLORS.muted,
    maxWidth: 330,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 13,
  },
  radarShell: {
    marginTop: 4,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(4,10,15,0.78)',
    overflow: 'hidden',
    paddingTop: 4,
    paddingBottom: 13,
  },
  radarHalo: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: COLORS.lime,
    opacity: 0.03,
    alignSelf: 'center',
    top: 62,
  },
  radarCaptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: -1,
  },
  radarCaption: {
    color: COLORS.muted,
    fontSize: 8,
    letterSpacing: 1.8,
    fontWeight: '800',
  },
  radarMeta: {
    color: COLORS.lime,
    fontSize: 8,
    letterSpacing: 0.6,
    fontWeight: '800',
  },
  placeImageCard: {
    height: 238,
    marginTop: 14,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.28)',
    backgroundColor: COLORS.surface,
  },
  placeImage: {
    flex: 1,
    justifyContent: 'space-between',
  },
  placeImageInner: {
    borderRadius: 27,
  },
  placeImageShade: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(1,4,7,0.52)',
  },
  placeImageTop: {
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  realPhotoBadge: {
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(2,6,8,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  realPhotoBadgeText: {
    color: COLORS.lime,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
  },
  placeGlyphBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(2,6,8,0.72)',
    borderWidth: 1,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeGlyphBadgeText: {
    color: COLORS.cyan,
    fontSize: 15,
    fontWeight: '900',
  },
  placeImageBottom: {
    padding: 16,
  },
  placeImageName: {
    color: COLORS.text,
    fontSize: 29,
    lineHeight: 33,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  placeImageMeta: {
    color: COLORS.cyan,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 5,
  },
  placeImageHook: {
    color: '#D2DADD',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 7,
    maxWidth: '92%',
  },
  openRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  photoCredit: {
    flex: 1,
    color: '#89979E',
    fontSize: 7,
    marginRight: 10,
  },
  openButton: {
    minHeight: 36,
    borderRadius: 18,
    paddingHorizontal: 13,
    backgroundColor: COLORS.lime,
    flexDirection: 'row',
    alignItems: 'center',
  },
  openButtonText: {
    color: '#050700',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  openButtonArrow: {
    color: '#050700',
    fontSize: 14,
    marginLeft: 7,
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
    fontSize: 8,
    letterSpacing: 1.5,
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
    fontSize: 10,
  },
  eraRow: {
    paddingRight: 18,
  },
  eraChip: {
    width: 142,
    minHeight: 60,
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
    borderRadius: 2,
    backgroundColor: COLORS.cyan,
  },
  timelineDot: {
    position: 'absolute',
    top: -4,
    width: 11,
    height: 11,
    borderRadius: 6,
    marginLeft: -6,
    backgroundColor: COLORS.lime,
  },
  layerPreviewYear: {
    color: COLORS.orange,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
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
    minHeight: 58,
    borderRadius: 22,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(23,109,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.38)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listenCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listenIcon: {
    color: COLORS.cyan,
    fontSize: 11,
    marginLeft: 2,
  },
  listenCopy: {
    flex: 1,
    paddingHorizontal: 11,
  },
  listenKicker: {
    color: COLORS.cyan,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  listenText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },
  listenArrow: {
    color: COLORS.lime,
    fontSize: 18,
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
    fontSize: 8,
    letterSpacing: 1.7,
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
    letterSpacing: 1,
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
  permissionHint: {
    color: COLORS.orange,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 10,
  },
  primaryAction: {
    marginTop: 18,
    minHeight: 48,
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
    letterSpacing: 1.3,
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
    letterSpacing: 1.6,
    marginTop: 32,
  },
});
