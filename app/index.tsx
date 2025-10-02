import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, ImageBackground, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { useBenefits } from '@/hooks/use-benefits';

export default function BenefitsScreen() {
  const {
    data,
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

  const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const SORT_OPTIONS: { key: any; label: string }[] = [
    { key: 'relevance', label: 'Relevancia' },
    { key: 'expiresAsc', label: 'Vence ↑' },
    { key: 'expiresDesc', label: 'Vence ↓' },
    { key: 'discountDesc', label: 'Descuento' },
    { key: 'titleAsc', label: 'A-Z' },
  ];

  function toggleDay(day: string) {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  }

  const [filtersVisible, setFiltersVisible] = useState(false);

  const hasAppliedFilters =
    !!selectedCategory ||
    selectedDays.length > 0 ||
    !!onlyActive ||
    minDiscountPercent !== undefined ||
    sortBy !== 'relevance';

  function clearAllFilters() {
    setSelectedCategory(undefined);
    setSelectedDays([]);
    setOnlyActive(false);
    setMinDiscountPercent(undefined);
    setSortBy('relevance');
  }

  if (loading) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ThemedView style={styles.header}>
            <Skeleton width={160} height={22} />
            <Skeleton width={120} height={14} style={{ marginTop: 6 }} />
          </ThemedView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} width={80} height={32} radius={999} />
            ))}
          </ScrollView>

          <View style={{ padding: 12, gap: 12 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={i} style={styles.card}>
                <View style={styles.row}>
                  <Skeleton width={76} height={76} radius={12} />
                  <View style={styles.info}>
                    <Skeleton width={'80%'} height={16} />
                    <SkeletonText lines={2} width={'95%'} lineHeight={12} />
                    <View style={styles.metaRow}>
                      <Skeleton width={80} height={12} />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="title">Ups, algo salió mal</ThemedText>
        <ThemedText style={{ marginTop: 6 }}>{String(error)}</ThemedText>
        <Pressable onPress={refetch} style={styles.retryBtn}>
          <ThemedText type="defaultSemiBold">Reintentar</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Beneficios</ThemedText>
        <ThemedText style={{ opacity: 0.7 }}>{filtered.length} resultados</ThemedText>
      </ThemedView>

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Buscar beneficios, categorías o marcas"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, { flex: 1 }]}
          returnKeyType="search"
        />
        <Pressable style={styles.filtersBtn} onPress={() => setFiltersVisible(true)}>
          <ThemedText style={styles.filtersBtnText}>Filtros</ThemedText>
        </Pressable>
      </View>

      {hasAppliedFilters && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.appliedFiltersRow}
        >
          {selectedCategory && (
            <AppliedChip label={`Cat: ${selectedCategory}`} onClear={() => setSelectedCategory(undefined)} />
          )}
          {selectedDays.length > 0 && (
            <AppliedChip label={`Días: ${selectedDays.join(', ')}`} onClear={() => setSelectedDays([])} />
          )}
          {onlyActive && (
            <AppliedChip label="Vigentes" onClear={() => setOnlyActive(false)} />
          )}
          {minDiscountPercent !== undefined && (
            <AppliedChip label={`Min ${minDiscountPercent}%`} onClear={() => setMinDiscountPercent(undefined)} />
          )}
          {sortBy !== 'relevance' && (
            <AppliedChip
              label={`Orden: ${SORT_OPTIONS.find((o) => o.key === sortBy)?.label ?? ''}`}
              onClear={() => setSortBy('relevance')}
            />
          )}
          <Pressable style={styles.clearAllBtn} onPress={clearAllFilters}>
            <ThemedText style={styles.clearAllText}>Limpiar todo</ThemedText>
          </Pressable>
        </ScrollView>
      )}

      {/* Category chips moved into full-screen filter modal */}

      <Modal visible={filtersVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <ThemedView style={styles.modalFullContainer}>
            <View style={styles.modalHeader}>
              <ThemedText type="title">Filtros</ThemedText>
              <Pressable onPress={() => setFiltersVisible(false)}>
                <ThemedText type="link">Cerrar</ThemedText>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.modalSection}>
                <ThemedText type="defaultSemiBold">Categorías</ThemedText>
                <View style={styles.modalChipsRow}>
                  <FilterChip
                    label="Todas"
                    selected={!selectedCategory}
                    onPress={() => setSelectedCategory(undefined)}
                  />
                  {categories.map((c: string) => (
                    <FilterChip
                      key={c}
                      label={c}
                      selected={selectedCategory === c}
                      onPress={() => setSelectedCategory(c)}
                    />
                  ))}
                </View>
              </View>

            <View style={styles.modalSection}>
              <ThemedText type="defaultSemiBold">Días válidos</ThemedText>
              <View style={styles.modalChipsRow}>
                {WEEKDAYS.map((d) => (
                  <FilterChip
                    key={d}
                    label={d}
                    selected={selectedDays.includes(d)}
                    onPress={() => toggleDay(d)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.modalSection}>
              <ThemedText type="defaultSemiBold">Estado</ThemedText>
              <View style={styles.modalChipsRow}>
                <FilterChip
                  label={onlyActive ? 'Solo vigentes ✓' : 'Solo vigentes'}
                  selected={!!onlyActive}
                  onPress={() => setOnlyActive(!onlyActive)}
                />
              </View>
            </View>

            <View style={styles.modalSection}>
              <ThemedText type="defaultSemiBold">Ordenar por</ThemedText>
              <View style={styles.modalChipsRow}>
                {SORT_OPTIONS.map((opt) => (
                  <FilterChip
                    key={opt.key}
                    label={opt.label}
                    selected={sortBy === opt.key}
                    onPress={() => setSortBy(opt.key)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.modalSection}>
              <ThemedText type="defaultSemiBold">Mínimo % descuento</ThemedText>
              <View style={styles.minDiscountRow}>
                <TextInput
                  value={minDiscountPercent?.toString() ?? ''}
                  onChangeText={(t) => {
                    const n = Number(t.replace(/[^0-9]/g, ''));
                    if (Number.isNaN(n)) {
                      setMinDiscountPercent(undefined);
                    } else {
                      setMinDiscountPercent(n);
                    }
                  }}
                  keyboardType="number-pad"
                  style={[styles.searchInput, { minWidth: 80, textAlign: 'center' }]}
                  placeholder="0"
                  maxLength={2}
                />
                <ThemedText>%</ThemedText>
              </View>
            </View>

              <View style={styles.modalFooter}>
                <Pressable
                  onPress={() => {
                    setSelectedCategory(undefined);
                    setSelectedDays([]);
                    setOnlyActive(false);
                    setMinDiscountPercent(undefined);
                    setSortBy('relevance');
                  }}
                  style={[styles.footerBtn, styles.resetBtn]}
                >
                  <ThemedText>Limpiar</ThemedText>
                </Pressable>
                <Pressable onPress={() => setFiltersVisible(false)} style={[styles.footerBtn, styles.applyBtn]}>
                  <ThemedText type="defaultSemiBold">Aplicar</ThemedText>
                </Pressable>
              </View>
            </ScrollView>
          </ThemedView>
        </SafeAreaView>
      </Modal>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        renderItem={({ item }) => (
          <Link
            href={{ pathname: '/benefit/[id]', params: { id: item.id } }}
            asChild
          >
            <Pressable style={styles.card}>
              <View style={styles.row}>
                <ImageBackground
                  source={item.imageSquare}
                  resizeMode="cover"
                  style={styles.thumb}
                  imageStyle={styles.thumbImage}
                />
                <View style={styles.info}>
                  <ThemedText type="subtitle" style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.cardDescription} numberOfLines={2}>
                    {item.description}
                  </ThemedText>
                  <View style={styles.metaRow}>
                    <ThemedText style={styles.cardDiscount}>{item.discount}</ThemedText>
                  </View>
                </View>
              </View>
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={
          filtered.length === 0 && hasAppliedFilters ? (
            <EmptyFiltersState onClearFilters={clearAllFilters} />
          ) : null
        }
      />
      </SafeAreaView>
    </ThemedView>
  );
}

function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <ThemedText style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function AppliedChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <View style={styles.appliedChip}>
      <ThemedText style={styles.appliedChipText} numberOfLines={1}>{label}</ThemedText>
      <Pressable onPress={onClear} hitSlop={8}>
        <ThemedText style={styles.appliedChipClear}>✕</ThemedText>
      </Pressable>
    </View>
  );
}

function EmptyFiltersState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIconContainer}>
        <ThemedText style={styles.emptyStateIcon}>🎯</ThemedText>
      </View>
      <ThemedText type="title" style={styles.emptyStateTitle}>
        No hay beneficios disponibles
      </ThemedText>
      <ThemedText style={styles.emptyStateDescription}>
        Los filtros que seleccionaste no coinciden con ningún beneficio actual. Prueba ajustando tus criterios de búsqueda.
      </ThemedText>
      <View style={styles.emptyStateActions}>
        <Pressable style={styles.emptyStateButton} onPress={onClearFilters}>
          <ThemedText type="defaultSemiBold" style={styles.emptyStateButtonText}>
            Ver todos los beneficios
          </ThemedText>
        </Pressable>
        <Pressable style={styles.emptyStateSecondaryButton} onPress={onClearFilters}>
          <ThemedText style={styles.emptyStateSecondaryButtonText}>
            Limpiar filtros
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(127,127,127,0.2)',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 4,
  },
  filters: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    gap: 8,
  },
  appliedFiltersRow: {
    paddingHorizontal: 10,
    paddingBottom: 8,
    gap: 6,
    alignItems: 'center',
  },
  searchRow: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)',
    backgroundColor: 'transparent',
  },
  filtersBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.08)'
  },
  filtersBtnText: {
    fontWeight: '600'
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)',
    backgroundColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  chipText: {
    fontSize: 14,
  },
  chipTextSelected: {
    fontWeight: '700',
  },
  appliedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)'
  },
  appliedChipText: {
    fontSize: 13,
    maxWidth: 180,
  },
  appliedChipClear: {
    opacity: 0.6,
    fontSize: 12,
  },
  clearAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)'
  },
  clearAllText: {
    fontSize: 13,
  },
  card: {
    minHeight: 100,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.04)'
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    alignItems: 'center',
  },
  thumb: {
    width: 76,
    height: 76,
  },
  thumbImage: {
    borderRadius: 12,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    
  },
  cardDiscount: {
    opacity: 0.9,
  },
  cardDescription: {
    opacity: 0.8,
  },
  minDiscountChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)',
    backgroundColor: 'transparent',
  },
  minDiscountLabel: {
    fontSize: 14,
  },
  minDiscountInput: {
    minWidth: 40,
    textAlign: 'center',
    paddingVertical: 4,
  },
  modalFullContainer: {
    flex: 1,
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)'
  },
  modalSection: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 8,
  },
  modalChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  minDiscountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalFooter: {
    marginTop: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 10,
  },
  footerBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  resetBtn: {
    backgroundColor: 'rgba(0,0,0,0.06)'
  },
  applyBtn: {
    backgroundColor: 'rgba(0,0,0,0.12)'
  },
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


