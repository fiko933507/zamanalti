import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Place } from '../data/places';
import { COLORS, RADII } from '../theme';

type Props = {
  place: Place;
  onBack: () => void;
};

type Capsule = {
  id: string;
  placeId: string;
  placeName: string;
  message: string;
  createdAt: string;
  unlockAt: string;
};

const STORAGE_KEY = '@zamanalti/time-capsules/v1';

const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(12, 0, 0, 0);
  return date;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

export function TimeCapsuleScreen({ place, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [unlockDate, setUnlockDate] = useState(tomorrow);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);

  const placeCapsules = useMemo(
    () => capsules.filter((item) => item.placeId === place.id),
    [capsules, place.id],
  );

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Capsule[];
          setCapsules(Array.isArray(parsed) ? parsed : []);
        }
      } catch {
        Alert.alert(
          'Kapsüller okunamadı',
          'Bu cihazdaki kayıtlar şu anda okunamadı.',
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const persist = async (next: Capsule[]) => {
    setCapsules(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const saveCapsule = async () => {
    const cleanMessage = message.trim();

    if (!cleanMessage) return;

    if (unlockDate.getTime() <= Date.now()) {
      Alert.alert('Tarih seç', 'Açılma tarihi gelecekte olmalı.');
      return;
    }

    const capsule: Capsule = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      placeId: place.id,
      placeName: place.name,
      message: cleanMessage,
      createdAt: new Date().toISOString(),
      unlockAt: unlockDate.toISOString(),
    };

    try {
      await persist([capsule, ...capsules]);
      setMessage('');
      setUnlockDate(tomorrow());
      Alert.alert(
        'Zaman kapsülü kaydedildi',
        `${place.name} için kapsül ${formatDate(
          new Date(capsule.unlockAt),
        )} tarihinde açılacak.`,
      );
    } catch {
      Alert.alert(
        'Kayıt başarısız',
        'Zaman kapsülü bu cihaza kaydedilemedi. Tekrar deneyebilirsin.',
      );
    }
  };

  const deleteCapsule = (id: string) => {
    Alert.alert(
      'Kapsülü sil?',
      'Bu işlem geri alınamaz.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            void persist(capsules.filter((item) => item.id !== id));
          },
        },
      ],
    );
  };

  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setPickerOpen(false);
    }

    if (event.type === 'dismissed' || !selected) return;

    selected.setHours(12, 0, 0, 0);
    setUnlockDate(selected);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.violetGlow} pointerEvents="none" />
      <View style={styles.contentGlow} pointerEvents="none" />

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
            <Text style={styles.brandSub}>GELECEĞE BIRAK</Text>
          </View>

          <View style={styles.placeBadge}>
            <Text numberOfLines={1} style={styles.placeBadgeText}>
              {place.glyph}
            </Text>
          </View>
        </View>

        <View style={styles.portal}>
          <View style={styles.ringOne} />
          <View style={styles.ringTwo} />
          <View style={styles.ringThree} />
          <View style={styles.door}>
            <View style={styles.doorGlow} />
            <Text style={styles.infinity}>∞</Text>
          </View>
        </View>

        <Text style={styles.eyebrow}>{place.name.toLocaleUpperCase('tr-TR')}</Text>
        <Text style={styles.title}>Bu yerde bir iz bırak.</Text>
        <Text style={styles.subtitle}>
          Mesajını ve açılma tarihini seç. Kapsül bu cihazda kalıcı olarak
          saklanır; tarih gelmeden içerik listede kapalı görünür.
        </Text>

        <View style={styles.composer}>
          <Text style={styles.label}>MESAJIN</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Gelecekteki hâline bu mekânla ilgili bir şey bırak..."
            placeholderTextColor="#56656E"
            multiline
            maxLength={500}
            style={styles.input}
          />

          <View style={styles.composerBottom}>
            <Text style={styles.counter}>{message.length}/500</Text>
            <View style={styles.typeRow}>
              <View style={styles.typePillActive}>
                <Text style={styles.typePillActiveText}>YAZI</Text>
              </View>
              <View style={styles.typePillDisabled}>
                <Text style={styles.typePillDisabledText}>SES · SONRA</Text>
              </View>
              <View style={styles.typePillDisabled}>
                <Text style={styles.typePillDisabledText}>GÖRSEL · SONRA</Text>
              </View>
            </View>
          </View>
        </View>

        <Pressable
          style={styles.unlockPanel}
          onPress={() => setPickerOpen(true)}
        >
          <View style={styles.unlockCopy}>
            <Text style={styles.unlockKicker}>NE ZAMAN AÇILSIN?</Text>
            <Text style={styles.unlockTitle}>{formatDate(unlockDate)}</Text>
            <Text style={styles.unlockBody}>
              Tarihi değiştirmek için dokun.
            </Text>
          </View>
          <Text style={styles.unlockArrow}>›</Text>
        </Pressable>

        {pickerOpen && (
          <View style={styles.pickerWrap}>
            <DateTimePicker
              value={unlockDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              minimumDate={tomorrow()}
              onChange={onDateChange}
              themeVariant="dark"
            />
            {Platform.OS === 'ios' && (
              <Pressable
                style={styles.pickerDone}
                onPress={() => setPickerOpen(false)}
              >
                <Text style={styles.pickerDoneText}>TAMAM</Text>
              </Pressable>
            )}
          </View>
        )}

        <View style={styles.visibilityPanel}>
          <View style={styles.visibilityMark}>
            <Text style={styles.visibilityMarkText}>◉</Text>
          </View>
          <View style={styles.visibilityCopy}>
            <Text style={styles.visibilityTitle}>Yalnızca bu cihazda</Text>
            <Text style={styles.visibilityBody}>
              Bu sürüm hesap ya da bulut kullanmaz. Kapsüller cihazın yerel
              depolamasında saklanır.
            </Text>
          </View>
        </View>

        <Pressable
          disabled={!message.trim()}
          onPress={() => void saveCapsule()}
          style={[
            styles.saveButton,
            !message.trim() && styles.saveButtonDisabled,
          ]}
        >
          <Text style={styles.saveText}>ZAMAN KAPSÜLÜNÜ KAYDET</Text>
          <Text style={styles.saveArrow}>→</Text>
        </Pressable>

        <View style={styles.savedHeader}>
          <View>
            <Text style={styles.savedEyebrow}>BU MEKÂNDAKİ KAPSÜLLER</Text>
            <Text style={styles.savedTitle}>Zaman Defteri</Text>
          </View>
          <Text style={styles.savedCount}>
            {loading ? '...' : placeCapsules.length}
          </Text>
        </View>

        {!loading && placeCapsules.length === 0 && (
          <View style={styles.emptyPanel}>
            <Text style={styles.emptyTitle}>Henüz kapsül yok.</Text>
            <Text style={styles.emptyBody}>
              İlk kapsülü kaydettiğinde burada görünecek.
            </Text>
          </View>
        )}

        <View style={styles.capsuleList}>
          {placeCapsules.map((capsule) => {
            const unlockAt = new Date(capsule.unlockAt);
            const unlocked = unlockAt.getTime() <= Date.now();

            return (
              <View key={capsule.id} style={styles.capsuleCard}>
                <View style={styles.capsuleTop}>
                  <View
                    style={[
                      styles.lockMark,
                      unlocked && styles.lockMarkUnlocked,
                    ]}
                  >
                    <Text
                      style={[
                        styles.lockText,
                        unlocked && styles.lockTextUnlocked,
                      ]}
                    >
                      {unlocked ? '✓' : '•'}
                    </Text>
                  </View>
                  <View style={styles.capsuleCopy}>
                    <Text style={styles.capsuleState}>
                      {unlocked ? 'KAPSÜL AÇILDI' : 'KAPSÜL KAPALI'}
                    </Text>
                    <Text style={styles.capsuleDate}>
                      {unlocked
                        ? `${formatDate(unlockAt)} tarihinde açıldı`
                        : `${formatDate(unlockAt)} tarihinde açılacak`}
                    </Text>
                  </View>
                  <Pressable
                    hitSlop={10}
                    onPress={() => deleteCapsule(capsule.id)}
                  >
                    <Text style={styles.deleteText}>SİL</Text>
                  </Pressable>
                </View>

                {unlocked ? (
                  <Text style={styles.unlockedMessage}>{capsule.message}</Text>
                ) : (
                  <Text style={styles.lockedMessage}>
                    İçerik açılma tarihine kadar gizli.
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.privacyNote}>
          <Text style={styles.privacyTitle}>Önemli</Text>
          <Text style={styles.privacyBody}>
            Yerel depolama şifreli bir kasa değildir. Hassas veya gizli bilgi
            kaydetme. Bulut yedekleme ve uçtan uca şifreleme üretim backend’i
            bağlandığında ayrıca ele alınmalıdır.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 18, paddingTop: 4 },
  violetGlow: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: '#703CFF',
    opacity: 0.12,
    top: 80,
    right: -190,
  },
  contentGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: COLORS.blue,
    opacity: 0.08,
    top: 470,
    left: -150,
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
  placeBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: COLORS.lime,
    backgroundColor: 'rgba(203,255,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeBadgeText: {
    color: COLORS.lime,
    fontSize: 14,
    fontWeight: '900',
  },
  brandBlock: { alignItems: 'center' },
  brand: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2.5,
  },
  brandAccent: { color: COLORS.lime },
  brandSub: {
    color: '#A47CFF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 4,
  },
  portal: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOne: {
    position: 'absolute',
    width: 252,
    height: 252,
    borderRadius: 126,
    borderWidth: 1,
    borderColor: 'rgba(112,60,255,0.24)',
  },
  ringTwo: {
    position: 'absolute',
    width: 196,
    height: 196,
    borderRadius: 98,
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.24)',
    borderStyle: 'dashed',
    transform: [{ rotate: '19deg' }],
  },
  ringThree: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.28)',
  },
  door: {
    width: 76,
    height: 120,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: '#A47CFF',
    backgroundColor: '#090615',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#A47CFF',
    shadowOpacity: 0.55,
    shadowRadius: 22,
    elevation: 10,
  },
  doorGlow: {
    position: 'absolute',
    width: 44,
    height: 150,
    backgroundColor: '#A47CFF',
    opacity: 0.12,
  },
  infinity: {
    color: '#C9B4FF',
    fontSize: 32,
    fontWeight: '300',
  },
  eyebrow: {
    color: '#A47CFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.7,
  },
  title: {
    color: COLORS.text,
    fontSize: 36,
    lineHeight: 41,
    fontWeight: '900',
    letterSpacing: -1.3,
    marginTop: 8,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
  },
  composer: {
    marginTop: 24,
    borderRadius: RADII.lg,
    backgroundColor: '#080B12',
    borderWidth: 1,
    borderColor: 'rgba(164,124,255,0.32)',
    padding: 16,
  },
  label: {
    color: '#A47CFF',
    fontSize: 8,
    letterSpacing: 1.8,
    fontWeight: '900',
  },
  input: {
    minHeight: 132,
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
    textAlignVertical: 'top',
    paddingTop: 15,
    paddingHorizontal: 0,
  },
  composerBottom: {
    borderTopWidth: 1,
    borderTopColor: COLORS.white08,
    paddingTop: 12,
  },
  counter: {
    color: COLORS.muted,
    fontSize: 8,
    textAlign: 'right',
    marginBottom: 10,
  },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typePillActive: {
    height: 30,
    borderRadius: 15,
    backgroundColor: '#A47CFF',
    justifyContent: 'center',
    paddingHorizontal: 13,
  },
  typePillActiveText: {
    color: '#0A0614',
    fontSize: 8,
    letterSpacing: 1,
    fontWeight: '900',
  },
  typePillDisabled: {
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    paddingHorizontal: 11,
    opacity: 0.65,
  },
  typePillDisabledText: {
    color: COLORS.muted,
    fontSize: 7,
    letterSpacing: 0.6,
    fontWeight: '900',
  },
  unlockPanel: {
    marginTop: 12,
    minHeight: 94,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },
  unlockCopy: { flex: 1 },
  unlockKicker: {
    color: COLORS.cyan,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  unlockTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 7,
  },
  unlockBody: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 6,
  },
  unlockArrow: {
    color: COLORS.cyan,
    fontSize: 28,
    marginLeft: 12,
  },
  pickerWrap: {
    marginTop: 10,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#080B12',
    padding: 10,
  },
  pickerDone: {
    height: 40,
    borderRadius: 20,
    marginTop: 8,
    backgroundColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerDoneText: {
    color: '#050700',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  visibilityPanel: {
    marginTop: 10,
    minHeight: 82,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#05090D',
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  visibilityMark: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(203,255,0,0.07)',
    borderWidth: 1,
    borderColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visibilityMarkText: { color: COLORS.lime, fontSize: 18 },
  visibilityCopy: { flex: 1, paddingLeft: 12 },
  visibilityTitle: { color: COLORS.text, fontSize: 13, fontWeight: '900' },
  visibilityBody: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },
  saveButton: {
    marginTop: 18,
    minHeight: 54,
    borderRadius: 27,
    backgroundColor: COLORS.lime,
    paddingHorizontal: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveButtonDisabled: { opacity: 0.28 },
  saveText: {
    color: '#050700',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  saveArrow: { color: '#050700', fontSize: 20, fontWeight: '900' },
  savedHeader: {
    marginTop: 30,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  savedEyebrow: {
    color: COLORS.lime,
    fontSize: 8,
    letterSpacing: 1.6,
    fontWeight: '900',
  },
  savedTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 5,
  },
  savedCount: {
    color: COLORS.lime,
    fontSize: 20,
    fontWeight: '900',
  },
  emptyPanel: {
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#05090D',
    padding: 16,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
  },
  emptyBody: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 5,
  },
  capsuleList: {
    gap: 10,
  },
  capsuleCard: {
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: 'rgba(164,124,255,0.25)',
    backgroundColor: '#080B12',
    padding: 14,
  },
  capsuleTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockMark: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#A47CFF',
    backgroundColor: 'rgba(164,124,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockMarkUnlocked: {
    borderColor: COLORS.lime,
    backgroundColor: 'rgba(203,255,0,0.08)',
  },
  lockText: {
    color: '#A47CFF',
    fontSize: 18,
    fontWeight: '900',
  },
  lockTextUnlocked: {
    color: COLORS.lime,
  },
  capsuleCopy: {
    flex: 1,
    paddingHorizontal: 10,
  },
  capsuleState: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  capsuleDate: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 4,
  },
  deleteText: {
    color: COLORS.orange,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  unlockedMessage: {
    color: '#C2CDD2',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 13,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.white08,
  },
  lockedMessage: {
    color: '#65747D',
    fontSize: 10,
    marginTop: 13,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.white08,
  },
  privacyNote: {
    marginTop: 20,
    borderRadius: RADII.md,
    padding: 16,
    backgroundColor: 'rgba(255,106,0,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(255,106,0,0.2)',
  },
  privacyTitle: {
    color: COLORS.orange,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  privacyBody: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 7,
  },
});
