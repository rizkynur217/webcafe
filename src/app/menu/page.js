import Image from "next/image";

const categories = [
  { label: "All" },
  { label: "Main Course" },
  { label: "Coffee" },
  { label: "non-Coffee" },
  { label: "Snack" },
  { label: "Dessert" },
];

const menuDummy = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  name: "Milk Coffee",
  desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  price: 12000,
  image: "/coffee-cup.png", // Ganti dengan gambar menu Anda
  qty: 10,
}));

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Navbar */}
      <nav className="flex justify-center mt-4 mb-8">
        <div className="flex gap-6 bg-black rounded-full px-8 py-2 text-white font-medium text-lg shadow">
          <a href="./" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Reviews</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </nav>

      {/* Judul */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Our Best & Special Menu</h1>

      {/* Kategori */}
      <div className="flex justify-center gap-6 mb-8 flex-wrap">
        {categories.map((cat, i) => (
          <button
            key={cat.label}
            className={`pb-1 px-2 text-lg font-medium border-b-2 transition-all ${i === 0 ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black hover:border-black"}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
        {menuDummy.map((item) => (
          <div key={item.id} className="bg-black rounded-xl shadow-lg p-4 flex flex-col items-center text-white">
            <div className="w-32 h-32 mb-4 relative">
              <Image src={item.image} alt={item.name} fill style={{ objectFit: "contain" }} />
            </div>
            <div className="w-full">
              <div className="font-bold text-lg mb-1">{item.name}</div>
              <div className="text-gray-300 text-sm mb-2">{item.desc}</div>
              <div className="flex items-center justify-between mt-4">
                <span className="font-bold text-base">Rp{item.price.toLocaleString("id-ID")}</span>
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 rounded-full border border-white flex items-center justify-center text-xl">-</button>
                  <span>{item.qty}</span>
                  <button className="w-7 h-7 rounded-full border border-white flex items-center justify-center text-xl">+</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Bar */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-8 bg-[#2d2323] text-white rounded-full px-8 py-3 flex items-center gap-12 shadow-lg text-lg font-semibold z-20">
        <span>10 item</span>
        <span>120.000</span>
        <span className="text-2xl">🛒</span>
      </div>
    </div>
  );
} 