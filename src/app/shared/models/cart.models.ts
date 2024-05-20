export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Price {
  id: string;
  articleId: string;
  cost: number;
  currency: string;
  shop: string;
}

export interface Article {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  brand?: string;
  prices?: Price[];
  categories?: string[];
  averagePrice: number;
  quantity?: number;
  unit?: string;
}


export interface ArticleList {
  articleId: string;
  amount: number;
  unit: string;
}

export interface List {
  id?: string;
  name: string;
  articleList: ArticleList[];
  totalPrice: number;
  userId: string;
  creationDate?: string;
  isPublic: boolean;
}

export interface User {
  id: string;
  name: string;
  surname: string;
  nickname: string;
  email: string;
  password: string;
}

export interface TokenUser {
  id: string;
  email: string;
}
