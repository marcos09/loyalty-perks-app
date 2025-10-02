import { SortBy } from '@/hooks/use-benefits';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

export interface FilterState {
  selectedCategory?: string;
  selectedDays: string[];
  onlyActive: boolean;
  minDiscountPercent?: number;
  sortBy: SortBy;
  searchQuery: string;
}

interface FilterContextType {
  // Applied filters (what's currently being used for API calls)
  appliedFilters: FilterState;
  // Draft filters (what user is currently selecting in the UI)
  draftFilters: FilterState;
  // Draft filter setters
  setDraftCategory: (category: string | undefined) => void;
  setDraftSearchQuery: (query: string) => void;
  setDraftDays: (days: string[]) => void;
  setDraftOnlyActive: (active: boolean) => void;
  setDraftMinDiscountPercent: (percent: number | undefined) => void;
  setDraftSortBy: (sort: SortBy) => void;
  // Filter actions
  applyFilters: () => void;
  clearFilters: () => void;
  resetDraftToApplied: () => void;
  setAppliedFiltersDirect: (updater: (prev: FilterState) => FilterState) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const initialFilterState: FilterState = {
  selectedCategory: undefined,
  searchQuery: '',
  selectedDays: [],
  onlyActive: false,
  minDiscountPercent: undefined,
  sortBy: 'relevance',
};

export function FilterProvider({ children }: { children: ReactNode }) {
  // Applied filters (what's currently being used for API calls)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilterState);
  
  // Draft filters (what user is currently selecting in the UI)
  const [draftFilters, setDraftFilters] = useState<FilterState>(initialFilterState);

  // Draft filter setters (for UI changes that don't immediately apply)
  const setDraftCategory = useCallback((category: string | undefined) => {
    setDraftFilters(prev => ({ ...prev, selectedCategory: category }));
  }, []);

  const setDraftSearchQuery = useCallback((query: string) => {
    setDraftFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const setDraftDays = useCallback((days: string[]) => {
    setDraftFilters(prev => ({ ...prev, selectedDays: days }));
  }, []);

  const setDraftOnlyActive = useCallback((active: boolean) => {
    setDraftFilters(prev => ({ ...prev, onlyActive: active }));
  }, []);

  const setDraftMinDiscountPercent = useCallback((percent: number | undefined) => {
    setDraftFilters(prev => ({ ...prev, minDiscountPercent: percent }));
  }, []);

  const setDraftSortBy = useCallback((sort: SortBy) => {
    setDraftFilters(prev => ({ ...prev, sortBy: sort }));
  }, []);

  // Apply draft filters (called when user clicks Apply)
  const applyFilters = useCallback(() => {
    setAppliedFilters(draftFilters);
  }, [draftFilters]);

  // Clear all filters (called when user clicks Clear)
  const clearFilters = useCallback(() => {
    setDraftFilters(initialFilterState);
    setAppliedFilters(initialFilterState);
  }, []);

  // Reset draft to current applied filters (called when modal is opened)
  const resetDraftToApplied = useCallback(() => {
    setDraftFilters(appliedFilters);
  }, [appliedFilters]);

  // Direct setter for applied filters (for immediate search)
  const setAppliedFiltersDirect = useCallback((updater: (prev: FilterState) => FilterState) => {
    setAppliedFilters(updater);
  }, []);

  const value: FilterContextType = {
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
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
}
