import * as React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
  asyncFetchRestaurants,
  asyncGetOptionsFromLocalStorage,
  asyncToggleOption,
  asyncPickRandom,
} from '../store/actions/restaurant'

import '../css/Restaurant.css'

interface IRestaurant {
  id?: number
  name?: string
  sub_name?: string
  site?: string
  menu?: string
  organic?: boolean
  vegetarian?: boolean
  vegan?: boolean
  local?: boolean
  keto?: boolean
  outdoor?: boolean
  harvi?: []
  zip?: []
  enabled?: boolean
  deleted?: boolean
  created_at?: string
  updated_at?: string
}

class Restaurant extends React.Component<IRestaurant> {
  static propTypes = {
    options: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    chosen: PropTypes.object.isRequired,
    error: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  }

  public componentDidMount() {
    const { dispatch }: any = this.props
    dispatch(asyncGetOptionsFromLocalStorage())
    dispatch(asyncFetchRestaurants())
  }

  public toggleOption = (option: any, e: any) => {
    const { dispatch }: any = this.props
    dispatch(asyncToggleOption(option))
  }

  public pickRandom = () => {
    const { dispatch }: any = this.props
    dispatch(asyncPickRandom())
  }

  public capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  public render() {
    const { options, count, chosen, error }: any = this.props
    return (
      <div>
        <div className="restaurant">
          <div className="name">{chosen.name}</div>
          <div className="sub-name">{chosen.sub_name}</div>
          <div className="error">{error.message}</div>
        </div>

        <div className="button-group options">
          {options.map((option: any, i: any) => {
            return <span key={i}>
                <input
                  id={option.name}
                  type="checkbox"
                  checked={option.isChecked}
                  onChange={(e) => this.toggleOption(option, e)}
                />
                <label
                  className="button"
                  htmlFor={option.name}
                >{this.capitalizeFirstLetter(option.name)}</label>
              </span>
          })}
        </div>

        <div className="picker">
          <button
            className="button"
            onClick={this.pickRandom}
            disabled={!count}
          >Pick from {count}</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: any) {
  const { options, filteredCount: count, chosen, error } = state.restaurant
  return {
    options,
    count,
    chosen,
    error,
  }
}

export default connect(mapStateToProps)(Restaurant as any)
