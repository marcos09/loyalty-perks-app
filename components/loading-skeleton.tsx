import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

export function LoadingSkeleton() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView style={styles.header}>
        <Skeleton width={160} height={22} />
        <Skeleton width={120} height={14} style={{ marginTop: 6 }} />
      </ThemedView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} width={80} height={32} radius={999} />
        ))}
      </ScrollView>

      <View style={{ padding: 12, gap: 12 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.row}>
              <Skeleton width={76} height={76} radius={12} />
              <View style={styles.info}>
                <Skeleton width={'80%'} height={16} />
                <SkeletonText lines={2} width={'95%'} lineHeight={12} />
                <View style={styles.metaRow}>
                  <Skeleton width={80} height={12} />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 4,
  },
  filters: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    gap: 8,
  },
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
  info: {
    flex: 1,
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
