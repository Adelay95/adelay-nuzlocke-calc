import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

export interface SearchCandidate {
  label: string
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchControl: FormControl = new FormControl('');

  options: SearchCandidate[] = [{
    label: 'Blastoise'
  }, 
  {
    label: 'Rain dance'
  }];
  
  dbSearchCandidates: Observable<SearchCandidate[]>;

  constructor() { }

  ngOnInit(): void {
    this.dbSearchCandidates = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): SearchCandidate[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.label.toLowerCase().includes(filterValue));
  }

}
