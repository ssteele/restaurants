import { IGeolocation } from './Geolocation'
import { IRestaurant } from './Restaurant'
import { IRestaurantOption } from './RestaurantOption'

export interface IRestaurantStore {
  isLoading: boolean
  options: IRestaurantOption[]
  restaurants: IRestaurant|null
  restaurantIds: number[]
  categories: any[]                   // @todo?
  geolocation: IGeolocation,
  currentZipMeta: any[],              // @todo?
  filteredIds: number[]
  filteredCount: number
  current: number|null
  viewed: number[]
  viewIndex: number|null
  modalIsOpen: boolean
  error: any                          // @todo?
}
