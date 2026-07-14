"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="text-sm text-ink/60 hover:text-brick-500"
    >
      Sair
    </button>
  );
}

export function DeleteHotelButton({ id, nome }) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        if (!confirm(`Excluir "${nome}"? Essa ação não pode ser desfeita.`)) return;
        await fetch(`/api/hotels/${id}`, { method: "DELETE" });
        router.refresh();
      }}
      className="text-sm text-brick-600 hover:underline"
    >
      Excluir
    </button>
  );
}
