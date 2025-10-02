import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '../themed-view';

export interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  safeArea?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  backgroundColor?: string;
}

export function Screen({
  children,
  safeArea = true,
  padding = 'none',
  backgroundColor,
  style,
  ...props
}: ScreenProps) {
  const Container = safeArea ? SafeAreaView : View;
  
  return (
    <ThemedView style={[styles.container, { backgroundColor }, style]} {...props}>
      <Container style={[styles.content, styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`]]}>
        {children}
      </Container>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  paddingNone: {},
  paddingSmall: {
    padding: 8,
  },
  paddingMedium: {
    padding: 16,
  },
  paddingLarge: {
    padding: 24,
  },
});
