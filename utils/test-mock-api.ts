// Test utility to verify the mock API is working
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';

export async function testMockApi() {
  console.log('🧪 Testing Mock API...');
  
  try {
    // Test benefits endpoint
    const benefitsUrl = `${API_BASE_URL}${API_ENDPOINTS.BENEFITS}`;
    console.log('Testing URL:', benefitsUrl);
    
    const response = await fetch(benefitsUrl);
    const data = await response.json();
    
    console.log('✅ Mock API Response:', {
      success: data.success,
      dataLength: data.data?.length || 0,
      total: data.total,
    });
    
    if (data.success && data.data && data.data.length > 0) {
      console.log('✅ First benefit:', {
        id: data.data[0].id,
        title: data.data[0].title,
        category: data.data[0].category,
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Mock API Test Failed:', error);
    return false;
  }
}
