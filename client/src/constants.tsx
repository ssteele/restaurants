const apiBaseUrls: {[env: string]: string} = {
    loc: 'http://shs.restaurants.com:8888/api',
    prd: 'https://restaurants.steve-steele.com/api',
}
let apiEnv: string = 'prd'
if ('development' === process.env.NODE_ENV) {
    apiEnv = 'loc'
}
export const API_BASE_URL: string = apiBaseUrls[apiEnv]
export const DEFAULT_CITY: string = 'austin'
export const DEFAULT_LAT: number = 30.309239
export const DEFAULT_LON: number = -97.719562
export const DEFAULT_MAX_NEARBY_ZIP_MI_DISTANCE: number = 5
export const LOCATION_REQUEST_COOL_OFF_SECONDS: number = 10
export const MAX_NEARBY_ZIP_MI_DISTANCE_OPTIONS: { id: number, name: string }[] = [
  {id: 0, name: 'In current zip'},
  {id: 1, name: '1 mile'},
  {id: 2, name: '2 miles'},
  {id: 3, name: '3 miles'},
  {id: 5, name: '5 miles'},
  {id: 8, name: '8 miles'},
  {id: 15, name: '15 miles'},
]
