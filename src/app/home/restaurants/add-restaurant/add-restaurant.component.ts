import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { mimeType } from "./mime-type-validator";
import { AddRestaurant, RestaurantCrudResponse, Restaurant } from '../restaurants.model';
import { RestaurantsService } from '../restaurants.service';
import { Router } from '@angular/router';
import { OFFERCODES, RESTAURANTS_RATINGS } from '../restaurants.constants';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: "app-add-restaurant",
  templateUrl: "./add-restaurant.component.html",
  styleUrls: ["./add-restaurant.component.scss"],
})
export class AddRestaurantComponent implements OnInit {
  /**
   * Input to the component from restaurants page
   */
  @Input() updatableRestaurantInfo: Restaurant = null;
  /**
   * @ignore
   * Array to hold restaurants rantings
   */
  ratings = RESTAURANTS_RATINGS;
  /**
   * @ignore
   * Offer codes available
   */
  offerCodes = OFFERCODES;
  /**
   * @ignore
   * selectedRating to hold default rating by piquant site
   */
  selectedRate: number = this.ratings[0].value;
  /**
   * @ignore
   * addRestaurantFrom formGroup to register controls
   */
  addRestaurantFrom: FormGroup;
  /**
   * @ignore
   * imagePreview to get dataURL of image uploaded
   */
  imagePreview: string;
  /**
   * @ignore
   * Input data required to hit back end API for adding new restaurant
   */
  restaurantData: AddRestaurant;
  /**
   * @ignore
   * file name to show on the screen once user selected an image
   */
  fileName = 'no image is selected';
  /**
   * @ignore
   * To hold selected offer code value
   */
  selectedOfferCode: string;
  /**
   * @ignore
   * To hold description of offer code selected
   */
  offerText: string;
  /**
   * @ignore
   * To hold offer code percentage
   */
  offerPercentage: string = null;
  /**
   * @ignore
   * Flag to show info screen component
   */
  showScreen: boolean = false;
  /**
   * @ignore
   * Message to show on the infor screen component
   */
  message = '';
  /**
   * @ignore
   * Status to change message view(error/success/info/warning)
   */
  status = '';
  /**
   * @ignore
   */
  @ViewChild('filePicker', { static: false }) filePicker: ElementRef;

  constructor(
    private restaurantsService: RestaurantsService,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    // Reactive form --> to register required form controls
    this.addRestaurantFrom = new FormGroup({
      restaurantTitle: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9 ]+$/),
      ]),
      restaurantSubTitle: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9\d,\s]+$/),
        Validators.maxLength(80),
      ]),
      image: new FormControl("", {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
      rating: new FormControl("", [Validators.required]),
      deliveryTime: new FormControl("30", [
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern(/^[0-9]+$/),
      ]),
      offerCode: new FormControl(""),
      address: new FormControl("", [Validators.required, Validators.maxLength(250)])
    });
    // Update form data if user is trying restaurant data
    if (this.updatableRestaurantInfo) {
      this.updateForm(this.updatableRestaurantInfo);
    }
  }
  /**
   * @ignore
   * method to assign rating selected
   */
  onSelectRating(event: Event) {
    this.selectedRate = +(event.target as HTMLSelectElement).value;
  }
  /**
   * @ignore
   * Method to update offer code information
   */
  onSelectOfferCode(event) {
    this.selectedOfferCode = (event.target as HTMLSelectElement).value;
    this.updateOfferCodeInfo(this.selectedOfferCode);
  }
  /**
   * @ignore
   * method to set file content to image control once file is selected
   */
  onSelectImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.fileName = file.name.toLowerCase().split(' ').join('_');
    this.addRestaurantFrom.patchValue({ image: file });
    this.addRestaurantFrom.get("image").updateValueAndValidity();
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePreview = fileReader.result as string;
    };
    fileReader.readAsDataURL(file);
  }
  /**
   * @ignore
   * on click of reset()
   */
  onClear() {
    // Hide info component if activated
    if (this.showScreen) {
      this.showScreen = !this.showScreen;
      this.status = null;
      this.message = null;
    }

    this.selectedRate = null;
    this.selectedOfferCode = null;
    this.offerText = null;
    this.offerPercentage = null;
    this.addRestaurantFrom.reset();
    this.addRestaurantFrom.clearAsyncValidators();
    this.imagePreview = null;
    this.filePicker.nativeElement.value = '';
    this.fileName = "no image is selected"
  }
  /**
   * @ignore
   * on click of Add restaurant
   */
  onAdd() {
    if (this.addRestaurantFrom.invalid) {
      return;
    }
    // Basic initializations required
    this.sharedService.activatePartialLoader(true);
    this.showScreen = false;
    this.message = '';
    this.status = '';

    let updatedData: AddRestaurant | FormData;
    updatedData = new FormData();
    updatedData.append("restaurantTitle", (this.addRestaurantFrom.value.restaurantTitle).charAt(0).toUpperCase() + this.addRestaurantFrom.value.restaurantTitle.slice(1));
    updatedData.append("restaurantSubTitle", (this.addRestaurantFrom.value.restaurantSubTitle).charAt(0).toUpperCase() + this.addRestaurantFrom.value.restaurantSubTitle.slice(1));
    if (this.addRestaurantFrom.get('image').value) {
      updatedData.append("image", this.addRestaurantFrom.value.image, this.addRestaurantFrom.value.restaurantTitle);
    } else {
      updatedData.append("image", this.updatableRestaurantInfo.imagePath);
    }
    updatedData.append("rating", this.addRestaurantFrom.value.rating);
    updatedData.append("deliveryTime", this.addRestaurantFrom.value.deliveryTime);
    updatedData.append("offerPercent", this.offerPercentage ? this.offerPercentage : "");
    updatedData.append("offerCode", this.addRestaurantFrom.value.offerCode);
    updatedData.append("address", this.addRestaurantFrom.value.address);

    if (this.updatableRestaurantInfo) {
      this.restaurantsService.updateRestaurant(updatedData, this.updatableRestaurantInfo.id).subscribe((httpResponse: RestaurantCrudResponse) => {
        if (httpResponse.status.code === 200) {
          this.sharedService.activatePartialLoader(false);
          let input = {
            showSnackbar: true,
            message: httpResponse.status.message,
            status: 'success'
          }
          // Activating snack bar through service
          this.sharedService.activateSnackbar(input);
          // Navigating to restaurants page to view newly updated restaurant.
          this.router.navigate(["/restaurants"]);
        }
      }, (error) => {
        if (error.error && error.error.status) {
          this.errorMessage(error.error.status.message);
        } else {
          this.errorMessage(null);
        }
      });
    } else {
      this.restaurantsService.addRestaurant(updatedData).subscribe((httpResponse: RestaurantCrudResponse) => {
        if (httpResponse.status.code === 201) {
          this.sharedService.activatePartialLoader(false);
          let input = {
            showSnackbar: true,
            message: httpResponse.status.message,
            status: 'success'
          }
          // Activating snack bar through service
          this.sharedService.activateSnackbar(input);
          // Navigating to restaurants page to view newly added restaurant.
          this.router.navigate(["/restaurants"]);
        }
      }, (error) => {
        if (error.error && error.error.status) {
          this.errorMessage(error.error.status.message);
        } else {
          this.errorMessage(null);
        }
      });
    }
  }
  /**
   * @ignore
   * Method to update offer code information
   */
  private updateOfferCodeInfo(selectedOfferCode) {
    this.offerText = null;
    this.offerPercentage = null;
    let offerCodeRow: Array<any> = this.offerCodes.filter(object => object.offerCode === selectedOfferCode);
    if (offerCodeRow.length > 0) {
      this.offerText = offerCodeRow[0].text;
      this.offerPercentage = offerCodeRow[0].offerPercentage;
    }
  }
  /**
   * @ignore
   * method to update reactive form for updation
   */
  private updateForm(updatableRestaurantInfo: Restaurant) {
    this.selectedRate = null;
    this.fileName = updatableRestaurantInfo.image.split('/')[4];
    if (updatableRestaurantInfo.imagePath) {
      this.imagePreview = updatableRestaurantInfo.image;
      this.addRestaurantFrom.get('image').clearValidators();
      this.addRestaurantFrom.get('image').clearAsyncValidators();
      this.addRestaurantFrom.get('image').updateValueAndValidity();
    }
    this.addRestaurantFrom.get('restaurantTitle').setValue(updatableRestaurantInfo.restaurantTitle);
    this.addRestaurantFrom.get('restaurantSubTitle').setValue(updatableRestaurantInfo.restaurantSubTitle);
    this.selectedRate = updatableRestaurantInfo.rating;
    this.addRestaurantFrom.get('rating').setValue(updatableRestaurantInfo.rating);

    this.addRestaurantFrom.get('deliveryTime').setValue(updatableRestaurantInfo.deliveryTime);

    this.selectedOfferCode = updatableRestaurantInfo.offerCode;
    this.updateOfferCodeInfo(this.selectedOfferCode);
    this.addRestaurantFrom.get('offerCode').setValue(updatableRestaurantInfo.offerCode);

    this.addRestaurantFrom.get('address').setValue(updatableRestaurantInfo.address);
  }
  /**
   * @ignore
   * Method to display error message
   */
  private errorMessage(message) {
    this.showScreen = true;
    this.status = 'error';
    this.message = message;
    this.sharedService.activatePartialLoader(false);
  }
}
