import { ScrollView } from 'react-native';
import { Container } from '../layout/Container';
import { ThemedView } from '../themed-view';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/skeleton';

export function LoadingSkeleton() {
  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Header Skeleton */}
      <Container padding="medium" gap={6}>
        <Skeleton width={160} height={22} />
        <Skeleton width={120} height={14} />
      </Container>

      {/* Filters Skeleton */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 8, gap: 8 }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} width={80} height={32} radius={999} />
        ))}
      </ScrollView>

      {/* Benefits List Skeleton */}
      <Container padding="medium" gap={12}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} variant="default" padding="medium">
            <Container direction="row" gap={12} align="center">
              <Skeleton width={76} height={76} radius={12} />
              <Container style={{ flex: 1 }} gap={6}>
                <Skeleton width="80%" height={16} />
                <Skeleton width="95%" height={12} />
                <Skeleton width="60%" height={12} />
              </Container>
            </Container>
          </Card>
        ))}
      </Container>
    </ThemedView>
  );
}
