import { combineReducers } from 'redux'

import {
  REQUEST_RESTAURANTS,
  RECEIVE_RESTAURANTS,
  CHOOSE_RESTAURANT,
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
    case REQUEST_RESTAURANTS:
      return {
        ...state,
        ...{
          isLoading: true,
          all: state.all || [],
          filtered: state.filtered || [],
          chosen: state.chosen || {},
        }
      }
    case RECEIVE_RESTAURANTS:
      return {
        ...state,
        ...{
          isLoading: false,
          all: action.restaurants,
          filtered: action.restaurants,
        }
      }
    case CHOOSE_RESTAURANT:
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
