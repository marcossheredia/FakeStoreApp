import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Products } from '../../services/products';
import { Product } from '../../models/product';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List implements OnInit {

  products = signal<Product[]>([]);
  loading = signal(true);

  constructor(
    private productsService: Products,
    private router: Router,
    public auth: Auth
  ) {}

  ngOnInit(): void {

    this.productsService.getAll().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando productos', err);
        this.loading.set(false);
      },
    });
  }

  // ✅ EDITAR
  editProduct(id: number): void {

    if (this.auth.getUser()?.role !== 'admin') {
      return;
    }

    this.router.navigate(['/products/edit', id]);
  }

  // ✅ ELIMINAR
  deleteProduct(id: number): void {

    if (this.auth.getUser()?.role !== 'admin') {
      return;
    }

    if (!confirm('¿Seguro que quieres eliminar este producto?')) {
      return;
    }

    this.productsService.delete(id).subscribe(() => {
      this.products.set(this.products().filter(p => p.id !== id));
    });
  }

}
