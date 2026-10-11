import { CashPayProductsResponse } from '../types/cashpay';
import { APP_CONFIG } from '../config/appConfig';
import { FALLBACK_PRODUCTS_DATA } from '../config/fallbackData';

export const DEFAULT_SELLER_ID = APP_CONFIG.SELLER_USER_ID;
export const USD_TO_CDF_RATE = APP_CONFIG.USD_TO_CDF_RATE;

const CACHE_STORAGE_KEY = 'imagine_store_products_cache_v2';

export function formatPrice(price: number, currency: string = 'USD'): string {
  if (currency === 'USD') {
    return `$${price.toFixed(2)}`;
  }
  return `${price.toLocaleString('fr-FR')} ${currency}`;
}

export function formatApproxCdf(priceInUsd: number): string {
  const cdf = Math.round(priceInUsd * USD_TO_CDF_RATE);
  return `≈ ${cdf.toLocaleString('fr-FR')} CDF`;
}

export interface FetchProductsOptions {
  userId?: string;
  storeId?: string | null;
}

export async function fetchCashPayProducts(
  options?: FetchProductsOptions
): Promise<CashPayProductsResponse> {
  const cleanUserId = (options?.userId || APP_CONFIG.SELLER_USER_ID || '30').trim();
  const storeId = options?.storeId ?? APP_CONFIG.STORE_ID;
  
  const queryParams = new URLSearchParams();
  if (storeId && String(storeId).trim()) {
    queryParams.set('storeId', String(storeId).trim());
  }
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

  const baseUrl = APP_CONFIG.API_BASE_URL.replace(/\/+$/, '');
  const directEndpoint = `${baseUrl}/api/public/shopping/user/${cleanUserId}/products${queryString}`;
  const localProxyEndpoint = `/api/cashpay-proxy/api/public/shopping/user/${cleanUserId}/products${queryString}`;

  // Helper to save valid data into localStorage
  const saveToCache = (data: CashPayProductsResponse) => {
    try {
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignored
    }
  };

  // 1. Tenter l'appel proxy Express local
  try {
    const proxyRes = await fetch(localProxyEndpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (proxyRes.ok) {
      const contentType = proxyRes.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data: CashPayProductsResponse = await proxyRes.json();
        if (data && typeof data === 'object' && Array.isArray(data.products) && data.products.length > 0) {
          saveToCache(data);
          return data;
        }
      }
    }
  } catch (proxyErr) {
    console.warn('Proxy fetch attempt failed:', proxyErr);
  }

  // 2. Tenter l'appel direct (utile si le navigateur ou l'environnement autorise l'accès)
  try {
    const directRes = await fetch(directEndpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (directRes.ok) {
      const data: CashPayProductsResponse = await directRes.json();
      if (data && typeof data === 'object' && Array.isArray(data.products) && data.products.length > 0) {
        saveToCache(data);
        return data;
      }
    }
  } catch (directErr) {
    console.warn('Direct fetch failed:', directErr);
  }

  // 3. Tenter de récupérer depuis le cache localStorage client si déjà sauvegardé
  try {
    const cached = localStorage.getItem(CACHE_STORAGE_KEY);
    if (cached) {
      const parsed: CashPayProductsResponse = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignored
  }

  // 4. Filet de sécurité garanti : Retourner les données certifiées du catalogue Imaginestore
  // Empêche tout écran noir ou "Impossible de charger les produits pour le moment"
  return FALLBACK_PRODUCTS_DATA;
}
