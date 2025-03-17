import {
  DEFAULT_CITY,
  DEFAULT_MAX_NEARBY_ZIP_MI_DISTANCE,
  MAX_NEARBY_ZIP_MI_DISTANCE_OPTIONS,
} from '../../constants'
import { ICity } from '../../models/City'
import { IRestaurantStore } from '../../models/RestaurantStore'

const cities: ICity[] = [
  {id: 'austin', name: 'Austin, TX'},
  {id: 'edmond', name: 'Edmond, OK'},
  {id: 'test', name: 'Test'}, // @todo: remove test city
]

export const restaurantStore: IRestaurantStore = {
  categories: [],
  current: null,
  currentZipMeta: [],
  error: {},
  filteredCount: 0,
  filteredIds: [],
  geolocation: { isGeolocating: false },
  isLoading: false,
  modalIsOpen: false,
  options: [
    {name: 'nearby', description: 'Only near me', type: 'checkbox', value: false, rendered: true, disabled: true},
    {
      name: 'nearbyMaxMiles',
      description: '...how close?',
      type: 'select',
      value: DEFAULT_MAX_NEARBY_ZIP_MI_DISTANCE,
      values: MAX_NEARBY_ZIP_MI_DISTANCE_OPTIONS,
      rendered: false,
      disabled: true,
    },
    {name: 'kids', description: 'Only kid-friendly', type: 'checkbox', value: false, rendered: true, disabled: false},
    {name: 'organic', description: 'Only organic', type: 'checkbox', value: false, rendered: true, disabled: false},
    {name: 'local', description: 'Only locally sourced', type: 'checkbox', value: false, rendered: true, disabled: false},
    {name: 'vegetarian', description: 'Only vegetarian', type: 'checkbox', value: false, rendered: true, disabled: false},
    {name: 'keto', description: 'Only keto-friendly', type: 'checkbox', value: false, rendered: true, disabled: false},
    {name: 'meat', description: 'Only meat-friendly', type: 'checkbox', value: false, rendered: true, disabled: false},
    {name: 'indoor', description: 'Only indoor seating', type: 'checkbox', value: false, rendered: true, disabled: false},
    {name: 'outdoor', description: 'Only outdoor seating', type: 'checkbox', value: false, rendered: true, disabled: false},
    {name: 'playarea', description: 'Only with play area', type: 'checkbox', value: false, rendered: true, disabled: false},
    {name: 'playground', description: 'Only with playground', type: 'checkbox', value: false, rendered: true, disabled: false},
    {name: 'city', description: 'City', type: 'city', value: DEFAULT_CITY, values: cities, rendered: true, disabled: false},
  ],
  restaurantIds: [],
  restaurants: null,
  viewed: [],
  viewIndex: null,
}
