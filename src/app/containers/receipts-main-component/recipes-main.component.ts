import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NUMBERS } from 'app/constants/number.constants';
import { CartService } from 'app/services/cart.service';
import { LoadingService } from 'app/services/loading.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { Article, Category, Recipe, User } from "app/models/cart.models";
import { ModalService } from 'app/services/modal.service';
import { DEFAULT_MODAL_OPTIONS } from 'app/models/modal.model';
import { getNewRecipe } from 'app/utils/cart.utils';
import { SocialService } from 'app/services/social.service';
import { TOAST_STATE, ToastService } from 'app/services/toast.service';
import { stringFrom } from 'app/utils/string.utils';
import { StatusService } from 'app/services/status.service';
import { AddRecipeComponent } from 'app/components/add-recipe/add-recipe.component';
import { FormControl } from '@angular/forms';
import { RecipeComponent } from 'app/components/recipe/recipe.component';
import { CartOption, SelectComponent } from 'app/components/select/select.component';

@Component({
  selector: 'app-recipes-main-component',
  templateUrl: './recipes-main.component.html',
  styleUrl: './recipes-main.component.scss',
  standalone: true,
  imports: [
    TranslateModule,
    RecipeComponent,
    SelectComponent,
  ]
})

// This component is used to display the main list of recipes
export class RecipesMainComponent implements OnInit{

  @ViewChild('recipe', { static: false}) recipe!: RecipeComponent;

  swLoadingFinished = false;
  recipesOptions: CartOption[] = [];
  selectedRecipe: Recipe | undefined = undefined;
  articles: Article[] = [];
  categories: Category[] = [];
  user!: User;
  control = new FormControl();

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

  // Show a modal to add a new recipe
  handleNewRecipe(): void {
    this.modalService.open(AddRecipeComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { userId: this.user.id },
      prevenCloseOutside: true,
    });
  }

  // Show a modal to edit the selected recipe
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

  // This function is used to get the user from the social service
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

  // Load the data from the cart service by the forjJoin operator that will get the articles, categories and recipes
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

  // handle the recipes response and set the selected recipe
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

  // Create a new recipe and set it as the selected recipe when there are no recipes
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

  // Get the recipes options to display in the select component
  private getRecipesOptions(recipes: Recipe[]): CartOption[] {
    return recipes.map((recipe: Recipe) => ({
      value: stringFrom(recipe.id),
      label: recipe.name,
      selected: recipe.id === this.selectedRecipe?.id,
    }));
  }
}
