import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { COLORS, RADII } from '../theme';

type Props = {
  onBack: () => void;
};

export function TimeCapsuleScreen({ onBack }: Props) {
  const [message, setMessage] = useState('');
  const [saved, setSaved] = useState(false);

  return (
    <View style={styles.root}>
      <View style={styles.violetGlow} />
      <View style={styles.contentGlow} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
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
          <View style={styles.placeholder} />
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

        <Text style={styles.eyebrow}>BUGÜNDEN YARINA</Text>
        <Text style={styles.title}>Bu yerde bir iz bırak.</Text>
        <Text style={styles.subtitle}>
          Bir gün yeniden açılmak üzere bu mekâna düşünce, ses veya anı bırak.
          Zaman kapsülü, içeriğini belirlediğin tarihe kadar kapalı tutar.
        </Text>

        <View style={styles.composer}>
          <Text style={styles.label}>MESAJIN</Text>
          <TextInput
            value={message}
            onChangeText={(value) => {
              setMessage(value);
              setSaved(false);
            }}
            placeholder="Gelecekteki hâline bir şey bırak..."
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
              <View style={styles.typePill}>
                <Text style={styles.typePillText}>SES</Text>
              </View>
              <View style={styles.typePill}>
                <Text style={styles.typePillText}>GÖRSEL</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.unlockPanel}>
          <Text style={styles.unlockKicker}>NE ZAMAN AÇILSIN?</Text>
          <Text style={styles.unlockTitle}>22 Eylül 2027</Text>
          <Text style={styles.unlockBody}>
            Prototipte tarih sabit. Sonraki adımda kullanıcı tarih, konum koşulu
            veya tekrar ziyaret edildiğinde açılma seçeneklerinden birini
            belirleyebilecek.
          </Text>
        </View>

        <View style={styles.visibilityPanel}>
          <View style={styles.visibilityMark}>
            <Text style={styles.visibilityMarkText}>◉</Text>
          </View>
          <View style={styles.visibilityCopy}>
            <Text style={styles.visibilityTitle}>Yalnızca bana ait</Text>
            <Text style={styles.visibilityBody}>
              Kapsül varsayılan olarak kişisel kalır. Paylaşım ayrıca seçilir.
            </Text>
          </View>
        </View>

        <Pressable
          disabled={!message.trim()}
          onPress={() => setSaved(true)}
          style={[
            styles.saveButton,
            !message.trim() && styles.saveButtonDisabled,
          ]}
        >
          <Text style={styles.saveText}>
            {saved ? 'ZAMAN KAPSÜLÜ HAZIR' : 'ZAMAN KAPSÜLÜNÜ KAYDET'}
          </Text>
          <Text style={styles.saveArrow}>{saved ? '✓' : '→'}</Text>
        </Pressable>

        {saved && (
          <View style={styles.savedPanel}>
            <Text style={styles.savedKicker}>KAPSÜL KAPANDI</Text>
            <Text style={styles.savedTitle}>Bu an artık geleceğe ait.</Text>
            <Text style={styles.savedBody}>
              Gerçek veri kaydı sonraki backend aşamasında bağlanacak. Bu ekran
              şu an etkileşim ve görsel akışı tamamlıyor.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 54 },
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
    minHeight: 62,
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
  placeholder: { width: 42, height: 42 },
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
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOne: {
    position: 'absolute',
    width: 286,
    height: 286,
    borderRadius: 143,
    borderWidth: 1,
    borderColor: 'rgba(112,60,255,0.24)',
  },
  ringTwo: {
    position: 'absolute',
    width: 222,
    height: 222,
    borderRadius: 111,
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.24)',
    borderStyle: 'dashed',
    transform: [{ rotate: '19deg' }],
  },
  ringThree: {
    position: 'absolute',
    width: 154,
    height: 154,
    borderRadius: 77,
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.28)',
  },
  door: {
    width: 82,
    height: 132,
    borderRadius: 41,
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
    width: 46,
    height: 170,
    backgroundColor: '#A47CFF',
    opacity: 0.12,
  },
  infinity: {
    color: '#C9B4FF',
    fontSize: 34,
    fontWeight: '300',
  },
  eyebrow: {
    color: '#A47CFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },
  title: {
    color: COLORS.text,
    fontSize: 38,
    lineHeight: 43,
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
    minHeight: 142,
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
  typeRow: { flexDirection: 'row', gap: 8 },
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
  typePill: {
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    paddingHorizontal: 13,
  },
  typePillText: {
    color: COLORS.muted,
    fontSize: 8,
    letterSpacing: 1,
    fontWeight: '900',
  },
  unlockPanel: {
    marginTop: 12,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 17,
  },
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
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
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
    height: 54,
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
    letterSpacing: 1.3,
  },
  saveArrow: { color: '#050700', fontSize: 20, fontWeight: '900' },
  savedPanel: {
    marginTop: 12,
    borderRadius: RADII.lg,
    padding: 18,
    backgroundColor: 'rgba(203,255,0,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(203,255,0,0.28)',
  },
  savedKicker: {
    color: COLORS.lime,
    fontSize: 8,
    letterSpacing: 1.7,
    fontWeight: '900',
  },
  savedTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 7,
  },
  savedBody: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
  },
});
