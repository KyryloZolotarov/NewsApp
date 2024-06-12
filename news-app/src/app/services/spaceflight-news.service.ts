import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpaceflightNewsService {
  private apiUrl = 'https://api.spaceflightnewsapi.net/v4/articles';

  constructor(private http: HttpClient) { }

  // Получение всех статей
  getArticles(): Observable<any> {
    console.log(this.apiUrl);
    return this.http.get<any>(this.apiUrl);
  }

  // Поиск статей по ключевым словам
  searchArticles(query: string): Observable<any> {
    let params = new HttpParams().set('search', query);
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Получение одной статьи по ID
  getArticleById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }
}