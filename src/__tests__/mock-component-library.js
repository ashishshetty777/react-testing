import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {HiddenMessage} from '../hidden-message'

jest.mock('react-transition-group', () => {
  return {
    CSSTransition: props => (props.in ? props.children : null),
  }
})

test('message shows and hides on button click', () => {
  const textMessage = 'Show and Hide me!'
  const {getByText, queryByText} = render(
    <HiddenMessage>{textMessage}</HiddenMessage>,
  )
  const button = getByText(/toggle/i)
  expect(queryByText(textMessage)).not.toBeInTheDocument()
  fireEvent.click(button)
  expect(getByText(textMessage)).toBeInTheDocument()
  fireEvent.click(button)
  expect(queryByText(textMessage)).not.toBeInTheDocument()
})
