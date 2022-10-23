import * as React from 'react'
import PropTypes from 'prop-types'
import '../../css/OptionCheckbox.css'

export class OptionCheckbox extends React.Component {
  static propTypes = {
    option: PropTypes.object.isRequired,
    toggleOption: PropTypes.func.isRequired,
  }

  public render(): React.ReactNode {
    const { option, toggleOption }: any = this.props

    return !!option && option.rendered && (
      <section className="grid-x">
        <section className="cell small-10">
          {option.description}
        </section>

        <section className="cell auto option-toggle">
          <section className="switch">
            <input
              className="switch-input"
              disabled={option.disabled}
              id={option.name}
              type="checkbox"
              name={option.name}
              checked={option.value}
              onChange={(e) => toggleOption(option, e)}
            />
            <label className="switch-paddle" htmlFor={option.name}>
              <span className="show-for-sr">
                {option.name}
              </span>
            </label>
          </section>
        </section>
      </section>
    )
  }
}
