export const ENV = {
  app_url:
    (import.meta.env.VITE_APP_URL as string) ||
    "https://zaaz-server.vercel.app",
  api_url:
    (import.meta.env.VITE_API_URL as string) ||
    "https://zaaz-server.vercel.app",
  environment: import.meta.env.MODE as "development" | "production",
};
