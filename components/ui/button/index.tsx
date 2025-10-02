import { ThemedText } from '@/components/themed-text';
import { Pressable, type PressableProps } from 'react-native';
import { styles } from './styles';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: PressableProps['style'];
}

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={[
        styles.base,
        styles[variant],
        styles[size],
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      {...props}
    >
      <ThemedText
        style={[
          styles.text,
          styles[`${variant}Text`],
          styles[`${size}Text`],
          isDisabled && styles.disabledText,
        ]}
      >
        {loading ? 'Loading...' : title}
      </ThemedText>
    </Pressable>
  );
}

