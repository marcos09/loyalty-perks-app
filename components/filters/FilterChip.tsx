import { Chip } from '../ui/Chip';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Chip
      label={label}
      selected={selected}
      onPress={onPress}
      variant="filter"
      size="medium"
    />
  );
}
