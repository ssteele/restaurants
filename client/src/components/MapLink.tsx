import * as React from 'react'
import PropTypes from 'prop-types'
import { GOOGLE_MAP_AUSTIN_BASE_URL } from '@/constants';
import { IRestaurantOption } from '@/models/RestaurantOption'
import '@/css/MapLink.css'

const mapNearbyMilesToZoom: {[key: number]: number} = { 1: 16, 2: 15, 3: 14, 5: 13, 8: 12, 15: 11 }

export class MapLink extends React.Component {
  static propTypes = {
    geolocation: PropTypes.object,
    options: PropTypes.array.isRequired,
  }

  public openMapLink(): void {
    const { geolocation, options }: any = this.props
    const { lat, lon } = geolocation
    const nearbyMaxMilesSelection = Number(options.find((o: IRestaurantOption) => 'nearbyMaxMiles' === o.name)?.value)
    const zoom: number = mapNearbyMilesToZoom[nearbyMaxMilesSelection]

    const mapUrl = new URL(`${GOOGLE_MAP_AUSTIN_BASE_URL}&ll=${lat},${lon}&z=${zoom}`)
    window.open(mapUrl.href)
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
