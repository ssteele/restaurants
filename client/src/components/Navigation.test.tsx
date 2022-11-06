import React from 'react'
import TestRenderer from 'react-test-renderer';
import * as thunks from '../store/thunks/restaurant'
import { Navigation } from './Navigation';

describe('Navigate component', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const filteredCount: number = 3
  const prevRestaurantSpy = jest.spyOn(thunks, 'prevRestaurant')
  const nextRestaurantSpy = jest.spyOn(thunks, 'nextRestaurant')

  beforeEach(() => {
    testRenderer = TestRenderer.create(
      <Navigation
        dispatch={dispatch}
        filteredCount={filteredCount}
      ></Navigation>
    )
    testInstance = testRenderer.root;
  })

  it('properly renders restaurant navigation', () => {
    expect.assertions(1)
    expect(() => testInstance.findByType(Navigation)).not.toThrow(Error)
  })

  it('navigates to previous restaurant', () => {
    expect.assertions(4)
    const backButton = testInstance.findByProps({'data-id': 'nav-back-restaurant'})
    expect(backButton.props.disabled).toBe(false);
    backButton.props.onClick()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(prevRestaurantSpy).toHaveBeenCalledTimes(1)
    expect(nextRestaurantSpy).toHaveBeenCalledTimes(0)
  })

  it('navigates to next restaurant', () => {
    expect.assertions(4)
    const nextButton = testInstance.findByProps({'data-id': 'nav-next-restaurant'})
    expect(nextButton.props.disabled).toBe(false);
    nextButton.props.onClick()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(prevRestaurantSpy).toHaveBeenCalledTimes(0)
    expect(nextRestaurantSpy).toHaveBeenCalledTimes(1)
  })
})

describe('Navigate component with no restaurants', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const filteredCount: number = 0

  beforeEach(() => {
    testRenderer = TestRenderer.create(
      <Navigation
        dispatch={dispatch}
        filteredCount={filteredCount}
      ></Navigation>
    )
    testInstance = testRenderer.root;
  })

  it('properly renders restaurant navigation', () => {
    expect.assertions(1)
    expect(() => testInstance.findByType(Navigation)).not.toThrow(Error)
  })

  it('navigates to previous restaurant', () => {
    expect.assertions(1)
    const backButton = testInstance.findByProps({'data-id': 'nav-back-restaurant'})
    expect(backButton.props.disabled).toBe(true);
  })

  it('navigates to next restaurant', () => {
    expect.assertions(1)
    const nextButton = testInstance.findByProps({'data-id': 'nav-next-restaurant'})
    expect(nextButton.props.disabled).toBe(true);
  })
})

describe('Navigate component with only 1 restaurant', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const filteredCount: number = 1

  beforeEach(() => {
    testRenderer = TestRenderer.create(
      <Navigation
        dispatch={dispatch}
        filteredCount={filteredCount}
      ></Navigation>
    )
    testInstance = testRenderer.root;
  })

  it('properly renders restaurant navigation', () => {
    expect.assertions(1)
    expect(() => testInstance.findByType(Navigation)).not.toThrow(Error)
  })

  it('navigates to previous restaurant', () => {
    expect.assertions(1)
    const backButton = testInstance.findByProps({'data-id': 'nav-back-restaurant'})
    expect(backButton.props.disabled).toBe(true);
  })

  it('navigates to next restaurant', () => {
    expect.assertions(1)
    const nextButton = testInstance.findByProps({'data-id': 'nav-next-restaurant'})
    expect(nextButton.props.disabled).toBe(true);
  })
})
