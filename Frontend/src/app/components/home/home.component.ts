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

  private baseImageUrl = 'https://localhost:7163';

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
    this.http.get<any>('https://localhost:7163/api/products/all').subscribe({
      next: (data) => {
        this.products = data.$values ? data.$values : data;
        console.log('Products:', this.products);
        
        // Reinitialize swiper after products are loaded
        setTimeout(() => {
          this.initSwiper();
        }, 100);
      },
      error: (error) => console.error('Error fetching products:', error),
    });
  }

  // Get full image URL
  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return 'assets/img/placeholder.jpg';
    // If already full URL (http/https), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // If relative URL, add base URL
    return this.baseImageUrl + imageUrl;
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