import * as React from 'react'
import PropTypes from 'prop-types'
import { LOCATION_REQUEST_COOL_OFF_SECONDS } from '@/constants'
import { IGeolocation } from '@/models/Geolocation'
import { IBrowserNavigatorApiResponse } from '@/models/BrowserApi'
import {
  cancelGeolocation,
  fetchGeolocation,
  setCurrentLocation,
} from '@/store/thunks/restaurant'
import { getCoordinates } from '@/utils/getCoordinates'
import '@/css/GeolocationButton.css'

export class GeolocationButton extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    geolocation: PropTypes.object,
  }

  public renderLatLon(geolocation: IGeolocation): string {
    return `${geolocation?.lat?.toFixed(3)}, ${geolocation?.lon?.toFixed(3)}`
  }

  public getGeolocation = async (geolocation: IGeolocation): Promise<void> => {
    const { dispatch }: any = this.props
    dispatch(fetchGeolocation())

    let isCoolOffPeriod = false
    if (geolocation.timestamp) {
      const secondsSinceLastFetch = Math.floor((Date.now() - geolocation.timestamp) / 1000)
      if (secondsSinceLastFetch < LOCATION_REQUEST_COOL_OFF_SECONDS) {
        isCoolOffPeriod = true
      }
    }

    if (geolocation.isGeolocating) {
      console.warn('Geolocating now - please wait')
    } else if (isCoolOffPeriod) {
      console.warn('Geolocation cool down - too soon since the last request')
    } else if (!('geolocation' in navigator) && 'test' !== process.env.NODE_ENV) {
      console.warn('Location services are unavailable')
    } else {
      const position: IBrowserNavigatorApiResponse = await getCoordinates()

      dispatch(setCurrentLocation({
        lat: position?.coords?.latitude,
        lon: position?.coords?.longitude,
      }))

      return
    }

    dispatch(cancelGeolocation())
  }

  private isRecentGeolocation = (geolocation: IGeolocation): boolean => {
    if (!geolocation || !geolocation.timestamp) {
      return false
    }
    return (Date.now() - geolocation.timestamp) < (LOCATION_REQUEST_COOL_OFF_SECONDS * 1000)
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
            className="subtle geolocation-latlon"
            data-id="geolocation-latlon"
          >{this.renderLatLon(geolocation)}</span>
        )}
      </section>
    )
  }
}
