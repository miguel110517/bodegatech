"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
};

type Props = {
  productos: Product[];
};

export default function SaleForm({
  productos,
}: Props) {
  const [items, setItems] = useState([
    {
      id: Date.now(),
    },
  ]);

  function addItem() {
    setItems([
      ...items,
      {
        id: Date.now(),
      },
    ]);
  }

  function removeItem(id: number) {
    if (items.length === 1) return;

    setItems(
      items.filter((item) => item.id !== id)
    );
  }

  return (
    <>
      {items.map((item, index) => (
        <div
          key={item.id}
          className="border border-zinc-700 rounded-lg p-4 mb-4"
        >
          <h3 className="font-bold mb-3">
            Producto {index + 1}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <select
              name="productId"
              className="p-3 rounded bg-zinc-800"
              required
            >
              <option value="">
                Seleccione producto
              </option>

              {productos.map((producto) => (
                <option
                  key={producto.id}
                  value={producto.id}
                >
                  {producto.name}
                </option>
              ))}
            </select>

            <input
              name="quantity"
              type="number"
              min="1"
              placeholder="Cantidad"
              className="p-3 rounded bg-zinc-800"
              required
            />

          </div>

          {items.length > 1 && (
            <button
              type="button"
              onClick={() =>
                removeItem(item.id)
              }
              className="bg-red-600 px-3 py-2 rounded mt-3"
            >
              Eliminar Producto
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="bg-green-600 px-4 py-2 rounded"
      >
        + Agregar Producto
      </button>
    </>
  );
}