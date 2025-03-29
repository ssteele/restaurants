import React from 'react'
import TestRenderer from 'react-test-renderer'
import { MapLink } from '@/components/MapLink'
import {
  DEFAULT_LAT,
  DEFAULT_LON,
  GOOGLE_MAP_AUSTIN_BASE_URL,
} from '@/constants'
import { IGeolocation } from '@/models/Geolocation'

describe('MapLink component with no location and no options', () => {
  let testRenderer: any
  let testInstance: any
  const geolocation: IGeolocation = {
    isGeolocating: false,
    lat: 0,
    lon: 0,
  }
  const options: any[] = []
  const navigateToLinkSpy = jest.spyOn(MapLink.prototype, 'navigateToLink').mockImplementation(() => {})

  beforeEach(() => {
    testRenderer = TestRenderer.create(
      <MapLink
        geolocation={geolocation}
        options={options}
      ></MapLink>
    )
    testInstance = testRenderer.root
  })

  afterEach(() => {
    navigateToLinkSpy.mockRestore()
  })

  it('properly renders link', () => {
    expect.assertions(2)
    const mapLink = testInstance.findByProps({ 'data-id': 'map-link' })
    expect(() => mapLink).not.toThrow(Error)
    mapLink.props.onClick()
    expect(navigateToLinkSpy).toHaveBeenCalledWith(`${GOOGLE_MAP_AUSTIN_BASE_URL}&ll=${DEFAULT_LAT},${DEFAULT_LON}&z=14`)
  })
})

describe('MapLink component with location and no options', () => {
  let testRenderer: any
  let testInstance: any
  let navigateToLinkSpy: jest.SpyInstance
  let windowOpenSpy: jest.SpyInstance
  const geolocation: IGeolocation = {
    isGeolocating: false,
    lat: 11.11,
    lon: -11.11,
  }
  const options: any[] = []

  beforeEach(() => {
    navigateToLinkSpy = jest.spyOn(MapLink.prototype, 'navigateToLink').mockImplementation(() => {})
    windowOpenSpy = jest.spyOn(global, 'open').mockImplementation(() => {})
    testRenderer = TestRenderer.create(
      <MapLink
        geolocation={geolocation}
        options={options}
      ></MapLink>
    )
    testInstance = testRenderer.root
  })

  afterEach(() => {
    navigateToLinkSpy.mockRestore()
  })

  it('properly renders link', () => {
    expect.assertions(2)
    const mapLink = testInstance.findByProps({ 'data-id': 'map-link' })
    expect(() => mapLink).not.toThrow(Error)
    mapLink.props.onClick()
    expect(navigateToLinkSpy).toHaveBeenCalledWith(`${GOOGLE_MAP_AUSTIN_BASE_URL}&ll=11.11,-11.11&z=14`)
  })
})

describe('MapLink component with options and no location', () => {
  let testRenderer: any
  let testInstance: any
  let navigateToLinkSpy: jest.SpyInstance
  let windowOpenSpy: jest.SpyInstance
  const geolocation: IGeolocation = {
    isGeolocating: false,
    lat: 0,
    lon: 0,
  }
  const options: any[] = [
    { name: 'nearby', value: true },
    { name: 'nearbyMaxMiles', value: '5' }
  ]

  beforeEach(() => {
    navigateToLinkSpy = jest.spyOn(MapLink.prototype, 'navigateToLink').mockImplementation(() => {})
    windowOpenSpy = jest.spyOn(global, 'open').mockImplementation(() => {})
    testRenderer = TestRenderer.create(
      <MapLink
        geolocation={geolocation}
        options={options}
      ></MapLink>
    )
    testInstance = testRenderer.root
  })

  afterEach(() => {
    navigateToLinkSpy.mockRestore()
  })

  it('properly renders link', () => {
    expect.assertions(2)
    const mapLink = testInstance.findByProps({ 'data-id': 'map-link' })
    expect(() => mapLink).not.toThrow(Error)
    mapLink.props.onClick()
    expect(navigateToLinkSpy).toHaveBeenCalledWith(`${GOOGLE_MAP_AUSTIN_BASE_URL}&ll=${DEFAULT_LAT},${DEFAULT_LON}&z=13`)
  })
})

describe('MapLink component with location and only near me toggled off', () => {
  let testRenderer: any
  let testInstance: any
  let navigateToLinkSpy: jest.SpyInstance
  let windowOpenSpy: jest.SpyInstance
  const geolocation: IGeolocation = {
    isGeolocating: false,
    lat: 22.22,
    lon: -22.22,
  }
  const options: any[] = [
    { name: 'nearby', value: false },
    { name: 'nearbyMaxMiles', value: '5' }
  ]

  beforeEach(() => {
    navigateToLinkSpy = jest.spyOn(MapLink.prototype, 'navigateToLink').mockImplementation(() => {})
    windowOpenSpy = jest.spyOn(global, 'open').mockImplementation(() => {})
    testRenderer = TestRenderer.create(
      <MapLink
        geolocation={geolocation}
        options={options}
      ></MapLink>
    )
    testInstance = testRenderer.root
  })

  afterEach(() => {
    navigateToLinkSpy.mockRestore()
  })

  it('properly renders link', () => {
    expect.assertions(2)
    const mapLink = testInstance.findByProps({ 'data-id': 'map-link' })
    expect(() => mapLink).not.toThrow(Error)
    mapLink.props.onClick()
    expect(navigateToLinkSpy).toHaveBeenCalledWith(`${GOOGLE_MAP_AUSTIN_BASE_URL}&ll=22.22,-22.22&z=14`)
  })
})

describe('MapLink component with location and options', () => {
  let testRenderer: any
  let testInstance: any
  let navigateToLinkSpy: jest.SpyInstance
  let windowOpenSpy: jest.SpyInstance
  const geolocation: IGeolocation = {
    isGeolocating: false,
    lat: 33.33,
    lon: -33.33,
  }
  const options: any[] = [
    { name: 'nearby', value: true },
    { name: 'nearbyMaxMiles', value: '1' }
  ]

  beforeEach(() => {
    navigateToLinkSpy = jest.spyOn(MapLink.prototype, 'navigateToLink').mockImplementation(() => {})
    windowOpenSpy = jest.spyOn(global, 'open').mockImplementation(() => {})
    testRenderer = TestRenderer.create(
      <MapLink
        geolocation={geolocation}
        options={options}
      ></MapLink>
    )
    testInstance = testRenderer.root
  })

  afterEach(() => {
    navigateToLinkSpy.mockRestore()
  })

  it('properly renders link when nearbyMaxMiles is 1', () => {
    expect.assertions(2)
    const mapLink = testInstance.findByProps({ 'data-id': 'map-link' })
    expect(() => mapLink).not.toThrow(Error)
    mapLink.props.onClick()
    expect(navigateToLinkSpy).toHaveBeenCalledWith(`${GOOGLE_MAP_AUSTIN_BASE_URL}&ll=33.33,-33.33&z=16`)
  })

  it('properly renders link when nearbyMaxMiles is 8', () => {
    options[1].value = '8'
    expect.assertions(2)
    const mapLink = testInstance.findByProps({ 'data-id': 'map-link' })
    expect(() => mapLink).not.toThrow(Error)
    mapLink.props.onClick()
    expect(navigateToLinkSpy).toHaveBeenCalledWith(`${GOOGLE_MAP_AUSTIN_BASE_URL}&ll=33.33,-33.33&z=12`)
  })

  it('properly renders link when nearbyMaxMiles is 15', () => {
    options[1].value = '15'
    expect.assertions(2)
    const mapLink = testInstance.findByProps({ 'data-id': 'map-link' })
    expect(() => mapLink).not.toThrow(Error)
    mapLink.props.onClick()
    expect(navigateToLinkSpy).toHaveBeenCalledWith(`${GOOGLE_MAP_AUSTIN_BASE_URL}&ll=33.33,-33.33&z=11`)
  })
})
