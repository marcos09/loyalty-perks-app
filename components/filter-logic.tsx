import { SortBy } from '@/hooks/use-benefits';
import { useTranslation } from 'react-i18next';

export interface FilterLogicProps {
  selectedCategory?: string;
  setSelectedCategory: (category: string | undefined) => void;
  selectedDays: string[];
  setSelectedDays: (days: string[]) => void;
  onlyActive: boolean;
  setOnlyActive: (active: boolean) => void;
  minDiscountPercent?: number;
  setMinDiscountPercent: (percent: number | undefined) => void;
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function useFilterLogic({
  selectedCategory,
  setSelectedCategory,
  selectedDays,
  setSelectedDays,
  onlyActive,
  setOnlyActive,
  minDiscountPercent,
  setMinDiscountPercent,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
}: FilterLogicProps) {
  const { t } = useTranslation();

  // Constants
  const WEEKDAYS = [
    t('weekdays.mon'),
    t('weekdays.tue'),
    t('weekdays.wed'),
    t('weekdays.thu'),
    t('weekdays.fri'),
    t('weekdays.sat'),
    t('weekdays.sun'),
  ];

  const SORT_OPTIONS: { key: SortBy; label: string }[] = [
    { key: 'relevance', label: t('sortOptions.relevance') },
    { key: 'expiresAsc', label: t('sortOptions.expiresAsc') },
    { key: 'expiresDesc', label: t('sortOptions.expiresDesc') },
    { key: 'discountDesc', label: t('sortOptions.discountDesc') },
    { key: 'titleAsc', label: t('sortOptions.titleAsc') },
  ];

  // Helper functions
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory(undefined);
    setSelectedDays([]);
    setOnlyActive(false);
    setMinDiscountPercent(undefined);
    setSortBy('relevance');
    setSearchQuery('');
  };

  const hasAppliedFilters =
    !!selectedCategory ||
    selectedDays.length > 0 ||
    !!onlyActive ||
    minDiscountPercent !== undefined ||
    sortBy !== 'relevance' ||
    searchQuery.trim().length > 0;

  return {
    WEEKDAYS,
    SORT_OPTIONS,
    toggleDay,
    clearAllFilters,
    hasAppliedFilters,
  };
}
