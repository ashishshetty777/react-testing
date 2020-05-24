import React from 'react'
import {render} from '@testing-library/react'
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
  const {rerender} = render(
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
})
