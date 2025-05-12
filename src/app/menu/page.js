"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categories = [
  { label: "All", value: "ALL" },
  { label: "Main Course", value: "MAINCOURSE" },
  { label: "Coffee", value: "COFFEE" },
  { label: "non-Coffee", value: "NONCOFFEE" },
  { label: "Snack", value: "SNACK" },
  { label: "Dessert", value: "DESERT" },
];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("ALL");
  const [cart, setCart] = useState([]); // {id, name, price, qty}
  const router = useRouter();

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch("/api/menu");
        if (!res.ok) throw new Error("Failed to fetch menu");
        const data = await res.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const filteredMenus = category === "ALL"
    ? menuItems
    : menuItems.filter((item) => item.category === category);

  // Tambah ke keranjang
  function addToCart(item) {
    setCart((prev) => {
      const exist = prev.find((c) => c.id === item.id);
      if (exist) {
        return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      } else {
        return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
      }
    });
  }

  // Kurangi dari keranjang
  function removeFromCart(item) {
    setCart((prev) => {
      const exist = prev.find((c) => c.id === item.id);
      if (exist && exist.qty > 1) {
        return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty - 1 } : c);
      } else {
        // Jika qty 1, hapus dari cart
        return prev.filter((c) => c.id !== item.id);
      }
    });
  }

  // Ambil qty menu tertentu di cart
  function getQty(id) {
    const found = cart.find((c) => c.id === id);
    return found ? found.qty : 0;
  }

  // Hitung total kuantitas dan harga
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  // Navigasi ke checkout
  function goToCheckout() {
    if (cart.length > 0) {
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(cart));
      }
      router.push("/menu/checkout");
    }
  }

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fafafa] pb-32">
      {/* Navbar */}
      <nav className="flex justify-center mt-6 mb-8">
        <div className="flex gap-6 bg-black rounded-full px-8 py-2 text-white font-medium text-lg shadow">
          <Link href="/" className="hover:underline">Home</Link>
          <a href="#" className="hover:underline">Reviews</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </nav>
      {/* Judul */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Our Best & Special Menu</h1>
      {/* Kategori */}
      <div className="flex justify-center gap-6 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`pb-1 px-2 text-lg font-medium border-b-2 transition-all ${category === cat.value ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black hover:border-black"}`}
            onClick={() => setCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      {/* Grid Menu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
        {filteredMenus.length === 0 && (
          <div className="col-span-full text-center text-gray-400 text-xl py-16">Tidak ada menu tersedia</div>
        )}
        {filteredMenus.map((item) => {
          const qty = getQty(item.id);
          return (
            <div key={item.id} className="bg-black rounded-xl shadow-lg p-4 flex flex-col items-center text-white">
              <div className="w-32 h-32 mb-4 relative">
                <Image src={item.imageUrl || "/coffee-cup.png"} alt={item.name} fill style={{ objectFit: "contain" }} />
              </div>
              <div className="w-full">
                <div className="font-bold text-lg mb-1">{item.name}</div>
                <div className="text-gray-300 text-sm mb-2 min-h-[40px]">{item.description}</div>
                <div className="font-bold text-base mb-2">Rp{Number(item.price).toLocaleString("id-ID")}</div>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xl font-bold shadow hover:bg-gray-200 transition disabled:opacity-50"
                    onClick={() => removeFromCart(item)}
                    aria-label="Kurangi dari keranjang"
                    type="button"
                    disabled={qty === 0}
                  >
                    -
                  </button>
                  {qty > 0 && (
                    <span className="font-bold text-lg w-6 text-center">{qty}</span>
                  )}
                  <button
                    className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xl font-bold shadow hover:bg-gray-200 transition"
                    onClick={() => addToCart(item)}
                    aria-label="Tambah ke keranjang"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Pop up keranjang */}
      {totalQty > 0 && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-8 bg-[#2d2323] text-white rounded-full px-8 py-3 flex items-center gap-12 shadow-lg text-lg font-semibold z-20 min-w-[320px]">
          <span>{totalQty} item</span>
          <span>{totalPrice.toLocaleString("id-ID")}</span>
          <button onClick={goToCheckout} className="text-2xl focus:outline-none" aria-label="Checkout">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6"/></svg>
          </button>
        </div>
      )}
    </div>
  );
} 