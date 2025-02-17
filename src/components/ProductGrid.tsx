"use client";

import React from "react";
import { Product } from "../../sanity.types";
import { AnimatePresence, motion as m } from "framer-motion";
import ProductThumb from "./ProductThumb";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      <AnimatePresence>
        {products?.map((product, index) => (
          <m.div
            key={product._id}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
            className="flex justify-center"
          >
            <ProductThumb product={product} />
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
