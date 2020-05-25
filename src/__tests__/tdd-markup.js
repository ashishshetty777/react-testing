import React from 'react'
import {render, fireEvent, wait} from '@testing-library/react'
import {Redirect as MockRedirect} from 'react-router'
import {build, fake, sequence} from 'test-data-bot'
import {savePost as mockSavePost} from '../api'

import {Editor} from '../post-editor-07-error-state'

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

const postBuilder = build('Post').fields({
  title: fake(f => f.lorem.words()),
  content: fake(f => f.lorem.paragraphs().replace(/\r/g, '')),
  tags: fake(f => [f.lorem.word(), f.lorem.word(), f.lorem.word()]),
})

const userBuilder = build('User').fields({
  id: sequence(s => `user=${s}`),
})

test('renders a form with title, content, tags and a submit button', async () => {
  mockSavePost.mockResolvedValueOnce()
  const fakeUser = userBuilder()
  const fakePost = postBuilder({content: `I'm an important content`})
  fakePost.authorId = fakeUser.id
  fakePost.date = expect.any(String)

  const {getByLabelText, getByText} = render(<Editor user={fakeUser} />)
  const preDate = new Date().getTime()
  getByLabelText(/title/i).value = fakePost.title
  getByLabelText(/content/i).value = fakePost.content
  getByLabelText(/tags/i).value = fakePost.tags.join(',')
  const submitButton = getByText(/submit/i)

  fireEvent.click(submitButton)
  expect(submitButton).toBeDisabled()
  expect(mockSavePost).toHaveBeenCalledTimes(1)
  expect(mockSavePost).toBeCalledWith(fakePost)

  const postDate = new Date().getTime()
  const date = new Date(mockSavePost.mock.calls[0][0].date).getTime()
  expect(date).toBeGreaterThanOrEqual(preDate)
  expect(date).toBeLessThan(postDate)

  await wait(() => expect(MockRedirect).toHaveBeenCalledWith({to: '/'}, {}))
})

test('renders an error message when the API throws an error', async () => {
  const errorMessage = 'An error appeared'
  mockSavePost.mockRejectedValueOnce({data: {error: errorMessage}})
  const fakeUser = userBuilder()
  const fakePost = postBuilder({content: `I'm an important content`})
  fakePost.authorId = fakeUser.id
  fakePost.date = expect.any(String)

  const {getByText, findByRole} = render(<Editor user={fakeUser} />)
  const submitButton = getByText(/submit/i)

  fireEvent.click(submitButton)
  const postError = await findByRole('alert')
  expect(postError).toHaveTextContent('An error appeared')
  expect(submitButton).not.toBeDisabled()
})
