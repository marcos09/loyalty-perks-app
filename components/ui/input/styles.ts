import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.8)',
  },
  required: {
    color: 'rgba(239, 68, 68, 0.8)',
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)',
    backgroundColor: 'transparent',
    fontSize: 16,
    color: 'rgba(0,0,0,0.8)',
  },
  inputError: {
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  helperText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
  },
  errorText: {
    color: 'rgba(239, 68, 68, 0.8)',
  },
});
