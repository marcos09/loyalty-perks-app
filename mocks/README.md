# MSW (Mock Service Worker) Setup

This directory contains the MSW configuration for mocking API endpoints in the loyalty-perks app.

## Files

- `handlers.ts` - Contains all the mock API handlers
- `setup.ts` - MSW server setup and configuration
- `server.ts` - Node.js server setup (for testing)
- `browser.ts` - Browser worker setup (for web)
- `index.ts` - Exports all mock functionality

## API Endpoints

The following endpoints are mocked:

- `GET /api/benefits` - Returns all benefits
- `GET /api/benefits/:id` - Returns a specific benefit by ID
- `GET /api/benefits/categories` - Returns all available categories

## Usage

MSW is automatically initialized in development mode when the app starts. The mock server will:

1. Start automatically in `__DEV__` mode
2. Intercept API calls to `http://localhost:3000/api/*`
3. Return mock data with the same structure as the original `generateBenefits` function
4. Include a 600ms delay to simulate network latency

## Configuration

The API base URL is configured in `config/api.ts`:
- Development: `http://localhost:3000`
- Production: `https://api.your-production-domain.com`

## Testing

The app includes automatic API testing in development mode. Check the console for test results when the app starts.

## Adding New Endpoints

To add new mock endpoints:

1. Add the handler to `handlers.ts`
2. Add the endpoint URL to `config/api.ts`
3. Update the API calls in your hooks/components

## Disabling MSW

To disable MSW, simply remove or comment out the `startMsw()` call in `app/_layout.tsx`.
