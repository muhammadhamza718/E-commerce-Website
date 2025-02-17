import formatCurrency from "@/lib/formatCurrency";
import imageUrl from "@/lib/imageUrl";
import getMyOrders from "@/sanity/lib/orders/getMyOrders";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

export default async function Orders() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const orders = await getMyOrders(userId);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-50 to-indigo-50 p-6">
      <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Orders Heading */}
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6 text-center">
          My Orders
        </h1>

        {/* Orders List with Scrollable Container */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {orders.length === 0 ? (
            <div className="text-center text-gray-500 mt-12">
              <p className="text-xl">You have not placed any orders yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.orderNumber}
                  className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1 font-semibold">
                          Order Number
                        </p>
                        <p className="font-mono text-sm text-green-600 break-all">
                          {order.orderNumber}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-sm text-gray-600 mb-1">Order Date</p>
                        <p className="font-medium text-lg">
                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">
                          Status:
                        </span>
                        <span
                          className={`px-4 py-2 rounded-full text-sm ${
                            order.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-sm text-gray-600 mb-1">
                          Total Amount
                        </p>
                        <p className="font-semibold text-xl text-gray-900">
                          {formatCurrency(
                            order.totalPrice ?? 0,
                            order.currency
                          )}
                        </p>
                      </div>
                    </div>

                    {order.amountDiscount && (
                      <div className="mt-4 p-4 bg-red-50 rounded-xl">
                        <p className="text-red-600 font-medium mb-1 text-sm sm:text-base">
                          Discount Applied:{" "}
                          {formatCurrency(
                            (order.totalPrice ?? 0) + order.amountDiscount,
                            order.currency
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-600 mb-4">
                      Order Items
                    </p>
                    <div className="space-y-4">
                      {order.products?.map((product) => (
                        <div
                          key={product.product?._id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b last:border-b-0"
                        >
                          <div className="flex items-center gap-4">
                            {product.product?.image && (
                              <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                                <Image
                                  src={imageUrl(product.product?.image).url()}
                                  alt={product.product?.name ?? ""}
                                  className="object-contain"
                                  fill
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-base">
                                {product.product?.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                Quantity: {product.quantity ?? "N/A"}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium text-lg text-right">
                            {product.product?.price && product.quantity
                              ? formatCurrency(
                                  product.product?.price * product.quantity,
                                  order.currency
                                )
                              : "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
