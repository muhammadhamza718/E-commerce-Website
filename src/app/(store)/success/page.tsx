"use client";
import { Button } from "@/components/ui/button";
import useBasketStore from "@/store/store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { LiaCheckSolid } from "react-icons/lia";
import { motion } from "framer-motion";
import { PackageIcon } from "lucide-react";
import { TrolleyIcon } from "@sanity/icons";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const clearBasket = useBasketStore((state) => state.clearBasket);

  useEffect(() => {
    if (orderNumber) {
      clearBasket();
    }
  }, [orderNumber, clearBasket]);

  return (
    <div className="flex flex-col items-center font-sans justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <motion.div
        className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 transform transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* ✅ Animated Check Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
        >
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
            <LiaCheckSolid className="h-12 w-12 text-green-600" />
          </div>
        </motion.div>

        {/* ✅ Order Confirmation Message */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900">
          🎉 Order Confirmed!
        </h1>

        {/* ✅ Order Details */}
        <div className="border-t border-b border-gray-300 py-6 my-6 text-center">
          <p className="text-lg text-gray-700">
            Your order has been successfully placed and is now being processed.
          </p>
          {orderNumber && (
            <p className="text-lg text-gray-600 mt-4">
              <span className="font-semibold">Order Number:</span>{" "}
              <span className="font-mono text-green-700 bg-green-100 px-3 py-1 rounded-md shadow-sm">
                {orderNumber}
              </span>
            </p>
          )}
        </div>

        {/* ✅ Confirmation Message */}
        <p className="text-gray-600 text-center mb-6">
          A confirmation email has been sent to your registered email.
        </p>

        {/* ✅ Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-all duration-300 px-6 py-4 text-lg rounded-lg shadow-md"
          >
            <Link href="/orders">
              <PackageIcon className="w-5 h-5" /> View Order Details
            </Link>
          </Button>
          <Button
            asChild
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 transition-all duration-300 px-6 py-4 text-lg rounded-lg shadow-md"
          >
            <Link href="/">
              <TrolleyIcon className="w-5 h-5" /> Continue Shopping
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
