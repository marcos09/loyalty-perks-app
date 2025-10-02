import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BenefitDto, BenefitsFiltersDto, CategoriesResponseDto } from './dto/benefit.dto';

@Injectable()
export class BenefitsService {
  private readonly CATEGORIES = [
    'Comida',
    'Café',
    'Transporte',
    'Entretenimiento',
    'Shopping',
    'Supermercado',
    'Salud',
    'Fitness',
    'Tecnología',
    'Viajes',
  ] as const;

  private readonly CATEGORY_BRANDS: Record<string, { name: string; domain: string }[]> = {
    Comida: [
      { name: 'McDonald\'s', domain: 'mcdonalds.com' },
      { name: 'Burger King', domain: 'bk.com' },
      { name: 'KFC', domain: 'kfc.com' },
      { name: 'Subway', domain: 'subway.com' },
      { name: 'Domino\'s', domain: 'dominos.com' },
    ],
    Café: [
      { name: 'Starbucks', domain: 'starbucks.com' },
      { name: 'Costa Coffee', domain: 'costacoffee.com' },
      { name: 'Dunkin\' Donuts', domain: 'dunkindonuts.com' },
      { name: 'Blue Bottle', domain: 'bluebottlecoffee.com' },
    ],
    Transporte: [
      { name: 'Uber', domain: 'uber.com' },
      { name: 'Cabify', domain: 'cabify.com' },
      { name: 'Lyft', domain: 'lyft.com' },
      { name: 'Didi', domain: 'didiglobal.com' },
    ],
    Entretenimiento: [
      { name: 'Netflix', domain: 'netflix.com' },
      { name: 'Disney+', domain: 'disneyplus.com' },
      { name: 'Spotify', domain: 'spotify.com' },
      { name: 'HBO Max', domain: 'hbomax.com' },
    ],
    Shopping: [
      { name: 'Zara', domain: 'zara.com' },
      { name: 'H&M', domain: 'hm.com' },
      { name: 'Nike', domain: 'nike.com' },
      { name: 'Adidas', domain: 'adidas.com' },
    ],
    Supermercado: [
      { name: 'Carrefour', domain: 'carrefour.com' },
      { name: 'Walmart', domain: 'walmart.com' },
      { name: 'Auchan', domain: 'auchan.com' },
      { name: 'Tesco', domain: 'tesco.com' },
    ],
    Salud: [
      { name: 'Pfizer', domain: 'pfizer.com' },
      { name: 'Farmacity', domain: 'farmacity.com' },
      { name: 'Johnson & Johnson', domain: 'jnj.com' },
    ],
    Fitness: [
      { name: 'Anytime Fitness', domain: 'anytimefitness.com' },
      { name: 'Smart Fit', domain: 'smartfit.com' },
      { name: 'Basic-Fit', domain: 'basic-fit.com' },
      { name: 'Peloton', domain: 'onepeloton.com' },
    ],
    Tecnología: [
      { name: 'Apple', domain: 'apple.com' },
      { name: 'Samsung', domain: 'samsung.com' },
      { name: 'Dell', domain: 'dell.com' },
      { name: 'Lenovo', domain: 'lenovo.com' },
    ],
    Viajes: [
      { name: 'Booking.com', domain: 'booking.com' },
      { name: 'Airbnb', domain: 'airbnb.com' },
      { name: 'Expedia', domain: 'expedia.com' },
      { name: 'LATAM', domain: 'latam.com' },
    ],
  };

  private clearbitLogo(domain: string, size: number) {
    return { uri: `https://logo.clearbit.com/${domain}?size=${size}` };
  }

  private randomFrom<T>(arr: T[], indexSeed: number) {
    return arr[indexSeed % arr.length];
  }

  private parsePercentDiscount(discount: string): number | null {
    const match = discount.match(/(\d+)\s?%/);
    if (!match) return null;
    return Number(match[1]);
  }

  private normalizeDayName(day: string): string {
    const DAY_MAPPING: Record<string, string> = {
      'Mon': 'Mon',
      'Tue': 'Tue', 
      'Wed': 'Wed',
      'Thu': 'Thu',
      'Fri': 'Fri',
      'Sat': 'Sat',
      'Sun': 'Sun',
      'Lun': 'Mon',
      'Mar': 'Tue',
      'Mié': 'Wed',
      'Jue': 'Thu',
      'Vie': 'Fri',
      'Sáb': 'Sat',
      'Dom': 'Sun',
    };
    return DAY_MAPPING[day] || day;
  }

  private compareBySort(a: BenefitDto, b: BenefitDto, sortBy: string, query: string): number {
    switch (sortBy) {
      case 'titleAsc':
        return a.title.localeCompare(b.title);
      case 'expiresAsc': {
        return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
      }
      case 'expiresDesc': {
        return new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime();
      }
      case 'discountDesc': {
        const ad = this.parsePercentDiscount(a.discount) ?? -1;
        const bd = this.parsePercentDiscount(b.discount) ?? -1;
        return bd - ad;
      }
      case 'relevance':
      default: {
        const q = query.trim().toLowerCase();
        if (!q) return 0;
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        const aStarts = aTitle.startsWith(q) ? 1 : 0;
        const bStarts = bTitle.startsWith(q) ? 1 : 0;
        if (aStarts !== bStarts) return bStarts - aStarts;
        const aIncl = aTitle.includes(q) ? 1 : 0;
        const bIncl = bTitle.includes(q) ? 1 : 0;
        if (aIncl !== bIncl) return bIncl - aIncl;
        const aCat = a.category.toLowerCase().includes(q) ? 1 : 0;
        const bCat = b.category.toLowerCase().includes(q) ? 1 : 0;
        if (aCat !== bCat) return bCat - aCat;
        return 0;
      }
    }
  }

  private generateBenefits(count = 140): BenefitDto[] {
    const arr: BenefitDto[] = [];
    const discountLabels = [
      '10% OFF',
      '15% OFF',
      '20% OFF',
      '25% OFF',
      '30% OFF',
      '$5 OFF',
      '$10 OFF',
      '2x1',
      'Envío gratis',
    ];
    const titlePatterns = [
      '{brand}: {discount} en {category}',
      '{brand}: {discount} para socios',
      '{discount} en {brand}',
      '{brand}: {discount} hoy',
    ];
    const descriptionSnippets = [
      'Válido presentando tu código en caja.',
      'No acumulable con otras promociones.',
      'Aplicable en tiendas seleccionadas y online.',
      'Sujeto a disponibilidad del local.',
      'Un uso por usuario por día.',
    ];

    let globalIndex = 0;
    for (let i = 0; i < count; i++) {
      const category = (this.CATEGORIES[i % this.CATEGORIES.length] as unknown) as string;
      const brands = this.CATEGORY_BRANDS[category] ?? [{ name: category, domain: 'example.com' }];
      const brand = brands[i % brands.length];

      const discount = this.randomFrom(discountLabels, i + 3);
      const titleTemplate = this.randomFrom(titlePatterns, i + 7);
      const title = titleTemplate
        .replace('{brand}', brand.name)
        .replace('{discount}', discount)
        .replace('{category}', category);

      const expires = new Date();
      expires.setDate(expires.getDate() + 7 + ((i * 3) % 45));

      const daysCount = 3 + ((i + 1) % 4);
      const allDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
      const shuffledDays = [...allDays].sort(() => Math.random() - 0.5);
      const validDays = shuffledDays.slice(0, daysCount);

      const desc = [
        `${brand.name} te ofrece ${discount.toLowerCase()} en ${category.toLowerCase()}.`,
        this.randomFrom(descriptionSnippets, i + 11),
        this.randomFrom(descriptionSnippets, i + 17),
      ].join(' ');

      globalIndex += 1;
      arr.push({
        id: String(globalIndex),
        title,
        discount,
        category,
        imageSquare: this.clearbitLogo(brand.domain, 128),
        imageHero: this.clearbitLogo(brand.domain, 800),
        description: desc,
        validDays,
        expiresAt: expires.toISOString(),
      });
    }
    return arr;
  }

  async getBenefits(filters: BenefitsFiltersDto = {}): Promise<{ data: BenefitDto[]; total: number; page: number; limit: number; success: boolean }> {
    const {
      category,
      search,
      days = [],
      onlyActive = false,
      minDiscountPercent,
      sortBy = 'relevance',
      page = 1,
      limit = 20,
    } = filters;

    if (category === 'Tecnología') {
      throw new InternalServerErrorException('API Error: Failed to fetch benefits for Tecnología category. Please try again later.');
    }

    const allBenefits = this.generateBenefits(140);
    
    const now = Date.now();
    const query = search?.trim().toLowerCase() || '';

    let filtered = allBenefits.filter((b) => {
      if (category && b.category !== category) return false;
      if (onlyActive && new Date(b.expiresAt).getTime() < now) return false;
      if (days.length > 0) {
        const hasDay = days.some((selectedDay) => 
          b.validDays.some((validDay) => 
            this.normalizeDayName(selectedDay) === this.normalizeDayName(validDay)
          )
        );
        if (!hasDay) return false;
      }
      if (minDiscountPercent !== undefined && minDiscountPercent !== null) {
        const percent = this.parsePercentDiscount(b.discount);
        if (percent === null || percent < minDiscountPercent) return false;
      }

      if (!query) return true;

      const hay = `${b.title}\n${b.category}\n${b.description}`.toLowerCase();
      return hay.includes(query);
    });

    if (sortBy === 'relevance' && !query) {
    } else {
      filtered = [...filtered].sort((a, b) => this.compareBySort(a, b, sortBy, query));
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filtered.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total: filtered.length,
      page,
      limit,
      success: true,
    };
  }

  async getBenefitById(id: string): Promise<{ data: BenefitDto; success: boolean } | { error: string; success: boolean }> {
    const benefits = this.generateBenefits(140);
    const benefit = benefits.find(b => b.id === id);
    
    if (!benefit) {
      return { error: 'Benefit not found', success: false };
    }

    return { data: benefit, success: true };
  }

  async getCategories(): Promise<CategoriesResponseDto> {
    return {
      data: [...this.CATEGORIES],
      success: true,
    };
  }
}
