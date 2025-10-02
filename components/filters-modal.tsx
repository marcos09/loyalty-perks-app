import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterChip } from '@/components/filter-chip';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { SortBy } from '@/types';

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
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
  onApply: () => void;
  sortOptions: { key: SortBy; label: string }[];
}

export function FiltersModal({
  visible,
  onClose,
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
  onApply,
  sortOptions,
}: FiltersModalProps) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.modalFullContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="title">{t('filters.title')}</ThemedText>
            <Pressable onPress={onClose}>
              <ThemedText type="link">{t('common.close')}</ThemedText>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={styles.modalSection}>
              <ThemedText type="defaultSemiBold">{t('filters.categories')}</ThemedText>
              <View style={styles.modalChipsRow}>
                <FilterChip
                  label={t('common.all')}
                  selected={!selectedCategory}
                  onPress={() => onCategoryChange(undefined)}
                />
                {categories.map((c: string) => (
                  <FilterChip
                    key={c}
                    label={c}
                    selected={selectedCategory === c}
                    onPress={() => onCategoryChange(c)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.modalSection}>
              <ThemedText type="defaultSemiBold">{t('filters.validDays')}</ThemedText>
              <View style={styles.modalChipsRow}>
                {weekdays.map((d) => (
                  <FilterChip
                    key={d}
                    label={d}
                    selected={selectedDays.includes(d)}
                    onPress={() => onDayToggle(d)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.modalSection}>
              <ThemedText type="defaultSemiBold">{t('filters.status')}</ThemedText>
              <View style={styles.modalChipsRow}>
                <FilterChip
                  label={onlyActive ? t('filters.onlyActiveChecked') : t('filters.onlyActive')}
                  selected={!!onlyActive}
                  onPress={() => onOnlyActiveChange(!onlyActive)}
                />
              </View>
            </View>

            <View style={styles.modalSection}>
              <ThemedText type="defaultSemiBold">{t('filters.sortBy')}</ThemedText>
              <View style={styles.modalChipsRow}>
                {sortOptions.map((opt) => (
                  <FilterChip
                    key={opt.key}
                    label={opt.label}
                    selected={sortBy === opt.key}
                    onPress={() => onSortChange(opt.key)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.modalSection}>
              <ThemedText type="defaultSemiBold">{t('filters.minDiscount')}</ThemedText>
              <View style={styles.minDiscountRow}>
                <TextInput
                  value={minDiscountPercent?.toString() ?? ''}
                  onChangeText={(t) => {
                    const n = Number(t.replace(/[^0-9]/g, ''));
                    if (Number.isNaN(n)) {
                      onMinDiscountChange(undefined);
                    } else {
                      onMinDiscountChange(n);
                    }
                  }}
                  keyboardType="number-pad"
                  style={[styles.searchInput, { minWidth: 80, textAlign: 'center' }]}
                  placeholder="0"
                  maxLength={2}
                />
                <ThemedText>%</ThemedText>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <Pressable
                onPress={onClearAll}
                style={[styles.footerBtn, styles.resetBtn]}
              >
                <ThemedText>{t('common.clear')}</ThemedText>
              </Pressable>
              <Pressable onPress={onApply} style={[styles.footerBtn, styles.applyBtn]}>
                <ThemedText type="defaultSemiBold">{t('common.apply')}</ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalFullContainer: {
    flex: 1,
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)'
  },
  modalSection: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 8,
  },
  modalChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  minDiscountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)',
    backgroundColor: 'transparent',
  },
  modalFooter: {
    marginTop: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 10,
  },
  footerBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  resetBtn: {
    backgroundColor: 'rgba(0,0,0,0.06)'
  },
  applyBtn: {
    backgroundColor: 'rgba(0,0,0,0.12)'
  },
});
