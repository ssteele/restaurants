import fetch from 'cross-fetch'
import {
  normalize,
  schema,
} from 'normalizr'

// const API_ENDPOINT = 'http://restaurants.steve-steele.com/api/'
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
  const { restaurants, restaurantIds, categories, zips, filteredIds } = json
  return {
    type: GET_RESTAURANTS_SUCCESS,
    restaurants,
    restaurantIds,
    categories,
    zips,
    filteredIds,
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

export function setFiltered(filteredIds: any): any {
  return {
    type: SET_FILTERED,
    filteredIds,
  }
}

export function setChosen(restaurantId: number): any {
  return {
    type: SET_CHOSEN_RESTAURANT,
    chosen: restaurantId,
  }
}

function filter(restaurants: any, restaurantIds: any, options: any) {
  const currentFilters = options.filter((option: any) => {
    return option.isChecked
  })

  return restaurantIds.filter((id: number) => {
    return currentFilters.every((option: any) => {
      return !!restaurants[id][option.name]
    })
  })
}

export function asyncToggleOption(option: any): any {
  return (dispatch: any, getState: any): any => {
    const { options, restaurants, restaurantIds }: any = getState().restaurant
    option.isChecked = !option.isChecked

    // update current options
    const updatedOptions = options.map((o: any) => {
      return (o.name === option.name) ? option : o
    })
    dispatch(setOptions(updatedOptions))
    localStorage.setItem('options', JSON.stringify(updatedOptions))

    const updatedFiltered = filter(restaurants, restaurantIds, updatedOptions)
    dispatch(setFiltered(updatedFiltered))
  }
}

export function asyncPickRandom(): any {
  return (dispatch: any, getState: any): any => {
    const { filteredIds }: any = getState().restaurant
    const index = Math.floor(Math.random() * Math.floor(filteredIds.length))

    dispatch(setChosen(filteredIds[index]))
  }
}

export function asyncFetchRestaurants(): any {
  return (dispatch: any, getState: any): any => {
    dispatch(get())

    return fetch(API_ENDPOINT)
      .then(
        response => response.json(),
        error => dispatch(getError(error))
      )
      .then((json) => {
        if (!json.error) {
          // define normalizr schemas
          const categorySchema = new schema.Entity('categories', {})
          const zipSchema = new schema.Entity('zips', {})
          const restaurantSchema = new schema.Entity('restaurants', {
            categories: [categorySchema],
            zips: [zipSchema],
          })

          // transform the payload for normalizr
          const jsonWithNestedIds = json.map((restaurant: any) => {
            let { categories, zips } = restaurant

            categories = categories.map((category: string) => {
              const id = category.toLowerCase().replace(/[\W]/g, '')
              return {id, name: category}
            })

            zips = zips.map((zip: number) => {
              return {id: zip, name: zip}
            })

            return {...restaurant, categories, zips}
          })

          // normalize
          const normalized = normalize(
            {restaurants: jsonWithNestedIds},
            {restaurants: [restaurantSchema]}
          )

          const { restaurants, categories, zips } = normalized.entities
          const { restaurants: restaurantIds } = normalized.result

          const { options }: any = getState().restaurant
          const filteredIds = filter(restaurants, restaurantIds, options)

          dispatch(getSuccess({
            restaurants,
            restaurantIds,
            categories,
            zips,
            filteredIds,
          }))
          dispatch(asyncPickRandom())
        }
      })
  }
}

export function asyncGetOptionsFromLocalStorage(): any {
  return (dispatch: any): any => {
    const storedOptions = localStorage.getItem('options')
    if (!!storedOptions) {
      const options = JSON.parse(storedOptions)
      dispatch(setOptions(options))
    }
  }
}
