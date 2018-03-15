import { Component, OnInit } from '@angular/core';

import { BookCriteria } from '../../shared/models/book-criteria';
import { BookResult } from '../../shared/models/book-result';
import { BookServiceService } from '../../shared/services/book.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent implements OnInit {
  searchTypes = [ { desc: "Title", value: "Title"}, {desc: "Author", value: "Author"}, {desc: "Both", value: 1}];
  booksObservable: Observable<BookResult[]>;
  result: BookResult[] = [];

  maxSize: number = 5;
  totalItems: number = 0;
  currentPage: number = 1;
  numPages: number = 0;
  inited: boolean = false;
  itemsPerPage: number = +environment.itemPerPage;
  indexOnPage: number = 0;
  model = new BookCriteria('', 'Title', this.currentPage, this.itemsPerPage);
  
  constructor( private bookService: BookServiceService ) { 
    this.booksObservable = this.bookService.searchBooks(this.model);
  }

  ngOnInit() {
    this.booksObservable.subscribe((x) => {
      this.totalItems = x.length;
      this.result = x.slice(this.indexOnPage, this.itemsPerPage);
    });
  }

  onSearch() {
    console.log(this.model.keyword);
    this.booksObservable = this.bookService.searchBooks(this.model)
      .do(result => this.totalItems = result.length)
      .map(result => result);
    this.booksObservable.subscribe(books => this.result = books);
  }


  pageChanged(event): void {
    console.log('Page changed to: ' + event.page);
    console.log('Number items per page: ' + event.itemsPerPage);
    this.model.currentPerPage = event.page;
    this.model.itemsPerPage = event.itemsPerPage;
    this.indexOnPage = event.page * (this.itemsPerPage);
    this.booksObservable = this.bookService.searchBooks(this.model)
      .do(result => {
        this.totalItems = result.length;
        const numPages = result.length / this.itemsPerPage;
        console.log(numPages);
        if ( numPages > 1 && this.model.currentPerPage > 1) {
          console.log(result);
          const startIndex  = (this.indexOnPage - this.itemsPerPage);
          console.log(this.indexOnPage);
          const endIndex = this.indexOnPage;
          console.log(`<< ${startIndex} `);
          console.log(`< ${endIndex}`);
          this.result = result.slice(startIndex, endIndex);
          console.log(this.result);
        }else {
          console.log('page 1  > '  + event.page);
          this.result = result.slice(0, +environment.itemPerPage);
          console.log('page 1  > '  + this.result);
        }
        return this.result;
      })
      .map(result => result);
    this.booksObservable.subscribe();
    console.log('this.booksObservable: ' + this.booksObservable);
  
  }


}