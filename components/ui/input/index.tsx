import { ThemedText } from '@/components/shared/themed-text';
import { TextInput, View, type TextInputProps } from 'react-native';
import { styles } from './styles';

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

