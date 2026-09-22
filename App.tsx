import React, { useEffect, useState } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  initialWindowMetrics,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { PlaceDetailScreen } from './src/screens/PlaceDetailScreen';
import { DeepModeScreen } from './src/screens/DeepModeScreen';
import { TimeCapsuleScreen } from './src/screens/TimeCapsuleScreen';
import { RouteScreen } from './src/screens/RouteScreen';
import { NearbyScreen } from './src/screens/NearbyScreen';
import { DreamScreen } from './src/screens/DreamScreen';
import { PLACES, type Place } from './src/data/places';
import { COLORS } from './src/theme';

type AppScreen =
  | 'home'
  | 'place'
  | 'deep'
  | 'capsule'
  | 'route'
  | 'nearby'
  | 'dream';

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

function AppFrame() {
  const insets = useSafeAreaInsets();
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState<AppScreen>('home');
  const [selectedPlace, setSelectedPlace] = useState<Place>(PLACES[0]!);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const openPlace = (place: Place) => {
    setSelectedPlace(place);
    setScreen('place');
  };

  const openDeep = (place: Place) => {
    setSelectedPlace(place);
    setScreen('deep');
  };

  const renderScreen = () => {
    if (screen === 'place') {
      return (
        <PlaceDetailScreen
          place={selectedPlace}
          onBack={() => setScreen('home')}
          onOpenDeep={openDeep}
        />
      );
    }

    if (screen === 'deep') {
      return (
        <DeepModeScreen
          place={selectedPlace}
          onBack={() => setScreen('place')}
        />
      );
    }

    if (screen === 'capsule') {
      return (
        <TimeCapsuleScreen
          place={selectedPlace}
          onBack={() => setScreen('home')}
        />
      );
    }

    if (screen === 'route') {
      return (
        <RouteScreen
          onBack={() => setScreen('home')}
          onOpenPlace={openPlace}
        />
      );
    }

    if (screen === 'nearby') {
      return (
        <NearbyScreen
          onBack={() => setScreen('home')}
          onOpenPlace={openPlace}
        />
      );
    }

    if (screen === 'dream') {
      return <DreamScreen onBack={() => setScreen('home')} />;
    }

    return (
      <HomeScreen
        onOpenPlace={openPlace}
        onOpenDeep={openDeep}
        onOpenCapsule={(place) => {
          setSelectedPlace(place);
          setScreen('capsule');
        }}
        onOpenRoute={() => setScreen('route')}
        onOpenNearby={() => setScreen('nearby')}
        onOpenDream={() => setScreen('dream')}
      />
    );
  };

  const topInset =
    Platform.OS === 'android'
      ? Math.max(insets.top, StatusBar.currentHeight ?? 0) + 8
      : insets.top + 6;

  return (
    <View style={[styles.app, { paddingTop: topInset }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />
      {ready ? renderScreen() : <LaunchScreen />}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AppFrame />
    </SafeAreaProvider>
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
