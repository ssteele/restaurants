import fetch from 'cross-fetch'

const API_ENDPOINT = 'http://shs.restaurants.com:8888/api/'

/*
 * action types
 */
export const GET_RESTAURANTS = 'GET_RESTAURANTS'
export const GET_RESTAURANTS_SUCCESS = 'GET_RESTAURANTS_SUCCESS'
export const GET_RESTAURANTS_ERROR = 'GET_RESTAURANTS_ERROR'
export const SET_OPTIONS = 'SET_OPTIONS'
export const SET_FILTERED = 'SET_FILTERED'
export const SET_CHOSEN_RESTAURANT = 'SET_CHOSEN_RESTAURANT'

/*
 * action creators
 */
export function get() {
  return {
    type: GET_RESTAURANTS,
  }
}

export function getSuccess(json: any) {
  return {
    type: GET_RESTAURANTS_SUCCESS,
    all: json,
  }
}

export function getError(error: any) {
  return {
    type: GET_RESTAURANTS_ERROR,
    error,
  }
}

export function setOptions(options: any): any {
  return {
    type: SET_OPTIONS,
    options,
  }
}

export function setFiltered(filtered: any): any {
  return {
    type: SET_FILTERED,
    filtered,
  }
}

export function setChosen(restaurant: any): any {
  return {
    type: SET_CHOSEN_RESTAURANT,
    chosen: restaurant,
  }
}

export function asyncToggleOption(option: any): any {
  return (dispatch: any, getState: any): any => {
    const { options, all }: any = getState().restaurant
    option.isChecked = !option.isChecked

    // update current options
    const updatedOptions = options.map((o: any) => {
      return (o.name === option.name) ? option : o;
    })
    dispatch(setOptions(updatedOptions))

    // filter restaurants
    const currentFilters = updatedOptions.filter((option: any) => {
      return option.isChecked
    })
    const updatedFiltered = all.filter((restaurant: any) => {
      return currentFilters.every((option: any) => {
        return !!restaurant[option.name]
      })
    })
    dispatch(setFiltered(updatedFiltered))
  }
}

export function asyncPickRandom(): any {
  return (dispatch: any, getState: any): any => {
    const { filtered }: any = getState().restaurant
    const index = Math.floor(Math.random() * Math.floor(filtered.length))

    dispatch(setChosen(filtered[index]))
  }
}

export function asyncFetchRestaurants(): any {
  return (dispatch: any): any => {
    dispatch(get())

    return fetch(API_ENDPOINT)
      .then(
        response => response.json(),
        error => dispatch(getError(error))
      )
      .then((json) => {
        if (!json.error) {
          dispatch(getSuccess(json))
          dispatch(asyncPickRandom())
        }
      })
  }
}
