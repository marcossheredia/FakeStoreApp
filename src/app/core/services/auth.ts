import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

interface LoginResponse {
  access_token: string;
  refresh_token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly TOKEN_KEY = 'auth_token';

  isAuthenticated = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Persistencia al recargar
    this.isAuthenticated.set(!!this.getToken());
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(
      `${environment.apiBase}/auth/login`,
      { email, password }
    );
  }

  saveToken(token: string, username?: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (username) {
      localStorage.setItem('user', JSON.stringify({
        username: username,
        role: 'user'
      }));
    }
    this.isAuthenticated.set(true);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('user');
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  async register(name: string, email: string, password: string): Promise<string> {
    // Crear usuario en Escuelajs API
    await firstValueFrom(this.http.post(
      `${environment.apiBase}/users`,
      {
        name,
        email,
        password,
        avatar: 'https://i.imgur.com/Y54Bt8J.jpeg'
      }
    ));
    // Login para obtener el JWT
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(
        `${environment.apiBase}/auth/login`,
        { email, password }
      )
    );
    if (!res?.access_token) {
      throw new Error('No se recibió token tras el registro');
    }
    return res.access_token;
  }

}
