import SalesBanner from "@/components/SalesBanner"
import ProductsView from "@/components/productView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  console.log(
    crypto.randomUUID().slice(0, 5) + `>>> Rerendered the Home page cache with ${products.length} products and ${categories.length} categories`
  );

  return (
    <>
      <div className="home-page">
        <SalesBanner />
        <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
          <ProductsView products={products} categories={categories} />
        </div>
      </div>
    </>
  );
}
