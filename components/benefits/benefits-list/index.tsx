import { useBenefitsData } from "@/hooks/use-benefits-data";
import { FlatList } from "react-native";
import { Container } from "../../layout/container";
import { Card } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";
import { BenefitCard } from "../benefit-card";
import { EmptyState } from "../empty-state";
import { LoadingSkeleton } from "../loading-skeleton";
import { styles } from "./styles";

interface BenefitsListProps {
  onClearFilters: () => void;
}

export function BenefitsList({ onClearFilters }: BenefitsListProps) {
  const { benefits, hasAppliedFilters, loading, loadingMore, loadMore } =
    useBenefitsData();

  if (loading && benefits.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <FlatList
      data={benefits}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => <BenefitCard benefit={item} />}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        benefits.length === 0 && hasAppliedFilters && !loading ? (
          <EmptyState onClearFilters={onClearFilters} />
        ) : null
      }
      ListFooterComponent={loadingMore ? <LoadingMoreSkeleton /> : null}
    />
  );
}

function LoadingMoreSkeleton() {
  return (
    <Container gap={12} padding="medium">
      {Array.from({ length: 3 }).map((_, i) => (
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
  );
}
