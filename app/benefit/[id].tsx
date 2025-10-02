import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BenefitDetailHeader } from '@/components/benefit-detail-header';
import { BenefitDetailSections } from '@/components/benefit-detail-sections';
import { ErrorState } from '@/components/screens/ErrorState';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_BASE_URL } from '@/config/api';
import type { Benefit } from '@/types';
import { useQuery } from '@tanstack/react-query';

async function fetchBenefit(id: string): Promise<Benefit> {
  // Add a 1.5 second delay to see loading states (remove in production)
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const response = await fetch(`${API_BASE_URL}/api/benefits/${id}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Benefit not found');
  }
  
  return result.data;
}

export default function BenefitDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  
  const { data: benefit, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['benefit', params?.id],
    queryFn: () => fetchBenefit(params!.id!),
    enabled: !!params?.id,
  });

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: benefit?.title ?? t('benefits.benefit'),
        }}
      />

      {loading ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <BenefitDetailHeader loading />
          <BenefitDetailSections loading />
        </ScrollView>
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : !benefit ? (
        <View style={styles.center}>
          <ThemedText type="title">{t('benefits.notFound')}</ThemedText>
          <Pressable onPress={() => router.back()} style={styles.retryBtn}>
            <ThemedText type="defaultSemiBold">{t('common.back')}</ThemedText>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <BenefitDetailHeader benefit={benefit} />
          <BenefitDetailSections benefit={benefit} />
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
});


