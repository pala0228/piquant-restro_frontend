// images can be accessed from here
export const IMAGES = {
  background: {
    title: "Background image of login page",
    url: "assets/images/bg_1.jpg",
  },
  portfolio: {
    title: "portfolio image not loaded",
    url: "assets/images/portfolio-pic.png"
  }
};
// web socket connection types
export enum CONNECTION_TYPE {
  RESTAURANT = 'Restaurant',
  ITEM = 'Item'
}
// web socket action types
export enum ACTION_TYPE {
  CREATE = 'Create',
  UPDATE = 'Update',
  DELETE = 'Delete'
}
// web socket item categories
export enum ITEM_CATEGORY {
  STARTERS = 'starters',
  BIRYANIES = 'biryanis',
  DESSERTS = 'desserts'
}
