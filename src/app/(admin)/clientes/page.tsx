import { prisma } from "@/lib/prisma";
import { createCustomer } from "./actions/create-customer";
import { deleteCustomer } from "./actions/delete-customer";

export default async function ClientesPage() {
  const clientes = await prisma.customer.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Clientes
        </h1>

        <p className="text-zinc-400 mb-8">
          Total clientes: {clientes.length}
        </p>

        <form
          action={createCustomer}
          className="bg-zinc-900 p-6 rounded-xl mb-10"
        >
          <div className="grid md:grid-cols-2 gap-4">

            <input
              name="name"
              placeholder="Nombre"
              className="p-3 rounded bg-zinc-800"
              required
            />

            <input
              name="document"
              placeholder="Documento"
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
            Guardar Cliente
          </button>

        </form>

        <div className="grid gap-4">

          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="bg-zinc-900 p-5 rounded-xl border border-zinc-800"
            >
              <h2 className="font-bold text-xl">
                {cliente.name}
              </h2>

              <p>{cliente.document}</p>
              <p>{cliente.phone}</p>
              <p>{cliente.whatsapp}</p>
              <p>{cliente.email}</p>
              <p>{cliente.address}</p>

              <div className="flex gap-3 mt-4">

                <a
                  href={`/clientes/${cliente.id}`}
                  className="bg-yellow-600 px-4 py-2 rounded"
                >
                  Editar
                </a>

                <form
                  action={async () => {
                    "use server";
                    await deleteCustomer(cliente.id);
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