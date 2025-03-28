import { ICategory } from './Category'
import { IGeolocation } from './Geolocation'
import { IRestaurant } from './Restaurant'
import { IRestaurantOption } from './RestaurantOption'

export interface IRestaurantStore {
  categories: ICategory[]
  current: number | null
  error: any
  filteredCount: number
  filteredIds: number[]
  geolocation: IGeolocation,
  isLoading: boolean
  modalIsOpen: boolean
  options: IRestaurantOption[]
  restaurantIds: number[]
  restaurants: IRestaurant | null
  viewed: number[]
  viewIndex: number | null
}
