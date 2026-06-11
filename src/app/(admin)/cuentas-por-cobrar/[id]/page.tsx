export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createPayment } from "../actions/create-payment";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function CuentaDetallePage({
  params,
}: Props) {
  const { id } = await params;

  const cuenta =
    await prisma.accountReceivable.findUnique({
      where: {
        id,
      },
      include: {
        sale: {
          include: {
            customer: true,
          },
        },
        payments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  if (!cuenta) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Cuenta por Cobrar
        </h1>

        <div className="bg-zinc-900 p-6 rounded-xl mb-8">

          <p>
            <strong>Cliente:</strong>{" "}
            {cuenta.sale.customer.name}
          </p>

          <p>
            <strong>Factura:</strong>{" "}
            {cuenta.sale.invoice || "-"}
          </p>

          <p>
            <strong>Total:</strong>{" "}
            ${cuenta.totalAmount.toLocaleString()}
          </p>

          <p>
            <strong>Pagado:</strong>{" "}
            ${cuenta.paidAmount.toLocaleString()}
          </p>

          <p>
            <strong>Pendiente:</strong>{" "}
            ${cuenta.pendingAmount.toLocaleString()}
          </p>

          <p>
            <strong>Estado:</strong>{" "}
            <span
              className={
                cuenta.status === "PAID"
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {cuenta.status}
            </span>
          </p>

        </div>

        <form
          action={createPayment}
          className="bg-zinc-900 p-6 rounded-xl mb-8"
        >
          <input
            type="hidden"
            name="accountId"
            value={cuenta.id}
          />

          <div className="grid gap-4">

            <input
              name="amount"
              type="number"
              step="0.01"
              placeholder="Valor del abono"
              className="p-3 rounded bg-zinc-800"
              required
            />

            <textarea
              name="notes"
              placeholder="Observaciones"
              className="p-3 rounded bg-zinc-800"
            />

          </div>

          <button
            type="submit"
            className="bg-blue-600 px-5 py-3 rounded mt-4"
          >
            Registrar Abono
          </button>

        </form>

        <h2 className="text-2xl font-bold mb-4">
          Historial de Abonos
        </h2>

        <div className="space-y-3">

          {cuenta.payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-zinc-900 p-4 rounded-xl"
            >
              <p>
                Abono: $
                {payment.amount.toLocaleString()}
              </p>

              <p className="text-zinc-400">
                {payment.notes || "-"}
              </p>

              <p className="text-sm text-zinc-500">
                {new Date(
                  payment.createdAt
                ).toLocaleString()}
              </p>
            </div>
          ))}

        </div>

      </div>
    </main>
  );
}