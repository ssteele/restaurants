import * as React from 'react'
import { connect } from 'react-redux'

import PropTypes from 'prop-types'
import {
  fetchRestaurants,
  chooseRestaurant,
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
    filtered: PropTypes.array.isRequired,
    chosen: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  public componentDidMount() {
    const { dispatch }: any = this.props
    dispatch(fetchRestaurants())
  }

  public render() {
    const { chosen }: any = this.props
    return (
      <div>
        <div className="restaurant">
          <div className="name">{chosen.name}</div>
          <div className="sub-name">{chosen.sub_name}</div>
        </div>

        <div>
          <button className="button" onClick={this.pickRandom}>Pick</button>
        </div>
      </div>
    )
  }

  public getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max))
  }

  public pickRandom = () => {
    const { filtered, dispatch }: any = this.props
    const index = this.getRandomInt(filtered.length)
    dispatch(chooseRestaurant(filtered[index]))
  }
}

function mapStateToProps(state: any) {
  // @todo: write `filtered` functionality in store and remove it here
  const { filtered, chosen } = state.restaurant
  return {
    filtered,
    chosen,
  }
}

export default connect(mapStateToProps)(Restaurant as any)
