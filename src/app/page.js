import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("userId");
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-amber-900">
      {/* Background image, ganti 'bg.jpg' di public/ sesuai kebutuhan */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg.jpg" // Ganti file ini di public/bg.jpg untuk mengubah background
          alt="Coffee Shop Background"
          fill
          style={{ objectFit: "cover" }}
          className="brightness-75"
          priority
        />
      </div>

      {/* Tombol pojok kanan atas */}
      <div className="absolute top-6 right-8 flex gap-2 z-10">
        {isLoggedIn ? (
          <>
            <Link href="/profile">
              <button className="px-4 py-1 rounded bg-white/80 hover:bg-white font-medium shadow">Profile</button>
            </Link>
            <Link href="#logout">
              {/* LogoutButton sudah ada di layout, jadi tombol ini hanya placeholder */}
              <span className="px-4 py-1 rounded bg-white/80 font-medium shadow text-gray-400 cursor-not-allowed">Logout</span>
            </Link>
          </>
        ) : (
          <>
            <Link href="/register">
              <button className="px-6 py-2 rounded-lg bg-[#2C2C2C] hover:bg-gray-800 text-white font-medium shadow text-lg">Sign Up</button>
            </Link>
            <Link href="/login">
              <button className="px-6 py-2 rounded-lg bg-[#2C2C2C] hover:bg-gray-800 text-white font-medium shadow text-lg">Sign In</button>
            </Link>
          </>
        )}
      </div>

      {/* Card motivasi */}
      <div className="w-full max-w-md md:max-w-2xl bg-white/80 rounded-xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 mb-8 mt-16">
        {/* Gambar kopi, ganti 'coffee-cup.png' di public/ sesuai kebutuhan */}
        <div className="flex-shrink-0">
          <Image
            src="/coffee-cup.png"
            alt="Coffee Cup"
            width={120}
            height={120}
            className="object-contain"
            priority
          />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-lg md:text-2xl font-semibold mb-2">Not every day starts perfectly, but coffee gives you a reason to smile anyway</h2>
        </div>
      </div>

      {/* Tombol navigasi utama */}
      <div className="w-full max-w-md flex flex-col gap-4 mb-8">
        <Link href="/menu">
          <button className="w-full py-3 rounded-lg bg-[#2C2C2C] text-white font-semibold shadow hover:bg-gray-800 transition flex items-center justify-center gap-2">
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zM16 9v1c0 2.76-2.24 5-5 5s-5-2.24-5-5V5h10v4h-2.5V7.5h2V6H8v3h2V7.5H8.5V9H16zm2.5-4H16V4h2.5c.83 0 1.5.67 1.5 1.5S19.33 5 18.5 5z"/>
            </svg>
            Menu
          </button>
        </Link>
        <a
          href="tel:+1234567890" // Replace with your actual phone number
        >
          <button className="w-full py-3 rounded-lg bg-[#2C2C2C] text-white font-semibold shadow hover:bg-gray-800 transition flex items-center justify-center gap-2">
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2c0-4.97-4.03-9-9-9v2c3.87 0 7 3.13 7 7z"/>
            </svg>
            Contact
          </button>
        </a>
        <a
          href="https://maps.google.com/?q=Your+Coffee+Shop+Address" // Ganti dengan link Google Maps Anda
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="w-full py-3 rounded-lg bg-[#2C2C2C] text-white font-semibold shadow hover:bg-gray-800 transition flex items-center justify-center gap-2">
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            Google Maps
          </button>
        </a>
      </div>

      {/* Horizontal lines */}
      <div className="w-[780px] flex flex-col gap-2 mb-8">
        <hr className="border-black" />
        <hr className="border-black" />
      </div>

      {/* Navigasi sosial media */}
      <div className="flex gap-8 items-center justify-center mb-6">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block p-2 bg-[#2C2C2C] rounded-full hover:bg-gray-800 transition-colors">
          <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
            <path d="M16 3H8C5.243 3 3 5.243 3 8v8c0 2.757 2.243 5 5 5h8c2.757 0 5-2.243 5-5V8c0-2.757-2.243-5-5-5zm3 13c0 1.654-1.346 3-3 3H8c-1.654 0-3-1.346-3-3V8c0-1.654 1.346-3 3-3h8c1.654 0 3 1.346 3 3v8z"/>
            <path d="M12 7c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 8c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3z"/>
            <circle cx="17" cy="7" r="1"/>
          </svg>
        </a>
        <a href="mailto:info@coffeeshop.com" className="block p-2 bg-[#2C2C2C] rounded-full hover:bg-gray-800 transition-colors">
          <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </a>
        <a href="https://tiktok.com/@yourcoffeeshop" target="_blank" rel="noopener noreferrer" className="block p-2 bg-[#2C2C2C] rounded-full hover:bg-gray-800 transition-colors">
          <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
