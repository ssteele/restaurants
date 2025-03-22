import { IBrowserNavigatorApiResponse } from '../models/BrowserApi'
import { ILatLon } from '../models/LatLon'

export const EARTH_RADIUS = 3958.7564 // in miles

export const getCoordinates = async (): Promise<IBrowserNavigatorApiResponse> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}

export const calculateDistance = (
  location1: ILatLon,
  location2: ILatLon,
): number => {
  const { lat: lat1, lon: lon1 } = location1
  const { lat: lat2, lon: lon2 } = location2

  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1) 
  const rawDistance = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const centralAngle = 2 * Math.atan2(Math.sqrt(rawDistance), Math.sqrt(1 - rawDistance))

  return EARTH_RADIUS * centralAngle
}
