import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api, Product } from '../../services/api';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

// OnInit is like onMounted, fetch the products once this page is hit immedtiately
export class Dashboard implements OnInit {
  private api = inject(Api);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  protected products = signal<Product[]>([]);
  protected isLoading = signal(true);
  protected isSubmitting = signal(false);

  productForm = this.fb.group({
    title: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit() {
    this.api
      .getProducts()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => this.products.set(res.products),
        error: () => this.toastr.error('Could not load products', 'Load Failed'),
      });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const { title, price } = this.productForm.value;

    this.api
      .addProduct(title!, price!)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (newProduct) => {
          this.products.update((list) => [newProduct, ...list]);
          this.toastr.success('Product added');
          this.productForm.reset();
        },
        error: () => this.toastr.error('Could not add product', 'Submit Failed'),
      });
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
