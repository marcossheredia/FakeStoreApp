import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';


@Injectable({
  providedIn: 'root',
})
export class Products {
  private readonly API_URL = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL);
  }

  getById(id: number) {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  update(id: number, product: Product) {
    return this.http.put<Product>(
      `${this.API_URL}/${id}`,
      product
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }


}
