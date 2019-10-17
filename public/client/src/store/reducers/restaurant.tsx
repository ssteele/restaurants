import { combineReducers } from 'redux'

import {
  GET_RESTAURANTS,
  GET_RESTAURANTS_SUCCESS,
  GET_RESTAURANTS_ERROR,
  SET_CHOSEN_RESTAURANT,
} from '../actions/restaurant'

function restaurant(
  state: any = {
    isLoading: false,
    all: [],
    filtered: [],
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
          filtered: action.all || [],
        }
      }

    case GET_RESTAURANTS_ERROR:
      return {
        ...state,
        ...{
          isLoading: false,
          all: state.all || [],
          filtered: state.filtered || [],
          error: action.error,
        }
      }

    case SET_CHOSEN_RESTAURANT:
      return {
        ...state,
        ...{
          chosen: action.chosen || {},
        }
      }

    // case TOGGLE_TODO:
    //   return state.map((todo, index) => {
    //     if (index === action.index) {
    //       return Object.assign({}, todo, {
    //         completed: !todo.completed
    //       })
    //     }
    //     return todo
    //   })

    default:
      return state
  }
}

const restaurantApp = combineReducers({
  restaurant,
})

export default restaurantApp
