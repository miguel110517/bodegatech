"use client";

import { createSale } from "../actions/create-sale";
import { useState } from "react";
import CustomerPicker from "./customer-picker";
import ProductPicker from "./product-picker";
import SaleCart from "./sale-cart";
import SaleSummary from "./sale-summary";
import { toast } from "sonner";
type Customer = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  salePrice: number;
  stock: number;
};

type CartItem = Product & {
  quantity: number;
};

type Props = {
  productos: Product[];
  clientes: Customer[];
};

export default function SaleForm({ productos, clientes }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [customerId, setCustomerId] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const [discount, setDiscount] = useState("");

  const [receivedAmount, setReceivedAmount] = useState<number>(0);

  function addProduct(product: Product) {
    const exists = cart.find((item) => item.id === product.id);

    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        ),
      );

      return;
    }

    setCart([
      ...cart,
      {
        ...product,
        quantity: 1,
      },
    ]);
  }

  function increase(productId: string) {
    setCart(
      cart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  }

  function decrease(productId: string) {
    setCart(
      cart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeProduct(productId: string) {
    setCart(cart.filter((item) => item.id !== productId));
  }

  const subtotal = cart.reduce(
    (acc, item) => acc + item.salePrice * item.quantity,
    0,
  );

  const discountValue = Number(discount || 0);

  const total = subtotal - discountValue;

  const change = receivedAmount > total ? receivedAmount - total : 0;

  return (
    <form
      action={async (formData) => {
        try {
          await createSale(formData);

          toast.success("Venta registrada correctamente");

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Error al registrar la venta",
          );
        }
      }}
      className="mb-10"
    >
      <input type="hidden" name="customerId" value={customerId} />

      <input type="hidden" name="paymentMethod" value={paymentMethod} />

      <input type="hidden" name="discount" value={discount} />

      <input type="hidden" name="notes" value="" />

      {cart.map((item) => (
        <div key={item.id}>
          <input type="hidden" name="productId" value={item.id} />

          <input type="hidden" name="quantity" value={item.quantity} />
        </div>
      ))}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* IZQUIERDA */}

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Productos</h2>

          <ProductPicker products={productos} onSelect={addProduct} />

          <div className="mt-6 text-zinc-400">
            Selecciona productos desde el buscador.
          </div>
        </div>
        {/* DERECHA */}

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Venta Actual</h2>

          <CustomerPicker
            customers={clientes}
            selectedCustomer={selectedCustomer}
            onSelect={(customer) => {
              setCustomerId(customer.id);
              setSelectedCustomer(customer);
            }}
          />

          <SaleCart
            cart={cart}
            increase={increase}
            decrease={decrease}
            removeProduct={removeProduct}
          />
          <SaleSummary
            subtotal={subtotal}
            discount={discount}
            setDiscount={setDiscount}
            total={total}
          />

          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-zinc-400">Método de pago</label>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 rounded bg-zinc-800"
              >
                <option value="CASH">Efectivo</option>

                <option value="TRANSFER">Transferencia</option>

                <option value="CARD">Tarjeta</option>

                <option value="CREDIT">Crédito</option>
              </select>
            </div>

            {paymentMethod === "CASH" && (
              <>
                <div>
                  <label className="text-sm text-zinc-400">Recibe</label>

                  <input
                    type="number"
                    value={receivedAmount || ""}
                    onChange={(e) =>
                      setReceivedAmount(Number(e.target.value || 0))
                    }
                    className="w-full p-3 rounded bg-zinc-800"
                  />
                </div>

                <div className="flex justify-between text-xl font-bold text-yellow-400">
                  <span>Cambio</span>

                  <span>${change.toLocaleString("es-CO")}</span>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={cart.length === 0 || !customerId}
            className="
    w-full
    bg-green-600
    hover:bg-green-700
    py-5
    rounded-xl
    text-xl
    font-bold
    mt-6
    disabled:opacity-50
  "
          >
            FINALIZAR VENTA
          </button>
        </div>
      </div>
    </form>
  );
}
