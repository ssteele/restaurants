import * as React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
  GOOGLE_MAPS_COOL_OFF_SECONDS,
} from '../constants'

import {
  fetchGeolocation,
  fetchRestaurants,
  getZipFromLatLon,
  nextRestaurant,
  prevRestaurant,
  setReduxFromLocalStore,
  toggleModal,
} from '../store/thunks/restaurant'

import { OptionsModal } from './OptionsModal'
import { IRestaurant } from '../models/Restaurant'
import '../css/Restaurant.css'

class Restaurant extends React.Component<IRestaurant> {
  static propTypes = {
    current: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.object,
    filteredCount: PropTypes.number.isRequired,
    geolocation: PropTypes.object,
    isLoading: PropTypes.bool,
    modalIsOpen: PropTypes.bool,
    options: PropTypes.array.isRequired,
    restaurants: PropTypes.object,
  }

  public componentDidMount() {
    const { dispatch }: any = this.props
    dispatch(setReduxFromLocalStore())
    dispatch(fetchRestaurants())
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

  public toggleModal = () => {
    const { dispatch }: any = this.props
    dispatch(toggleModal())
  }

  public next = () => {
    const { dispatch }: any = this.props
    dispatch(nextRestaurant())
  }

  public back = () => {
    const { dispatch }: any = this.props
    dispatch(prevRestaurant())
  }

  public render() {
    const {
      current,
      dispatch,
      error,
      filteredCount,
      geolocation,
      isLoading,
      modalIsOpen,
      options,
      restaurants,
    }: any = this.props

    return (
      <section>
        <OptionsModal
          dispatch={dispatch}
          filteredCount={filteredCount}
          modalIsOpen={modalIsOpen}
          options={options}
        ></OptionsModal>

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

        <section
          className="options-modal-open splash"
          onClick={this.toggleModal}
        >
          <i className="fa fa-bars fa-lg"></i>
        </section>

        {current && (
          <section className="restaurant">
            {restaurants[current].name &&
              <section className="restaurant-name">
                <a
                  href={restaurants[current].menu}
                  target="_blank"
                  rel="noopener noreferrer"
                >{restaurants[current].name}</a>
              </section>
            }

            {restaurants[current].sub_name &&
              <section>
                <span className="sub-name">{restaurants[current].sub_name}</span>
              </section>
            }

            {restaurants[current].kids.length > 0 &&
              <section className="restaurant-kids">
                <i className="fa fa-child fa-fw"></i>
                {restaurants[current].kids.join(', ')}
              </section>
            }

            {error.message &&
              <section>
                <span className="error">{error.message}</span>
              </section>
            }
          </section>
        )}

        {!current && (
          <section className="restaurant">
            <span className="restaurant-name subtle">
              {isLoading ? 'Loading...' : 'Nope :('}
            </span>
          </section>
        )}

        <section className="actions">
          <span className="back">
            <button
              className="button secondary"
              onClick={this.back}
              disabled={filteredCount < 2}
            >Back</button>
          </span>

          <span className="next">
            <button
              className="button"
              onClick={this.next}
              disabled={filteredCount < 2}
            >Next</button>
          </span>
        </section>
      </section>
    )
  }
}

function mapStateToProps(state: any) {
  const {
    current,
    error,
    filteredCount,
    geolocation,
    isLoading,
    modalIsOpen,
    options,
    restaurants,
  } = state.restaurant

  return {
    current,
    error,
    filteredCount,
    geolocation,
    isLoading,
    modalIsOpen,
    options,
    restaurants,
  }
}

export default connect(mapStateToProps)(Restaurant as any)
