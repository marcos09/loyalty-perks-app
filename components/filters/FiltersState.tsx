import { useFilterActions } from '@/hooks/use-filter-actions';
import type { SortBy } from '@/types';
import { ScrollView } from 'react-native';
import { ThemedView } from '../themed-view';
import { Button } from '../ui/Button';
import { FilterChip } from './FilterChip';

export function FiltersState() {
  const {
    appliedFilters,
    handleSearchChange,
    handleCategoryChange,
    handleDayToggle,
    handleOnlyActiveChange,
    handleMinDiscountChange,
    handleSortChange,
    handleClearFilters,
  } = useFilterActions();

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
            selected={false}
            onPress={() => handleSearchChange('')}
          />
        )}
        
        {selectedCategory && (
          <FilterChip
            label={`Category: ${selectedCategory}`}
            selected={false}
            onPress={() => handleCategoryChange(undefined)}
          />
        )}
        
        {selectedDays.length > 0 && (
          <FilterChip
            label={`Days: ${selectedDays.join(', ')}`}
            selected={false}
            onPress={() => handleDayToggle(selectedDays[0])}
          />
        )}
        
        {onlyActive && (
          <FilterChip
            label="Active only ✓"
            selected={false}
            onPress={() => handleOnlyActiveChange(false)}
          />
        )}
        
        {minDiscountPercent !== undefined && (
          <FilterChip
            label={`Min discount: ${minDiscountPercent}%`}
            selected={false}
            onPress={() => handleMinDiscountChange(undefined)}
          />
        )}
        
        {sortBy !== 'relevance' && (
          <FilterChip
            label={`Sort: ${getSortLabel(sortBy)}`}
            selected={false}
            onPress={() => handleSortChange('relevance')}
          />
        )}
        
        <Button
          title="Clear all"
          onPress={handleClearFilters}
          variant="ghost"
          size="small"
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = {
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  scrollContent: {
    gap: 8,
    paddingRight: 16,
  },
};
