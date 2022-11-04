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
import { AppThunkAction, AppThunkDispatch } from '../../models/AppThunk'
import { IGeolocation } from '../../models/Geolocation'
import { IGoogleGeocodingApiResponse } from '../../models/GoogleApi'
import { IRestaurant } from '../../models/Restaurant'
import { IRestaurantOption } from '../../models/RestaurantOption'
import { IRestaurantStore } from '../../models/RestaurantStore'

const filterRestaurants = ({
  currentZipMeta,
  options,
  restaurantIds,
  restaurants,
}: any) => {
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
            if ('test' !== process.env.NODE_ENV) {
              console.warn('Location services are unavailable')
            }
            res = true
          }
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

const getRandomPositiveInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max))
}

export const toggleModal: AppThunkAction = () => {
  return (dispatch: AppThunkDispatch, getState: Function): void => {
    const { modalIsOpen }: IRestaurantStore = getState().restaurant
    dispatch(setModal(!modalIsOpen))
  }
}

const handleOptionUpdate: AppThunkAction = (option: IRestaurantOption) => {
  return (dispatch: AppThunkDispatch, getState: Function): void => {
    const { options }: IRestaurantStore = getState().restaurant

    // update current options
    const updatedOptions = options.map((o: IRestaurantOption) => {
      return (o.name === option.name) ? option : o
    })
    dispatch(setOptions(updatedOptions))
    localStorage.setItem('options', JSON.stringify(updatedOptions))
  }
}

const handleFilterUpdate: AppThunkAction = () => {
  return (dispatch: AppThunkDispatch, getState: Function): void => {
    const { currentZipMeta, options, restaurants, restaurantIds }: IRestaurantStore = getState().restaurant
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

export const selectOption: AppThunkAction = (option: IRestaurantOption, value: any) => {
  return (dispatch: AppThunkDispatch): void => {
    option.value = value
    dispatch(handleOptionUpdate(option))
    dispatch(handleFilterUpdate())
  }
}

export const toggleOption: AppThunkAction = (option: IRestaurantOption) => {
  return (dispatch: AppThunkDispatch): void => {
    option.value = !option.value
    dispatch(handleOptionUpdate(option))
    dispatch(handleFilterUpdate())
  }
}

export const nextRestaurant: AppThunkAction = () => {
  return (dispatch: AppThunkDispatch, getState: Function): void => {
    const { filteredIds, viewed, viewIndex }: IRestaurantStore = getState().restaurant
    let index = 0

    const viewedLength = viewed.length
    let newViewIndex = (viewIndex) ? viewIndex + 1 : 1
    if (newViewIndex < viewedLength) {
      // navigate forward through viewed restaurant history
      dispatch(setCurrentRestaurant(viewed[newViewIndex]))
      dispatch(setViewedRestaurants(null, newViewIndex))
      return
    }

    if (!(filteredIds.length > viewedLength)) {
      // cycle to start of viewed restaurant list
      dispatch(setCurrentRestaurant(viewed[0]))
      dispatch(setViewedRestaurants(null, 0))
      return
    } else {
      // go to next (unviewed) restaurant
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

export const prevRestaurant: AppThunkAction = () => {
  return (dispatch: AppThunkDispatch, getState: Function): void => {
    const { viewed, viewIndex }: IRestaurantStore = getState().restaurant
    let newViewIndex = (viewIndex) ? viewIndex - 1 : 0
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

export const fetchRestaurants: AppThunkAction = () => {
  return (dispatch: AppThunkDispatch, getState: Function): void => {
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

          const { currentZipMeta, options }: IRestaurantStore = getState().restaurant
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

export const fetchGeolocation: AppThunkAction = () => {
  return (dispatch: AppThunkDispatch): void => {
    dispatch(getGeolocation())
  }
}

export const getZipsNear: AppThunkAction = (zip: number) => {
  return (dispatch: AppThunkDispatch, getState: Function): void => {
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

          // update geolocation filter options and filter restaurants
          const { options }: IRestaurantStore = getState().restaurant
          const nearbyOption: IRestaurantOption | undefined = options.find((o: IRestaurantOption) => 'nearby' === o.name)
          if (nearbyOption) {
            nearbyOption.value = true
            nearbyOption.disabled = false
            dispatch(handleOptionUpdate(nearbyOption))
          }

          const nearbyMaxMilesOption: IRestaurantOption | undefined = options.find((o: IRestaurantOption) => 'nearbyMaxMiles' === o.name)
          if (nearbyMaxMilesOption) {
            nearbyMaxMilesOption.rendered = true
            nearbyMaxMilesOption.disabled = false
            dispatch(handleOptionUpdate(nearbyMaxMilesOption))
          }

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

export const getZipFromLatLon: AppThunkAction = ({ lat, lon }: { lat: number, lon: number}) => {
  return (dispatch: AppThunkDispatch): void => {
    let geolocation: IGeolocation = {}
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
            const addressComponents: any[] = json.results[0].address_components
            const zip: string = addressComponents.find((ac: IGoogleGeocodingApiResponse) => ac?.types?.includes('postal_code'))?.short_name
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

export const setReduxFromLocalStore: AppThunkAction = () => {
  return (dispatch: AppThunkDispatch): void => {
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
