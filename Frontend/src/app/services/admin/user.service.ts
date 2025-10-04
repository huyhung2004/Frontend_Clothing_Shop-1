import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../../dto/user.dto'; // Đường dẫn đến model Brand
export interface PagedResponse<T> {
  data: T[];
  total: number;
}
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'https://localhost:7163/api/users';
  constructor(private http: HttpClient) {}

  getUsers(
    page: number,
    itemsPerPage: number
  ): Observable<PagedResponse<User>> {
    const params = {
      page: page.toString(),
      size: itemsPerPage.toString(),
    };
    return this.http.get<PagedResponse<User>>(`${this.baseUrl}`, {
      params,
    });
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/all`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }
  createUser(user: User) {
    return this.http.post(`${this.baseUrl}/Create`, user);
  }

  updateUser(id: number, user: User): Observable<any> {
    return this.http.put(`${this.baseUrl}/Edit/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Delete/${id}`);
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
  getCurrentUserName(): Observable<string> {
    return this.http
      .get<{ fullName: string }>(`${this.baseUrl}/name`)
      .pipe(map((response) => response.fullName));
  }
}
