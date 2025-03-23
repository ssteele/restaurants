import { combineReducers } from 'redux'
import {
  GET_RESTAURANTS,
  SET_RESTAURANTS,
  GET_GEOLOCATION,
  SET_GEOLOCATION,
  SET_OPTIONS,
  SET_FILTERED,
  SET_CURRENT_RESTAURANT,
  SET_VIEWED_RESTAURANTS,
  RESET_VIEWED_RESTAURANTS,
  SET_MODAL,
  SET_ERROR,
} from '../actions/restaurant'
import { restaurantStore as initialRestaurantState } from '../initial/restaurantStore'
import { IRestaurantStore } from '../../models/RestaurantStore'

export const restaurantStore = (
  state: IRestaurantStore = initialRestaurantState,
  action: any
): IRestaurantStore => {
  switch (action.type) {
    case GET_RESTAURANTS:
      return {
        ...state,
        ...{
          isLoading: true,
          restaurants: state.restaurants || null,
          restaurantIds: state.restaurantIds || [],
          filteredIds: state.filteredIds || [],
          filteredCount: state.filteredIds.length,
          current: state.current || null,
          viewed: state.viewed || [],
          error: {},
        }
      }

    case SET_RESTAURANTS:
      return {
        ...state,
        ...{
          isLoading: false,
          restaurants: action.restaurants || {},
          restaurantIds: action.restaurantIds || [],
          categories: action.categories || [],
          filteredIds: action.filteredIds || [],
          filteredCount: action.filteredIds.length,
        }
      }

    case GET_GEOLOCATION:
      return {
        ...state,
        ...{
          geolocation: {
            ...state.geolocation,
            ...{
              isGeolocating: true,
            }
          }
        }
      }

    case SET_GEOLOCATION:
      return {
        ...state,
        ...{
          geolocation: {
            ...action.geolocation,
            ...{
              isGeolocating: false,
            }
          }
        }
      }

    case SET_OPTIONS:
      return {
        ...state,
        ...{
          options: action.options,
        }
      }

    case SET_FILTERED:
      return {
        ...state,
        ...{
          filteredIds: action.filteredIds || [],
          filteredCount: action.filteredIds.length,
        }
      }

    case SET_CURRENT_RESTAURANT:
      return {
        ...state,
        ...{
          current: action.current || null,
        }
      }

    case SET_VIEWED_RESTAURANTS:
      return {
        ...state,
        ...{
          viewed: !!action.viewed ? [...state.viewed, action.viewed] : state.viewed,
          viewIndex: action.viewIndex,
        }
      }

    case RESET_VIEWED_RESTAURANTS:
      return {
        ...state,
        ...{
          viewed: [],
          viewIndex: null,
        }
      }

    case SET_MODAL:
      return {
        ...state,
        ...{
          modalIsOpen: action.isOpen,
        }
      }

    case SET_ERROR:
      return {
        ...state,
        ...{
          error: action.error,
        }
      }

    default:
      return state
  }
}

export const rootReducer = combineReducers({
  restaurantStore,
})
