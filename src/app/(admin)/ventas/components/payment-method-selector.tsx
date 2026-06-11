type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function PaymentMethodSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="mt-4">
      <label className="block mb-2 font-semibold">
        Método de pago
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full p-3 rounded bg-zinc-800"
      >
        <option value="CASH">
          Efectivo
        </option>

        <option value="TRANSFER">
          Transferencia
        </option>

        <option value="CARD">
          Tarjeta
        </option>

        <option value="CREDIT">
          Crédito
        </option>

        <option value="MIXED">
          Mixto
        </option>
      </select>
    </div>
  );
}