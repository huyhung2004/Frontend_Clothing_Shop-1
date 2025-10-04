import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../dto/cart/cartItems.dto';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Adjust the base URL and endpoints to match your API
  private baseUrl = 'https://localhost:7163/api/CartAPI';

  constructor(private http: HttpClient) {}
  addCart(
    id: number,
    numberOfProducts: number,
    color: string,
    price: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('id', id.toString())
      .set('NumberOfProducts', numberOfProducts.toString())
      .set('color', color)
      .set('price', price.toString());

    // Body rỗng vì API của bạn nhận dữ liệu qua query string
    return this.http.post(`${this.baseUrl}/AddCart`, {}, { params });
  }
  buyNow(
    id: number,
    numberOfProducts: number,
    color: string,
    price: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('id', id.toString())
      .set('NumberOfProducts', numberOfProducts.toString())
      .set('color', color)
      .set('price', price.toString());

    return this.http.get(`${this.baseUrl}/buynow`, { params });
  }
  updateCart(itemId: number, action: 'increase' | 'decrease'): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/${action}/${itemId}`,
      {},
      { headers: { skipLoading: 'true' } }
    );
  }

  deleteItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${itemId}`, {
      headers: { skipLoading: 'true' },
    });
  }

  getCartProducts(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.baseUrl}/cart`);
  }
}
