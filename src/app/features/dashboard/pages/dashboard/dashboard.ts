import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Products } from '../../../products/services/products';
import { Auth } from '../../../../core/services/auth';
import { Product } from '../../../products/models/product';
import { catchError, of } from 'rxjs';

type CategoryStat = { name: string; count: number };

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  // UI state
  loading = true;
  apiOnline = true;
  errorMsg = '';

  // User
  username = 'Usuario';
  role = 'user';
  today = new Date();

  // Raw data
  products: Product[] = [];

  // Metrics
  totalProducts = 0;
  avgPrice = 0;
  mostExpensiveName = '-';
  mostExpensivePrice = 0;
  categoriesTotal = 0;

  // Widgets
  topCategories: CategoryStat[] = [];
  topProducts: Product[] = [];

  constructor(
    private productsService: Products,
    private auth: Auth
  ) {}
/*
  ngOnInit(): void {
    const user = this.auth.getUser();
    this.username = user?.username ?? 'Usuario';
    this.role = user?.role ?? 'user';

    this.loading = true;
    this.errorMsg = '';

    this.productsService.getAll().pipe(
      catchError(() => {
        this.apiOnline = false;
        this.errorMsg = 'No se pudo conectar con la API de productos. Revisa tu conexión o inténtalo más tarde.';
        return of([] as Product[]);
      })
    ).subscribe((products) => {
      this.products = products ?? [];
      this.apiOnline = true;

      this.buildMetrics();
      this.buildWidgets();

      this.loading = false;
    });
  }
*/


private loadDashboardData() {
  this.loading = true;
  this.errorMsg = '';

  this.productsService.getAll().pipe(
    catchError(() => {
      this.apiOnline = false;
      this.errorMsg = 'No se pudo conectar con la API.';
      return of([]);
    })
  ).subscribe((products) => {

    this.products = products ?? [];
    this.apiOnline = true;

    this.buildMetrics();
    this.buildWidgets();

    this.loading = false;
  });
}



ngOnInit(): void {
  const user = this.auth.getUser();
  this.username = user?.username ?? 'Usuario';
  this.role = user?.role ?? 'user';

  // Esperar a que la autenticación esté lista
  if (!this.auth.isLogged()) {
    return;
  }

  this.loadDashboardData();
}


  private buildMetrics() {
    this.totalProducts = this.products.length;

    if (this.totalProducts === 0) {
      this.avgPrice = 0;
      this.mostExpensiveName = '-';
      this.mostExpensivePrice = 0;
      this.categoriesTotal = 0;
      return;
    }

    const prices = this.products.map(p => Number(p.price) || 0);
    const sum = prices.reduce((acc, v) => acc + v, 0);
    this.avgPrice = sum / this.totalProducts;

    const mostExpensive = [...this.products].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))[0];
    this.mostExpensiveName = mostExpensive?.title ?? '-';
    this.mostExpensivePrice = Number(mostExpensive?.price) || 0;

    const categories = new Set(this.products.map(p => p.category).filter(Boolean));
    this.categoriesTotal = categories.size;
  }

  private buildWidgets() {
    // Top categories
    const map = new Map<string, number>();
    for (const p of this.products) {
      const c = p.category || 'Sin categoría';
      map.set(c, (map.get(c) ?? 0) + 1);
    }

    this.topCategories = Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    // Top 5 products by price
    this.topProducts = [...this.products]
      .sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
      .slice(0, 5);
  }

  get roleLabel(): string {
    return this.role === 'admin' ? 'Administrador' : 'Usuario';
  }

  get statusLabel(): string {
    return this.apiOnline ? 'Conectado' : 'Sin conexión';
  }
}
