import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  movieSelection = new FormControl();
  filteredResult: any;
  isLoading = false;
  errorMsg: string;
  multiSelection = false;

  selectedFilter: any;

  constructor (
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getSelectedFilter();
  }

  public getMovieDataOnFilter(searchValue: any): void {
    this.isLoading = true;
    let apiUrl = "http://www.omdbapi.com/?apikey=17a0e150&s=";
    this.http.get(apiUrl + searchValue)
      .pipe( finalize(() => {
                this.isLoading = false
                }
              )
      ).subscribe((data) => {
        this.filteredResult = data['Search'];
      })
  }


  public getSelectedFilter() {
    this.movieSelection.valueChanges.pipe().subscribe((value) => {
      console.log('yoshaa', value);
    })
  }
}
