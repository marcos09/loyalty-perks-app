import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BenefitCard } from '@/components/benefit-card';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { useFilterLogic } from '@/components/filter-logic';
import { FiltersModal } from '@/components/filters-modal';
import { FiltersSidebar } from '@/components/filters-sidebar';
import { FiltersState } from '@/components/filters-state';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { ScreenHeader } from '@/components/screen-header';
import { SearchBar } from '@/components/search-bar';
import { ThemedView } from '@/components/themed-view';
import { useBenefits } from '@/hooks/use-benefits';
import { useResponsive } from '@/hooks/use-responsive';

export default function BenefitsScreen() {
  const { t } = useTranslation();
  const { showSidebar } = useResponsive();
  const {
    filtered,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedDays,
    setSelectedDays,
    onlyActive,
    setOnlyActive,
    minDiscountPercent,
    setMinDiscountPercent,
    sortBy,
    setSortBy,
    loading,
    error,
    refetch,
  } = useBenefits();

  const [filtersVisible, setFiltersVisible] = useState(false);

  const {
    WEEKDAYS,
    SORT_OPTIONS,
    toggleDay,
    clearAllFilters,
    hasAppliedFilters,
  } = useFilterLogic({
    selectedCategory,
    setSelectedCategory,
    selectedDays,
    setSelectedDays,
    onlyActive,
    setOnlyActive,
    minDiscountPercent,
    setMinDiscountPercent,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  });

  if (loading) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <LoadingSkeleton />
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ErrorState error={error} onRetry={refetch} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  const renderContent = () => (
    <View style={styles.content}>
      <ScreenHeader 
        title={t('benefits.title')} 
        subtitle={`${filtered.length} ${t('common.results')}`} 
      />

      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFiltersPress={() => setFiltersVisible(true)}
      />

      {!showSidebar && (
        <FiltersState
          filterState={{
            selectedCategory,
            selectedDays,
            onlyActive,
            minDiscountPercent,
            sortBy,
            searchQuery,
          }}
          onClearCategory={() => setSelectedCategory(undefined)}
          onClearDays={() => setSelectedDays([])}
          onClearActive={() => setOnlyActive(false)}
          onClearMinDiscount={() => setMinDiscountPercent(undefined)}
          onClearSort={() => setSortBy('relevance')}
          onClearSearch={() => setSearchQuery('')}
          onClearAll={clearAllFilters}
        />
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <BenefitCard benefit={item} />}
        ListEmptyComponent={
          filtered.length === 0 && hasAppliedFilters ? (
            <EmptyState onClearFilters={clearAllFilters} />
          ) : null
        }
      />
    </View>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {showSidebar ? (
          <View style={styles.desktopLayout}>
            <FiltersSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              weekdays={WEEKDAYS}
              selectedDays={selectedDays}
              onDayToggle={toggleDay}
              onlyActive={onlyActive}
              onOnlyActiveChange={setOnlyActive}
              sortBy={sortBy}
              onSortChange={setSortBy}
              minDiscountPercent={minDiscountPercent}
              onMinDiscountChange={setMinDiscountPercent}
              onClearAll={clearAllFilters}
              sortOptions={SORT_OPTIONS}
            />
            {renderContent()}
          </View>
        ) : (
          <>
            {renderContent()}
            <FiltersModal
              visible={filtersVisible}
              onClose={() => setFiltersVisible(false)}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              weekdays={WEEKDAYS}
              selectedDays={selectedDays}
              onDayToggle={toggleDay}
              onlyActive={onlyActive}
              onOnlyActiveChange={setOnlyActive}
              sortBy={sortBy}
              onSortChange={setSortBy}
              minDiscountPercent={minDiscountPercent}
              onMinDiscountChange={setMinDiscountPercent}
              onClearAll={clearAllFilters}
              sortOptions={SORT_OPTIONS}
            />
          </>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  desktopLayout: {
    flexDirection: 'row',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    gap: 12,
  },
});

