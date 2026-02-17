import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  onLogin() {

    // 🔥 Caso ADMIN local
    if (this.username === 'admin@admin.com' && this.password === '123456') {

      const fakeToken = 'admin-token-' + Math.random().toString(36).substring(2);

      localStorage.setItem('auth_token', fakeToken);
      localStorage.setItem('user', JSON.stringify({
        username: this.username,
        role: 'admin'
      }));

      this.auth.isAuthenticated.set(true);

      this.router.navigate(['/dashboard']);
      return;
    }

    // 🔵 Login normal API
    this.auth.login(this.username, this.password)
      .subscribe({
        next: (res) => {

          this.auth.saveToken(res.token, this.username);

          const user = this.auth.getUser();

          if (user?.role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/products']);
          }

        },
        error: () => {
          this.error = 'Credenciales incorrectas';
        }
      });
  }
}
