const apiBaseUrls: any = {
    loc: 'http://shs.restaurants.com:8888/api',
    // tst: 'http://shs.restaurants.com:8888/api/city/?city=test',
    prd: 'https://restaurants.steve-steele.com/api',
}
let apiEnv: string = 'prd'
if ('development' === process.env.NODE_ENV) {
    apiEnv = 'loc'
}
export const API_BASE_URL = apiBaseUrls[apiEnv]
export const IS_GOOGLE_MAPS_ENABLED = 'true' === process.env.REACT_APP_IS_GOOGLE_MAPS_ENABLED
export const GOOGLE_MAPS_COOL_OFF_SECONDS = 300
export const GOOGLE_MAPS_API_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json'
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
export const DEFAULT_ZIP = 78753
export const DEFAULT_MAX_NEARBY_ZIP_MI_DISTANCE = 5
export const MAX_NEARBY_ZIP_MI_DISTANCE_OPTIONS = [
  {id: 0, name: 'In current zip'},
  {id: 1, name: '1 mile'},
  {id: 2, name: '2 miles'},
  {id: 3, name: '3 miles'},
  {id: 5, name: '5 miles'},
  {id: 8, name: '8 miles'},
  {id: 15, name: '15 miles'},
]
