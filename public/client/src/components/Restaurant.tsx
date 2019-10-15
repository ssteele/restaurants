import * as React from 'react'
import { connect } from 'react-redux'

import PropTypes from 'prop-types'
import { fetchRestaurants } from '../store/actions/restaurant'

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

interface IState {
  chosen: IRestaurant,
}

class Restaurant extends React.Component<IRestaurant, IState> {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    list: PropTypes.array,
  }

  public state: any = {
    chosen: {},
  }

  constructor(props: any) {
    super(props)
  }

  public componentDidMount() {
    const { dispatch }: any = this.props
    dispatch(fetchRestaurants())
  }

  public render() {
    return (
      <div>
        <div className="restaurant">
          <div className="name">{this.state.chosen.name}</div>
          <div className="sub-name">{this.state.chosen.sub_name}</div>
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
    const { filtered }: any = this.props
    const index = this.getRandomInt(filtered.length)
    const chosen = filtered[index]
    this.setState({ chosen })
  }
}

function mapStateToProps(state: any) {
  const { isLoading, list: all } = state.restaurant
  const filtered = all
  return {
    isLoading,
    all,
    filtered,
  }
}

export default connect(mapStateToProps)(Restaurant as any)
