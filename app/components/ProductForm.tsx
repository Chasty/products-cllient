'use client'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useProducts } from '../productContext'

type FormErrors = {
    productId?: string
    reviewer?: string
    rating?: string
    comment?: string
    submit?: string
}

export default function ProductReviewForm() {
    const { products, updateProducts } = useProducts()
    const [selectedProductId, setSelectedProductId] = useState<string>('')
    const [review, setReview] = useState({
        reviewer: '',
        rating: 0,
        comment: ''
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!selectedProductId) {
            newErrors.productId = 'Please select a product'
        }

        if (!review.reviewer.trim()) {
            newErrors.reviewer = 'Reviewer name is required'
        } else if (review.reviewer.trim().length < 2) {
            newErrors.reviewer = 'Reviewer name must be at least 2 characters'
        }

        if (!review.rating || review.rating < 1 || review.rating > 5) {
            newErrors.rating = 'Rating must be between 1 and 5'
        }

        if (!review.comment.trim()) {
            newErrors.comment = 'Comment is required'
        } else if (review.comment.trim().length < 10) {
            newErrors.comment = 'Comment must be at least 10 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitSuccess(false)

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)
        setErrors({})

        try {
            const response = await fetch(`http://localhost:3000/products/${selectedProductId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reviewer: review.reviewer.trim(),
                    rating: Number(review.rating),
                    comment: review.comment.trim()
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `Failed to submit review: ${response.statusText}`)
            }

            // Reset form
            setReview({
                reviewer: '',
                rating: 0,
                comment: ''
            })
            setSelectedProductId('')
            setSubmitSuccess(true)
            
            // Update products list
            await updateProducts()

            // Clear success message after 3 seconds
            setTimeout(() => setSubmitSuccess(false), 3000)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to submit review'
            setErrors({ submit: errorMessage })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        
        if (name === 'productId') {
            setSelectedProductId(value)
            // Clear product error when selection changes
            if (errors.productId) {
                setErrors({ ...errors, productId: undefined })
            }
        } else {
            setReview({
                ...review,
                [name]: name === 'rating' ? Number(value) : value
            })
            // Clear field error when user starts typing
            if (errors[name as keyof FormErrors]) {
                setErrors({ ...errors, [name]: undefined })
            }
        }
    }

    const selectedProduct = products.find(p => p.id === selectedProductId)

    return (
        <div className='w-full max-w-2xl mx-auto mb-8'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700'>
                <h2 className='text-2xl font-bold mb-6 text-gray-900 dark:text-white'>
                    Submit a Review
                </h2>

                <form onSubmit={handleSubmit} className='space-y-5'>
                    {/* Product Selection */}
                    <div>
                        <label htmlFor='productId' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Select Product <span className='text-red-500'>*</span>
                        </label>
                        <select
                            id='productId'
                            name='productId'
                            value={selectedProductId}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                errors.productId ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={isSubmitting}
                        >
                            <option value=''>-- Select a product --</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                        {errors.productId && (
                            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.productId}</p>
                        )}
                    </div>

                    {/* Reviewer Name */}
                    <div>
                        <label htmlFor='reviewer' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Your Name <span className='text-red-500'>*</span>
                        </label>
                        <input
                            id='reviewer'
                            name='reviewer'
                            type='text'
                            value={review.reviewer}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                errors.reviewer ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder='Enter your name'
                            disabled={isSubmitting}
                        />
                        {errors.reviewer && (
                            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.reviewer}</p>
                        )}
                    </div>

                    {/* Rating */}
                    <div>
                        <label htmlFor='rating' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Rating <span className='text-red-500'>*</span>
                        </label>
                        <div className='flex items-center gap-2'>
                            <input
                                id='rating'
                                name='rating'
                                type='number'
                                min='1'
                                max='5'
                                value={review.rating || ''}
                                onChange={handleInputChange}
                                className={`w-20 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                    errors.rating ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder='1-5'
                                disabled={isSubmitting}
                            />
                            <span className='text-sm text-gray-500 dark:text-gray-400'>
                                (1 = Poor, 5 = Excellent)
                            </span>
                        </div>
                        {errors.rating && (
                            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.rating}</p>
                        )}
                    </div>

                    {/* Comment */}
                    <div>
                        <label htmlFor='comment' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Your Review <span className='text-red-500'>*</span>
                        </label>
                        <textarea
                            id='comment'
                            name='comment'
                            value={review.comment}
                            onChange={handleInputChange}
                            rows={4}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                errors.comment ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder='Share your thoughts about this product...'
                            disabled={isSubmitting}
                        />
                        {errors.comment && (
                            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.comment}</p>
                        )}
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className='p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                            <p className='text-sm text-red-600 dark:text-red-400'>{errors.submit}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {submitSuccess && (
                        <div className='p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
                            <p className='text-sm text-green-600 dark:text-green-400'>
                                ✓ Review submitted successfully!
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type='submit'
                        disabled={isSubmitting || products.length === 0}
                        className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'
                    >
                        {isSubmitting ? (
                            <>
                                <svg className='animate-spin h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            'Submit Review'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
