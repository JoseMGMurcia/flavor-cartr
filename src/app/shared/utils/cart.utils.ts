import { Article, Category } from "@shared/models/cart.models";
import { stringFrom } from "./string.utils";
import { NUMBERS } from "@shared/constants/number.constants";

export const getCategory = (article: Article, categories: Category[]): string => {
  const category = categories.find((c: Category) => article.categories?.includes(c.id));
  return stringFrom(category?.name);
}

export const formatPrice = (price: number): string => {
  return price ? `${price.toFixed(NUMBERS.N_2)} €` : '0';
}
