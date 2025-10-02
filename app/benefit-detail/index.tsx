import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BenefitDetailHeader } from '@/components/features/benefit-detail/header';
import { BenefitDetailLoading } from '@/components/features/benefit-detail/loading';
import { BenefitDetailSections } from '@/components/features/benefit-detail/sections';
import { ErrorState } from '@/components/screens/error/error-state';
import { ThemedText } from '@/components/shared/themed-text';
import { useBenefitDetail } from '@/hooks/use-benefit-detail';
import { styles } from './styles';

export default function BenefitDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { benefit, loading, error, refetch } = useBenefitDetail();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: benefit?.title ?? t('benefits.benefit'),
        }}
      />

      {loading ? (
        <BenefitDetailLoading />
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
  );
}



