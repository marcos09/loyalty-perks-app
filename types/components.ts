// ============================================================================
// COMPONENT TYPES
// ============================================================================

import type { ReactNode } from 'react';
import type { TextProps, ViewProps } from 'react-native';
import type { Benefit } from './index';

// ============================================================================
// LAYOUT COMPONENT TYPES
// ============================================================================

/**
 * Themed view component props
 */
export interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}

/**
 * Themed text component props
 */
export interface ThemedTextProps extends TextProps {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
}

/**
 * Screen header component props
 */
export interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
}

// ============================================================================
// BENEFIT COMPONENT TYPES
// ============================================================================

/**
 * Benefit card component props
 */
export interface BenefitCardProps {
  benefit: Benefit;
}

/**
 * Benefit detail header component props
 */
export interface BenefitDetailHeaderProps {
  benefit: Benefit;
}

/**
 * Benefit detail sections component props
 */
export interface BenefitDetailSectionsProps {
  benefit: Benefit;
}

/**
 * Benefits list component props
 */
export interface BenefitsListProps {
  onClearFilters: () => void;
}

/**
 * Benefits list ref for scroll control
 */
export interface BenefitsListRef {
  scrollToTop: () => void;
}

/**
 * Benefits content component props
 */
export interface BenefitsContentProps {
  onFiltersPress: () => void;
}

/**
 * Benefits content ref for scroll control
 */
export interface BenefitsContentRef {
  scrollToTop: () => void;
}

// ============================================================================
// FILTER COMPONENT TYPES
// ============================================================================

/**
 * Filter header component props
 */
export interface FilterHeaderProps {
  onFiltersPress: () => void;
}

/**
 * Filters container component props
 */
export interface FiltersContainerProps {
  children: (onFiltersPress: () => void) => ReactNode;
}

/**
 * Filters modal component props
 */
export interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Filters sidebar component props
 */
export interface FiltersSidebarProps {
  onClose: () => void;
}

/**
 * Filter chip component props
 */
export interface FilterChipProps {
  label: string;
  onClear: () => void;
  type: 'search' | 'category' | 'days' | 'active' | 'discount' | 'sort';
}

/**
 * Filter logic component props
 */
export interface FilterLogicProps {
  children: ReactNode;
}

/**
 * Filters state component props
 */
export interface FiltersStateProps {
  children: ReactNode;
}

/**
 * Search bar component props
 */
export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

// ============================================================================
// STATE COMPONENT TYPES
// ============================================================================

/**
 * Error state component props
 */
export interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

/**
 * Empty state component props
 */
export interface EmptyStateProps {
  onClearFilters: () => void;
}

/**
 * Loading skeleton component props
 */
export interface LoadingSkeletonProps {
  count?: number;
}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

/**
 * Skeleton component props
 */
export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: any; // TODO: Replace with proper style type
}

/**
 * Skeleton text component props
 */
export interface SkeletonTextProps extends Omit<SkeletonProps, 'height'> {
  lines?: number;
  lineHeight?: number;
}

// ============================================================================
// FORM COMPONENT TYPES
// ============================================================================

/**
 * Base form field props
 */
export interface BaseFormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Text input field props
 */
export interface TextInputFieldProps extends BaseFormFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

/**
 * Select field props
 */
export interface SelectFieldProps<T = any> extends BaseFormFieldProps {
  value: T;
  onValueChange: (value: T) => void;
  options: Array<{ label: string; value: T }>;
  placeholder?: string;
}

/**
 * Checkbox field props
 */
export interface CheckboxFieldProps extends BaseFormFieldProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}

/**
 * Switch field props
 */
export interface SwitchFieldProps extends BaseFormFieldProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
}

// ============================================================================
// MODAL COMPONENT TYPES
// ============================================================================

/**
 * Base modal props
 */
export interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/**
 * Confirmation modal props
 */
export interface ConfirmationModalProps extends BaseModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  destructive?: boolean;
}

// ============================================================================
// NAVIGATION COMPONENT TYPES
// ============================================================================

/**
 * Tab bar item props
 */
export interface TabBarItemProps {
  label: string;
  icon?: string;
  active?: boolean;
  onPress: () => void;
  badge?: number | string;
}

/**
 * Navigation button props
 */
export interface NavigationButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

// ============================================================================
// UTILITY COMPONENT TYPES
// ============================================================================

/**
 * Divider component props
 */
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  margin?: number;
}

/**
 * Spacer component props
 */
export interface SpacerProps {
  size?: number;
  horizontal?: boolean;
}

/**
 * Badge component props
 */
export interface BadgeProps {
  text: string | number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
}

/**
 * Avatar component props
 */
export interface AvatarProps {
  source?: { uri: string } | number;
  size?: number;
  fallback?: string;
  borderColor?: string;
  borderWidth?: number;
}
