import { StyleSheet, View, type ViewProps } from 'react-native';

export interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: number;
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  wrap?: boolean;
}

export function Container({
  children,
  direction = 'column',
  align = 'flex-start',
  justify = 'flex-start',
  gap = 0,
  padding = 'none',
  margin = 'none',
  wrap = false,
  style,
  ...props
}: ContainerProps) {
  return (
    <View
      style={[
        styles.base,
        {
          flexDirection: direction,
          alignItems: align,
          justifyContent: justify,
          gap,
          flexWrap: wrap ? 'wrap' : 'nowrap',
        },
        styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
        styles[`margin${margin.charAt(0).toUpperCase() + margin.slice(1)}`],
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    // Base styles are applied via style prop
  },
  
  // Padding variants
  paddingNone: {},
  paddingSmall: {
    padding: 8,
  },
  paddingMedium: {
    padding: 16,
  },
  paddingLarge: {
    padding: 24,
  },
  
  // Margin variants
  marginNone: {},
  marginSmall: {
    margin: 8,
  },
  marginMedium: {
    margin: 16,
  },
  marginLarge: {
    margin: 24,
  },
});
