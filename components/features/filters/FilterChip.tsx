import { Chip } from '@/components/ui/chip';
import { ViewStyle } from 'react-native';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
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
