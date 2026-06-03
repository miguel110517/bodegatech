import { prisma } from "@/lib/prisma";
import { updateProvider } from "../actions/update-provider";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarProveedorPage({
  params,
}: Props) {
  const { id } = await params;

  const proveedor = await prisma.provider.findUnique({
    where: {
      id,
    },
  });

  if (!proveedor) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Editar Proveedor
        </h1>

        <form
          action={async (formData) => {
            "use server";
            await updateProvider(id, formData);
          }}
          className="bg-zinc-900 p-6 rounded-xl"
        >
          <div className="grid md:grid-cols-2 gap-4">

            <input
              name="name"
              defaultValue={proveedor.name}
              className="p-3 rounded bg-zinc-800"
              required
            />

            <input
              name="document"
              defaultValue={proveedor.document ?? ""}
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="phone"
              defaultValue={proveedor.phone ?? ""}
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="whatsapp"
              defaultValue={proveedor.whatsapp ?? ""}
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="email"
              defaultValue={proveedor.email ?? ""}
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="address"
              defaultValue={proveedor.address ?? ""}
              className="p-3 rounded bg-zinc-800"
            />

          </div>

          <textarea
            name="observations"
            defaultValue={proveedor.observations ?? ""}
            className="w-full p-3 rounded bg-zinc-800 mt-4"
          />

          <button
            type="submit"
            className="bg-blue-600 px-5 py-3 rounded mt-4"
          >
            Guardar Cambios
          </button>

        </form>

      </div>
    </main>
  );
}