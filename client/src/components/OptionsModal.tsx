import * as React from 'react'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import {
  selectOption,
  toggleModal,
  toggleOption,
} from '../store/thunks/restaurant'
import { IOption } from '../models/Option'
import { OptionCheckbox } from './option/OptionCheckbox'
import { OptionSelect } from './option/OptionSelect'
import '../css/OptionsModal.css'

Modal.setAppElement('#root')

export class OptionsModal extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    filteredCount: PropTypes.number.isRequired,
    modalIsOpen: PropTypes.bool,
    options: PropTypes.array.isRequired,
  }

  public toggleModal = () => {
    const { dispatch }: any = this.props
    dispatch(toggleModal())
  }

  public toggleOption = (option: IOption) => {
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

  public render() {
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

            <button onClick={this.toggleModal}>
              <i className="fa fa-times fa-lg options-modal-close splash"></i>
            </button>
          </section>

          <section className="options-modal-content">
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
                </section>
              )
            })}
          </section>
        </Modal>
      </aside>
    )
  }
}
