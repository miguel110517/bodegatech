import { prisma } from "@/lib/prisma";
import { createProvider } from "./actions/create-provider";
import { deleteProvider } from "./actions/delete-provider";

export default async function ProveedoresPage() {
  const proveedores = await prisma.provider.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Proveedores
        </h1>

        <p className="text-zinc-400 mb-8">
          Total proveedores: {proveedores.length}
        </p>

        <form
          action={createProvider}
          className="bg-zinc-900 p-6 rounded-xl mb-10"
        >
          <div className="grid md:grid-cols-2 gap-4">

            <input
              name="name"
              placeholder="Nombre proveedor"
              className="p-3 rounded bg-zinc-800"
              required
            />

            <input
              name="document"
              placeholder="NIT o Documento"
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="phone"
              placeholder="Teléfono"
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="whatsapp"
              placeholder="WhatsApp"
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="email"
              placeholder="Correo"
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="address"
              placeholder="Dirección"
              className="p-3 rounded bg-zinc-800"
            />

          </div>

          <textarea
            name="observations"
            placeholder="Observaciones"
            className="w-full p-3 rounded bg-zinc-800 mt-4"
          />

          <button
            type="submit"
            className="bg-blue-600 px-5 py-3 rounded mt-4"
          >
            Guardar Proveedor
          </button>

        </form>

        <div className="grid gap-4">

          {proveedores.map((proveedor) => (
            <div
              key={proveedor.id}
              className="bg-zinc-900 p-5 rounded-xl border border-zinc-800"
            >
              <h2 className="text-xl font-bold">
                {proveedor.name}
              </h2>

              <div className="mt-3 space-y-1">

                <p>
                  NIT: {proveedor.document || "-"}
                </p>

                <p>
                  Teléfono: {proveedor.phone || "-"}
                </p>

                <p>
                  WhatsApp: {proveedor.whatsapp || "-"}
                </p>

                <p>
                  Email: {proveedor.email || "-"}
                </p>

                <p>
                  Dirección: {proveedor.address || "-"}
                </p>

                <p>
                  Observaciones: {proveedor.observations || "-"}
                </p>

              </div>

              <div className="flex gap-3 mt-4">

                <a
                  href={`/proveedores/${proveedor.id}`}
                  className="bg-yellow-600 px-4 py-2 rounded"
                >
                  Editar
                </a>

                <form
                  action={async () => {
                    "use server";
                    await deleteProvider(proveedor.id);
                  }}
                >
                  <button
                    type="submit"
                    className="bg-red-600 px-4 py-2 rounded"
                  >
                    Eliminar
                  </button>
                </form>

              </div>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}