"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg"
    >
      ← Volver
    </button>
  );
}