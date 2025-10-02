import { http, HttpResponse } from 'msw';
import { Benefit } from '../hooks/use-benefits';

// Mock data generation (reusing the existing logic)
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

// Mock API handlers
export const handlers = [
  // GET /api/benefits - Get all benefits
  http.get('/api/benefits', () => {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const benefits = generateBenefits(140);
        resolve(
          HttpResponse.json({
            data: benefits,
            total: benefits.length,
            success: true,
          })
        );
      }, 600); // Same delay as the original fetchBenefits function
    });
  }),

  // GET /api/benefits/:id - Get a specific benefit
  http.get('/api/benefits/:id', ({ params }) => {
    const { id } = params;
    const benefits = generateBenefits(140);
    const benefit = benefits.find(b => b.id === id);
    
    if (!benefit) {
      return HttpResponse.json(
        { error: 'Benefit not found', success: false },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      data: benefit,
      success: true,
    });
  }),

  // GET /api/benefits/categories - Get all categories
  http.get('/api/benefits/categories', () => {
    return HttpResponse.json({
      data: [...CATEGORIES],
      success: true,
    });
  }),
];
