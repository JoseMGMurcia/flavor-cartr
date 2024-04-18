import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { API_URLS, getApiUrl } from '@shared/constants/url.constants';
import { Article, Category, List, Price, User } from '@shared/models/cart.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _token = STRING_EMPTY;

  constructor(
    private http: HttpClient,
  ) { }

  setToken(token: string): void {
    this._token = token;
  }

  // ARTICLES

  getArticles(): Observable<Article[]> {
    const url = getApiUrl(API_URLS.ARTICLES);
    const headers = {bearer: this._token};
    return this.http.get<Article[]>(url, { headers });
  }

  postArticle(article: Article): Observable<Article> {
    const url = getApiUrl(API_URLS.ARTICLES);
    const headers = {bearer: this._token};
    return this.http.post<Article>(url, article, { headers });
  }

  getArticleById(id: string): Observable<Article> {
    const url = getApiUrl(API_URLS.ARTICLE_ID, { id });
    const headers = {bearer: this._token};
    return this.http.get<Article>(url, { headers });
  }

  putArticle(article: Article): Observable<Article> {
    const url = getApiUrl(API_URLS.ARTICLE_ID, { id: article.id });
    const headers = {bearer: this._token};
    return this.http.put<Article>(url, article, { headers });
  }

  getArticlesByCategory(category: string): Observable<Article[]> {
    const url = getApiUrl(API_URLS.ARTICLES_CATEGORY, { category });
    const headers = {bearer: this._token};
    return this.http.get<Article[]>(url, { headers });
  }

  // CATEGORIES

  getCategories(): Observable<Category[]> {
    const url = getApiUrl(API_URLS.CATEGORIES);
    const headers = {bearer: this._token};
    return this.http.get<Category[]>(url, { headers });
  }

  postCategory(category: Category): Observable<Category> {
    const url = getApiUrl(API_URLS.CATEGORIES);
    const headers = {bearer: this._token};
    return this.http.post<Category>(url, category, { headers });
  }

  getCategoryById(id: string): Observable<Category> {
    const url = getApiUrl(API_URLS.CATEGORIES_ID, { id });
    const headers = {bearer: this._token};
    return this.http.get<Category>(url, { headers });
  }

  putCategory(category: Category): Observable<Category> {
    const url = getApiUrl(API_URLS.CATEGORIES_ID, { id: category.id });
    const headers = {bearer: this._token};
    return this.http.put<Category>(url, category, { headers });
  }

  // LISTS

  getLists(): Observable<List[]> {
    const url = getApiUrl(API_URLS.LISTS);
    const headers = {bearer: this._token};
    return this.http.get<List[]>(url, { headers });
  }

  postList(list: List): Observable<List> {
    const url = getApiUrl(API_URLS.LISTS);
    const headers = {bearer: this._token};
    return this.http.post<List>(url, list, { headers });
  }

  getListById(id: string): Observable<List> {
    const url = getApiUrl(API_URLS.LISTS_ID, { id });
    const headers = {bearer: this._token};
    return this.http.get<List>(url, { headers });
  }

  putList(list: List): Observable<List> {
    const url = getApiUrl(API_URLS.LISTS_ID, { id: list.id });
    const headers = {bearer: this._token};
    return this.http.put<List>(url, list, { headers });
  }

  getListsByUser(userId: string): Observable<List[]> {
    const url = getApiUrl(API_URLS.LIST_USER, { id: userId });
    const headers = {bearer: this._token};
    return this.http.get<List[]>(url, { headers });
  }

  // PRICES

  getPrices(): Observable<Price[]> {
    const url = getApiUrl(API_URLS.PRICE);
    const headers = {bearer: this._token};
    return this.http.get<Price[]>(url, { headers });
  }

  postPrice(price: Price): Observable<Price> {
    const url = getApiUrl(API_URLS.PRICE);
    const headers = {bearer: this._token};
    return this.http.post<Price>(url, price, { headers });
  }

  getPriceById(id: string): Observable<Price> {
    const url = getApiUrl(API_URLS.PRICE_ID, { id });
    const headers = {bearer: this._token};
    return this.http.get<Price>(url, { headers });
  }

  putPrice(price: Price): Observable<Price> {
    const url = getApiUrl(API_URLS.PRICE_ID, { id: price.id });
    const headers = {bearer: this._token};
    return this.http.put<Price>(url, price, { headers });
  }

  // USERS

  getUsers(): Observable<User[]> {
    const url = getApiUrl(API_URLS.USERS);
    const headers = {bearer: this._token};
    return this.http.get<User[]>(url, { headers });
  }

  postUser(user: User): Observable<User> {
    const url = getApiUrl(API_URLS.USERS);
    const headers = {bearer: this._token};
    return this.http.post<User>(url, user, { headers });
  }

  getUserById(id: string): Observable<User> {
    const url = getApiUrl(API_URLS.USERS_ID, { id });
    const headers = {bearer: this._token};
    return this.http.get<User>(url, { headers });
  }

  putUser(user: User): Observable<User> {
    const url = getApiUrl(API_URLS.USERS_ID, { id: user.id });
    const headers = {bearer: this._token};
    return this.http.put<User>(url, user, { headers });
  }
}
