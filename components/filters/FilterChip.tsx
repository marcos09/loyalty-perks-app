import { PressableProps } from 'react-native';
import { Chip } from '../ui/chip';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: PressableProps['style'];
}

export function FilterChip({ label, selected, onPress, style }: FilterChipProps) {
  return (
    <Chip
      label={label}
      selected={selected}
      onPress={onPress}
      variant="filter"
      size="medium"
      style={style}
    />
  );
}
