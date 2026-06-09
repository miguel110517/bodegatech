"use client";

import { useState } from "react";

type Product = {
  id: string;
  code?: string;
  name: string;
  brand?: string | null;
  stock: number;
  salePrice: number;
  imageUrl?: string | null;
};

type Props = {
  products: Product[];
  onSelect: (product: Product) => void;
};

export default function ProductPicker({ products, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.code?.toLowerCase().includes(search.toLowerCase()) ||
      product.brand?.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full p-3 rounded bg-blue-600 hover:bg-blue-700"
      >
        + Agregar Producto
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-w-3xl h-[80vh] rounded-xl border border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">Seleccionar Producto</h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-2xl text-zinc-400"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 rounded bg-zinc-800"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    onSelect(product);
                    setOpen(false);
                  }}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 rounded-xl p-4 text-left"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{product.name}</p>

                      <p className="text-sm text-zinc-400">
                        Código: {product.code || "-"}
                      </p>

                      <p className="text-sm text-zinc-400">
                        Marca: {product.brand || "-"}
                      </p>

                      <p className="text-sm text-green-400">
                        Stock: {product.stock}
                      </p>
                    </div>

                    <div className="text-green-400 font-bold text-lg">
                      ${product.salePrice.toLocaleString("es-CO")}
                    </div>
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
