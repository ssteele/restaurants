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

    return !!option && (
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
            {!!option.values && option.values.map(({id: zip, name}: any, i: number) => {
              return (
                <option value={zip} key={i}>{zip} - {name}</option>
              )
            })}
          </select>
        </div>
      </div>
    )
  }
}