import React from 'react'
import TestRenderer from 'react-test-renderer';
import * as thunks from '../store/thunks/restaurant'
import { Navigation } from './Navigation';

describe('Navigate component', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const filteredCount = 3
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
    expect.assertions(3)
    const backButton = testInstance.findAllByType('button')[0]
    backButton.props.onClick()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(prevRestaurantSpy).toHaveBeenCalledTimes(1)
    expect(nextRestaurantSpy).toHaveBeenCalledTimes(0)
  })

  it('navigates to next restaurant', () => {
    expect.assertions(3)
    const nextButton = testInstance.findAllByType('button')[1]
    nextButton.props.onClick()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(prevRestaurantSpy).toHaveBeenCalledTimes(0)
    expect(nextRestaurantSpy).toHaveBeenCalledTimes(1)
  })
})
