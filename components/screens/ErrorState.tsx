import type { ApiError } from '@/types/api';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { Container } from '../layout/Container';
import { ThemedText } from '../themed-text';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

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
    <Container align="center" justify="center" padding="large">
      <Card variant="outlined" padding="large">
        <Container align="center" gap={24}>
          <Container 
            align="center" 
            justify="center"
            style={styles.iconContainer}
          >
            <Ionicons 
              name={errorInfo.icon} 
              size={64} 
              color="rgba(127,127,127,0.6)" 
            />
          </Container>
          
          <Container align="center" gap={12}>
            <ThemedText type="title" style={styles.title}>
              {errorInfo.title}
            </ThemedText>
            
            <ThemedText style={styles.description}>
              {errorInfo.description}
            </ThemedText>
          </Container>

          {showDetails && error && (
            <Button
              title={t('errors.details.show')}
              onPress={handleShowDetails}
              variant="ghost"
              size="medium"
            />
          )}

          <Container gap={12} style={{ width: '100%', maxWidth: 280 }}>
            {showResetFilters && onResetFilters && (
              <Button
                title={t('common.clearFilters')}
                onPress={onResetFilters}
                variant="secondary"
                size="large"
              />
            )}

            <Button
              title={t('common.retry')}
              onPress={onRetry}
              variant="primary"
              size="large"
            />
          </Container>
        </Container>
      </Card>
    </Container>
  );
}

const styles = {
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: 12,
  },
  description: {
    textAlign: 'center' as const,
    marginBottom: 24,
    opacity: 0.7,
    lineHeight: 20,
  },
};
