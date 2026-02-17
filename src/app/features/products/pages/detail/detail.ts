import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Products } from '../../services/products';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class Detail implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private productsService: Products
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.productsService.getById(+id).subscribe(product => {
      this.product.set(product);
      this.loading.set(false);
    });
  }
}
