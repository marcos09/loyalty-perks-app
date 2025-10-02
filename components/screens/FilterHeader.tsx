import { useFilterActions } from '@/hooks/use-filter-actions';
import { useTranslation } from 'react-i18next';
import { FiltersState } from '../filters/FiltersState';
import { SearchBar } from '../filters/SearchBar';
import { Container } from '../layout/Container';
import { ThemedText } from '../themed-text';

interface FilterHeaderProps {
  onFiltersPress: () => void;
  benefitsCount: number;
  totalCount: number;
}

export function FilterHeader({ onFiltersPress, benefitsCount, totalCount }: FilterHeaderProps) {
  const { t } = useTranslation();
  const { appliedFilters, handleSearchChange } = useFilterActions();

  return (
    <Container gap={4}>
      <Container padding="medium" gap={4}>
        <ThemedText type="title">{t('benefits.title')}</ThemedText>
        <ThemedText style={{ opacity: 0.7 }}>
          {benefitsCount} / {totalCount} {t('common.results')}
        </ThemedText>
      </Container>

      <SearchBar 
        searchQuery={appliedFilters.searchQuery}
        onSearchChange={handleSearchChange}
        onFiltersPress={onFiltersPress}
      />

      <FiltersState />
    </Container>
  );
}
