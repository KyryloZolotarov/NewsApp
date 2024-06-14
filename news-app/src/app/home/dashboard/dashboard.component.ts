import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
  imports: [CardComponent, MatGridList, MatGridTile, MatPaginatorModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnChanges {
  @Input() search: string = "";
  searchActivated:boolean=false;
  articles: IArticle[] = [];
  articlesForDisplay: IArticle[]=[];
  totalArticles: number = 0;
  currentPage: number = 1;
  articlesPerPage: number = 6;
  additionalArticles:number = 0;
  articlesIds:number[]=[];
  searchByTitleAndSummary:boolean =true;
  searchByTitle:boolean=false;
  serchBySummary:boolean=false;
  query: IQueryParams = { limit: this.articlesPerPage, offset: 0, summary_contains_one:this.search };

  constructor(private spaceflightNewsService: SpaceflightNewsService) {}

  ngOnInit() {
    if(this.search !== ""){
      this.searchActivated = true;
      this.loadArticles();
      this.articlesForDisplay = this.articles
    }
    else{
      this.searchActivated = false;
      this.loadArticlesForSearch();
      this.articlesForDisplay = this.articles
    }
    
  }

  ngOnChanges(changes: SimpleChanges): void {    
    if(this.search !== ""){
      this.searchActivated = true;
      this.loadArticles();
      this.articlesForDisplay = this.articles
    }
    else{
      this.searchActivated = false;
      this.loadArticlesForSearch();
    }
  }

  loadArticles() {
    const offset = (this.currentPage - 1) * this.articlesPerPage;
    this.query.offset = offset;
    this.spaceflightNewsService.searchArticles(this.query).subscribe(
      (response) => {
        this.articles = response.results;
        this.totalArticles = response.count;
      },
      (error) => {
        console.error('Error searching articles:', error);
      }
    );
  }

  loadArticlesForSearch() {    
    if(this.searchByTitleAndSummary){
      this.searchRequest();
      this.articles.forEach(element => {
        if (!this.articlesIds.includes(element.id)) {
          this.articlesIds.push(element.id);
        }
      });      
      this.articlesForDisplay = this.articles;
    }
    if(this.articles.length <6){
      this.additionalArticles = 6 - this.articles.length;
    }
    if(this.articlesForDisplay.length <6){
      this.additionalArticles = 6 - this.articles.length;
      this.searchByTitleAndSummary = false;
      this.searchByTitle = true;
    }
    if(this.searchByTitle){
      this.searchRequest();
    }
    if(this.articlesForDisplay.length <6){
      this.additionalArticles = 6 - this.articles.length;
      this.searchByTitle = false;
      this.serchBySummary = true;
    }
    if(this.serchBySummary){
      this.searchRequest();
    }
  }

  searchRequest(){
    const offset = (this.currentPage - 1) * this.articlesPerPage;
    this.query.offset = offset;
    this.spaceflightNewsService.searchArticles(this.query).subscribe(
      (response) => {
        this.articles = response.results;
      },
      (error) => {
        console.error('Error searching articles:', error);
      }
    );
  }

  get totalPages(): number {
    return Math.ceil(this.totalArticles / this.articlesPerPage);
  }

  get visiblePages(): Array<number | string> {
    const totalPages = this.totalPages;
    let pages: Array<number | string> = [];
    if (totalPages <= 5) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      pages = [1];
      if (this.currentPage > 3) {
        pages.push('...');
      }
      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(totalPages - 1, this.currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  }

  onPageChange(page: number | string) {
    if(this.search !== ""){

    }
    else{  
    if (typeof page === 'string') return;
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadArticles();
    }
  }
}