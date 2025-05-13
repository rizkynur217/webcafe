"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  // Ambil data user dari backend saat halaman dimuat
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile({
            username: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
          });
        }
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  function handleChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaved(false);
    // Simpan ke backend, hanya nomor telepon
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: profile.phone }),
    });
    if (res.ok) setSaved(true);
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
      {/* Sidebar */}
      <aside className="w-56 bg-white rounded-xl shadow flex flex-col py-6 mr-8">
        <div>
          <div className="flex items-center gap-2 px-6 py-3 font-bold text-lg text-[#6d4c2c] bg-[#f7f5f2] rounded-t-xl">
            <span className="text-2xl">👤</span> Profile
          </div>
          <Link href="/profile/history" className="flex items-center gap-2 px-6 py-3 text-lg hover:bg-[#f7f5f2] transition">
            <span className="text-2xl">🕒</span> History Order
          </Link>
        </div>
        <div className="mt-auto px-6 py-3">
          <form action="/logout" method="POST">
            <button type="submit" className="flex items-center gap-2 text-lg text-[#6d4c2c] hover:underline">
              <span className="text-2xl">↩️</span> Log Out
            </button>
          </form>
        </div>
      </aside>
      {/* Main Content */}
      <main className="bg-white rounded-xl shadow p-10 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-8">Profile Info</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block font-semibold mb-1">Username</label>
            <input
              type="text"
              name="username"
              className="border rounded px-3 py-2 w-full bg-gray-100"
              value={profile.username}
              readOnly
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="border rounded px-3 py-2 w-full bg-gray-100"
              value={profile.email}
              readOnly
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Number Phone</label>
            <input
              type="text"
              name="phone"
              className="border rounded px-3 py-2 w-full"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <Link href="./" className="flex-1 py-2 rounded bg-[#a89c8a] text-white font-semibold shadow hover:bg-[#6d4c2c] transition flex items-center justify-center gap-2">
              <span className="text-xl">↩️</span> Back
            </Link>
            <button type="submit" className="flex-1 py-2 rounded bg-black text-white font-semibold shadow hover:bg-gray-800 transition">
              Save changes
            </button>
          </div>
        </form>
        {saved && (
          <div className="mt-6 text-center">
            <Link href="/menu" className="text-blue-600 underline font-semibold">
              Profile saved! Kembali ke menu
            </Link>
          </div>
        )}
      </main>
    </div>
  );
} 