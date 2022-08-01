import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import Image from './Image'
import {
  mockIntersectionObserver,
  MockViewport,
  mockViewport
} from 'jsdom-testing-mocks'
import { act } from 'react-dom/test-utils'
import { matchers } from '@emotion/jest'

const intersectionObserver = mockIntersectionObserver()
let viewport: MockViewport

expect.extend(matchers)

beforeEach(() => {
  viewport = mockViewport({ width: '1024px', height: '648px' })
})

afterEach(() => {
  viewport.cleanup()
})

test('Image loads grey rectangle + spinner to begin with, img is not shown', async () => {
  render(<Image />)
  const figure = screen.getByRole('figure')
  expect(figure).toBeDefined()
  expect(figure.getElementsByClassName('spinner-container')).toBeDefined()
  expect(figure.querySelector('img')).not.toBeInTheDocument()
})

test('Custom spinner is used if props loadingIcon are given', () => {
  render(<Image loadingIcon={<div>Loading...</div>} />)
  expect(screen.getByText('Loading...')).toBeInTheDocument()
})

test('Given height and width props sets Image size', () => {
  render(<Image width={'100px'} height={'50px'} />)
  const figure = screen.getByRole('figure')
  expect(figure).toHaveStyleRule('height', '50px')
  expect(figure).toHaveStyleRule('width', '100px')
})

test('Image loads when it comes into view', () => {
  render(<Image src={'some-image.jpg'} />)
  const figure = screen.getByRole('figure')
  act(() => {
    intersectionObserver.enterNode(figure)
  })
  const img = figure.querySelector('img')
  expect(img).toBeDefined()
  if (img) {
    fireEvent.load(img)
    expect(figure.getElementsByClassName('spinner-container').length).toBe(0)
  }
})
