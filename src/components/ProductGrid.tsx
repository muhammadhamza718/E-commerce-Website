"use client";

import React from "react";
import { Product } from "../../sanity.types";
import { AnimatePresence, motion } from "framer-motion";
import ProductThumb from "./ProductThumb";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
        {products?.map((product) => {
          return (
            <AnimatePresence key={product._id}>
              <motion.div
                layout
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <ProductThumb key={product._id} product={product} />
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>
    </>
  );
}
