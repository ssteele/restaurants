import { IRestaurant } from '@/models/Restaurant';

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
    coords: [{'lat': 30.246460, 'lon': -97.756767}],
    zips: [78701],
    kids: ['Kids 1', 'Kids 2'],
    playground: true,
    playarea: true,
    enabled: true,
    deleted: false,
  },
  2: {
    id: 2,
    name: 'Name 2',
    sub_name: 'Sub Name 2',
    categories: ['cat 2', 'cat 3'],
    site: 'https://www.site-2.com',
    menu: 'https://www.site-2.com/menu',
    organic: true,
    local: true,
    vegetarian: true,
    vegan: true,
    keto: false,
    indoor: true,
    outdoor: true,
    price: 2,
    coords: [{'lat': 30.263244, 'lon': -97.743418}],
    zips: [78702],
    kids: ['Kids 2', 'Kids 3'],
    playground: true,
    playarea: true,
    enabled: true,
    deleted: false,
  },
  3: {
    id: 3,
    name: 'Name 3',
    sub_name: 'Sub Name 3',
    categories: ['cat 3', 'cat 4'],
    site: 'https://www.site-3.com',
    menu: 'https://www.site-3.com/menu',
    organic: true,
    local: true,
    vegetarian: true,
    vegan: true,
    keto: false,
    indoor: true,
    outdoor: true,
    price: 3,
    coords: [{'lat': 30.260500, 'lon': -97.733948}],
    zips: [78703],
    kids: ['Kids 3', 'Kids 4'],
    playground: true,
    playarea: true,
    enabled: true,
    deleted: false,
  },
}
