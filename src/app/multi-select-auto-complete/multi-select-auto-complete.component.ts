import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges, forwardRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'multi-select-auto-complete',
  templateUrl: './multi-select-auto-complete.component.html',
  styleUrls: ['./multi-select-auto-complete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectAutoCompleteComponent),
      multi: true
    }
  ]
})
export class MultiSelectAutoCompleteComponent implements ControlValueAccessor {

  /**
   * Element ref to access the input field
   * @type {ElementRef}
   * @memberof MultiSelectAutoCompleteComponent
   */
  @ViewChild('searchInputEl') searchInputEl: ElementRef;
  
  /**Input data drom the parent component*/
  @Input() filterData;
  @Input() displayDataAttr;
  @Input() dataValueAttr;
  @Input() isLoading;
  @Input() loaderMsg;
  @Input() placeholder;
  @Input() multiSelection;

  /**OUput emiiters */
  @Output() searchKeyEmitter = new EventEmitter();
  @Output() filterSelectionEmitter = new EventEmitter();

  /**Varibale declarations */
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public searchInput = new FormControl();
  public chipData = [];

  constructor() { }

  onChange: any = () => { };
  onTouched: any = () => { };

  registerOnChange( fn : any ) : void {
    this.onChange = fn;
  }

  registerOnTouched( fn : any ) : void {
    this.onTouched = fn;
  }

  writeValue(value) {
    this.searchInput.setValue(value);
  }

  ngOnInit(): void {
    this.handleInputChanges();
  } 

  ngOnChanges(changes: SimpleChanges) {
  
    for (const propKey in changes) {
      if (propKey == 'filterData') {
        let uniqueAttrArr = this.chipData.map((cData) => {return cData[this.dataValueAttr]});
        this.filterData = changes.filterData?.currentValue?.filter((data) => {
           return !(uniqueAttrArr.includes(data[this.dataValueAttr]))
        });
      }
    }
    
  }

  /**
   * Methods to emit the search key value on value change
   */
  public handleInputChanges() : void {

    this.searchInput.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(() => {
      if(this.searchInput.value) {
        this.searchKeyEmitter.emit(this.searchInput.value);
      }
    })
     
  }

  /**
   * Method to extract display value from the object
   * @readonly
   * @memberof MultiSelectAutoCompleteComponent
   */
  public get displayFn() {
    return (data) => data && data[this.displayDataAttr] ? data[this.displayDataAttr] : '';
  }


  /**
   * Method to remove the added chip 
   * @param {*} removeElement
   * @memberof MultiSelectAutoCompleteComponent
   */
  public remove(removeElement): void {
    const index = this.chipData.indexOf(removeElement);

    if (index >= 0) {
      this.chipData.splice(index, 1);
    }
  }

  /**
   * Auto complete selection function trigger
   * @param {MatAutocompleteSelectedEvent} event
   * @memberof MultiSelectAutoCompleteComponent
   */
  public selected(event: MatAutocompleteSelectedEvent): void {

    if (this.multiSelection) {
      this.chipData.push(event.option.value);
      this.searchInput.reset();
      this.searchInputEl.nativeElement.value = '';
      this.searchInput.updateValueAndValidity();
    }

    this.registerOnChange(this.multiSelection ? this.chipData : event.option.value);
    // this.filterSelectionEmitter.emit(this.multiSelection ? this.chipData : event.option.value)
  }


}
