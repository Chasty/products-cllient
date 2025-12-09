import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import ProductsList from '../ProductsList'
import { ProductContextProvider } from '../../productContext'

// Mock fetch
global.fetch = jest.fn()

const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    reviews: [
      {
        id: 'r1',
        reviewer: 'John Doe',
        comment: 'Great product!',
        rating: 5
      },
      {
        id: 'r2',
        reviewer: 'Jane Smith',
        comment: 'Not bad, but could be better.',
        rating: 3
      }
    ]
  },
  {
    id: '2',
    name: 'Test Product 2',
    reviews: []
  }
]

describe('ProductsList', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear()
  })

  it('displays loading state initially', () => {
    ;(fetch as jest.Mock).mockImplementation(
      () =>
        new Promise(() => {
          // Never resolve to keep loading state
        })
    )

    render(
      <ProductContextProvider>
        <ProductsList />
      </ProductContextProvider>
    )

    expect(screen.getByText(/loading products/i)).toBeInTheDocument()
  })

  it('displays error message when fetch fails', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(
      <ProductContextProvider>
        <ProductsList />
      </ProductContextProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/error loading products/i)).toBeInTheDocument()
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
  })

  it('displays empty state when no products are available', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    render(
      <ProductContextProvider>
        <ProductsList />
      </ProductContextProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/no products found/i)).toBeInTheDocument()
    })
  })

  it('displays products with reviews correctly', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    })

    render(
      <ProductContextProvider>
        <ProductsList />
      </ProductContextProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument()
      expect(screen.getByText('Test Product 2')).toBeInTheDocument()
    })

    // Check reviews are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Great product!')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Not bad, but could be better.')).toBeInTheDocument()

    // Check review count
    expect(screen.getByText(/reviews \(2\)/i)).toBeInTheDocument()
    expect(screen.getByText(/reviews \(0\)/i)).toBeInTheDocument()
  })

  it('displays average rating for products with reviews', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    })

    render(
      <ProductContextProvider>
        <ProductsList />
      </ProductContextProvider>
    )

    await waitFor(() => {
      // Average of ratings 5 and 3 is 4.0
      expect(screen.getByText(/avg: 4\.0/i)).toBeInTheDocument()
    })
  })

  it('displays "No reviews yet" for products without reviews', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    })

    render(
      <ProductContextProvider>
        <ProductsList />
      </ProductContextProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument()
    })
  })
})

