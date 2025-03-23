import { IGeolocation } from "@/models/Geolocation"
import { IRestaurantOption } from "@/models/RestaurantOption"

export const GET_RESTAURANTS = 'GET_RESTAURANTS'
export const SET_RESTAURANTS = 'SET_RESTAURANTS'
export const GET_GEOLOCATION = 'GET_GEOLOCATION'
export const SET_GEOLOCATION = 'SET_GEOLOCATION'
export const SET_OPTIONS = 'SET_OPTIONS'
export const SET_FILTERED = 'SET_FILTERED'
export const SET_CURRENT_RESTAURANT = 'SET_CURRENT_RESTAURANT'
export const SET_VIEWED_RESTAURANTS = 'SET_VIEWED_RESTAURANTS'
export const RESET_GEOLOCATION = 'RESET_GEOLOCATION'
export const RESET_VIEWED_RESTAURANTS = 'RESET_VIEWED_RESTAURANTS'
export const SET_MODAL = 'SET_MODAL'
export const SET_ERROR = 'SET_ERROR'

export const getRestaurants = () => {
  return {
    type: GET_RESTAURANTS,
  }
}

export const setRestaurants = (restaurant: any): any => {
  const { restaurants, restaurantIds, categories, filteredIds } = restaurant
  return {
    type: SET_RESTAURANTS,
    restaurants,
    restaurantIds,
    categories,
    filteredIds,
  }
}

export const getGeolocation = (): { type: string } => {
  return {
    type: GET_GEOLOCATION,
  }
}

export const setGeolocation = (geolocation: IGeolocation): { type: string, geolocation: IGeolocation } => {
  return {
    type: SET_GEOLOCATION,
    geolocation,
  }
}

export const resetGeolocation = (): { type: string } => {
  return {
    type: RESET_GEOLOCATION,
  }
}

export const setOptions = (options: IRestaurantOption[]): { type: string, options: IRestaurantOption[]} => {
  return {
    type: SET_OPTIONS,
    options,
  }
}

export const setFiltered = (filteredIds: number[]): { type: string, filteredIds: number[]} => {
  return {
    type: SET_FILTERED,
    filteredIds,
  }
}

export const setCurrentRestaurant = (restaurantId: number): { type: string, current: number} => {
  return {
    type: SET_CURRENT_RESTAURANT,
    current: restaurantId,
  }
}

export const setViewedRestaurants = (restaurantId: number | null, viewIndex: number): { type: string, viewed: number | null, viewIndex: number} => {
  return {
    type: SET_VIEWED_RESTAURANTS,
    viewed: restaurantId,
    viewIndex,
  }
}

export const resetViewedRestaurants = (): { type: string } => {
  return {
    type: RESET_VIEWED_RESTAURANTS,
  }
}

export const setModal = (isOpen: boolean): { type: string, isOpen: boolean} => {
  return {
    type: SET_MODAL,
    isOpen,
  }
}

export const setError = (error: any): { type: string, error: any} => {
  return {
    type: SET_ERROR,
    error,
  }
}
