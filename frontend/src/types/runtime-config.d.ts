export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      NEXT_PUBLIC_URL_COG_SERVER?: string;
      NEXT_PUBLIC_URL_BACKEND_SERVER?: string;
    };
  }
}