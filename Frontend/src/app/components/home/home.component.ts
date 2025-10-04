import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// declare var $: any; // Import jQuery nếu bạn đang dùng jQuery
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule], // Đúng cách
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  products: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.http.get<any>('https://localhost:7163/api/products/all').subscribe({
      next: (data) => {
        console.log(data);
        // Kiểm tra nếu có thuộc tính $values thì gán nó cho products, ngược lại gán data trực tiếp
        this.products = data.$values ? data.$values : data;
      },
      error: (error) => {
        console.error('Lỗi khi lấy sản phẩm:', error);
      },
    });
  }
  sliderImages = [
    {
      imageUrl: 'assets/img/slider-1.jpg',
      caption: 'Some text goes here that describes the image',
    },
    // {
    //   imageUrl: 'assets/img/slider-2.jpg',
    //   caption: 'Some text goes here that describes the image',
    // },
    // {
    //   imageUrl: 'assets/img/slider-3.jpg',
    //   caption: 'Some text goes here that describes the image',
    // },
  ];

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
      title: 'Secure Payment',
      description: 'Lorem ipsum dolor sit amet consectetur elit',
    },
    {
      icon: 'fa fa-truck',
      title: 'Worldwide Delivery',
      description: 'Lorem ipsum dolor sit amet consectetur elit',
    },
    {
      icon: 'fa fa-sync-alt',
      title: '90 Days Return',
      description: 'Lorem ipsum dolor sit amet consectetur elit',
    },
    {
      icon: 'fa fa-comments',
      title: '24/7 Support',
      description: 'Lorem ipsum dolor sit amet consectetur elit',
    },
  ];

  categories = [
    {
      imageUrl: 'assets/img/category-1.jpg',
      caption: 'Some text goes here that describes the image',
      heightClass: 'ch-400',
    },
    {
      imageUrl: 'assets/img/category-2.jpg',
      caption: 'Some text goes here that describes the image',
      heightClass: 'ch-400',
    },
    {
      imageUrl: 'assets/img/category-3.jpg',
      caption: 'Some text goes here that describes the image',
      heightClass: 'ch-400',
    },
    {
      imageUrl: 'assets/img/category-2.jpg',
      caption: 'Some text goes here that describes the image',
      heightClass: 'ch-400',
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
}
