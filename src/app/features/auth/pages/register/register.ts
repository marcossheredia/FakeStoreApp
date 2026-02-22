import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  isLoading = false;

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  onRegister() {

    this.error = '';

    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'El email no es válido';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true;

    this.auth.register(this.name, this.email, this.password)
      .then((token) => {
        this.auth.saveToken(token, this.email);
        this.router.navigate(['/dashboard']);
      })
      .catch((e: any) => {
        this.error = e?.message ?? 'Error al registrar';
      })
      .finally(() => {
        this.isLoading = false;
      });

  }
}
