"use client";

import { createSale } from "../actions/create-sale";
import { useRef, useState } from "react";
import CustomerPicker from "./customer-picker";
import ProductPicker from "./product-picker";
import SaleCart from "./sale-cart";
import SaleSummary from "./sale-summary";
import { toast } from "sonner";
import PaymentMethodSelector from "./payment-method-selector";
import CreditPaymentForm from "./credit-payment-form";
import MixedPaymentForm from "./mixed-payment-form";
type Customer = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  salePrice: number;
  offerPrice?: number | null;
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

  const [cashAmount, setCashAmount] = useState(0);

  const [transferAmount, setTransferAmount] = useState(0);

  const [cardAmount, setCardAmount] = useState(0);

  const [creditAmount, setCreditAmount] = useState(0);

  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(false);

  const submitting = useRef(false);

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
        salePrice: product.offerPrice ?? product.salePrice,
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
  const efectivoFinal = paymentMethod === "CASH" ? total : cashAmount;

  const transferenciaFinal =
    paymentMethod === "TRANSFER" ? total : transferAmount;

  const tarjetaFinal = paymentMethod === "CARD" ? total : cardAmount;

  const creditoFinal = paymentMethod === "CREDIT" ? total : creditAmount;
  const change = receivedAmount > total ? receivedAmount - total : 0;
  const efectivoValido = paymentMethod !== "CASH" || receivedAmount >= total;

  const totalRegistrado =
    cashAmount + transferAmount + cardAmount + creditAmount;
  if (paymentMethod === "CASH") {
    if (cashAmount !== total) {
      setTimeout(() => {
        setCashAmount(total);
        setTransferAmount(0);
        setCardAmount(0);
        setCreditAmount(0);
      }, 0);
    }
  }

  if (paymentMethod === "TRANSFER") {
    if (transferAmount !== total) {
      setTimeout(() => {
        setCashAmount(0);
        setTransferAmount(total);
        setCardAmount(0);
        setCreditAmount(0);
      }, 0);
    }
  }

  if (paymentMethod === "CARD") {
    if (cardAmount !== total) {
      setTimeout(() => {
        setCashAmount(0);
        setTransferAmount(0);
        setCardAmount(total);
        setCreditAmount(0);
      }, 0);
    }
  }

  if (paymentMethod === "CREDIT") {
    if (creditAmount !== total) {
      setTimeout(() => {
        setCashAmount(0);
        setTransferAmount(0);
        setCardAmount(0);
        setCreditAmount(total);
      }, 0);
    }
  }

  const pagoCorrecto = totalRegistrado === total;

  return (
    <form
      onSubmit={(e) => {
        if (submitting.current) {
          e.preventDefault();
          return;
        }

        submitting.current = true;
        setLoading(true);
      }}
      action={async (formData) => {
        try {
          await createSale(formData);

          toast.success("Venta registrada correctamente");

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          submitting.current = false;
          setLoading(false);

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

      <input type="hidden" name="cashAmount" value={efectivoFinal} />

      <input type="hidden" name="transferAmount" value={transferenciaFinal} />

      <input type="hidden" name="cardAmount" value={tarjetaFinal} />

      <input type="hidden" name="creditAmount" value={creditoFinal} />

      <input type="hidden" name="dueDate" value={dueDate} />

      {cart.map((item) => (
        <div key={item.id}>
          <input type="hidden" name="productId" value={item.id} />

          <input type="hidden" name="quantity" value={item.quantity} />
        </div>
      ))}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* IZQUIERDA */}

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Cliente y Productos</h2>

          <CustomerPicker
            customers={clientes}
            selectedCustomer={selectedCustomer}
            onSelect={(customer) => {
              setCustomerId(customer.id);
              setSelectedCustomer(customer);
            }}
          />

          <div className="mt-6">
            <ProductPicker products={productos} onSelect={addProduct} />
          </div>

          <div className="mt-6">
            <SaleCart
              cart={cart}
              increase={increase}
              decrease={decrease}
              removeProduct={removeProduct}
            />
          </div>
        </div>
        {/* DERECHA */}

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Venta Actual</h2>

          <SaleSummary
            subtotal={subtotal}
            discount={discount}
            setDiscount={setDiscount}
            total={total}
          />
          <PaymentMethodSelector
            value={paymentMethod}
            onChange={setPaymentMethod}
          />

          {paymentMethod === "MIXED" && (
            <MixedPaymentForm
              cashAmount={cashAmount}
              setCashAmount={setCashAmount}
              transferAmount={transferAmount}
              setTransferAmount={setTransferAmount}
              cardAmount={cardAmount}
              setCardAmount={setCardAmount}
              creditAmount={creditAmount}
              setCreditAmount={setCreditAmount}
              totalRegistrado={totalRegistrado}
            />
          )}

          {(paymentMethod === "CREDIT" || creditAmount > 0) && (
            <CreditPaymentForm dueDate={dueDate} setDueDate={setDueDate} />
          )}

          {paymentMethod === "CASH" && (
            <>
              <div>
                <label className="text-sm text-zinc-400">Recibe</label>

                <input
                  type="number"
                  required={paymentMethod === "CASH"}
                  value={receivedAmount || ""}
                  onChange={(e) =>
                    setReceivedAmount(Number(e.target.value || 0))
                  }
                  className="w-full p-3 rounded bg-zinc-800"
                />
              </div>

              <div className="flex justify-between text-xl font-bold text-yellow-400">
                <span>Cambio</span>

                <span>
                  $
                  {(receivedAmount > total
                    ? receivedAmount - total
                    : 0
                  ).toLocaleString("es-CO")}
                </span>
              </div>
            </>
          )}

          {receivedAmount < total && (
            <div className="mt-2 text-red-500 font-bold">
              Faltan ${(total - receivedAmount).toLocaleString("es-CO")}
            </div>
          )}

          {!pagoCorrecto && (
            <div className="mt-4 text-center text-red-500 font-bold">
              Diferencia: $
              {Math.abs(total - totalRegistrado).toLocaleString("es-CO")}
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading ||
              cart.length === 0 ||
              !customerId ||
              !pagoCorrecto ||
              (paymentMethod === "CREDIT" && !dueDate) ||
              !efectivoValido
            }
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
            {loading ? "GUARDANDO..." : "FINALIZAR VENTA"}
          </button>
        </div>
      </div>
    </form>
  );
}
