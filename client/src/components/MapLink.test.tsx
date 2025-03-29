import React from 'react'
import TestRenderer from 'react-test-renderer'
import { MapLink } from '@/components/MapLink'
import {
  DEFAULT_LAT,
  DEFAULT_LON,
  GOOGLE_MAP_AUSTIN_BASE_URL,
} from '@/constants'
import { IGeolocation } from '@/models/Geolocation'

describe('MapLink component with only near me toggled off', () => {
})

describe('MapLink component with no location and no options', () => {
  let testRenderer: any
  let testInstance: any
  const geolocation: IGeolocation = {
    isGeolocating: false,
    lat: 0,
    lon: 0,
  }
  const options: any[] = []
  // const options: any[] = [
  //   { name: 'nearby', value: true },
  //   { name: 'nearbyMaxMiles', value: '5' }
  // ]
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

