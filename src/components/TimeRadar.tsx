import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Place } from '../data/places';
import { COLORS } from '../theme';

type Props = {
  size: number;
  places: Place[];
  selectedId: string;
  onSelect: (id: string) => void;
};

const NODE_POSITIONS = [
  { left: 0.09, top: 0.19 },
  { left: 0.72, top: 0.18 },
  { left: 0.11, top: 0.69 },
  { left: 0.69, top: 0.70 },
];

export function TimeRadar({ size, places, selectedId, onSelect }: Props) {
  const center = size / 2;

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <View
        style={[
          styles.ring,
          {
            width: size * 0.92,
            height: size * 0.92,
            borderRadius: size,
            left: size * 0.04,
            top: size * 0.04,
          },
        ]}
      />
      <View
        style={[
          styles.ring,
          styles.ringStrong,
          {
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: size,
            left: size * 0.15,
            top: size * 0.15,
          },
        ]}
      />
      <View
        style={[
          styles.ring,
          {
            width: size * 0.44,
            height: size * 0.44,
            borderRadius: size,
            left: size * 0.28,
            top: size * 0.28,
          },
        ]}
      />

      <View style={[styles.axisVertical, { left: center }]} />
      <View style={[styles.axisHorizontal, { top: center }]} />
      <View
        style={[
          styles.diagonal,
          {
            width: size * 0.72,
            left: size * 0.14,
            top: center,
          },
        ]}
      />

      <View
        style={[
          styles.orbitSignal,
          {
            width: size * 0.74,
            height: size * 0.74,
            borderRadius: size,
            left: size * 0.13,
            top: size * 0.13,
          },
        ]}
      />

      {places.slice(0, 4).map((place, index) => {
        const position = NODE_POSITIONS[index] ?? NODE_POSITIONS[0]!;
        const selected = place.id === selectedId;
        const nodeSize = selected ? 62 : 54;

        return (
          <Pressable
            key={place.id}
            onPress={() => onSelect(place.id)}
            style={[
              styles.node,
              {
                width: nodeSize,
                height: nodeSize,
                borderRadius: nodeSize / 2,
                left: size * position.left,
                top: size * position.top,
                borderColor: selected ? COLORS.lime : COLORS.cyan,
              },
              selected && styles.nodeSelected,
            ]}
          >
            <Text
              style={[
                styles.nodeGlyph,
                { color: selected ? COLORS.lime : COLORS.text },
              ]}
            >
              {place.glyph}
            </Text>
            <Text numberOfLines={1} style={styles.nodeLabel}>
              {place.name.split(' ')[0]}
            </Text>
          </Pressable>
        );
      })}

      <View
        style={[
          styles.center,
          {
            left: center - 35,
            top: center - 35,
          },
        ]}
      >
        <Text style={styles.centerGlyph}>A</Text>
        <View style={styles.centerDot} />
      </View>

      <View style={[styles.pulseDot, { left: size * 0.61, top: size * 0.56 }]} />
      <View style={[styles.pulseDotSmall, { left: size * 0.35, top: size * 0.34 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(57, 167, 255, 0.20)',
  },
  ringStrong: {
    borderColor: 'rgba(203, 255, 0, 0.48)',
  },
  axisVertical: {
    position: 'absolute',
    top: '7%',
    bottom: '7%',
    width: 1,
    backgroundColor: 'rgba(62, 149, 255, 0.19)',
  },
  axisHorizontal: {
    position: 'absolute',
    left: '7%',
    right: '7%',
    height: 1,
    backgroundColor: 'rgba(62, 149, 255, 0.19)',
  },
  diagonal: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(203, 255, 0, 0.28)',
    transform: [{ rotate: '-23deg' }],
  },
  orbitSignal: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(203, 255, 0, 0.26)',
    borderStyle: 'dashed',
    transform: [{ rotate: '17deg' }],
  },
  node: {
    position: 'absolute',
    borderWidth: 1,
    backgroundColor: '#071119',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.blue,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  nodeSelected: {
    shadowColor: COLORS.lime,
    shadowOpacity: 0.55,
    shadowRadius: 15,
    elevation: 8,
  },
  nodeGlyph: {
    fontSize: 20,
    fontWeight: '900',
  },
  nodeLabel: {
    color: COLORS.muted,
    fontSize: 8,
    maxWidth: 44,
    marginTop: 1,
  },
  center: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#060B0B',
    borderWidth: 2,
    borderColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.lime,
    shadowOpacity: 0.7,
    shadowRadius: 18,
    elevation: 11,
  },
  centerGlyph: {
    color: COLORS.lime,
    fontSize: 29,
    fontWeight: '900',
    transform: [{ scaleX: 0.78 }],
  },
  centerDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.lime,
    top: 30,
  },
  pulseDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.lime,
    shadowColor: COLORS.lime,
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  pulseDotSmall: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.cyan,
  },
});
