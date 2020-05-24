import React from 'react'
import user from '@testing-library/user-event'
import {render, fireEvent, wait} from '@testing-library/react'
import {GreetingLoader} from '../greeting-loader-02-dependency-injection'

test('loads greeting text when submit button is clicked', async () => {
  const greetingText = 'Aata maajhi Satakli'
  const mockLoadGreeting = jest.fn()
  mockLoadGreeting.mockResolvedValueOnce({data: {greeting: greetingText}})
  const {getByLabelText, getByText} = render(
    <GreetingLoader loadGreeting={mockLoadGreeting} />,
  )
  const greetingInput = getByLabelText(/name/i)
  const greetingButton = getByText(/load greeting/i)
  user.type(greetingInput, 'Welcome Singham!')
  fireEvent.click(greetingButton)
  expect(mockLoadGreeting).toHaveBeenCalledWith('Welcome Singham!')
  expect(mockLoadGreeting).toHaveBeenCalledTimes(1)
  await wait(() =>
    expect(getByLabelText(/greeting/i)).toHaveTextContent(greetingText),
  )
})
