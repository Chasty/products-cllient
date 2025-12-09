'use client'
import { useProducts } from '../productContext'
import ProductReviewForm from './ProductForm'

const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className='flex items-center gap-1'>
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-5 h-5 ${
                        star <= rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                    }`}
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
            ))}
            <span className='ml-2 text-sm text-gray-600 dark:text-gray-400'>({rating}/5)</span>
        </div>
    )
}

const LoadingSpinner = () => {
    return (
        <div className='flex items-center justify-center py-12'>
            <div className='flex flex-col items-center gap-4'>
                <svg className='animate-spin h-12 w-12 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
                <p className='text-gray-600 dark:text-gray-400'>Loading products...</p>
            </div>
        </div>
    )
}

const ProductsList = () => {
    const { products, loading, error } = useProducts()

    if (loading) {
        return <LoadingSpinner />
    }

    if (error) {
        return (
            <div className='w-full max-w-3xl mx-auto'>
                <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6'>
                    <div className='flex items-center gap-3'>
                        <svg className='w-6 h-6 text-red-600 dark:text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        <div>
                            <h3 className='text-lg font-semibold text-red-800 dark:text-red-300'>Error Loading Products</h3>
                            <p className='text-red-600 dark:text-red-400 mt-1'>{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className='w-full max-w-3xl mx-auto'>
                <ProductReviewForm />
                <div className='bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center'>
                    <svg className='w-16 h-16 text-gray-400 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
                    </svg>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>No Products Found</h3>
                    <p className='text-gray-600 dark:text-gray-400'>There are no products available at the moment.</p>
                </div>
            </div>
        )
    }

    return (
        <div className='w-full max-w-6xl mx-auto px-4'>
            <ProductReviewForm />

            <div className='mt-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>Products</h2>
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className='bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden'
                        >
                            <div className='p-6'>
                                <div className='mb-4'>
                                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-1'>
                                        {product.name}
                                    </h3>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>ID: {product.id}</p>
                                </div>

                                <div className='border-t border-gray-200 dark:border-gray-700 pt-4 mt-4'>
                                    <div className='flex items-center justify-between mb-4'>
                                        <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                            Reviews ({product.reviews.length})
                                        </h4>
                                        {product.reviews.length > 0 && (
                                            <div className='text-sm text-gray-500 dark:text-gray-400'>
                                                Avg: {(
                                                    product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                                                    product.reviews.length
                                                ).toFixed(1)}
                                            </div>
                                        )}
                                    </div>

                                    {product.reviews.length === 0 ? (
                                        <div className='text-center py-6 text-gray-500 dark:text-gray-400'>
                                            <svg className='w-12 h-12 mx-auto mb-2 opacity-50' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' />
                                            </svg>
                                            <p className='text-sm'>No reviews yet</p>
                                        </div>
                                    ) : (
                                        <div className='space-y-4 max-h-96 overflow-y-auto'>
                                            {product.reviews.map((review) => (
                                                <div
                                                    key={`${product.id}-${review.id}`}
                                                    className='bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600'
                                                >
                                                    <div className='flex items-start justify-between mb-2'>
                                                        <div className='flex-1'>
                                                            <p className='font-semibold text-gray-900 dark:text-white text-sm'>
                                                                {review.reviewer}
                                                            </p>
                                                            <StarRating rating={review.rating} />
                                                        </div>
                                                    </div>
                                                    <p className='text-gray-700 dark:text-gray-300 text-sm mt-2 leading-relaxed'>
                                                        {review.comment}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProductsList
