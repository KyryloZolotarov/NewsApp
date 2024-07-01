import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CardComponent } from './card/card.component';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SpaceflightNewsService } from '../../services/spaceflight-news.service';
import { IArticle } from './Interfaces/article';
import { CommonModule } from '@angular/common';
import { IQueryParams } from '../../services/interfaces/queryParams';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardComponent,
    MatGridList,
    MatGridTile,
    MatPaginatorModule,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnChanges {
  @Input() search: string = '';
  searchByWords:string[] = [];
  articles: IArticle[] = [];
  totalArticles: number = 0;
  currentPage: number = 1;
  isNextPageAvailable = true;
  filteredArticles:IArticle[]= [];
  articlesOffset: number = 0;
  articlesLimit: number = 6;
  query: IQueryParams = {
    limit: 6,
    offset: 0,
  };

  constructor(private spaceflightNewsService: SpaceflightNewsService) {}

  ngOnInit() {
    this.getArticles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.search !== ""){
      this.searchArticleV1();
    }    
  }

  getArticles(){
    this.query.offset = this.articlesOffset;
    this.query.limit = this.articlesLimit;
    this.spaceflightNewsService.searchArticles(this.query).subscribe(
      (response) => {
        this.filteredArticles = response.results;
        this.totalArticles = response.count;
        if (this.filteredArticles.length < 6) {
          this.isNextPageAvailable = false;
        } else {
          this.isNextPageAvailable = true;
        }
      },
      (error) => {
        console.error('Error searching articles:', error);
      }
);

  }

  searchArticleV1() {
    this.query.offset = 0;
    this.query.limit = Number.MAX_SAFE_INTEGER;
    this.query.title_contains_one = this.search.replace(/[^\wа-яА-ЯіІїЇєЄ]+/g, ',');
  
    let titleSearch$ = this.spaceflightNewsService.searchArticles(this.query);
    const query2: IQueryParams = {
      offset: this.query.offset,
      limit: this.query.limit,
      summary_contains_one: this.search.replace(/[^\wа-яА-ЯіІїЇєЄ]+/g, ',')
    };
    let summarySearch$ = this.spaceflightNewsService.searchArticles(query2);
  
    forkJoin([titleSearch$, summarySearch$]).subscribe(
      ([titleResponse, summaryResponse]) => {
        this.articles = titleResponse.results;
        this.filteredArticles = summaryResponse.results;
  
        this.articles = [...this.articles, ...this.filteredArticles];
  
        let seenIds: Record<number, boolean> = {};
        let uniqueArticles = this.articles.filter(article => {
          if (seenIds.hasOwnProperty(article.id)) {
            return false; // Возвращаем false, если id уже был встречен
          } else {
            seenIds[article.id] = true; // Запоминаем, что встретили этот id
            return true; // Возвращаем true, чтобы оставить этот объект в результирующем массиве
          }
        });
  
        this.articles = uniqueArticles;
  
        this.articlesForSearchBypage();
      },
      (error) => {
        console.error('Error searching articles:', error);
      }
    );
  }

  articlesForSearchBypage(){
    this.filteredArticles = this.articles.slice(
      this.articlesOffset,
      this.articlesOffset + this.articlesLimit
    );
    
    this.totalArticles = this.articles.length;
        if (this.filteredArticles.length < this.articlesLimit) {
          this.isNextPageAvailable = false;
        } else {
          this.isNextPageAvailable = true;
        }
  }

  get totalPages(): number {
    return Math.ceil(this.totalArticles / this.articlesLimit);
  }

  onPreviousPageChange() {
    this.articlesOffset = this.articlesOffset - this.articlesLimit;
    if(this.search === ""){
      this.getArticles();
    }
    else{
      this.articlesForSearchBypage();
    }
  }

  onNextPageChange() {
    this.articlesOffset = this.articlesOffset + this.articlesLimit;
    if(this.search === ""){
      this.getArticles();
    }
    else{
      this.articlesForSearchBypage();
    }
  }
}
