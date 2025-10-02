import { Container } from '../layout/Container';
import { ThemedText } from '../themed-text';

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

const styles = {
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
};
