import fetch from 'cross-fetch'
import {
  normalize,
  schema,
} from 'normalizr'
import { API_ENDPOINT } from '../../constants'

/*
 * action types
 */
export const GET_RESTAURANTS = 'GET_RESTAURANTS'
export const GET_RESTAURANTS_SUCCESS = 'GET_RESTAURANTS_SUCCESS'
export const GET_RESTAURANTS_ERROR = 'GET_RESTAURANTS_ERROR'
export const SET_MODAL = 'SET_MODAL'
export const SET_OPTIONS = 'SET_OPTIONS'
export const SET_FILTERED = 'SET_FILTERED'
export const SET_CURRENT_RESTAURANT = 'SET_CURRENT_RESTAURANT'
export const SET_VIEWED_RESTAURANTS = 'SET_VIEWED_RESTAURANTS'

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

export function setModal(isOpen: boolean): any {
  return {
    type: SET_MODAL,
    isOpen,
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

export function setCurrent(restaurantId: number): any {
  return {
    type: SET_CURRENT_RESTAURANT,
    current: restaurantId,
  }
}

export function setViewed(restaurantId: number | null, viewIndex: number): any {
  return {
    type: SET_VIEWED_RESTAURANTS,
    viewed: restaurantId,
    viewIndex,
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

function getRandomPositiveInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max))
}

export function asyncToggleModal(): any {
  return (dispatch: any, getState: any): any => {
    const { modalIsOpen }: any = getState().restaurant
    if (modalIsOpen) {
      dispatch(asyncNextRestaurant())
    }
    dispatch(setModal(!modalIsOpen))
  }
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

export function asyncNextRestaurant(): any {
  return (dispatch: any, getState: any): any => {
    const { filteredIds, viewed, viewIndex }: any = getState().restaurant
    let index = 0
    const viewedLength = viewed.length
    const newViewIndex = viewIndex + 1
    if (newViewIndex < viewedLength) {
      // navigate through viewed restaurant history
      dispatch(setCurrent(viewed[newViewIndex]))
      dispatch(setViewed(null, newViewIndex))
      return
    }

    if (!(filteredIds.length > 1 && filteredIds.length > viewedLength)) {
      // cycle back to start of viewed restaurant list
      dispatch(setCurrent(viewed[0]))
      dispatch(setViewed(null, 0))
      return
    } else {
      // go to next restaurant
      const remainingRestaurantIds = filteredIds.filter((r: number) => !viewed.includes(r))
      const randomIndex = getRandomPositiveInt(remainingRestaurantIds.length)
      const randomRestaurantId = remainingRestaurantIds[randomIndex]
      index = filteredIds.indexOf(randomRestaurantId)
      dispatch(setCurrent(filteredIds[index]))
      dispatch(setViewed(filteredIds[index], viewedLength))
      return
    }
  }
}

export function asyncBackRestaurant(): any {
  return (dispatch: any, getState: any): any => {
    const { viewed, viewIndex }: any = getState().restaurant
    let newViewIndex = viewIndex - 1
    if (newViewIndex >= 0) {
      dispatch(setCurrent(viewed[newViewIndex]))
      dispatch(setViewed(null, newViewIndex))
    } else {
      newViewIndex = viewed.length - 1
      dispatch(setCurrent(viewed[newViewIndex]))
      dispatch(setViewed(null, newViewIndex))
    }
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
          const jsonWithNestedIds = json
            .filter((restaurant: any) => !!restaurant.enabled)
            .map((restaurant: any) => {
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
            {restaurants: [restaurantSchema]},
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
          dispatch(asyncNextRestaurant())
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
