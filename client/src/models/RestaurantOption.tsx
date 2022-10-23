export interface IRestaurantOption {
  description: string
  disabled: boolean,
  name: string
  rendered: boolean,
  type: string
  value: number | string | boolean | object,
  values?: number[] | string[] | boolean[] | object[],
}
