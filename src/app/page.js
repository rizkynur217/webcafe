import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("userId");
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-200">
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
              <button className="px-4 py-1 rounded bg-white/80 hover:bg-white font-medium shadow">Sign Up</button>
            </Link>
            <Link href="/login">
              <button className="px-4 py-1 rounded bg-white/80 hover:bg-white font-medium shadow">Sign In</button>
            </Link>
          </>
        )}
      </div>

      {/* Card motivasi */}
      <div className="w-full max-w-md md:max-w-2xl bg-white/80 rounded-xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 mb-8 mt-16">
        {/* Gambar kopi, ganti 'coffee-cup.png' di public/ sesuai kebutuhan */}
        <div className="flex-shrink-0">
            <Image
            src="/coffee-cup.png" // Ganti file ini di public/coffee-cup.png untuk mengubah gambar kopi
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
          <button className="w-full py-3 rounded bg-black text-white font-semibold shadow hover:bg-gray-800 transition flex items-center justify-center gap-2">
            <span role="img" aria-label="menu">☕</span> MENU
          </button>
        </Link>
        <a
          href="https://instagram.com/yourprofile" // Ganti dengan link Instagram Anda
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="w-full py-3 rounded bg-black text-white font-semibold shadow hover:bg-gray-800 transition flex items-center justify-center gap-2">
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.425 3.678 1.406 2.697 2.387 2.403 3.499 2.344 4.78.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.059 1.281.353 2.393 1.334 3.374.981.981 2.093 1.275 3.374 1.334C8.332 23.987 8.741 24 12 24c3.259 0 3.668-.013 4.948-.072 1.281-.059 2.393-.353 3.374-1.334.981-.981 1.275-2.093 1.334-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.281-.353-2.393-1.334-3.374-.981-.981-2.093-1.275-3.374-1.334C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            Instagram
          </button>
        </a>
        <a
          href="https://maps.google.com/?q=Your+Coffee+Shop+Address" // Ganti dengan link Google Maps Anda
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="w-full py-3 rounded bg-black text-white font-semibold shadow hover:bg-gray-800 transition flex items-center justify-center gap-2">
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            Google Maps
          </button>
        </a>
      </div>

      {/* Navigasi sosial media */}
      <div className="flex gap-8 items-center justify-center mb-6">
        {/* Ganti href sesuai kebutuhan */}
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700">
          <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.425 3.678 1.406 2.697 2.387 2.403 3.499 2.344 4.78.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.059 1.281.353 2.393 1.334 3.374.981.981 2.093 1.275 3.374 1.334C8.332 23.987 8.741 24 12 24c3.259 0 3.668-.013 4.948-.072 1.281-.059 2.393-.353 3.374-1.334.981-.981 1.275-2.093 1.334-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.281-.353-2.393-1.334-3.374-.981-.981-2.093-1.275-3.374-1.334C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
        </a>
        <a href="mailto:info@coffeeshop.com" className="text-black hover:text-gray-700">
          <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M12 13.065l-8.485-6.364A2 2 0 0 1 5.343 4h13.314a2 2 0 0 1 1.828 2.701L12 13.065zm8.485 1.414l-8.485 6.364-8.485-6.364A2 2 0 0 1 2 17.657V6.343a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v11.314a2 2 0 0 1-1.515 1.922z"/></svg>
        </a>
        {/* Tambahkan icon lain sesuai kebutuhan */}
      </div>
    </div>
  );
}
