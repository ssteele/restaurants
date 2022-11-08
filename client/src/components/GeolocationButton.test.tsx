import React from 'react'
import TestRenderer from 'react-test-renderer';
import { GOOGLE_MAPS_COOL_OFF_SECONDS } from '../constants'
import { IGeolocation } from '../models/Geolocation';
import * as thunks from '../store/thunks/restaurant'
import * as getCoordinatesModule from '../utils/getCoordinates'
import { GeolocationButton } from './GeolocationButton';

describe('Geolocation component with no location', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const geolocation: IGeolocation = {isGeolocating: false}
  const fetchGeolocationSpy = jest.spyOn(thunks, 'fetchGeolocation')
  const getCoordinates = jest.spyOn(getCoordinatesModule, 'getCoordinates')
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

  it('renders proper classes', () => {
    expect.assertions(1)
    const geolocationTrigger = testInstance.findByProps({'data-id': 'geolocation-trigger'})
    expect(geolocationTrigger.props.className).toBe('geolocation-trigger');
  })

  it('does not render current zip', () => {
    expect.assertions(1)
    expect(() => testInstance.findByProps({'data-id': 'geolocation-zip'})).toThrow(Error)
  })

  it('geolocates on click', async () => {
    expect.assertions(4)
    const geolocationTrigger = testInstance.findByProps({'data-id': 'geolocation-trigger'})
    geolocationTrigger.props.onClick()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(fetchGeolocationSpy).toHaveBeenCalledTimes(1)
    await expect(getCoordinates).toHaveBeenCalledTimes(1)
    expect(getZipFromLatLonSpy).toHaveBeenCalledTimes(1)
  })
})

describe('Geolocation component that is currently geolocating', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const geolocation: IGeolocation = {isGeolocating: true}
  const fetchGeolocationSpy = jest.spyOn(thunks, 'fetchGeolocation')
  const getCoordinates = jest.spyOn(getCoordinatesModule, 'getCoordinates')
  const getZipFromLatLonSpy = jest.spyOn(thunks, 'getZipFromLatLon')
  const consoleWarnSpy = jest.spyOn(console, 'warn');

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

  it('renders proper classes', () => {
    expect.assertions(1)
    const geolocationTrigger = testInstance.findByProps({'data-id': 'geolocation-trigger'})
    expect(geolocationTrigger.props.className).toBe('geolocation-trigger');
  })

  it('does not render current zip', () => {
    expect.assertions(1)
    expect(() => testInstance.findByProps({'data-id': 'geolocation-zip'})).toThrow(Error)
  })

  it('does not dispatch another geolocation event', async () => {
    expect.assertions(5)
    const geolocationTrigger = testInstance.findByProps({'data-id': 'geolocation-trigger'})
    geolocationTrigger.props.onClick()
    expect(consoleWarnSpy).toHaveBeenCalledWith('Geolocating now - please wait')
    expect(dispatch).toHaveBeenCalledTimes(0)
    expect(fetchGeolocationSpy).toHaveBeenCalledTimes(0)
    await expect(getCoordinates).toHaveBeenCalledTimes(0)
    expect(getZipFromLatLonSpy).toHaveBeenCalledTimes(0)
  })
})

describe('Geolocation component with location during cooldown', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const geolocation: IGeolocation = {
    lat: 30.2642,
    lon: -97.7617,
    timestamp: Date.now() - (1000 * GOOGLE_MAPS_COOL_OFF_SECONDS / 2),
    zip: 78704,
    isGeolocating: false,
  }
  const fetchGeolocationSpy = jest.spyOn(thunks, 'fetchGeolocation')
  const getCoordinates = jest.spyOn(getCoordinatesModule, 'getCoordinates')
  const getZipFromLatLonSpy = jest.spyOn(thunks, 'getZipFromLatLon')
  const consoleWarnSpy = jest.spyOn(console, 'warn');

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

  it('renders proper classes', () => {
    expect.assertions(1)
    const geolocationTrigger = testInstance.findByProps({'data-id': 'geolocation-trigger'})
    expect(geolocationTrigger.props.className).toBe('geolocation-trigger inset flash');
  })

  it('properly renders current zip', () => {
    expect.assertions(2)
    expect(() => testInstance.findByProps({'data-id': 'geolocation-zip'})).not.toThrow(Error)
    const currentZip = testInstance.findByProps({'data-id': 'geolocation-zip'})
    expect(currentZip.props.children).toBe(78704)
  })

  it('does not dispatch another geolocation event', async () => {
    expect.assertions(5)
    const geolocationTrigger = testInstance.findByProps({'data-id': 'geolocation-trigger'})
    geolocationTrigger.props.onClick()
    expect(consoleWarnSpy).toHaveBeenCalledWith('Geolocation cool down - too soon since the last request')
    expect(dispatch).toHaveBeenCalledTimes(0)
    expect(fetchGeolocationSpy).toHaveBeenCalledTimes(0)
    await expect(getCoordinates).toHaveBeenCalledTimes(0)
    expect(getZipFromLatLonSpy).toHaveBeenCalledTimes(0)
  })
})

describe('Geolocation component with location following cooldown', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const geolocation: IGeolocation = {
    lat: 30.2642,
    lon: -97.7617,
    timestamp: Date.now() - (1000 * GOOGLE_MAPS_COOL_OFF_SECONDS * 2),
    zip: 78704,
    isGeolocating: false,
  }
  const fetchGeolocationSpy = jest.spyOn(thunks, 'fetchGeolocation')
  const getCoordinates = jest.spyOn(getCoordinatesModule, 'getCoordinates')
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

  it('renders proper classes', () => {
    expect.assertions(1)
    const geolocationTrigger = testInstance.findByProps({'data-id': 'geolocation-trigger'})
    expect(geolocationTrigger.props.className).toBe('geolocation-trigger inset flash');
  })

  it('properly renders current zip', () => {
    expect.assertions(2)
    expect(() => testInstance.findByProps({'data-id': 'geolocation-zip'})).not.toThrow(Error)
    const currentZip = testInstance.findByProps({'data-id': 'geolocation-zip'})
    expect(currentZip.props.children).toBe(78704)
  })

  it('geolocates on click', async () => {
    expect.assertions(4)
    const geolocationTrigger = testInstance.findByProps({'data-id': 'geolocation-trigger'})
    geolocationTrigger.props.onClick()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(fetchGeolocationSpy).toHaveBeenCalledTimes(1)
    await expect(getCoordinates).toHaveBeenCalledTimes(1)
    expect(getZipFromLatLonSpy).toHaveBeenCalledTimes(1)
  })
})
