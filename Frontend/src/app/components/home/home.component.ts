import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare var Swiper: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  products: any[] = [];

  brandImages = [
    'assets/img/brand-1.png',
    'assets/img/brand-2.png',
    'assets/img/brand-3.png',
    'assets/img/brand-4.png',
    'assets/img/brand-5.png',
    'assets/img/brand-6.png',
  ];

  features = [
    {
      icon: 'fab fa-cc-mastercard',
      title: 'Thanh toán an toàn',
      description: 'Giao dịch bảo mật tuyệt đối.',
    },
    {
      icon: 'fa fa-truck',
      title: 'Giao hàng mọi nơi',
      description: 'Nhanh chóng, đúng hẹn.',
    },
    {
      icon: 'fa fa-sync-alt',
      title: 'Đổi trả trong 90 ngày',
      description: 'Đổi trả dễ dàng, linh hoạt.',
    },
    {
      icon: 'fa fa-comments',
      title: 'Hỗ trợ 24/7',
      description: 'Luôn sẵn sàng hỗ trợ bạn.',
    },
  ];  

  // products = [
  //   { id: 1, name: 'Product 1', image: 'product-1.jpg', price: 100 },
  //   { id: 2, name: 'Product 2', image: 'product-2.jpg', price: 150 },
  //   { id: 3, name: 'Product 3', image: 'product-3.jpg', price: 200 },
  // ];
  // ngAfterViewInit(): void {
  //   $('.header-slider').slick({
  //     infinite: true,
  //     slidesToShow: 1,
  //     slidesToScroll: 1,
  //     autoplay: true,
  //     autoplaySpeed: 3000,
  //     dots: true,
  //     arrows: true, // Hiển thị mũi tên
  //     prevArrow: '<button type="button" class="slick-prev">❮</button>',
  //     nextArrow: '<button type="button" class="slick-next">❯</button>',
  //   });
  //   $('.brand-slider').slick({
  //     infinite: true, // Lặp lại vô hạn
  //     slidesToShow: 5, // Số logo hiển thị trên một slide
  //     slidesToScroll: 1, // Dịch chuyển từng logo
  //     autoplay: true, // Tự động chạy
  //     autoplaySpeed: 0, // Không có độ trễ giữa các lần lặp
  //     speed: 3000, // Tốc độ chạy (ms)
  //     cssEase: 'linear', // Chạy mượt liên tục
  //     arrows: false, // Ẩn mũi tên điều hướng
  //     dots: false, // Ẩn chấm điều hướng
  //     pauseOnHover: false, // Không dừng khi hover
  //   });
  //   this.initSlickSlider();
  // }
  // initSlickSlider(): void {
  //   $('.product-slider').slick({
  //     infinite: true,
  //     slidesToShow: 4,
  //     slidesToScroll: 1,
  //     autoplay: true,
  //     autoplaySpeed: 3000,
  //     dots: false,
  //     arrows: true, // Hiển thị mũi tên
  //     prevArrow: '<button type="button" class="slick-prev">❮</button>',
  //     nextArrow: '<button type="button" class="slick-next">❯</button>',
  //     responsive: [
  //       { breakpoint: 1024, settings: { slidesToShow: 3 } },
  //       { breakpoint: 768, settings: { slidesToShow: 2 } },
  //       { breakpoint: 480, settings: { slidesToShow: 1 } },
  //     ],
  //   });
  // }

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  ngAfterViewInit(): void {
    // Initialize Swiper sliders after the view is loaded
    setTimeout(() => {
      this.initSwiper();
    }, 1000);
  }
  

 private initSwiper(): void {
  if (typeof Swiper !== 'undefined' && this.products.length > 0) {
    requestAnimationFrame(() => {
      new Swiper('.product-swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        speed: 600,

        // Autoplay configuration: swipe every 1 second (1000ms)
        autoplay: {
          delay: 1000,  // 1 second
          disableOnInteraction: false, // Keep autoplay even after user interaction
        },

        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },

        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },

        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        preloadImages: true,
        updateOnWindowResize: true,
        resizeObserver: true,

        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',

        touchStartPreventDefault: false,
        touchMoveStopPropagation: true,

        breakpoints: {
          480: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 25 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
          1200: { slidesPerView: 4, spaceBetween: 30 },
        },

        on: {
          init: function () {
            console.log('Swiper initialized with autoplay every 1 second');
          },
        },
      });
    });
  }

}





  // private initSwiper(): void {
  //   if (typeof Swiper !== 'undefined' && this.products.length > 0) {
  //     requestAnimationFrame(() => {
  //       new Swiper('.product-swiper', {
  //         loop: true,
  //         slidesPerView: 1,
  //         spaceBetween: 30,
  //         speed: 500, // Optimal speed for both directions
  //         resistance: true,
  //         resistanceRatio: 0.7, // More consistent resistance
          
  //         // Direction and language settings
  //         direction: 'horizontal', // Explicitly set direction
  //         rtl: false, // Ensure LTR mode
          
  //         // Touch settings for consistent behavior
  //         touchRatio: 1, // Equal sensitivity for both directions
  //         touchAngle: 45, // Standard angle
  //         simulateTouch: true, // Enable mouse drag
  //         allowTouchMove: true,
          
  //         // Specific touch event handling
  //         touchStartPreventDefault: false, // Allow default touch behavior
  //         touchMoveStopPropagation: false,
          
  //         // Edge resistance for consistent feel
  //         edgeSwipeDetection: true,
  //         edgeSwipeThreshold: 20,
          
  //         // Navigation
  //         navigation: {
  //           nextEl: '.swiper-button-next',
  //           prevEl: '.swiper-button-prev',
  //           disabledClass: 'swiper-button-disabled',
  //         },
          
  //         // Pagination
  //         pagination: {
  //           el: '.swiper-pagination',
  //           clickable: true,
  //           dynamicBullets: false, // Can cause issues with left swipe
  //         },
          
  //         // Breakpoints
  //         breakpoints: {
  //           480: { slidesPerView: 1, spaceBetween: 20 },
  //           768: { slidesPerView: 2, spaceBetween: 25 },
  //           1024: { slidesPerView: 3, spaceBetween: 30 },
  //           1200: { slidesPerView: 4, spaceBetween: 30 },
  //         },

  //       });
  //     });
  //   }
  // }

  getAllProducts(): void {
    // Chỉ lấy 24 sản phẩm đầu tiên cho trang Home để tránh lag
    this.http.get<any>('https://localhost:7163/api/products/paged?page=1&pageSize=24').subscribe({
      next: (data) => {
        // API trả về { items: [...], total: number }
        this.products = data.items || data.$values || data;
        console.log('Products loaded for home:', this.products.length);
        
        // Reinitialize swiper after products are loaded
        setTimeout(() => {
          this.initSwiper();
        }, 100);
      },
      error: (error) => console.error('Error fetching products:', error),
    });
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

  onProductClick(item: any): void {
    this.router.navigate(['/product-detail', item.id]);
  }
  
  onAddToCart(item: any, event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    console.log('Add to cart:', item.name);
    // Add to cart logic here
  }
}