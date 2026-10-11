// Configuration centrale de l'application Imagine Store
// Vous pouvez modifier le USER_ID ou l'URL de base directement ici ou via les variables d'environnement VITE_*

export const APP_CONFIG = {
  // ID de l'utilisateur vendeur source (User ID: 30)
  SELLER_USER_ID: (import.meta.env.VITE_SELLER_USER_ID as string) || '30',

  // Identifiant de la boutique (Boutique ID: 4)
  STORE_ID: (import.meta.env.VITE_STORE_ID as string) || '4',

  // URL racine de l'API source
  API_BASE_URL: (import.meta.env.VITE_API_BASE_URL as string) || 'https://app.cashpay-all.com',

  // Taux de conversion de référence (1 USD = 2870 CDF)
  USD_TO_CDF_RATE: 2340,
};
