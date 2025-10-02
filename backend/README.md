# Loyalty Perks Backend API

A simple NestJS backend API that serves loyalty benefits data for the mobile app.

## Features

- **GET /api/benefits** - Get all benefits with filtering, sorting, and pagination
- **GET /api/benefits/categories** - Get all available categories
- **GET /api/benefits/:id** - Get a specific benefit by ID

## Query Parameters for /api/benefits

- `category` - Filter by category (e.g., "Comida", "Café")
- `search` - Search in title, category, and description
- `days` - Filter by valid days (comma-separated, e.g., "Mon,Tue,Wed")
- `onlyActive` - Show only non-expired benefits (true/false)
- `minDiscountPercent` - Minimum discount percentage (number)
- `sortBy` - Sort by: "relevance", "expiresAsc", "expiresDesc", "discountDesc", "titleAsc"
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## Example Requests

```bash
# Get all benefits
curl http://localhost:3000/api/benefits

# Get benefits with filters
curl "http://localhost:3000/api/benefits?category=Comida&search=McDonald&page=1&limit=10"

# Get categories
curl http://localhost:3000/api/benefits/categories

# Get specific benefit
curl http://localhost:3000/api/benefits/1
```

## Response Format

All responses follow this format:
```json
{
  "data": [...],
  "total": 140,
  "page": 1,
  "limit": 20,
  "success": true
}
```

For single benefit requests:
```json
{
  "data": { ... },
  "success": true
}
```

## Mock Data

The API generates 140 mock benefits with:
- 10 different categories
- Various discount types (percentage, fixed amount, 2x1, free shipping)
- Random valid days for each benefit
- Expiration dates (7-52 days from generation)
- Brand logos from Clearbit API
