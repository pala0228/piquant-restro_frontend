import { Injectable, Optional, NgZone } from "@angular/core";
import {
  Observable,
  Subject,
  Subscription,
  fromEvent,
  merge,
  from,
  interval,
  timer,
  of,
} from "rxjs";
import { UserIdleConfig } from "./user-idle.config";
import {
  switchMap,
  takeUntil,
  tap,
  filter,
  bufferTime,
  finalize,
  distinctUntilChanged,
  map,
  scan,
  take,
} from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserIdleService {
  /**
   * ping$ observer
   */
  ping$: Observable<any>;
  /**
   * activity events observer
   */
  protected activityEvents$: Observable<any>;
  /**
   * time start observer
   */
  protected timeStart$ = new Subject<boolean>();
  /**
   * idleDetected observer
   */
  protected idleDetected$ = new Subject<boolean>();
  /**
   * time out observer
   */
  protected timeout$ = new Subject<boolean>();
  /**
   * idle observer
   */
  protected idle$: Observable<any>;
  /**
   * timer observer
   */
  protected timer$: Observable<any>;
  /**
   * idle value in milliseconds
   * default equals to 10 minutes.
   */
  protected idleMillisec = 600 * 1000;
  /**
   * idle buffer wait time milliseconds to collect user action
   * default equals to 1 sec.
   */
  protected idleSensitivityMillisec = 1000;
  /**
   * timeout value in seconds.
   * default equals to 5 minutes.
   */
  protected timeout = 300;
  /**
   * ping value in milliseconds.
   * default equals to 2 minutes.
   */
  protected pingMillisec = 120 * 1000;
  /**
   * timeout status
   */
  protected isTimeout: boolean;
  /**
   * timer of users inactivity is in progress.
   */
  protected isInactivityTimer: boolean;
  /**
   * To find isIdleDetected.
   */
  protected isIdleDetected: boolean;
  /**
   * To get idle subscription
   */
  protected idleSubscription: Subscription;

  constructor(@Optional() config: UserIdleConfig, private _ngZone: NgZone) {
    if (config) {
      this.setConfig(config);
      this.setEvents(config);
    }
  }
  /**
   * @ignore
   * Method to set events for interrupt idle
   */
  setEvents(config: UserIdleConfig) {
    const elements = {
      click: document,
      keydown: document,
      touchstart: document,
      resize: window,
      mousemove: window,
    };
    if (config.interruptEvents && config.interruptEvents.length > 0) {
      const eventStreams = config.interruptEvents.map((event) =>
        fromEvent(elements[event], event)
      );
      this.activityEvents$ = merge(...eventStreams);
    }
  }
  /**
   * @ignore
   * Method to start watching for user idle and setup timer and ping.
   */
  startWatching() {
    if (!this.activityEvents$) {
      this.activityEvents$ = merge(
        fromEvent(window, "mousemove"),
        fromEvent(window, "resize"),
        fromEvent(document, "keydown")
      );
    }
    this.idle$ = from(this.activityEvents$);

    if (this.idleSubscription) {
      this.idleSubscription.unsubscribe();
    }
    /**
     * if any of user events is not active for idle-seconds when start timer.
     */
    this.idleSubscription = this.idle$
      .pipe(
        bufferTime(this.idleSensitivityMillisec), // starting point of detecting of user's inactivity
        filter(
          (arr) =>
            !arr.length && !this.isIdleDetected && !this.isInactivityTimer
        ),
        tap(() => {
          this.isIdleDetected = true;
          this.idleDetected$.next(true);
        }),
        switchMap(() =>
          this._ngZone.runOutsideAngular(() =>
            interval(1000).pipe(
              takeUntil(
                merge(
                  this.activityEvents$,
                  timer(this.idleMillisec).pipe(
                    tap(() => {
                      this.isInactivityTimer = true;
                      this.timeStart$.next(true);
                    })
                  )
                )
              ),
              finalize(() => {
                this.isIdleDetected = false;
                this.idleDetected$.next(false);
              })
            )
          )
        )
      )
      .subscribe();

    this.setupTimer(this.timeout);
    this.setupPing(this.pingMillisec);
  }
  /**
   * @ignore
   * Method to stop user idle
   */
  stopWatching() {
    this.stopTimer();
    if (this.idleSubscription) {
      this.idleSubscription.unsubscribe();
    }
  }
  /**
   * @ignore
   * Method to stop timer
   */
  stopTimer() {
    this.isInactivityTimer = false;
    this.timeStart$.next(false);
  }
  /**
   * @ignore
   * Method to reset timer
   */
  resetTimer() {
    this.stopTimer();
    this.isTimeout = false;
  }
  /**
   * @ignore
   * Method to return observable for timer's countdown number that emits after idle.
   */
  onTimerStart(): Observable<number> {
    return this.timeStart$.pipe(
      distinctUntilChanged(),
      switchMap((start) => (start ? this.timer$ : of(null)))
    );
  }
  /**
   * @ignore
   * Method to return observable for idle status changed.
   */
  onIdleStatusChanged(): Observable<boolean> {
    return this.idleDetected$.asObservable();
  }
  /**
   * @ignore
   * Method to return observable for timeout is fired.
   */
  onTimeout(): Observable<boolean> {
    return this.timeout$.pipe(
      filter((timeout) => !!timeout),
      tap(() => (this.isTimeout = true)),
      map(() => true)
    );
  }
  /**
   * @ignore
   * Method to get config values
   */
  getConfigValue(): UserIdleConfig {
    return {
      idle: this.idleMillisec,
      idleSensitivity: this.idleSensitivityMillisec,
      timeout: this.timeout,
      ping: this.pingMillisec,
    };
  }
  /**
   * @ignore
   * Method to set config values after initializing module.
   */
  setConfigValues(config: UserIdleConfig) {
    if (this.idleSubscription && !this.idleSubscription.closed) {
      return;
    }
    this.setConfig(config);
  }
  /**
   * @ignore
   * Method to set config values
   */
  private setConfig(config: UserIdleConfig) {
    if (config.idle) {
      this.idleMillisec = config.idle * 1000;
    }
    if (config.ping) {
      this.pingMillisec = config.ping * 1000;
    }
    if (config.idleSensitivity) {
      this.idleSensitivityMillisec = config.idleSensitivity * 1000;
    }
    if (config.timeout) {
      this.timeout = config.timeout;
    }
  }
  /**
   * @ignore
   * Method to set custom activity events
   */
  setCustomActivityEvents(customEvents: Observable<any>) {
    if (this.idleSubscription && !this.idleSubscription.closed) {
      return;
    }
    this.activityEvents$ = customEvents;
  }
  /**
   * @ignore
   * Method to setup timer.
   */
  protected setupTimer(timeout: number) {
    this._ngZone.runOutsideAngular(() => {
      this.timer$ = interval(1000).pipe(
        take(timeout),
        map(() => 1),
        scan((acc, n) => acc + n),
        tap((count) => {
          if (count === timeout) {
            this.timeout$.next(true);
          }
        })
      );
    });
  }
  /**
   * @ignore
   * Method to setup ping
   */
  protected setupPing(pingMillisec: number) {
    this.ping$ = interval(pingMillisec).pipe(filter(() => !this.isTimeout));
  }
}
