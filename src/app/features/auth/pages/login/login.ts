import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  form;
  error = '';
  isLoading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin() {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const email = this.form.get('email')!.value!;
    const password = this.form.get('password')!.value!;

    // 🔥 Caso ADMIN local
    if (email === 'admin@admin.com' && password === '123456') {

      const fakeToken = 'admin-token-' + Math.random().toString(36).substring(2);

      localStorage.setItem('auth_token', fakeToken);
      localStorage.setItem('user', JSON.stringify({
        username: email,
        role: 'admin'
      }));

      this.auth.isAuthenticated.set(true);

      this.router.navigate(['/dashboard']);
      return;
    }

    // 🔵 Login normal API
    this.auth.login(email, password)
      .subscribe({
        next: (res) => {

          // API escuelajs: access_token
          this.auth.saveToken((res as any).access_token, email);

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
