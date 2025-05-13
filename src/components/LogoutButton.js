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
    <button 
      onClick={handleLogout} 
      className="py-2 px-4 rounded-lg hover:bg-gray-800 transition text-lg font-medium w-full flex items-center gap-2 justify-center"
      disabled={loading}
    >
      <span role="img" aria-label="logout">🚪</span>
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
} 