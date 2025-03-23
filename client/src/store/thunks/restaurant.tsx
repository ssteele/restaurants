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
  setError,
  setFiltered,
  setGeolocation,
  setModal,
  setOptions,
  setRestaurants,
  setViewedRestaurants,
} from '@/store/actions/restaurant'
import { API_BASE_URL } from '@/constants'
import { AppThunkAction, AppThunkDispatch } from '@/models/AppThunk'
import { IGeolocation } from '@/models/Geolocation'
import { ILatLon } from '@/models/LatLon'
import { IRestaurant } from '@/models/Restaurant'
import { IRestaurantOption } from '@/models/RestaurantOption'
import { IRestaurantStore } from '@/models/RestaurantStore'
import { ICategory } from '@/models/Category'
import { calculateDistance } from '@/utils/getCoordinates'

const filterRestaurants = ({
  geolocation,
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
            if (!geolocation.lat || !geolocation.lon || !nearbyOption.value) {
              res = true
            } else {
              const nearbyMaxMilesOption = options.find((o: IRestaurantOption) => 'nearbyMaxMiles' === o.name)
              const nearbyMaxMiles = nearbyMaxMilesOption.value
              
              const restaurant = restaurants[id]
              res = restaurant['coords'].find((coords: ILatLon) => {
                const distance = calculateDistance(geolocation, coords)
                return distance <= nearbyMaxMiles
              })
            }
          } else {
            res = true
          }
          break

        case 'kids':
          res = !!restaurants[id][option.name].length
          break

        case 'meat':
          res = !restaurants[id]['vegan'] && !restaurants[id]['vegetarian']
          break

        case 'city':
          res = true
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
    const { modalIsOpen }: IRestaurantStore = getState().restaurantStore
    dispatch(setModal(!modalIsOpen))
  }
}

const handleOptionUpdate: AppThunkAction = (option: IRestaurantOption) => {
  return (dispatch: AppThunkDispatch, getState: Function): void => {
    const { options }: IRestaurantStore = getState().restaurantStore

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
    const { geolocation, options, restaurants, restaurantIds }: IRestaurantStore = getState().restaurantStore
    const updatedFiltered = filterRestaurants({
      geolocation,
      options,
      restaurants,
      restaurantIds,
    })
    dispatch(setFiltered(updatedFiltered))
    dispatch(resetViewedRestaurants())
    dispatch(nextRestaurant())
  }
}

export const selectCity: AppThunkAction = (option: IRestaurantOption, value: any) => {
  return (dispatch: AppThunkDispatch): void => {
    if (option.value !== value) {
      option.value = value
      dispatch(handleOptionUpdate(option))
      dispatch(fetchRestaurants())
      dispatch(handleFilterUpdate())
    }
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
    const { filteredIds, viewed, viewIndex }: IRestaurantStore = getState().restaurantStore
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
    const { viewed, viewIndex }: IRestaurantStore = getState().restaurantStore
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

    const { value: city }: IRestaurantOption = getState().restaurantStore.options.find((o: IRestaurantOption) => 'city' === o.name)
    const endpoint = `${API_BASE_URL}/city/?city=${city}`
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
          const restaurantSchema = new schema.Entity('restaurants', {
            categories: [categorySchema],
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

          const restaurants: {[id: number]: IRestaurant} = normalized.entities.restaurants || {}
          const categories: {[id: number]: ICategory} = normalized.entities.categories || {}
          const restaurantIds: number[] = normalized.result.restaurants

          const { geolocation, options }: IRestaurantStore = getState().restaurantStore
          const filteredIds = filterRestaurants({
            geolocation,
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

export const updateGeolocationFilters: AppThunkAction = () => {
  return (dispatch: AppThunkDispatch, getState: Function): void => {
    // update geolocation filter options (triggers filterRestaurants)
    const { options }: IRestaurantStore = getState().restaurantStore
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
  }
}

export const setCurrentLocation: AppThunkAction = ({ lat, lon }: { lat: number, lon: number}) => {
  return (dispatch: AppThunkDispatch): void => {
    const geolocation: IGeolocation = {
      isGeolocating: false,
      lat,
      lon,
      timestamp: Date.now(),
    }
    dispatch(setGeolocation(geolocation))
    localStorage.setItem('geolocation', JSON.stringify(geolocation))

    if (geolocation.lat && geolocation.lon) {
      dispatch(updateGeolocationFilters(geolocation))
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
