import React from 'react'
import TestRenderer from 'react-test-renderer';
import { IGeolocation } from '../models/Geolocation';
import * as thunks from '../store/thunks/restaurant'
import { GeolocationButton } from './GeolocationButton';

describe('Geolocation component', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const geolocation: IGeolocation = {isGeolocating: false}
  const fetchGeolocationSpy = jest.spyOn(thunks, 'fetchGeolocation')
  const getZipFromLatLonSpy = jest.spyOn(thunks, 'getZipFromLatLon')

  beforeEach(() => {
    testRenderer = TestRenderer.create(
      <GeolocationButton
        dispatch={dispatch}
        geolocation={geolocation}
      ></GeolocationButton>
    )
    testInstance = testRenderer.root;
  })

  it('properly renders geolocation button', () => {
    expect.assertions(1)
    expect(() => testInstance.findByType(GeolocationButton)).not.toThrow(Error)
  })

  // it('navigates to previous restaurant', () => {
  //   expect.assertions(4)
  //   const backButton = testInstance.findByProps({'data-id': 'nav-back-restaurant'})
  //   expect(backButton.props.disabled).toBe(false);
  //   backButton.props.onClick()
  //   expect(dispatch).toHaveBeenCalledTimes(1)
  //   expect(fetchGeolocationSpy).toHaveBeenCalledTimes(1)
  //   expect(getZipFromLatLonSpy).toHaveBeenCalledTimes(0)
  // })
})

// describe('Geolocation component with no restaurants', () => {
//   let testRenderer: any
//   let testInstance: any
//   const dispatch: any = jest.fn()
//   const geolocation: IGeolocation = {
//     lat: 30.2642,
//     lon: -97.7617,
//     timestamp: 1667751652036,
//     zip: 78704,
//     isGeolocating: false,
//   }
//   const fetchGeolocationSpy = jest.spyOn(thunks, 'fetchGeolocation')
//   const getZipFromLatLonSpy = jest.spyOn(thunks, 'getZipFromLatLon')
// })

// describe('Geolocation component with only 1 restaurant', () => {
// })
