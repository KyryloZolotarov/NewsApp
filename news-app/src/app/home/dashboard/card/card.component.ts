import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { IArticle } from '../Interfaces/article';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions],
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
    console.log(this.article);
    console.log(this.article.title);

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
