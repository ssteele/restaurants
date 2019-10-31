import { combineReducers } from 'redux'

import {
  GET_RESTAURANTS,
  GET_RESTAURANTS_SUCCESS,
  GET_RESTAURANTS_ERROR,
  SET_OPTIONS,
  SET_FILTERED,
  SET_CHOSEN_RESTAURANT,
} from '../actions/restaurant'

function restaurant(
  state: any = {
    isLoading: false,
    options: [
      {name: 'organic', isChecked: false},
      {name: 'local', isChecked: false},
    ],
    restaurants: {},
    restaurantIds: [],
    categories: [],
    zips: [],
    filteredIds: [],
    filteredCount: 0,
    chosen: null,
    error: {},
  },
  action: any
) {
  switch (action.type) {
    case GET_RESTAURANTS:
      return {
        ...state,
        ...{
          isLoading: true,
          restaurants: state.restaurants || {},
          restaurantIds: state.restaurantIds || [],
          filteredIds: state.filteredIds || [],
          filteredCount: state.filteredIds.length,
          chosen: state.chosen || null,
          error: {},
        }
      }

    case GET_RESTAURANTS_SUCCESS:
      return {
        ...state,
        ...{
          isLoading: false,
          restaurants: action.restaurants || {},
          restaurantIds: action.restaurantIds || [],
          categories: action.categories || [],
          zips: action.zips || [],
          filteredIds: action.filteredIds || [],
          filteredCount: action.filteredIds.length,
        }
      }

    case GET_RESTAURANTS_ERROR:
      return {
        ...state,
        ...{
          isLoading: false,
          restaurants: state.restaurants || {},
          restaurantIds: state.restaurantIds || [],
          filteredIds: state.filteredIds || [],
          filteredCount: state.filteredIds.length,
          error: action.error,
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

    case SET_CHOSEN_RESTAURANT:
      return {
        ...state,
        ...{
          chosen: action.chosen || null,
        }
      }

    default:
      return state
  }
}

const restaurantApp = combineReducers({
  restaurant,
})

export default restaurantApp
