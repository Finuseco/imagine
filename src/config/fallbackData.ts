import { CashPayProductsResponse } from '../types/cashpay';

// Données initiales et cache de secours pour la boutique Imaginestore (User ID: 30, Boutique ID: 4)
// Garantit un affichage instantané et infaillible dans l'iframe ou lors d'instabilités réseau
export const FALLBACK_PRODUCTS_DATA: CashPayProductsResponse = {
  success: true,
  userId: "30",
  storeId: "4",
  count: 1,
  products: [
    {
      id: "5",
      name: "Chaussure élégante",
      description: "Mocassin fabriquer en pièces brillantes pour votre élégance personnelle.",
      image: "https://app.cashpay-all.com/images/jojo/produits/product_30_1791725451080.jpg",
      images: [
        "https://app.cashpay-all.com/images/jojo/produits/product_30_1791725451080.jpg",
        "https://app.cashpay-all.com/images/jojo/produits/product_30_1791725451089.jpg"
      ],
      sellingPrice: 125,
      currency: "USD",
      stock: 120,
      barcode: "2026260136073",
      variations: [
        {
          color: "Unique",
          stock: 110
        }
      ],
      promotionalPackages: [
        {
          price: 95,
          quantity: 10
        }
      ],
      weight: 0.75,
      shippingRates: [],
      categoryId: "cat-hab",
      boutique: {
        id: "4",
        name: "Imaginestore",
        address: "17Tango,Gb,Kintambo, Ref: immeuble Tango",
        whatsappPublicNumber: "+243818060756"
      },
      seller: {
        id: "30",
        walletId: "CD0100000011",
        name: "GARY ALI",
        countryCode: "République Démocratique du Congo"
      },
      isPublic: true,
      details: {},
      viewCount: 3,
      orderCount: 0,
      commentCount: 0,
      reviewCount: 0,
      ratingAverage: 0,
      createdAt: "2026-10-11T13:30:51.078Z"
    }
  ]
};
