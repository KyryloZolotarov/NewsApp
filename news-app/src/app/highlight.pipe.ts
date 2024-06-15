import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {

  transform(value: string, searchTerms: string[]): string {

    if (!searchTerms || searchTerms.length === 0) {
      return value;
    }

    searchTerms.forEach(term => {
      if (term) {
        const re = new RegExp(term, 'gi');
        value = value.replace(re, (match) => `<span class="highlight">${match}</span>`);
      }
    });

    return value;
  }
}