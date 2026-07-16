import { useState } from "react";
import { useCart } from "../context/CartContext";

function CheckoutForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [orderTotal, setOrderTotal] = useState(null);

  const { cartItems, totalPrice, placeOrder } = useCart();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !address) {
      setError("Please complete all checkout fields.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty. Add products before placing an order.");
      return;
    }

    placeOrder({
      customer: {
        fullName,
        email,
        phone,
        address,
      },
      items: cartItems,
      total: totalPrice,
      shipping: 10,
      tax: 5,
    });

    setOrderTotal(totalPrice);
    setSubmitted(true);
    setError("");
    setFullName("");
    setEmail("");
    setPhone("");
    setAddress("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white
        rounded-2xl
        shadow-md
        p-8
        space-y-5
      "
    >
      <h2 className="text-3xl font-bold">
        Checkout
      </h2>

      {error && (
        <div className="rounded-2xl bg-red-100 border border-red-200 p-4 text-red-700">
          {error}
        </div>
      )}

      {submitted && (
        <div className="rounded-2xl bg-green-100 border border-green-200 p-4 text-green-700">
          Your order has been placed successfully!
          {orderTotal !== null && (
            <p className="mt-2">
              Total payment: ${orderTotal.toFixed(2)}
            </p>
          )}
        </div>
      )}

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full border p-4 rounded-xl"
      />

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-4 rounded-xl"
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border p-4 rounded-xl"
      />

      <textarea
        placeholder="Home Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border p-4 rounded-xl h-32"
      ></textarea>

      <button
        className="
          bg-black
          text-white
          w-full
          py-4
          rounded-xl
          hover:bg-gray-800
          transition
        "
      >
        Place Order
      </button>
    </form>
  );
}

export default CheckoutForm;