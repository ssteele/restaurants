import * as React from 'react'
import { connect } from 'react-redux'

import PropTypes from 'prop-types'
import {
  asyncFetchRestaurants,
  asyncPickRandom,
} from '../store/actions/restaurant'

import '../css/Restaurant.css'

interface IRestaurant {
  id?: number
  name?: string
  sub_name?: string
  site?: string
  organic?: boolean
  vegetarian?: boolean
  vegan?: boolean
  keto?: boolean
  harvi?: []
  zip?: []
  enabled?: boolean
  deleted?: boolean
  created_at?: string
  updated_at?: string
}

class Restaurant extends React.Component<IRestaurant> {
  static propTypes = {
    chosen: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    error: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  }

  public componentDidMount() {
    const { dispatch }: any = this.props
    dispatch(asyncFetchRestaurants())
  }

  public pickRandom = () => {
    const { dispatch }: any = this.props
    dispatch(asyncPickRandom())
  }

  public render() {
    const { chosen, count, error }: any = this.props
    return (
      <div>
        <div className="restaurant">
          <div className="name">{chosen.name}</div>
          <div className="sub-name">{chosen.sub_name}</div>
          <div className="error">{error.message}</div>
        </div>

        <div className="button-group options">
          <input
            id="organic"
            type="checkbox"
          />
          <label
            className="button"
            htmlFor="organic"
          >Organic</label>

          <input
            id="local"
            type="checkbox"
          />
          <label
            className="button"
            htmlFor="local"
          >Local</label>
        </div>

        <div className="picker">
          <button
            className="button"
            onClick={this.pickRandom}
          >Pick from {count}</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: any) {
  const { chosen, filteredCount: count, error } = state.restaurant
  return {
    chosen,
    count,
    error,
  }
}

export default connect(mapStateToProps)(Restaurant as any)
