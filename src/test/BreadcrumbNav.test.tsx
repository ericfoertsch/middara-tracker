import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BreadcrumbNav } from '@/components/general/BreadcrumbNav'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <BreadcrumbNav />
    </MemoryRouter>
  )
}

test('shows Home at root path', () => {
  renderAt('/')
  expect(screen.getByText('Home')).toBeInTheDocument()
})

test('shows Home and Characters at /characters', () => {
  renderAt('/characters')
  expect(screen.getByText('Home')).toBeInTheDocument()
  expect(screen.getByText('Characters')).toBeInTheDocument()
})

test('shows Builds label at /builds', () => {
  renderAt('/builds')
  expect(screen.getByText('Builds')).toBeInTheDocument()
})

test('shows Campaigns label at /campaigns', () => {
  renderAt('/campaigns')
  expect(screen.getByText('Campaigns')).toBeInTheDocument()
})
