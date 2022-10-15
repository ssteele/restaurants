export interface IRestaurantOption {
  description: string
  disabled: boolean,
  name: string
  rendered: boolean,
  type: string
  value: any,                         // @todo?
  values?: any[],                     // @todo?
}
