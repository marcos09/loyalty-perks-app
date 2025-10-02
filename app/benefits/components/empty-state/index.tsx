import { Container } from '@/components/layout/container';
import { ThemedText } from '@/components/shared/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  const { t } = useTranslation();
  
  return (
    <Container 
      align="center" 
      justify="center" 
      padding="large"
      style={{ minHeight: 400 }}
    >
      <Card variant="outlined" padding="large">
        <Container align="center" gap={24}>
          <Container 
            align="center" 
            justify="center"
            style={styles.iconContainer}
          >
            <ThemedText style={styles.icon}>🎯</ThemedText>
          </Container>
          
          <Container align="center" gap={12}>
            <ThemedText type="title" style={styles.title}>
              {t('benefits.noBenefitsAvailable')}
            </ThemedText>
            <ThemedText style={styles.description}>
              {t('benefits.noBenefitsDescription')}
            </ThemedText>
          </Container>
          
          <Container gap={12} style={{ width: '100%', maxWidth: 280 }}>
            <Button
              title={t('common.seeAllBenefits')}
              onPress={onClearFilters}
              variant="primary"
              size="large"
            />
            <Button
              title={t('common.clearFilters')}
              onPress={onClearFilters}
              variant="secondary"
              size="large"
            />
          </Container>
        </Container>
      </Card>
    </Container>
  );
}

