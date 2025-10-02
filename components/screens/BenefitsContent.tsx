import { useBenefitsData } from '@/hooks/use-benefits-data';
import { useFilterActions } from '@/hooks/use-filter-actions';
import { useState } from 'react';
import { BenefitsList } from '../benefits/BenefitsList';
import { FiltersModal } from '../filters/FiltersModal';
import { FilterHeader } from './FilterHeader';

export function BenefitsContent() {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const { handleClearFilters, handleResetDraft, handleApplyFilters } = useFilterActions();
  const { benefits, total } = useBenefitsData();

  const handleOpenFilters = () => {
    handleResetDraft();
    setFiltersVisible(true);
  };

  const handleApplyFiltersAndClose = () => {
    handleApplyFilters();
    setFiltersVisible(false);
  };

  const handleClearFiltersAndClose = () => {
    handleClearFilters();
    setFiltersVisible(false);
  };

  return (
    <>
      <FilterHeader 
        onFiltersPress={handleOpenFilters}
        benefitsCount={benefits.length}
        totalCount={total}
      />
      <BenefitsList onClearFilters={handleClearFiltersAndClose} />
      
      <FiltersModal
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        onApply={handleApplyFiltersAndClose}
        onClear={handleClearFiltersAndClose}
      />
    </>
  );
}
