import React from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PLACES, type Place } from '../data/places';
import { COLORS, RADII } from '../theme';

type Props = {
  onBack: () => void;
  onOpenPlace: (place: Place) => void;
};

const openMaps = (place: Place) => {
  const { latitude, longitude } = place.coordinates;
  const label = encodeURIComponent(place.name);

  const url =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${label}`
      : `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`;

  void Linking.openURL(url);
};

export function RouteScreen({ onBack, onOpenPlace }: Props) {
  const insets = useSafeAreaInsets();

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

        <Text style={styles.eyebrow}>İSTANBUL · İLK ROTA</Text>
        <Text style={styles.title}>Şehri tarihin içinden yürü.</Text>
        <Text style={styles.subtitle}>
          Bu rota dört doğrulanmış mekânı birbirine bağlıyor. Her durakta
          mekânın zaman katmanını açabilir veya telefonunun harita uygulamasında
          yol tarifini başlatabilirsin.
        </Text>

        <View style={styles.routeLine}>
          {PLACES.map((place, index) => (
            <View key={place.id} style={styles.stopWrap}>
              {index < PLACES.length - 1 && <View style={styles.connector} />}

              <View style={styles.stopRow}>
                <View style={styles.stopRail}>
                  <View style={styles.stopNode}>
                    <Text style={styles.stopNodeText}>{index + 1}</Text>
                  </View>
                </View>

                <View style={styles.stopCard}>
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
                      onPress={() => onOpenPlace(place)}
                    >
                      <Text style={styles.secondaryActionText}>KATMANI AÇ</Text>
                    </Pressable>

                    <Pressable
                      style={styles.primaryAction}
                      onPress={() => openMaps(place)}
                    >
                      <Text style={styles.primaryActionText}>YOL TARİFİ</Text>
                      <Text style={styles.primaryArrow}>↗</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.notePanel}>
          <Text style={styles.noteKicker}>ROTA NASIL ÇALIŞIR?</Text>
          <Text style={styles.noteTitle}>ZAMANALTI yön tarifi üretmez.</Text>
          <Text style={styles.noteBody}>
            Güvenilir ve güncel navigasyon için cihazındaki harita uygulamasını
            açar. ZAMANALTI’nın görevi rota üzerindeki mekânların tarih
            katmanlarını, kaynaklarını ve anlatılarını birbirine bağlamaktır.
          </Text>
        </View>
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
  countText: {
    color: COLORS.orange,
    fontSize: 13,
    fontWeight: '900',
  },
  eyebrow: {
    color: COLORS.orange,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.7,
    marginTop: 28,
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
  routeLine: {
    marginTop: 28,
  },
  stopWrap: {
    position: 'relative',
  },
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
  stopRail: {
    width: 40,
    alignItems: 'center',
    paddingTop: 10,
  },
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
  stopNodeText: {
    color: COLORS.orange,
    fontSize: 10,
    fontWeight: '900',
  },
  stopCard: {
    flex: 1,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 15,
    marginLeft: 8,
  },
  stopTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  placeGlyphText: {
    color: COLORS.cyan,
    fontSize: 15,
    fontWeight: '900',
  },
  stopCopy: {
    flex: 1,
    paddingLeft: 11,
  },
  placeName: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '900',
  },
  placeMeta: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 3,
  },
  placeHook: {
    color: '#A8B4BA',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 12,
  },
  stopActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
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
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.9,
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
    letterSpacing: 0.9,
  },
  primaryArrow: {
    color: '#050700',
    fontSize: 13,
    marginLeft: 6,
  },
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
