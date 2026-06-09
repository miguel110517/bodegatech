"use client";

import { createCategory } from "../actions/create-category";
import { toast } from "sonner";

export function CreateCategoryForm() {
  async function action(formData: FormData) {
    try {
      await createCategory(formData);

      toast.success(
        "Categoría creada correctamente"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Ocurrió un error"
      );
    }
  }

  return (
    <form
      action={action}
      className="bg-zinc-900 p-6 rounded-xl mb-8"
    >
      <div className="mb-4">
        <input
          name="name"
          placeholder="Nombre categoría"
          className="w-full p-3 rounded bg-zinc-800"
          required
        />
      </div>

      <div className="mb-4">
        <textarea
          name="description"
          placeholder="Descripción"
          className="w-full p-3 rounded bg-zinc-800"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded"
      >
        Guardar Categoría
      </button>
    </form>
  );
}