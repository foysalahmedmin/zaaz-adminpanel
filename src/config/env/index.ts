export const ENV = {
  app_url: (import.meta.env.VITE_APP_URL as string) || "http://localhost:8080",
  api_url: (import.meta.env.VITE_API_URL as string) || "http://localhost:5000",
  webhook_url:
    (import.meta.env.VITE_WEBHOOK_URL as string) ||
    "http://localhost:8080/client/webhook",
  environment: import.meta.env.MODE as "development" | "production",
};
