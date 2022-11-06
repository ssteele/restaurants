import React from 'react'
import { Provider } from 'react-redux'
import TestRenderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { ConnectedApp } from '../index';
import { restaurantStore } from '../store/initial/restaurantStore'
import { App } from './App';
import { GeolocationButton } from './GeolocationButton';
import { Navigation } from './Navigation';
import { OptionsButton } from './OptionsButton';
import { OptionsModal } from './OptionsModal';
import { Restaurant } from './Restaurant';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('App component', () => {
  let store: any
  let testRenderer: any
  let testInstance: any

  beforeEach(() => {
    store = mockStore({
      restaurantStore,
    })

    testRenderer = TestRenderer.create(
      <Provider store={store}>
        <ConnectedApp />
      </Provider>
    )
    testInstance = testRenderer.root;
  })

  it('properly renders the expected page', () => {
    expect.assertions(1)
    expect(() => testInstance.findByType(App)).not.toThrow(Error)
  })

  it('properly loads the options modal', () => {
    expect.assertions(3)
    expect(() => testInstance.findByType(OptionsModal)).not.toThrow(Error)
    const optionsModal = testInstance.findByType(OptionsModal)
    expect(optionsModal.props.modalIsOpen).toBe(false)
    expect(optionsModal.props.filteredCount).toBe(0)
  })

  it('properly loads the geolocation button', () => {
    expect.assertions(2)
    expect(() => testInstance.findByType(GeolocationButton)).not.toThrow(Error)
    const geolocationButton = testInstance.findByType(GeolocationButton)
    expect(geolocationButton.props.geolocation.isGeolocating).toBe(false);
  })

  it('properly loads the options button', () => {
    expect.assertions(1)
    expect(() => testInstance.findByType(OptionsButton)).not.toThrow(Error)
  })

  it('properly loads the restaurant section', () => {
    expect.assertions(5)
    expect(() => testInstance.findByType(Restaurant)).not.toThrow(Error)
    const restaurantComponent = testInstance.findByType(Restaurant)
    expect(restaurantComponent.props.current).toBe(null);
    expect(restaurantComponent.props.error).toEqual({});
    expect(restaurantComponent.props.isLoading).toBe(false);
    expect(restaurantComponent.props.restaurants).toBe(null);
  })

  it('properly loads restaurant navigation', () => {
    expect(() => testInstance.findByType(Navigation)).not.toThrow(Error)
    const navigation = testInstance.findByType(Navigation)
    expect(navigation.props.filteredCount).toBe(0);
    expect.assertions(2)
  })
})
