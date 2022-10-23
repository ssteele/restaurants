import * as React from 'react'
import PropTypes from 'prop-types'
import {
  nextRestaurant,
  prevRestaurant,
} from '../store/thunks/restaurant'
import '../css/Navigation.css'

export class Navigation extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    filteredCount: PropTypes.number.isRequired,
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
      filteredCount,
    }: any = this.props

    return (
      <nav>
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
      </nav>
    )
  }
}
