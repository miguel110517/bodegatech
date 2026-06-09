"use client";

type Props = {
  subtotal: number;
  discount: string;
  setDiscount: (value: string) => void;
  total: number;
};

export default function SaleSummary({
  subtotal,
  discount,
  setDiscount,
  total,
}: Props) {
  function formatMoney(value: number) {
    return value.toLocaleString("es-CO");
  }

  return (
    <div className="space-y-4 border-t border-zinc-800 pt-4">
      <div className="flex justify-between">
        <span className="text-zinc-400">Subtotal</span>

        <span className="font-bold">${formatMoney(subtotal)}</span>
      </div>

      <div>
        <label className="text-sm text-zinc-400">Descuento</label>

        <input
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={discount}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");

            setDiscount(value);
          }}
          className="w-full p-3 rounded bg-zinc-800"
        />
      </div>

      <div className="flex justify-between text-2xl font-bold text-green-400">
        <span>Total</span>

        <span>${formatMoney(total)}</span>
      </div>
    </div>
  );
}
