import { Params } from "@shared/models/params.models";
import { BACK_LOCAL_URL } from "./enviroment.constants";

export const API_URLS = {
  ARTICLES: '/ArticleFirestore',
  ARTICLE_ID: '/ArticleFirestore/{id}',
  ARTICLES_CATEGORY: '/ArticleFirestore/category/{category}',
  CATEGORIES: '/CategoryFirestore',
  CATEGORIES_ID: '/CategoryFirestore/{id}',
  LISTS: '/ListsFirestore',
  LISTS_ID: '/ListsFirestore/{id}',
  LIST_USER: '/ListsFirestore/user/{id}',
  PRICE: '/PriceFirestore',
  PRICE_ID: '/PriceFirestore/{id}',
  USERS: '/UserToken',
  USERS_ID: '/UserToken/{id}',
  VERIFY: '/UserToken/verify',
  USER_EMAIL: '/UserFirestore/{email}',
  PDF_ID: '/api/pdfcreator/list/{id}'
};

export const getApiUrl = (url: string, params: Params = {}): string => {
  let newUrl = url;
  Object.keys(params).forEach((key) => {
    newUrl = newUrl.replace(`{${key}}`, params[key])
  });
  return `${BACK_LOCAL_URL}${newUrl}`;
}
