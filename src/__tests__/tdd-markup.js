import React from 'react'
import {render, fireEvent, wait} from '@testing-library/react'
import {Redirect as MockRedirect} from 'react-router'
import {savePost as mockSavePost} from '../api'

import {Editor} from '../post-editor-04-router-redirect'

jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  }
})
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

test('renders a form with title, content, tags and a submit button', async () => {
  mockSavePost.mockResolvedValueOnce()
  const fakeUser = {id: 'id-1'}
  const fakePost = {
    title: 'Title Y',
    content: 'Content C',
    tags: ['tag1', 'tag2'],
    authorId: fakeUser.id,
  }
  const {getByLabelText, getByText} = render(<Editor user={fakeUser} />)

  getByLabelText(/title/i).value = fakePost.title
  getByLabelText(/content/i).value = fakePost.content
  getByLabelText(/tags/i).value = fakePost.tags.join(',')
  const submitButton = getByText(/submit/i)

  fireEvent.click(submitButton)
  expect(submitButton).toBeDisabled()
  expect(mockSavePost).toHaveBeenCalledTimes(1)
  expect(mockSavePost).toBeCalledWith(fakePost)

  await wait(() => expect(MockRedirect).toHaveBeenCalledWith({to: '/'}, {}))
})
