import { Link } from 'expo-router';
import { FlatList, ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
    loading,
    error,
    refetch,
  } = useBenefits();

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
        <ThemedText style={{ opacity: 0.7 }}>{data.length} disponibles</ThemedText>
      </ThemedView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        <FilterChip
          label="Todos"
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
      </ScrollView>

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
});


