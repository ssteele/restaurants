import { combineReducers } from 'redux'

import {
  GET_RESTAURANTS,
  SET_RESTAURANTS,
  GET_GEOLOCATION,
  SET_GEOLOCATION,
  SET_CURRENT_ZIP_META,
  SET_OPTIONS,
  SET_FILTERED,
  SET_CURRENT_RESTAURANT,
  SET_VIEWED_RESTAURANTS,
  RESET_VIEWED_RESTAURANTS,
  SET_MODAL,
  SET_ERROR,
} from '../actions/restaurant'
import {
  DEFAULT_MAX_NEARBY_ZIP_MI_DISTANCE,
  MAX_NEARBY_ZIP_MI_DISTANCE_OPTIONS,
} from '../../constants'

function restaurant(
  state: any = {
    isLoading: false,
    options: [
      {name: 'nearby', description: 'Only near me', type: 'checkbox', value: false, rendered: true, disabled: true},
      {
        name: 'nearbyMaxMiles',
        description: '... how close?',
        type: 'select',
        value: DEFAULT_MAX_NEARBY_ZIP_MI_DISTANCE,
        values: MAX_NEARBY_ZIP_MI_DISTANCE_OPTIONS,
        rendered: false,
        disabled: true,
      },
      {name: 'kids', description: 'Only kid-friendly', type: 'checkbox', value: false, rendered: true, disabled: false},
      {name: 'organic', description: 'Only organic', type: 'checkbox', value: false, rendered: true, disabled: false},
      {name: 'local', description: 'Only locally sourced', type: 'checkbox', value: false, rendered: true, disabled: false},
      {name: 'vegetarian', description: 'Only vegetarian', type: 'checkbox', value: false, rendered: true, disabled: false},
      {name: 'keto', description: 'Only keto-friendly', type: 'checkbox', value: false, rendered: true, disabled: false},
      {name: 'meat', description: 'Only meat-friendly', type: 'checkbox', value: false, rendered: true, disabled: false},
      {name: 'indoor', description: 'Only indoor seating', type: 'checkbox', value: false, rendered: true, disabled: false},
      {name: 'outdoor', description: 'Only outdoor seating', type: 'checkbox', value: false, rendered: true, disabled: false},
      {name: 'playground', description: 'Only with playground', type: 'checkbox', value: false, rendered: true, disabled: false},
      {name: 'playarea', description: 'Only with play area', type: 'checkbox', value: false, rendered: true, disabled: false},
    ],
    restaurants: {},
    restaurantIds: [],
    categories: [],
    geolocation: { isGeolocating: false },
    currentZipMeta: [],
    filteredIds: [],
    filteredCount: 0,
    current: null,
    viewed: [],
    viewIndex: null,
    modalIsOpen: false,
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

    case SET_CURRENT_ZIP_META:
      return {
        ...state,
        ...{
          currentZipMeta: action.currentZipMeta,
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

const restaurantApp = combineReducers({
  restaurant,
})

export default restaurantApp
