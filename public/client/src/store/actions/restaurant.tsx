import fetch from 'cross-fetch'

const API_ENDPOINT = 'http://shs.restaurants.com:8888/api/'

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
    all: json,
  }
}

export function getRestaurantsError(error: any) {
  return {
    type: GET_RESTAURANTS_ERROR,
    error,
  }
}

export function setChosenRestaurant(restaurant: any): any {
  return {
    type: SET_CHOSEN_RESTAURANT,
    chosen: restaurant,
  }
}

export function fetchRestaurants(): any {
  return (dispatch: any): any => {
    dispatch(getRestaurants())

    return fetch(API_ENDPOINT)
      .then(
        response => response.json(),
        error => dispatch(getRestaurantsError(error))
      )
      .then((json) => {
        if (!json.error) {
          dispatch(getRestaurantsSuccess(json))
        }
      })
  }
}
