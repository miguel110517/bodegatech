type Props = {
  dueDate: string;
  setDueDate: (value: string) => void;
};

export default function CreditPaymentForm({
  dueDate,
  setDueDate,
}: Props) {
  return (
    <div>
      <label className="block mb-2">
        Fecha límite de pago
      </label>

      <input
        type="date"
        value={dueDate}
        onChange={(e) =>
          setDueDate(e.target.value)
        }
        className="w-full p-3 rounded bg-zinc-800"
        required
      />
    </div>
  );
}