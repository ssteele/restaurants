import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Modal from 'react-modal'
import { connect, Provider } from 'react-redux'
import {
  compose,
  createStore,
  applyMiddleware
} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { App } from './components/App'
import { IRestaurantStore } from './models/RestaurantStore'
import * as serviceWorker from './serviceWorker'
import { rootReducer } from './store/reducers/restaurant'
import '../node_modules/foundation-sites/dist/css/foundation.min.css'
import '../node_modules/font-awesome/css/font-awesome.min.css'
import './css/index.css'

const composeEnhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const loggerMiddleware = createLogger()

const store = createStore(
  rootReducer,
  composeEnhancer(
    applyMiddleware(
      thunkMiddleware,                                              // lets us dispatch() functions
      loggerMiddleware,                                             // middleware that logs actions
    )
  )
)

const mapRestaurantStateToProps = (
  { restaurantStore }: { restaurantStore: IRestaurantStore },
) => {
  const {
    current,
    error,
    filteredCount,
    geolocation,
    isLoading,
    modalIsOpen,
    options,
    restaurants,
  } = restaurantStore

  return {
    current,
    error,
    filteredCount,
    geolocation,
    isLoading,
    modalIsOpen,
    options,
    restaurants,
  }
}
export const ConnectedApp = connect(mapRestaurantStateToProps)(App as any)

const root = document.getElementById('root') || document.createElement('div')
ReactDOM
  .createRoot(root as HTMLElement)
  .render(
    <Provider store={store}>
      <ConnectedApp />
    </Provider>,
  )

Modal.setAppElement(root)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
