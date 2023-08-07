import { Component, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { StorageService } from 'src/app/_services/storage.service';
import { Category } from 'src/app/models/category.model';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-products-list-by-category',
  templateUrl: './products-list-by-category.component.html',
  styleUrls: ['./products-list-by-category.component.css']
})
export class ProductsListByCategoryComponent implements OnInit {

  products?: Product[];
  categories: Category[] = []
  currentProduct: Product = {};
  @Input() selectedCategory : Category = {};

  currentIndex = -1;
  category : any;
  name = '';

  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private storageService: StorageService) { }

  ngOnInit(): void {
    this.productService.findByCategory(this.route.snapshot.params["categoryName"])
    .subscribe({
      next: (data: Product[] | undefined) => {
        this.products = data;
        console.log(data);
      },
      error: (e: any) => console.error(e)
    });
    
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
      //this.username = user.username;
    }
  }

  retrieveProducts(): void {

    this.productService.findByCategory(this.route.snapshot.params["categoryName"])
    .subscribe({
      next: (data: Product[] | undefined) => {
        this.products = data;
        console.log(data);
      },
      error: (e: any) => console.error(e)
    });
  }

  refreshList(): void {
    this.retrieveProducts();
    this.currentProduct = {};
    this.currentIndex = -1;
  }

  setActiveProduct(product: Product, index: number): void {
    this.currentProduct = product;
    this.currentIndex = index;
  
    this.router.navigate(['/products/'+this.currentProduct.id]);

  }
  setActiveCategory(category: any, index: number): void {

    this.selectedCategory = category;
    this.currentIndex = index;

    this.productService.findByCategory(this.route.snapshot.params["categoryName"])
    .subscribe({
      next: (data: Product[] | undefined) => {
        this.products = data;
        console.log(data);
      },
      error: (e: any) => console.error(e)
    });
  }
  removeAllProducts(): void {
    this.productService.deleteAll()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.refreshList();
        },
        error: (e) => console.error(e)
      });
  }

  searchName(): void {
    this.currentProduct = {};
    this.currentIndex = -1;

    if (this.name == '') {
      this.productService.findByCategory(this.route.snapshot.params["categoryName"])
        .subscribe({
          next: (data: Product[] | undefined) => {
            this.products = data;
            console.log(data);
          },
          error: (e: any) => console.error(e)
        });
    } else {
      this.productService.findByName(this.name)
        .subscribe({
          next: (data: Product[] | undefined) => {
            this.products = data;
            console.log(data);
          },
          error: (e: any) => console.error(e)
        });
    }
  }

  searchCategory(): void {
    this.currentProduct = {};
    this.currentIndex = -1;

    this.productService.findByCategory(this.route.snapshot.params["categoryName"])
      .subscribe({
        next: (data: Product[] | undefined) => {
          this.products = data;
          console.log(data);
        },
        error: (e: any) => console.error(e)
      });
  }
}