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

  username = '';
  password = '';
  confirmPassword = '';
  error = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  onRegister() {

    if (!this.username || !this.password) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    try {
      const token = this.auth.register(this.username, this.password);

      this.auth.saveToken(token, this.username);

      this.router.navigate(['/dashboard']);

    } catch (e: any) {
      this.error = e.message;
    }
  }
}
