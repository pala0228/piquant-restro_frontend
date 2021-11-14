import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  /**
   * @ignore
   */
  private snackbarInfo = new Subject<{ showSnackbar: boolean, message: string, status: string }>();
  /**
   * @ignore
   */
  private partialLoader = new Subject<boolean>();

  constructor() { }

  /**
   * @ignore
   */
  activateSnackbar(input: { showSnackbar: boolean, message: string, status: string }) {
    this.snackbarInfo.next(input);
  }
  /**
   * @ignore
   */
  getSnackbarObservable() {
    return this.snackbarInfo.asObservable();
  }
  /**
   * @ignore
   */
  activatePartialLoader(flag: boolean) {
    this.partialLoader.next(flag);
  }
  /**
   * @ignore
   */
  getPartialLoaderObservable() {
    return this.partialLoader.asObservable();
  }
}
