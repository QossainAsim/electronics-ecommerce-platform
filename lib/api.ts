// lib/api.ts
const config = {
  apiBaseUrl: '', 
  expressApiUrl: 'http://localhost:3001',
};

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    let fullUrl: string;
    
    // These routes go to Express server (port 3001)
    const expressRoutes = [
      '/api/products',
      '/api/categories',  // ❌ REMOVE THIS LINE
      '/api/images',
      '/api/search',
      '/api/main-image',
      '/api/users',
      '/api/orders',
      '/api/order-product',
      '/api/slugs',
      '/api/notifications',
      '/api/bulk-upload',
    ];
    
    const isExpressRoute = expressRoutes.some(route => endpoint.includes(route));
    
    if (isExpressRoute) {
      fullUrl = `${config.expressApiUrl}${endpoint}`;
      console.log('→ Using EXPRESS:', fullUrl);
    } else {
      fullUrl = endpoint;
      console.log('→ Using NEXT.JS:', fullUrl);
    }
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
    
    console.log('📡 Fetching:', fullUrl);
    const response = await fetch(fullUrl, { ...defaultOptions, ...options });
    console.log('📥 Response:', response.status, response.statusText);
    
    return response;
  },
  
  get: (endpoint: string, options?: RequestInit) => 
    apiClient.request(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, data?: any, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: (endpoint: string, data?: any, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  patch: (endpoint: string, data?: any, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: (endpoint: string, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;