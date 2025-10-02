# Types Directory

This directory contains all TypeScript type definitions for the loyalty-perks application. The types are organized into logical modules for better maintainability and reusability.

## File Structure

```
types/
├── index.ts          # Main types file with core domain types
├── api.ts            # API-specific types and DTOs
├── components.ts     # Component prop types and interfaces
├── tsconfig.json     # TypeScript configuration for types
└── README.md         # This documentation file
```

## Core Types (`index.ts`)

### Domain Types
- **`Benefit`**: Core benefit entity representing a loyalty perk
- **`SortBy`**: Available sorting options for benefits
- **`Category`**: Available categories for benefits

### API Response Types
- **`BenefitsResponse`**: API response for benefits list
- **`CategoriesResponse`**: API response for categories
- **`BenefitResponse`**: API response for single benefit
- **`ErrorResponse`**: API error response

### Filter Types
- **`FilterState`**: Application filter state
- **`FilterContextType`**: Filter context interface
- **`BenefitsFilters`**: API filters for benefits query

### Hook Return Types
- **`UseBenefitsReturn`**: Benefits hook return type
- **`UseBenefitReturn`**: Single benefit hook return type

### Utility Types
- **`Partial<T>`**: Make all properties optional
- **`Required<T>`**: Make all properties required
- **`Pick<T, K>`**: Pick specific properties
- **`Omit<T, K>`**: Omit specific properties
- **`Readonly<T>`**: Make all properties readonly

### Type Guards
- **`isBenefit(value)`**: Check if value is a valid Benefit
- **`isSortBy(value)`**: Check if value is a valid SortBy
- **`isCategory(value)`**: Check if value is a valid Category

### Constants
- **`VALID_DAYS`**: Available days of the week
- **`CATEGORIES`**: Available categories
- **`SORT_OPTIONS`**: Available sort options with labels

## API Types (`api.ts`)

### DTOs (Data Transfer Objects)
- **`BenefitDto`**: Backend DTO for benefit data
- **`BenefitsResponseDto`**: Backend DTO for benefits response
- **`CategoriesResponseDto`**: Backend DTO for categories response
- **`BenefitsFiltersDto`**: Backend DTO for filters
- **`ErrorResponseDto`**: Backend DTO for error response

### API Configuration
- **`ApiEndpoints`**: API endpoint configuration
- **`ApiConfig`**: API configuration
- **`ApiRequestConfig`**: API request configuration
- **`ApiResponse<T>`**: API response wrapper
- **`ApiError`**: API error type

### React Query Types
- **`ApiQueryKeys`**: Query key factory for API endpoints
- **`ApiQueryOptions`**: Query options for API calls

### Type Guards
- **`isApiSuccess<T>(response)`**: Check if API response is successful
- **`isApiError(response)`**: Check if API response is an error
- **`isBenefitDto(value)`**: Check if value is a valid BenefitDto
- **`isBenefitsResponseDto(value)`**: Check if value is a valid BenefitsResponseDto
- **`isCategoriesResponseDto(value)`**: Check if value is a valid CategoriesResponseDto

## Component Types (`components.ts`)

### Layout Components
- **`ThemedViewProps`**: Themed view component props
- **`ThemedTextProps`**: Themed text component props
- **`ScreenHeaderProps`**: Screen header component props

### Benefit Components
- **`BenefitCardProps`**: Benefit card component props
- **`BenefitDetailHeaderProps`**: Benefit detail header props
- **`BenefitDetailSectionsProps`**: Benefit detail sections props
- **`BenefitsListProps`**: Benefits list component props
- **`BenefitsListRef`**: Benefits list ref for scroll control
- **`BenefitsContentProps`**: Benefits content component props
- **`BenefitsContentRef`**: Benefits content ref for scroll control

### Filter Components
- **`FilterHeaderProps`**: Filter header component props
- **`FiltersContainerProps`**: Filters container component props
- **`FiltersModalProps`**: Filters modal component props
- **`FiltersSidebarProps`**: Filters sidebar component props
- **`FilterChipProps`**: Filter chip component props
- **`FilterLogicProps`**: Filter logic component props
- **`FiltersStateProps`**: Filters state component props
- **`SearchBarProps`**: Search bar component props

### State Components
- **`ErrorStateProps`**: Error state component props
- **`EmptyStateProps`**: Empty state component props
- **`LoadingSkeletonProps`**: Loading skeleton component props

### UI Components
- **`SkeletonProps`**: Skeleton component props
- **`SkeletonTextProps`**: Skeleton text component props

### Form Components
- **`BaseFormFieldProps`**: Base form field props
- **`TextInputFieldProps`**: Text input field props
- **`SelectFieldProps<T>`**: Select field props
- **`CheckboxFieldProps`**: Checkbox field props
- **`SwitchFieldProps`**: Switch field props

### Modal Components
- **`BaseModalProps`**: Base modal props
- **`ConfirmationModalProps`**: Confirmation modal props

### Navigation Components
- **`TabBarItemProps`**: Tab bar item props
- **`NavigationButtonProps`**: Navigation button props

### Utility Components
- **`DividerProps`**: Divider component props
- **`SpacerProps`**: Spacer component props
- **`BadgeProps`**: Badge component props
- **`AvatarProps`**: Avatar component props

## Usage Examples

### Importing Types

```typescript
// Import specific types
import type { Benefit, FilterState, BenefitsListProps } from '@/types';

// Import from specific modules
import type { BenefitDto, ApiQueryKeys } from '@/types/api';
import type { ThemedViewProps, ErrorStateProps } from '@/types/components';

// Import multiple types
import type { 
  Benefit, 
  SortBy, 
  Category, 
  FilterState,
  BenefitsResponse,
  UseBenefitsReturn 
} from '@/types';
```

### Using Type Guards

```typescript
import { isBenefit, isApiSuccess } from '@/types';

// Type guard usage
if (isBenefit(data)) {
  // data is now typed as Benefit
  console.log(data.title);
}

if (isApiSuccess<Benefit[]>(response)) {
  // response is now typed as { data: Benefit[]; success: true }
  console.log(response.data);
}
```

### Using Constants

```typescript
import { VALID_DAYS, CATEGORIES, SORT_OPTIONS } from '@/types';

// Use constants
const days = VALID_DAYS; // ['Monday', 'Tuesday', ...]
const categories = CATEGORIES; // ['Café', 'Comida', ...]
const sortOptions = SORT_OPTIONS; // [{ value: 'relevance', label: 'Relevancia' }, ...]
```

## TypeScript Configuration

The `tsconfig.json` file in this directory provides strict TypeScript configuration for type checking:

- **`strict: true`**: Enable all strict type checking options
- **`noImplicitAny: true`**: Disallow implicit any types
- **`strictNullChecks: true`**: Enable strict null checks
- **`strictFunctionTypes: true`**: Enable strict function type checking
- **`noImplicitReturns: true`**: Disallow implicit returns
- **`noFallthroughCasesInSwitch: true`**: Disallow fallthrough cases in switch statements
- **`noUncheckedIndexedAccess: true`**: Add undefined to index signature results
- **`exactOptionalPropertyTypes: true`**: Enable exact optional property types

## Best Practices

1. **Use Type Guards**: Always use type guards when dealing with unknown data from APIs
2. **Prefer Interfaces**: Use interfaces for object shapes that might be extended
3. **Use Type Aliases**: Use type aliases for unions, primitives, and computed types
4. **Export Types**: Always export types that might be used in other modules
5. **Document Complex Types**: Add JSDoc comments for complex types
6. **Use Generic Types**: Use generic types for reusable components and functions
7. **Avoid `any`**: Avoid using `any` type; use `unknown` instead when necessary
8. **Use Utility Types**: Leverage built-in utility types like `Partial`, `Pick`, `Omit`
9. **Type Function Parameters**: Always type function parameters and return types
10. **Use Const Assertions**: Use `as const` for immutable data structures

## Contributing

When adding new types:

1. Determine the appropriate file (`index.ts`, `api.ts`, or `components.ts`)
2. Follow the existing naming conventions
3. Add JSDoc comments for complex types
4. Export the type from the appropriate file
5. Update this README if adding new categories of types
6. Add type guards for complex types when appropriate
7. Test the types with strict TypeScript configuration
