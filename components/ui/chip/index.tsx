import { ThemedText } from '@/components/themed-text';
import { Pressable, type PressableProps } from 'react-native';
import { styles } from './styles';

export interface ChipProps extends Omit<PressableProps, 'style'> {
  label: string;
  selected?: boolean;
  variant?: 'default' | 'filter' | 'status';
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  style?: PressableProps['style'];
}

export function Chip({
  label,
  selected = false,
  variant = 'default',
  size = 'medium',
  onPress,
  style,
  ...props
}: ChipProps) {
  return (
    <Pressable
      style={[
        styles.base,
        styles[variant],
        styles[size],
        selected && styles.selected,
        style,
      ]}
      onPress={onPress}
      {...props}
    >
      <ThemedText
        style={[
          styles.text,
          styles[`${variant}Text`],
          styles[`${size}Text`],
          selected && styles.selectedText,
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

