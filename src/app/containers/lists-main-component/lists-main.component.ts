import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NUMBERS } from 'app/constants/number.constants';
import { CartService } from 'app/services/cart.service';
import { LoadingService } from 'app/services/loading.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { Article, Category, List, User } from "app/models/cart.models";
import { ModalService } from 'app/services/modal.service';
import { DEFAULT_MODAL_OPTIONS } from 'app/models/modal.model';
import { AddListComponent } from 'app/components/add-list/add-list.component';
import { getNewList } from 'app/utils/cart.utils';
import { SocialService } from 'app/services/social.service';
import { TOAST_STATE, ToastService } from 'app/services/toast.service';
import { stringFrom } from 'app/utils/string.utils';
import { StatusService } from 'app/services/status.service';
import { ListComponent } from 'app/components/list/list.component';
import { FormControl } from '@angular/forms';
import { CartOption, SelectComponent } from 'app/components/select/select.component';

@Component({
  selector: 'app-lists-main-component',
  templateUrl: './lists-main.component.html',
  styleUrl: './lists-main.component.scss',
  standalone: true,
  imports: [
    TranslateModule,
    SelectComponent,
    ListComponent,
  ]
})

// This component is used to display the main list of lists
export class ListsMainComponent implements OnInit{

  @ViewChild('list', { static: false}) list!: ListComponent;

  swLoadingFinished = false;
  listsOptions: CartOption[] = [];
  selectedList: List | undefined = undefined;
  articles: Article[] = [];
  categories: Category[] = [];
  user!: User;
  control = new FormControl();

  private _lists: List[] = [];
  private _destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.fetch();
  }

  constructor(
    private translate: TranslateService,
    private loading: LoadingService,
    private cartService: CartService,
    private modalService: ModalService,
    private socialService: SocialService,
    private toast: ToastService,
    private statusService: StatusService,
  ) { }

  // Show a modal to add a new list
  handleNewList(): void {
    this.modalService.open(AddListComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { userId: this.user.id },
      prevenCloseOutside: true,
    });
  }

  // Show a modal to edit the current list
  handleListChange(listId: string): void {
    this.selectedList = this._lists.find((list: List) => list.id === listId);
    if (!this.selectedList) {
      return;
    }
    this.list?.setData(this.selectedList, this.articles, this.categories);
  }

  private fetch(): void {
    this.getUser();
    this.asingEvents();
  }

  // This function is used to subscribe to the status service and reload the lists
  private asingEvents(): void {
    this.statusService.reloadListsPending$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((pending) => {
        if(pending){
          this.loadData();
        }
      });
  }

  // Get the user from the social service
  private getUser(): void {
    this.socialService.user$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (user) => {
          if(user) {
            this.user = user;
            this.loadData();
          } else {
            this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.USER'));
          }
        },
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.USER')),
      });
  }


  // Load the data from the cart service by the forjJoin operator that will get the articles, categories and lists
  // and then it will handle the response all at once
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
      this.cartService.getListsByUser(this.user.id)
        .pipe(catchError(() => of([])),
          takeUntilDestroyed(this._destroyRef)
        ),
    ])
      .pipe(finalize(() => this.loading.hide()))
      .subscribe(([articles, categories, lists]: [Article[], Category[], List[]]) => {
        this.articles = articles;
        this.categories = categories;
        this._lists = lists;
        this.handleLists(lists);
      })
  }

  // This function is used to handle the lists that are returned from the server
  private handleLists(lists: List[]): void {
    if (lists.length === NUMBERS.N_0) {
      this.createInitialList();
      return;
    }
        const selectedList = this._lists.find((list: List) => list.id === this.selectedList?.id);
    this.selectedList = selectedList || lists[NUMBERS.N_0];
    this.listsOptions = this.getListOptions(lists);
    this.list?.setData(this.selectedList, this.articles, this.categories);
  }

  // This function is used to create a new list when there are no lists
  private createInitialList(): void {
    const list: List = getNewList(this.translate, this.user.id);
    this.loading.show();
    this.cartService.postList(list)
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: () => {
          this._lists.push(list);
          this.listsOptions = this.getListOptions(this._lists);
          this.selectedList = list;
          this.list?.setData(this.selectedList, this.articles, this.categories);
        },
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.CREATE_LIST_KO')),
      });
  }

  // This function is used to get the options for the lists
  private getListOptions(lists: List[]): CartOption[] {
    return lists.map((list: List) => ({
      value: stringFrom(list.id),
      label: list.name,
      selected: list.id === this.selectedList?.id,
    }));
  }
}
