import * as React from 'react'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import {
  selectOption,
  toggleModal,
  toggleOption,
} from '../store/thunks/restaurant'
import { IRestaurantOption } from '../models/RestaurantOption'
import { OptionCheckbox } from './option/OptionCheckbox'
import { OptionSelect } from './option/OptionSelect'
import '../css/OptionsModal.css'

export class OptionsModal extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    filteredCount: PropTypes.number.isRequired,
    modalIsOpen: PropTypes.bool,
    options: PropTypes.array.isRequired,
  }

  public toggleModal = (): void => {
    const { dispatch }: any = this.props
    dispatch(toggleModal())
  }

  public toggleOption = (option: IRestaurantOption): void => {
    const { dispatch }: any = this.props
    dispatch(toggleOption(option))
  }

  public selectOption = (option: IRestaurantOption, e: any): void => {
    const { dispatch }: any = this.props
    dispatch(selectOption(option, e.target.value))
  }

  public selectMultiOptions = (option: IRestaurantOption, e: any): void => {
    const { dispatch }: any = this.props
    const valueArray = Array.from(e.target.selectedOptions, (option: IRestaurantOption) => option.value)
    dispatch(selectOption(option, valueArray))
  }

  public render(): React.ReactNode {
    const {
      filteredCount,
      modalIsOpen,
      options,
    }: any = this.props

    return (
      <aside>
        <Modal 
          isOpen={modalIsOpen}
          contentLabel="Options"
          className="options-modal"
          overlayClassName="options-modal-overlay"
        >
          <section className="options-modal-bar">
            <span>{filteredCount} total restaurants</span>

            <button
              data-id="options-modal-close"
              onClick={this.toggleModal}
            >
              <i className="fa fa-times fa-lg options-modal-close splash"></i>
            </button>
          </section>

          <section className="options-modal-content">
            {options.map((option: IRestaurantOption, i: number) => {
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
                </section>
              )
            })}
          </section>
        </Modal>
      </aside>
    )
  }
}
