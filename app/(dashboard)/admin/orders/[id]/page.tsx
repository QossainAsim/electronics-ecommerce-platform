"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { isValidEmailAddressFormat, isValidNameOrLastname } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface OrderProduct {
  id: string;
  customerOrderId: string;
  productId: string;
  quantity: number;
  priceAtOrder?: number;
  product: {
    id: string;
    slug: string;
    title: string;
    mainImage: string;
    price: number;
    rating: number;
    description: string;
    manufacturer: string;
    inStock: number;
    categoryId: string;
  };
}

interface Order {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  country: string;
  postalCode: string;
  totalPrice: number;
  status: string;
  dateTime: string;
  orderNotice?: string;
}

const AdminSingleOrder = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [order, setOrder] = useState<Order>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    country: "",
    postalCode: "",
    totalPrice: 0,
    status: "pending",
    dateTime: "",
    orderNotice: "",
  });
  
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/orders/${params?.id}`);
        const data: Order = await response.json();
        console.log('📦 Order data:', data);
        setOrder(data);
      } catch (error) {
        console.error('❌ Error fetching order:', error);
        toast.error('Failed to load order');
      }
    };

    const fetchOrderProducts = async () => {
      try {
        const response = await apiClient.get(`/api/order-product/${params?.id}`);
        const data: OrderProduct[] = await response.json();
        console.log('📦 Order products:', data);
        setOrderProducts(data || []);
      } catch (error) {
        console.error('❌ Error fetching order products:', error);
        setOrderProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchOrderData();
      fetchOrderProducts();
    }
  }, [params?.id]);

  const updateOrder = async () => {
    if (
      !order?.firstName?.trim() ||
      !order?.lastName?.trim() ||
      !order?.phone?.trim() ||
      !order?.email?.trim() ||
      !order?.address?.trim() ||
      !order?.city?.trim() ||
      !order?.country?.trim() ||
      !order?.postalCode?.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!isValidNameOrLastname(order.firstName)) {
      toast.error("You entered invalid first name format");
      return;
    }

    if (!isValidNameOrLastname(order.lastName)) {
      toast.error("You entered invalid last name format");
      return;
    }

    if (!isValidEmailAddressFormat(order.email)) {
      toast.error("You entered invalid email format");
      return;
    }

    try {
      const response = await apiClient.put(`/api/orders/${order.id}`, order);
      
      if (response.ok) {
        toast.success("Order updated successfully");
      } else {
        throw new Error("Failed to update order");
      }
    } catch (error) {
      console.error('❌ Update error:', error);
      toast.error("There was an error while updating the order");
    }
  };

  const deleteOrder = async () => {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await apiClient.delete(`/api/order-product/${order.id}`);
      await apiClient.delete(`/api/orders/${order.id}`);
      
      toast.success("Order deleted successfully");
      router.push("/admin/orders");
    } catch (error) {
      console.error('❌ Delete error:', error);
      toast.error("Failed to delete order");
    }
  };

  if (loading) {
    return (
      <div className="bg-white flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg text-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <div className="flex flex-col gap-y-7 xl:ml-5 w-full max-xl:px-5">
        <h1 className="text-3xl font-semibold">Order details</h1>
        
        <div className="mt-5">
          <label className="w-full">
            <div>
              <span className="text-xl font-bold">Order ID:</span>
              <span className="text-base"> {order?.id}</span>
            </div>
          </label>
        </div>

        <div className="flex gap-x-2 max-sm:flex-col">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">First Name:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.firstName || ""}
                onChange={(e) => setOrder({ ...order, firstName: e.target.value })}
              />
            </label>
          </div>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Last Name:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.lastName || ""}
                onChange={(e) => setOrder({ ...order, lastName: e.target.value })}
              />
            </label>
          </div>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Phone number:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={order?.phone || ""}
              onChange={(e) => setOrder({ ...order, phone: e.target.value })}
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Email address:</span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full max-w-xs"
              value={order?.email || ""}
              onChange={(e) => setOrder({ ...order, email: e.target.value })}
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Company (optional):</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={order?.company || ""}
              onChange={(e) => setOrder({ ...order, company: e.target.value })}
            />
          </label>
        </div>

        <div className="flex gap-x-2 max-sm:flex-col">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Address:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.address || ""}
                onChange={(e) => setOrder({ ...order, address: e.target.value })}
              />
            </label>
          </div>

          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Apartment, suite, etc.:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.apartment || ""}
                onChange={(e) => setOrder({ ...order, apartment: e.target.value })}
              />
            </label>
          </div>
        </div>

        <div className="flex gap-x-2 max-sm:flex-col">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">City:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.city || ""}
                onChange={(e) => setOrder({ ...order, city: e.target.value })}
              />
            </label>
          </div>

          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Country:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.country || ""}
                onChange={(e) => setOrder({ ...order, country: e.target.value })}
              />
            </label>
          </div>

          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Postal Code:</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={order?.postalCode || ""}
                onChange={(e) => setOrder({ ...order, postalCode: e.target.value })}
              />
            </label>
          </div>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Order status</span>
            </div>
            <select
              className="select select-bordered"
              value={order?.status || "pending"}
              onChange={(e) => setOrder({ ...order, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
        </div>

        <div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Order notice:</span>
            </div>
            <textarea
              className="textarea textarea-bordered h-24"
              value={order?.orderNotice || ""}
              onChange={(e) => setOrder({ ...order, orderNotice: e.target.value })}
            ></textarea>
          </label>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
          {orderProducts.length === 0 ? (
            <p className="text-gray-500">No products found for this order</p>
          ) : (
            orderProducts.map((product) => (
              <div className="flex items-center gap-x-4 mb-4 p-4 bg-gray-50 rounded-lg" key={product?.id}>
                <Image
                  src={product?.product?.mainImage ? `/${product?.product?.mainImage}` : "/product_placeholder.jpg"}
                  alt={product?.product?.title}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <Link 
                    href={`/product/${product?.product?.slug}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {product?.product?.title}
                  </Link>
                  <p className="text-gray-600">
                    Rs {(product?.priceAtOrder || product?.product?.price).toLocaleString('en-PK')} × {product?.quantity} items = 
                    <span className="font-semibold ml-1">
                      Rs {((product?.priceAtOrder || product?.product?.price) * product?.quantity).toLocaleString('en-PK')}
                    </span>
                  </p>
                </div>
              </div>
            ))
          )}
          
          {/* ✅ UPDATED: Changed currency to Rs, removed tax and shipping breakdown */}
          <div className="flex flex-col gap-y-2 mt-10 bg-gray-100 p-6 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">* Price includes all taxes and shipping charges</p>
            <div className="border-t-2 border-gray-300 pt-2 mt-2">
              <p className="text-2xl font-bold text-blue-600">
                Total: Rs {order?.totalPrice?.toLocaleString('en-PK') || "0"}
              </p>
            </div>
          </div>

          <div className="flex gap-x-2 max-sm:flex-col mt-5">
            <button
              type="button"
              className="uppercase bg-blue-500 px-10 py-5 text-lg border border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2"
              onClick={updateOrder}
            >
              Update order
            </button>
            <button
              type="button"
              className="uppercase bg-red-600 px-10 py-5 text-lg border border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 transition-colors focus:outline-none focus:ring-2"
              onClick={deleteOrder}
            >
              Delete order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSingleOrder;