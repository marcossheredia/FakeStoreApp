import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
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

  register(username: string, password: string) {

    const users = this.getRegisteredUsers();

    const exists = users.find(u => u.username === username);
    if (exists) {
      throw new Error('El usuario ya existe');
    }

    const newUser = {
      username,
      password,
      role: 'user'
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

    const fakeToken = 'fake-jwt-' + Math.random().toString(36).substring(2);

    return fakeToken;
  }

  private getRegisteredUsers(): any[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

}
