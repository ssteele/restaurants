import React from 'react'
import { Provider } from 'react-redux'
import TestRenderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { ConnectedApp } from '../index';
import { restaurant } from '../store/initial/restaurant'
import { App } from './App';
import { GeolocationButton } from './GeolocationButton';
import { OptionsButton } from './OptionsButton';
import { OptionsModal } from './OptionsModal';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('App component', () => {
  let store: any
  let testRenderer: any
  let testInstance: any

  beforeEach(() => {
    store = mockStore({
      restaurant,
    })

    testRenderer = TestRenderer.create(
      <Provider store={store}>
        <ConnectedApp />
      </Provider>
    )
    testInstance = testRenderer.root;
  })

  it('properly renders the expected page', () => {
    expect(() => testInstance.findByType(App)).toBeTruthy()
    expect(testRenderer.toJSON()).toMatchSnapshot()
  })

  it('properly loads the options modal', () => {
    expect(() => testInstance.findByType(OptionsModal)).toBeTruthy()
    const optionsModal = testInstance.findByType(OptionsModal)
    expect(optionsModal.props.modalIsOpen).toBe(false)
    expect(optionsModal.props.filteredCount).toBe(0)
  })

  it('properly loads the geolocation button', () => {
    expect(() => testInstance.findByType(GeolocationButton)).toBeTruthy()
    const geolocationButton = testInstance.findByType(GeolocationButton)
    expect(geolocationButton.props.geolocation.isGeolocating).toBe(false);
  })

  it('properly loads the options button', () => {
    expect(() => testInstance.findByType(OptionsButton)).toBeTruthy()
  })
})
