import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  firstName: string;
  username: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
}

// without this injection, the inject(Api) would fail, Angular wouldn't know this class is sth its allowed to construct and hand out.
// providedIn: root means singleton, one shared instance for the whole app.
@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);
  private baseUrl = 'https://dummyjson.com';

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { username, password });
  }

  getProducts() {
    return this.http.get<{ products: Product[] }>(`${this.baseUrl}/products?limit=10`);
  }

  addProduct(title: string, price: number) {
    return this.http.post<Product>(`${this.baseUrl}/product/add`, { title, price });
  }
}
