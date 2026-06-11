type Props = {
  cashAmount: number;
  setCashAmount: (value: number) => void;

  transferAmount: number;
  setTransferAmount: (value: number) => void;

  cardAmount: number;
  setCardAmount: (value: number) => void;

  creditAmount: number;
  setCreditAmount: (value: number) => void;

  totalRegistrado: number;
};

export default function MixedPaymentForm({
  cashAmount,
  setCashAmount,
  transferAmount,
  setTransferAmount,
  cardAmount,
  setCardAmount,
  creditAmount,
  setCreditAmount,
  totalRegistrado,
}: Props) {
  return (
    <div className="space-y-3 mt-4">
      <h3 className="text-lg font-bold">
        Distribución del pago
      </h3>

      <div>
        <label>Efectivo</label>

        <input
          type="number"
          value={cashAmount || ""}
          onChange={(e) =>
            setCashAmount(
              Number(e.target.value || 0)
            )
          }
          className="w-full p-3 rounded bg-zinc-800"
        />
      </div>

      <div>
        <label>Transferencia</label>

        <input
          type="number"
          value={transferAmount || ""}
          onChange={(e) =>
            setTransferAmount(
              Number(e.target.value || 0)
            )
          }
          className="w-full p-3 rounded bg-zinc-800"
        />
      </div>

      <div>
        <label>Tarjeta</label>

        <input
          type="number"
          value={cardAmount || ""}
          onChange={(e) =>
            setCardAmount(
              Number(e.target.value || 0)
            )
          }
          className="w-full p-3 rounded bg-zinc-800"
        />
      </div>

      <div>
        <label>Crédito</label>

        <input
          type="number"
          value={creditAmount || ""}
          onChange={(e) =>
            setCreditAmount(
              Number(e.target.value || 0)
            )
          }
          className="w-full p-3 rounded bg-zinc-800"
        />
      </div>

      <div className="flex justify-between text-lg font-bold text-yellow-400">
        <span>Total registrado</span>

        <span>
          $
          {totalRegistrado.toLocaleString(
            "es-CO"
          )}
        </span>
      </div>
    </div>
  );
}