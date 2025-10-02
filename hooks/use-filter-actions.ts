import { useFilterContext } from '@/contexts/filter-context';
import type { SortBy } from '@/types';
import { useCallback } from 'react';

export function useFilterActions() {
  const {
    appliedFilters,
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
    setAppliedFiltersDirect,
  } = useFilterContext();

  const handleSearchChange = useCallback((query: string) => {
    setDraftSearchQuery(query);
  }, [setDraftSearchQuery]);

  const handleSearchApply = useCallback(() => {
    setAppliedFiltersDirect(prev => ({ ...prev, searchQuery: draftFilters.searchQuery }));
  }, [setAppliedFiltersDirect, draftFilters.searchQuery]);

  const handleCategoryChange = useCallback((category: string | undefined) => {
    setDraftCategory(category);
  }, [setDraftCategory]);

  const handleDayToggle = useCallback((day: string) => {
    if (draftFilters.selectedDays.includes(day)) {
      setDraftDays(draftFilters.selectedDays.filter((d) => d !== day));
    } else {
      setDraftDays([...draftFilters.selectedDays, day]);
    }
  }, [draftFilters.selectedDays, setDraftDays]);

  const handleOnlyActiveChange = useCallback((active: boolean) => {
    setDraftOnlyActive(active);
  }, [setDraftOnlyActive]);

  const handleMinDiscountChange = useCallback((percent: number | undefined) => {
    setDraftMinDiscountPercent(percent);
  }, [setDraftMinDiscountPercent]);

  const handleSortChange = useCallback((sort: SortBy) => {
    setDraftSortBy(sort);
  }, [setDraftSortBy]);

  const handleApplyFilters = useCallback(() => {
    applyFilters();
  }, [applyFilters]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const handleResetDraft = useCallback(() => {
    resetDraftToApplied();
  }, [resetDraftToApplied]);

  return {
    appliedFilters,
    draftFilters,
    
    handleSearchChange,
    handleSearchApply,
    handleCategoryChange,
    handleDayToggle,
    handleOnlyActiveChange,
    handleMinDiscountChange,
    handleSortChange,
    handleApplyFilters,
    handleClearFilters,
    handleResetDraft,

    applyFilters,
    clearFilters,
    resetDraftToApplied,
  };
}
