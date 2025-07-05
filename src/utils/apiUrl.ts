

export function getApiUrl() {
  const apiUrl = window?.__APP_CONFIG__?.apiUrl;
  if (import.meta.env.VITE_USE_API_PROXY) {
    return ''
  }
  return apiUrl || import.meta.env.VITE_TRPC_URL || 'https://api.g6b.xyz'
}
