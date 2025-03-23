import React from 'react'
import TestRenderer from 'react-test-renderer';
import {
  DEFAULT_LAT,
  DEFAULT_LON,
  LOCATION_REQUEST_COOL_OFF_SECONDS,
} from '../constants'
import { IGeolocation } from '../models/Geolocation';
import * as thunks from '../store/thunks/restaurant'
import * as getCoordinatesModule from '../utils/getCoordinates'
import { GeolocationButton } from './GeolocationButton';

describe('Geolocation component with no location', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const geolocation: IGeolocation = {
    isGeolocating: false,
    lat: DEFAULT_LAT,
    lon: DEFAULT_LON,
  }
  const fetchGeolocationSpy = jest.spyOn(thunks, 'fetchGeolocation')
  const getCoordinates = jest.spyOn(getCoordinatesModule, 'getCoordinates')
  const setCurrentLocationSpy = jest.spyOn(thunks, 'setCurrentLocation')

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

  it('does not render current latlon', () => {
    expect.assertions(1)
    expect(() => testInstance.findByProps({'data-id': 'geolocation-latlon'})).toThrow(Error)
  })

  it('geolocates on click', async () => {
    expect.assertions(4)
    const geolocationTrigger = testInstance.findByProps({'data-id': 'geolocation-trigger'})
    geolocationTrigger.props.onClick()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(fetchGeolocationSpy).toHaveBeenCalledTimes(1)
    await expect(getCoordinates).toHaveBeenCalledTimes(1)
    expect(setCurrentLocationSpy).toHaveBeenCalledTimes(1)
  })
})

describe('Geolocation component that is currently geolocating', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const geolocation: IGeolocation = {
    isGeolocating: false,
    lat: DEFAULT_LAT,
    lon: DEFAULT_LON,
  }
  const fetchGeolocationSpy = jest.spyOn(thunks, 'fetchGeolocation')
  const getCoordinates = jest.spyOn(getCoordinatesModule, 'getCoordinates')
  const setCurrentLocationSpy = jest.spyOn(thunks, 'setCurrentLocation')
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

  it('does not render current latlon', () => {
    expect.assertions(1)
    expect(() => testInstance.findByProps({'data-id': 'geolocation-latlon'})).toThrow(Error)
  })

  it('does not dispatch another geolocation event', async () => {
    expect.assertions(5)
    const geolocationTrigger = testInstance.findByProps({'data-id': 'geolocation-trigger'})
    geolocationTrigger.props.onClick()
    expect(consoleWarnSpy).toHaveBeenCalledWith('Geolocating now - please wait')
    expect(dispatch).toHaveBeenCalledTimes(0)
    expect(fetchGeolocationSpy).toHaveBeenCalledTimes(0)
    await expect(getCoordinates).toHaveBeenCalledTimes(0)
    expect(setCurrentLocationSpy).toHaveBeenCalledTimes(0)
  })
})

describe('Geolocation component with location during cooldown', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const geolocation: IGeolocation = {
    lat: 30.2642,
    lon: -97.7617,
    timestamp: Date.now() - (1000 * LOCATION_REQUEST_COOL_OFF_SECONDS / 2),
    isGeolocating: false,
  }
  const fetchGeolocationSpy = jest.spyOn(thunks, 'fetchGeolocation')
  const getCoordinates = jest.spyOn(getCoordinatesModule, 'getCoordinates')
  const setCurrentLocationSpy = jest.spyOn(thunks, 'setCurrentLocation')
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

  it('properly renders current latlot', () => {
    expect.assertions(2)
    expect(() => testInstance.findByProps({'data-id': 'geolocation-latlot'})).not.toThrow(Error)
    const currentLatLon = testInstance.findByProps({'data-id': 'geolocation-latlot'})
    expect(currentLatLon.props.children).toBe(78704)
  })

  it('does not dispatch another geolocation event', async () => {
    expect.assertions(5)
    const geolocationTrigger = testInstance.findByProps({'data-id': 'geolocation-trigger'})
    geolocationTrigger.props.onClick()
    expect(consoleWarnSpy).toHaveBeenCalledWith('Geolocation cool down - too soon since the last request')
    expect(dispatch).toHaveBeenCalledTimes(0)
    expect(fetchGeolocationSpy).toHaveBeenCalledTimes(0)
    await expect(getCoordinates).toHaveBeenCalledTimes(0)
    expect(setCurrentLocationSpy).toHaveBeenCalledTimes(0)
  })
})

describe('Geolocation component with location following cooldown', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const geolocation: IGeolocation = {
    lat: 30.2642,
    lon: -97.7617,
    timestamp: Date.now() - (1000 * LOCATION_REQUEST_COOL_OFF_SECONDS * 2),
    isGeolocating: false,
  }
  const fetchGeolocationSpy = jest.spyOn(thunks, 'fetchGeolocation')
  const getCoordinates = jest.spyOn(getCoordinatesModule, 'getCoordinates')
  const setCurrentLocationSpy = jest.spyOn(thunks, 'setCurrentLocation')

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

  it('properly renders current latlon', () => {
    expect.assertions(2)
    expect(() => testInstance.findByProps({'data-id': 'geolocation-latlon'})).not.toThrow(Error)
    const currentLatLon = testInstance.findByProps({'data-id': 'geolocation-latlon'})
    expect(currentLatLon.props.children).toBe(78704)
  })

  it('geolocates on click', async () => {
    expect.assertions(4)
    const geolocationTrigger = testInstance.findByProps({'data-id': 'geolocation-trigger'})
    geolocationTrigger.props.onClick()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(fetchGeolocationSpy).toHaveBeenCalledTimes(1)
    await expect(getCoordinates).toHaveBeenCalledTimes(1)
    expect(setCurrentLocationSpy).toHaveBeenCalledTimes(1)
  })
})
