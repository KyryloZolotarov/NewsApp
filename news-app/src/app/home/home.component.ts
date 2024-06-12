import { Component } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DashboardComponent, SearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
