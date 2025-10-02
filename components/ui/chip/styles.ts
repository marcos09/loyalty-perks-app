import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Variants
  default: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)',
  },
  filter: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)',
  },
  status: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderWidth: 0,
  },
  
  // Sizes
  small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  large: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  // States
  selected: {
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  
  // Text styles
  text: {
    fontWeight: '500',
  },
  defaultText: {
    color: 'rgba(0,0,0,0.8)',
  },
  filterText: {
    color: 'rgba(0,0,0,0.8)',
  },
  statusText: {
    color: 'rgba(0,0,0,0.7)',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
  selectedText: {
    fontWeight: '700',
  },
});
