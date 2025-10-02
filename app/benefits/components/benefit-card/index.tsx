import { Container } from '@/components/layout/container';
import { ThemedText } from '@/components/shared/themed-text';
import { Card } from '@/components/ui/card';
import type { Benefit } from '@/types';
import { Link } from 'expo-router';
import { ImageBackground, Pressable } from 'react-native';
import { styles } from './styles';

interface BenefitCardProps {
  benefit: Benefit;
}

export function BenefitCard({ benefit }: BenefitCardProps) {
  return (
    <Link
      href={{ pathname: '/benefit-detail', params: { id: benefit.id } }}
      asChild
    >
      <Pressable>
        <Card variant="default" padding="medium">
          <Container direction="row" gap={12} align="center">
            <ImageBackground
              source={benefit.imageSquare}
              resizeMode="cover"
              style={styles.thumbnail}
              imageStyle={styles.thumbnailImage}
            />
            <Container style={styles.content} gap={6}>
              <ThemedText type="subtitle" numberOfLines={1}>
                {benefit.title}
              </ThemedText>
              <ThemedText style={styles.description} numberOfLines={2}>
                {benefit.description}
              </ThemedText>
              <Container direction="row" justify="space-between" align="center">
                <ThemedText style={styles.discount}>
                  {benefit.discount}
                </ThemedText>
              </Container>
            </Container>
          </Container>
        </Card>
      </Pressable>
    </Link>
  );
}

