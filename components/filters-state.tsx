import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFilterContext } from '@/contexts/filter-context';
import type { SortBy } from '@/types';

export interface FilterState {
  selectedCategory?: string;
  selectedDays: string[];
  onlyActive: boolean;
  minDiscountPercent?: number;
  sortBy: SortBy;
  searchQuery: string;
}

export function FiltersState() {
  const {
    appliedFilters,
    setDraftCategory,
    setDraftSearchQuery,
    setDraftDays,
    setDraftOnlyActive,
    setDraftMinDiscountPercent,
    setDraftSortBy,
    setAppliedFiltersDirect,
    clearFilters,
  } = useFilterContext();

  const {
    selectedCategory,
    selectedDays,
    onlyActive,
    minDiscountPercent,
    sortBy,
    searchQuery,
  } = appliedFilters;


  const SORT_OPTIONS: { key: SortBy; label: string }[] = [
    { key: 'relevance', label: 'Relevance' },
    { key: 'expiresAsc', label: 'Expires ↑' },
    { key: 'expiresDesc', label: 'Expires ↓' },
    { key: 'discountDesc', label: 'Discount' },
    { key: 'titleAsc', label: 'A-Z' },
  ];

  const hasAnyFilters = 
    selectedCategory || 
    selectedDays.length > 0 || 
    onlyActive || 
    minDiscountPercent !== undefined || 
    sortBy !== 'relevance' ||
    searchQuery.trim().length > 0;

  if (!hasAnyFilters) {
    return null;
  }

  const getSortLabel = (sortKey: SortBy) => {
    return SORT_OPTIONS.find(opt => opt.key === sortKey)?.label || sortKey;
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {searchQuery.trim().length > 0 && (
          <FilterChip
            label={`Search: "${searchQuery}"`}
            onClear={() => {
              setDraftSearchQuery('');
              setAppliedFiltersDirect(prev => ({ ...prev, searchQuery: '' }));
            }}
            type="search"
          />
        )}
        
        {selectedCategory && (
          <FilterChip
            label={`Category: ${selectedCategory}`}
            onClear={() => {
              setDraftCategory(undefined);
              setAppliedFiltersDirect(prev => ({ ...prev, selectedCategory: undefined }));
            }}
            type="category"
          />
        )}
        
        {selectedDays.length > 0 && (
          <FilterChip
            label={`Days: ${selectedDays.join(', ')}`}
            onClear={() => {
              setDraftDays([]);
              setAppliedFiltersDirect(prev => ({ ...prev, selectedDays: [] }));
            }}
            type="days"
          />
        )}
        
        {onlyActive && (
          <FilterChip
            label="Active only ✓"
            onClear={() => {
              setDraftOnlyActive(false);
              setAppliedFiltersDirect(prev => ({ ...prev, onlyActive: false }));
            }}
            type="active"
          />
        )}
        
        {minDiscountPercent !== undefined && (
          <FilterChip
            label={`Min discount: ${minDiscountPercent}%`}
            onClear={() => {
              setDraftMinDiscountPercent(undefined);
              setAppliedFiltersDirect(prev => ({ ...prev, minDiscountPercent: undefined }));
            }}
            type="discount"
          />
        )}
        
        {sortBy !== 'relevance' && (
          <FilterChip
            label={`Sort: ${getSortLabel(sortBy)}`}
            onClear={() => {
              setDraftSortBy('relevance');
              setAppliedFiltersDirect(prev => ({ ...prev, sortBy: 'relevance' }));
            }}
            type="sort"
          />
        )}
        
        <Pressable style={styles.clearAllBtn} onPress={clearFilters}>
          <ThemedText style={styles.clearAllText}>Clear all</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

interface FilterChipProps {
  label: string;
  onClear: () => void;
  type: 'search' | 'category' | 'days' | 'active' | 'discount' | 'sort';
}

function FilterChip({ label, onClear, type }: FilterChipProps) {
  const getChipStyle = () => {
    switch (type) {
      case 'search':
        return [styles.chip, styles.searchChip];
      case 'category':
        return [styles.chip, styles.categoryChip];
      case 'days':
        return [styles.chip, styles.daysChip];
      case 'active':
        return [styles.chip, styles.activeChip];
      case 'discount':
        return [styles.chip, styles.discountChip];
      case 'sort':
        return [styles.chip, styles.sortChip];
      default:
        return styles.chip;
    }
  };

  return (
    <View style={getChipStyle()}>
      <ThemedText style={styles.chipText} numberOfLines={1}>
        {label}
      </ThemedText>
      <Pressable onPress={onClear} hitSlop={8} style={styles.clearBtn}>
        <ThemedText style={styles.clearIcon}>✕</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  scrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(127, 127, 127, 0.15)',
    maxWidth: 200,
  },
  searchChip: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  categoryChip: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  daysChip: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
  },
  activeChip: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  discountChip: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  sortChip: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  clearBtn: {
    marginLeft: 6,
    padding: 2,
  },
  clearIcon: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
  clearAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(239, 68, 68, 0.8)',
  },
});