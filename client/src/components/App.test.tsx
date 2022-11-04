import React from 'react'
import { Provider } from 'react-redux'
import TestRenderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { ConnectedApp } from '../index';
import { restaurant } from '../store/initial/restaurant'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('App component', () => {
  let store
  let testRenderer: any

  beforeEach(() => {
    store = mockStore({
      restaurant,
    })

    testRenderer = TestRenderer.create(
      <Provider store={store}>
        <ConnectedApp />
      </Provider>
    );
  })

  it('connects and renders with initial store', () => {
    expect(testRenderer.toJSON()).toMatchSnapshot();
  })
})
