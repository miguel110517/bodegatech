"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { activatePurchase } from "../actions/activate-purchase";

export function ActivatePurchaseButton({
  purchaseId,
}: {
  purchaseId: string;
}) {
  const router = useRouter();

  async function handleActivate() {
    await activatePurchase(purchaseId);

    toast.success(
      "Compra activada correctamente"
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