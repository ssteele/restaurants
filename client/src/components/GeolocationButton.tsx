import * as React from 'react'
import PropTypes from 'prop-types'
import { LOCATION_REQUEST_COOL_OFF_SECONDS } from '../constants'
import {
  fetchGeolocation,
  setCurrentLocation,
} from '../store/thunks/restaurant'
import { getCoordinates } from '../utils/getCoordinates'
import '../css/GeolocationButton.css'
import { IGeolocation } from '../models/Geolocation'
import { IBrowserNavigatorApiResponse } from '../models/BrowserApi'

export class GeolocationButton extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    geolocation: PropTypes.object,
  }

  public renderLatLon(geolocation: IGeolocation): string {
    return `${geolocation?.lat?.toFixed(3)}, ${geolocation?.lon?.toFixed(3)}`
  }

  public getGeolocation = async (geolocation: IGeolocation): Promise<void> => {
    let isCoolOffPeriod = false
    if (geolocation.timestamp) {
      const secondsSinceLastFetch = Math.floor((Date.now() - geolocation.timestamp) / 1000)
      if (secondsSinceLastFetch < LOCATION_REQUEST_COOL_OFF_SECONDS) {
        isCoolOffPeriod = true
      }
    }
    if (geolocation.isGeolocating) {
      console.warn('Geolocating now - please wait')
      return
    } else if (isCoolOffPeriod) {
      console.warn('Geolocation cool down - too soon since the last request')
      return
    } else if (!('geolocation' in navigator) && 'test' !== process.env.NODE_ENV) {
      console.warn('Location services are unavailable')
    } else {
      const { dispatch }: any = this.props
      dispatch(fetchGeolocation())
      const position: IBrowserNavigatorApiResponse = await getCoordinates()

      dispatch(setCurrentLocation({
        lat: position?.coords?.latitude,
        lon: position?.coords?.longitude,
      }))
    }
  }

  private geolocationTriggerClasses = (geolocation: IGeolocation): string => {
    let classes = ['geolocation-trigger']
    if (geolocation?.lat && geolocation?.lon) {
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

        {geolocation.lat && geolocation.lon && (
          <span
            className="subtle geolocation-zip"
            data-id="geolocation-zip"
          >{this.renderLatLon(geolocation)}</span>
        )}
      </section>
    )
  }
}
