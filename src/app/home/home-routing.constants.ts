import { Route } from "@angular/router";
import { HomeComponent } from "./home.component";

// Routes registrations
export const HOME_ROUTING: Route = {
  path: "",
  component: HomeComponent,
  children: [
  ]
};
