import { Container } from '@/components/layout/container';
import { ThemedText } from '@/components/shared/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCategories } from '@/hooks/api';
import { useFilterActions } from '@/hooks/use-filter-actions';
import type { SortBy } from '@/types';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FilterSection } from '../filter-section';
import { FilterChip } from '../FilterChip';
import { styles } from './styles';

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
}

export function FiltersModal({
  visible,
  onClose,
}: FiltersModalProps) {
  const { t } = useTranslation();
  const { data: categories = [] } = useCategories();
  const insets = useSafeAreaInsets();
  const {
    draftFilters,
    handleCategoryChange,
    handleDayToggle,
    handleMinDiscountChange,
    handleSortChange,
    applyFilters,
    clearFilters,
    resetDraftToApplied,
  } = useFilterActions();

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

  const handleClose = () => {
    try {
      resetDraftToApplied();
      onClose();
    } catch (error) {
      console.error('Error closing filters modal:', error);
      onClose();
    }
  };

  const handleApply = () => {
    try {
      applyFilters();
      onClose();
    } catch (error) {
      console.error('Error applying filters:', error);
      onClose();
    }
  };

  const handleClear = () => {
    try {
      clearFilters();
      onClose();
    } catch (error) {
      console.error('Error clearing filters:', error);
      onClose();
    }
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
        <View style={styles.container}>
          <Container 
            direction="row" 
            justify="space-between" 
            align="center"
            padding="medium"
            style={styles.header}
          >
            <ThemedText type="title">{t('filters.title')}</ThemedText>
            <Button
              title={t('common.close')}
              onPress={handleClose}
              variant="ghost"
              size="small"
            />
          </Container>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <FilterSection title={t('filters.categories')}>
              <FilterChip
                label={t('common.all')}
                selected={!draftFilters.selectedCategory}
                onPress={() => handleCategoryChange(undefined)}
              />
              {categories.map((category) => (
                <FilterChip
                  key={category}
                  label={category}
                  selected={draftFilters.selectedCategory === category}
                  onPress={() => handleCategoryChange(category)}
                />
              ))}
            </FilterSection>

            <FilterSection title={t('filters.validDays')}>
              {WEEKDAYS.map((day) => (
                <FilterChip
                  key={day}
                  label={day}
                  selected={draftFilters.selectedDays.includes(day)}
                  onPress={() => handleDayToggle(day)}
                />
              ))}
            </FilterSection>

            <FilterSection title={t('filters.sortBy')}>
              {SORT_OPTIONS.map((option) => (
                <FilterChip
                  key={option.key}
                  label={option.label}
                  selected={draftFilters.sortBy === option.key}
                  onPress={() => handleSortChange(option.key)}
                />
              ))}
            </FilterSection>

            <FilterSection title={t('filters.minDiscount')}>
              <Input
                value={draftFilters.minDiscountPercent?.toString() ?? ''}
                onChangeText={(text) => {
                  const number = Number(text.replace(/[^0-9]/g, ''));
                  if (Number.isNaN(number)) {
                    handleMinDiscountChange(undefined);
                  } else {
                    handleMinDiscountChange(number);
                  }
                }}
                keyboardType="number-pad"
                placeholder="0"
                maxLength={2}
                style={{ minWidth: 80, textAlign: 'center' }}
              />
            </FilterSection>

            <Container 
              direction="row" 
              gap={10} 
              padding="medium"
              style={styles.footer}
            >
              <Button
                title={t('common.clear')}
                onPress={handleClear}
                variant="secondary"
                size="large"
                style={{ flex: 1 }}
              />
              <Button
                title={t('common.apply')}
                onPress={handleApply}
                variant="primary"
                size="large"
                style={{ flex: 1 }}
              />
            </Container>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

