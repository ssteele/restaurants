import React from 'react'
import TestRenderer from 'react-test-renderer';
import { restaurantInstances } from '../models/instances/restaurants';
import { IRestaurant } from '../models/Restaurant';
import { Restaurant } from './Restaurant';

describe('Restaurant component', () => {
  let testRenderer: any
  let testInstance: any
  const current: number = 1
  const error: object = {}
  const isLoading: boolean = false
  const restaurants: {[id: number]: IRestaurant} = restaurantInstances

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

  it('properly renders the restaurant name with menu link', () => {
    expect.assertions(3)
    expect(() => testInstance.findByProps({'data-id': 'restaurant-link'})).not.toThrow(Error)
    const restaurantLink = testInstance.findByProps({'data-id': 'restaurant-link'})
    expect(restaurantLink.props.href).toBe(restaurantInstances[current].menu)
    expect(restaurantLink.props.children).toBe(restaurantInstances[current].name)
  })

  it('properly renders the restaurant sub name', () => {
    expect.assertions(2)
    expect(() => testInstance.findByProps({'data-id': 'restaurant-sub-name'})).not.toThrow(Error)
    const restaurantSubName = testInstance.findByProps({'data-id': 'restaurant-sub-name'})
    expect(restaurantSubName.props.children).toBe(restaurantInstances[current].sub_name)
  })

  it('properly renders kids items', () => {
    expect.assertions(2)
    expect(() => testInstance.findByProps({'data-id': 'restaurant-kids-text'})).not.toThrow(Error)
    const restaurantKids = testInstance.findByProps({'data-id': 'restaurant-kids-text'})
    expect(restaurantKids.props.children).toBe('Kids 1, Kids 2')
  })

  it('does not show error message', () => {
    expect.assertions(1)
    expect(() => testInstance.findByProps({'data-id': 'restaurant-error-message'})).toThrow(Error)
  })
})

describe('Restaurant component with no restaurants', () => {
  let testRenderer: any
  let testInstance: any
  const current: number = 1
  const error: object = {}
  const isLoading: boolean = false
  const restaurants: {[id: number]: IRestaurant} = {}

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

  it('does not render restaurant link', () => {
    expect.assertions(1)
    expect(() => testInstance.findByProps({'data-id': 'restaurant-link'})).toThrow(Error)
  })
})

describe('Restaurant component with no restaurant selected', () => {
  let testRenderer: any
  let testInstance: any
  const current: number = 0
  const error: object = {}
  const isLoading: boolean = false
  const restaurants: {[id: number]: IRestaurant} = restaurantInstances

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

  it('does not render restaurant link', () => {
    expect.assertions(1)
    expect(() => testInstance.findByProps({'data-id': 'restaurant-link'})).toThrow(Error)
  })
})
