import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import { ProductsService } from 'src/app/shared/services/products.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InputNumberModule } from 'primeng/inputnumber';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';

import { ToastrService } from 'ngx-toastr';

import { TranslateModule } from '@ngx-translate/core';
import { AdminDashboardService } from 'src/app/shared/services/admin-dashboard.service';
import { minLengthArray } from 'src/app/shared/utils/custom-validation';

@Component({
  selector: 'app-addeditproduct',
  standalone: true,
  imports: [
    CommonModule,
    StepsModule,
    ToastModule,
    DropdownModule,
    FormsModule,
    InputNumberModule,
    StepperModule,
    ButtonModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @Input() productData: any; // for edit mode

  productForm!: FormGroup;
  thumbnailFile: File | null = null;
  galleryFiles: File[] = [];
  categories: any[] = [];
  brands: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private _ToastrService: ToastrService,
    private adminDashboardService:AdminDashboardService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllBrands();
    this.productForm = this.fb.group({
      title_en: ['', Validators.required],
      title_ar: [''],
      description_en: ['', Validators.required],
      description_ar: [''],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      stock_qty: [0, Validators.required],
      price_EGP: [0, Validators.required],
      sku: ['',Validators.required],
      is_new_collections: [false],

      specifications: this.fb.array([]),
      colors: this.fb.array([], minLengthArray(1)),
      sizes: this.fb.array([],minLengthArray(1)),
      galleries: this.fb.array([]),
    });

    if (this.productData) {
      this.productForm.patchValue(this.productData);
      if (this.productData.specifications) {
        this.productData.specifications.forEach((s: any) =>
          this.addSpecification(s)
        );
      }
      if (this.productData.colors) {
        this.productData.colors.forEach((c: any) => this.addColor(c));
      }
      if (this.productData.sizes) {
        this.productData.sizes.forEach((sz: any) => this.addSize(sz));
      }
    } else {
      this.addSpecification();
      this.addColor();
      this.addSize();
      this.addGallery();
    }
  }

  get specifications() {
    return this.productForm.get('specifications') as FormArray;
  }
  get colors() {
    return this.productForm.get('colors') as FormArray;
  }
  get sizes() {
    return this.productForm.get('sizes') as FormArray;
  }
  get galleries() {
    return this.productForm.get('galleries') as FormArray;
  }

  addSpecification(data: any = {}) {
    this.specifications.push(
      this.fb.group({
        title_en: [data.title_en || '', Validators.required],
        content_en: [data.content_en || '', Validators.required],
      })
    );
  }

  addColor(data: any = {}) {
    this.colors.push(
      this.fb.group({
        name_en: [data.name_en || '', Validators.required],
      })
    );
  }

  addSize(data: any = {}) {
    this.sizes.push(
      this.fb.group({
        name_en: [data.name_en || '', Validators.required],
      })
    );
  }

  addGallery() {
    this.galleries.push(
      this.fb.group({
        files: [null],
      })
    );
  }

  onGalleryChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.galleryFiles.push(...Array.from(input.files));
    }
  }

  removeFormItem(array: FormArray, index: number) {
    array.removeAt(index);
  }

  onThumbnailChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.thumbnailFile = event.target.files[0];
    }
  }

  onSubmit() {
    // Check if the form is valid before proceeding
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    // Create a new FormData instance
    const formData = new FormData();

    // 1. Append all text-based form data

    const formValue = this.productForm.value;
    formData.append('title_en', formValue.title_en);
    formData.append('description_en', formValue.description_en);

    // Handle foreign key relationships by appending their 'code' (ID)
    formData.append('category', formValue.category.id);
    formData.append('brand', formValue.brand.id);

    formData.append('stock_qty', formValue.stock_qty.toString());
    formData.append('price_EGP', formValue.price_EGP.toString());
    formData.append('sku', formValue.sku);
    formData.append('is_new', formValue.is_new_collections);

    // 2. Append the single thumbnail file
    if (this.thumbnailFile) {
      formData.append('image', this.thumbnailFile, this.thumbnailFile.name);
    }

    // 3. Append the multiple gallery files
    this.galleryFiles.forEach((file) => {
      formData.append('gallery', file, file.name);
    });

    // 4. Append nested data (specifications, colors, sizes) as JSON strings
    formData.append('specifications', JSON.stringify(formValue.specifications));
    formData.append('colors', JSON.stringify(formValue.colors));
    formData.append('sizes', JSON.stringify(formValue.sizes));

    // Now, send this single FormData object to the backend
    this.adminDashboardService.saveProduct(formData).subscribe({
      next: (res: any) => {
        console.log('Product and images created successfully!', res);
        this._ToastrService.success('Product and images created successfully!');
        // Handle success, maybe navigate away or show a toast
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error creating product:', err);
        this._ToastrService.error('Error creating product!');
        // Handle error, show an error toast
      },
    });
  }

  getAllCategories(): void {
    this.productsService.getAllCategory('en').subscribe({
      next: (res: any[]) => {
        this.categories = res.map((item) => ({
          name: item.title,
          id: item.id,
        }));
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }
  getAllBrands(): void {
    this.productsService.getAllBrands('en').subscribe({
      next: (res: any[]) => {
        this.brands = res.map((item) => ({
          name: item.title,
          id: item.id,
        }));
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }
}
