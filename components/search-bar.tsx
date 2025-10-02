import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFiltersPress: () => void;
}

export function SearchBar({ searchQuery, onSearchChange, onFiltersPress }: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.searchRow}>
      <TextInput
        placeholder={t('benefits.searchPlaceholder')}
        value={searchQuery}
        onChangeText={onSearchChange}
        style={[styles.searchInput, { flex: 1 }]}
        returnKeyType="search"
      />
      <Pressable style={styles.filtersBtn} onPress={onFiltersPress}>
        <ThemedText style={styles.filtersBtnText}>{t('common.filters')}</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    paddingHorizontal: 12,
    paddingBottom: 8,
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
  filtersBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.08)'
  },
  filtersBtnText: {
    fontWeight: '600'
  },
});
