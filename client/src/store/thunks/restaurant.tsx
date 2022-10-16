import fetch from 'cross-fetch'
import {
  normalize,
  schema,
} from 'normalizr'
import {
  getRestaurants,
  getGeolocation,
  resetViewedRestaurants,
  setCurrentRestaurant,
  setCurrentZipMeta,
  setError,
  setFiltered,
  setGeolocation,
  setModal,
  setOptions,
  setRestaurants,
  setViewedRestaurants,
} from '../actions/restaurant'
import {
  API_BASE_URL,
  DEFAULT_ZIP,
  GOOGLE_MAPS_API_ENDPOINT,
  GOOGLE_MAPS_API_KEY,
  IS_GOOGLE_MAPS_ENABLED,
} from '../../constants'
import { IRestaurantOption } from '../../models/RestaurantOption'
import { IRestaurant } from '../../models/Restaurant'

function filterRestaurants({
  currentZipMeta,
  options,
  restaurantIds,
  restaurants,
}: any) {
  const currentFilters = options.filter((option: IRestaurantOption) => {
    return option.value
  })

  return restaurantIds.filter((id: number) => {
    let res = false
    return currentFilters.every((option: IRestaurantOption) => {
      switch (option.name) {
        case 'nearby':
        case 'nearbyMaxMiles':
          if ('geolocation' in navigator) {
            const nearbyOption = options.find((o: IRestaurantOption) => 'nearby' === o.name)
            if (!currentZipMeta.length || !nearbyOption.value) {
              res = true
            } else {
              // calculate nearby zips
              const nearbyMaxMilesOption = options.find((o: IRestaurantOption) => 'nearbyMaxMiles' === o.name)
              const nearbyMaxKm = 1.609344 * nearbyMaxMilesOption.value
              const zipsNearby = currentZipMeta
                .filter(({ distance }: { distance: string }) => parseFloat(distance) <= nearbyMaxKm)
                .map(({ postalCode }: { postalCode: string }) => parseInt(postalCode))

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

export function toggleModal(): Function {
  return (dispatch: Function, getState: Function): void => {
    const { modalIsOpen }: any = getState().restaurant
    dispatch(setModal(!modalIsOpen))
  }
}

function handleOptionUpdate(option: IRestaurantOption): Function {
  return (dispatch: Function, getState: Function): void => {
    const { options }: any = getState().restaurant

    // update current options
    const updatedOptions = options.map((o: any) => {
      return (o.name === option.name) ? option : o
    })
    dispatch(setOptions(updatedOptions))
    localStorage.setItem('options', JSON.stringify(updatedOptions))
  }
}

function handleFilterUpdate(): Function {
  return (dispatch: Function, getState: Function): void => {
    const { currentZipMeta, options, restaurants, restaurantIds }: any = getState().restaurant
    const updatedFiltered = filterRestaurants({
      currentZipMeta,
      options,
      restaurants,
      restaurantIds,
    })
    dispatch(setFiltered(updatedFiltered))
    dispatch(resetViewedRestaurants())
    dispatch(nextRestaurant())
  }
}

export function selectOption(option: IRestaurantOption, value: any): Function {
  return (dispatch: Function): void => {
    option.value = value
    dispatch(handleOptionUpdate(option))
    dispatch(handleFilterUpdate())
  }
}

export function toggleOption(option: IRestaurantOption): Function {
  return (dispatch: Function): void => {
    option.value = !option.value
    dispatch(handleOptionUpdate(option))
    dispatch(handleFilterUpdate())
  }
}

export function nextRestaurant(): Function {
  return (dispatch: Function, getState: Function): void => {
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

export function prevRestaurant(): Function {
  return (dispatch: Function, getState: Function): void => {
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

export function fetchRestaurants(): Function {
  return (dispatch: Function, getState: Function): void => {
    dispatch(getRestaurants())

    const endpoint = `${API_BASE_URL}/city/`
    fetch(endpoint)
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
            .filter((restaurant: IRestaurant) => !!restaurant.enabled)
            .map((restaurant: IRestaurant) => {
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

export function fetchGeolocation() {
  return (dispatch: Function): void => {
    dispatch(getGeolocation())
  }
}

export function getZipsNear(zip: number) {
  return (dispatch: Function, getState: Function): void => {
    const endpoint = `${API_BASE_URL}/zip/?zip=${zip}`
    fetch(endpoint)
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
          const nearbyOption = options.find((o: IRestaurantOption) => 'nearby' === o.name)
          nearbyOption.value = true
          nearbyOption.disabled = false

          const nearbyMaxMilesOption = options.find((o: IRestaurantOption) => 'nearbyMaxMiles' === o.name)
          nearbyMaxMilesOption.rendered = true
          nearbyMaxMilesOption.disabled = false

          // ...and filter restaurants
          dispatch(handleOptionUpdate(nearbyOption))
          dispatch(handleOptionUpdate(nearbyMaxMilesOption))
          dispatch(handleFilterUpdate())
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

export function getZipFromLatLon({ lat, lon }: { lat: number, lon: number}): Function {
  return (dispatch: Function): void => {
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
            const zip: string = addressComponents.find((ac: any) => ac.types.includes('postal_code')).short_name
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

export function setReduxFromLocalStore(): Function {
  return (dispatch: Function): void => {
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
