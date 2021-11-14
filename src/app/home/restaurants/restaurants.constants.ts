export const OFFERCODES = [
  { offerCode: "No Offer", text: "No off on total cost", offerPercentage: null },
  { offerCode: "PIQUANT10", text: "10% off on total cost", offerPercentage: "10" },
  { offerCode: "PIQUANT15", text: "15% off on total cost", offerPercentage: "15" },
  { offerCode: "PIQUANT20", text: "20% off on total cost", offerPercentage: "20" },
  { offerCode: "PIQUANT25", text: "25% off on total cost", offerPercentage: "25" }
];
/**
 * @ignore
 */
export enum TABLE_STATE {
  LOADING = 0,
  NODATAFOUND = 1,
  DATAFOUND = 2
}
/**
 * @ignore
 */
export const RESTAURANTS_RATINGS = [
  { value: 1, viewValue: "1 - rating" },
  { value: 2, viewValue: "2 - rating" },
  { value: 3, viewValue: "3 - rating" },
  { value: 4, viewValue: "4 - rating" },
  { value: 5, viewValue: "5 - rating" },
];
/**
 * @ignore
 */
export class Constants {
  public static readonly LOGOUT_TIME_CODE_ID = "USER_LOGOUT";
}
