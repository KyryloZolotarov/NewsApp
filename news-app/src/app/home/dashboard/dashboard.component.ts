import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CardComponent } from './card/card.component';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { SpaceflightNewsService } from '../../services/spaceflight-news.service';
import { IArticle } from './Interfaces/article';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent, MatGridList, MatGridTile, MatPaginatorModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  articles: IArticle[] = [];

  query: string = '';
  constructor(private spaceflightNewsService: SpaceflightNewsService) { }

  ngOnInit() {
    this.getArticles();
  }

  getArticles() {
    this.spaceflightNewsService.getArticles().subscribe(
      (response) => {
        this.articles = response.results;
      },
      (error) => {
        console.error('Error fetching articles:', error);
      }
    );
  }

  searchArticles() {
    if (this.query) {
      this.spaceflightNewsService.searchArticles(this.query).subscribe(
        (response) => {
          this.articles = response.results;
        },
        (error) => {
          console.error('Error searching articles:', error);
        }
      );
    } else {
      this.getArticles();
    }
  }
}
