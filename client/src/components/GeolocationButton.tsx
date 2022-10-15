import * as React from 'react'
import PropTypes from 'prop-types'

import {
  GOOGLE_MAPS_COOL_OFF_SECONDS,
} from '../constants'

import {
  fetchGeolocation,
  getZipFromLatLon,
} from '../store/thunks/restaurant'

import '../css/GeolocationButton.css'

export class GeolocationButton extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    geolocation: PropTypes.object,
  }

  public getCoordinates = async () => {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  }

  public getGeolocation = async (geolocation: any) => {
    let isCoolOffPeriod = false
    if (geolocation.timestamp) {
      const secondsSinceLastFetch = Math.floor((Date.now() - geolocation.timestamp) / 1000)
      if (secondsSinceLastFetch < GOOGLE_MAPS_COOL_OFF_SECONDS) {
        isCoolOffPeriod = true
      }
    }
    if (geolocation.isGeolocating) {
      console.warn('Geolocating now - please wait')
      return
    } else if (isCoolOffPeriod) {
      console.warn('Geolocation cool down - too soon since the last request')
      return
    } else if (!('geolocation' in navigator)) {
      console.warn('Location services are unavailable')
    } else {
      const { dispatch }: any = this.props
      dispatch(fetchGeolocation())
      const position: any = await this.getCoordinates()
      dispatch(getZipFromLatLon({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }))
    }
  }

  public render() {
    const {
      geolocation,
    }: any = this.props

    return (
      <section
        className={`
          geolocation-trigger
          ${geolocation.zip ? 'inset' : ''}
          ${geolocation.zip && !geolocation.isGeolocating ? 'flash' : ''}
        `}
        onClick={() => this.getGeolocation(geolocation)}
      >
        <span
          className="splash"
        >
          <i className={`fa fa-compass fa-lg ${geolocation.isGeolocating ? 'fa-spin' : ''}`}></i>
        </span>

        {geolocation.zip && (
          <span className="subtle geolocation-zip">{geolocation.zip}</span>
        )}
      </section>
    )
  }
}
