"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal login.");
      } else {
        // Cek role user dari response
        if (data.user && data.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-1">Masuk</h1>
        <p className="mb-6 text-sm text-gray-700">Masukkan email dan password anda untuk melakukan login</p>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border rounded px-3 py-2 focus:outline-none focus:ring"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border rounded px-3 py-2 focus:outline-none focus:ring"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            disabled={loading}
          />
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button type="submit" className="w-full py-2 mt-2 rounded bg-black text-white font-semibold shadow hover:bg-gray-800 transition" disabled={loading}>{loading ? "Masuk..." : "Masuk"}</button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">Or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <button className="w-full flex items-center justify-center gap-2 border rounded py-2 bg-white hover:bg-gray-100 transition" disabled={loading}>
          <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.2 5.1 28.8 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.5 20-21 0-1.3-.1-2.7-.5-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.2 5.1 28.8 3 24 3c-7.2 0-13.4 3.8-17.1 9.7z"/><path fill="#FBBC05" d="M24 45c6.1 0 11.2-2 14.9-5.4l-6.9-5.7C30.1 36 26.7 37 24 37c-6.1 0-11.3-4.1-13.2-9.7l-7 5.4C6.6 41.2 14.7 45 24 45z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.2 3.2-4.7 7.5-11.7 7.5-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 .9 8.2 2.7l6.1-6.1C36.2 5.1 30.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.5 20-21 0-1.3-.1-2.7-.5-4z"/></g></svg>
          Continue with Google
        </button>
        <div className="text-center mt-4 text-sm">
          Belum memiliki akun?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">Daftar</Link>
        </div>
      </div>
    </div>
  );
} 