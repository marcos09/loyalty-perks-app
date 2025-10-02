import { useTranslation } from 'react-i18next';

import { FiltersState } from '@/components/filters-state';
import { ScreenHeader } from '@/components/screen-header';
import { SearchBar } from '@/components/search-bar';
import { useFilterContext } from '@/contexts/filter-context';
import { useBenefits } from '@/hooks/api';

interface FilterHeaderProps {
  onFiltersPress: () => void;
}

export function FilterHeader({ onFiltersPress }: FilterHeaderProps) {
  const { t } = useTranslation();
  const { appliedFilters, setAppliedFiltersDirect, setDraftSearchQuery } = useFilterContext();
  const { data } = useBenefits(appliedFilters);
  
  const benefits = data?.pages.flatMap(page => page.data) ?? [];
  const total = data?.pages[0]?.total ?? benefits.length;

  const handleSearchChange = (query: string) => {
    setAppliedFiltersDirect(prev => ({ ...prev, searchQuery: query }));
    setDraftSearchQuery(query);
  };

  return (
    <>
      <ScreenHeader 
        title={t('benefits.title')} 
        subtitle={`${benefits.length} / ${total} ${t('common.results')}`} 
      />

      <SearchBar 
        searchQuery={appliedFilters.searchQuery}
        onSearchChange={handleSearchChange}
        onFiltersPress={onFiltersPress}
      />

      <FiltersState />
    </>
  );
}
