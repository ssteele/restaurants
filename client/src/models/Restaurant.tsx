import { ILatLon } from "./LatLon"

export interface IRestaurant {
  categories: string[]
  coords: ILatLon[]
  deleted: boolean
  enabled: boolean
  id: number
  indoor: boolean
  keto: boolean
  kids: string[]
  local: boolean
  menu: string
  name: string
  organic: boolean
  outdoor: boolean
  playarea: boolean
  playground: boolean
  price: number
  site: string
  sub_name?: string
  vegan: boolean
  vegetarian: boolean
  zips: number[]
}
