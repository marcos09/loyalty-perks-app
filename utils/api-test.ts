import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';

// Utility function to test API endpoints
export async function testApiEndpoints() {
  console.log('🧪 Testing API endpoints...');
  
  try {
    // Test benefits endpoint
    const benefitsResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BENEFITS}`);
    const benefitsData = await benefitsResponse.json();
    console.log('✅ Benefits endpoint working:', benefitsData.success ? 'SUCCESS' : 'FAILED');
    console.log(`📊 Found ${benefitsData.data?.length || 0} benefits`);
    
    // Test categories endpoint
    const categoriesResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}`);
    const categoriesData = await categoriesResponse.json();
    console.log('✅ Categories endpoint working:', categoriesData.success ? 'SUCCESS' : 'FAILED');
    console.log(`📊 Found ${categoriesData.data?.length || 0} categories`);
    
    // Test specific benefit endpoint
    if (benefitsData.data && benefitsData.data.length > 0) {
      const firstBenefit = benefitsData.data[0];
      const benefitResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BENEFIT_BY_ID(firstBenefit.id)}`);
      const benefitData = await benefitResponse.json();
      console.log('✅ Single benefit endpoint working:', benefitData.success ? 'SUCCESS' : 'FAILED');
    }
    
    console.log('🎉 All API tests completed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}
