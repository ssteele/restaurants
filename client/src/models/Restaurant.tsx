export interface IRestaurant {
  id: number
  name: string
  sub_name?: string
  site: string
  menu: string
  organic: boolean
  vegetarian: boolean
  vegan: boolean
  local: boolean
  keto: boolean
  indoor: boolean
  outdoor: boolean
  kids: []
  zip: []
  enabled: boolean
  deleted: boolean
}
