import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
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
  onOpenCapsule: () => void;
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

export function HomeScreen({ onOpenPlace, onOpenDeep, onOpenCapsule }: Props) {
  const { width } = useWindowDimensions();
  const radarSize = Math.min(width - 36, 390);
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
    locationState === 'loading'
      ? 'Konum alınıyor'
      : cityLabel;

  return (
    <View style={styles.root}>
      <View style={styles.blueAmbient} pointerEvents="none" />
      <View style={styles.orangeAmbient} pointerEvents="none" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
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
          <Text style={styles.kicker}>İSTANBUL KOLEKSİYONU · GERÇEK KAYNAKLAR</Text>
          <Text style={styles.heroTitle}>
            ŞİMDİ{'\n'}
            <Text style={styles.heroAccent}>KEŞFET</Text>
          </Text>
          <Text style={styles.heroBody}>
            Gerçek bir mekân seç; farklı dönemleri, kaynakları ve sesli anlatıyı
            tek deneyim içinde aç.
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
            <Text style={styles.radarMeta}>{PLACES.length} doğrulanmış mekân</Text>
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
                {selectedPlace.district}
                {selectedDistance !== null
                  ? ` · ${formatDistance(selectedDistance)}`
                  : ' · mesafe için konuma dokun'}
              </Text>
            </View>
            <Pressable
              style={styles.enterButton}
              onPress={() => onOpenPlace(selectedPlace)}
            >
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

          <View style={styles.layerPreviewCopy}>
            <Text style={styles.layerPreviewYear}>
              {selectedPlace.layers[selectedLayerIndex]?.year}
            </Text>
            <Text style={styles.layerPreviewTitle}>
              {selectedPlace.layers[selectedLayerIndex]?.label}
            </Text>
            <Text style={styles.layerPreviewBody}>
              {selectedPlace.layers[selectedLayerIndex]?.body}
            </Text>
          </View>

          <Pressable
            style={styles.listenButton}
            onPress={() => onOpenDeep(selectedPlace)}
          >
            <Text style={styles.listenIcon}>▶</Text>
            <Text style={styles.listenText}>Gerçek anlatımı dinle</Text>
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
              <Text style={styles.liveText}>ÇALIŞIYOR</Text>
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
              Konum izni verilmedi. İstersen üstteki konum alanına dokunup tekrar
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
              Bir mekâna bugünden bir not bırak; açılma tarihini belirle ve
              telefonunda kalıcı olarak sakla.
            </Text>
          </View>
          <Pressable style={styles.memoryAction} onPress={onOpenCapsule}>
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
    paddingTop: 6,
    paddingBottom: 34,
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
    paddingTop: 24,
    paddingBottom: 8,
  },
  kicker: {
    color: COLORS.muted,
    fontSize: 9,
    letterSpacing: 1.6,
    fontWeight: '700',
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 43,
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
    maxWidth: 330,
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
    letterSpacing: 0.7,
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
    fontSize: 10,
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
  layerPreviewCopy: {
    paddingRight: 4,
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
    minHeight: 46,
    borderRadius: 23,
    paddingHorizontal: 14,
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
