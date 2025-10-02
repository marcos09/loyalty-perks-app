import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <ThemedText style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)',
    backgroundColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  chipText: {
    fontSize: 14,
  },
  chipTextSelected: {
    fontWeight: '700',
  },
});
