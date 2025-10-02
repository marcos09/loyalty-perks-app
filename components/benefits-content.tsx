import { StyleSheet, View } from 'react-native';

import { BenefitsList } from '@/components/benefits-list';
import { FilterHeader } from '@/components/filter-header';
import { useFilterContext } from '@/contexts/filter-context';

interface BenefitsContentProps {
  onFiltersPress: () => void;
}

export function BenefitsContent({ onFiltersPress }: BenefitsContentProps) {
  const { clearFilters } = useFilterContext();

  return (
    <View style={styles.container}>
      <FilterHeader onFiltersPress={onFiltersPress} />
      <BenefitsList onClearFilters={clearFilters} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
