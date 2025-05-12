"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PAYMENT_METHODS = [
  { label: "Qris", value: "qris" },
  { label: "Cash", value: "cash" },
  { label: "Debit", value: "debit" },
];

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState(PAYMENT_METHODS[0].value);
  const [notes, setNotes] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Ambil cart dari localStorage
    const cartData = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    if (cartData) setCart(JSON.parse(cartData));
  }, []);

  const productTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const discount = 0; // bisa diubah jika ada promo
  const fee = 0;
  const total = productTotal - discount + fee;

  async function handleOrder() {
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          totalPrice: cart.reduce((sum, item) => sum + item.qty * item.price, 0),
          notes,
          paymentMethod: payment,
        }),
      });
      if (res.ok) {
        localStorage.removeItem("cart");
        window.location.href = "/menu";
      } else {
        const err = await res.json();
        alert("Gagal membuat pesanan: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      alert("Gagal membuat pesanan: " + error.message);
    }
  }

  function handleEdit() {
    router.back();
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col">
      {/* Header */}
      <div className="bg-[#222] text-white px-6 py-4 flex items-center">
        <button onClick={() => router.back()} className="text-2xl mr-4">←</button>
        <span className="text-lg font-semibold">Checkout</span>
      </div>
      {/* Konten dua kolom */}
      <div className="flex flex-1 flex-col md:flex-row gap-8 p-8 max-w-4xl mx-auto w-full">
        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[260px]">
          <div className="font-bold text-lg mb-4">Order Summary</div>
          <div className="flex flex-col gap-4 mb-6">
            {cart.length === 0 && <div className="text-gray-400">Keranjang kosong</div>}
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-2">
                <div className="w-14 h-14 relative">
                  <Image src={item.imageUrl || "/coffee-cup.png"} alt={item.name} fill style={{ objectFit: "cover" }} className="rounded-lg" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-gray-500 text-sm">Rp{item.price.toLocaleString("id-ID")} × {item.qty} pcs</div>
                </div>
                <div className="font-bold">Rp{(item.price * item.qty).toLocaleString("id-ID")}</div>
              </div>
            ))}
          </div>
          <div className="mb-2 font-medium">Add Notes</div>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full mb-2"
            placeholder="Value"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>
        {/* Payment Method & Ringkasan */}
        <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[260px] flex flex-col gap-6">
          <div>
            <div className="font-bold text-lg mb-4">Payment Method</div>
            <select
              className="border rounded px-3 py-2 w-full"
              value={payment}
              onChange={e => setPayment(e.target.value)}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 text-base">
            <div className="flex justify-between"><span>Product total</span><span>Rp{productTotal.toLocaleString("id-ID")}</span></div>
            <div className="flex justify-between text-gray-500"><span>Discount</span><span>Rp{discount.toLocaleString("id-ID")}</span></div>
            <div className="flex justify-between text-gray-500"><span>Fee</span><span>{fee === 0 ? "Free" : `Rp${fee.toLocaleString("id-ID")}`}</span></div>
            <div className="flex justify-between font-bold text-lg mt-2"><span>Total</span><span>Rp{total.toLocaleString("id-ID")}</span></div>
          </div>
          <div className="flex gap-4 mt-6">
            <button onClick={handleEdit} className="flex-1 py-2 rounded bg-[#b6a89a] text-white font-semibold shadow hover:bg-[#a89c8a] transition">Edit</button>
            <button onClick={handleOrder} className="flex-1 py-2 rounded bg-black text-white font-semibold shadow hover:bg-gray-800 transition">Order</button>
          </div>
        </div>
      </div>
    </div>
  );
} 