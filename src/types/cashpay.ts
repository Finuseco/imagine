export interface ProductVariation {
  color?: string;
  size?: string;
  stock?: number;
  [key: string]: any;
}

export interface PromotionalPackage {
  price: number;
  quantity: number;
}

export interface ShippingRate {
  rate: number;
  country: string;
  province: string;
}

export interface Boutique {
  id: string | number;
  name: string;
  address: string;
  whatsappPublicNumber?: string | null;
}

export interface Seller {
  id: string | number;
  walletId?: string;
  name: string;
  countryCode?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  images: string[];
  sellingPrice: number;
  currency: string;
  stock: number;
  barcode?: string;
  variations?: ProductVariation[];
  promotionalPackages?: PromotionalPackage[];
  weight?: number | null;
  shippingRates?: ShippingRate[];
  categoryId?: string;
  boutique?: Boutique;
  seller?: Seller;
  isPublic?: boolean;
  details?: Record<string, any>;
  viewCount?: number;
  orderCount?: number;
  commentCount?: number;
  reviewCount?: number;
  ratingAverage?: number;
  createdAt?: string;
}

export interface CashPayProductsResponse {
  success: boolean;
  userId: string;
  storeId?: string | null;
  count: number;
  products: Product[];
  message?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariation?: ProductVariation | null;
  pricePerUnit: number;
}
