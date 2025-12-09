'use client'
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";


export type Review = {
    id: string
    reviewer: string
    comment: string
    rating: number
}

export type Product = {
    id: string
    name: string
    reviews: Review[]
}

type IProductContext = {
    products: Product[]
    setProducts: Dispatch<SetStateAction<Product[]>>
    updateProducts: () => Promise<void>
    loading: boolean
    error: string | null
}



const ProductsContext = createContext<IProductContext>({} as IProductContext)


export const ProductContextProvider = ({children}:{children: ReactNode}) => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch('http://localhost:3000/products')
            
            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.statusText}`)
            }
            
            const data = await response.json()
            setProducts(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products'
            setError(errorMessage)
            console.error('Error fetching products:', err)
        } finally {
            setLoading(false)
        }
    }

    const updateProducts = async () => {
        await fetchData()
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <ProductsContext.Provider value={{products, setProducts, updateProducts, loading, error}}>
            {children}
        </ProductsContext.Provider>
    )
}

export const useProducts = () => {
    const context = useContext(ProductsContext)
    if (!context) {
        throw new Error('useProducts must be used within ProductContextProvider')
    }
    return context
}