export type Coordinate = {
  latitude: number;
  longitude: number;
};

const EARTH_RADIUS_KM = 6371;

const toRad = (degree: number) => (degree * Math.PI) / 180;

export function distanceKm(from: Coordinate, to: Coordinate) {
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number) {
  if (km < 1) {
    return `${Math.max(1, Math.round(km * 1000))} m`;
  }

  if (km < 10) {
    return `${km.toFixed(1).replace('.', ',')} km`;
  }

  return `${Math.round(km)} km`;
}
