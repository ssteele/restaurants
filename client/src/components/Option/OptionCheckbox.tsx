import * as React from 'react'
import PropTypes from 'prop-types'

import '../../css/OptionCheckbox.css'

export class OptionCheckbox extends React.Component {
  static propTypes = {
    option: PropTypes.object.isRequired,
    toggleOption: PropTypes.func.isRequired,
  }

  public render() {
    const { option, toggleOption }: any = this.props

    return (
      <div className="grid-x">
        <div className="cell small-10">
          {option.description}
        </div>

        <div className="cell auto option-toggle">
          <div className="switch">
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
          </div>
        </div>
      </div>
    )
  }
}
