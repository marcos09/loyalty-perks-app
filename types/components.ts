import type { ReactNode } from 'react';
import type { TextProps, ViewProps } from 'react-native';
import type { Benefit } from './index';

export interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}

export interface ThemedTextProps extends TextProps {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
}

export interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
}

export interface BenefitCardProps {
  benefit: Benefit;
}

export interface BenefitDetailHeaderProps {
  benefit: Benefit;
}

export interface BenefitDetailSectionsProps {
  benefit: Benefit;
}

export interface BenefitsListProps {
  onClearFilters: () => void;
}

export interface BenefitsListRef {
  scrollToTop: () => void;
}

export interface BenefitsContentProps {
  onFiltersPress: () => void;
}

export interface BenefitsContentRef {
  scrollToTop: () => void;
}

export interface FilterHeaderProps {
  onFiltersPress: () => void;
}

export interface FiltersContainerProps {
  children: (onFiltersPress: () => void) => ReactNode;
}

export interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface FiltersSidebarProps {
  onClose: () => void;
}

export interface FilterChipProps {
  label: string;
  onClear: () => void;
  type: 'search' | 'category' | 'days' | 'active' | 'discount' | 'sort';
}

export interface FilterLogicProps {
  children: ReactNode;
}

export interface FiltersStateProps {
  children: ReactNode;
}

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

export interface EmptyStateProps {
  onClearFilters: () => void;
}

export interface LoadingSkeletonProps {
  count?: number;
}

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: any;
}

export interface SkeletonTextProps extends Omit<SkeletonProps, 'height'> {
  lines?: number;
  lineHeight?: number;
}

export interface BaseFormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface TextInputFieldProps extends BaseFormFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export interface SelectFieldProps<T = any> extends BaseFormFieldProps {
  value: T;
  onValueChange: (value: T) => void;
  options: Array<{ label: string; value: T }>;
  placeholder?: string;
}

export interface CheckboxFieldProps extends BaseFormFieldProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}

export interface SwitchFieldProps extends BaseFormFieldProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
}

export interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export interface ConfirmationModalProps extends BaseModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  destructive?: boolean;
}

export interface TabBarItemProps {
  label: string;
  icon?: string;
  active?: boolean;
  onPress: () => void;
  badge?: number | string;
}

export interface NavigationButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  margin?: number;
}

export interface SpacerProps {
  size?: number;
  horizontal?: boolean;
}

export interface BadgeProps {
  text: string | number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
}

export interface AvatarProps {
  source?: { uri: string } | number;
  size?: number;
  fallback?: string;
  borderColor?: string;
  borderWidth?: number;
}