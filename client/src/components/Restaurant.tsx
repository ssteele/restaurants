import * as React from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import PropTypes from 'prop-types'

import {
  asyncFetchRestaurants,
  asyncGetOptionsFromLocalStorage,
  asyncToggleModal,
  asyncToggleOption,
  asyncNextRestaurant,
  asyncBackRestaurant,
} from '../store/actions/restaurant'

import { OptionCheckbox } from './Option/OptionCheckbox'
import '../css/Restaurant.css'

interface IRestaurant {
  id: number
  name: string
  sub_name?: string
  site: string
  menu: string
  organic: boolean
  vegetarian: boolean
  vegan: boolean
  local: boolean
  keto: boolean
  indoor: boolean
  outdoor: boolean
  kids: []
  zip: []
  enabled: boolean
  deleted: boolean
}

Modal.setAppElement('#root')

class Restaurant extends React.Component<IRestaurant> {
  static propTypes = {
    options: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    restaurants: PropTypes.object,
    current: PropTypes.number,
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

  public next = () => {
    const { dispatch }: any = this.props
    dispatch(asyncNextRestaurant())
  }

  public back = () => {
    const { dispatch }: any = this.props
    dispatch(asyncBackRestaurant())
  }

  public render() {
    const { options, restaurants, count, current, modalIsOpen, error }: any = this.props

    return (
      <div>
        <Modal 
          isOpen={modalIsOpen}
          contentLabel="Options"
          className="options-modal"
          overlayClassName="options-modal-overlay"
        >
          <div className="options-modal-bar">
            <span>{count} total restaurants</span>

            <button onClick={this.toggleModal}>
              <i className="fa fa-times fa-lg options-modal-close splash"></i>
            </button>
          </div>

          <div className="options-modal-content">
            {options.map((option: any, i: number) => {
              return (
                <section key={i}>
                  <OptionCheckbox
                    option={option}
                    toggleOption={this.toggleOption}
                  />
                </section>
              )
            })}
          </div>
        </Modal>

        <div
          className="options-modal-open splash"
          onClick={this.toggleModal}
        >
          <i className="fa fa-bars fa-lg"></i>
        </div>

        {current && (
          <div className="restaurant">
            <div className="restaurant-name">
              <a
                href={restaurants[current].menu}
                target="_blank"
                rel="noopener noreferrer"
              >{restaurants[current].name}</a>
            </div>

            <div className="sub-name">{restaurants[current].sub_name}</div>

            {restaurants[current].kids.length > 0 &&
              <div className="restaurant-kids">
                <span className="kids-item">
                  <i className="fa fa-child fa-fw"></i>
                  {restaurants[current].kids.join(', ')}
                </span>
              </div>
            }

            <div className="error">{error.message}</div>
          </div>
        )}

        {!current && (
          <div className="restaurant">
            <div className="restaurant-name subtle">
              Filterd :(
            </div>
          </div>
        )}

        <div className="actions">
          <div className="back">
            <button
              className="button secondary"
              onClick={this.back}
              disabled={count < 2}
            >Back</button>
          </div>

          <div className="next">
            <button
              className="button"
              onClick={this.next}
              disabled={count < 2}
            >Next</button>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: any) {
  const { options, restaurants, filteredCount: count, current, modalIsOpen, error } = state.restaurant
  return {
    options,
    restaurants,
    count,
    current,
    modalIsOpen,
    error,
  }
}

export default connect(mapStateToProps)(Restaurant as any)
