"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setLoading(false);
    router.push("/");
    router.refresh && router.refresh();
  };
  return (
    <button onClick={handleLogout} className="px-4 py-1 rounded bg-red-500 text-white font-medium shadow ml-2" disabled={loading}>
      {loading ? "Logout..." : "Logout"}
    </button>
  );
} 