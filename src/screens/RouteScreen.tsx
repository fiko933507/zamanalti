import React, { useMemo, useState } from 'react';
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
import { COLORS, RADII } from '../theme';

type Props = {
  onBack: () => void;
  onOpenPlace: (place: Place) => void;
};

const ISTANBUL_CENTER = {
  latitude: 41.019,
  longitude: 28.965,
};

export function RouteScreen({ onBack, onOpenPlace }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState(PLACES[0]!.id);
  const [mapCenter, setMapCenter] = useState(ISTANBUL_CENTER);

  const selectedPlace = useMemo(
    () => PLACES.find((place) => place.id === selectedId) ?? PLACES[0]!,
    [selectedId],
  );

  const mapPoints = useMemo(
    () =>
      PLACES.map((place) => ({
        id: place.id,
        label: place.name,
        glyph: place.glyph,
        coordinate: place.coordinates,
        tone: 'orange' as const,
      })),
    [],
  );

  const focusPlace = (place: Place) => {
    setSelectedId(place.id);
    setMapCenter({ ...place.coordinates });
  };

  return (
    <View style={styles.root}>
      <View style={styles.orangeGlow} pointerEvents="none" />

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
            <Text style={styles.brandSub}>HAFIZA ROTASI</Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>{PLACES.length}</Text>
          </View>
        </View>

        <Text style={styles.eyebrow}>İSTANBUL · TAMAMEN UYGULAMA İÇİNDE</Text>
        <Text style={styles.title}>Şehri tarihin içinden yürü.</Text>
        <Text style={styles.subtitle}>
          Harita, duraklar ve tarih katmanları ZAMANALTI içinde kalır. Bu
          ekranda Google Maps, Apple Maps veya başka bir navigasyon uygulaması
          açılmaz.
        </Text>

        <View style={styles.mapFrame}>
          <InAppMap
            center={mapCenter}
            points={mapPoints}
            selectedId={selectedId}
            routeCoordinates={PLACES.map((place) => place.coordinates)}
            initialZoom={13}
            height={330}
            onSelect={(id) => {
              const place = PLACES.find((item) => item.id === id);
              if (place) focusPlace(place);
            }}
          />
          <View style={styles.mapOverlayTop} pointerEvents="none">
            <Text style={styles.mapOverlayKicker}>ZAMAN ROTASI</Text>
            <Text style={styles.mapOverlayText}>
              Turuncu çizgi, mekânların hikâye sırasını gösterir. + / − ile
              haritayı yakınlaştırabilirsin.
            </Text>
          </View>
        </View>

        <View style={styles.selectedPanel}>
          <View style={styles.selectedIndex}>
            <Text style={styles.selectedIndexText}>
              {PLACES.findIndex((item) => item.id === selectedPlace.id) + 1}
            </Text>
          </View>

          <View style={styles.selectedCopy}>
            <Text style={styles.selectedName}>{selectedPlace.name}</Text>
            <Text style={styles.selectedMeta}>
              {selectedPlace.district} · {selectedPlace.city}
            </Text>
            <Text numberOfLines={2} style={styles.selectedHook}>
              {selectedPlace.hook}
            </Text>
          </View>

          <Pressable
            style={styles.openSelected}
            onPress={() => onOpenPlace(selectedPlace)}
          >
            <Text style={styles.openSelectedText}>AÇ</Text>
          </Pressable>
        </View>

        <View style={styles.routeLine}>
          {PLACES.map((place, index) => {
            const selected = place.id === selectedId;

            return (
              <View key={place.id} style={styles.stopWrap}>
                {index < PLACES.length - 1 && <View style={styles.connector} />}

                <View style={styles.stopRow}>
                  <View style={styles.stopRail}>
                    <View
                      style={[
                        styles.stopNode,
                        selected && styles.stopNodeSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.stopNodeText,
                          selected && styles.stopNodeTextSelected,
                        ]}
                      >
                        {index + 1}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.stopCard,
                      selected && styles.stopCardSelected,
                    ]}
                  >
                    <View style={styles.stopTop}>
                      <View style={styles.placeGlyph}>
                        <Text style={styles.placeGlyphText}>{place.glyph}</Text>
                      </View>
                      <View style={styles.stopCopy}>
                        <Text style={styles.placeName}>{place.name}</Text>
                        <Text style={styles.placeMeta}>
                          {place.district} · {place.city}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.placeHook}>{place.hook}</Text>

                    <View style={styles.stopActions}>
                      <Pressable
                        style={styles.secondaryAction}
                        onPress={() => focusPlace(place)}
                      >
                        <Text style={styles.secondaryActionText}>
                          HARİTADA ODAKLA
                        </Text>
                      </Pressable>
                      <Pressable
                        style={styles.primaryAction}
                        onPress={() => onOpenPlace(place)}
                      >
                        <Text style={styles.primaryActionText}>KATMANI AÇ</Text>
                        <Text style={styles.primaryArrow}>→</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.notePanel}>
          <Text style={styles.noteKicker}>HARİTA MOTORU</Text>
          <Text style={styles.noteTitle}>Google Maps bağımlılığı kaldırıldı.</Text>
          <Text style={styles.noteBody}>
            Harita OpenStreetMap karo verilerini ZAMANALTI arayüzünün içinde
            gösterir. Böylece boş Google haritası ve dış uygulamaya atlama
            sorunu ortadan kalkar.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 18, paddingTop: 4 },
  orangeGlow: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: COLORS.orange,
    opacity: 0.07,
    top: 180,
    left: -210,
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
  brandBlock: { alignItems: 'center' },
  brand: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2.5,
  },
  brandAccent: { color: COLORS.lime },
  brandSub: {
    color: COLORS.orange,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 4,
  },
  countBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: COLORS.orange,
    backgroundColor: 'rgba(255,106,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { color: COLORS.orange, fontSize: 13, fontWeight: '900' },
  eyebrow: {
    color: COLORS.orange,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.7,
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
  mapFrame: {
    height: 330,
    marginTop: 20,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,106,0,0.34)',
    backgroundColor: COLORS.surface,
  },
  mapOverlayTop: {
    position: 'absolute',
    left: 12,
    right: 58,
    top: 12,
    borderRadius: 16,
    padding: 10,
    backgroundColor: 'rgba(2,6,9,0.84)',
    borderWidth: 1,
    borderColor: 'rgba(255,106,0,0.32)',
  },
  mapOverlayKicker: {
    color: COLORS.orange,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  mapOverlayText: {
    color: '#B4C0C6',
    fontSize: 8,
    lineHeight: 13,
    marginTop: 4,
  },
  selectedPanel: {
    marginTop: 12,
    minHeight: 104,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.28)',
    backgroundColor: '#071009',
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedIndex: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndexText: { color: COLORS.lime, fontSize: 11, fontWeight: '900' },
  selectedCopy: { flex: 1, paddingHorizontal: 10 },
  selectedName: { color: COLORS.text, fontSize: 15, fontWeight: '900' },
  selectedMeta: { color: COLORS.muted, fontSize: 8, marginTop: 3 },
  selectedHook: {
    color: '#AAB5BA',
    fontSize: 8,
    lineHeight: 12,
    marginTop: 5,
  },
  openSelected: {
    width: 52,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openSelectedText: { color: '#050700', fontSize: 8, fontWeight: '900' },
  routeLine: { marginTop: 24 },
  stopWrap: { position: 'relative' },
  connector: {
    position: 'absolute',
    left: 19,
    top: 50,
    bottom: -22,
    width: 2,
    backgroundColor: 'rgba(255,106,0,0.35)',
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  stopRail: { width: 40, alignItems: 'center', paddingTop: 10 },
  stopNode: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.orange,
    backgroundColor: '#100B08',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stopNodeSelected: {
    borderColor: COLORS.lime,
    backgroundColor: 'rgba(203,255,0,0.09)',
  },
  stopNodeText: { color: COLORS.orange, fontSize: 10, fontWeight: '900' },
  stopNodeTextSelected: { color: COLORS.lime },
  stopCard: {
    flex: 1,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 15,
    marginLeft: 8,
  },
  stopCardSelected: { borderColor: 'rgba(203,255,0,0.38)' },
  stopTop: { flexDirection: 'row', alignItems: 'center' },
  placeGlyph: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: COLORS.cyan,
    backgroundColor: 'rgba(67,215,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeGlyphText: { color: COLORS.cyan, fontSize: 15, fontWeight: '900' },
  stopCopy: { flex: 1, paddingLeft: 11 },
  placeName: { color: COLORS.text, fontSize: 17, fontWeight: '900' },
  placeMeta: { color: COLORS.muted, fontSize: 9, marginTop: 3 },
  placeHook: {
    color: '#A8B4BA',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 12,
  },
  stopActions: { flexDirection: 'row', gap: 8, marginTop: 14 },
  secondaryAction: {
    flex: 1,
    minHeight: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: {
    color: COLORS.cyan,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  primaryAction: {
    flex: 1,
    minHeight: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lime,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionText: {
    color: '#050700',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  primaryArrow: { color: '#050700', fontSize: 13, marginLeft: 6 },
  notePanel: {
    marginTop: 8,
    borderRadius: RADII.lg,
    padding: 18,
    backgroundColor: 'rgba(255,106,0,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(255,106,0,0.2)',
  },
  noteKicker: {
    color: COLORS.orange,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  noteTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 7,
  },
  noteBody: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
  },
});
