import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly TOKEN_KEY = 'auth_token';
  private supabase: SupabaseClient | null = null;

  isAuthenticated = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Persistencia al recargar
    this.isAuthenticated.set(!!this.getToken());
    if (environment.supabaseUrl && environment.supabaseAnonKey) {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    }
  }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(
      'https://fakestoreapi.com/auth/login',
      { username, password }
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

  private readonly USERS_KEY = 'registered_users';

  async register(name: string, email: string, password: string): Promise<string> {
    if (!this.supabase) {
      // Fallback local en desarrollo: registro simulado
      const users = this.getRegisteredUsers();
      const exists = users.find(u => u.email === email);
      if (exists) {
        throw new Error('El usuario ya existe');
      }
      const newUser = { name, email, password, role: 'user' };
      users.push(newUser);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      const fakeToken = 'dev-fake-jwt-' + Math.random().toString(36).substring(2);
      return fakeToken;
    }
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    if (error) {
      throw new Error(error.message);
    }
    const token = data.session?.access_token;
    if (!token) {
      throw new Error('Registro realizado. Revisa tu email para confirmar la cuenta.');
    }
    return token;
  }

  private getRegisteredUsers(): Array<{ name: string; email: string; password: string; role: string }> {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

}
