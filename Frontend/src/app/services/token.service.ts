import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'accessToken';

  constructor(private cookieService: CookieService) {}

  getToken(): string | null {
    return this.cookieService.get(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    this.cookieService.set(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    this.cookieService.delete(this.TOKEN_KEY);
  }

  // Add the missing method
  hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // If it's a JWT token, check expiration
      if (token.split('.').length === 3) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiration = payload.exp * 1000;
        return Date.now() < expiration;
      }
      // If it's not a JWT, just check if token exists
      return true;
    } catch (error) {
      // If parsing fails, just check if token exists
      return !!token;
    }
  }

  // Alternative simple method
  hasToken(): boolean {
    return this.cookieService.check(this.TOKEN_KEY);
  }
}