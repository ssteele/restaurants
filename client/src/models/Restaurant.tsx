export interface IRestaurant {
  categories: string[]
  deleted: boolean
  enabled: boolean
  id: number
  indoor: boolean
  keto: boolean
  kids: []
  local: boolean
  menu: string
  name: string
  organic: boolean
  outdoor: boolean
  site: string
  sub_name?: string
  vegan: boolean
  vegetarian: boolean
  zips: number[]
}
