import React from 'react'
import { Provider } from 'react-redux'
import TestRenderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { ConnectedApp } from '../index';
import { restaurant } from '../store/initial/restaurant'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('', () => {
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

  it('renders without crashing', () => {
    expect(testRenderer.toJSON()).toMatchSnapshot();
  })
})
