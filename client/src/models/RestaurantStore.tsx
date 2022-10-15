import { IGeolocation } from './Geolocation'
import { IRestaurant } from './Restaurant'
import { IRestaurantOption } from './RestaurantOption'

export interface IRestaurantStore {
  categories: any[]                   // @todo?
  current: number|null
  currentZipMeta: any[]               // @todo?
  error: any                          // @todo?
  filteredCount: number
  filteredIds: number[]
  geolocation: IGeolocation,
  isLoading: boolean
  modalIsOpen: boolean
  options: IRestaurantOption[]
  restaurantIds: number[]
  restaurants: IRestaurant|null
  viewed: number[]
  viewIndex: number|null
}
