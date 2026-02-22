import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Products } from '../../services/products';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create {

  form;

  error = '';
  isLoading = false;

  constructor(
    private products: Products,
    private router: Router,
    public auth: Auth,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      price: [null as number | null, [Validators.required]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: ['']
    });
  }

  onCreate() {
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Todos los campos (excepto imagen) son obligatorios';
      return;
    }

    this.isLoading = true;
    const value = this.form.value as any;
    this.products.create({
      title: value.title,
      price: value.price,
      description: value.description,
      category: value.category,
      image: value.image || 'https://via.placeholder.com/200'
    }).subscribe({
      next: (created) => {
        this.router.navigate(['/products', created.id ?? '']);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al crear el producto';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
