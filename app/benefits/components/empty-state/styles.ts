import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  icon: {
    fontSize: 40,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  description: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
    fontSize: 16,
    maxWidth: 280,
  },
});
