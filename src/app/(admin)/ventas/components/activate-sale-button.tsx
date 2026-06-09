"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { activateSale } from "../actions/activate-sale";

export function ActivateSaleButton({
  saleId,
}: {
  saleId: string;
}) {
  const router = useRouter();

  async function handleActivate() {
    await activateSale(saleId);

    toast.success(
      "Venta activada correctamente"
    );

    setTimeout(() => {
      router.refresh();
    }, 1000);
  }

  return (
    <button
      onClick={handleActivate}
      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
    >
      Activar
    </button>
  );
}