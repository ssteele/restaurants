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

    return !!option && option.rendered && (
      <section className="grid-x">
        <section className="cell small-8">
          {option.description}
        </section>

        <section className="cell auto option-select">
          <select
            disabled={option.disabled}
            id={option.name}
            value={option.value}
            onChange={(e) => selectOption(option, e)}
          >
            {!!option.values && option.values.map(({id, name}: any, i: number) => {
              return (
                <option value={id} key={i}>{name}</option>
              )
            })}
          </select>
        </section>
      </section>
    )
  }
}
