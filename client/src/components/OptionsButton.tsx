import * as React from 'react'
import PropTypes from 'prop-types'
import {
  toggleModal,
} from '../store/thunks/restaurant'
import '../css/OptionsButton.css'

export class OptionsButton extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  public toggleModal = () => {
    const { dispatch }: any = this.props
    dispatch(toggleModal())
  }

  public render() {
    return (
      <section
        className="options-modal-open splash"
        onClick={this.toggleModal}
      >
        <i className="fa fa-bars fa-lg"></i>
      </section>
    )
  }
}
