import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductsService } from 'src/app/shared/services/products.service';
import { ActivatedRoute } from '@angular/router';
import { AdminDashboardService } from 'src/app/shared/services/admin-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { minLengthArray } from 'src/app/shared/utils/custom-validation';
@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent {
  productForm!: FormGroup;
  productId!: string;
  productData: any;
  thumbnailFile: File | null = null;
  thumbnailPreview: string | null = null;

  galleryFiles: { file?: File; url?: string; id?: number }[] = [];
  galleryPreviews: string[] = [];

  categories: any[] = [];
  brands: any[] = [];

  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private adminDashboardService: AdminDashboardService,
    private _ToastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.getAllCategories();
    this.getAllBrands();
    this.getProduct();
  }

  initForm() {
    this.productForm = this.fb.group({
      title_en: ['', Validators.required],
      description_en: ['', Validators.required],
      category: [null, Validators.required],
      brand: [null, Validators.required],
      stock_qty: [0, Validators.required],
      price_EGP: [0, Validators.required],
      sku: ['', Validators.required],
      is_new_collections: [false],
      specifications: this.fb.array([]),
      colors: this.fb.array([], minLengthArray(1)),
      sizes: this.fb.array([], minLengthArray(1)),
      galleries: this.fb.array([]),
    });
  }

  get specifications(): FormArray {
    return this.productForm.get('specifications') as FormArray;
  }
  get colors(): FormArray {
    return this.productForm.get('colors') as FormArray;
  }
  get sizes(): FormArray {
    return this.productForm.get('sizes') as FormArray;
  }
  get galleries(): FormArray {
    return this.productForm.get('galleries') as FormArray;
  }

  // ====== API Calls ======
  getProduct() {
    this.loading = true;
    this.adminDashboardService.getProductDetails(this.productId).subscribe({
      next: (product: any) => {
        this.productData = product;

        // Patch main form values
        this.productForm.patchValue({
          title_en: product.title_en,
          description_en: product.description_en,
          category: product.category?.id,
          brand: product.brand?.id,
          stock_qty: product.stock_qty,
          price_EGP: product.price_EGP,
          sku: product.sku,
          is_new_collections: product.is_new,
        });

        // Patch specifications
        const specsArray = this.specifications;
        specsArray.clear();
        product.specification?.forEach((spec: any) => {
          specsArray.push(
            this.fb.group({
              title_en: [spec.title_en],
              content_en: [spec.content_en],
            })
          );
        });

        // Patch colors
        const colorsArray = this.colors;
        colorsArray.clear();
        product.color?.forEach((color: any) => {
          colorsArray.push(
            this.fb.group({
              name_en: [color.name_en],
              color_code: [color.color_code],
            })
          );
        });

        // Patch sizes
        const sizesArray = this.sizes;
        sizesArray.clear();
        product.size?.forEach((s: any) => {
          sizesArray.push(
            this.fb.group({
              name_en: [s.name_en],
              price: [s.price],
            })
          );
        });

        const galleryArray = this.galleries;
        galleryArray.clear();
        this.productData.gallery?.forEach((img: any) => {
          galleryArray.push(
            this.fb.group({
              file: [null],
              url: [img.image],
              id: [img.id],
            })
          );
        });

        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching product:', err);
        this.loading = false;
      },
    });
  }

  getAllCategories() {
    this.productsService.getAllCategory('en').subscribe({
      next: (res: any[]) => {
        this.categories = res.map((item) => ({
          name: item.title,
          id: item.id,
        }));
      },
      error: (err) => console.error(err),
    });
  }

  getAllBrands() {
    this.productsService.getAllBrands('en').subscribe({
      next: (res: any[]) => {
        this.brands = res.map((item) => ({
          name: item.title,
          id: item.id,
        }));
      },
      error: (err) => console.error(err),
    });
  }

  // ====== Handlers ======
  onThumbnailChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.thumbnailFile = file;
      this.thumbnailPreview = URL.createObjectURL(file);
    }
  }

  onGalleryChange(event: any) {
    if (!event.target.files) return;
    const files = Array.from(event.target.files) as File[];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.galleries.push(
          this.fb.group({
            file: [file],
            url: [e.target.result],
            id: [null],
          })
        );
      };
      reader.readAsDataURL(file);
    });
  }

  updateGalleryFile(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const galleryCtrl = this.galleries.at(index);
      galleryCtrl.patchValue({
        file: file,
        url: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  }
  addGallery() {
    this.galleries.push(
      this.fb.group({
        file: [null],
        url: [''],
        id: [null],
      })
    );
  }

  // إزالة صورة
  removeGallery(index: number) {
    this.galleries.removeAt(index);
  }

  removeFormItem(formArray: FormArray, index: number) {
    formArray.removeAt(index);
  }

  addSpecification() {
    this.specifications.push(
      this.fb.group({
        title_en: [''],
        content_en: [''],
      })
    );
  }

  addColor() {
    this.colors.push(this.fb.group({ name_en: ['', [Validators.required]] }));
  }

  addSize() {
    this.sizes.push(this.fb.group({ name_en: ['', [Validators.required]] }));
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    this.loading = true;

    const formData = new FormData();
    const f = this.productForm.value;

    formData.append('title_en', f.title_en);
    formData.append('description_en', f.description_en);
    formData.append('category', f.category);
    formData.append('brand', f.brand);
    formData.append('stock_qty', f.stock_qty);
    formData.append('price_EGP', f.price_EGP);
    formData.append('sku', f.sku);
    formData.append('is_new', f.is_new_collections);

    if (this.thumbnailFile) {
      formData.append('image', this.thumbnailFile, this.thumbnailFile.name);
    }

    let excistGallery: any[] = [];

    f.galleries.forEach((g: any) => {
      if (g.file) {
        formData.append('gallery', g.file, g.file.name);
      } else if (g.id) {
        excistGallery.push(g.id);
      }
    });

    formData.append('gallery_gid', JSON.stringify(excistGallery));

    formData.append('specifications', JSON.stringify(f.specifications));
    formData.append('colors', JSON.stringify(f.colors));
    formData.append('sizes', JSON.stringify(f.sizes));

    // 🔹 Uncomment this to call API
    this.adminDashboardService
      .updateProduct(this.productId, formData)
      .subscribe({
        next: (res) => {
          this._ToastrService.success('Product updated successfully');
          this.loading = false;
        },
        error: (err) => {
          this._ToastrService.error('Error updating product');
          this.loading = false;
        },
      });
  }
}
