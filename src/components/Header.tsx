"use client";
import { ClerkLoaded, SignedIn, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { TrolleyIcon } from "@sanity/icons";
import { PiFediverseLogoDuotone } from "react-icons/pi";
import useBasketStore from "@/store/store";
import { PackageIcon } from "lucide-react";

export default function Header() {
  const { user } = useUser();
  const itemCount = useBasketStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));

  return (
    <header className="bg-white shadow-md px-6 py-4">
      {/* Top row */}
      <div className="flex flex-wrap justify-between items-center w-full">
        
        {/* Logo */}
        <Link href="/" className="text-2xl flex items-center font-bold text-blue-600 hover:opacity-75 transition-all mx-auto sm:mx-0">
          <PiFediverseLogoDuotone className="w-10 h-10" /> <span className="ml-2">Shopr</span>
        </Link>

        {/* Search Bar */}
        <form action="/search" className="w-full sm:w-auto sm:flex-1 sm:mx-4 mt-3 sm:mt-0">
          <input
            type="text"
            name="query"
            placeholder="Search for products..."
            className="w-full max-w-3xl border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </form>

        {/* User Actions */}
        <div className="flex items-center space-x-4 mt-4 sm:mt-0 flex-1 sm:flex-none justify-center sm:justify-start">
          
          {/* Basket */}
          <Link href="/basket" className="relative flex items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition">
            <TrolleyIcon className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {itemCount}
              </span>
            )}
            <span>My Basket</span>
          </Link>

          {/* Orders (Only for signed-in users) */}
          <ClerkLoaded>
            <SignedIn>
              <Link href="/orders" className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition">
                <PackageIcon className="w-6 h-6" />
                <span>My Orders</span>
              </Link>
            </SignedIn>

            {/* User Account */}
            {user ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal" />
            )}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
}
