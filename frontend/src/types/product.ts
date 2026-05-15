export interface Variant {
  id: number;
  title: string;
  price: string;
  available: boolean;
  sku: string;
  compare_at_price: string;
}

export interface ProductImage {
  id: number;
  src: string;
  position: number;
}

export interface Product {
  productId: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string[];
  variants: Variant[];
  images: ProductImage[];
  options: any[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
