import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NUMBERS } from '@shared/constants/number.constants';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { Article, Category, List, Recipe, User } from '@shared/models/cart.models';
import { ModalService } from '@shared/services/modal.service';
import { DEFAULT_MODAL_OPTIONS } from '@shared/models/modal.model';
import { AddListComponent } from '@modules/+lists/components/add-list/add-list.component';
import { getNewRecipe } from '@shared/utils/cart.utils';
import { SocialService } from '@shared/services/social.service';
import { TOAST_STATE, ToastService } from '@shared/services/toast.service';
import { CartOption } from '@shared/components/select/select.component';
import { stringFrom } from '@shared/utils/string.utils';
import { StatusService } from '@shared/services/status.service';
import { ListComponent } from '@shared/components/list/list.component';
import { RecipeComponent } from '@shared/components/recipe/recipe.component';
import { AddRecipeComponent } from '@modules/+lists/components/add-recipe/add-recipe.component';

@Component({
  selector: 'app-recipes-main-component',
  templateUrl: './recipes-main.component.html',
  styleUrl: './recipes-main.component.scss',
})
export class RecipesMainComponent implements OnInit{

  @ViewChild('recipe', { static: false}) recipe!: RecipeComponent;

  swLoadingFinished = false;
  recipesOptions: CartOption[] = [];
  selectedRecipe: Recipe | undefined = undefined;
  articles: Article[] = [];
  categories: Category[] = [];
  user!: User;

  private _recipes: Recipe[] = [];
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

  handleNewRecipe(): void {
    this.modalService.open(AddRecipeComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { userId: this.user.id },
      prevenCloseOutside: true,
    });
  }

  handleRecipeChange(recipeId: string): void {
    this.selectedRecipe = this._recipes.find((recipe: Recipe) => recipe.id === recipeId);
    if (!this.selectedRecipe) {
      return;
    }
    this.recipe?.setData(this.selectedRecipe, this.articles, this.categories);
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
      this.cartService.getRecipesByUser(this.user.id)
        .pipe(catchError(() => of([])),
          takeUntilDestroyed(this._destroyRef)
        ),
    ])
      .pipe(finalize(() => this.loading.hide()))
      .subscribe(([articles, categories, recipes]: [Article[], Category[], Recipe[]]) => {
        this.articles = articles;
        this.categories = categories;
        this._recipes = recipes;
        this.handleRecipes(recipes);
      })
  }

  private handleRecipes(recipes: Recipe[]): void {
    if (recipes.length === NUMBERS.N_0) {
      this.createInitialRecipe();
      return;
    }
    const selectedRecipe = this._recipes.find((recipe: Recipe) => recipe.id === this.selectedRecipe?.id);
    this.selectedRecipe = selectedRecipe || recipes[NUMBERS.N_0];
    this.recipesOptions = this.getRecipesOptions(recipes);
    this.recipe?.setData(this.selectedRecipe, this.articles, this.categories);
  }

  private createInitialRecipe(): void {
    const recipe: Recipe = getNewRecipe(this.translate, this.user.id);
    this.loading.show();
    this.cartService.postRecipe(recipe)
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: () => {
          this._recipes.push(recipe);
          this.recipesOptions = this.getRecipesOptions(this._recipes);
          this.selectedRecipe = recipe;
          this.recipe?.setData(this.selectedRecipe, this.articles, this.categories);
        },
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.CREATE_RECIPE_KO')),
      });
  }

  private getRecipesOptions(recipes: Recipe[]): CartOption[] {
    return recipes.map((recipe: Recipe) => ({
      value: stringFrom(recipe.id),
      label: recipe.name,
      selected: recipe.id === this.selectedRecipe?.id,
    }));
  }
}
