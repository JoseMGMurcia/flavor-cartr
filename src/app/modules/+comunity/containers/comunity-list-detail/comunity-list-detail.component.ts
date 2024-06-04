import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicListComponent } from '@shared/components/public-list/public-list.component';
import { ROUTES } from '@shared/constants/routes.constants';
import { Article, Category, List } from '@shared/models/cart.models';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { catchError, finalize, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-comunity-list-detail',
  templateUrl: './comunity-list-detail.component.html',
  styleUrl: './comunity-list-detail.component.scss'
})
export class ComunityListDetailComponent implements OnInit{
  @ViewChild('listComponent', { static: false}) listComponent!: PublicListComponent;

  articles!: Article[];
  categories!: Category[];
  list!: List | undefined;

  private _destroyRef = inject(DestroyRef);
  private _listId!: string;

  constructor(
    private cartService: CartService,
    private loading: LoadingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    this.fetch();
  }

  handleCancel(): void {
    this.router.navigate([ROUTES.COMUNITY.path]);
  }

  private fetch(): void {
    this._listId = this.route.snapshot.params['id'];
    this.loadData();
  }


  private loadData(): void {
    this.loading.show();
    forkJoin([
      this.cartService.getArticles()
        .pipe(catchError(() => of([])),
          takeUntilDestroyed(this._destroyRef)
        ),
      this.cartService.getCategories()
        .pipe(catchError(() => of([])),
          takeUntilDestroyed(this._destroyRef)
        ),
      this.cartService.getListById(this._listId)
        .pipe(catchError(() => of(undefined)),
          takeUntilDestroyed(this._destroyRef)
        ),
    ])
      .pipe(finalize(() => this.loading.hide()))
      .subscribe(([articles, categories, list]: [Article[], Category[], List | undefined]) => {
        this.listComponent.articles = articles;
        this.listComponent.categories = categories;
        this.listComponent.list = list;
        this.listComponent.updatetable();
      })
  }
}
