import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BenefitDetailHeader } from '@/components/benefit-detail-header';
import { BenefitDetailSections } from '@/components/benefit-detail-sections';
import { ErrorState } from '@/components/error-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useBenefit } from '@/hooks/api/use-benefit';

export default function BenefitDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { data: benefit, loading, error, refetch } = useBenefit(params?.id);

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


