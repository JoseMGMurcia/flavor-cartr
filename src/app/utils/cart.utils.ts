import { Article, Category, List, Recipe } from "app/models/cart.models";
import { stringFrom } from './string.utils';
import { NUMBERS } from 'app/constants/number.constants';
import { STRING_EMPTY } from 'app/constants/string.constants';
import { TranslateService } from '@ngx-translate/core';

import { LanguageEnum } from 'app/models/language.models';
import { CartOption } from 'app/components/select/select.component';

export const getCategory = (article: Article, categories: Category[]): string => {
  const category = categories.find((c: Category) => article.categories?.includes(c.id));
  return stringFrom(category?.name);
}

export const formatPrice = (price: number): string => {
  return price ? `${price.toFixed(NUMBERS.N_2)} €` : '0';
}

export const getNewList = (translate: TranslateService, userId: string): List => ({
  id: STRING_EMPTY,
  name: translate.instant('LISTS.NEW_LIST'),
  articleList: [],
  totalPrice: NUMBERS.N_0,
  userId,
  creationDate: STRING_EMPTY,
  isPublic: false
});

export const getNewRecipe = (translate: TranslateService, userId: string): Recipe => ({
  id: STRING_EMPTY,
  name: translate.instant('RECIPES.NEW_RECIPE'),
  articleList: [],
  totalPrice: NUMBERS.N_0,
  userId,
  creationDate: STRING_EMPTY,
  isPublic: false,
  description: STRING_EMPTY,
});

export const getLanguageOption = (translate: TranslateService): CartOption[] => {
  const literals = translate.instant('LANGUAGES');
  return [
    { value: LanguageEnum.SPANISH, label: literals.ES },
    { value: LanguageEnum.ENGLISH, label: literals.EN },
    { value: LanguageEnum.FRENCH, label: literals.FR},
    { value: LanguageEnum.GERMAN, label: literals.DE},
    { value: LanguageEnum.ITALIAN, label: literals.IT},
  ];
};
