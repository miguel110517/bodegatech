"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct } from "../actions/create-product";

type Categoria = {
  id: string;
  name: string;
};

type Props = {
  categorias: Categoria[];
};

export function CreateProductForm({
  categorias,
}: Props) {
  const router = useRouter();

  const formRef =
    useRef<HTMLFormElement>(null);

  async function handleSubmit(
    formData: FormData
  ) {
    await createProduct(formData);

    toast.success(
      "Producto creado con éxito"
    );

    formRef.current?.reset();

    router.refresh();
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="bg-zinc-900 p-6 rounded-xl mb-10"
    >
      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <label className="block mb-2 text-sm font-medium text-zinc-300">
            Nombre del Producto
          </label>

          <input
            name="name"
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-zinc-300">
            Marca
          </label>

          <input
            name="brand"
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-zinc-300">
            URL de la Imagen
          </label>

          <input
            name="imageUrl"
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-zinc-300">
            Precio Catálogo
          </label>

          <input
            name="salePrice"
            type="number"
            step="0.01"
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-zinc-300">
            Precio Promocional
          </label>

          <input
            name="offerPrice"
            type="number"
            step="0.01"
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-zinc-300">
            Stock Mínimo
          </label>

          <input
            name="minStock"
            type="number"
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-zinc-300">
            Ubicación
          </label>

          <input
            name="location"
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-zinc-300">
            Categoría
          </label>

          <select
            name="categoryId"
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            required
          >
            <option value="">
              Seleccione categoría
            </option>

            {categorias.map((categoria) => (
              <option
                key={categoria.id}
                value={categoria.id}
              >
                {categoria.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="mt-5">
        <label className="block mb-2 text-sm font-medium text-zinc-300">
          Descripción
        </label>

        <textarea
          name="description"
          rows={5}
          className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
        />
      </div>

      <button
        type="submit"
        className="
          bg-blue-600
          hover:bg-blue-700
          px-6
          py-3
          rounded-xl
          mt-5
          font-medium
          transition
        "
      >
        Guardar Producto
      </button>
    </form>
  );
}