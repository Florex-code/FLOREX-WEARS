import React from "react";
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
      document.body.removeChild(script);
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
      full_name: name,
      phone,
      address,
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

    toast.push("Payment successful 🎉", "good");

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

    if (!name || !phone || !address) {
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
    <div className="container section">
      <div
        className="grid"
        style={{
          gridTemplateColumns: "1.05fr .95fr",
          gap: 16,
        }}
      >
        <div className="card" style={{ padding: 18 }}>
          <div className="badge">🧾 Checkout</div>

          <h1
            className="h2"
            style={{ margin: "12px 0 6px" }}
          >
            Delivery details
          </h1>

          <form onSubmit={pay}>
            <div className="small">Full name</div>

            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />

            <div style={{ height: 10 }} />

            <div className="small">Phone</div>

            <input
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234..."
            />

            <div style={{ height: 10 }} />

            <div className="small">Address</div>

            <textarea
              className="textarea"
              rows="4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Delivery address"
            />

            <div
              className="row"
              style={{ marginTop: 14 }}
            >
              <button
                className="btn primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Processing..." : "Pay with Paystack"}
              </button>

              <span className="badge">
                Secure payment
              </span>
            </div>
          </form>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 900 }}>
            Order summary
          </div>

          <div className="hr" />

          {items.length ? (
            <div
              className="grid"
              style={{
                gridTemplateColumns: "1fr",
                gap: 10,
              }}
            >
              {items.map((it) => (
                <div
                  key={it.key}
                  className="card"
                  style={{
                    padding: 12,
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      overflow: "hidden",
                      border: "1px solid var(--line)",
                    }}
                  >
                    <img
                      src={imageUrl(it.image)}
                      alt={it.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900 }}>
                      {it.name}
                    </div>

                    <div className="small">
                      {it.qty} × {money(it.price)} •{" "}
                      {it.size} • {it.color}
                    </div>
                  </div>

                  <div className="price">
                    {money(it.qty * it.price)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="small">
              Empty cart.
            </div>
          )}

          <div className="hr" />

          <div className="space">
            <div className="small">Subtotal</div>

            <div className="price">
              {money(subtotal)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}