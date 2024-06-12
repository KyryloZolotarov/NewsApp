import { Component } from '@angular/core';
import { SpaceflightNewsService } from '../services/spaceflight-news.service';
import { IArticle } from '../home/dashboard/Interfaces/article';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [],
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

  constructor(private spaceflightNewsService: SpaceflightNewsService, private route: ActivatedRoute) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.id = +idParam;
    }
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
