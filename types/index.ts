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

export interface ApiError {
  status: number;
  message: string;
  data?: any;
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