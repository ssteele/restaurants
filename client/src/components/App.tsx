import * as React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
  fetchRestaurants,
  nextRestaurant,
  prevRestaurant,
  setReduxFromLocalStore,
  toggleModal,
} from '../store/thunks/restaurant'

import { GeolocationButton } from './GeolocationButton'
import { OptionsModal } from './OptionsModal'
import { IRestaurant } from '../models/Restaurant'
import '../css/App.css'

class App extends React.Component<IRestaurant> {
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

        <GeolocationButton
          dispatch={dispatch}
          geolocation={geolocation}
        ></GeolocationButton>

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

export default connect(mapStateToProps)(App as any)
