import type { SortBy } from '@/types';
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
  appliedFilters: FilterState;
  draftFilters: FilterState;
  setDraftCategory: (category: string | undefined) => void;
  setDraftSearchQuery: (query: string) => void;
  setDraftDays: (days: string[]) => void;
  setDraftOnlyActive: (active: boolean) => void;
  setDraftMinDiscountPercent: (percent: number | undefined) => void;
  setDraftSortBy: (sort: SortBy) => void;
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
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilterState);
  
  const [draftFilters, setDraftFilters] = useState<FilterState>(initialFilterState);

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

  const applyFilters = useCallback(() => {
    setAppliedFilters(draftFilters);
  }, [draftFilters]);

  const clearFilters = useCallback(() => {
    setDraftFilters(initialFilterState);
    setAppliedFilters(initialFilterState);
  }, []);

  const resetDraftToApplied = useCallback(() => {
    setDraftFilters(appliedFilters);
  }, [appliedFilters]);

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
