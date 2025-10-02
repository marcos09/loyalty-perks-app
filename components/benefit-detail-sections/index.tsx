import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import type { Benefit } from '@/types';
import { styles } from './styles';

interface BenefitDetailSectionsProps {
  benefit?: Benefit;
  loading?: boolean;
}

export function BenefitDetailSections({ benefit, loading = false }: BenefitDetailSectionsProps) {
  const { t } = useTranslation();
  const router = useRouter();

  if (loading) {
    return (
      <>
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
      </>
    );
  }

  if (!benefit) return null;

  return (
    <>
      <View style={[styles.section, { paddingTop: 14 }]}> 
        <ThemedText type="title">{benefit.title}</ThemedText>
        <ThemedText style={{ opacity: 0.8, marginTop: 4 }}>{benefit.discount}</ThemedText>
      </View>

      <View style={styles.section}> 
        <ThemedText type="subtitle">{t('common.description')}</ThemedText>
        <ThemedText style={{ marginTop: 6 }}>{benefit.description}</ThemedText>
      </View>

      <View style={styles.section}> 
        <ThemedText type="subtitle">{t('common.valid')}</ThemedText>
        <ThemedText style={{ marginTop: 6 }}>{t('common.days')}: {benefit.validDays.join(', ')}</ThemedText>
        <ThemedText style={{ marginTop: 4 }}>{t('common.expires')}: {new Date(benefit.expiresAt).toLocaleDateString()}</ThemedText>
      </View>

      <View style={[styles.section, { paddingTop: 0 }]}> 
        <Pressable style={styles.ctaBtn} onPress={() => console.log('Get benefit action')}>
          <ThemedText type="defaultSemiBold">{t('common.getBenefit')}</ThemedText>
        </Pressable>
      </View>
    </>
  );
}

