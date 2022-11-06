import React from 'react'
import TestRenderer from 'react-test-renderer';
import * as thunks from '../store/thunks/restaurant'
import { OptionsButton } from './OptionsButton';

describe('OptionsButton component', () => {
  let testRenderer: any
  let testInstance: any
  const dispatch: any = jest.fn()
  const toggleModalSpy: any = jest.spyOn(thunks, 'toggleModal')

  beforeEach(() => {
    testRenderer = TestRenderer.create(
      <OptionsButton
        dispatch={dispatch}
      ></OptionsButton>
    )
    testInstance = testRenderer.root;
  })

  it('properly renders the options button', () => {
    expect.assertions(1)
    expect(() => testInstance.findByType(OptionsButton)).not.toThrow(Error)
  })

  it('toggles the modal on click', () => {
    expect.assertions(2)
    testInstance.findByType('section').props.onClick()
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(toggleModalSpy).toHaveBeenCalledTimes(1)
  })
})
