import React from 'react'
import TestRenderer from 'react-test-renderer';
import { GeolocationButton } from '@/components/GeolocationButton';
import {
  DEFAULT_LAT,
  DEFAULT_LON,
  LOCATION_REQUEST_COOL_OFF_SECONDS,
} from '@/constants'
import { IGeolocation } from '@/models/Geolocation';
import * as thunks from '@/store/thunks/restaurant'
import * as getCoordinatesModule from '@/utils/getCoordinates'

describe('Geolocation component with no location', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const geolocation: IGeolocation = {
    isGeolocating: false,
    lat: 0,
    lon: 0,
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
    lat: 0,
    lon: 0,
  }
  const fetchGeolocationSpy = jest.spyOn(thunks, 'fetchGeolocation')
  const getCoordinates = jest.spyOn(getCoordinatesModule, 'getCoordinates')
  const setCurrentLocationSpy = jest.spyOn(thunks, 'setCurrentLocation')
  const cancelGeolocationSpy = jest.spyOn(thunks, 'cancelGeolocation')
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
    expect.assertions(6)
    geolocation.isGeolocating = true
    const geolocationTrigger = testInstance.findByProps({'data-id': 'geolocation-trigger'})
    geolocationTrigger.props.onClick()
    expect(consoleWarnSpy).toHaveBeenCalledWith('Geolocating now - please wait')
    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(fetchGeolocationSpy).toHaveBeenCalledTimes(1)
    expect(getCoordinates).toHaveBeenCalledTimes(0)
    expect(setCurrentLocationSpy).toHaveBeenCalledTimes(0)
    expect(cancelGeolocationSpy).toHaveBeenCalledTimes(1)
  })
})

describe('Geolocation component with location during cooldown', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const geolocation: IGeolocation = {
    lat: DEFAULT_LAT,
    lon: DEFAULT_LON,
    timestamp: Date.now() - (1000 * LOCATION_REQUEST_COOL_OFF_SECONDS / 2),
    isGeolocating: false,
  }
  const fetchGeolocationSpy = jest.spyOn(thunks, 'fetchGeolocation')
  const getCoordinates = jest.spyOn(getCoordinatesModule, 'getCoordinates')
  const setCurrentLocationSpy = jest.spyOn(thunks, 'setCurrentLocation')
  const cancelGeolocationSpy = jest.spyOn(thunks, 'cancelGeolocation')
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

  it('properly renders current latlon', () => {
    expect.assertions(2)
    expect(() => testInstance.findByProps({'data-id': 'geolocation-latlon'})).not.toThrow(Error)
    const currentLatLon = testInstance.findByProps({'data-id': 'geolocation-latlon'})
    expect(currentLatLon.props.children).toBe('30.309, -97.720')
  })

  it('does not dispatch another geolocation event', async () => {
    expect.assertions(6)
    const geolocationTrigger = testInstance.findByProps({'data-id': 'geolocation-trigger'})
    geolocationTrigger.props.onClick()
    expect(consoleWarnSpy).toHaveBeenCalledWith('Geolocation cool down - too soon since the last request')
    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(fetchGeolocationSpy).toHaveBeenCalledTimes(1)
    expect(getCoordinates).toHaveBeenCalledTimes(0)
    expect(setCurrentLocationSpy).toHaveBeenCalledTimes(0)
    expect(cancelGeolocationSpy).toHaveBeenCalledTimes(1)
  })
})

describe('Geolocation component with location following cooldown', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const geolocation: IGeolocation = {
    lat: DEFAULT_LAT,
    lon: DEFAULT_LON,
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
    expect(geolocationTrigger.props.className).toBe('geolocation-trigger inset');
  })

  it('properly renders current latlon', () => {
    expect.assertions(2)
    expect(() => testInstance.findByProps({'data-id': 'geolocation-latlon'})).not.toThrow(Error)
    const currentLatLon = testInstance.findByProps({'data-id': 'geolocation-latlon'})
    expect(currentLatLon.props.children).toBe('30.309, -97.720')
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
