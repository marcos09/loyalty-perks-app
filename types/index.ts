export interface Benefit {
  id: string;
  title: string;
  discount: string;
  category: string;
  imageSquare: any;
  imageHero: any;
  description: string;
  validDays: string[];
  expiresAt: string;
}

export type SortBy =
  | 'relevance'
  | 'expiresAsc'
  | 'expiresDesc'
  | 'discountDesc'
  | 'titleAsc';

export type Category = string;

export interface BaseApiResponse {
  success: boolean;
}

export interface BenefitsResponse extends BaseApiResponse {
  data: Benefit[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoriesResponse extends BaseApiResponse {
  data: Category[];
}

export interface BenefitResponse extends BaseApiResponse {
  data: Benefit;
}

export interface ErrorResponse extends BaseApiResponse {
  error: string;
}

export interface BenefitsFilters {
  category?: string;
  search?: string;
  days?: string[];
  onlyActive?: boolean;
  minDiscountPercent?: number;
  sortBy?: SortBy;
  page?: number;
  limit?: number;
}

export interface FilterState {
  selectedCategory?: string;
  selectedDays: string[];
  onlyActive: boolean;
  minDiscountPercent?: number;
  sortBy: SortBy;
  searchQuery: string;
}

export interface FilterContextType {
  appliedFilters: FilterState;
  draftFilters: FilterState;
  setDraftCategory: (category: string | undefined) => void;
  setDraftSearchQuery: (query: string) => void;
  setDraftDays: (days: string[]) => void;
  setDraftOnlyActive: (active: boolean) => void;
  setDraftMinDiscountPercent: (percent: number | undefined) => void;
  setDraftSortBy: (sort: SortBy) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  resetDraftToApplied: () => void;
  setAppliedFiltersDirect: (updater: (prev: FilterState) => FilterState) => void;
  setScrollToTop: (scrollToTop: (() => void) | null) => void;
}

export interface BenefitsListProps {
  onClearFilters: () => void;
}

export interface BenefitsListRef {
  scrollToTop: () => void;
}

export interface BenefitsContentProps {
  onFiltersPress: () => void;
}

export interface BenefitsContentRef {
  scrollToTop: () => void;
}

export interface BenefitCardProps {
  benefit: Benefit;
}

export interface FilterHeaderProps {
  onFiltersPress: () => void;
}

export interface FiltersContainerProps {
  children: (onFiltersPress: () => void) => React.ReactNode;
}

export interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface FiltersSidebarProps {
  onClose: () => void;
}

export interface FilterChipProps {
  label: string;
  onClear: () => void;
  type: 'search' | 'category' | 'days' | 'active' | 'discount' | 'sort';
}

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
}

export interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

export interface EmptyStateProps {
  onClearFilters: () => void;
}

export interface BenefitDetailHeaderProps {
  benefit: Benefit;
}

export interface BenefitDetailSectionsProps {
  benefit: Benefit;
}

export interface FilterLogicProps {
  children: React.ReactNode;
}

export interface FiltersStateProps {
  children: React.ReactNode;
}

export interface ThemedViewProps extends React.ComponentProps<typeof import('react-native').View> {
  lightColor?: string;
  darkColor?: string;
}

export interface ThemedTextProps extends React.ComponentProps<typeof import('react-native').Text> {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
}

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: any;
}

export interface SkeletonTextProps extends Omit<SkeletonProps, 'height'> {
  lines?: number;
  lineHeight?: number;
}

export interface UseBenefitsReturn {
  data: Benefit[];
  filtered: Benefit[];
  categories: Category[];
  loadMore: () => Promise<void>;
  loadingMore: boolean;
  hasMore: boolean;
  total: number;
  loading: boolean;
  error: unknown;
  refetch: () => void;
}

export interface UseBenefitReturn {
  data: Benefit | undefined;
  loading: boolean;
  error: unknown;
  refetch: () => void;
}

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

export type BenefitsQueryKey = ['benefits', Partial<FilterState>];

export type CategoriesQueryKey = ['categories'];

export type BenefitQueryKey = ['benefit', string | undefined];

export type InfiniteBenefitsQueryKey = [...BenefitsQueryKey, 'infinite'];

export const VALID_DAYS = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
] as const;

export const CATEGORIES = [
  'Café',
  'Comida',
  'Transporte',
  'Entretenimiento',
  'Shopping',
  'Supermercado',
  'Salud',
  'Fitness',
  'Tecnología',
  'Viajes'
] as const;

export const SORT_OPTIONS: Array<{ value: SortBy; label: string }> = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'expiresAsc', label: 'Expira pronto' },
  { value: 'expiresDesc', label: 'Expira más tarde' },
  { value: 'discountDesc', label: 'Mayor descuento' },
  { value: 'titleAsc', label: 'A-Z' }
] as const;

export function isBenefit(value: any): value is Benefit {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.discount === 'string' &&
    typeof value.category === 'string' &&
    typeof value.description === 'string' &&
    Array.isArray(value.validDays) &&
    typeof value.expiresAt === 'string'
  );
}

export function isSortBy(value: any): value is SortBy {
  return [
    'relevance',
    'expiresAsc',
    'expiresDesc',
    'discountDesc',
    'titleAsc'
  ].includes(value);
}

export function isCategory(value: any): value is Category {
  return typeof value === 'string' && value.length > 0;
}

export type * from './api';

export type * from './components';

export type {
    Benefit as BenefitType, BenefitsResponse as BenefitsResponseType,
    CategoriesResponse as CategoriesResponseType, Category as CategoryType,
    FilterState as FilterStateType, SortBy as SortByType
};
