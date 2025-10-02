import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { FilterChip } from '@/components/filter-chip';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SortBy } from '@/hooks/use-benefits';

interface FiltersSidebarProps {
  categories: string[];
  selectedCategory: string | undefined;
  onCategoryChange: (category: string | undefined) => void;
  weekdays: string[];
  selectedDays: string[];
  onDayToggle: (day: string) => void;
  onlyActive: boolean;
  onOnlyActiveChange: (active: boolean) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  minDiscountPercent: number | undefined;
  onMinDiscountChange: (percent: number | undefined) => void;
  onClearAll: () => void;
  sortOptions: { key: SortBy; label: string }[];
}

export function FiltersSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  weekdays,
  selectedDays,
  onDayToggle,
  onlyActive,
  onOnlyActiveChange,
  sortBy,
  onSortChange,
  minDiscountPercent,
  onMinDiscountChange,
  onClearAll,
  sortOptions,
}: FiltersSidebarProps) {
  const { t } = useTranslation();

  return (
    <ThemedView style={styles.sidebar}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {t('filters.title')}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            {t('filters.categories')}
          </ThemedText>
          <View style={styles.chipsContainer}>
            <FilterChip
              label={t('common.all')}
              selected={!selectedCategory}
              onPress={() => onCategoryChange(undefined)}
            />
            {categories.map((category) => (
              <FilterChip
                key={category}
                label={category}
                selected={selectedCategory === category}
                onPress={() => onCategoryChange(category)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            {t('filters.validDays')}
          </ThemedText>
          <View style={styles.chipsContainer}>
            {weekdays.map((day) => (
              <FilterChip
                key={day}
                label={day}
                selected={selectedDays.includes(day)}
                onPress={() => onDayToggle(day)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            {t('filters.status')}
          </ThemedText>
          <View style={styles.chipsContainer}>
            <FilterChip
              label={onlyActive ? t('filters.onlyActiveChecked') : t('filters.onlyActive')}
              selected={!!onlyActive}
              onPress={() => onOnlyActiveChange(!onlyActive)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            {t('filters.sortBy')}
          </ThemedText>
          <View style={styles.chipsContainer}>
            {sortOptions.map((option) => (
              <FilterChip
                key={option.key}
                label={option.label}
                selected={sortBy === option.key}
                onPress={() => onSortChange(option.key)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            {t('filters.minDiscount')}
          </ThemedText>
          <View style={styles.discountRow}>
            <TextInput
              value={minDiscountPercent?.toString() ?? ''}
              onChangeText={(text) => {
                const number = Number(text.replace(/[^0-9]/g, ''));
                if (Number.isNaN(number)) {
                  onMinDiscountChange(undefined);
                } else {
                  onMinDiscountChange(number);
                }
              }}
              keyboardType="number-pad"
              style={styles.discountInput}
              placeholder="0"
              maxLength={2}
            />
            <ThemedText style={styles.percentSymbol}>%</ThemedText>
          </View>
        </View>

        <View style={styles.footer}>
          <FilterChip
            label={t('common.clearAll')}
            selected={false}
            onPress={onClearAll}
            style={styles.clearAllChip}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 300,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)',
    backgroundColor: 'transparent',
    minWidth: 80,
    textAlign: 'center',
    fontSize: 16,
  },
  percentSymbol: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  clearAllChip: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
});
