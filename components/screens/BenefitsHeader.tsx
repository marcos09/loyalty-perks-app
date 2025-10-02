import { useBenefitsData } from '@/hooks/use-benefits-data';
import { useFilterActions } from '@/hooks/use-filter-actions';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

interface BenefitsHeaderProps {
  onOpenFilters: () => void;
}

export function BenefitsHeader({ onOpenFilters }: BenefitsHeaderProps) {
  const { t } = useTranslation();
  const { benefits, total } = useBenefitsData();
  const { draftFilters, handleSearchChange } = useFilterActions();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {t('benefits.title')}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {benefits.length} {t('common.of')} {total} {t('benefits.available')}
          </ThemedText>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons 
              name="search-outline" 
              size={20} 
              color="rgba(0,0,0,0.4)" 
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={t('benefits.searchPlaceholder')}
              value={draftFilters.searchQuery}
              onChangeText={handleSearchChange}
              placeholderTextColor="rgba(0,0,0,0.4)"
            />
          </View>
          
          <Pressable onPress={onOpenFilters} style={styles.filterButton}>
            <Ionicons name="filter-outline" size={20} color="#007AFF" />
          </Pressable>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  filterButton: {
    backgroundColor: 'rgba(0,122,255,0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.2)',
  },
});
