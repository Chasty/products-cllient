import { ProductContextProvider } from "./productContext";
import ProductsList from "./components/ProductsList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <ProductContextProvider>
          <ProductsList />
        </ProductContextProvider>
      </main>
    </div>
  );
}
