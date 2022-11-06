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
import { IGeolocation } from '../models/Geolocation'
import { IBrowserNavigatorApiResponse } from '../models/BrowserApi'

export class GeolocationButton extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    geolocation: PropTypes.object,
  }

  public getCoordinates = async (): Promise<IBrowserNavigatorApiResponse> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  }

  public getGeolocation = async (geolocation: IGeolocation): Promise<void> => {
    let isCoolOffPeriod = false
    if (geolocation.timestamp) {
      const secondsSinceLastFetch = Math.floor((Date.now() - geolocation.timestamp) / 1000)
      if (secondsSinceLastFetch < GOOGLE_MAPS_COOL_OFF_SECONDS) {
        isCoolOffPeriod = true
      }
    }
    if (geolocation.isGeolocating) {
      if ('test' !== process.env.NODE_ENV) {
        console.warn('Geolocating now - please wait')
      }
      return
    } else if (isCoolOffPeriod) {
      console.warn('Geolocation cool down - too soon since the last request')
      return
    } else if (!('geolocation' in navigator)) {
      console.warn('Location services are unavailable')
    } else {
      const { dispatch }: any = this.props
      dispatch(fetchGeolocation())
      const position: IBrowserNavigatorApiResponse = await this.getCoordinates()
      dispatch(getZipFromLatLon({
        lat: position?.coords?.latitude,
        lon: position?.coords?.longitude,
      }))
    }
  }

  private geolocationTriggerClasses = (geolocation: IGeolocation): string => {
    let classes = ['geolocation-trigger']
    if (geolocation.zip) {
      classes = [...classes, 'inset']
      if (!geolocation.isGeolocating) {
        classes = [...classes, 'flash']
      }
    }
    return classes.join(' ')
  }

  public render(): React.ReactNode {
    const { geolocation }: any = this.props

    return (
      <section
        className={this.geolocationTriggerClasses(geolocation)}
        data-id="geolocation-trigger"
        onClick={() => this.getGeolocation(geolocation)}
      >
        <span className="splash">
          <i className={`fa fa-compass fa-lg ${geolocation.isGeolocating ? 'fa-spin' : ''}`}></i>
        </span>

        {geolocation.zip && (
          <span
            className="subtle geolocation-zip"
            data-id="geolocation-zip"
          >{geolocation.zip}</span>
        )}
      </section>
    )
  }
}
