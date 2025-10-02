import { FiltersModal } from "@/components/features/filters/filters-modal";
import { FiltersState } from "@/components/features/filters/filters-state";
import { ErrorState } from "@/components/screens/error/error-state";
import { useBenefitsData } from "@/hooks/use-benefits-data";
import { useFilterActions } from "@/hooks/use-filter-actions";
import { analyzeApiError } from "@/utils/error-handler";
import { useState } from "react";
import { BenefitsList } from "./components/benefits-list";
import { BenefitsHeader } from "./components/header";
import { LoadingSkeleton } from "./components/loading-skeleton";

export default function BenefitsScreenPage() {
  const {
    benefits,
    loading,
    error,
    refetch: handleErrorRetry,
  } = useBenefitsData();
  const { handleClearFilters } = useFilterActions();
  const [filtersModalVisible, setFiltersModalVisible] = useState(false);

  const handleOpenFilters = () => {
    setFiltersModalVisible(true);
  };

  const handleCloseFilters = () => {
    setFiltersModalVisible(false);
  };

  if (loading && benefits.length === 0) {
    return <LoadingSkeleton />;
  }

  if (error) {
    const errorInfo = analyzeApiError(error);

    return (
      <ErrorState
        error={error}
        onRetry={errorInfo.isRetryable ? handleErrorRetry : () => {}}
        showDetails={__DEV__}
        title={errorInfo.title}
        description={errorInfo.description}
        onResetFilters={handleClearFilters}
        showResetFilters={errorInfo.shouldResetFilters}
      />
    );
  }

  return (
    <>
      <BenefitsHeader onOpenFilters={handleOpenFilters} />
      <FiltersState />
      <BenefitsList onClearFilters={handleClearFilters} />

      <FiltersModal
        visible={filtersModalVisible}
        onClose={handleCloseFilters}
      />
    </>
  );
}
