import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Products } from '../../services/products';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create {

  title = '';
  price: number | null = null;
  description = '';
  category = '';
  image = '';

  error = '';
  isLoading = false;

  constructor(
    private products: Products,
    private router: Router,
    public auth: Auth
  ) {}

  onCreate() {
    this.error = '';

    if (!this.title || this.price == null || !this.description || !this.category) {
      this.error = 'Todos los campos (excepto imagen) son obligatorios';
      return;
    }

    this.isLoading = true;
    this.products.create({
      title: this.title,
      price: this.price,
      description: this.description,
      category: this.category,
      image: this.image || 'https://via.placeholder.com/200'
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
