import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class Products {
  private readonly API_URL = `${environment.apiBase}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<any[]>(this.API_URL).pipe(
      map(items => items.map(this.mapToProduct))
    );
  }

  getById(id: number) {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map(this.mapToProduct)
    );
  }

  create(product: Partial<Product>) {
    const payload = {
      title: product.title,
      price: product.price,
      description: product.description,
      categoryId: 1,
      images: [product.image || 'https://i.imgur.com/Y54Bt8J.jpeg']
    };
    return this.http.post<any>(this.API_URL, payload).pipe(
      map(this.mapToProduct)
    );
  }

  update(id: number, product: Product) {
    const payload = {
      title: product.title,
      price: product.price,
      description: product.description,
      categoryId: 1,
      images: [product.image]
    };
    return this.http.put<any>(`${this.API_URL}/${id}`, payload).pipe(
      map(this.mapToProduct)
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  private mapToProduct = (r: any): Product => ({
    id: r.id,
    title: r.title,
    price: r.price,
    description: r.description,
    category: r.category?.name ?? '',
    image: Array.isArray(r.images) ? r.images[0] : (r.image ?? '')
  });

}

