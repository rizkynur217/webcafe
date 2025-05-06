import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import Link from "next/link";

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
    <div className="min-h-screen bg-gray-200 flex">
      {/* Sidebar */}
      <aside className="w-48 bg-[#222] text-white flex flex-col justify-between rounded-l-2xl m-4 p-4">
        <div>
          <div className="font-bold text-lg mb-6">Dashboard</div>
          <nav className="flex flex-col gap-2">
            <Link href="/admin" className="py-2 px-3 rounded bg-gray-700">Dashboard</Link>
            <Link href="/admin/menu" className="py-2 px-3 rounded hover:bg-gray-700">Menu</Link>
          </nav>
        </div>
        <div className="mb-2">
          {/* Hapus tombol logout di sidebar kiri bawah */}
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="bg-[#222] text-white rounded-xl px-6 py-3 text-xl font-semibold mb-6 w-fit">Dashboard Admin</div>
        {/* Card statistik */}
        <div className="flex gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 w-48 flex flex-col items-center">
              <div className="text-gray-600 text-sm mb-2">{s.label}</div>
              <div className="text-2xl font-bold text-red-600">{s.value}</div>
            </div>
          ))}
        </div>
        {/* Tabel pesanan terbaru */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="font-semibold mb-2">Orderan Terbaru</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">#</th>
                  <th className="border px-2 py-1">Nama Pemesan</th>
                  <th className="border px-2 py-1">Kuantitas</th>
                  <th className="border px-2 py-1">Harga</th>
                  <th className="border px-2 py-1">Waktu Pemesanan</th>
                  <th className="border px-2 py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id}>
                    <td className="border px-2 py-1 text-center">{String(i + 1).padStart(2, "0")}</td>
                    <td className="border px-2 py-1">{o.user?.name || o.user?.email || '-'}</td>
                    <td className="border px-2 py-1 text-center">{o.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                    <td className="border px-2 py-1">Rp{o.totalPrice.toLocaleString("id-ID")}</td>
                    <td className="border px-2 py-1">{formatTime(o.createdAt)}</td>
                    <td className="border px-2 py-1">
                      {o.status === "CANCELLED" ? (
                        <span className="text-red-500 font-semibold cursor-not-allowed">{STATUS_LABEL[o.status]}</span>
                      ) : (
                        <form action={`/api/admin/order-status`} method="POST">
                          <input type="hidden" name="orderId" value={o.id} />
                          <input type="hidden" name="currentStatus" value={o.status} />
                          <button type="submit" className="underline text-blue-600 font-semibold cursor-pointer">
                            {STATUS_LABEL[o.status]}
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
                {/* Baris kosong untuk tampilan */}
                {Array.from({ length: Math.max(0, 6 - orders.length) }).map((_, i) => (
                  <tr key={i+orders.length}>
                    <td className="border px-2 py-1">&nbsp;</td>
                    <td className="border px-2 py-1">&nbsp;</td>
                    <td className="border px-2 py-1">&nbsp;</td>
                    <td className="border px-2 py-1">&nbsp;</td>
                    <td className="border px-2 py-1">&nbsp;</td>
                    <td className="border px-2 py-1">&nbsp;</td>
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

function redirect(path) {
  if (typeof window !== "undefined") {
    window.location.href = path;
  } else {
    // SSR Next.js
    // eslint-disable-next-line no-undef
    return globalThis.Response.redirect(path, 302);
  }
} 