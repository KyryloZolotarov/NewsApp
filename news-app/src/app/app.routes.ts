import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArticleComponent } from './article/article.component';

export const routes: Routes = [    
  { path: 'home', component: HomeComponent },
  { path: 'article/:id', component: ArticleComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' }
];
