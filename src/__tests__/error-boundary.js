import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {ErrorBoundary} from '../error-boundary'
import {reportError as mockReportError} from '../api'

jest.mock('../api')

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  console.error.mockRestore()
})

afterEach(() => {
  jest.clearAllMocks()
})

function Bomb({shouldThrow}) {
  if (shouldThrow) {
    throw new Error('🏹')
  } else {
    return null
  }
}

test('testing error boundary component', () => {
  mockReportError.mockResolvedValueOnce({success: true})
  const {rerender, getByText, getByRole, queryByRole, queryByText} = render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
  )

  rerender(
    <ErrorBoundary>
      <Bomb shouldThrow={true} />
    </ErrorBoundary>,
  )
  const error = expect.any(Error)
  const info = {componentStack: expect.stringContaining('Bomb')}
  expect(mockReportError).toHaveBeenCalledWith(error, info)
  expect(mockReportError).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledTimes(2) // Once by react dom as once by js dom
  expect(getByRole('alert').textContent).toMatchInlineSnapshot(
    `"There was a problem."`,
  )
  //clearing mocks
  mockReportError.mockClear()
  console.error.mockClear()

  rerender(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
  )

  fireEvent.click(getByText(/try again/i))
  expect(mockReportError).toHaveBeenCalledTimes(0)
  expect(queryByRole('alert')).not.toBeInTheDocument()
  expect(queryByText(/try again/i)).not.toBeInTheDocument()
})
