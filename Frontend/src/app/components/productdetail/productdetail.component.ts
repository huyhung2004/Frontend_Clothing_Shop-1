import { Component, OnInit } from '@angular/core';
import { Product } from '../../dto/product.dto';
import { ProductImage } from '../../dto/productImage.dto';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductVariantService } from '../../services/productvariant.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService, Review } from '../../services/account.service';

interface ProductVariant {
  id: number;
  color: string;
  size: string;
  price: number;
  stockQuantity: number;
  productId: number;
}

@Component({
  selector: 'app-productdetail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.scss'],
})
export class ProductdetailComponent implements OnInit {
  product!: Product;
  productImages: ProductImage[] = [];
  quantity: number = 1;

  sizes: string[] = [];
  colors: string[] = [];
  selectedSize: string | null = null;
  selectedColor: string | null = null;
  currentStock: number = 0;

  variants: ProductVariant[] = [];
  reviews: Review[] = [];

  private baseImageUrl = 'https://localhost:7163'; // your backend URL

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private productVariantService: ProductVariantService,
    private accountService: AccountService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductDetail(+id).subscribe((data) => {
        this.product = data.product;
        this.productImages = data.anhSps;

        this.productVariantService.getVariantsByProduct(+id).subscribe((variants) => {
          if (Array.isArray(variants) && variants.length) {
            this.variants = variants;

            const sizeSet = new Set<string>();
            const colorSet = new Set<string>();
            variants.forEach((v) => {
              if (v.size) sizeSet.add(v.size);
              if (v.color) colorSet.add(v.color);
            });

            this.sizes = [...sizeSet];
            this.colors = [...colorSet];

            // Optionally select default first color & size
            this.selectedColor = this.colors[0] ?? null;
            this.selectedSize = this.sizes[0] ?? null;

            this.updateCurrentStock();
          }
        });
      });

      this.loadReviews(+id);
    }
  }

  loadReviews(productId: number): void {
    this.accountService.getReviewsByProduct(productId).subscribe({
      next: (data) => {
        this.reviews = data;
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
      },
    });
  }

  onVideoPlay(event: Event): void {
    const playingVideo = event.target as HTMLVideoElement;
    const reviewVideos = document.querySelectorAll('.review-video') as NodeListOf<HTMLVideoElement>;
    reviewVideos.forEach((video) => {
      if (video !== playingVideo) video.pause();
    });
  }

  onSelectSize(size: string | null): void {
    this.selectedSize = size;
    this.updateCurrentStock();
  }

  onSelectColor(color: string | null): void {
    this.selectedColor = color;
    if (color) this.updateCurrentStock();
  }

  updateCurrentStock(): void {
    if (!this.selectedColor || !this.selectedSize) {
      this.currentStock = 0;
      return;
    }
    const variant = this.variants.find(
      (v) => v.color === this.selectedColor && v.size === this.selectedSize
    );
    this.currentStock = variant ? variant.stockQuantity : 0;

    if (this.quantity > this.currentStock) this.quantity = this.currentStock;
  }

  onMinus(): void {
    if (this.quantity > 1) this.quantity--;
  }

  onPlus(): void {
    if (this.quantity < this.currentStock) this.quantity++;
  }

  canPurchase(): boolean {
    return this.currentStock > 0;
  }

  addToCart(): void {
    if (!this.canPurchase()) return;

    this.cartService.addCart(
      this.product.id,
      this.quantity,
      this.selectedColor ?? '',
      this.product.price
    ).subscribe({
      next: () => alert('Thêm vào giỏ hàng thành công!'),
      error: (err) => {
        console.error('Add to cart error:', err);
        alert('Thêm vào giỏ hàng thất bại, vui lòng thử lại.');
      },
    });
  }

  buyNow(): void {
    if (!this.canPurchase()) return;

    this.cartService.buyNow(
      this.product.id,
      this.quantity,
      this.selectedColor ?? '',
      this.product.price
    ).subscribe({
      next: (res) => {
        this.router.navigate(['/checkoutbuynow', res.orderId], { replaceUrl: true });
      },
      error: (err) => {
        console.error('Buy now error:', err);
        alert('Xử lý mua ngay thất bại.');
      },
    });
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return 'assets/img/placeholder.jpg';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
    return this.baseImageUrl + imageUrl;
  }
}
