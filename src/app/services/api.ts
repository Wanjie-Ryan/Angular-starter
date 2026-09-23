import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  firstName: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);
  private baseUrl = 'https://dummyjson.com';

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { username, password });
  }
}
