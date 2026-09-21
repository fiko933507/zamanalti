import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADII } from '../theme';

type Tone = 'blue' | 'lime' | 'orange' | 'cyan';

type Props = {
  title: string;
  subtitle: string;
  icon: string;
  tone: Tone;
  active?: boolean;
  onPress?: () => void;
};

const TONES: Record<Tone, string> = {
  blue: COLORS.blue,
  lime: COLORS.lime,
  orange: COLORS.orange,
  cyan: COLORS.cyan,
};

export function FeatureCard({
  title,
  subtitle,
  icon,
  tone,
  active = false,
  onPress,
}: Props) {
  const accent = TONES[tone];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderColor: active ? accent : COLORS.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.glow, { backgroundColor: accent }]} />
      <View style={[styles.iconWrap, { borderColor: accent }]}>
        <Text style={[styles.icon, { color: accent }]}>{icon}</Text>
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text numberOfLines={2} style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>

      <Text style={[styles.arrow, { color: accent }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48.5%',
    minHeight: 108,
    borderWidth: 1,
    borderRadius: RADII.md,
    padding: 13,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.985 }],
  },
  glow: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    opacity: 0.12,
    left: -24,
    top: -24,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.025)',
  },
  icon: {
    fontSize: 16,
    fontWeight: '900',
  },
  copy: {
    paddingRight: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
  },
  arrow: {
    position: 'absolute',
    right: 12,
    top: 12,
    fontSize: 25,
    fontWeight: '300',
  },
});
