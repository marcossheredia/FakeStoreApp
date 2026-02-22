import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Products } from '../../services/products';
import { Product } from '../../models/product';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
})
export class Edit implements OnInit {

  id!: number;
  product?: Product;
  form;

  constructor(
    private route: ActivatedRoute,
    private products: Products,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      price: [0, [Validators.required]],
      description: ['', [Validators.required]],
      image: [''],
      category: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.id = +idParam;

      this.products.getById(this.id).subscribe(product => {
        this.product = product;
        this.form.patchValue({
          title: product.title,
          price: product.price,
          description: product.description,
          image: product.image,
          category: product.category
        });
        this.cdr.detectChanges();
      });
    }
  }

  save() {
    if (!this.product) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const updated: Product = {
      ...this.product!,
      ...this.form.value as any
    };

    this.products.update(this.id, updated).subscribe(() => {
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
