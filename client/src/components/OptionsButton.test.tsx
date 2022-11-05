import React from 'react'
import { Provider } from 'react-redux'
import TestRenderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { ConnectedApp } from '../index';
import { restaurant } from '../store/initial/restaurant'
import { OptionsButton } from './OptionsButton';

// const middlewares = [thunk]
// const mockStore = configureMockStore(middlewares)

describe('OptionsButton component', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()

  beforeEach(() => {
  //   store = mockStore({
  //     restaurant,
  //   })

    testRenderer = TestRenderer.create(
      <OptionsButton
        dispatch={dispatch}
      ></OptionsButton>
    )
    testInstance = testRenderer.root;
  })

  it('properly renders the options button', () => {
    expect(() => testInstance.findByType(OptionsButton)).not.toThrow(Error)
  })
})
