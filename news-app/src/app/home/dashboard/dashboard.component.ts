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
        this.articles = response.results;
        this.totalArticles = response.count;
      },
      (error) => {
        console.error('Error searching articles:', error);
      }
    );
    if (this.articles.length < 6) {
      this.isNextPageAvailable = false;
    }

  }

  async searchArticleV1() {
    this.query.offset = 0;    
    this.query.limit = Number.MAX_SAFE_INTEGER;
      this.query.title_contains_one = this.search.replace(/[^\wа-яА-ЯіІїЇєЄ]+/g, ',');;
      this.spaceflightNewsService.searchArticles(this.query).subscribe(
        (response) => {
          this.articles = [...this.articles, ...response.results];
        },
        (error) => {
          console.error('Error searching articles:', error);
        }
      );
      this.query.title_contains_one = ""
      this.query.summary_contains_one = this.search.replace(/[^\wа-яА-ЯіІїЇєЄ]+/g, ',');;
      this.spaceflightNewsService.searchArticles(this.query).subscribe(
        (response) => {
          this.articles = [...this.articles, ...response.results];
        },
        (error) => {
          console.error('Error searching articles:', error);
        }
      );
      this.query.summary_contains_one = "";
      let seenIds: Record<number, boolean> = {};
      console.log(this.articles);
      let uniqueArticles = this.articles.filter(article => {
      if (seenIds.hasOwnProperty(article.id)) {
        return false; // Возвращаем false, если id уже был встречен
      } else {
        seenIds[article.id] = true; // Запоминаем, что встретили этот id
        return true; // Возвращаем true, чтобы оставить этот объект в результирующем массиве
      };
    });
    this.articles = uniqueArticles;
      console.log(uniqueArticles);
      this.articles = this.articles.splice(
      this.articlesOffset,
      this.articlesLimit
    );
    this.totalArticles = this.articles.length;
    if (this.articles.length < this.articlesLimit) {
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
  }

  onNextPageChange() {
    this.articlesOffset = this.articlesOffset + this.articlesLimit;
    if(this.search === ""){
      this.getArticles();
    }
  }
}
