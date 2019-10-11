import * as React from 'react';

interface IRestaurant {
  id?: number;
  name?: string;
  sub_name?: string;
  site?: string;
  organic?: boolean;
  vegetarian?: boolean;
  vegan?: boolean;
  keto?: boolean;
  harvi?: [];
  zip?: [];
  enabled?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface IState {
  restaurants: IRestaurant[],
  filteredRestaurants: IRestaurant[],
  restaurant: IRestaurant,
}

class Restaurant extends React.Component<IRestaurant, IState> {
  public state: IState = {
    restaurants: [],
    filteredRestaurants: [],
    restaurant: {},
  };

  public getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  public pickRandom = () => {
    const index = this.getRandomInt(this.state.filteredRestaurants.length)
    const restaurant = this.state.filteredRestaurants[index];
    this.setState({ restaurant });
  };

  public getRestaurants() {
    fetch('http://shs.restaurants.com:8888/api/')
    .then(res => res.json())
    .then((data) => {
      this.setState({
        restaurants: data,
        filteredRestaurants: data,
      });
      this.pickRandom()
    })
    .catch(console.log)
  }

  public componentDidMount() {
    this.getRestaurants();
  }

  public render() {
    return (
      <div>
        <div className="restaurant">
          <div>{this.state.restaurant.name}</div>
          <div>{this.state.restaurant.sub_name}</div>
        </div>

        <div>
          <button onClick={this.pickRandom}>Pick Random</button>
        </div>
      </div>
    );
  }
}

export default Restaurant;
