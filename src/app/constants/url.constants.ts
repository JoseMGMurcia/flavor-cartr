import { Params } from "@angular/router";
import { BAC_AZURE_RUL, BACK_LOCAL_URL, BACK_PROD_URL } from "./enviroment.constants";

export const API_URLS = {
  ARTICLES: '/ArticleFirestore',
  ARTICLE_ID: '/ArticleFirestore/{id}',
  ARTICLES_CATEGORY: '/ArticleFirestore/category/{category}',
  CATEGORIES: '/CategoryFirestore',
  CATEGORIES_ID: '/CategoryFirestore/{id}',
  LISTS: '/ListsFirestore',
  LISTS_ID: '/ListsFirestore/{id}',
  LIST_USER: '/ListsFirestore/user/{id}',
  LIST_PUBLIC: '/ListsFirestore/publicLists',
  LISTS_ADD_RECIPE_TO_LIST: '/ListsFirestore/addRecipe/{recipeId}',
  PRICE: '/PriceFirestore',
  PRICE_ID: '/PriceFirestore/{id}',
  PRICE_ARTICLE: '/PriceFirestore/article/{id}',
  RECIPES: '/RecipeFirestore',
  RECIPES_ID: '/RecipeFirestore/{id}',
  LIST_TO_RECIPE: '/RecipeFirestore/listsToRecipe',
  RECIPE_USER: '/RecipeFirestore/user/{user}',
  USERS: '/UserToken',
  USERS_ID: '/UserToken/{id}',
  VERIFY: '/UserToken/verify',
  USER_EMAIL: '/UserFirestore/{email}',
  LIST_PDF_ID: '/api/pdfcreator/list/{id}',
  RECIPE_PDF_ID: '/api/pdfcreator/recipe/{id}'
};

export const getApiUrl = (url: string, params: Params = {}): string => {
  let newUrl = url;
  Object.keys(params).forEach((key) => {
    newUrl = newUrl.replace(`{${key}}`, params[key])
  });
  return `${BAC_AZURE_RUL}${newUrl}`;
}
