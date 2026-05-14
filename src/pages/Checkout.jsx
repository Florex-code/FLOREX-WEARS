import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../state/cart.jsx";
import { money } from "../utils/money.js";
import { imageUrl } from "../utils/imageUrl.js";
import { useToast } from "../ui/toast.jsx";
import { supabase } from "../lib/supabase";
import { useAuth } from "../state/auth.jsx";

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  async function savePaidOrder(reference) {
    const orderItems = items.map((it) => ({
      product_id: it.id,
      name: it.name,
      price: it.price,
      qty: it.qty,
      size: it.size,
      color: it.color,
      image: it.image,
    }));

    const { error } = await supabase.from("orders").insert({
      user_email: user.email,
      full_name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      items: orderItems,
      total: subtotal,
      status: "paid",
      payment_reference: reference,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      toast.push("Payment succeeded but order save failed.", "bad");
      return;
    }

    clear();
    toast.push("Payment successful. Your order is confirmed.", "good");

    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  }

  function pay(e) {
    e.preventDefault();

    if (!items.length) {
      toast.push("Your cart is empty.", "warn");
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.push("Please fill delivery details.", "bad");
      return;
    }

    if (!user?.email) {
      toast.push("Please login first.", "bad");
      return;
    }

    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    if (!publicKey) {
      toast.push("Paystack key missing.", "bad");
      return;
    }

    if (!window.PaystackPop) {
      toast.push("Paystack failed to load.", "bad");
      return;
    }

    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: user.email,
      amount: Number(subtotal) * 100,
      currency: "NGN",
      ref: "FXW_" + Date.now(),

      callback: function (response) {
        savePaidOrder(response.reference);
      },

      onClose: function () {
        setLoading(false);
        toast.push("Payment cancelled.", "warn");
      },
    });

    handler.openIframe();
  }

  return (
    <div className="checkoutPage">
      <div className="container section">
        <div className="checkoutHeader">
          <div>
            <div className="badge">Secure checkout</div>
            <h1 className="h2 checkoutTitle">Complete your order</h1>
            <p className="p checkoutCopy">
              Confirm your delivery details, review your pieces, and pay safely with Paystack.
            </p>
          </div>
          <div className="checkoutTrust">
            <span>Protected payment</span>
            <span>Order confirmation</span>
            <span>Lagos delivery</span>
          </div>
        </div>

        <div className="checkoutGrid">
          <div className="card checkoutPanel">
            <div className="checkoutStep">1</div>
            <h2 className="checkoutPanelTitle">Delivery details</h2>

            <form onSubmit={pay} className="checkoutForm">
              <label className="fieldLabel" htmlFor="checkout-name">Full name</label>
              <input
                id="checkout-name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

              <label className="fieldLabel" htmlFor="checkout-phone">Phone</label>
              <input
                id="checkout-phone"
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234..."
                autoComplete="tel"
                inputMode="tel"
                required
              />

              <label className="fieldLabel" htmlFor="checkout-address">Delivery address</label>
              <textarea
                id="checkout-address"
                className="textarea"
                rows="4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House number, street, area, city"
                autoComplete="street-address"
                required
              />

              <div className="checkoutActions">
                <button
                  className="btn primary checkoutPayButton"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Pay with Paystack"}
                </button>
                <span className="small checkoutNote">
                  You will review payment in a secure Paystack window.
                </span>
              </div>
            </form>
          </div>

          <div className="card checkoutPanel checkoutSummary">
            <div className="checkoutStep">2</div>
            <h2 className="checkoutPanelTitle">Order summary</h2>

            <div className="hr" />

            {items.length ? (
              <div className="checkoutItems">
                {items.map((it) => (
                  <div key={it.key} className="checkoutItem">
                    <div className="checkoutThumb">
                      <img src={imageUrl(it.image)} alt={it.name} />
                    </div>

                    <div className="checkoutItemMain">
                      <div className="checkoutItemName">{it.name}</div>
                      <div className="small">
                        {it.qty} x {money(it.price)} / {it.size} / {it.color}
                      </div>
                    </div>

                    <div className="price">{money(it.qty * it.price)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="checkoutEmpty">
                <div className="small">Your cart is empty.</div>
                <Link className="btn primary" to="/shop">Back to shop</Link>
              </div>
            )}

            <div className="hr" />

            <div className="space">
              <div className="small">Subtotal</div>
              <div className="price">{money(subtotal)}</div>
            </div>

            <div className="checkoutFineprint">
              Delivery fee, if required, can be confirmed with the seller after payment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
