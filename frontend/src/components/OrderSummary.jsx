import { useCart } from "../context/CartContext";

function OrderSummary() {
  const { totalPrice } = useCart();
  const shipping = totalPrice > 0 ? 10 : 0;
  const tax = totalPrice > 0 ? 5 : 0;
  const grandTotal = totalPrice + shipping + tax;

  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-md
        p-8
      "
    >
      <h2 className="text-3xl font-bold mb-6">
        Order Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;