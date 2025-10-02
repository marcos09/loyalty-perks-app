import { useTranslation } from 'react-i18next';

import { FiltersState } from '@/components/filters-state';
import { ScreenHeader } from '@/components/screen-header';
import { SearchBar } from '@/components/search-bar';
import { useFilterContext } from '@/contexts/filter-context';
import { useBenefits } from '@/hooks/api/use-benefits';

interface FilterHeaderProps {
  onFiltersPress: () => void;
}

export function FilterHeader({ onFiltersPress }: FilterHeaderProps) {
  const { t } = useTranslation();
  const { appliedFilters, setAppliedFiltersDirect, setDraftSearchQuery } = useFilterContext();
  const { data, total } = useBenefits(appliedFilters);

  const handleSearchChange = (query: string) => {
    // Apply search immediately as user types
    setAppliedFiltersDirect(prev => ({ ...prev, searchQuery: query }));
    setDraftSearchQuery(query);
  };

  return (
    <>
      <ScreenHeader 
        title={t('benefits.title')} 
        subtitle={`${data.length} / ${total} ${t('common.results')}`} 
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
