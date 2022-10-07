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
export const MAX_NEARBY_ZIP_KM_DISTANCE = 8
// export const MAX_NEARBY_ZIP_KM_DISTANCE = 0
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
export const ZIP_NAME_MAP: any = {
  78753: 'Tech Ridge',
  78613: 'Cedar Park',
  78664: 'Round Rock',
  78701: 'Downtown Austin',
  78702: 'East Austin',
  78703: 'Tarrytown',
  78704: 'South Austin',
  78705: 'Central Austin',
  78717: 'Lakeline',
  78722: 'Cherrywood',
  78723: 'Mueller',
  78727: 'Parmer Ln',
  78731: 'Northwest Hills',
  78741: 'Pleasant Valley',
  78745: 'William Cannon Dr',
  78746: 'West Lake Hills',
  78748: 'Slaughter Ln',
  78749: 'Convict Hill Rd',
  78750: 'Anderson Mill',
  78751: 'Hyde Park',
  78752: 'St. Johns',
  78756: 'Brentwood/Rosedale',
  78757: 'Anderson Ln',
  78758: 'North Austin',
  78759: 'Great Hills',
}
