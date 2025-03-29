import * as React from 'react'
import PropTypes from 'prop-types'
import {
  DEFAULT_LAT,
  DEFAULT_LON,
} from '@/constants'
import { GOOGLE_MAP_AUSTIN_BASE_URL } from '@/constants'
import { IRestaurantOption } from '@/models/RestaurantOption'
import '@/css/MapLink.css'

const mapNearbyMilesToZoom: {[key: number]: number} = { 1: 16, 2: 15, 3: 14, 5: 13, 8: 12, 15: 11 }

export class MapLink extends React.Component {
  static propTypes = {
    geolocation: PropTypes.object,
    options: PropTypes.array.isRequired,
  }

  public get mapLink(): string {
    const { geolocation, options }: any = this.props
    const lat = geolocation?.lat || DEFAULT_LAT
    const lon = geolocation?.lon || DEFAULT_LON
    const nearbySelection = !!options.find((o: IRestaurantOption) => 'nearby' === o.name)?.value
    let nearbyMaxMilesSelection: number = 3
    if (nearbySelection) {
      nearbyMaxMilesSelection = Number(options.find((o: IRestaurantOption) => 'nearbyMaxMiles' === o.name)?.value)
    }
    const zoom: number = mapNearbyMilesToZoom[nearbyMaxMilesSelection]

    return new URL(`${GOOGLE_MAP_AUSTIN_BASE_URL}&ll=${lat},${lon}&z=${zoom}`).toString()
  }

  public navigateToLink(link: string): void {
    window.open(link)
  }

  public openMapLink(): void {
    this.navigateToLink(this.mapLink)
  }

  public render(): React.ReactNode {
    return (
      <section
        className="map-link"
        data-id="map-link"
        onClick={() => this.openMapLink()}
      >
        <span className="splash">
          <i className="fa fa-map-o fa-lg"></i>
        </span>
      </section>
    )
  }
}
