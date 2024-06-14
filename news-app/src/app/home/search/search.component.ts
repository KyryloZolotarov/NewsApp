import { Component, EventEmitter, Output } from '@angular/core';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ MatInputModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @Output() search = new EventEmitter<string>();;
  searchQuery = '';
  onSearch(){
    this.search.emit(this.searchQuery);
  }

}
