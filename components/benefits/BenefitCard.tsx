import type { Benefit } from '@/types';
import { Link } from 'expo-router';
import { ImageBackground, Pressable, StyleSheet } from 'react-native';
import { Container } from '../layout/Container';
import { ThemedText } from '../themed-text';
import { Card } from '../ui/Card';

interface BenefitCardProps {
  benefit: Benefit;
}

export function BenefitCard({ benefit }: BenefitCardProps) {
  return (
    <Link
      href={{ pathname: '/benefit/[id]', params: { id: benefit.id } }}
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

const styles = StyleSheet.create({
  thumbnail: {
    width: 76,
    height: 76,
  },
  thumbnailImage: {
    borderRadius: 12,
  },
  content: {
    flex: 1,
  },
  description: {
    opacity: 0.8,
  },
  discount: {
    opacity: 0.9,
    fontWeight: '600',
  },
});
