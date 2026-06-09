"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProviderPicker from "./provider-picker";
import ProductPicker from "./product-picker";

type Props = {
  compra: any;
  productos: any[];
  proveedores: any[];
  action: (formData: FormData) => Promise<void>;
};

export default function EditPurchaseForm({
  compra,
  productos,
  proveedores,
  action,
}: Props) {

  const router = useRouter();
  const [providerId, setProviderId] = useState(
    compra.providerId
  );

  const [providerName, setProviderName] =
    useState(
      proveedores.find(
        (p) => p.id === compra.providerId
      )?.name || ""
    );

  const [items, setItems] = useState(
    compra.items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      productLabel: `${item.product.code} - ${item.product.name}`,
      quantity: item.quantity.toString(),
      costPrice: item.costPrice.toString(),
    }))
  );

  const total = items.reduce(
    (acc: number, item: any) =>
      acc +
      (Number(item.quantity) || 0) *
      (Number(item.costPrice) || 0),
    0
  );

  async function handleSubmit(formData: FormData) {
    await action(formData);

    toast.success(
      "Compra actualizada correctamente"
    );

    router.push("/compras");
    router.refresh();
  }

  return (
    <form
      action={handleSubmit}
      className="bg-zinc-900 p-6 rounded-xl"
    >
      <div className="mb-6">
        <label className="block mb-2 text-sm text-zinc-400">
          Proveedor
        </label>

        <ProviderPicker
          providers={proveedores}
          onSelect={(provider) => {
            setProviderId(provider.id);
            setProviderName(provider.name);
          }}
        />

        <input
          type="hidden"
          name="providerId"
          value={providerId}
        />

        {providerName && (
          <div className="mt-2 p-3 bg-zinc-800 rounded">
            <span className="text-green-400 font-semibold">
              Seleccionado:
            </span>{" "}
            {providerName}
          </div>
        )}
      </div>

      {items.map((item: any, index: number) => (
        <div
          key={item.id}
          className="grid md:grid-cols-4 gap-4 mb-4"
        >
          <div>
            <label className="block text-xs text-zinc-400 mb-1">
              Producto
            </label>

            <ProductPicker
              products={productos}
              onSelect={(product) => {
                setItems((prev: any[]) =>
                  prev.map((row, i) =>
                    i === index
                      ? {
                        ...row,
                        productId: product.id,
                        productLabel: `${product.code} - ${product.name}`,
                      }
                      : row
                  )
                );
              }}
            />

            <input
              type="hidden"
              name="productId"
              value={item.productId}
            />

            <div className="mt-2 p-3 bg-zinc-800 rounded">
              <span className="text-green-400 font-semibold">
                Seleccionado:
              </span>{" "}
              {item.productLabel || "Sin producto"}
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">
              Cantidad
            </label>

            <input
              name="quantity"
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                setItems((prev: any[]) =>
                  prev.map((row, i) =>
                    i === index
                      ? {
                        ...row,
                        quantity: e.target.value,
                      }
                      : row
                  )
                )
              }
              className="w-full p-3 rounded bg-zinc-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">
              Costo Unitario
            </label>

            <input
              name="costPrice"
              type="number"
              min="0.01"
              step="0.01"
              value={item.costPrice}
              onChange={(e) =>
                setItems((prev: any[]) =>
                  prev.map((row, i) =>
                    i === index
                      ? {
                        ...row,
                        costPrice: e.target.value,
                      }
                      : row
                  )
                )
              }
              className="w-full p-3 rounded bg-zinc-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">
              Acción
            </label>

            <button
              type="button"
              onClick={() => {
                if (items.length === 1) {
                  toast.error(
                    "Debe existir al menos un producto"
                  );
                  return;
                }

                setItems(
                  items.filter(
                    (_: any, i: number) =>
                      i !== index
                  )
                );
              }}
              className="w-full bg-red-600 rounded p-3"
            >
              ✕ Eliminar
            </button>
          </div>
        </div>
      ))}
      
      <div className="bg-zinc-800 rounded-xl p-4 mt-6 mb-4">
        <p className="text-zinc-400">
          Productos: {items.length}
        </p>

        <p className="text-2xl font-bold text-green-400">
          Total: ${total.toLocaleString()}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() =>
            setItems([
              ...items,
              {
                id: Date.now(),
                productId: "",
                productLabel: "",
                quantity: "",
                costPrice: "",
              },
            ])
          }
          className="bg-green-600 px-5 py-3 rounded"
        >
          + Agregar Producto
        </button>

        <button
          type="submit"
          className="bg-blue-600 px-5 py-3 rounded"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}