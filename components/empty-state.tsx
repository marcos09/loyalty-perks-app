import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  const { t } = useTranslation();
  
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIconContainer}>
        <ThemedText style={styles.emptyStateIcon}>🎯</ThemedText>
      </View>
      <ThemedText type="title" style={styles.emptyStateTitle}>
        {t('benefits.noBenefitsAvailable')}
      </ThemedText>
      <ThemedText style={styles.emptyStateDescription}>
        {t('benefits.noBenefitsDescription')}
      </ThemedText>
      <View style={styles.emptyStateActions}>
        <Pressable style={styles.emptyStateButton} onPress={onClearFilters}>
          <ThemedText type="defaultSemiBold" style={styles.emptyStateButtonText}>
            {t('common.seeAllBenefits')}
          </ThemedText>
        </Pressable>
        <Pressable style={styles.emptyStateSecondaryButton} onPress={onClearFilters}>
          <ThemedText style={styles.emptyStateSecondaryButtonText}>
            {t('common.clearFilters')}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    minHeight: 400,
  },
  emptyStateIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  emptyStateIcon: {
    fontSize: 40,
  },
  emptyStateTitle: {
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '600',
  },
  emptyStateDescription: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
    marginBottom: 32,
    fontSize: 16,
    maxWidth: 280,
  },
  emptyStateActions: {
    gap: 12,
    width: '100%',
    maxWidth: 280,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateSecondaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.3)',
    alignItems: 'center',
  },
  emptyStateSecondaryButtonText: {
    fontSize: 15,
    opacity: 0.8,
  },
});
