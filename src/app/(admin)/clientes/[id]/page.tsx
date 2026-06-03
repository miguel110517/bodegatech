import { prisma } from "@/lib/prisma";
import { updateCustomer } from "../actions/update-customer";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarClientePage({
  params,
}: Props) {
  const { id } = await params;

  const cliente = await prisma.customer.findUnique({
    where: {
      id,
    },
  });

  if (!cliente) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Editar Cliente
        </h1>

        <form
          action={async (formData) => {
            "use server";
            await updateCustomer(id, formData);
          }}
          className="bg-zinc-900 p-6 rounded-xl"
        >
          <input
            name="name"
            defaultValue={cliente.name}
            className="w-full p-3 rounded bg-zinc-800 mb-4"
            required
          />

          <input
            name="document"
            defaultValue={cliente.document ?? ""}
            className="w-full p-3 rounded bg-zinc-800 mb-4"
          />

          <input
            name="phone"
            defaultValue={cliente.phone ?? ""}
            className="w-full p-3 rounded bg-zinc-800 mb-4"
          />

          <input
            name="whatsapp"
            defaultValue={cliente.whatsapp ?? ""}
            className="w-full p-3 rounded bg-zinc-800 mb-4"
          />

          <input
            name="email"
            defaultValue={cliente.email ?? ""}
            className="w-full p-3 rounded bg-zinc-800 mb-4"
          />

          <input
            name="address"
            defaultValue={cliente.address ?? ""}
            className="w-full p-3 rounded bg-zinc-800 mb-4"
          />

          <textarea
            name="observations"
            defaultValue={cliente.observations ?? ""}
            className="w-full p-3 rounded bg-zinc-800 mb-4"
          />

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