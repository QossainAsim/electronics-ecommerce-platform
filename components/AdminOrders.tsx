"use client";

// *********************
// Role of the component: Component that displays all orders on admin dashboard page
// Name of the component: AdminOrders.tsx
// Developer: Aleksandar Kuzmanovic (Updated)
// Version: 3.0 - Added action buttons and Rs currency
// Component call: <AdminOrders />
// Input parameters: No input parameters
// Output: Table with all orders
// *********************

import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";

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
  customer_order_products?: Array<{
    id: string;
    quantity: number;
    priceAtOrder: number;
    product: {
      id: string;
      title: string;
      mainImage?: string;
      price: number;
    };
  }>;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching orders from API...');
      
      const response = await apiClient.get("/api/orders");
      const data = await response.json();
      
      console.log('📦 Orders response:', data);
      
      const ordersArray = Array.isArray(data) 
        ? data 
        : (data.orders || []);
      
      console.log('✅ Orders loaded:', ordersArray.length);
      setOrders(ordersArray);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Quick status update
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // First, fetch the full order data
      const getResponse = await apiClient.get(`/api/orders/${orderId}`);
      const fullOrder = await getResponse.json();
      
      if (!fullOrder || fullOrder.error) {
        throw new Error("Failed to fetch order details");
      }

      // ✅ Only send the fields that can be updated (exclude relations)
      const updateData = {
        firstName: fullOrder.firstName,
        lastName: fullOrder.lastName,
        email: fullOrder.email,
        phone: fullOrder.phone,
        company: fullOrder.company || '',
        address: fullOrder.address,
        apartment: fullOrder.apartment || '',
        city: fullOrder.city,
        country: fullOrder.country,
        postalCode: fullOrder.postalCode,
        totalPrice: fullOrder.totalPrice,
        status: newStatus // ✅ Update the status
      };

      const response = await apiClient.put(`/api/orders/${orderId}`, updateData);
      
      if (response.ok) {
        // Update local state
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || "Failed to update status");
      }
    } catch (error: any) {
      console.error('❌ Status update error:', error);
      toast.error(error.message || "Failed to update order status");
    }
  };

  // ✅ NEW: Print invoice
  const printInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Please allow popups to print invoice");
      return;
    }

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - Order #${order.id.slice(0, 8)}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; background: white; }
          .invoice-container { max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #3b82f6; }
          .company-info h1 { color: #3b82f6; font-size: 32px; margin-bottom: 10px; }
          .invoice-info { text-align: right; }
          .invoice-info h2 { font-size: 24px; color: #333; margin-bottom: 10px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #ddd; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .info-item { margin-bottom: 10px; }
          .info-label { font-weight: bold; color: #666; }
          .info-value { color: #333; margin-top: 5px; }
          .totals { margin-top: 30px; text-align: right; }
          .total-row { display: flex; justify-content: flex-end; gap: 100px; margin: 10px 0; font-size: 16px; }
          .total-row.grand-total { font-size: 24px; font-weight: bold; color: #3b82f6; margin-top: 20px; padding-top: 20px; border-top: 2px solid #3b82f6; }
          .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="company-info">
              <h1>SINGITRONIC</h1>
              <p>Electronic Ecommerce</p>
            </div>
            <div class="invoice-info">
              <h2>INVOICE</h2>
              <p><strong>Order ID:</strong> #${order.id.slice(0, 8)}</p>
              <p><strong>Date:</strong> ${new Date(order.dateTime).toLocaleDateString('en-PK')}</p>
              <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Customer Information</div>
            <div class="info-grid">
              <div>
                <div class="info-item">
                  <div class="info-label">Customer Name:</div>
                  <div class="info-value">${order.firstName} ${order.lastName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email:</div>
                  <div class="info-value">${order.email}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Phone:</div>
                  <div class="info-value">${order.phone}</div>
                </div>
              </div>
              <div>
                <div class="info-item">
                  <div class="info-label">Shipping Address:</div>
                  <div class="info-value">
                    ${order.address}<br>
                    ${order.apartment ? order.apartment + '<br>' : ''}
                    ${order.city}, ${order.postalCode}<br>
                    ${order.country}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="totals">
            <div class="total-row grand-total">
              <span>TOTAL:</span>
              <span>Rs ${order.totalPrice.toLocaleString('en-PK')}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  // ✅ NEW: Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'packed':
        return 'bg-purple-500 text-white';
      case 'dispatch_pending':
        return 'bg-orange-500 text-white';
      case 'dispatched':
        return 'bg-blue-500 text-white';
      case 'done':
      case 'completed':
        return 'bg-green-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="xl:ml-5 w-full max-xl:mt-5">
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg text-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="xl:ml-5 w-full max-xl:mt-5">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="xl:ml-5 w-full max-xl:mt-5">
      <h1 className="text-3xl font-semibold text-center mb-5">All orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-base-200 rounded-lg">
          <p className="text-lg text-gray-500">No orders yet</p>
          <p className="text-sm text-gray-400 mt-2">Orders will appear here once customers place them</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-md">
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>

                  <td>
                    <div>
                      <p className="font-bold">#{order.id.slice(0, 8)}</p>
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-5">
                      <div>
                        <div className="font-bold">
                          {order.firstName} {order.lastName}
                        </div>
                        <div className="text-sm opacity-50">{order.country}</div>
                        <div className="text-xs opacity-40">{order.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* ✅ UPDATED: Better status badges with colors */}
                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>

                  {/* ✅ UPDATED: Changed to Rs currency */}
                  <td>
                    <p className="font-semibold">Rs {order.totalPrice.toLocaleString('en-PK')}</p>
                  </td>

                  <td>
                    {new Date(order.dateTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  
                  {/* ✅ NEW: Action buttons */}
                  <th>
                    <div className="flex gap-2">
                      {/* Print Invoice Button */}
                      <button
                        onClick={() => printInvoice(order)}
                        className="btn btn-sm btn-ghost text-green-600 hover:bg-green-50"
                        title="Print Invoice"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {/* Mark as Done Button */}
                      {order.status !== 'done' && order.status !== 'completed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'done')}
                          className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50"
                          title="Mark as Done"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}

                      {/* Details Button */}
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="btn btn-sm btn-ghost text-gray-600 hover:bg-gray-50"
                        title="View Details"
                      >
                        details
                      </Link>
                    </div>
                  </th>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;