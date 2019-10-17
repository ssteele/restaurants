import { combineReducers } from 'redux'

import {
  GET_RESTAURANTS,
  GET_RESTAURANTS_SUCCESS,
  SET_CHOSEN_RESTAURANT,
//   SET_VISIBILITY_FILTER,
//   VisibilityFilters,
} from '../actions/restaurant'
// const { SHOW_ALL } = VisibilityFilters

// function visibilityFilter(state = SHOW_ALL, action) {
//   switch (action.type) {
//     case SET_VISIBILITY_FILTER:
//       return action.filter
//     default:
//       return state
//   }
// }

function restaurant(
  state: any = {
    isLoading: false,
    all: [],
    filtered: [],
    chosen: {},
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
        }
      }
    case GET_RESTAURANTS_SUCCESS:
      return {
        ...state,
        ...{
          isLoading: false,
          all: action.restaurants,
          filtered: action.restaurants,
        }
      }
    case SET_CHOSEN_RESTAURANT:
      return {
        ...state,
        ...{
          chosen: action.chosen,
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
//   visibilityFilter,
  restaurant
})

export default restaurantApp
