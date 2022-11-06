import React from 'react'
import TestRenderer from 'react-test-renderer';
import { restaurantInstances } from '../models/instances/restaurants';
import { IRestaurant } from '../models/Restaurant';
import { Restaurant } from './Restaurant';

describe('Restaurant component', () => {
  let testRenderer: any
  let testInstance: any
  const current: number = 0
  const error: object = {}
  const isLoading: boolean = false
  const restaurants: {[key: number]: IRestaurant} = restaurantInstances

  beforeEach(() => {
    testRenderer = TestRenderer.create(
      <Restaurant
        current={current}
        error={error}
        isLoading={isLoading}
        restaurants={restaurants}
      ></Restaurant>
    )
    testInstance = testRenderer.root;
  })

  it('properly renders the restaurant component', () => {
    expect.assertions(1)
    expect(() => testInstance.findByType(Restaurant)).not.toThrow(Error)
  })
})
