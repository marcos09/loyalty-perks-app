import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  // Variants
  default: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  elevated: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.2)',
  },
  
  // Padding variants
  paddingNone: {},
  paddingSmall: {
    padding: 8,
  },
  paddingMedium: {
    padding: 12,
  },
  paddingLarge: {
    padding: 16,
  },
});
