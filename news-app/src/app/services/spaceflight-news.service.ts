import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IQueryParams } from './interfaces/queryParams';

@Injectable({
  providedIn: 'root'
})
export class SpaceflightNewsService {
  private apiUrl = 'https://api.spaceflightnewsapi.net/v4/articles';

  constructor(private http: HttpClient) { 
    console.log("hhtp");
  }


  searchArticles(query: IQueryParams): Observable<any> {
    let params = this.toHttpParams(query);
    return this.http.get<any>(this.apiUrl, { params });
  }

  toHttpParams(params: IQueryParams): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key as keyof IQueryParams];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return httpParams;
  }
  
  getArticleById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }
}