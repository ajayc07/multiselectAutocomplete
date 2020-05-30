import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  movieSelection = new FormControl('',[Validators.required]);
  filteredResult: any;
  isLoading = false;
  errorMsg: string;
  multiSelection = false;
  selectedFilter: any;
  toggleOptions: Array<String> = ["single", "multiple"];
  inputPlaceholder= 'Search for a movie';
  disableField= false;

  constructor (
    private http: HttpClient
  ) { }

  ngOnInit() {
    // this.getSelectedFilter();
  }

  updateDisableState(event) {
    (event.checked) ? this.movieSelection.disable() : this.movieSelection.enable();
  }

  selectionChanged(item) {
    this.multiSelection = item.value === 'multiple' ? true : false;
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


}
