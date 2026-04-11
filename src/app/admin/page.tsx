"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useAdmin } from "./layout";
import { Order } from "@/types";

type StatusFilter = "all" | "pending" | "processed" | "failed";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  processed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const { token } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      params.set("limit", "50");

      const res = await fetch(`/api/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function updateStatus(orderId: string, status: "processed" | "failed") {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch (err) {
      console.error("Failed to update order:", err);
    } finally {
      setUpdating(false);
    }
  }

  const filters: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Processed", value: "processed" },
    { label: "Failed", value: "failed" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-headline text-primary">Orders</h1>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                filter === f.value
                  ? "bg-primary text-on-primary"
                  : "bg-white text-on-surface-variant hover:bg-surface-container ring-1 ring-outline-variant/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-3 block">inbox</span>
          No orders found
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white rounded-xl p-4 sm:p-5 ring-1 ring-black/5 hover:ring-primary/20 transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-primary">#{order.order_number}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface">{order.customer_name}</p>
                  <p className="text-xs text-on-surface-variant">{order.customer_email} · {order.customer_phone}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-primary">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-on-surface-variant">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-outline-variant/15 flex items-center justify-between">
              <div>
                <h2 className="font-headline text-xl text-primary">
                  Order #{selectedOrder.order_number}
                </h2>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-lg hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Customer</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Email</p>
                  <p className="font-medium">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Phone</p>
                  <p className="font-medium">{selectedOrder.customer_phone}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Date</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Address</p>
                <p className="font-medium">{selectedOrder.customer_address}</p>
              </div>

              {selectedOrder.order_notes && (
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Notes</p>
                  <p className="text-sm">{selectedOrder.order_notes}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-surface-container-low rounded-lg">
                      <Image src={item.img} alt={item.title} width={40} height={40} className="w-10 h-10 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-on-surface-variant">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold">{item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-outline-variant/20">
                  <span className="font-headline text-primary">Total</span>
                  <span className="text-lg font-bold text-primary">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.screenshot_url && (
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-2">Payment Screenshot</p>
                  <a href={selectedOrder.screenshot_url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={selectedOrder.screenshot_url}
                      alt="Payment screenshot"
                      className="max-h-64 rounded-xl ring-1 ring-black/5 hover:ring-primary/30 transition-all"
                    />
                  </a>
                </div>
              )}

              {selectedOrder.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-outline-variant/20">
                  <button
                    onClick={() => updateStatus(selectedOrder.id, "processed")}
                    disabled={updating}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "Approve Order"}
                  </button>
                  <button
                    onClick={() => updateStatus(selectedOrder.id, "failed")}
                    disabled={updating}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "Reject Order"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
