import * as React from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import PropTypes from 'prop-types'

import {
  fetchRestaurants,
  getOptionsFromLocalStorage,
  getZipFromLatLon,
  nextRestaurant,
  prevRestaurant,
  selectOption,
  toggleModal,
  toggleOption,
} from '../store/actions/restaurant'

import { IRestaurant } from '../models/Restaurant'
import { IOption } from '../models/Option'
import { OptionCheckbox } from './option/OptionCheckbox'
import { OptionSelect } from './option/OptionSelect'
import { LocationsSelect } from './option/LocationsSelect'
import '../css/Restaurant.css'

Modal.setAppElement('#root')

class Restaurant extends React.Component<IRestaurant> {
  static propTypes = {
    current: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.object,
    filteredCount: PropTypes.number.isRequired,
    geolocation: PropTypes.object,
    // locations: PropTypes.array,
    modalIsOpen: PropTypes.bool,
    options: PropTypes.array.isRequired,
    restaurants: PropTypes.object,
  }

  public componentDidMount() {
    const { dispatch }: any = this.props
    dispatch(getOptionsFromLocalStorage())
    dispatch(fetchRestaurants())
  }

  public getCoordinates = async () => {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    });
  }

  public getGeolocation = async () => {
    if (!('geolocation' in navigator)) {
      console.warn('Location services are unavailable')
    } else {
      const { dispatch }: any = this.props
      const position: any = await this.getCoordinates()
      dispatch(getZipFromLatLon({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }))
    }
  }

  public toggleModal = (e: any) => {
    const { dispatch }: any = this.props
    dispatch(toggleModal())
  }

  public toggleOption = (option: IOption, e: any) => {
    const { dispatch }: any = this.props
    dispatch(toggleOption(option))
  }

  public selectOption = (option: IOption, e: any) => {
    const { dispatch }: any = this.props
    dispatch(selectOption(option, e.target.value))
  }

  public selectMultiOptions = (option: IOption, e: any) => {
    const { dispatch }: any = this.props
    const valueArray = Array.from(e.target.selectedOptions, (option: any) => option.value)
    dispatch(selectOption(option, valueArray))
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
      error,
      filteredCount,
      geolocation,
      // locations,
      modalIsOpen,
      options,
      restaurants,
    }: any = this.props

    return (
      <div>
        <Modal 
          isOpen={modalIsOpen}
          contentLabel="Options"
          className="options-modal"
          overlayClassName="options-modal-overlay"
        >
          <div className="options-modal-bar">
            <span>{filteredCount} total restaurants</span>

            <button onClick={this.toggleModal}>
              <i className="fa fa-times fa-lg options-modal-close splash"></i>
            </button>
          </div>

          <div className="options-modal-content">
            {options.map((option: IOption, i: number) => {
              return option && (
                <section key={i}>
                  {'checkbox' === option.type && (
                    <OptionCheckbox
                      option={option}
                      toggleOption={this.toggleOption}
                    />
                  )}
                  {'select' === option.type && (
                    <OptionSelect
                      option={option}
                      selectOption={this.selectOption}
                    />
                  )}
                  {'locationSelect' === option.type && (
                    <LocationsSelect
                      option={option}
                      selectOption={this.selectMultiOptions}
                    />
                  )}
                </section>
              )
            })}
          </div>
        </Modal>

        <div className={`geolocation-trigger ${geolocation.zip ? 'inset' : ''}`}>
          <span
            className="splash"
            onClick={this.getGeolocation}
          >
            <i className="fa fa-compass fa-lg"></i>
          </span>

          {geolocation.zip && (
            <span className="subtle geolocation-zip">{geolocation.zip}</span>
          )}
        </div>

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
              disabled={filteredCount < 2}
            >Back</button>
          </div>

          <div className="next">
            <button
              className="button"
              onClick={this.next}
              disabled={filteredCount < 2}
            >Next</button>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: any) {
  const {
    current,
    error,
    filteredCount,
    geolocation,
    // locations,
    modalIsOpen,
    options,
    restaurants,
  } = state.restaurant

  return {
    current,
    error,
    filteredCount,
    geolocation,
    // locations,
    modalIsOpen,
    options,
    restaurants,
  }
}

export default connect(mapStateToProps)(Restaurant as any)
