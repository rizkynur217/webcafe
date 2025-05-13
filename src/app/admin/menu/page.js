"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const categories = [
  { label: "All", value: "ALL" },
  { label: "Main Course", value: "MAINCOURSE" },
  { label: "Coffee", value: "COFFEE" },
  { label: "non-Coffee", value: "NONCOFFEE" },
  { label: "Snack", value: "SNACK" },
  { label: "Dessert", value: "DESERT" },
];

export default function AdminMenuPage() {
  const [menus, setMenus] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "MAINCOURSE",
    price: "",
    image: null,
    imageUrl: "",
  });
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    console.log('Data menu:', menus);
    console.log('Kategori aktif:', category);
  }, [menus, category]);

  async function fetchMenus() {
    try {
      const res = await fetch("/api/menu");
      if (!res.ok) {
        throw new Error('Failed to fetch menus');
      }
      const data = await res.json();
      setMenus(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setMenus([]);
    }
  }

  function handleOpenForm() {
    setForm({ name: "", description: "", category: "MAINCOURSE", price: "", image: null, imageUrl: "" });
    setShowForm(true);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setForm((f) => ({ ...f, image: file, imageUrl: URL.createObjectURL(file) }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      if (form.image) formData.append("image", form.image);
      if (form.id) {
        // Edit menu (PATCH)
        const res = await fetch(`/api/menu/${form.id}`, {
          method: "PATCH",
          body: formData,
        });
        if (res.ok) {
          setShowForm(false);
          fetchMenus();
        } else {
          const errMsg = await res.text();
          alert("Gagal mengedit menu: " + errMsg);
        }
      } else {
        // Tambah menu baru (POST)
        const res = await fetch("/api/menu", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          setShowForm(false);
          fetchMenus();
        } else {
          const errMsg = await res.text();
          alert("Gagal menambah menu: " + errMsg);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  // Toggle isAvailable (see/unsee)
  async function handleToggleSee(menu) {
    await fetch(`/api/menu/${menu.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !menu.isAvailable }),
    });
    fetchMenus();
  }

  // Delete menu
  async function handleDelete(menu) {
    if (!confirm(`Hapus menu "${menu.name}"?`)) return;
    await fetch(`/api/menu/${menu.id}`, { method: "DELETE" });
    fetchMenus();
  }

  // Edit menu
  function handleEdit(menu) {
    setForm({
      name: menu.name,
      description: menu.description,
      category: menu.category,
      price: menu.price,
      image: null,
      imageUrl: menu.imageUrl || "",
      id: menu.id,
    });
    setShowForm(true);
  }

  const filteredMenus = Array.isArray(menus)
    ? (category === "All" || category === "ALL"
        ? menus
        : menus.filter((m) => m.category === category))
    : [];

  // Sidebar & Layout
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-black text-white flex flex-col items-center py-8 rounded-r-3xl mr-8 min-h-screen">
        <div className="flex flex-col justify-between h-full w-full">
          <div>
            <div className="text-2xl font-bold text-center mb-8">Dashboard</div>
            <nav className="flex flex-col gap-4 px-6">
              <Link href="/admin" className="py-2 px-4 rounded-lg hover:bg-gray-800 transition text-lg font-medium flex items-center gap-2">
                <span role="img" aria-label="home">🏠</span>
                Dashboard
              </Link>
              <Link href="/admin/menu" className="py-2 px-4 rounded-lg bg-gray-800 text-white text-lg font-medium flex items-center gap-2">
                <span role="img" aria-label="menu">🍽️</span>
                Menu
              </Link>
            </nav>
          </div>
          <div className="px-6 mb-8">
            <LogoutButton />
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Dashboard Admin</h1>
          <button onClick={handleOpenForm} className="bg-black text-white rounded-full px-8 py-3 font-semibold text-lg flex items-center gap-2 shadow hover:bg-gray-800 transition">
            <span className="text-2xl">+</span> Tambah Menu
          </button>
        </div>
        {/* Kategori */}
        <div className="flex gap-8 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.label}
              className={`pb-2 px-4 text-lg font-semibold border-b-4 transition-all ${category === cat.label ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black hover:border-black"}`}
              onClick={() => setCategory(cat.label)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {/* Grid Menu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto mb-16">
          {filteredMenus.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 text-xl py-16">Tidak ada menu untuk kategori ini.</div>
          ) : (
            filteredMenus.map((item) => (
              <div key={item.id} className="bg-black rounded-2xl shadow-lg p-6 flex flex-col items-center text-white min-h-[340px] w-full">
                <div className="w-36 h-36 mb-4 relative">
                  <Image src={item.imageUrl || "/coffee-cup.png"} alt={item.name} fill style={{ objectFit: "contain" }} className="rounded-xl" />
                </div>
                <div className="w-full">
                  <div className="font-bold text-xl mb-1">{item.name}</div>
                  <div className="text-gray-300 text-sm mb-2 min-h-[40px]">{item.description}</div>
                  <div className="font-bold text-lg mb-2">Rp{Number(item.price).toLocaleString("id-ID")}</div>
                  <div className="flex gap-4 mt-2 text-2xl">
                    <button
                      className={item.isAvailable ? "hover:text-blue-400" : "text-gray-400 hover:text-blue-400"}
                      title={item.isAvailable ? "Unsee (sembunyikan dari pelanggan)" : "See (tampilkan ke pelanggan)"}
                      onClick={() => handleToggleSee(item)}
                      type="button"
                    >
                      {item.isAvailable ? <span role="img" aria-label="see">👁️</span> : <span role="img" aria-label="unsee">👁️‍🗨️</span>}
                    </button>
                    <button className="hover:text-yellow-400" title="Edit" onClick={() => handleEdit(item)} type="button"><span role="img" aria-label="edit">✏️</span></button>
                    <button className="hover:text-red-400" title="Delete" onClick={() => handleDelete(item)} type="button"><span role="img" aria-label="hapus">🗑️</span></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Modal/Form Tambah Menu */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative flex flex-col min-h-[600px] animate-fadeIn">
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 bg-black rounded-t-2xl border-b border-gray-200">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="text-white hover:text-gray-300 transition-colors text-lg font-medium flex items-center gap-2"
                >
                  <span className="text-2xl">←</span> Kembali
                </button>
                <h2 className="text-2xl font-bold text-white">
                  {form.id ? 'Edit Menu' : 'Tambah Menu Baru'}
                </h2>
                <div className="w-24" />
              </div>

              {/* Content with improved two-column layout */}
              <div className="flex flex-1 gap-12 p-8">
                {/* Left column: Image */}
                <div className="flex flex-col items-center w-1/2 space-y-6">
                  <div className="w-72 h-72 relative rounded-2xl overflow-hidden bg-gray-50 shadow-inner border-2 border-dashed border-gray-200 transition-all hover:border-gray-300">
                    {form.imageUrl ? (
                      <Image 
                        src={form.imageUrl} 
                        alt="Preview" 
                        fill 
                        style={{ objectFit: "cover" }} 
                        className="hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 p-6 text-center">
                        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-medium">Klik untuk mengunggah gambar menu</p>
                        <p className="text-xs mt-2">Format: JPG, PNG (Max 2MB)</p>
                      </div>
                    )}
                  </div>
                  <label className="w-full max-w-xs">
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                    <span className="block w-full py-3 px-4 rounded-xl bg-black text-white text-center font-semibold cursor-pointer hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl">
                      {form.imageUrl ? 'Ganti Gambar' : 'Upload Gambar'}
                    </span>
                  </label>
                </div>

                {/* Right column: Form */}
                <form onSubmit={handleSubmit} className="flex flex-col w-1/2 space-y-6">
                  <div className="space-y-5">
                    <div>
                      <label className="block font-semibold mb-2 text-gray-700">Nama Menu</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Cappuccino" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all duration-200" 
                        value={form.name} 
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                        required 
                        readOnly={!!form.id}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2 text-gray-700">Deskripsi</label>
                      <textarea 
                        placeholder="Deskripsikan menu ini..." 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all duration-200 min-h-[120px]" 
                        value={form.description} 
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                        required 
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2 text-gray-700">Kategori</label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all duration-200 bg-white" 
                        value={form.category} 
                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))} 
                        required
                      >
                        {categories.filter(c => c.value !== "ALL").map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2 text-gray-700">Harga</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                        <input 
                          type="number" 
                          placeholder="0" 
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all duration-200" 
                          value={form.price} 
                          onChange={e => setForm(f => ({ ...f, price: e.target.value }))} 
                          required 
                          min={0}
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-4 rounded-xl bg-black text-white font-semibold shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all duration-200 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Menyimpan...
                      </span>
                    ) : (
                      'Simpan Menu'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 