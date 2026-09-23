import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '../theme';

type Coordinate = {
  latitude: number;
  longitude: number;
};

type MapPoint = {
  id: string;
  label: string;
  coordinate: Coordinate;
  glyph?: string;
  tone?: 'lime' | 'cyan' | 'orange';
};

type Props = {
  center: Coordinate;
  points: MapPoint[];
  selectedId?: string | null;
  userCoordinate?: Coordinate | null;
  routeCoordinates?: Coordinate[];
  height?: number;
  initialZoom?: number;
  onSelect?: (id: string) => void;
};

const TILE_SIZE = 256;
const MIN_ZOOM = 11;
const MAX_ZOOM = 16;

function project(coordinate: Coordinate, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const sinLatitude = Math.sin((coordinate.latitude * Math.PI) / 180);
  const x = ((coordinate.longitude + 180) / 360) * scale;
  const y =
    (0.5 -
      Math.log((1 + sinLatitude) / (1 - sinLatitude)) /
        (4 * Math.PI)) *
    scale;

  return { x, y };
}

function tileUrl(x: number, y: number, zoom: number) {
  const limit = 2 ** zoom;
  const wrappedX = ((x % limit) + limit) % limit;
  return `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`;
}

function toneColor(tone?: MapPoint['tone']) {
  if (tone === 'orange') return COLORS.orange;
  if (tone === 'lime') return COLORS.lime;
  return COLORS.cyan;
}

export function InAppMap({
  center,
  points,
  selectedId,
  userCoordinate,
  routeCoordinates,
  height = 310,
  initialZoom = 13,
  onSelect,
}: Props) {
  const [zoom, setZoom] = useState(initialZoom);
  const [mapCenter, setMapCenter] = useState(center);
  const [size, setSize] = useState({ width: 320, height });

  useEffect(() => {
    setMapCenter(center);
  }, [center.latitude, center.longitude]);

  const centerWorld = useMemo(
    () => project(mapCenter, zoom),
    [mapCenter, zoom],
  );

  const tileCenterX = Math.floor(centerWorld.x / TILE_SIZE);
  const tileCenterY = Math.floor(centerWorld.y / TILE_SIZE);

  const tiles = useMemo(() => {
    const result: Array<{ x: number; y: number; key: string }> = [];
    for (let dy = -2; dy <= 2; dy += 1) {
      for (let dx = -2; dx <= 2; dx += 1) {
        const x = tileCenterX + dx;
        const y = tileCenterY + dy;
        result.push({ x, y, key: `${zoom}-${x}-${y}` });
      }
    }
    return result;
  }, [tileCenterX, tileCenterY, zoom]);

  const toLocal = (coordinate: Coordinate) => {
    const world = project(coordinate, zoom);
    return {
      x: world.x - centerWorld.x + size.width / 2,
      y: world.y - centerWorld.y + size.height / 2,
    };
  };

  const routeSegments = useMemo(() => {
    if (!routeCoordinates || routeCoordinates.length < 2) return [];

    return routeCoordinates.slice(0, -1).map((coordinate, index) => {
      const start = toLocal(coordinate);
      const end = toLocal(routeCoordinates[index + 1]!);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      return {
        key: `segment-${index}`,
        left: (start.x + end.x) / 2 - length / 2,
        top: (start.y + end.y) / 2 - 1,
        width: length,
        angle,
      };
    });
  }, [
    routeCoordinates,
    centerWorld.x,
    centerWorld.y,
    size.width,
    size.height,
    zoom,
  ]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height: layoutHeight } = event.nativeEvent.layout;
    setSize({ width, height: layoutHeight });
  };

  return (
    <View style={[styles.root, { height }]} onLayout={handleLayout}>
      <View style={styles.tiles} pointerEvents="none">
        {tiles.map((tile) => {
          const left =
            tile.x * TILE_SIZE - centerWorld.x + size.width / 2;
          const top =
            tile.y * TILE_SIZE - centerWorld.y + size.height / 2;

          return (
            <Image
              key={tile.key}
              source={{ uri: tileUrl(tile.x, tile.y, zoom) }}
              style={[
                styles.tile,
                {
                  left,
                  top,
                },
              ]}
            />
          );
        })}
        <View style={styles.mapTint} />
      </View>

      {routeSegments.map((segment) => (
        <View
          key={segment.key}
          pointerEvents="none"
          style={[
            styles.routeLine,
            {
              left: segment.left,
              top: segment.top,
              width: segment.width,
              transform: [{ rotate: `${segment.angle}deg` }],
            },
          ]}
        />
      ))}

      {userCoordinate &&
        (() => {
          const point = toLocal(userCoordinate);
          return (
            <View
              pointerEvents="none"
              style={[
                styles.userMarker,
                {
                  left: point.x - 10,
                  top: point.y - 10,
                },
              ]}
            >
              <View style={styles.userMarkerCore} />
            </View>
          );
        })()}

      {points.map((point) => {
        const position = toLocal(point.coordinate);
        const selected = point.id === selectedId;
        const color = selected ? COLORS.lime : toneColor(point.tone);

        if (
          position.x < -40 ||
          position.y < -40 ||
          position.x > size.width + 40 ||
          position.y > size.height + 40
        ) {
          return null;
        }

        return (
          <Pressable
            key={point.id}
            onPress={() => onSelect?.(point.id)}
            style={[
              styles.marker,
              {
                left: position.x - (selected ? 22 : 18),
                top: position.y - (selected ? 22 : 18),
                width: selected ? 44 : 36,
                height: selected ? 44 : 36,
                borderRadius: selected ? 22 : 18,
                borderColor: color,
              },
              selected && styles.markerSelected,
            ]}
          >
            <Text style={[styles.markerGlyph, { color }]}>
              {point.glyph ?? '•'}
            </Text>
          </Pressable>
        );
      })}

      <View style={styles.zoomControls}>
        <Pressable
          style={styles.zoomButton}
          onPress={() => setZoom((value) => Math.min(MAX_ZOOM, value + 1))}
        >
          <Text style={styles.zoomText}>+</Text>
        </Pressable>
        <View style={styles.zoomDivider} />
        <Pressable
          style={styles.zoomButton}
          onPress={() => setZoom((value) => Math.max(MIN_ZOOM, value - 1))}
        >
          <Text style={styles.zoomText}>−</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.recenterButton}
        onPress={() => setMapCenter(center)}
      >
        <Text style={styles.recenterText}>◎</Text>
      </Pressable>

      <View style={styles.attribution} pointerEvents="none">
        <Text style={styles.attributionText}>© OpenStreetMap contributors</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    backgroundColor: '#071016',
  },
  tiles: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  tile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
  mapTint: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(2,8,12,0.18)',
  },
  routeLine: {
    position: 'absolute',
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.orange,
    opacity: 0.92,
  },
  marker: {
    position: 'absolute',
    borderWidth: 2,
    backgroundColor: 'rgba(2,8,12,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  markerSelected: {
    backgroundColor: '#071000',
    shadowColor: COLORS.lime,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 9,
  },
  markerGlyph: {
    fontSize: 11,
    fontWeight: '900',
  },
  userMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(203,255,0,0.2)',
    borderWidth: 1,
    borderColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarkerCore: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.lime,
  },
  zoomControls: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 38,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(2,8,12,0.9)',
  },
  zoomButton: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  zoomText: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '800',
  },
  recenterButton: {
    position: 'absolute',
    right: 10,
    bottom: 36,
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.cyan,
    backgroundColor: 'rgba(2,8,12,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recenterText: {
    color: COLORS.cyan,
    fontSize: 18,
  },
  attribution: {
    position: 'absolute',
    left: 8,
    bottom: 6,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: 'rgba(255,255,255,0.84)',
  },
  attributionText: {
    color: '#243038',
    fontSize: 6,
    fontWeight: '700',
  },
});
