import { useCallback, useEffect, useMemo, useState } from 'react';

export type Benefit = {
  id: string;
  title: string;
  discount: string;
  category: string;
  imageSquare: any;
  imageHero: any;
  description: string;
  validDays: string[];
  expiresAt: string;
};

export type SortBy =
  | 'relevance'
  | 'expiresAsc'
  | 'expiresDesc'
  | 'discountDesc'
  | 'titleAsc';

const CATEGORIES = [
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

const CATEGORY_BRANDS: Record<string, { name: string; domain: string }[]> = {
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

function clearbitLogo(domain: string, size: number) {
  return { uri: `https://logo.clearbit.com/${domain}?size=${size}` } as const;
}

function randomFrom<T>(arr: T[], indexSeed: number) {
  return arr[indexSeed % arr.length];
}

function parsePercentDiscount(discount: string): number | null {
  const match = discount.match(/(\d+)\s?%/);
  if (!match) return null;
  return Number(match[1]);
}

function compareBySort(a: Benefit, b: Benefit, sortBy: SortBy, query: string): number {
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
      const ad = parsePercentDiscount(a.discount) ?? -1;
      const bd = parsePercentDiscount(b.discount) ?? -1;
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

function generateBenefits(count = 140): Benefit[] {
  const arr: Benefit[] = [];
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
    const category = (CATEGORIES[i % CATEGORIES.length] as unknown) as string;
    const brands = CATEGORY_BRANDS[category] ?? [{ name: category, domain: 'example.com' }];
    const brand = brands[i % brands.length];

    const discount = randomFrom(discountLabels, i + 3);
    const titleTemplate = randomFrom(titlePatterns, i + 7);
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
      randomFrom(descriptionSnippets, i + 11),
      randomFrom(descriptionSnippets, i + 17),
    ].join(' ');

    globalIndex += 1;
    arr.push({
      id: String(globalIndex),
      title,
      discount,
      category,
      imageSquare: clearbitLogo(brand.domain, 128),
      imageHero: clearbitLogo(brand.domain, 800),
      description: desc,
      validDays,
      expiresAt: expires.toISOString(),
    });
  }
  return arr;
}

async function fetchBenefits(): Promise<Benefit[]> {
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  await delay(600);
  return generateBenefits(140);
}

export function useBenefits() {
  const [data, setData] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [onlyActive, setOnlyActive] = useState(false);
  const [minDiscountPercent, setMinDiscountPercent] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<SortBy>('relevance');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBenefits();
      setData(res);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const query = searchQuery.trim().toLowerCase();

    const base = data.filter((b) => {
      if (selectedCategory && b.category !== selectedCategory) return false;
      if (onlyActive && new Date(b.expiresAt).getTime() < now) return false;
      if (selectedDays.length > 0) {
        const hasDay = selectedDays.some((d) => b.validDays.includes(d));
        if (!hasDay) return false;
      }
      if (minDiscountPercent !== undefined && minDiscountPercent !== null) {
        const percent = parsePercentDiscount(b.discount);
        if (percent === null || percent < minDiscountPercent) return false;
      }

      if (!query) return true;

      const hay = `${b.title}\n${b.category}\n${b.description}`.toLowerCase();
      return hay.includes(query);
    });

    if (sortBy === 'relevance' && !query) return base;

    return [...base].sort((a, b) => compareBySort(a, b, sortBy, query));
  }, [data, selectedCategory, searchQuery, selectedDays, onlyActive, minDiscountPercent, sortBy]);

  return {
    data,
    filtered,
    categories: [...CATEGORIES] as unknown as string[],
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedDays,
    setSelectedDays,
    onlyActive,
    setOnlyActive,
    minDiscountPercent,
    setMinDiscountPercent,
    sortBy,
    setSortBy,
    loading,
    error,
    refetch: load,
  };
}


