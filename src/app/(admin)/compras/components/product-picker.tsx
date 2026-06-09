"use client";

import { useState } from "react";

type Product = {
  id: string;
  code: string;
  name: string;
  brand?: string | null;
  stock: number;
  imageUrl?: string | null;
};

type Props = {
  products: Product[];
  onSelect: (product: Product) => void;
};

export default function ProductPicker({
  products,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.code
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.brand
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 text-left"
      >
        Seleccionar producto
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
         <div className="bg-zinc-900 w-full max-w-2xl h-[80vh] rounded-xl border border-zinc-800 flex flex-col">

            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                Seleccionar Producto
              </h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <input
                type="text"
                placeholder="Buscar por código, nombre o marca..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full p-3 rounded bg-zinc-800 text-white"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredProducts.length === 0 && (
                <div className="text-center text-zinc-400 py-8">
                  No se encontraron productos
                </div>
              )}

              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    onSelect(product);
                    setOpen(false);
                  }}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 rounded-xl p-3 flex gap-3 text-left"
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-zinc-700 flex-shrink-0" />
                  )}

                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">
                      {product.name}
                    </p>

                    <p className="text-zinc-400 text-sm">
                      Código: {product.code}
                    </p>

                    <p className="text-zinc-400 text-sm">
                      Marca: {product.brand || "-"}
                    </p>

                    <p className="text-green-400 text-sm">
                      Stock: {product.stock}
                    </p>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </div>
      )}
    </>
  );
}