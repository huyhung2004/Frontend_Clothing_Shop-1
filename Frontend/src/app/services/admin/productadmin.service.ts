import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../dto/product.dto';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface ProductDetailViewModel {
  product: Product;
}
export interface PagedResponse<T> {
  items: T[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductAdminService {
  // Đường dẫn base API (điều chỉnh theo địa chỉ thực tế)
  private baseUrl = 'https://localhost:7163/api/product';
  constructor(private http: HttpClient) {}

  // Lấy tất cả sản phẩm
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/all`);
  }

  getProducts(
    page: number,
    itemsPerPage: number
  ): Observable<PagedResponse<Product>> {
    const params = {
      page: page.toString(),
      pageSize: itemsPerPage.toString(),
    };
    return this.http.get<PagedResponse<Product>>(`${this.baseUrl}/paged`, {
      params,
    });
  }
  createProduct(product: Product): Observable<any> {
    return this.http.post(`${this.baseUrl}/Create`, product);
  }

  // Cập nhật sản phẩm
  updateProduct(id: number, product: Product): Observable<any> {
    return this.http.put(`${this.baseUrl}/Edit/${id}`, product);
  }

  // Xóa sản phẩm
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Delete/${id}`);
  }
}
