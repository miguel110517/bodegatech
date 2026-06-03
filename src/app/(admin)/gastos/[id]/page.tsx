import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateExpense } from "../actions/update-expense";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditarGastoPage({
  params,
}: Props) {
  const { id } = await params;

  const gasto =
    await prisma.expense.findUnique({
      where: {
        id,
      },
    });

  if (!gasto) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Editar Gasto
        </h1>

        <form
          action={async (formData) => {
            "use server";
            await updateExpense(
              gasto.id,
              formData
            );
          }}
          className="bg-zinc-900 p-6 rounded-xl"
        >

          <div className="grid gap-4">

            <input
              name="type"
              defaultValue={gasto.type}
              className="p-3 rounded bg-zinc-800"
              required
            />

            <input
              name="amount"
              type="number"
              step="0.01"
              defaultValue={gasto.amount}
              className="p-3 rounded bg-zinc-800"
              required
            />

            <textarea
              name="description"
              defaultValue={
                gasto.description || ""
              }
              className="p-3 rounded bg-zinc-800"
            />

          </div>

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