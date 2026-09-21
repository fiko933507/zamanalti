import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { COLORS } from './src/theme';

function LaunchScreen() {
  return (
    <View style={styles.launch}>
      <View style={styles.blueGlow} />
      <View style={styles.orangeGlow} />

      <View style={styles.portal}>
        <View style={styles.portalRingOuter} />
        <View style={styles.portalRingInner} />
        <View style={styles.logoCore}>
          <Text style={styles.logoLetter}>A</Text>
          <View style={styles.logoDot} />
        </View>
      </View>

      <Text style={styles.launchName}>
        ZAMAN<Text style={styles.launchAccent}>ALTI</Text>
      </Text>
      <Text style={styles.launchTagline}>AYNI ŞEHİRDE · BAŞKA ZAMANLAR</Text>

      <View style={styles.loadingTrack}>
        <View style={styles.loadingValue} />
      </View>
      <Text style={styles.loadingText}>KEŞİF BAŞLIYOR...</Text>
    </View>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1450);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {ready ? <HomeScreen /> : <LaunchScreen />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  launch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  blueGlow: {
    position: 'absolute',
    width: 390,
    height: 390,
    borderRadius: 195,
    backgroundColor: COLORS.blue,
    opacity: 0.14,
    top: '18%',
    right: -210,
  },
  orangeGlow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.orange,
    opacity: 0.13,
    bottom: '12%',
    left: -170,
  },
  portal: {
    width: 210,
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  portalRingOuter: {
    position: 'absolute',
    width: 204,
    height: 204,
    borderRadius: 102,
    borderWidth: 1,
    borderColor: 'rgba(67,215,255,0.34)',
  },
  portalRingInner: {
    position: 'absolute',
    width: 154,
    height: 154,
    borderRadius: 77,
    borderWidth: 2,
    borderColor: 'rgba(203,255,0,0.45)',
    transform: [{ rotate: '18deg' }],
  },
  logoCore: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: COLORS.lime,
    backgroundColor: '#050A0B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.lime,
    shadowOpacity: 0.75,
    shadowRadius: 22,
    elevation: 12,
  },
  logoLetter: {
    color: COLORS.lime,
    fontSize: 48,
    fontWeight: '900',
    transform: [{ scaleX: 0.76 }],
  },
  logoDot: {
    position: 'absolute',
    top: 42,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.lime,
  },
  launchName: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 5,
  },
  launchAccent: {
    color: COLORS.lime,
  },
  launchTagline: {
    color: COLORS.muted,
    marginTop: 10,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.3,
  },
  loadingTrack: {
    width: 130,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#14212A',
    marginTop: 46,
    overflow: 'hidden',
  },
  loadingValue: {
    width: '68%',
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.lime,
  },
  loadingText: {
    color: '#51616B',
    fontSize: 8,
    letterSpacing: 1.8,
    marginTop: 10,
  },
});
