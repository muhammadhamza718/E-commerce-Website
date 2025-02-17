import ProductGrid from "@/components/ProductGrid";
import { searchProductsByName } from "@/sanity/lib/products/searchProductsByName";
import React from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    query: string;
  }>;
}) {
  const { query } = await searchParams;
  const products = await searchProductsByName(query);
  
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl">
          <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
            No results found for "{query}"
          </h1>
          <p className="text-lg text-gray-700 text-center">
            Try searching with different keywords.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
          Search results for "{query}"
        </h1>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
