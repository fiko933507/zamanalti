import { useCallback, useState } from 'react';
import * as Location from 'expo-location';
import type { Coordinate } from '../utils/geo';

export type LocationState = 'idle' | 'loading' | 'ready' | 'denied' | 'error';

export function useUserLocation() {
  const [coordinate, setCoordinate] = useState<Coordinate | null>(null);
  const [cityLabel, setCityLabel] = useState('Konum');
  const [state, setState] = useState<LocationState>('idle');

  const requestLocation = useCallback(async () => {
    if (state === 'loading') return;

    setState('loading');

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        setState('denied');
        setCityLabel('Konum kapalı');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const nextCoordinate = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setCoordinate(nextCoordinate);

      try {
        const results = await Location.reverseGeocodeAsync(nextCoordinate);
        const first = results[0];
        setCityLabel(
          first?.city ||
            first?.subregion ||
            first?.region ||
            'Konumun',
        );
      } catch {
        setCityLabel('Konumun');
      }

      setState('ready');
    } catch {
      setState('error');
      setCityLabel('Konum alınamadı');
    }
  }, [state]);

  return {
    coordinate,
    cityLabel,
    state,
    requestLocation,
  };
}
