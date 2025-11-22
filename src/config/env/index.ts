export const ENV = {
  app_url: (import.meta.env.VITE_APP_URL as string) || "http://localhost:8080",
  api_url: (import.meta.env.VITE_API_URL as string) || "http://localhost:5000",
  environment: import.meta.env.MODE as "development" | "production",
};
