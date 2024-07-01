import { Component } from '@angular/core';
import { SpaceflightNewsService } from '../services/spaceflight-news.service';
import { IArticle } from '../home/dashboard/Interfaces/article';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [[MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions]],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent {
  id!: number;

  
  article: IArticle = 
  {
    id:0,
    title:"",
    url:"",
    image_url:"",
    news_site:"",
    summary:"",
    published_at:new Date(),
    updated_at:new Date(),
    featured:true,
    launches:[],
    events:[]
  };

  constructor(private spaceflightNewsService: SpaceflightNewsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.id = +idParam.replace(':', '');
    }
    this.getArticleById();
  }

  goToHomePage() {
      this.router.navigate([``]);
  }
  
  

  getArticleById() {
    this.spaceflightNewsService.getArticleById(this.id).subscribe(
      (response) => {
        this.article = response;
      },
      (error) => {
        console.error('Error fetching article:', error);
      }
    );
  }

}
