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
  const [city, setCity] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [deliveryMethod, setDeliveryMethod] = React.useState("standard");
  const [note, setNote] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const deliveryOptions = [
    {
      id: "standard",
      title: "Standard dispatch",
      meta: "1-3 business days after confirmation",
      price: 0,
    },
    {
      id: "payment_on_delivery",
      title: "Payment on delivery",
      meta: "Pay when your order arrives",
      price: 0,
    },
  ];

  const selectedDelivery = deliveryOptions.find((option) => option.id === deliveryMethod) || deliveryOptions[0];
  const orderTotal = subtotal + selectedDelivery.price;
  const detailProgress = [name, phone, city, address].filter((value) => value.trim()).length;
  const isDetailsComplete = detailProgress === 4;
  const savedAddress = [
    address.trim(),
    city.trim() ? `City/area: ${city.trim()}` : "",
    `Delivery: ${selectedDelivery.title}`,
    note.trim() ? `Note: ${note.trim()}` : "",
  ].filter(Boolean).join("\n");

  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  async function saveOrder(reference, status = "paid") {
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
      address: savedAddress,
      items: orderItems,
      total: orderTotal,
      status,
      payment_reference: reference,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      toast.push(status === "paid" ? "Payment succeeded but order save failed." : "Could not place order.", "bad");
      return;
    }

    clear();
    toast.push(status === "paid" ? "Payment successful. Your order is confirmed." : "Order placed. You can pay on delivery.", "good");

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

    if (!name.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      toast.push("Please fill delivery details.", "bad");
      return;
    }

    if (!user?.email) {
      toast.push("Please login first.", "bad");
      return;
    }

    if (deliveryMethod === "payment_on_delivery") {
      setLoading(true);
      saveOrder("POD_" + Date.now(), "payment_on_delivery");
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
      amount: Number(orderTotal) * 100,
      currency: "NGN",
      ref: "AVN_" + Date.now(),

      callback: function (response) {
        saveOrder(response.reference, "paid");
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
              Add your contact and delivery preferences, review your pieces, and pay safely with Paystack.
            </p>
          </div>
          <div className="checkoutTrust">
            <span>Protected payment</span>
            <span>Order confirmation</span>
            <span>Fast dispatch</span>
          </div>
        </div>

        <div className="checkoutGrid">
          <div className="card checkoutPanel">
            <div className="checkoutPanelHeader">
              <div>
                <div className="checkoutStep">Step 1</div>
                <h2 className="checkoutPanelTitle">Delivery details</h2>
              </div>
              <div className={`checkoutProgress ${isDetailsComplete ? "complete" : ""}`}>
                {detailProgress}/4 complete
              </div>
            </div>

            <form onSubmit={pay} className="checkoutForm">
              <div className="checkoutFormGrid">
                <div className="checkoutField">
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
                </div>

                <div className="checkoutField">
                  <label className="fieldLabel" htmlFor="checkout-email">Email</label>
                  <input
                    id="checkout-email"
                    className="input"
                    value={user?.email || ""}
                    placeholder="Login email"
                    autoComplete="email"
                    readOnly
                  />
                </div>

                <div className="checkoutField">
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
                </div>

                <div className="checkoutField">
                  <label className="fieldLabel" htmlFor="checkout-city">City / area</label>
                  <input
                    id="checkout-city"
                    className="input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City or area"
                    autoComplete="address-level2"
                    required
                  />
                </div>
              </div>

              <div className="checkoutField">
                <label className="fieldLabel" htmlFor="checkout-address">Delivery address</label>
                <textarea
                  id="checkout-address"
                  className="textarea"
                  rows="4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House number, street, landmark"
                  autoComplete="street-address"
                  required
                />
              </div>

              <div className="checkoutField">
                <div className="fieldLabel">Payment and delivery option</div>
                <div className="deliveryOptions">
                  {deliveryOptions.map((option) => (
                    <label key={option.id} className={`deliveryOption ${deliveryMethod === option.id ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value={option.id}
                        checked={deliveryMethod === option.id}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                      />
                      <span>
                        <strong>{option.title}</strong>
                        <small>{option.meta}</small>
                      </span>
                      <b>{option.price ? money(option.price) : "Included"}</b>
                    </label>
                  ))}
                </div>
              </div>

              <div className="checkoutField">
                <label className="fieldLabel" htmlFor="checkout-note">Delivery note</label>
                <textarea
                  id="checkout-note"
                  className="textarea"
                  rows="3"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional landmark, preferred call time, or instruction"
                />
              </div>

              <div className="checkoutActions">
                <button
                  className="btn primary checkoutPayButton"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Processing..." : deliveryMethod === "payment_on_delivery" ? "Place order" : "Pay with Paystack"}
                </button>
                <span className="small checkoutNote">
                  {deliveryMethod === "payment_on_delivery"
                    ? "Your order will be saved now. Payment is collected on delivery."
                    : "You will review payment in a secure Paystack window."}
                </span>
              </div>
            </form>
          </div>

          <div className="card checkoutPanel checkoutSummary">
            <div className="checkoutPanelHeader">
              <div>
                <div className="checkoutStep">Step 2</div>
                <h2 className="checkoutPanelTitle">Order summary</h2>
              </div>
              <Link className="checkoutEditLink" to="/shop">Edit cart</Link>
            </div>

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
            <div className="space checkoutSummaryRow">
              <div className="small">{selectedDelivery.title}</div>
              <div className="price">{selectedDelivery.price ? money(selectedDelivery.price) : "Included"}</div>
            </div>
            <div className="checkoutTotalRow">
              <div>Total</div>
              <strong>{money(orderTotal)}</strong>
            </div>

            <div className="checkoutFineprint">
              You will receive order confirmation after payment. Delivery availability can be confirmed by the seller when needed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
