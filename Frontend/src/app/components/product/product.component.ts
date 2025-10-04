import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../dto/product.dto';
import { Category } from '../../dto/category.dto';
import { Brand } from '../../dto/brand.dto';
import { ImageSearchService, SearchResult } from '../../services/image-search/image-search.service';
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  // for image-search
  loadingImage = false;
  imageUploadProgress = 0;

  searchTerm = '';
  selectedMinPrice = 0;
  selectedMaxPrice = Infinity;
  selectedPriceLabel = 'Product price range';
  selectedCategoryId: number | null = null;
  selectedBrandId: number | null = null;

  currentPage = 1;
  pageSize = 6;

  suggestedProducts: Product[] = [];
  showSuggestions = false;

  categories: Category[] = [];
  brands: Brand[] = [];

  previewUrl: string | null = null; 
  
  maxVisiblePages = 18;

  constructor(private productService: ProductService,private imgService: ImageSearchService,) {}

  ngOnInit(): void {
    this.loadAllProducts();
    this.loadCategories();
    this.loadBrands();
  }
  clearPreview(): void {
    this.previewUrl = null;
    // nếu muốn revert lại list sản phẩm gốc, bạn có thể:
    this.loadAllProducts();
    // hoặc xóa luôn filteredProducts:
    // this.products = [];
    // this.filteredProducts = [];
  }
  private loadAllProducts(): void {
    this.productService.getAllProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.applyFilters();
    });
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }

  private loadBrands(): void {
    this.productService.getBrands().subscribe((data: Brand[]) => {
      this.brands = data;
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter((p) => {
      const matchName = p.name
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchPrice =
        p.price >= this.selectedMinPrice && p.price <= this.selectedMaxPrice;
      const matchCategory = this.selectedCategoryId
        ? p.categoryId === this.selectedCategoryId
        : true;
      const matchBrand = this.selectedBrandId
        ? p.brandId === this.selectedBrandId
        : true;
      return matchName && matchPrice && matchCategory && matchBrand;
    });
    this.currentPage = 1;
  }

  searchByName(): void {
    this.searchTerm = this.searchTerm.trim();
    this.applyFilters();
    this.showSuggestions = false;
  }

  onSearchInputChange(): void {
    if (this.searchTerm.trim() === '') {
      this.suggestedProducts = [];
      this.showSuggestions = false;
    } else {
      this.productService
        .getProductsByName(this.searchTerm)
        .subscribe((data) => {
          this.suggestedProducts = data.slice(0, 20);
          this.showSuggestions = this.suggestedProducts.length > 0;
        });
    }
  }
  onImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];

  // 1) Preview ngay
  const reader = new FileReader();
  reader.onload = () => this.previewUrl = reader.result as string;
  reader.readAsDataURL(file);

  // 2) Search bằng image rồi gán về products + filteredProducts
  this.loadingImage = true;
  this.imageUploadProgress = 0;

  // Ví dụ searchByImageWithProgress vẫn phát progress, 
  // nhưng kết quả cuối cùng chúng ta chỉ cần gán một lần:
  this.imgService.searchByImageWithProgress(file).subscribe({
    next: percent => {
      this.imageUploadProgress = percent;
      if (percent === 100) {
        // Khi upload xong, lấy kết quả
        this.imgService.searchByImage(file).subscribe({
          next: (results: SearchResult[]) => {
            // Map về Product[]
            const mapped: Product[] = results.map(r => ({
              id:           r.id!,
              name:         r.name!,
              price:        r.price!,
              image:        r.image,
              description:  r.description!,
              categoryId:    0,
              brandId:       0,
            }));
            // Gán luôn vào products và applyFilters()
            this.products = mapped;
            this.applyFilters();   // -> filteredProducts = mapped
            this.currentPage = 1;
            this.loadingImage = false;
          },
          error: err => {
            console.error(err);
            this.loadingImage = false;
          }
        });
      }
    },
    error: err => {
      console.error(err);
      this.loadingImage = false;
    }
  });
}


  selectSuggestion(name: string): void {
    this.searchTerm = name;
    this.showSuggestions = false;
  }

  setPriceRange(min: number, max: number, label: string): void {
    this.selectedMinPrice = min;
    this.selectedMaxPrice = max;
    this.selectedPriceLabel = label;
    this.applyFilters();
  }

  filterByCategory(catId: number): void {
    this.selectedCategoryId = catId;
    this.applyFilters();
  }

  filterByBrand(brandId: number): void {
    this.selectedBrandId = brandId;
    this.applyFilters();
  }
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const max = this.maxVisiblePages;
    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const half = Math.floor(max / 2);
    let start = this.currentPage - half + 1;
    let end = this.currentPage + half;

    if (start < 1) {
      start = 1;
      end = max;
    } else if (end > total) {
      end = total;
      start = total - max + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  pageChanged(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }
  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }
}
