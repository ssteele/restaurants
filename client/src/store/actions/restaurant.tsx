import fetch from 'cross-fetch'
import {
  normalize,
  schema,
} from 'normalizr'
import {
  API_BASE_URL,
  DEFAULT_ZIP,
  GOOGLE_MAPS_API_ENDPOINT,
  GOOGLE_MAPS_API_KEY,
  IS_GOOGLE_MAPS_ENABLED,
} from '../../constants'

/*
 * action types
 */
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

/*
 * action creators
 */
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

function filterRestaurants({
  currentZipMeta,
  options,
  restaurants,
  restaurantIds,
}: any) {
  const currentFilters = options.filter((option: any) => {
    return option.value
  })

  return restaurantIds.filter((id: number) => {
    let res = false
    return currentFilters.every((option: any) => {
      switch (option.name) {
        case 'nearby':
        case 'nearbyMaxMiles':
          if ('geolocation' in navigator) {
            const nearbyOption = options.find((o: any) => 'nearby' === o.name)
            if (!currentZipMeta.length || !nearbyOption.value) {
              res = true
            } else {
              // calculate nearby zips
              const nearbyMaxMilesOption = options.find((o: any) => 'nearbyMaxMiles' === o.name)
              const nearbyMaxKm = 1.609344 * nearbyMaxMilesOption.value
              const zipsNearby = currentZipMeta
                .filter(({ distance }: any) => parseFloat(distance) <= nearbyMaxKm)
                .map(({ postalCode }: any) => parseInt(postalCode))

              if (zipsNearby.length) {
                res = restaurants[id]['zips'].filter((x: number) => zipsNearby.includes(x)).length
              }
            }
          } else {
            console.warn('Location services are unavailable')
            res = true
          }
          break
        case 'location':
          const { value: zips } = option
          res = zips.filter((z: string) => restaurants[id]['zips'].includes(parseInt(z))).length
          break
        case 'kids':
          res = !!restaurants[id][option.name].length
          break
        case 'meat':
          res = !restaurants[id]['vegan'] && !restaurants[id]['vegetarian']
          break
        default: 
          res = !!restaurants[id][option.name]
          break
      }
      return res
    })
  })
}

function getRandomPositiveInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max))
}

export function toggleModal(): any {
  return (dispatch: any, getState: any): any => {
    const { modalIsOpen }: any = getState().restaurant
    dispatch(setModal(!modalIsOpen))
  }
}

function handleFilterUpdate(option: any): any {
  return (dispatch: any, getState: any): any => {
    const { currentZipMeta, options, restaurants, restaurantIds }: any = getState().restaurant

    // update current options
    const updatedOptions = options.map((o: any) => {
      return (o.name === option.name) ? option : o
    })
    dispatch(setOptions(updatedOptions))
    localStorage.setItem('options', JSON.stringify(updatedOptions))

    // update filtered restaurants
    const updatedFiltered = filterRestaurants({
      currentZipMeta,
      options: updatedOptions,
      restaurants,
      restaurantIds,
    })
    dispatch(setFiltered(updatedFiltered))
    dispatch(resetViewedRestaurants())
    dispatch(nextRestaurant())
  }
}

export function selectOption(option: any, value: any): any {
  option.value = value
  return handleFilterUpdate(option)
}

export function toggleOption(option: any): any {
  option.value = !option.value
  return handleFilterUpdate(option)
}

export function nextRestaurant(): any {
  return (dispatch: any, getState: any): any => {
    const { filteredIds, viewed, viewIndex }: any = getState().restaurant
    let index = 0
    const viewedLength = viewed.length
    const newViewIndex = viewIndex + 1
    if (newViewIndex < viewedLength) {
      // navigate through viewed restaurant history
      dispatch(setCurrentRestaurant(viewed[newViewIndex]))
      dispatch(setViewedRestaurants(null, newViewIndex))
      return
    }

    if (!(filteredIds.length > viewedLength)) {
      // cycle back to start of viewed restaurant list
      dispatch(setCurrentRestaurant(viewed[0]))
      dispatch(setViewedRestaurants(null, 0))
      return
    } else {
      // go to next restaurant
      const remainingRestaurantIds = filteredIds.filter((r: number) => !viewed.includes(r))
      const randomIndex = getRandomPositiveInt(remainingRestaurantIds.length)
      const randomRestaurantId = remainingRestaurantIds[randomIndex]
      index = filteredIds.indexOf(randomRestaurantId)
      dispatch(setCurrentRestaurant(filteredIds[index]))
      dispatch(setViewedRestaurants(filteredIds[index], viewedLength))
      return
    }
  }
}

export function prevRestaurant(): any {
  return (dispatch: any, getState: any): any => {
    const { viewed, viewIndex }: any = getState().restaurant
    let newViewIndex = viewIndex - 1
    if (newViewIndex >= 0) {
      dispatch(setCurrentRestaurant(viewed[newViewIndex]))
      dispatch(setViewedRestaurants(null, newViewIndex))
    } else {
      newViewIndex = viewed.length - 1
      dispatch(setCurrentRestaurant(viewed[newViewIndex]))
      dispatch(setViewedRestaurants(null, newViewIndex))
    }
  }
}

export function fetchRestaurants(): any {
  return (dispatch: any, getState: any): any => {
    dispatch(getRestaurants())

    const endpoint = `${API_BASE_URL}/city/`
    return fetch(endpoint)
      .then(
        response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Error retrieving restaurants')
        },
        error => {
          dispatch(setError(error))
          throw new Error(error)
        },
      )
      .then((json) => {
        if (json) {
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
              const { categories } = restaurant

              const normalizedCategories = categories.map((category: string) => {
                const id = category.toLowerCase().replace(/[\W]/g, '')
                return {id, name: category}
              })

              return {
                ...restaurant,
                categories: normalizedCategories,
              }
            })

          // normalize
          const normalized = normalize(
            {restaurants: jsonWithNestedIds},
            {restaurants: [restaurantSchema]},
          )

          const { restaurants, categories } = normalized.entities
          const { restaurants: restaurantIds } = normalized.result

          const { currentZipMeta, options }: any = getState().restaurant
          const filteredIds = filterRestaurants({
            currentZipMeta,
            options,
            restaurants,
            restaurantIds,
          })

          dispatch(setRestaurants({
            restaurants,
            restaurantIds,
            categories,
            filteredIds,
          }))

          dispatch(nextRestaurant())
        } else {
          throw new Error('Error retrieving restaurants')
        }
      })
      .catch(error => console.error(error))
  }
}

export function getZipsNear(zip: number) {
  return (dispatch: any, getState: any): any => {
    const endpoint = `${API_BASE_URL}/zip/?zip=${zip}`
    return fetch(endpoint)
      .then(
        response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Error retrieving nearby zips')
        },
        error => {
          dispatch(setError(error))
          throw new Error(error)
        },
      )
      .then((json) => {
        if (json) {
          // save current zip proximities
          const { postalCodes } = json
          dispatch(setCurrentZipMeta(postalCodes))
          localStorage.setItem('currentZipMeta', JSON.stringify(postalCodes))

          // update geolocation filter options
          const { options }: any = getState().restaurant
          const nearbyOption = options.find((o: any) => 'nearby' === o.name)
          nearbyOption.value = true
          nearbyOption.disabled = false

          const nearbyMaxMilesOption = options.find((o: any) => 'nearbyMaxMiles' === o.name)
          nearbyMaxMilesOption.rendered = true
          nearbyMaxMilesOption.disabled = false

          // ...and filter restaurants
          dispatch(handleFilterUpdate(nearbyOption))
          dispatch(handleFilterUpdate(nearbyMaxMilesOption))  // @todo: allow method to handle array?
        } else {
          throw new Error('Error retrieving nearby zips')
        }
      })
      .catch(error => {
        console.error(error)
        const geolocation = {isGeolocating: false}
        dispatch(setGeolocation(geolocation))
        localStorage.setItem('geolocation', JSON.stringify(geolocation))
      })
  }
}

export function getZipFromLatLon({lat, lon}: any) {
  return (dispatch: any): any => {
    let geolocation: any = {}
    if (IS_GOOGLE_MAPS_ENABLED) {
      console.warn('Google Maps API lookup is enabled')
      const googleMapsEndpoint = `${GOOGLE_MAPS_API_ENDPOINT}?latlng=${lat},${lon}&key=${GOOGLE_MAPS_API_KEY}`
      fetch(googleMapsEndpoint)
        .then(
          response => {
            if (response.ok) {
              return response.json()
            }
            throw new Error('Google API - Error getting zip from lat/lon')
          },
          error => {
            dispatch(setError(error))
            throw new Error(error)
          },
        )
        .then((json) => {
          if (!json.error_message && json.results.length) {
            const addressComponents = json.results[0].address_components
            const zip: any = addressComponents.find((ac: any) => ac.types.includes('postal_code')).short_name
            geolocation = {
              lat,
              lon,
              timestamp: Date.now(),
              zip: parseInt(zip),
            }
            dispatch(setGeolocation(geolocation))
            localStorage.setItem('geolocation', JSON.stringify(geolocation))

            if (geolocation.zip) {
              dispatch(getZipsNear(geolocation.zip))
            }
          } else {
            throw new Error(`Google API - Error getting zip from lat/lon: ${json.error_message}`)
          }
        })
        .catch(error => {
          console.error(error)
          geolocation = {isGeolocating: false}
          dispatch(setGeolocation(geolocation))
          localStorage.setItem('geolocation', JSON.stringify(geolocation))
        })
    } else {
      geolocation = {
        lat,
        lon,
        timestamp: Date.now(),
        zip: DEFAULT_ZIP,
      }
      dispatch(setGeolocation(geolocation))
      localStorage.setItem('geolocation', JSON.stringify(geolocation))

      if (geolocation.zip) {
        dispatch(getZipsNear(geolocation.zip))
      }
    }
  }
}

export function setReduxFromLocalStore(): any {
  return (dispatch: any): any => {
    const localStoreItems = [
      {
        name: 'geolocation',
        setter: setGeolocation,
      },
      {
        name: 'currentZipMeta',
        setter: setCurrentZipMeta,
      },
      {
        name: 'options',
        setter: setOptions,
      },
    ]

    for (let item of localStoreItems) {
      const { name, setter } = item
      const storedItemValue = localStorage.getItem(name)
      if (!!storedItemValue) {
        const value = JSON.parse(storedItemValue)
        dispatch(setter(value))
      }
    }
  }
}
