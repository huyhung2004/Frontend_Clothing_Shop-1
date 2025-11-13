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
  selectedPriceLabel = 'Khoảng giá sản phẩm';
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
  
  // Base URL for images
  private baseImageUrl = 'https://localhost:7163';

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
    // Sử dụng phân trang từ server thay vì load tất cả
    this.loadProducts(this.currentPage);
  }

  private loadProducts(page: number): void {
    this.productService.getProducts(page, this.pageSize).subscribe(response => {
      this.products = response.items;
      this.totalProductsFromServer = response.total;
      this.currentPage = page;
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
    // Filter trên client-side cho các sản phẩm đã load
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
    // Reset về trang 1 khi filter
    this.currentPage = 1;
  }

  searchByName(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
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
    // Toggle: if already selected, remove filter; otherwise, set filter
    if (this.selectedCategoryId === catId) {
      this.selectedCategoryId = null;
    } else {
      this.selectedCategoryId = catId;
    }
    this.applyFilters();
  }

  filterByBrand(brandId: number): void {
    // Toggle: if already selected, remove filter; otherwise, set filter
    if (this.selectedBrandId === brandId) {
      this.selectedBrandId = null;
    } else {
      this.selectedBrandId = brandId;
    }
    this.applyFilters();
  }
  totalProductsFromServer: number = 0;
  
  get totalPages(): number {
    // Nếu có filter/search, tính dựa trên filteredProducts
    if (this.searchTerm || this.selectedCategoryId || this.selectedBrandId || 
        this.selectedMinPrice > 0 || this.selectedMaxPrice < Infinity) {
      return Math.ceil(this.filteredProducts.length / this.pageSize);
    }
    // Nếu không có filter, dùng total từ server
    return Math.ceil(this.totalProductsFromServer / this.pageSize);
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
    if (page < 1) return;
    // Load sản phẩm từ server khi chuyển trang
    this.loadProducts(page);
    // Scroll to top khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  get paginatedProducts(): Product[] {
    // Nếu có filter/search, hiển thị filteredProducts (đã được filter)
    // Nếu không có filter, hiển thị products trực tiếp (đã được phân trang từ server)
    if (this.searchTerm || this.selectedCategoryId || this.selectedBrandId || 
        this.selectedMinPrice > 0 || this.selectedMaxPrice < Infinity) {
      // Có filter: phân trang trên client
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
    } else {
      // Không có filter: dùng products từ server (đã được phân trang)
      return this.filteredProducts;
    }
  }


  // Get full image URL
  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return 'assets/img/placeholder.jpg';
    // Nếu đã là URL đầy đủ (http/https), trả về như cũ
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // Nếu bắt đầu bằng /, là relative URL, thêm base URL
    if (imageUrl.startsWith('/')) {
      return this.baseImageUrl + imageUrl;
    }
    // Nếu chỉ là tên file, thêm đường dẫn đầy đủ
    return `${this.baseImageUrl}/uploads/image/${imageUrl}`;
  }
}
