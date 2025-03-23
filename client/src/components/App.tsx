import * as React from 'react'
import PropTypes from 'prop-types'
import { GeolocationButton } from '@/components/GeolocationButton'
import { Navigation } from '@/components/Navigation'
import { OptionsButton } from '@/components/OptionsButton'
import { OptionsModal } from '@/components/OptionsModal'
import { Restaurant } from '@/components/Restaurant'
import { IRestaurant } from '@/models/Restaurant'
import {
  fetchRestaurants,
  nextRestaurant,
  prevRestaurant,
  setReduxFromLocalStore,
} from '@/store/thunks/restaurant'

export class App extends React.Component<IRestaurant> {
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

  public componentDidMount(): void {
    const { dispatch }: any = this.props
    dispatch(setReduxFromLocalStore())
    dispatch(fetchRestaurants())
  }

  public next = (): void => {
    const { dispatch }: any = this.props
    dispatch(nextRestaurant())
  }

  public back = (): void => {
    const { dispatch }: any = this.props
    dispatch(prevRestaurant())
  }

  public render(): React.ReactNode {
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
      <main>
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
      </main>
    )
  }
}
