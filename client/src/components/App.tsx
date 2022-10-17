import * as React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { GeolocationButton } from './GeolocationButton'
import { Navigation } from './Navigation'
import { OptionsButton } from './OptionsButton'
import { OptionsModal } from './OptionsModal'
import { Restaurant } from './Restaurant'
import { IRestaurant } from '../models/Restaurant'
import { IRestaurantStore } from '../models/RestaurantStore'
import {
  fetchRestaurants,
  nextRestaurant,
  prevRestaurant,
  setReduxFromLocalStore,
} from '../store/thunks/restaurant'

const mapStateToProps = (
  { restaurant }: { restaurant: IRestaurantStore },
) => {
  const {
    current,
    error,
    filteredCount,
    geolocation,
    isLoading,
    modalIsOpen,
    options,
    restaurants,
  } = restaurant

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

        <Navigation
          dispatch={dispatch}
          filteredCount={filteredCount}
        ></Navigation>
      </section>
    )
  }
}

export default connect(mapStateToProps)(App as any)
