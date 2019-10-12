import { combineReducers } from 'redux'

import {
  RESTAURANT_INIT,
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

function restaurant(state: any = [], action: any) {
  switch (action.type) {
    case RESTAURANT_INIT:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
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
