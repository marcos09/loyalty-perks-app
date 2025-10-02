import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    minHeight: '100%',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    minHeight: 60,
  },
  footer: {
    marginTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
});
