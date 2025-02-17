import React from "react";
import { Product } from "../../sanity.types";
import Link from "next/link";
import Image from "next/image";
import imageUrl from "@/lib/imageUrl";
import useBasketStore from "@/store/store";

export default function ProductThumb({ product }: { product: Product }) {
  const isOutOfStock = product.stock != null && product.stock <= 0;
  const { addItem } = useBasketStore();

  return (
    <>
      <div
        className={`group relative flex flex-col bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl ${
          isOutOfStock ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {/* Product Image */}
        <div className="relative w-full aspect-square overflow-hidden">
          <Link href={`/product/${product.slug?.current}`}>
            {product.image && (
              <Image
                src={imageUrl(product.image).url()}
                alt={product.name || "Product Image"}
                fill
                sizes="(max-width: 798px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
              />
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="text-white font-bold text-lg tracking-wide">
                  Out of Stock
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-1">
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {product.name}
          </h2>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {product.description
              ?.map((block) =>
                block._type === "block"
                  ? block.children?.map((child) => child.text).join("")
                  : ""
              )
              .join(" ") || "No description available"}
          </p>

          {/* Price & Button */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xl font-bold text-red-600">
              ₤{product.price?.toFixed(2)}
            </p>
            <button
              onClick={() => addItem(product)}
              className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-300 ${
                isOutOfStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Unavailable" : "Add to Basket"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
