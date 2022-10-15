export interface IRestaurantOption {
  name: string
  description: string
  type: string
  value: any,                         // @todo?
  values?: any[],                     // @todo?
  rendered: boolean,
  disabled: boolean,
}
