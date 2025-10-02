import { useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';

const DESKTOP_BREAKPOINT = 1024; // 1024px and above is considered desktop

export function useResponsive() {
  const [screenData, setScreenData] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const isDesktop = screenData.width >= DESKTOP_BREAKPOINT;
  const isMobile = screenData.width < DESKTOP_BREAKPOINT;
  const isWeb = Platform.OS === 'web';

  return {
    width: screenData.width,
    height: screenData.height,
    isDesktop,
    isMobile,
    isWeb,
    showSidebar: isDesktop && isWeb, // Only show sidebar on desktop web
  };
}
