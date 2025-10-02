import { useTranslation } from 'react-i18next';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFiltersPress: () => void;
}

export function SearchBar({ searchQuery, onSearchChange, onFiltersPress }: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <Container direction="row" gap={8} padding="small">
      <Input
        placeholder={t('benefits.searchPlaceholder')}
        value={searchQuery}
        onChangeText={onSearchChange}
        style={{ flex: 1 }}
        returnKeyType="search"
      />
      <Button
        title={t('common.filters')}
        onPress={onFiltersPress}
        variant="secondary"
        size="medium"
      />
    </Container>
  );
}
