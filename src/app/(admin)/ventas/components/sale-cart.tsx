type CartItem = {
  id: string;
  name: string;
  salePrice: number;
  quantity: number;
};

type Props = {
  cart: CartItem[];
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeProduct: (id: string) => void;
};

export default function SaleCart({
  cart,
  increase,
  decrease,
  removeProduct,
}: Props) {
  return (
    <div className="space-y-3 max-h-72 overflow-y-auto mb-6">
      {cart.length === 0 && (
        <div className="text-center py-10 text-zinc-500">
          No hay productos agregados
        </div>
      )}

      {cart.map((item) => (
        <div key={item.id} className="bg-zinc-800 rounded-xl p-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-bold text-white">{item.name}</h3>

              <p className="text-zinc-400 text-sm">
                ${item.salePrice.toLocaleString("es-CO")} x {item.quantity}
              </p>

              <p className="text-green-400 font-bold mt-1">
                ${(item.salePrice * item.quantity).toLocaleString("es-CO")}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => decrease(item.id)}
                  className="w-8 h-8 rounded bg-red-600"
                >
                  -
                </button>

                <span className="w-8 text-center">{item.quantity}</span>

                <button
                  type="button"
                  onClick={() => increase(item.id)}
                  className="w-8 h-8 rounded bg-green-600"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeProduct(item.id)}
                className="text-red-400 text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
