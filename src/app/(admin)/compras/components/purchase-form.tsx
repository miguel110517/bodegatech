"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
};

type Provider = {
  id: string;
  name: string;
};

type Props = {
  productos: Product[];
  proveedores: Provider[];
  action: (formData: FormData) => Promise<void>;
};

export default function PurchaseForm({
  productos,
  proveedores,
  action,
}: Props) {
  const [items, setItems] = useState([0]);

  return (
    <form
      action={action}
      className="bg-zinc-900 p-6 rounded-xl mb-10"
    >
      <div className="grid md:grid-cols-2 gap-4 mb-6">

        <select
          name="providerId"
          className="p-3 rounded bg-zinc-800"
          required
        >
          <option value="">
            Seleccione proveedor
          </option>

          {proveedores.map((proveedor) => (
            <option
              key={proveedor.id}
              value={proveedor.id}
            >
              {proveedor.name}
            </option>
          ))}
        </select>

        <input
          name="invoice"
          placeholder="Factura"
          className="p-3 rounded bg-zinc-800"
        />

      </div>

      {items.map((item, index) => (
        <div
          key={item}
          className="grid md:grid-cols-3 gap-4 mb-4"
        >
          <select
            name="productId"
            className="p-3 rounded bg-zinc-800"
            required
          >
            <option value="">
              Producto {index + 1}
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
            placeholder="Cantidad"
            className="p-3 rounded bg-zinc-800"
            required
          />

          <input
            name="costPrice"
            type="number"
            step="0.01"
            placeholder="Costo"
            className="p-3 rounded bg-zinc-800"
            required
          />
        </div>
      ))}

      <div className="flex gap-4 mt-4">

        <button
          type="button"
          onClick={() =>
            setItems([...items, Date.now()])
          }
          className="bg-green-600 px-5 py-3 rounded"
        >
          + Agregar Producto
        </button>

        <button
          type="submit"
          className="bg-blue-600 px-5 py-3 rounded"
        >
          Registrar Compra
        </button>

      </div>
    </form>
  );
}