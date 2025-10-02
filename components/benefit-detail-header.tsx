import { Image, StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';
import type { Benefit } from '@/types';

interface BenefitDetailHeaderProps {
  benefit?: Benefit;
  loading?: boolean;
}

export function BenefitDetailHeader({ benefit, loading = false }: BenefitDetailHeaderProps) {
  if (loading) {
    return (
      <View style={styles.headerImageWrapper}>
        <View style={styles.heroContainer}>
          <Skeleton width={'100%'} height={'100%'} radius={16} />
        </View>
      </View>
    );
  }

  if (!benefit) return null;

  return (
    <View style={styles.headerImageWrapper}>
      <View style={styles.heroContainer}>
        <Image
          source={benefit.imageHero}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImageWrapper: {
    height: 220,
  },
  heroContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
});
