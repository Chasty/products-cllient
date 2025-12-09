import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductReviewForm from '../ProductForm'
import { ProductContextProvider } from '../../productContext'

// Mock fetch
global.fetch = jest.fn()

const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    reviews: []
  },
  {
    id: '2',
    name: 'Test Product 2',
    reviews: []
  }
]

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ProductContextProvider>
      {component}
    </ProductContextProvider>
  )
}

describe('ProductReviewForm', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear()
    // Mock initial products fetch
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    })
  })

  it('renders form fields correctly', async () => {
    renderWithProvider(<ProductReviewForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/select product/i)).toBeInTheDocument()
    })

    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/rating/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/your review/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit review/i })).toBeInTheDocument()
  })

  it('displays validation errors when form is submitted empty', async () => {
    const user = userEvent.setup()
    renderWithProvider(<ProductReviewForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/select product/i)).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /submit review/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please select a product/i)).toBeInTheDocument()
      expect(screen.getByText(/reviewer name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/rating must be between 1 and 5/i)).toBeInTheDocument()
      expect(screen.getByText(/comment is required/i)).toBeInTheDocument()
    })
  })

  it('validates reviewer name minimum length', async () => {
    const user = userEvent.setup()
    renderWithProvider(<ProductReviewForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/select product/i)).toBeInTheDocument()
    })

    const reviewerInput = screen.getByLabelText(/your name/i)
    await user.type(reviewerInput, 'A')

    const submitButton = screen.getByRole('button', { name: /submit review/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/reviewer name must be at least 2 characters/i)).toBeInTheDocument()
    })
  })

  it('validates comment minimum length', async () => {
    const user = userEvent.setup()
    renderWithProvider(<ProductReviewForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/select product/i)).toBeInTheDocument()
    })

    const commentInput = screen.getByLabelText(/your review/i)
    await user.type(commentInput, 'Short')

    const submitButton = screen.getByRole('button', { name: /submit review/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/comment must be at least 10 characters/i)).toBeInTheDocument()
    })
  })

  it('validates rating range', async () => {
    const user = userEvent.setup()
    renderWithProvider(<ProductReviewForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/select product/i)).toBeInTheDocument()
    })

    const ratingInput = screen.getByLabelText(/rating/i)
    await user.type(ratingInput, '6')

    const submitButton = screen.getByRole('button', { name: /submit review/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/rating must be between 1 and 5/i)).toBeInTheDocument()
    })
  })

  it('submits form successfully with valid data', async () => {
    const user = userEvent.setup()
    
    // Mock successful submission
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    renderWithProvider(<ProductReviewForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/select product/i)).toBeInTheDocument()
    })

    // Fill in the form
    const productSelect = screen.getByLabelText(/select product/i)
    await user.selectOptions(productSelect, '1')

    const reviewerInput = screen.getByLabelText(/your name/i)
    await user.type(reviewerInput, 'John Doe')

    const ratingInput = screen.getByLabelText(/rating/i)
    await user.type(ratingInput, '5')

    const commentInput = screen.getByLabelText(/your review/i)
    await user.type(commentInput, 'This is a great product! I love it.')

    const submitButton = screen.getByRole('button', { name: /submit review/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/1/review',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reviewer: 'John Doe',
            rating: 5,
            comment: 'This is a great product! I love it.',
          }),
        })
      )
    })

    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/review submitted successfully/i)).toBeInTheDocument()
    })
  })

  it('displays error message on submission failure', async () => {
    const user = userEvent.setup()
    
    // Mock failed submission
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
      json: async () => ({ message: 'Server error occurred' }),
    })

    renderWithProvider(<ProductReviewForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/select product/i)).toBeInTheDocument()
    })

    // Fill in the form
    const productSelect = screen.getByLabelText(/select product/i)
    await user.selectOptions(productSelect, '1')

    const reviewerInput = screen.getByLabelText(/your name/i)
    await user.type(reviewerInput, 'John Doe')

    const ratingInput = screen.getByLabelText(/rating/i)
    await user.type(ratingInput, '5')

    const commentInput = screen.getByLabelText(/your review/i)
    await user.type(commentInput, 'This is a great product! I love it.')

    const submitButton = screen.getByRole('button', { name: /submit review/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/server error occurred/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    
    // Mock delayed response
    ;(fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ success: true }),
              }),
            100
          )
        )
    )

    renderWithProvider(<ProductReviewForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/select product/i)).toBeInTheDocument()
    })

    // Fill in the form
    const productSelect = screen.getByLabelText(/select product/i)
    await user.selectOptions(productSelect, '1')

    const reviewerInput = screen.getByLabelText(/your name/i)
    await user.type(reviewerInput, 'John Doe')

    const ratingInput = screen.getByLabelText(/rating/i)
    await user.type(ratingInput, '5')

    const commentInput = screen.getByLabelText(/your review/i)
    await user.type(commentInput, 'This is a great product! I love it.')

    const submitButton = screen.getByRole('button', { name: /submit review/i })
    await user.click(submitButton)

    // Check for loading state
    expect(screen.getByText(/submitting/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })
})

