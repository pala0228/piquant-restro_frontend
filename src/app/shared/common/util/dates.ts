import { DateFilter } from '../models/date-filter.model';

/**
 * @ignore
 * Common date utility class for date operations
 */
export class DateUtils {
  /**
   * @ignore
   * Example: 05 APR 2021
   */
  public static readonly FORMAT_DD_MMM_YYYY = 'dd MMM yyyy';
  /**
   * @ignore
   * Example: APR 2021
   */
  public static readonly FORMAT_MMM_YYYY = 'dd MMMM yyyy';

  /**
   * @ignore
   * Method to substract number of months for a given date
   */
  public static substractDateByMonth(date: Date, numberOfMonths: number): Date {
    let resultDate: Date;
    try {
      resultDate = new Date(date);
      resultDate.setMonth(resultDate.getMonth() - numberOfMonths);
    } catch (Error) {

    }
    return resultDate;
  }
  /**
   * @ignore
   * Method to get first and last day of month
   */
  public static getFirstAndLastDayOfMonth(date: Date): DateFilter {
    const dateFilter = new DateFilter();
    const dateValue = date;
    const year = dateValue.getFullYear();
    const month = dateValue.getMonth();

    dateFilter.fromDate = new Date(year, month, 1);
    dateFilter.toDate = new Date(year, month + 1, 0);

    return dateFilter
  }
  /**
   * @ignore
   * Method to default date and time (start date - 00:00am, end date - 11:59pm)
   */
  public static getDefaultDateTime(dateFilter: DateFilter): DateFilter {
    if (dateFilter) {
      const fromDate = dateFilter.fromDate;
      fromDate.setHours(0);
      fromDate.setMinutes(0);
      fromDate.setSeconds(0);

      const toDate = dateFilter.toDate;
      toDate.setHours(23);
      toDate.setMinutes(59);
      toDate.setSeconds(59);

      const newDateFilter = new DateFilter();
      newDateFilter.fromDate = fromDate;
      newDateFilter.toDate = toDate;

      return newDateFilter;
    }
    return dateFilter;
  }
  /**
   * @ignore
   * Method to get current time
   */
  public static getCurrentTime(): number {
    const date = new Date();
    return date.getTime();
  }
  /**
   * @ignore
   * Method to get number of months difference
   */
  public static getMonthsDiff(d1: Date, d2: Date): number {
    if (!d1) {
      d1 = new Date();
    }
    if (!d2) {
      return 0;
    }
    return d2.getMonth() - d1.getMonth() + (12 * (d2.getFullYear() - d1.getFullYear()))
  }
  /**
   * @ignore
   * Method to get number of days difference
   */
  public static getDaysDiff(d1: Date, d2: Date): number {
    if (!d1) {
      d1 = new Date();
    }
    let milliSecondsPerDay = 24 * 60 * 60 * 1000;
    const timeDiff = d1.getTime() - d2.getTime();
    return Math.ceil(timeDiff / milliSecondsPerDay);
  }
  /**
   * @ignore
   * Method to check date is greater or not
   */
  public static isDateGreater(d1: Date, d2: Date): boolean {
    if (!d1) {
      d1 = new Date();
    }
    if (!d1 || !d2) {
      return false;
    }
    if (d1 > d2) {
      return true
    }
    return false;
  }
}
