import type { ApiError } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
  title?: string;
  description?: string;
  showDetails?: boolean;
  onResetFilters?: () => void;
  showResetFilters?: boolean;
}

export function ErrorState({ 
  error, 
  onRetry, 
  title, 
  description,
  showDetails = false,
  onResetFilters,
  showResetFilters = false
}: ErrorStateProps) {
  const { t } = useTranslation();

  const getErrorInfo = () => {
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as ApiError;
      const status = apiError.status;
      
      if (status === 404) {
        return {
          icon: 'search-outline' as const,
          title: title || t('errors.notFound.title'),
          description: description || t('errors.notFound.description'),
          type: 'notFound' as const,
        };
      } else if (status === 401 || status === 403) {
        return {
          icon: 'lock-closed-outline' as const,
          title: title || t('errors.unauthorized.title'),
          description: description || t('errors.unauthorized.description'),
          type: 'unauthorized' as const,
        };
      } else if (status >= 500) {
        return {
          icon: 'server-outline' as const,
          title: title || t('errors.server.title'),
          description: description || t('errors.server.description'),
          type: 'server' as const,
        };
      } else if (status === 0 || !status) {
        return {
          icon: 'wifi-outline' as const,
          title: title || t('errors.network.title'),
          description: description || t('errors.network.description'),
          type: 'network' as const,
        };
      }
    }
    
    return {
      icon: 'alert-circle-outline' as const,
      title: title || t('errors.generic.title'),
      description: description || t('errors.generic.description'),
      type: 'generic' as const,
    };
  };

  const errorInfo = getErrorInfo();

  const handleShowDetails = () => {
    if (showDetails && error) {
      Alert.alert(
        t('errors.details.title'),
        String(error),
        [{ text: t('common.close') }]
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={errorInfo.icon} 
            size={64} 
            color="rgba(127,127,127,0.6)" 
          />
        </View>
        
        <ThemedText type="title" style={styles.title}>
          {errorInfo.title}
        </ThemedText>
        
        <ThemedText style={styles.description}>
          {errorInfo.description}
        </ThemedText>

        {showDetails && error && (
          <Pressable onPress={handleShowDetails} style={styles.detailsBtn}>
            <ThemedText type="defaultSemiBold" style={styles.detailsText}>
              {t('errors.details.show')}
            </ThemedText>
          </Pressable>
        )}

        {showResetFilters && onResetFilters && (
          <Pressable onPress={onResetFilters} style={styles.resetFiltersBtn}>
            <Ionicons name="refresh-outline" size={20} color="#007AFF" style={styles.resetFiltersIcon} />
            <ThemedText type="defaultSemiBold" style={styles.resetFiltersText}>
              {t('common.clearFilters')}
            </ThemedText>
          </Pressable>
        )}

        <Pressable onPress={onRetry} style={styles.retryBtn}>
          <Ionicons name="refresh" size={20} color="white" style={styles.retryIcon} />
          <ThemedText type="defaultSemiBold" style={styles.retryText}>
            {t('common.retry')}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
    lineHeight: 20,
  },
  detailsBtn: {
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  detailsText: {
    color: 'rgba(127,127,127,0.8)',
    textDecorationLine: 'underline',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  retryIcon: {
    marginRight: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
  },
  resetFiltersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  resetFiltersIcon: {
    marginRight: 8,
  },
  resetFiltersText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
