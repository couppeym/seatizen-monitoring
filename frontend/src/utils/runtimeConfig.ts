export function getRuntimeConfig() {
  if (typeof window === "undefined") {
    return {
      NEXT_PUBLIC_URL_COG_SERVER: "",
      NEXT_PUBLIC_URL_BACKEND_SERVER: "",
    };
  }

  return {
    NEXT_PUBLIC_URL_COG_SERVER:
      window.__RUNTIME_CONFIG__?.NEXT_PUBLIC_URL_COG_SERVER ?? "",
    NEXT_PUBLIC_URL_BACKEND_SERVER:
      window.__RUNTIME_CONFIG__?.NEXT_PUBLIC_URL_BACKEND_SERVER ?? "",
  };
}