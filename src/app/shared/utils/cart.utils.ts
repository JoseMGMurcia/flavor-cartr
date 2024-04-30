import { Article, Category } from "@shared/models/cart.models";
import { stringFrom } from "./string.utils";

export const getCategory = (article: Article, categories: Category[]): string => {
  const category = categories.find((c: Category) => article.categories?.includes(c.id));
  return stringFrom(category?.name);
}

export const formatPrice = (price: number): string => {
  return price ? `${price.toFixed(2)} €` : '0';
}
