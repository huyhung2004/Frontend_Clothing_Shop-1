import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Order } from '../../dto/order.dto';

export interface PagedResponse<T> {
  data: T[];
  total: number;
}
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'https://localhost:7163/api/order';
  constructor(private http: HttpClient) {}

  getOrders(
    page: number,
    itemsPerPage: number
  ): Observable<PagedResponse<Order>> {
    const params = {
      page: page.toString(),
      size: itemsPerPage.toString(),
    };
    return this.http.get<PagedResponse<Order>>(`${this.baseUrl}`, {
      params,
    });
  }
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/all`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  updateOrder(id: number, order: Order): Observable<any> {
    return this.http.put(`${this.baseUrl}/Edit/${id}`, order);
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Delete/${id}`);
  }
}
