import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../dto/product.dto';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductAdminEditComponent } from '../product-admin-edit/product-admin-edit.component';
import { ProductAdminCreateComponent } from '../product-admin-create/product-admin-create.component';
import { ProductAdminDeleteComponent } from '../product-admin-delete/product-admin-delete.component';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../dto/category.dto';
import { Brand } from '../../../dto/brand.dto';
import { CategoryService } from '../../../services/admin/category.service';
import { BrandService } from '../../../services/admin/brand.service';

@Component({
  selector: 'app-product-admin',
  imports: [CommonModule, RouterModule, MatDialogModule,FormsModule],
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.scss']
})
export class ProductAdminComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  allProducts: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];
  totalProducts = 0;

  // Search and filter properties
  searchTerm = '';
  selectedCategory = '';
  selectedBrand = '';
  sortBy = 'name';
  viewMode: 'grid' | 'table' = 'grid';

  constructor(
    private productsService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getProducts(this.currentPage);
    this.loadCategories();
    this.loadBrands();
  }

  getProducts(page: number): void {
    const itemsPerPage = 50; // Tăng từ 10 lên 50 sản phẩm mỗi trang
    this.productsService.getProducts(page, itemsPerPage).subscribe(response => {
      this.products = response.items;
      this.allProducts = response.items;
      this.filteredProducts = response.items;
      this.totalProducts = response.total;
      this.totalPages = Math.ceil(response.total / itemsPerPage);
      this.currentPage = page;
      // Chỉ hiển thị tối đa 10 trang xung quanh trang hiện tại
      this.pages = this.getVisiblePages();
      this.applyFilters();
    });
  }

  // Tính toán các trang cần hiển thị (chỉ hiển thị một phần, không phải tất cả)
  getVisiblePages(): number[] {
    const maxVisiblePages = 10; // Chỉ hiển thị tối đa 10 trang
    const pages: number[] = [];
    
    if (this.totalPages <= maxVisiblePages) {
      // Nếu tổng số trang nhỏ hơn maxVisiblePages, hiển thị tất cả
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
    
    // Tính toán trang đầu và trang cuối cần hiển thị
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    // Điều chỉnh nếu gần cuối danh sách
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Thêm trang đầu tiên
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push(-1); // -1 đại diện cho "..."
      }
    }
    
    // Thêm các trang ở giữa
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Thêm trang cuối cùng
    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        pages.push(-1); // -1 đại diện cho "..."
      }
      pages.push(this.totalPages);
    }
    
    return pages;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === -1) return; // -1 là dấu "..."
    this.getProducts(page);
    // Scroll to top khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openEditDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductAdminEditComponent, {
      width: '90vw',
      maxWidth: '1200px',
      height: '90vh',
      maxHeight: '800px',
      data: { id: product.id },
      autoFocus: true,
      restoreFocus: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProducts(this.currentPage);
      }
    });
  }
  openDeleteDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductAdminDeleteComponent, {
      width: '700px',
      data: { id: product.id, name: product.name }  // Truyền id và name
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProducts(this.currentPage); // refresh danh sách sản phẩm sau khi xóa
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ProductAdminCreateComponent, {
      width: '90vw',
      maxWidth: '1200px',
      height: '90vh',
      maxHeight: '800px',
      data: {} 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProducts(this.currentPage); 
      }
    });
  }

  // Load categories and brands
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe(brands => {
      this.brands = brands;
    });
  }

  // Search and filter methods
  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.products];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product => 
        product.categoryId === parseInt(this.selectedCategory)
      );
    }

    // Apply brand filter
    if (this.selectedBrand) {
      filtered = filtered.filter(product => 
        product.brandId === parseInt(this.selectedBrand)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'id':
          return a.id - b.id;
        default:
          return 0;
      }
    });

    this.filteredProducts = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.sortBy = 'name';
    this.filteredProducts = [...this.products];
  }

  toggleView(): void {
    this.viewMode = this.viewMode === 'grid' ? 'table' : 'grid';
  }

  getCategoryName(categoryId: number | undefined): string {
    if (!categoryId) return 'N/A';
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'N/A';
  }

  getBrandName(brandId: number | undefined): string {
    if (!brandId) return 'N/A';
    const brand = this.brands.find(b => b.id === brandId);
    return brand ? brand.name : 'N/A';
  }

  // Get full image URL from assets
  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return 'assets/img/placeholder.jpg';
    
    // Nếu đã là URL đầy đủ (http/https), trả về như cũ (cho trường hợp ảnh external)
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Nếu đã có đường dẫn assets, trả về như cũ
    if (imageUrl.startsWith('assets/')) {
      return imageUrl;
    }
    
    // Nếu chỉ là tên file, đọc từ thư mục assets/image/
    // Database chỉ lưu tên file (vd: "product-1.jpg")
    return `assets/image/${imageUrl}`;
  }

}
