import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useFilterLogic } from '@/components/filter-logic';
import { FiltersModal } from '@/components/filters-modal';
import { FiltersSidebar } from '@/components/filters-sidebar';
import { useFilterContext } from '@/contexts/filter-context';
import { useCategories } from '@/hooks/api';
import { useResponsive } from '@/hooks/use-responsive';

interface FiltersContainerProps {
  children: (onFiltersPress: () => void) => React.ReactNode;
}

export function FiltersContainer({ children }: FiltersContainerProps) {
  const { showSidebar } = useResponsive();
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  const {
    draftFilters,
    setDraftCategory,
    setDraftSearchQuery,
    setDraftDays,
    setDraftOnlyActive,
    setDraftMinDiscountPercent,
    setDraftSortBy,
    applyFilters,
    clearFilters,
    resetDraftToApplied,
  } = useFilterContext();

  const { data: categories = [] } = useCategories();

  const {
    WEEKDAYS,
    SORT_OPTIONS,
    toggleDay,
  } = useFilterLogic({
    selectedCategory: draftFilters.selectedCategory,
    setSelectedCategory: setDraftCategory,
    selectedDays: draftFilters.selectedDays,
    setSelectedDays: setDraftDays,
    onlyActive: draftFilters.onlyActive,
    setOnlyActive: setDraftOnlyActive,
    minDiscountPercent: draftFilters.minDiscountPercent,
    setMinDiscountPercent: setDraftMinDiscountPercent,
    sortBy: draftFilters.sortBy,
    setSortBy: setDraftSortBy,
    searchQuery: draftFilters.searchQuery,
    setSearchQuery: setDraftSearchQuery,
  });

  const handleOpenFilters = () => {
    resetDraftToApplied();
    setFiltersVisible(true);
  };

  const handleApplyFilters = () => {
    applyFilters();
    setFiltersVisible(false);
  };

  const handleClearFilters = () => {
    clearFilters();
    setFiltersVisible(false);
  };

  const filtersProps = {
    categories,
    selectedCategory: draftFilters.selectedCategory,
    onCategoryChange: setDraftCategory,
    weekdays: WEEKDAYS,
    selectedDays: draftFilters.selectedDays,
    onDayToggle: toggleDay,
    onlyActive: draftFilters.onlyActive,
    onOnlyActiveChange: setDraftOnlyActive,
    sortBy: draftFilters.sortBy,
    onSortChange: setDraftSortBy,
    minDiscountPercent: draftFilters.minDiscountPercent,
    onMinDiscountChange: setDraftMinDiscountPercent,
    onClearAll: handleClearFilters,
    onApply: handleApplyFilters,
    sortOptions: SORT_OPTIONS,
  };

  return (
    <>
      {showSidebar ? (
        <View style={styles.desktopLayout}>
          <FiltersSidebar {...filtersProps} />
          {children(handleOpenFilters)}
        </View>
      ) : (
        <>
          {children(handleOpenFilters)}
          <FiltersModal
            visible={filtersVisible}
            onClose={() => setFiltersVisible(false)}
            {...filtersProps}
          />
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  desktopLayout: {
    flexDirection: 'row',
    flex: 1,
  },
});
