import { combineReducers } from 'redux'

import {
  GET_RESTAURANTS,
  GET_RESTAURANTS_SUCCESS,
  GET_RESTAURANTS_ERROR,
  SET_MODAL,
  SET_OPTIONS,
  GET_GEOLOCATION,
  SET_GEOLOCATION,
  SET_ZIPS_NEARBY,
  SET_OPTION_LOCATIONS,
  SET_FILTERED,
  SET_CURRENT_RESTAURANT,
  SET_VIEWED_RESTAURANTS,
  RESET_VIEWED_RESTAURANTS,
  SET_ERROR,
} from '../actions/restaurant'

function restaurant(
  state: any = {
    isLoading: false,
    options: [
      // {
      //   name: 'location',
      //   description: 'Location',
      //   type: 'locationSelect',
      //   value: [],
      //   values: [],
      // },
      {name: 'nearby', description: 'Only near me', type: 'checkbox', value: false},
      {name: 'kids', description: 'Only kid-friendly', type: 'checkbox', value: false},
      {name: 'organic', description: 'Only organic', type: 'checkbox', value: false},
      {name: 'local', description: 'Only locally sourced', type: 'checkbox', value: false},
      {name: 'vegetarian', description: 'Only vegetarian', type: 'checkbox', value: false},
      {name: 'keto', description: 'Only keto-friendly', type: 'checkbox', value: false},
      {name: 'meat', description: 'Only meat-friendly', type: 'checkbox', value: false},
      {name: 'indoor', description: 'Only indoor seating', type: 'checkbox', value: false},
      {name: 'outdoor', description: 'Only outdoor seating', type: 'checkbox', value: false},
    ],
    restaurants: {},
    restaurantIds: [],
    categories: [],
    geolocation: {
      isGeolocating: false,
    },
    zips: [],
    zipsNearby: [],
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

    case GET_RESTAURANTS_SUCCESS:
      return {
        ...state,
        ...{
          isLoading: false,
          restaurants: action.restaurants || {},
          restaurantIds: action.restaurantIds || [],
          categories: action.categories || [],
          // @todo: zips store node not used currently - can change this to be locations if desired
          // zips: action.zips || [],
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
            ...action.location,
            ...{
              isGeolocating: false,
            }
          }
        }
      }

    case SET_ZIPS_NEARBY:
      return {
        ...state,
        ...{
          zipsNearby: action.zips,
        }
      }

    case SET_OPTION_LOCATIONS:
      return {
        ...state,
        ...{
          options: state.options.map((o: any) => {
              if ('location' === o.name) {
                o.values = action.locations
              }
              return o
          }),
        }
      }

    case SET_MODAL:
      return {
        ...state,
        ...{
          modalIsOpen: action.isOpen,
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
