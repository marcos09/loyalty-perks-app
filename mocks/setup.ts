import { setupFallbackMock, stopFallbackMock } from './fallback-mock';

// For React Native, we'll use the fallback approach since MSW has compatibility issues
// with browser APIs like MessageEvent that aren't available in React Native

// Start the mock server using fallback approach
export async function startMockServer() {
  try {
    setupFallbackMock();
    console.log('🚀 Mock server started (fallback mode for React Native)');
  } catch (error) {
    console.error('Failed to start mock server:', error);
  }
}

// Stop the mock server
export function stopMockServer() {
  stopFallbackMock();
  console.log('🛑 Mock server stopped');
}

// Reset handlers (not applicable for fallback approach)
export function resetHandlers() {
  console.log('Reset handlers not applicable for fallback approach');
}
