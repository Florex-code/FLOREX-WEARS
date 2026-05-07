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

  async function pay(e) {
    e.preventDefault();

    if (!items.length) {
      toast.push("Your cart is empty.", "warn");
      return;
    }

    if (!name || !phone || !address) {
      toast.push("Please fill delivery details.", "bad");
      return;
    }

    setLoading(true);

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
      user_email: user?.email,
      full_name: name,
      phone,
      address,
      items: orderItems,
      total: subtotal,
      status: "pending",
    });

    setLoading(false);

    if (error) {
      console.error(error);
      toast.push("Order failed. Please try again.", "bad");
      return;
    }

    clear();
    toast.push("Order placed successfully.", "good");
  }

  return (
    <div className="container section">
      <div className="grid" style={{ gridTemplateColumns: "1.05fr .95fr", gap: 16 }}>
        <div className="card" style={{ padding: 18 }}>
          <div className="badge">🧾 Checkout</div>
          <h1 className="h2" style={{ margin: "12px 0 6px" }}>
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
              placeholder="+234…"
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

            <div className="row" style={{ marginTop: 14 }}>
              <button className="btn primary" type="submit" disabled={loading}>
                {loading ? "Placing order..." : "Place order"}
              </button>
              <span className="badge">Payment comes next</span>
            </div>
          </form>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 900 }}>Order summary</div>
          <div className="hr" />

          {items.length ? (
            <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 10 }}>
              {items.map((it) => (
                <div
                  key={it.key}
                  className="card"
                  style={{ padding: 12, display: "flex", gap: 12 }}
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
                    <div style={{ fontWeight: 900 }}>{it.name}</div>
                    <div className="small">
                      {it.qty} × {money(it.price)} • {it.size} • {it.color}
                    </div>
                  </div>

                  <div className="price">{money(it.qty * it.price)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="small">Empty cart.</div>
          )}

          <div className="hr" />
          <div className="space">
            <div className="small">Subtotal</div>
            <div className="price">{money(subtotal)}</div>
          </div>

          <div className="small" style={{ marginTop: 10 }}>
            After this, we’ll connect Paystack payment.
          </div>
        </div>
      </div>
    </div>
  );
}