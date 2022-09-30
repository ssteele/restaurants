const apiEndpoints: any = {
    loc: 'http://shs.restaurants.com:8888/api/',
    tst: 'http://shs.restaurants.com:8888/api/?city=test',
    prd: 'https://restaurants.steve-steele.com/api/',
}
let apiEnv: string = 'prd'
if ('development' === process.env.NODE_ENV) {
    apiEnv = 'loc'
}
export const API_ENDPOINT = apiEndpoints[apiEnv]

export const IS_GOOGLE_MAPS_ENABLED = false
export const GOOGLE_MAPS_API_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json'

export const DEFAULT_ZIP = 78753
// @todo: move to api endpoint
export const zipsNearHome = [78753, 78758, 78754, 78710, 78727, 78752, 78757, 78728, 78759, 78660, 78751, 78723, 78756]

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
