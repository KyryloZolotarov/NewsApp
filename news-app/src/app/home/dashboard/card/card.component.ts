import { Component, EventEmitter, Input, NgModule, OnChanges, OnInit, Output, Pipe, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { IArticle } from '../Interfaces/article';
import { HighlightPipe } from '../../../highlight.pipe';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, HighlightPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit  {
  @Input() article!: IArticle;
  tuncatedSummary:string = "";


  constructor(private router: Router) {
   }   

  ngOnInit(){
    this.getTruncatedSummary();

   }

   getTruncatedSummary() {
    const maxLength = 100;
    if (this.article.summary.length > maxLength) {
      this.tuncatedSummary = this.article.summary.substring(0, maxLength) + '...';
    }
    else{
      this.tuncatedSummary = this.article.summary;
    }
    
  }

  goToPost(){
    this.router.navigate([`/article/:${this.article.id}`])
  }
  }
