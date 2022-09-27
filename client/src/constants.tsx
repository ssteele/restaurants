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
