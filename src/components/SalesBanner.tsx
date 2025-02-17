import { getActiveSaleByCouponCode } from "@/sanity/lib/sales/getActiveSaleByCouponCode";
import React from "react";

export default async function SalesBanner() {
  const sale = await getActiveSaleByCouponCode("BFRIDAY");

  if (!sale?.isActive) {
    return null;
  }

  return (
    <div className="w-full bg-black text-white py-20 px-6 md:px-12 lg:px-20 relative overflow-hidden shadow-xl">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-600 to-red-700 opacity-70 blur-xl"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        {/* Left Side - Text Content */}
        <div className="flex-1">
          <h2 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-widest mb-4 animate-fadeIn">
            {sale.title}
          </h2>
          <p className="text-lg sm:text-2xl font-medium mb-6">
            {sale.Description}
          </p>
        </div>

        {/* Right Side - Coupon Code */}
        <div className="bg-white text-black py-4 px-8 rounded-lg shadow-lg flex flex-col sm:flex-row items-center gap-1 transform hover:scale-105 transition duration-300">
          <span className="font-bold text-xl sm:text-2xl">
            Use Code: <span className="text-red-700">{sale.couponCode}</span>
          </span>
          <span className="text-xl sm:text-2xl font-semibold">
            for {sale.discountAmount}% OFF
          </span>
        </div>
      </div>
    </div>
  );
}
