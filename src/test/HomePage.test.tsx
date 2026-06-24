import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'

test('renders MiddaraTracker heading', () => {
  render(<MemoryRouter><HomePage /></MemoryRouter>)
  expect(screen.getByRole('heading', { name: /middara tracker/i })).toBeInTheDocument()
})
