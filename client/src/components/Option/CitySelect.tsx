import * as React from 'react'
import PropTypes from 'prop-types'

export class CitySelect extends React.Component {
  static propTypes = {
    option: PropTypes.object.isRequired,
    selectCity: PropTypes.func.isRequired,
  }

  public render(): React.ReactNode {
    const { option, selectCity }: any = this.props

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
            onChange={(e) => selectCity(option, e)}
          >
            {!!option.values && option.values.map(({ id, name }: { id: string, name: string }, i: number) => {
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
