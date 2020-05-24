import React from 'react'
import {render, fireEvent, wait} from '@testing-library/react'
import {loadGreeting as mockLoadGreeting} from '../api'
import {GreetingLoader} from '../greeting-loader-01-mocking'

jest.mock('../api')

test('loads greeting message on click button', async () => {
  const greetingText = 'Hello There!'
  mockLoadGreeting.mockResolvedValueOnce({data: {greeting: greetingText}})
  const {getByLabelText, getByText} = render(<GreetingLoader />)
  const input = getByLabelText(/name/i)
  const button = getByText(/load greeting/i)
  //   input.value = 'Ashish'
  fireEvent.change(input, {target: {value: 'Ashish'}})
  fireEvent.click(button)
  expect(mockLoadGreeting).toHaveBeenCalledWith('Ashish')
  expect(mockLoadGreeting).toHaveBeenCalledTimes(1)
  await wait(() =>
    expect(getByLabelText(/greeting/i)).toHaveTextContent(greetingText),
  )
})
