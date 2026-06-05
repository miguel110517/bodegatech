"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

export function SearchProduct() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const currentQuery =
    searchParams.get("q") || "";

  const [search, setSearch] =
    useState(currentQuery);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params =
        new URLSearchParams(
          searchParams.toString()
        );

      if (search) {
        params.set("q", search);
      } else {
        params.delete("q");
      }

      router.replace(
        `/productos?${params.toString()}`
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

return (
  <div className="mb-6 flex gap-3">
    <input
      type="text"
      placeholder="Buscar por nombre, código o marca..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 outline-none"
    />

    <button
      type="button"
      className="bg-blue-600 hover:bg-blue-700 transition px-6 rounded-xl font-medium"
    >
      Buscar
    </button>
  </div>
);
}

