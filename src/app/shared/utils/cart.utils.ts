import { Article, Category, List } from "@shared/models/cart.models";
import { stringFrom } from "./string.utils";
import { NUMBERS } from "@shared/constants/number.constants";
import { STRING_EMPTY } from "@shared/constants/string.constants";
import { TranslateService } from "@ngx-translate/core";

export const getCategory = (article: Article, categories: Category[]): string => {
  const category = categories.find((c: Category) => article.categories?.includes(c.id));
  return stringFrom(category?.name);
}

export const formatPrice = (price: number): string => {
  return price ? `${price.toFixed(NUMBERS.N_2)} €` : '0';
}

export const getNewList = (translate: TranslateService, userId: string): List => ({
  name: translate.instant('LISTS.NEW_LIST'),
  articleList: [],
  totalPrize: NUMBERS.N_0,
  userId,
  isPublic: false
});
