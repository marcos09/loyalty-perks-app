// Fallback mock service for React Native when MSW doesn't work
import { Benefit } from '../hooks/use-benefits';

// Simple mock data generator (reusing existing logic)
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

// Mock API responses
export const mockApiResponses = {
  benefits: () => ({
    data: generateBenefits(140),
    total: 140,
    success: true,
  }),
  
  benefitById: (id: string) => {
    const benefits = generateBenefits(140);
    const benefit = benefits.find(b => b.id === id);
    return benefit ? { data: benefit, success: true } : { error: 'Benefit not found', success: false };
  },
  
  categories: () => ({
    data: [...CATEGORIES],
    success: true,
  }),
};

// Simple fetch interceptor for fallback
let originalFetch: typeof fetch;

export function setupFallbackMock() {
  if (originalFetch) return; // Already set up
  
  originalFetch = global.fetch;
  
  global.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.toString();
    
    // Intercept API calls
    if (url.includes('/api/benefits')) {
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      await delay(600); // Simulate network delay
      
      if (url.includes('/api/benefits/categories')) {
        const response = mockApiResponses.categories();
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      if (url.match(/\/api\/benefits\/\d+$/)) {
        const id = url.split('/').pop() || '';
        const response = mockApiResponses.benefitById(id);
        return new Response(JSON.stringify(response), {
          status: response.success ? 200 : 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // Default to all benefits
      const response = mockApiResponses.benefits();
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // For non-API calls, use original fetch
    return originalFetch(input, init);
  };
  
  console.log('🚀 Fallback mock service started');
}

export function stopFallbackMock() {
  if (originalFetch) {
    global.fetch = originalFetch;
    originalFetch = null as any;
    console.log('🛑 Fallback mock service stopped');
  }
}
