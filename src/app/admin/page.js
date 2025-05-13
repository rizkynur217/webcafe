import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

const STATUS_ORDER = ["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"];
const STATUS_LABEL = {
  PENDING: "Menunggu",
  PROCESSING: "Berproses",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export default async function AdminDashboard() {
  // Cek login
  const cookie = await cookies().get("userId");
  if (!cookie) {
    return redirect("/");
  }
  // Ambil user dari database
  const user = await prisma.user.findUnique({ where: { id: Number(cookie.value) } });
  if (!user || user.role !== "ADMIN") {
    return redirect("/");
  }

  // Query statistik dari database
  const totalPesanan = await prisma.order.count();
  const jumlahPengguna = await prisma.user.count();
  const jumlahMenu = await prisma.menuItem.count();
  const totalRevenueAgg = await prisma.order.aggregate({ _sum: { totalPrice: true } });
  const totalRevenue = totalRevenueAgg._sum.totalPrice || 0;

  const stats = [
    { label: "Total Pesanan", value: totalPesanan },
    { label: "Jumlah Pengguna", value: jumlahPengguna },
    { label: "Jumlah Menu", value: jumlahMenu },
    { label: "Total Revenue", value: `Rp${totalRevenue.toLocaleString("id-ID")}` },
  ];

  // Query order terbaru
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: true,
    },
    take: 10,
  });

  // Helper untuk format waktu
  function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString("id-ID", { hour12: false });
  }

  // Helper untuk update status (dummy, akan dihubungkan ke API)
  async function handleStatusClick(orderId, currentStatus) {
    if (currentStatus === "CANCELLED") return;
    // Nanti: fetch('/api/admin/order-status', { method: 'POST', body: ... })
    // Untuk SSR, perlu diubah ke client component jika ingin interaktif langsung
    alert(`Update status order #${orderId}`);
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-black text-white flex flex-col items-center py-8 rounded-r-3xl mr-8 min-h-screen">
        <div className="flex flex-col justify-between h-full w-full">
          <div>
            <div className="text-2xl font-bold text-center mb-8">Dashboard</div>
            <nav className="flex flex-col gap-4 px-6">
              <Link href="/admin" className="py-2 px-4 rounded-lg bg-gray-800 text-white text-lg font-medium flex items-center gap-2">
                <span role="img" aria-label="home">🏠</span>
                Dashboard
              </Link>
              <Link href="/admin/menu" className="py-2 px-4 rounded-lg hover:bg-gray-800 transition text-lg font-medium flex items-center gap-2">
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
        </div>

        {/* Card statistik dengan styling yang diperbarui */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-black rounded-2xl shadow-lg p-6 flex flex-col items-center text-white">
              <div className="text-gray-300 text-lg mb-2">{s.label}</div>
              <div className="text-2xl font-bold">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabel pesanan terbaru dengan styling yang diperbarui */}
        <div className="bg-black rounded-2xl shadow-lg p-6 text-white">
          <div className="text-xl font-bold mb-6">Orderan Terbaru</div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Nama Pemesan</th>
                  <th className="px-4 py-3 text-left">Kuantitas</th>
                  <th className="px-4 py-3 text-left">Harga</th>
                  <th className="px-4 py-3 text-left">Waktu Pemesanan</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id} className="border-b border-gray-700">
                    <td className="px-4 py-3">{String(i + 1).padStart(2, "0")}</td>
                    <td className="px-4 py-3">{o.user?.name || o.user?.email || '-'}</td>
                    <td className="px-4 py-3">{o.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                    <td className="px-4 py-3">Rp{o.totalPrice.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3">{formatTime(o.createdAt)}</td>
                    <td className="px-4 py-3">
                      {o.status === "CANCELLED" ? (
                        <span className="text-red-400 font-semibold cursor-not-allowed">{STATUS_LABEL[o.status]}</span>
                      ) : (
                        <form action={`/api/admin/order-status`} method="POST">
                          <input type="hidden" name="orderId" value={o.id} />
                          <input type="hidden" name="currentStatus" value={o.status} />
                          <button type="submit" className="text-blue-400 font-semibold hover:text-blue-300 transition">
                            {STATUS_LABEL[o.status]}
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
                {/* Baris kosong untuk tampilan */}
                {Array.from({ length: Math.max(0, 6 - orders.length) }).map((_, i) => (
                  <tr key={i+orders.length} className="border-b border-gray-700">
                    <td className="px-4 py-3">&nbsp;</td>
                    <td className="px-4 py-3">&nbsp;</td>
                    <td className="px-4 py-3">&nbsp;</td>
                    <td className="px-4 py-3">&nbsp;</td>
                    <td className="px-4 py-3">&nbsp;</td>
                    <td className="px-4 py-3">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
} 