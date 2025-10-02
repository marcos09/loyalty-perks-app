import { ScrollView, View } from 'react-native';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { styles } from './styles';

export function BenefitDetailLoading() {
  return (
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
  );
}

