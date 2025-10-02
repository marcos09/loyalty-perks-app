import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/error-state';
import { ThemedView } from '@/components/themed-view';

export default function ErrorPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    error?: string;
    title?: string;
    description?: string;
    showDetails?: string;
    statusCode?: string;
  }>();

  const error = params.error ? new Error(params.error) : new Error('Unknown error');
  const title = params.title || 'Something went wrong';
  const description = params.description || 'An unexpected error occurred. Please try again.';
  const showDetails = params.showDetails === 'true';
  const statusCode = params.statusCode;

  const handleRetry = () => {
    router.replace('/');
  };


  const isApiError = statusCode && (statusCode.startsWith('4') || statusCode.startsWith('5'));
  const getApiErrorMessage = () => {
    if (!statusCode) return description;
    
    const code = parseInt(statusCode);
    if (code >= 500) {
      return 'Our servers are experiencing issues. Please try again in a few moments.';
    } else if (code === 404) {
      return 'The requested resource was not found.';
    } else if (code === 401 || code === 403) {
      return 'You do not have permission to access this resource.';
    } else if (code >= 400) {
      return 'There was an issue with your request. Please check your input and try again.';
    }
    return description;
  };

  const finalDescription = isApiError ? getApiErrorMessage() : description;

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ErrorState
          error={error}
          onRetry={handleRetry}
          title={title}
          description={finalDescription}
          showDetails={showDetails}
        />
      </SafeAreaView>
    </ThemedView>
  );
}
