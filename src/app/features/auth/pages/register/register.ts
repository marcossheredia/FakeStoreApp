import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  form;
  error = '';
  isLoading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  }

  private passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const p = group.get('password')?.value;
    const c = group.get('confirmPassword')?.value;
    return p && c && p !== c ? { mismatch: true } : null;
  }

  onRegister() {

    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.form.value as { name: string; email: string; password: string };

    this.isLoading = true;

    this.auth.register(name, email, password)
      .then((token) => {
        this.auth.saveToken(token, email);
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
