import { Action, ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";
import { IRestaurantStore } from "./RestaurantStore";

export type AppThunk = ActionCreator<
  ThunkAction<void, IRestaurantStore, null, Action<string>>
>;
