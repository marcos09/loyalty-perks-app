import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { useBenefits } from '@/hooks/use-benefits';

export default function BenefitDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { data, loading, error, refetch } = useBenefits();

  const benefit = useMemo(() => {
    if (!params?.id) return undefined;
    return data.find((b) => b.id === String(params.id));
  }, [data, params?.id]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: benefit?.title ?? 'Beneficio',
        }}
      />

      {loading ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <View style={styles.headerImageWrapper}>
            <View style={styles.heroContainer}>
              <Skeleton width={'100%'} height={'100%'} radius={16} />
            </View>
          </View>

          <View style={[styles.section, { paddingTop: 14 }]}> 
            <Skeleton width={'70%'} height={22} />
            <Skeleton width={100} height={14} style={{ marginTop: 6 }} />
          </View>

          <View style={styles.section}> 
            <Skeleton width={120} height={16} />
            <SkeletonText lines={3} width={'95%'} lineHeight={12} />
          </View>

          <View style={styles.section}> 
            <Skeleton width={100} height={16} />
            <Skeleton width={'60%'} height={12} style={{ marginTop: 6 }} />
            <Skeleton width={'40%'} height={12} style={{ marginTop: 6 }} />
          </View>

          <View style={[styles.section, { paddingTop: 0 }]}> 
            <Skeleton width={'100%'} height={48} radius={12} />
          </View>
        </ScrollView>
      ) : error ? (
        <View style={styles.center}> 
          <ThemedText type="title">Ups, algo salió mal</ThemedText>
          <ThemedText style={{ marginTop: 6 }}>{String(error)}</ThemedText>
          <Pressable onPress={refetch} style={styles.retryBtn}>
            <ThemedText type="defaultSemiBold">Reintentar</ThemedText>
          </Pressable>
        </View>
      ) : !benefit ? (
        <View style={styles.center}>
          <ThemedText type="title">Beneficio no encontrado</ThemedText>
          <Pressable onPress={() => router.back()} style={styles.retryBtn}>
            <ThemedText type="defaultSemiBold">Volver</ThemedText>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <View style={styles.headerImageWrapper}>
            <View style={styles.heroContainer}>
              <Image
                source={benefit.imageHero}
                style={styles.heroImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={[styles.section, { paddingTop: 14 }]}> 
            <ThemedText type="title">{benefit.title}</ThemedText>
            <ThemedText style={{ opacity: 0.8, marginTop: 4 }}>{benefit.discount}</ThemedText>
          </View>

          <View style={styles.section}> 
            <ThemedText type="subtitle">Descripción</ThemedText>
            <ThemedText style={{ marginTop: 6 }}>{benefit.description}</ThemedText>
          </View>

          <View style={styles.section}> 
            <ThemedText type="subtitle">Válido</ThemedText>
            <ThemedText style={{ marginTop: 6 }}>Días: {benefit.validDays.join(', ')}</ThemedText>
            <ThemedText style={{ marginTop: 4 }}>Vence: {new Date(benefit.expiresAt).toLocaleDateString()}</ThemedText>
          </View>

          <View style={[styles.section, { paddingTop: 0 }]}> 
            <Pressable style={styles.ctaBtn} onPress={() => router.push('/modal')}>
              <ThemedText type="defaultSemiBold">Obtener beneficio</ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      )}
      </SafeAreaView>
    </ThemedView>
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
  headerImageWrapper: {
    height: 220,
  },
  heroContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 4,
  },
  ctaBtn: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
});


