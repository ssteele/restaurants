import { IRestaurant } from '../Restaurant';

export const restaurantInstances: {[id: number]: IRestaurant} = {
  1: {
    id: 1,
    name: 'Name 1',
    sub_name: 'Sub Name 1',
    categories: ['cat 1', 'cat 2'],
    site: 'https://www.site-1.com',
    menu: 'https://www.site-1.com/menu',
    organic: true,
    local: true,
    vegetarian: true,
    vegan: true,
    keto: false,
    indoor: true,
    outdoor: true,
    price: 1,
    zips: [78753],
    kids: ['Kids Meal'],
    playground: true,
    playarea: true,
    enabled: true,
    deleted: false,
  },
}
