import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Products } from '../../services/products';
import { Product } from '../../models/product';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
})
export class Edit implements OnInit {

  id!: number;
  product?: Product;

  constructor(
    private route: ActivatedRoute,
    private products: Products,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.id = +idParam;

      this.products.getById(this.id).subscribe(product => {
        this.product = product;
        this.cdr.detectChanges();
      });
    }
  }

  save() {
    if (!this.product) return;

    this.products.update(this.id, this.product).subscribe(() => {
      console.log('Producto actualizado')
      this.router.navigate(['/products']);

      // 👉 redirigir al detalle
      this.router.navigate(['/products', this.id]);
    });
  }

  deleteProduct() {
    const confirmed = confirm(
      '¿Estás seguro de que quieres eliminar este producto?'
    );

    if (!confirmed) return;

    this.products.delete(this.id).subscribe(() => {
      console.log('Producto eliminado');

      // 👉 volver al listado
      this.router.navigate(['/products']);
    });
  }

}
