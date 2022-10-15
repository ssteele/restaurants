import * as React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  fetchRestaurants,
  nextRestaurant,
  prevRestaurant,
  setReduxFromLocalStore,
} from '../store/thunks/restaurant'
import { GeolocationButton } from './GeolocationButton'
import { OptionsButton } from './OptionsButton'
import { OptionsModal } from './OptionsModal'
import { Restaurant } from './Restaurant'
import { IRestaurant } from '../models/Restaurant'
import '../css/App.css'

const mapStateToProps = (state: any) => {
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

        <OptionsButton
          dispatch={dispatch}
        ></OptionsButton>

        <Restaurant
          current={current}
          error={error}
          isLoading={isLoading}
          restaurants={restaurants}
        ></Restaurant>

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

export default connect(mapStateToProps)(App as any)
