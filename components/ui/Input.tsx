import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { ThemedText } from '../themed-text';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  containerStyle?: View['props']['style'];
}

export function Input({
  label,
  error,
  helperText,
  required = false,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText style={styles.label}>
          {label}
          {required && <ThemedText style={styles.required}> *</ThemedText>}
        </ThemedText>
      )}
      
      <TextInput
        style={[
          styles.input,
          hasError && styles.inputError,
          style,
        ]}
        placeholderTextColor="rgba(127,127,127,0.6)"
        {...props}
      />
      
      {(error || helperText) && (
        <ThemedText style={[styles.helperText, hasError && styles.errorText]}>
          {error || helperText}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
