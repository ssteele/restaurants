import { combineReducers } from 'redux'

import {
  REQUEST_RESTAURANTS,
  RECEIVE_RESTAURANTS,
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
    list: [],
  },
  action: any
) {
  switch (action.type) {
    case REQUEST_RESTAURANTS:
      return {
        ...state,
        ...{
          isLoading: true,
        }
      }
    case RECEIVE_RESTAURANTS:
      return {
        ...state,
        ...{
          isLoading: false,
          list: action.restaurants,
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
