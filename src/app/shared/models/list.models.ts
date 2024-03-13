export interface ArticleList {
  articles: Article[];
  name: string;
  id: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Article {
  id: number;
  name: string;
  quantity: string;
  category: Category;
}
