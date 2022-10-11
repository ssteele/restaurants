export const GET_RESTAURANTS = 'GET_RESTAURANTS'
export const SET_RESTAURANTS = 'SET_RESTAURANTS'
export const GET_GEOLOCATION = 'GET_GEOLOCATION'
export const SET_GEOLOCATION = 'SET_GEOLOCATION'
export const SET_CURRENT_ZIP_META = 'SET_CURRENT_ZIP_META'
export const SET_OPTIONS = 'SET_OPTIONS'
export const SET_FILTERED = 'SET_FILTERED'
export const SET_CURRENT_RESTAURANT = 'SET_CURRENT_RESTAURANT'
export const SET_VIEWED_RESTAURANTS = 'SET_VIEWED_RESTAURANTS'
export const RESET_VIEWED_RESTAURANTS = 'RESET_VIEWED_RESTAURANTS'
export const SET_MODAL = 'SET_MODAL'
export const SET_ERROR = 'SET_ERROR'

export function getRestaurants() {
  return {
    type: GET_RESTAURANTS,
  }
}

export function setRestaurants(json: any) {
  const { restaurants, restaurantIds, categories, zips, filteredIds } = json
  return {
    type: SET_RESTAURANTS,
    restaurants,
    restaurantIds,
    categories,
    zips,
    filteredIds,
  }
}

export function getGeolocation() {
  return {
    type: GET_GEOLOCATION,
  }
}

export function setGeolocation(geolocation: any): any {
  return {
    type: SET_GEOLOCATION,
    geolocation,
  }
}

export function setCurrentZipMeta(currentZipMeta: any[]): any {
  return {
    type: SET_CURRENT_ZIP_META,
    currentZipMeta,
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

export function setCurrentRestaurant(restaurantId: number): any {
  return {
    type: SET_CURRENT_RESTAURANT,
    current: restaurantId,
  }
}

export function setViewedRestaurants(restaurantId: number | null, viewIndex: number): any {
  return {
    type: SET_VIEWED_RESTAURANTS,
    viewed: restaurantId,
    viewIndex,
  }
}

export function resetViewedRestaurants(): any {
  return {
    type: RESET_VIEWED_RESTAURANTS,
  }
}

export function setModal(isOpen: boolean): any {
  return {
    type: SET_MODAL,
    isOpen,
  }
}

export function setError(error: any) {
  return {
    type: SET_ERROR,
    error,
  }
}
