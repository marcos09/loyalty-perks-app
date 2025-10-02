import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton, SkeletonText } from '../../ui/skeleton';
import { styles } from './styles';

export function LoadingSkeleton() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Skeleton width={160} height={22} />
          <Skeleton width={120} height={14} style={{ marginTop: 6 }} />
        </View>

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
      </View>
    </SafeAreaView>
  );
}

