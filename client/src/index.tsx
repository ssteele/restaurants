import 'babel-polyfill'
import React from 'react'
import ReactDOM from "react-dom/client";
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import {
  compose,
  createStore,
  applyMiddleware
} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Base } from './components/Base'
import * as serviceWorker from './serviceWorker'
import { rootReducer } from './store/reducers/restaurant'
import './css/index.css'

const composeEnhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const loggerMiddleware = createLogger()

const store = createStore(
  rootReducer,
  composeEnhancer(
    applyMiddleware(
      thunkMiddleware, // lets us dispatch() functions
      loggerMiddleware // middleware that logs actions
    )
  )
)

const rootElement = document.getElementById('root')

// const rootElement = document.getElementById('root')
const rootElement = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
rootElement.render(
  <Provider store={store}>
    <Base />
  </Provider>,
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
