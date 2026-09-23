import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InAppMap } from '../components/InAppMap';
import { PLACES, type Place } from '../data/places';
import { useUserLocation } from '../hooks/useUserLocation';
import { distanceKm, formatDistance } from '../utils/geo';
import { COLORS, RADII } from '../theme';

type Props = {
  onBack: () => void;
  onOpenPlace: (place: Place) => void;
};

const ISTANBUL_CENTER = {
  latitude: 41.019,
  longitude: 28.965,
};

export function NearbyScreen({ onBack, onOpenPlace }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(ISTANBUL_CENTER);
  const { coordinate, cityLabel, state, requestLocation } = useUserLocation();

  useEffect(() => {
    void requestLocation();
  }, []);

  const sortedPlaces = useMemo(() => {
    if (!coordinate) return PLACES.map((place) => ({ place, km: null }));

    return PLACES.map((place) => ({
      place,
      km: distanceKm(coordinate, place.coordinates),
    })).sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity));
  }, [coordinate]);

  useEffect(() => {
    const first = sortedPlaces[0];
    if (first && !selectedId) {
      setSelectedId(first.place.id);
      setMapCenter({ ...first.place.coordinates });
    }
  }, [sortedPlaces, selectedId]);

  const mapPoints = useMemo(
    () =>
      PLACES.map((place) => ({
        id: place.id,
        label: place.name,
        glyph: place.glyph,
        coordinate: place.coordinates,
        tone: 'cyan' as const,
      })),
    [],
  );

  const focusPlace = (place: Place) => {
    setSelectedId(place.id);
    setMapCenter({ ...place.coordinates });
  };

  const nearestDistance = sortedPlaces[0]?.km ?? null;

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
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
            <Text style={styles.brandSub}>YAKINDAKİ İZLER</Text>
          </View>

          <Pressable
            onPress={() => void requestLocation()}
            style={styles.locationButton}
          >
            <Text style={styles.locationButtonText}>⌖</Text>
          </Pressable>
        </View>

        <Text style={styles.eyebrow}>KONUMUNA GÖRE · UYGULAMA İÇİNDE</Text>
        <Text style={styles.title}>Yakındaki geçmişi bul.</Text>
        <Text style={styles.subtitle}>
          Konum izni verdiğinde kayıtları gerçek kuş uçuşu mesafesine göre
          sıralıyoruz. Harita bu ekranın içinde çalışır; Google Maps açılmaz.
        </Text>

        <View style={styles.statusPanel}>
          <View
            style={[
              styles.statusDot,
              state === 'ready' && styles.statusDotReady,
              (state === 'error' || state === 'denied') && styles.statusDotError,
            ]}
          />
          <View style={styles.statusCopy}>
            <Text style={styles.statusLabel}>KONUM DURUMU</Text>
            <Text style={styles.statusText}>
              {state === 'loading'
                ? 'Konum alınıyor...'
                : state === 'ready'
                  ? `${cityLabel} · mesafeler güncel`
                  : state === 'denied'
                    ? 'Konum izni verilmedi'
                    : state === 'error'
                      ? 'Konum alınamadı'
                      : 'Konum bekleniyor'}
            </Text>
          </View>
          {(state === 'denied' || state === 'error') && (
            <Pressable
              style={styles.retryButton}
              onPress={() => void requestLocation()}
            >
              <Text style={styles.retryText}>TEKRAR</Text>
            </Pressable>
          )}
        </View>

        {nearestDistance !== null && nearestDistance > 50 && (
          <View style={styles.collectionNotice}>
            <Text style={styles.collectionNoticeTitle}>
              İlk koleksiyon İstanbul’da
            </Text>
            <Text style={styles.collectionNoticeText}>
              Bulunduğun konuma 50 km içinde kayıt yok. Yine de İstanbul
              koleksiyonunu mesafeye göre sıraladık.
            </Text>
          </View>
        )}

        <View style={styles.mapFrame}>
          <InAppMap
            center={mapCenter}
            points={mapPoints}
            selectedId={selectedId}
            userCoordinate={coordinate}
            initialZoom={13}
            height={300}
            onSelect={(id) => {
              const place = PLACES.find((item) => item.id === id);
              if (place) focusPlace(place);
            }}
          />
          <View style={styles.mapLabel} pointerEvents="none">
            <Text style={styles.mapLabelText}>OPENSTREETMAP · UYGULAMA İÇİ</Text>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listEyebrow}>MESAFEYE GÖRE</Text>
          <Text style={styles.listCount}>{PLACES.length}</Text>
        </View>

        <View style={styles.list}>
          {sortedPlaces.map(({ place, km }, index) => {
            const selected = place.id === selectedId;
            return (
              <Pressable
                key={place.id}
                onPress={() => focusPlace(place)}
                style={[styles.card, selected && styles.cardSelected]}
              >
                <View style={styles.rank}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <View style={styles.cardCopy}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeMeta}>
                    {place.district}
                    {km !== null ? ` · ${formatDistance(km)}` : ''}
                  </Text>
                  <Text numberOfLines={2} style={styles.placeHook}>
                    {place.hook}
                  </Text>
                </View>
                <Pressable
                  style={styles.openButton}
                  onPress={() => onOpenPlace(place)}
                >
                  <Text style={styles.openText}>AÇ</Text>
                </Pressable>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.notePanel}>
          <Text style={styles.noteTitle}>Konum nasıl kullanılıyor?</Text>
          <Text style={styles.noteBody}>
            Konum yalnızca mesafe hesabı için cihazda kullanılır. Harita
            OpenStreetMap karo verisini doğrudan ZAMANALTI içinde gösterir.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 18, paddingTop: 4 },
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
  brandBlock: { alignItems: 'center' },
  brand: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2.5,
  },
  brandAccent: { color: COLORS.lime },
  brandSub: {
    color: COLORS.lime,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.7,
    marginTop: 4,
  },
  locationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: COLORS.lime,
    backgroundColor: 'rgba(203,255,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationButtonText: { color: COLORS.lime, fontSize: 18 },
  eyebrow: {
    color: COLORS.lime,
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
  statusPanel: {
    minHeight: 66,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.muted,
    marginRight: 10,
  },
  statusDotReady: { backgroundColor: COLORS.lime },
  statusDotError: { backgroundColor: COLORS.orange },
  statusCopy: { flex: 1 },
  statusLabel: {
    color: COLORS.cyan,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  statusText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  retryButton: {
    minHeight: 32,
    borderRadius: 16,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: COLORS.orange,
    justifyContent: 'center',
  },
  retryText: {
    color: COLORS.orange,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  collectionNotice: {
    marginTop: 10,
    borderRadius: 17,
    padding: 13,
    backgroundColor: 'rgba(255,106,0,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,106,0,0.25)',
  },
  collectionNoticeTitle: {
    color: COLORS.orange,
    fontSize: 10,
    fontWeight: '900',
  },
  collectionNoticeText: {
    color: COLORS.muted,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 5,
  },
  mapFrame: {
    height: 300,
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.32)',
    backgroundColor: COLORS.surface,
  },
  mapLabel: {
    position: 'absolute',
    left: 12,
    bottom: 30,
    minHeight: 28,
    borderRadius: 14,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(3,8,12,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.4)',
    justifyContent: 'center',
  },
  mapLabelText: {
    color: COLORS.cyan,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
  },
  listHeader: {
    marginTop: 26,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  listEyebrow: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  listCount: { color: COLORS.lime, fontSize: 18, fontWeight: '900' },
  list: { gap: 9 },
  card: {
    minHeight: 110,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#060B0F',
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: COLORS.lime,
    backgroundColor: 'rgba(203,255,0,0.035)',
  },
  rank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: { color: COLORS.cyan, fontSize: 11, fontWeight: '900' },
  cardCopy: { flex: 1, paddingHorizontal: 11 },
  placeName: { color: COLORS.text, fontSize: 15, fontWeight: '900' },
  placeMeta: { color: COLORS.muted, fontSize: 9, marginTop: 3 },
  placeHook: {
    color: '#AAB5BA',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 7,
  },
  openButton: {
    width: 54,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openText: {
    color: '#050700',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.9,
  },
  notePanel: {
    marginTop: 20,
    borderRadius: RADII.lg,
    padding: 17,
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.2)',
    backgroundColor: 'rgba(203,255,0,0.035)',
  },
  noteTitle: { color: COLORS.text, fontSize: 15, fontWeight: '900' },
  noteBody: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 7,
  },
});
