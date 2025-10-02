import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.center}>
      <ThemedText type="title">{t('benefits.errorTitle')}</ThemedText>
      <ThemedText style={{ marginTop: 6 }}>{String(error)}</ThemedText>
      <Pressable onPress={onRetry} style={styles.retryBtn}>
        <ThemedText type="defaultSemiBold">{t('common.retry')}</ThemedText>
      </Pressable>
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
});
