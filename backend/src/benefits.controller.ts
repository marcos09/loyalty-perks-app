import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { BenefitsFiltersDto, BenefitsResponseDto, CategoriesResponseDto } from './dto/benefit.dto';

@Controller('api/benefits')
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  @Get()
  async getBenefits(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('days') days?: string,
    @Query('onlyActive') onlyActive?: boolean,
    @Query('minDiscountPercent') minDiscountPercent?: number,
    @Query('sortBy') sortBy?: 'relevance' | 'expiresAsc' | 'expiresDesc' | 'discountDesc' | 'titleAsc',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
  ): Promise<BenefitsResponseDto> {
    const filters: BenefitsFiltersDto = {
      category,
      search,
      days: days ? days.split(',') : [],
      onlyActive,
      minDiscountPercent,
      sortBy,
      page,
      limit,
    };

    return this.benefitsService.getBenefits(filters);
  }

  @Get('categories')
  async getCategories(): Promise<CategoriesResponseDto> {
    return this.benefitsService.getCategories();
  }

  @Get(':id')
  async getBenefitById(@Param('id') id: string) {
    return this.benefitsService.getBenefitById(id);
  }
}
