// ============================================================================
// CORE DOMAIN TYPES
// ============================================================================

/**
 * Core benefit entity representing a loyalty perk
 */
export interface Benefit {
  id: string;
  title: string;
  discount: string;
  category: string;
  imageSquare: any; // TODO: Replace with proper image type
  imageHero: any; // TODO: Replace with proper image type
  description: string;
  validDays: string[];
  expiresAt: string;
}

/**
 * Available sorting options for benefits
 */
export type SortBy =
  | 'relevance'
  | 'expiresAsc'
  | 'expiresDesc'
  | 'discountDesc'
  | 'titleAsc';

/**
 * Available categories for benefits
 */
export type Category = string;

// ============================================================================
// API TYPES
// ============================================================================

/**
 * Base API response structure
 */
export interface BaseApiResponse {
  success: boolean;
}

/**
 * Benefits API response
 */
export interface BenefitsResponse extends BaseApiResponse {
  data: Benefit[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Categories API response
 */
export interface CategoriesResponse extends BaseApiResponse {
  data: Category[];
}

/**
 * Single benefit API response
 */
export interface BenefitResponse extends BaseApiResponse {
  data: Benefit;
}

/**
 * Error API response
 */
export interface ErrorResponse extends BaseApiResponse {
  error: string;
}

/**
 * API filters for benefits query
 */
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

// ============================================================================
// FILTER STATE TYPES
// ============================================================================

/**
 * Filter state for the application
 */
export interface FilterState {
  selectedCategory?: string;
  selectedDays: string[];
  onlyActive: boolean;
  minDiscountPercent?: number;
  sortBy: SortBy;
  searchQuery: string;
}

/**
 * Filter context type
 */
export interface FilterContextType {
  // Applied filters (what's currently being used for API calls)
  appliedFilters: FilterState;
  // Draft filters (what user is currently selecting in the UI)
  draftFilters: FilterState;
  // Draft filter setters
  setDraftCategory: (category: string | undefined) => void;
  setDraftSearchQuery: (query: string) => void;
  setDraftDays: (days: string[]) => void;
  setDraftOnlyActive: (active: boolean) => void;
  setDraftMinDiscountPercent: (percent: number | undefined) => void;
  setDraftSortBy: (sort: SortBy) => void;
  // Filter actions
  applyFilters: () => void;
  clearFilters: () => void;
  resetDraftToApplied: () => void;
  setAppliedFiltersDirect: (updater: (prev: FilterState) => FilterState) => void;
  // Scroll to top function
  setScrollToTop: (scrollToTop: (() => void) | null) => void;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

/**
 * Benefits list component props
 */
export interface BenefitsListProps {
  onClearFilters: () => void;
}

/**
 * Benefits list ref for scroll control
 */
export interface BenefitsListRef {
  scrollToTop: () => void;
}

/**
 * Benefits content component props
 */
export interface BenefitsContentProps {
  onFiltersPress: () => void;
}

/**
 * Benefits content ref for scroll control
 */
export interface BenefitsContentRef {
  scrollToTop: () => void;
}

/**
 * Benefit card component props
 */
export interface BenefitCardProps {
  benefit: Benefit;
}

/**
 * Filter header component props
 */
export interface FilterHeaderProps {
  onFiltersPress: () => void;
}

/**
 * Filters container component props
 */
export interface FiltersContainerProps {
  children: (onFiltersPress: () => void) => React.ReactNode;
}

/**
 * Filters modal component props
 */
export interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Filters sidebar component props
 */
export interface FiltersSidebarProps {
  onClose: () => void;
}

/**
 * Filter chip component props
 */
export interface FilterChipProps {
  label: string;
  onClear: () => void;
  type: 'search' | 'category' | 'days' | 'active' | 'discount' | 'sort';
}

/**
 * Search bar component props
 */
export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

/**
 * Screen header component props
 */
export interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
}

/**
 * Error state component props
 */
export interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

/**
 * Empty state component props
 */
export interface EmptyStateProps {
  onClearFilters: () => void;
}

/**
 * Benefit detail header component props
 */
export interface BenefitDetailHeaderProps {
  benefit: Benefit;
}

/**
 * Benefit detail sections component props
 */
export interface BenefitDetailSectionsProps {
  benefit: Benefit;
}

/**
 * Filter logic component props
 */
export interface FilterLogicProps {
  children: React.ReactNode;
}

/**
 * Filters state component props
 */
export interface FiltersStateProps {
  children: React.ReactNode;
}

// ============================================================================
// THEME TYPES
// ============================================================================

/**
 * Themed view component props
 */
export interface ThemedViewProps extends React.ComponentProps<typeof import('react-native').View> {
  lightColor?: string;
  darkColor?: string;
}

/**
 * Themed text component props
 */
export interface ThemedTextProps extends React.ComponentProps<typeof import('react-native').Text> {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

/**
 * Skeleton component props
 */
export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: any; // TODO: Replace with proper style type
}

/**
 * Skeleton text component props
 */
export interface SkeletonTextProps extends Omit<SkeletonProps, 'height'> {
  lines?: number;
  lineHeight?: number;
}

// ============================================================================
// HOOK TYPES
// ============================================================================

/**
 * Benefits hook return type
 */
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

/**
 * Single benefit hook return type
 */
export interface UseBenefitReturn {
  data: Benefit | undefined;
  loading: boolean;
  error: unknown;
  refetch: () => void;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Make all properties optional
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Make all properties required
 */
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Pick specific properties from a type
 */
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/**
 * Omit specific properties from a type
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Make all properties readonly
 */
export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// ============================================================================
// REACT QUERY TYPES
// ============================================================================

/**
 * Query key for benefits
 */
export type BenefitsQueryKey = ['benefits', Partial<FilterState>];

/**
 * Query key for categories
 */
export type CategoriesQueryKey = ['categories'];

/**
 * Query key for single benefit
 */
export type BenefitQueryKey = ['benefit', string | undefined];

/**
 * Query key for infinite benefits
 */
export type InfiniteBenefitsQueryKey = [...BenefitsQueryKey, 'infinite'];

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Available days of the week
 */
export const VALID_DAYS = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
] as const;

/**
 * Available categories
 */
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

/**
 * Available sort options
 */
export const SORT_OPTIONS: Array<{ value: SortBy; label: string }> = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'expiresAsc', label: 'Expira pronto' },
  { value: 'expiresDesc', label: 'Expira más tarde' },
  { value: 'discountDesc', label: 'Mayor descuento' },
  { value: 'titleAsc', label: 'A-Z' }
] as const;

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a value is a valid Benefit
 */
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

/**
 * Type guard to check if a value is a valid SortBy
 */
export function isSortBy(value: any): value is SortBy {
  return [
    'relevance',
    'expiresAsc',
    'expiresDesc',
    'discountDesc',
    'titleAsc'
  ].includes(value);
}

/**
 * Type guard to check if a value is a valid Category
 */
export function isCategory(value: any): value is Category {
  return typeof value === 'string' && value.length > 0;
}

// ============================================================================
// RE-EXPORTS FROM OTHER TYPE FILES
// ============================================================================

// Re-export API types
export type * from './api';

// Re-export component types
export type * from './components';

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
    // Re-export commonly used types for convenience
    Benefit as BenefitType, BenefitsResponse as BenefitsResponseType,
    CategoriesResponse as CategoriesResponseType, Category as CategoryType,
    FilterState as FilterStateType, SortBy as SortByType
};

