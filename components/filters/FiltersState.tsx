import { useFilterActions } from '@/hooks/use-filter-actions';
import type { SortBy } from '@/types';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedView } from '../themed-view';
import { Button } from '../ui/Button';
import { FilterChip } from './FilterChip';

export function FiltersState() {
  const {
    appliedFilters,
    handleSearchChange,
    handleCategoryChange,
    handleDayToggle,
    handleMinDiscountChange,
    handleSortChange,
    handleClearFilters,
  } = useFilterActions();

  const {
    selectedCategory,
    selectedDays,
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
        style={styles.scrollView}
      >
        {searchQuery.trim().length > 0 && (
          <FilterChip
            label={`Search: "${searchQuery}"`}
            selected={false}
            onPress={() => handleSearchChange('')}
            style={styles.chip}
          />
        )}
        
        {selectedCategory && (
          <FilterChip
            label={`Category: ${selectedCategory}`}
            selected={false}
            onPress={() => handleCategoryChange(undefined)}
            style={styles.chip}
          />
        )}
        
        {selectedDays.length > 0 && (
          <FilterChip
            label={`Days: ${selectedDays.join(', ')}`}
            selected={false}
            onPress={() => handleDayToggle(selectedDays[0])}
            style={styles.chip}
          />
        )}
        
        {minDiscountPercent !== undefined && (
          <FilterChip
            label={`Min discount: ${minDiscountPercent}%`}
            selected={false}
            onPress={() => handleMinDiscountChange(undefined)}
            style={styles.chip}
          />
        )}
        
        {sortBy !== 'relevance' && (
          <FilterChip
            label={`Sort: ${getSortLabel(sortBy)}`}
            selected={false}
            onPress={() => handleSortChange('relevance')}
            style={styles.chip}
          />
        )}
        
        <Button
          title="Clear all"
          onPress={handleClearFilters}
          variant="ghost"
          size="small"
          style={styles.clearButton}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  chip: {
    marginRight: 8,
  },
  clearButton: {
    marginLeft: 8,
  },
});
