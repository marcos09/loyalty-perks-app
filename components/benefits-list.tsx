import { FlatList, StyleSheet, View } from 'react-native';

import { BenefitCard } from '@/components/benefit-card';
import { EmptyState } from '@/components/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useFilterContext } from '@/contexts/filter-context';
import { useBenefits } from '@/hooks/api';

interface BenefitsListProps {
  onClearFilters: () => void;
}

export function BenefitsList({ onClearFilters }: BenefitsListProps) {
  const { appliedFilters } = useFilterContext();
  const { 
    data, 
    isLoading: loading, 
    isFetchingNextPage: loadingMore,
    hasNextPage,
    fetchNextPage 
  } = useBenefits(appliedFilters);
  
  // Flatten all pages into a single array
  const filtered = data?.pages.flatMap(page => page.data) ?? [];
  
  console.log('BenefitsList render:', { loading, filteredLength: filtered.length });
  
  const hasAppliedFilters = 
    !!appliedFilters.selectedCategory ||
    appliedFilters.selectedDays.length > 0 ||
    !!appliedFilters.onlyActive ||
    appliedFilters.minDiscountPercent !== undefined ||
    appliedFilters.sortBy !== 'relevance' ||
    appliedFilters.searchQuery.trim().length > 0;

  const handleLoadMore = () => {
    if (hasNextPage && !loadingMore) {
      fetchNextPage();
    }
  };
  if (loading && filtered.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.listContent}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={styles.skeletonCard}>
              <View style={styles.skeletonRow}>
                <Skeleton width={76} height={76} radius={12} />
                <View style={styles.skeletonInfo}>
                  <Skeleton width={'80%'} height={16} />
                  <Skeleton width={'95%'} height={12} style={{ marginTop: 6 }} />
                  <Skeleton width={'60%'} height={12} style={{ marginTop: 6 }} />
                  <View style={styles.skeletonMetaRow}>
                    <Skeleton width={80} height={12} />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <BenefitCard benefit={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          filtered.length === 0 && hasAppliedFilters && !loading ? (
            <EmptyState onClearFilters={onClearFilters} />
          ) : null
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              {Array.from({ length: 3 }).map((_, i) => (
                <View key={i} style={styles.skeletonCard}>
                  <View style={styles.skeletonRow}>
                    <Skeleton width={76} height={76} radius={12} />
                    <View style={styles.skeletonInfo}>
                      <Skeleton width={'80%'} height={16} />
                      <Skeleton width={'95%'} height={12} style={{ marginTop: 6 }} />
                      <Skeleton width={'60%'} height={12} style={{ marginTop: 6 }} />
                      <View style={styles.skeletonMetaRow}>
                        <Skeleton width={80} height={12} />
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : null
        }
      />
      {/* Loading overlay when refreshing with existing data */}
      {loading && filtered.length > 0 && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingIndicator}>
            <Skeleton width={20} height={20} radius={10} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    gap: 12,
  },
  loadingMore: {
    padding: 12,
    gap: 12,
  },
  skeletonCard: {
    minHeight: 100,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    alignItems: 'center',
  },
  skeletonInfo: {
    flex: 1,
    gap: 6,
  },
  skeletonMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingIndicator: {
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 20,
  },
});
