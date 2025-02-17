"use client";

import useBasketStore from "@/store/store";
import React, { useEffect, useState } from "react";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AddToBasketButton from "@/components/AddToBasketButton";
import Image from "next/image";
import imageUrl from "@/lib/imageUrl";
import Loader from "@/components/Loader";
import { createCheckoutSession, Metadata } from "../../../../actions/createCheckoutSession";

export default function BasketPage() {
  const groupItems = useBasketStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader />;
  }

  if (groupItems.length === 0) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Basket</h1>
        <p className="text-lg text-gray-600">Your basket is empty.</p>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!isSignedIn) return;
    setIsLoading(true);
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "unknown",
        customerEmail: user?.emailAddresses[0].emailAddress ?? "unknown",
        clerkUserId: user!.id,
      };
      const CheckoutUrl = await createCheckoutSession(groupItems, metadata);
      if (CheckoutUrl) {
        window.location.href = CheckoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Basket</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side - Basket Items */}
        <div className="flex-grow">
          {groupItems.map((item) => (
            <div
              key={item.product._id}
              className="mb-6 p-4 border rounded-lg shadow-md flex items-center justify-between bg-white hover:shadow-lg transition-shadow"
            >
              <div
                className="flex items-center cursor-pointer flex-1 min-w-0"
                onClick={() => router.push(`/product/${item.product.slug?.current}`)}
              >
                {item.product.image && (
                  <Image
                    src={imageUrl(item.product.image).url()}
                    alt={item.product.name ?? "Product image"}
                    className="w-24 h-24 object-cover rounded-lg"
                    width={90}
                    height={90}
                  />
                )}
                <div className="ml-4 min-w-0">
                  <h2 className="text-xl font-semibold text-gray-900 truncate">{item.product.name}</h2>
                  <p className="text-lg text-gray-700">₤ {((item.product.price ?? 0) * item.quantity).toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center ml-4 flex-shrink-0">
                <AddToBasketButton product={item.product} />
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Order Summary */}
        <div className="w-full lg:w-96 lg:sticky lg:top-4 h-fit bg-white p-6 border rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-900">Order Summary</h3>
          <div className="mt-4 space-y-3">
            <p className="flex justify-between text-lg text-gray-700">
              <span>Items:</span>
              <span>{groupItems.reduce((total, item) => total + item.quantity, 0)}</span>
            </p>
            <p className="flex justify-between text-2xl font-bold border-t pt-3 text-gray-900">
              <span>Total:</span>
              <span>₤ {useBasketStore.getState().getTotalPrice().toFixed(2)}</span>
            </p>
          </div>
          {isSignedIn ? (
            <button
              onClick={handleCheckout}
              disabled={isloading}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:bg-gray-400"
            >
              {isloading ? "Processing..." : "Proceed to Checkout"}
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all">
                Sign in to Checkout
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
}
