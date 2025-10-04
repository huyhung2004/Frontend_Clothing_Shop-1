import { Component, OnInit } from '@angular/core';
import { Product } from '../../dto/product.dto';
import { ProductImage } from '../../dto/productImage.dto';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService, Review } from '../../services/account.service';

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
  // Nếu có lựa chọn màu, bạn có thể lấy từ UI. Ở đây sử dụng giá trị mặc định.
  color: string = 'white';
  reviews: Review[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
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
      });
      // Lấy danh sách review của sản phẩm
      this.loadReviews(+id);
    }
  }
  loadReviews(productId: number): void {
    this.accountService.getReviewsByProduct(productId).subscribe({
      next: (data) => {
        this.reviews = data;
      },
      error: (err) => {
        console.error('Lỗi khi lấy review:', err);
      },
    });
  }
  onVideoPlay(event: Event): void {
    const playingVideo = event.target as HTMLVideoElement;
    // Ép kiểu danh sách các phần tử thành HTMLVideoElement
    const reviewVideos = document.querySelectorAll(
      '.review-video'
    ) as NodeListOf<HTMLVideoElement>;
    reviewVideos.forEach((video) => {
      if (video !== playingVideo) {
        video.pause();
      }
    });
  }

  onMinus(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onPlus(): void {
    this.quantity++;
  }

  addToCart(): void {
    // Gọi API thêm vào giỏ hàng
    this.cartService
      .addCart(this.product.id, this.quantity, this.color, this.product.price)
      .subscribe({
        next: (res) => {
          alert('Thêm vào giỏ hàng thành công!');
        },
        error: (err) => {
          console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', err);
          alert(
            'Thêm vào giỏ hàng thất bại , bạn phải thêm địa chỉ giao hàng mặc định trước'
          );
        },
      });
  }

  buyNow(): void {
    // Gọi API mua ngay
    this.cartService
      .buyNow(this.product.id, this.quantity, this.color, this.product.price)
      .subscribe({
        next: (res) => {
          // alert('Đơn hàng mua ngay được tạo thành công!');
          // Nếu muốn chuyển hướng tới trang Checkout, có thể làm như sau:
          console.log('Response from buyNow:', res.orderId);
          this.router.navigate(['/checkoutbuynow', res.orderId], {
            replaceUrl: true,
          });
        },
        error: (err) => {
          console.error('Lỗi khi xử lý mua ngay:', err);
          alert('Xử lý mua ngay thất bại');
        },
      });
  }
}
