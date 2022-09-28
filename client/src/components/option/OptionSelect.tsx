import * as React from 'react'
import PropTypes from 'prop-types'

// import '../../css/OptionSelect.css'

export class OptionSelect extends React.Component {
  static propTypes = {
    option: PropTypes.object.isRequired,
    selectOption: PropTypes.func.isRequired,
  }

  public render() {
    const { option, selectOption }: any = this.props

    return (
      <div className="grid-x">
        <div className="cell small-10">
          {option.description}
        </div>

        <div className="cell auto option-select">
          <select
            id={option.name}
            value={option.value}
            onChange={(e) => selectOption(option, e)}
          >
            {option.values.map((value: string, i: number) => {
              return (
                <option value={value} key={i}>{value}</option>
              )
            })}
          </select>
        </div>
      </div>
    )
  }
}
