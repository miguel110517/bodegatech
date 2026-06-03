import { prisma } from "@/lib/prisma";
import { createExpense } from "./actions/create-expense";
import { deleteExpense } from "./actions/delete-expense";

export default async function GastosPage() {
  const gastos =
    await prisma.expense.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  const total = gastos.reduce(
    (acum, gasto) =>
      acum + gasto.amount,
    0
  );

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Gastos
        </h1>

        <form
          action={createExpense}
          className="bg-zinc-900 p-6 rounded-xl mb-10"
        >
          <div className="grid md:grid-cols-3 gap-4">

            <input
              name="type"
              placeholder="Tipo de gasto"
              className="p-3 rounded bg-zinc-800"
              required
            />

            <input
              name="amount"
              type="number"
              step="0.01"
              placeholder="Valor"
              className="p-3 rounded bg-zinc-800"
              required
            />

            <input
              name="description"
              placeholder="Descripción"
              className="p-3 rounded bg-zinc-800"
            />

          </div>

          <button
            type="submit"
            className="bg-blue-600 px-5 py-3 rounded mt-4"
          >
            Registrar Gasto
          </button>

        </form>

        <div className="bg-zinc-900 p-5 rounded-xl mb-8">
          <h2 className="text-2xl font-bold">
            Total Gastos: $
            {total.toLocaleString()}
          </h2>
        </div>

        <div className="space-y-4">

          {gastos.map((gasto) => (
            <div
              key={gasto.id}
              className="bg-zinc-900 p-5 rounded-xl border border-zinc-800"
            >
              <h2 className="text-xl font-bold">
                {gasto.type}
              </h2>

              <p>
                $
                {gasto.amount.toLocaleString()}
              </p>

              <p className="text-zinc-400">
                {gasto.description || "-"}
              </p>

              <div className="flex gap-3 mt-4">

                <a
                  href={`/gastos/${gasto.id}`}
                  className="bg-yellow-600 px-4 py-2 rounded"
                >
                  Editar
                </a>

                <form
                  action={async () => {
                    "use server";
                    await deleteExpense(
                      gasto.id
                    );
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