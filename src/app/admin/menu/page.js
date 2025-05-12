"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

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
        <div className="mb-12 w-full">
          <div className="text-2xl font-bold text-center mb-8">Dashboard</div>
          <nav className="flex flex-col gap-4 px-6">
            <Link href="/admin" className="py-2 px-4 rounded-lg hover:bg-gray-800 transition text-lg font-medium">Dashboard</Link>
            <Link href="/admin/menu" className="py-2 px-4 rounded-lg bg-gray-800 text-white text-lg font-medium">Menu</Link>
          </nav>
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
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-[#ededed] rounded-xl w-full max-w-3xl shadow-lg relative flex flex-col min-h-[500px]">
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-4 bg-[#222] rounded-t-xl">
                <button type="button" onClick={() => setShowForm(false)} className="text-white text-2xl font-bold flex items-center gap-2">
                  <span className="text-2xl">←</span> Kembali
                </button>
                <h2 className="text-2xl font-bold text-white">Tambah Menu</h2>
                <div className="w-24" /> {/* Spacer */}
              </div>
              {/* Konten dua kolom */}
              <div className="flex flex-1 gap-8 px-8 py-8">
                {/* Kolom kiri: Gambar */}
                <div className="flex flex-col items-center w-1/2">
                  <div className="w-56 h-56 relative rounded-xl overflow-hidden bg-gray-200 mb-4">
                    {form.imageUrl ? (
                      <Image src={form.imageUrl} alt="Preview" fill style={{ objectFit: "cover" }} />
                    ) : (
                      <span className="text-gray-400 flex items-center justify-center w-full h-full">No Image</span>
                    )}
                  </div>
                  <label className="w-full">
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <span className="block w-full py-2 px-4 rounded bg-black text-white text-center font-semibold cursor-pointer hover:bg-gray-800 transition">Upload Gambar</span>
                  </label>
                </div>
                {/* Kolom kanan: Form */}
                <form onSubmit={handleSubmit} className="flex flex-col w-1/2 gap-4 justify-between">
                  <div>
                    <label className="block font-semibold mb-1">Nama Makanan</label>
                    <input type="text" placeholder="Nama Makanan" className="border rounded px-3 py-2 w-full mb-3" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required readOnly={!!form.id} />
                    <label className="block font-semibold mb-1">Deskripsi</label>
                    <textarea placeholder="Deskripsi" className="border rounded px-3 py-2 w-full mb-3" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
                    <label className="block font-semibold mb-1">Kategori</label>
                    <select className="border rounded px-3 py-2 w-full mb-3" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                      {categories.filter(c => c.value !== "ALL").map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    <label className="block font-semibold mb-1">Harga</label>
                    <input type="number" placeholder="Harga" className="border rounded px-3 py-2 w-full mb-3" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required min={0} />
                  </div>
                  <button type="submit" className="w-full py-2 rounded bg-black text-white font-semibold shadow hover:bg-gray-800 transition mt-4" disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 