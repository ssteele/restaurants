import fetch from 'cross-fetch'

/*
 * action types
 */
export const GET_RESTAURANTS = 'GET_RESTAURANTS'
export const GET_RESTAURANTS_SUCCESS = 'GET_RESTAURANTS_SUCCESS'
export const GET_RESTAURANTS_ERROR = 'GET_RESTAURANTS_ERROR'
export const SET_CHOSEN_RESTAURANT = 'SET_CHOSEN_RESTAURANT'

/*
 * action creators
 */
export function getRestaurants() {
  return {
    type: GET_RESTAURANTS,
  }
}

export function getRestaurantsSuccess(json: any) {
  return {
    type: GET_RESTAURANTS_SUCCESS,
    restaurants: json,
  }
}

export function getRestaurantsError(json: any) {
  return {
    type: GET_RESTAURANTS_ERROR,
    restaurants: json,
  }
}

export function setChosenRestaurant(restaurant: any): any {
  return {
    type: SET_CHOSEN_RESTAURANT,
    chosen: restaurant,
  }
}

// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
// store.dispatch(fetchPosts('reactjs'))

export function fetchRestaurants(): any {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return (dispatch: any): any => {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(getRestaurants())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch('http://shs.restaurants.com:8888/api/')
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => console.log('An error occurred.', error)
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        dispatch(getRestaurantsSuccess(json))
      )
  }
}
