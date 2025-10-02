import { Container } from '@/components/layout/container';
import { ThemedText } from '@/components/themed-text';
import { styles } from './styles';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

export function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <Container gap={12} padding="medium">
      <ThemedText type="defaultSemiBold" style={styles.title}>
        {title}
      </ThemedText>
      <Container direction="row" gap={8} wrap>
        {children}
      </Container>
    </Container>
  );
}

