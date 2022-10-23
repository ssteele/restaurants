import * as React from 'react'
import PropTypes from 'prop-types'
import '../css/Restaurant.css'

export class Restaurant extends React.Component {
  static propTypes = {
    current: PropTypes.number,
    error: PropTypes.object,
    isLoading: PropTypes.bool,
    restaurants: PropTypes.object,
  }

  public render(): React.ReactNode {
    const {
      current,
      error,
      isLoading,
      restaurants,
    }: any = this.props

    return (
      <section>
        {current && (
          <section className="restaurant">
            {restaurants[current].name &&
              <section className="restaurant-name">
                <a
                  href={restaurants[current].menu}
                  target="_blank"
                  rel="noopener noreferrer"
                >{restaurants[current].name}</a>
              </section>
            }

            {restaurants[current].sub_name &&
              <section>
                <span className="restaurant-sub-name">{restaurants[current].sub_name}</span>
              </section>
            }

            {restaurants[current].kids.length > 0 &&
              <section className="restaurant-kids">
                <i className="fa fa-child fa-fw"></i>
                {restaurants[current].kids.join(', ')}
              </section>
            }

            {error.message &&
              <section>
                <span className="error">{error.message}</span>
              </section>
            }
          </section>
        )}

        {!current && (
          <section className="restaurant">
            <span className="restaurant-name subtle">
              {isLoading ? 'Loading...' : 'Nope :('}
            </span>
          </section>
        )}
      </section>
    )
  }
}
