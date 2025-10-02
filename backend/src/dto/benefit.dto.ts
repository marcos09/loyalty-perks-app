export interface BenefitDto {
  id: string;
  title: string;
  discount: string;
  category: string;
  imageSquare: { uri: string };
  imageHero: { uri: string };
  description: string;
  validDays: string[];
  expiresAt: string;
}

export interface BenefitsResponseDto {
  data: BenefitDto[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
}

export interface CategoriesResponseDto {
  data: string[];
  success: boolean;
}

export interface BenefitsFiltersDto {
  category?: string;
  search?: string;
  days?: string[];
  onlyActive?: boolean;
  minDiscountPercent?: number;
  sortBy?: 'relevance' | 'expiresAsc' | 'expiresDesc' | 'discountDesc' | 'titleAsc';
  page?: number;
  limit?: number;
}
