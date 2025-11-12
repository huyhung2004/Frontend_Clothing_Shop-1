export interface CartItem {
  id: number;              // Cart item ID
  productId: number;       // <-- add this
  image: string;
  name: string;
  price: number;
  numberOfProducts: number;
  orderId?: number;
}
