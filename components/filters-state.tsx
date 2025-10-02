import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SortBy } from '@/hooks/use-benefits';

export interface FilterState {
  selectedCategory?: string;
  selectedDays: string[];
  onlyActive: boolean;
  minDiscountPercent?: number;
  sortBy: SortBy;
  searchQuery: string;
}

export interface FiltersStateProps {
  filterState: FilterState;
  onClearCategory: () => void;
  onClearDays: () => void;
  onClearActive: () => void;
  onClearMinDiscount: () => void;
  onClearSort: () => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}

export function FiltersState({
  filterState,
  onClearCategory,
  onClearDays,
  onClearActive,
  onClearMinDiscount,
  onClearSort,
  onClearSearch,
  onClearAll,
}: FiltersStateProps) {
  const { t } = useTranslation();
  const {
    selectedCategory,
    selectedDays,
    onlyActive,
    minDiscountPercent,
    sortBy,
    searchQuery,
  } = filterState;

  // Constants moved from main screen
  const SORT_OPTIONS: { key: SortBy; label: string }[] = [
    { key: 'relevance', label: t('sortOptions.relevance') },
    { key: 'expiresAsc', label: t('sortOptions.expiresAsc') },
    { key: 'expiresDesc', label: t('sortOptions.expiresDesc') },
    { key: 'discountDesc', label: t('sortOptions.discountDesc') },
    { key: 'titleAsc', label: t('sortOptions.titleAsc') },
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
            label={`${t('common.search')}: "${searchQuery}"`}
            onClear={onClearSearch}
            type="search"
          />
        )}
        
        {selectedCategory && (
          <FilterChip
            label={`${t('filters.categories')}: ${selectedCategory}`}
            onClear={onClearCategory}
            type="category"
          />
        )}
        
        {selectedDays.length > 0 && (
          <FilterChip
            label={`${t('common.days')}: ${selectedDays.join(', ')}`}
            onClear={onClearDays}
            type="days"
          />
        )}
        
        {onlyActive && (
          <FilterChip
            label={t('filters.onlyActiveChecked')}
            onClear={onClearActive}
            type="active"
          />
        )}
        
        {minDiscountPercent !== undefined && (
          <FilterChip
            label={`${t('filters.minDiscount')}: ${minDiscountPercent}%`}
            onClear={onClearMinDiscount}
            type="discount"
          />
        )}
        
        {sortBy !== 'relevance' && (
          <FilterChip
            label={`${t('filters.sortBy')}: ${getSortLabel(sortBy)}`}
            onClear={onClearSort}
            type="sort"
          />
        )}
        
        <Pressable style={styles.clearAllBtn} onPress={onClearAll}>
          <ThemedText style={styles.clearAllText}>{t('common.clearAll')}</ThemedText>
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