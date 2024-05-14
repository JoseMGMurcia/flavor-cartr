import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { API_URLS, getApiUrl } from '@shared/constants/url.constants';
import { Article, Category, List, Price, TokenUser, User } from '@shared/models/cart.models';
import { stringFrom } from '@shared/utils/string.utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _token = STRING_EMPTY;

  constructor(
    private http: HttpClient,
  ) { }

  get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this._token}`,
    });
  }

  setToken(token: string): void {
    this._token = token;
  }

  // ARTICLES

  getArticles(): Observable<Article[]> {
    const url = getApiUrl(API_URLS.ARTICLES);
    return this.http.get<Article[]>(url, { headers: this.headers });
  }

  postArticle(article: Article): Observable<Article> {
    const url = getApiUrl(API_URLS.ARTICLES);
    return this.http.post<Article>(url, article, { headers: this.headers });
  }

  getArticleById(id: string): Observable<Article> {
    const url = getApiUrl(API_URLS.ARTICLE_ID, { id });
    return this.http.get<Article>(url, { headers: this.headers });
  }

  putArticle(article: Article): Observable<Article> {
    const url = getApiUrl(API_URLS.ARTICLE_ID, { id: article.id });
    return this.http.put<Article>(url, article, { headers: this.headers });
  }

  getArticlesByCategory(category: string): Observable<Article[]> {
    const url = getApiUrl(API_URLS.ARTICLES_CATEGORY, { category });
    return this.http.get<Article[]>(url, { headers: this.headers });
  }

  // CATEGORIES

  getCategories(): Observable<Category[]> {
    const url = getApiUrl(API_URLS.CATEGORIES);
    return this.http.get<Category[]>(url, { headers: this.headers });
  }

  postCategory(category: Category): Observable<Category> {
    const url = getApiUrl(API_URLS.CATEGORIES);
    return this.http.post<Category>(url, category, { headers: this.headers });
  }

  getCategoryById(id: string): Observable<Category> {
    const url = getApiUrl(API_URLS.CATEGORIES_ID, { id });
    return this.http.get<Category>(url, { headers: this.headers });
  }

  putCategory(category: Category): Observable<Category> {
    const url = getApiUrl(API_URLS.CATEGORIES_ID, { id: category.id });
    return this.http.put<Category>(url, category, { headers: this.headers });
  }

  // LISTS

  getLists(): Observable<List[]> {
    const url = getApiUrl(API_URLS.LISTS);
    return this.http.get<List[]>(url, { headers: this.headers });
  }

  postList(list: List): Observable<List> {
    const url = getApiUrl(API_URLS.LISTS);
    return this.http.post<List>(url, list, { headers: this.headers });
  }

  getListById(id: string): Observable<List> {
    const url = getApiUrl(API_URLS.LISTS_ID, { id });
    return this.http.get<List>(url, { headers: this.headers });
  }

  putList(list: List): Observable<List> {
    const url = getApiUrl(API_URLS.LISTS_ID, { id: stringFrom(list.id) });
    return this.http.put<List>(url, list, { headers: this.headers });
  }

  getListsByUser(userId: string): Observable<List[]> {
    const url = getApiUrl(API_URLS.LIST_USER, { id: userId });
    return this.http.get<List[]>(url, { headers: this.headers });
  }

  deleteList(id: string): Observable<void> {
    const url = getApiUrl(API_URLS.LISTS_ID, { id });
    return this.http.delete<void>(url, { headers: this.headers });
  }

  // PRICES

  getPrices(): Observable<Price[]> {
    const url = getApiUrl(API_URLS.PRICE);
    return this.http.get<Price[]>(url, { headers: this.headers });
  }

  postPrice(price: Price): Observable<Price> {
    const url = getApiUrl(API_URLS.PRICE);
    return this.http.post<Price>(url, price, { headers: this.headers });
  }

  getPriceById(id: string): Observable<Price> {
    const url = getApiUrl(API_URLS.PRICE_ID, { id });
    return this.http.get<Price>(url, { headers: this.headers });
  }

  putPrice(price: Price): Observable<Price> {
    const url = getApiUrl(API_URLS.PRICE_ID, { id: price.id });
    return this.http.put<Price>(url, price, { headers: this.headers });
  }

  // USERS

  postUser(user: User): Observable<TokenUser> {
    const url = getApiUrl(API_URLS.USERS);
    return this.http.post<User>(url, user, { headers: this.headers });
  }

  getUserById(id: string): Observable<TokenUser> {
    const url = getApiUrl(API_URLS.USERS_ID, { id });
    return this.http.get<TokenUser>(url, { headers: this.headers });
  }

  putUser(user: User): Observable<User> {
    const url = getApiUrl(API_URLS.USER_EMAIL, { email: user.email });
    return this.http.put<User>(url, user, { headers: this.headers });
  }

  getUserByEmail(email: string): Observable<User> {
    const url = getApiUrl(API_URLS.USER_EMAIL, { email });
    return this.http.get<User>(url, { headers: this.headers });
  }
}