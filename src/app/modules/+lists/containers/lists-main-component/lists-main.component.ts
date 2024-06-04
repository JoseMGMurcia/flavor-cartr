import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NUMBERS } from '@shared/constants/number.constants';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { Article, Category, List, User } from '@shared/models/cart.models';
import { ModalService } from '@shared/services/modal.service';
import { DEFAULT_MODAL_OPTIONS } from '@shared/models/modal.model';
import { AddListComponent } from '@modules/+lists/components/add-list/add-list.component';
import { getNewList } from '@shared/utils/cart.utils';
import { SocialService } from '@shared/services/social.service';
import { TOAST_STATE, ToastService } from '@shared/services/toast.service';
import { CartOption } from '@shared/components/select/select.component';
import { stringFrom } from '@shared/utils/string.utils';
import { StatusService } from '@shared/services/status.service';
import { ListComponent } from '@shared/components/list/list.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-lists-main-component',
  templateUrl: './lists-main.component.html',
  styleUrl: './lists-main.component.scss',
})
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

  handleNewList(): void {
    this.modalService.open(AddListComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { userId: this.user.id },
      prevenCloseOutside: true,
    });
  }

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

  private asingEvents(): void {
    this.statusService.reloadListsPending$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((pending) => {
        if(pending){
          this.loadData();
        }
      });
  }

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

  private getListOptions(lists: List[]): CartOption[] {
    return lists.map((list: List) => ({
      value: stringFrom(list.id),
      label: list.name,
      selected: list.id === this.selectedList?.id,
    }));
  }
}
