import { Link } from 'expo-router';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Benefit } from '@/types';

interface BenefitCardProps {
  benefit: Benefit;
}

export function BenefitCard({ benefit }: BenefitCardProps) {
  return (
    <Link
      href={{ pathname: '/benefit/[id]', params: { id: benefit.id } }}
      asChild
    >
      <Pressable style={styles.card}>
        <View style={styles.row}>
          <ImageBackground
            source={benefit.imageSquare}
            resizeMode="cover"
            style={styles.thumb}
            imageStyle={styles.thumbImage}
          />
          <View style={styles.info}>
            <ThemedText type="subtitle" style={styles.cardTitle} numberOfLines={1}>
              {benefit.title}
            </ThemedText>
            <ThemedText style={styles.cardDescription} numberOfLines={2}>
              {benefit.description}
            </ThemedText>
            <View style={styles.metaRow}>
              <ThemedText style={styles.cardDiscount}>{benefit.discount}</ThemedText>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 100,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.04)'
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    alignItems: 'center',
  },
  thumb: {
    width: 76,
    height: 76,
  },
  thumbImage: {
    borderRadius: 12,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    
  },
  cardDiscount: {
    opacity: 0.9,
  },
  cardDescription: {
    opacity: 0.8,
  },
});
