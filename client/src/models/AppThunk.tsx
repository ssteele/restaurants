import { Action, ActionCreator } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { IRestaurantStore } from "./RestaurantStore";

export type AppThunkAction = ActionCreator<
  ThunkAction<
    void,
    IRestaurantStore,
    null,
    Action<string>
  >
>;

export type AppThunkDispatch = ThunkDispatch<
  IRestaurantStore,
  null,
  Action
>;
