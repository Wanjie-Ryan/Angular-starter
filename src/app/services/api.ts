import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  firstName: string;
  username: string;
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
}
