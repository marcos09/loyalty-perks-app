import { ThemedText } from '@/components/shared/themed-text';
import { useBenefitsData } from '@/hooks/use-benefits-data';
import { useFilterActions } from '@/hooks/use-filter-actions';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

interface BenefitsHeaderProps {
  onOpenFilters: () => void;
}

export function BenefitsHeader({ onOpenFilters }: BenefitsHeaderProps) {
  const { t } = useTranslation();
  const { benefits, total } = useBenefitsData();
  const { draftFilters, handleSearchChange, handleSearchApply } = useFilterActions();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
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
            <Pressable onPress={handleSearchApply} style={styles.searchButton}>
              <Ionicons name="arrow-forward" size={20} color="#007AFF" />
            </Pressable>
          </View>
          
          <Pressable onPress={onOpenFilters} style={styles.filterButton}>
            <Ionicons name="filter-outline" size={20} color="#007AFF" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

