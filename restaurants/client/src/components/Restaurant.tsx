import * as React from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import PropTypes from 'prop-types'

import {
  asyncFetchRestaurants,
  asyncGetOptionsFromLocalStorage,
  asyncToggleModal,
  asyncToggleOption,
  asyncPickRandom,
} from '../store/actions/restaurant'

import '../css/Restaurant.css'

interface IRestaurant {
  id?: number
  name?: string
  sub_name?: string
  site?: string
  menu?: string
  organic?: boolean
  vegetarian?: boolean
  vegan?: boolean
  local?: boolean
  keto?: boolean
  outdoor?: boolean
  harvi?: []
  zip?: []
  enabled?: boolean
  deleted?: boolean
  created_at?: string
  updated_at?: string
}

Modal.setAppElement('#root')

class Restaurant extends React.Component<IRestaurant> {
  static propTypes = {
    options: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    restaurants: PropTypes.object,
    chosen: PropTypes.number,
    modalIsOpen: PropTypes.bool,
    error: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  }

  public componentDidMount() {
    const { dispatch }: any = this.props
    dispatch(asyncGetOptionsFromLocalStorage())
    dispatch(asyncFetchRestaurants())
  }

  public toggleModal = (e: any) => {
    const { dispatch }: any = this.props
    dispatch(asyncToggleModal())
  }

  public toggleOption = (option: any, e: any) => {
    const { dispatch }: any = this.props
    dispatch(asyncToggleOption(option))
  }

  public pickRandom = () => {
    const { dispatch }: any = this.props
    dispatch(asyncPickRandom())
  }

  public capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  public render() {
    const { options, restaurants, count, chosen, modalIsOpen, error }: any = this.props
    if (!!chosen) {
      return (
        <div>
          <Modal 
           isOpen={modalIsOpen}
           contentLabel="Minimal Modal Example"
          >
          <button onClick={this.toggleModal}>
            <i className="fa fa-times fa-lg"></i>
          </button>
          </Modal>

          <div
            className="options-menu"
            onClick={this.toggleModal}
          >
            <i className="fa fa-bars fa-lg"></i>
          </div>

          <div className="restaurant">
            <div className="name">
              <a
                href={restaurants[chosen].menu}
                target="_blank"
                rel="noopener noreferrer"
              >{restaurants[chosen].name}</a>
            </div>
            <div className="sub-name">{restaurants[chosen].sub_name}</div>
            <div className="error">{error.message}</div>
          </div>

          <div className="button-group options">
            {options.map((option: any, i: any) => {
              return <span key={i}>
                  <input
                    id={option.name}
                    type="checkbox"
                    checked={option.isChecked}
                    onChange={(e) => this.toggleOption(option, e)}
                  />
                  <label
                    className="button"
                    htmlFor={option.name}
                  >{this.capitalizeFirstLetter(option.name)}</label>
                </span>
            })}
          </div>

          <div className="picker">
            <button
              className="button"
              onClick={this.pickRandom}
              disabled={!count}
            >Pick from {count}</button>
          </div>
        </div>
      )
    }

    return null
  }
}

function mapStateToProps(state: any) {
  const { options, restaurants, filteredCount: count, chosen, modalIsOpen, error } = state.restaurant
  return {
    options,
    restaurants,
    count,
    chosen,
    modalIsOpen,
    error,
  }
}

export default connect(mapStateToProps)(Restaurant as any)