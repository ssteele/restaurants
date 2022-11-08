import { IBrowserNavigatorApiResponse } from '../models/BrowserApi'

export const getCoordinates = async (): Promise<IBrowserNavigatorApiResponse> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}
