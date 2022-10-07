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
  ZIP_NAME_MAP,
} from '../../constants'

/*
 * action types
 */
export const GET_RESTAURANTS = 'GET_RESTAURANTS'
export const GET_RESTAURANTS_SUCCESS = 'GET_RESTAURANTS_SUCCESS'
export const GET_RESTAURANTS_ERROR = 'GET_RESTAURANTS_ERROR'
export const GET_GEOLOCATION = 'GET_GEOLOCATION'
export const SET_MODAL = 'SET_MODAL'
export const SET_OPTIONS = 'SET_OPTIONS'
export const SET_GEOLOCATION = 'SET_GEOLOCATION'
export const SET_CURRENT_ZIP_META = 'SET_CURRENT_ZIP_META'
export const SET_OPTION_LOCATIONS = 'SET_OPTION_LOCATIONS'
export const SET_FILTERED = 'SET_FILTERED'
export const SET_CURRENT_RESTAURANT = 'SET_CURRENT_RESTAURANT'
export const SET_VIEWED_RESTAURANTS = 'SET_VIEWED_RESTAURANTS'
export const RESET_VIEWED_RESTAURANTS = 'RESET_VIEWED_RESTAURANTS'
export const SET_ERROR = 'SET_ERROR'

/*
 * action creators
 */
export function getRestaurants() {
  return {
    type: GET_RESTAURANTS,
  }
}

export function getRestaurantsSuccess(json: any) {
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

export function getRestaurantsError(error: any) {
  return {
    type: GET_RESTAURANTS_ERROR,
    error,
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

export function setOptionLocations(locations: any): any {
  return {
    type: SET_OPTION_LOCATIONS,
    locations,
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

export function resetViewed(): any {
  return {
    type: RESET_VIEWED_RESTAURANTS,
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
          const { value: zips } = option;
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

    dispatch(resetViewed())
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
      dispatch(setCurrent(viewed[newViewIndex]))
      dispatch(setViewed(null, newViewIndex))
      return
    }

    if (!(filteredIds.length > viewedLength)) {
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

export function prevRestaurant(): any {
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

export function fetchRestaurants(): any {
  return (dispatch: any, getState: any): any => {
    dispatch(getRestaurants())

    const endpoint = `${API_BASE_URL}/city/`
    return fetch(endpoint)
      .then(
        response => response.json(),
        error => dispatch(getRestaurantsError(error))
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
                const res: any = {id: zip}
                if (ZIP_NAME_MAP[zip]) {
                  res.name = ZIP_NAME_MAP[zip]
                } else {
                  res.name = null
                  console.warn(`Need name for zip: ${zip}`)
                }
                return res
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

          const { currentZipMeta, options }: any = getState().restaurant
          const filteredIds = filterRestaurants({
            currentZipMeta,
            options,
            restaurants,
            restaurantIds,
          })

          dispatch(getRestaurantsSuccess({
            restaurants,
            restaurantIds,
            categories,
            // zips, // @todo: remove me
            filteredIds,
          }))

          // order options by ZIP_NAME_MAP
          // zips = Object.entries(ZIP_NAME_MAP).map(([zip, name]: any) => {
          //   return {id: parseInt(zip), name}
          // })
          // console.log('SHS zips:', zips);

          const zipsArray = Object.values(zips as any)
          dispatch(setOptionLocations(zipsArray))
          dispatch(nextRestaurant())
        }
      })
  }
}

export function getZipsNear(zip: number) {
  return (dispatch: any, getState: any): any => {
    const endpoint = `${API_BASE_URL}/zip/?zip=${zip}`
    return fetch(endpoint)
      .then(
        response => response.json(),
        error => dispatch(setError(error))
      )
      .then((json) => {
        if (!json.error) {
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
        }
      })
  }
}

export function getZipFromLatLon({lat, lon}: any) {
  return (dispatch: any): any => {
    let geolocation
    if (IS_GOOGLE_MAPS_ENABLED) {
      console.warn('Google Maps API lookup is enabled');
      const googleMapsEndpoint = `${GOOGLE_MAPS_API_ENDPOINT}?latlng=${lat},${lon}&key=${GOOGLE_MAPS_API_KEY}`
      return fetch(googleMapsEndpoint)
        .then(
          response => response.json(),
          error => dispatch(setError(error))
        )
        .then((json) => {
          if (!json.error) {
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
          }
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
    }

    if (geolocation.zip) {
      dispatch(getZipsNear(geolocation.zip))
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
      const { name, setter } = item;
      const storedItemValue = localStorage.getItem(name)
      if (!!storedItemValue) {
        const value = JSON.parse(storedItemValue)
        dispatch(setter(value))
      }
    }
  }
}

export function getGeolocationFromLocalStorage(): any {
  return (dispatch: any): any => {
    const storedGeolocation = localStorage.getItem('geolocation')
    if (!!storedGeolocation) {
      const geolocation = JSON.parse(storedGeolocation)
      dispatch(setGeolocation(geolocation))
    }
  }
}
