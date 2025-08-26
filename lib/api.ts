// API configuration utility
// For auth endpoints, use Next.js API routes (always relative to the current domain)
// For other endpoints (like events), use the backend URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kaizenx-production.up.railway.app";

export const apiUrl = (endpoint: string) => {
  // Temporarily use backend directly for all endpoints until Vercel deployment is ready
  return `${API_BASE_URL}${endpoint}`;
  
  // TODO: Re-enable Next.js API routes once Vercel deployment is complete
  // if (endpoint.includes('/api/login') || endpoint.includes('/api/register') || endpoint.includes('/api/users/me')) {
  //   // Return relative URL for Next.js API routes
  //   return endpoint;
  // }
  // // Use backend URL for other endpoints
  // return `${API_BASE_URL}${endpoint}`;
};

export const imageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};
