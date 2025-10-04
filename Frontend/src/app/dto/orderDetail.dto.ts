import { Order } from './order.dto';
import { Product } from './product.dto';

export interface OrderDetail {
  id: number;
  orderId?: number;
  productId?: number;
  price?: number;
  numberOfProducts?: number;
  totalMoney?: number;
  order?: Order;
  product?: Product;
}
