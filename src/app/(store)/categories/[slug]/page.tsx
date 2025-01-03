import ProductsView from "@/components/productView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getProductsByCategory } from "@/sanity/lib/products/getProductsByCategory";
import React from "react";
import { capitalize } from "lodash";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const products = await getProductsByCategory(slug);
  const categories = await getAllCategories();
  return (
    <>
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-[80%]">
          <h1 className="text-3xl font-bold text-center mb-6">
            {capitalize(slug)} Collection
          </h1>
          <ProductsView products={products} categories={categories} />
        </div>
      </div>
    </>
  );
}
