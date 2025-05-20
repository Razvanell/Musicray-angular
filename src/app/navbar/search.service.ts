import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private searchKeySubject = new BehaviorSubject<string>('');
  searchKey$ = this.searchKeySubject.asObservable();

  setSearchKey(key: string) {
    this.searchKeySubject.next(key.trim().toLowerCase());
  }
}
