// API configuration utility
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const apiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

export const imageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};
