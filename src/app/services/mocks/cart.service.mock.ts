import { Article, List, Price, Recipe, User } from "app/models/cart.models";
import { of } from "rxjs";
import { CartService } from "../cart.service";

class cartServiceStub {
  setToken() {}
  getArticles() { return of([])}
  postArticle() { return of({} as Article)}
  getArticleById() { return of({} as Article)}
  putArticle() { return of({} as Article)}
  getArticlesByCategory() { return of([])}

  getCategories() { return of([])}
  postCategory() { return of({})}
  getCategoryById() { return of({})}
  putCategory() { return of({})}

  getLists() { return of([])}
  getPublicLists() { return of([])}
  postList() { return of({} as List)}
  getListById() { return of({} as List)}
  putList() { return of({} as List)}
  getListsByUser() { return of([])}
  deleteList() { return of({})}
  putAddRecipeToList() { return of({} as List)}

  getRecipes() { return of([])}
  postRecipe() { return of({} as Recipe)}
  getRecipeById() { return of({} as Recipe)}
  putRecipe() { return of({} as Recipe)}
  deleteRecipe() { return of({})}
  postListToRecipe() { return of({} as Recipe)}
  getRecipesByUser() { return of([])}

  getPrices() { return of([])}
  postPrice() { return of({} as Price)}
  getPriceById() { return of({} as Price)}
  putPrice() { return of({} as Price)}
  getPricesByArticle() { return of([])}

  postUser() { return of({} as User)}
  getUserById() { return of({} as User)}
  putUser() { return of({} as User)}
  getUserByEmail() { return of({} as User)}

  getListPdf() { return of({} as Blob)}
  getRecipePdf() { return of({} as Blob)}

}

export const cartServiceMock = {
  provide: CartService,
  useClass: cartServiceStub
}
