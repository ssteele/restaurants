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
            {restaurants[current]?.name &&
              <section className="restaurant-name">
                <a
                  data-id="restaurant-link"
                  href={restaurants[current]?.menu}
                  rel="noopener noreferrer"
                  target="_blank"
                >{restaurants[current]?.name}</a>
              </section>
            }

            {restaurants[current]?.sub_name &&
              <section>
                <span
                  className="restaurant-sub-name"
                  data-id="restaurant-sub-name"
                >{restaurants[current]?.sub_name}</span>
              </section>
            }

            {restaurants[current]?.kids?.length > 0 &&
              <section className="restaurant-kids">
                <i className="fa fa-child fa-fw"></i>
                <span data-id="restaurant-kids-text">
                  {restaurants[current]?.kids?.join(', ')}
                </span>
              </section>
            }

            {error.message &&
              <section>
                <span
                  className="error"
                  data-id="restaurant-error-message"
                >{error.message}</span>
              </section>
            }
          </section>
        )}

        {!(current && Object.keys(restaurants).length) && (
          <section className="restaurant">
            <span
              className="restaurant-name subtle"
              data-id="no-restaurants"
            >
              {isLoading ? 'Loading...' : 'Nope :('}
            </span>
          </section>
        )}
      </section>
    )
  }
}
