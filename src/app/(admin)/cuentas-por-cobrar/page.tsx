import { prisma } from "@/lib/prisma";
import { createAccount } from "./actions/create-account";
import { deleteAccount } from "./actions/delete-account";

export default async function CuentasPorCobrarPage() {
    const ventas = await prisma.sale.findMany({
        include: {
            customer: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const cuentas =
        await prisma.accountReceivable.findMany({
            include: {
                sale: {
                    include: {
                        customer: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

    return (
        <main className="min-h-screen bg-black text-white p-10">
            <div className="max-w-7xl mx-auto">

                <h1 className="text-4xl font-bold mb-8">
                    Cuentas por Cobrar
                </h1>

                <form
                    action={createAccount}
                    className="bg-zinc-900 p-6 rounded-xl mb-10"
                >
                    <div className="grid md:grid-cols-4 gap-4">

                        <select
                            name="saleId"
                            className="p-3 rounded bg-zinc-800"
                            required
                        >
                            <option value="">
                                Seleccione una venta
                            </option>

                            {ventas.map((venta) => (
                                <option
                                    key={venta.id}
                                    value={venta.id}
                                >
                                    {venta.invoice || "Sin factura"} -{" "}
                                    {venta.customer.name}
                                </option>
                            ))}
                        </select>

                        <input
                            name="totalAmount"
                            type="number"
                            step="0.01"
                            placeholder="Total"
                            className="p-3 rounded bg-zinc-800"
                            required
                        />

                        <input
                            name="paidAmount"
                            type="number"
                            step="0.01"
                            placeholder="Pagado"
                            className="p-3 rounded bg-zinc-800"
                            defaultValue={0}
                        />

                        <input
                            name="dueDate"
                            type="date"
                            className="p-3 rounded bg-zinc-800"
                        />

                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 px-5 py-3 rounded mt-4"
                    >
                        Crear Cuenta
                    </button>

                </form>

                <div className="space-y-4">

                    {cuentas.map((cuenta) => (
                        <div
                            key={cuenta.id}
                            className="bg-zinc-900 p-5 rounded-xl border border-zinc-800"
                        >

                            <div className="flex justify-between items-start">

                                <div>

                                    <h2 className="text-xl font-bold">
                                        {cuenta.sale.customer.name}
                                    </h2>

                                    <p className="text-zinc-400">
                                        Factura:{" "}
                                        {cuenta.sale.invoice || "-"}
                                    </p>

                                </div>

                                <span
                                    className={
                                        cuenta.status === "PAID"
                                            ? "text-green-400 font-bold"
                                            : "text-red-400 font-bold"
                                    }
                                >
                                    {cuenta.status}
                                </span>

                            </div>

                            <div className="mt-4 space-y-1">

                                <p>
                                    Total: $
                                    {cuenta.totalAmount.toLocaleString()}
                                </p>

                                <p>
                                    Pagado: $
                                    {cuenta.paidAmount.toLocaleString()}
                                </p>

                                <p>
                                    Pendiente: $
                                    {cuenta.pendingAmount.toLocaleString()}
                                </p>

                                <p>
                                    Fecha límite:{" "}
                                    {cuenta.dueDate
                                        ? new Date(
                                            cuenta.dueDate
                                        ).toLocaleDateString()
                                        : "-"}
                                </p>

                            </div>

                            <div className="flex gap-3 mt-4">

                                <a
                                    href={`/cuentas-por-cobrar/${cuenta.id}`}
                                    className="bg-blue-600 px-4 py-2 rounded"
                                >
                                    Ver / Gestionar
                                </a>

                                <form
                                    action={async () => {
                                        "use server";
                                        await deleteAccount(cuenta.id);
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