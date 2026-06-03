import { prisma } from "@/lib/prisma";
import { updateCategory } from "../actions/update-category";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarCategoriaPage({
  params,
}: Props) {
  const { id } = await params;

  const categoria = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!categoria) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Editar Categoría
        </h1>

        <form
          action={async (formData) => {
            "use server";
            await updateCategory(id, formData);
          }}
          className="bg-zinc-900 p-6 rounded-xl"
        >
          <div className="mb-4">
            <input
              name="name"
              defaultValue={categoria.name}
              className="w-full p-3 rounded bg-zinc-800"
              required
            />
          </div>

          <div className="mb-4">
            <textarea
              name="description"
              defaultValue={categoria.description ?? ""}
              className="w-full p-3 rounded bg-zinc-800"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 px-5 py-3 rounded"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </main>
  );
}