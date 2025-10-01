import { useCallback, useEffect, useMemo, useState } from 'react';

export type Benefit = {
  /**
   * Unique identifier for the benefit. Used for routing and lookups.
   */
  id: string;

  /**
   * Human-readable benefit name to show in lists and headers.
   */
  title: string;

  /**
   * Promotional discount label (e.g., "10% OFF", "$5 OFF").
   */
  discount: string;

  /**
   * Category label to group and filter benefits (e.g., "Comida").
   */
  category: string;

  /**
   * Square image or logo for list items and compact UI.
   */
  imageSquare: any;

  /**
   * Large hero image for detail screens and headers.
   */
  imageHero: any;

  /**
   * Description of the benefit terms and how to redeem.
   */
  description: string;

  /**
   * Weekday abbreviations on which the benefit is valid (e.g., ["Lun", "Mar"]).
   */
  validDays: string[];

  /**
   * ISO-8601 expiration date for the benefit validity window.
   */
  expiresAt: string;
};

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
    const validDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].slice(0, daysCount);

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
  // Simulate latency and a small chance of failure
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  await delay(600);
  return generateBenefits(140);
}

export function useBenefits() {
  const [data, setData] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

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
    if (!selectedCategory) return data;
    return data.filter((b) => b.category === selectedCategory);
  }, [data, selectedCategory]);

  return {
    data,
    filtered,
    categories: [...CATEGORIES] as unknown as string[],
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
    refetch: load,
  };
}


