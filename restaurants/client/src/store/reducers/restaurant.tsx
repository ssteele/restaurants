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
    all: [],
    options: [
      {name: 'organic', isChecked: false},
      {name: 'local', isChecked: false},
    ],
    filtered: [],
    filteredCount: 0,
    chosen: {},
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
          all: state.all || [],
          filtered: state.filtered || [],
          filteredCount: state.filtered.length,
          chosen: state.chosen || {},
          error: {},
        }
      }

    case GET_RESTAURANTS_SUCCESS:
      return {
        ...state,
        ...{
          isLoading: false,
          all: action.all || [],
          filtered: action.filtered || [],
          filteredCount: action.filtered.length,
        }
      }

    case GET_RESTAURANTS_ERROR:
      return {
        ...state,
        ...{
          isLoading: false,
          all: state.all || [],
          filtered: state.filtered || [],
          filteredCount: state.filtered.length,
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
          filtered: action.filtered || [],
          filteredCount: action.filtered.length,
        }
      }

    case SET_CHOSEN_RESTAURANT:
      return {
        ...state,
        ...{
          chosen: action.chosen || {},
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
