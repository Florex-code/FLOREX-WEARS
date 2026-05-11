import React from "react";
import { useProducts } from "../state/products.jsx";
import { useToast } from "../ui/toast.jsx";
import { imageUrl } from "../utils/imageUrl.js";
import { uploadProductImage } from "../lib/products";
import { getOrders, updateOrderStatus, deleteOrder } from "../lib/orders";
import "../styles/pages.css";

const empty = {
  id: "",
  name: "",
  category: "Tops",
  style: "Street",
  gender: "Unisex",
  price: 25000,
  compare_at: 0,
  rating: 4.5,
  colors: ["Black", "White"],
  sizes: ["S", "M", "L", "XL"],
  badge: "New",
  description: "",
  images: [],
};

export default function Admin() {
  const { products, upsert, remove } = useProducts();
  const toast = useToast();

  const [form, setForm] = React.useState(empty);
  const [uploading, setUploading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function reset() {
    setForm(empty);
  }

  function edit(p) {
    setForm({
      ...p,
      compare_at: p.compare_at || 0,
      description: p.description || p.desc || "",
      images: p.images || [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.push("Please choose an image file.", "bad");
      return;
    }

    try {
      setUploading(true);
      const publicUrl = await uploadProductImage(file);
      set("images", [publicUrl]);
      toast.push("Image uploaded to Supabase.", "good");
    } catch (err) {
      console.error(err);
      toast.push("Image upload failed.", "bad");
    } finally {
      setUploading(false);
    }
  }

  async function save(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.push("Product name required.", "bad");
      return;
    }

    if (!form.description.trim()) {
      toast.push("Add a description.", "warn");
      return;
    }

    try {
      setSaving(true);

      const fixed = {
        name: form.name,
        category: form.category,
        style: form.style,
        gender: form.gender,
        price: Number(form.price || 0),
        compare_at: Number(form.compare_at || 0),
        rating: Number(form.rating || 0),
        colors: Array.isArray(form.colors)
          ? form.colors
          : String(form.colors)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
        sizes: Array.isArray(form.sizes)
          ? form.sizes
          : String(form.sizes)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
        badge: form.badge,
        description: form.description,
        images: form.images || [],
      };

      if (form.id) fixed.id = form.id;

      const id = await upsert(fixed);

      toast.push("Saved product (" + id + ")", "good");
      reset();
    } catch (err) {
      console.error(err);
      toast.push("Could not save product.", "bad");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await remove(id);
      toast.push("Deleted product.", "warn");
    } catch (err) {
      console.error(err);
      toast.push("Could not delete product.", "bad");
    }
  }

  async function handleStatus(id, status) {
    try {
      await updateOrderStatus(id, status);

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );

      toast.push("Order updated.", "good");
    } catch (err) {
      console.error(err);
      toast.push("Could not update order.", "bad");
    }
  }

  return (
    <div className="container section">
      <div className="badge">🛠 Admin • Supabase Backend</div>

      <h1 className="h2" style={{ margin: "12px 0 6px" }}>
        Admin Dashboard
      </h1>

      <div className="small">
        Add, edit, upload images, delete products, and manage orders from
        Supabase.
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 14 }}
      >
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 900 }}>Add / Edit product</div>
          <div className="hr" />

          <form onSubmit={save}>
            <div className="small">Name</div>
            <input
              className="input"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />

            <div style={{ height: 10 }} />

            <div
              className="grid"
              style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}
            >
              <div>
                <div className="small">Category</div>
                <input
                  className="input"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                />
              </div>

              <div>
                <div className="small">Style</div>
                <input
                  className="input"
                  value={form.style}
                  onChange={(e) => set("style", e.target.value)}
                />
              </div>
            </div>

            <div style={{ height: 10 }} />

            <div
              className="grid"
              style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}
            >
              <div>
                <div className="small">Gender</div>
                <input
                  className="input"
                  value={form.gender}
                  onChange={(e) => set("gender", e.target.value)}
                />
              </div>

              <div>
                <div className="small">Badge</div>
                <input
                  className="input"
                  value={form.badge}
                  onChange={(e) => set("badge", e.target.value)}
                />
              </div>
            </div>

            <div style={{ height: 10 }} />

            <div
              className="grid"
              style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}
            >
              <div>
                <div className="small">Price</div>
                <input
                  className="input"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
              </div>

              <div>
                <div className="small">Compare at</div>
                <input
                  className="input"
                  value={form.compare_at}
                  onChange={(e) => set("compare_at", e.target.value)}
                />
              </div>

              <div>
                <div className="small">Rating</div>
                <input
                  className="input"
                  value={form.rating}
                  onChange={(e) => set("rating", e.target.value)}
                />
              </div>
            </div>

            <div style={{ height: 10 }} />

            <div className="small">Sizes</div>
            <input
              className="input"
              value={Array.isArray(form.sizes) ? form.sizes.join(", ") : form.sizes}
              onChange={(e) => set("sizes", e.target.value)}
            />

            <div style={{ height: 10 }} />

            <div className="small">Colors</div>
            <input
              className="input"
              value={
                Array.isArray(form.colors) ? form.colors.join(", ") : form.colors
              }
              onChange={(e) => set("colors", e.target.value)}
            />

            <div style={{ height: 10 }} />

            <div className="small">Upload product image</div>
            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />

            {uploading && (
              <div className="small" style={{ marginTop: 8 }}>
                Uploading image...
              </div>
            )}

            {form.images?.[0] && (
              <div
                style={{
                  marginTop: 10,
                  width: 120,
                  height: 120,
                  borderRadius: 18,
                  overflow: "hidden",
                  border: "1px solid var(--line)",
                }}
              >
                <img
                  src={imageUrl(form.images[0])}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            <div style={{ height: 10 }} />

            <div className="small">Description</div>
            <textarea
              className="textarea"
              rows="4"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />

            <div className="row" style={{ marginTop: 14 }}>
              <button
                className="btn primary"
                type="submit"
                disabled={saving || uploading}
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button className="btn ghost" type="button" onClick={reset}>
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div className="space">
            <div>
              <div style={{ fontWeight: 900 }}>Products</div>
              <div className="small">Products are loaded from Supabase.</div>
            </div>

            <div className="badge">{products.length}</div>
          </div>

          <div className="hr" />

          <div
            className="grid"
            style={{
              gridTemplateColumns: "1fr",
              gap: 10,
              maxHeight: 520,
              overflow: "auto",
              paddingRight: 4,
            }}
          >
            {products.map((p) => (
              <div
                key={p.id}
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
                    width: 54,
                    height: 54,
                    borderRadius: 14,
                    overflow: "hidden",
                    border: "1px solid var(--line)",
                  }}
                >
                  <img
                    src={imageUrl(p.images?.[0])}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900 }}>{p.name}</div>
                  <div className="small">
                    {p.category} • {p.style} • {p.gender}
                  </div>
                </div>

                <button className="btn" onClick={() => edit(p)}>
                  Edit
                </button>

                <button className="btn danger" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 18, marginTop: 18 }}>
        <div className="space">
          <div>
            <div style={{ fontWeight: 900 }}>Orders</div>
            <div className="small">Customer orders from checkout.</div>
          </div>

          <button className="btn ghost" onClick={loadOrders}>
            Refresh orders
          </button>

          <div className="badge">{orders.length}</div>
        </div>

        <div className="hr" />

        <div
          className="grid"
          style={{
            gridTemplateColumns: "1fr",
            gap: 12,
            maxHeight: 520,
            overflow: "auto",
          }}
        >
          {orders.length ? (
            orders.map((o) => (
              <div key={o.id} className="card" style={{ padding: 14 }}>
                <div className="space">
                  <div>
                    <div style={{ fontWeight: 900 }}>
                      {o.full_name || o.customer_name || "Customer"}
                    </div>
                    <div className="small">{o.user_email}</div>
                  </div>

                  <div className="badge">{o.status || "pending"}</div>
                </div>

                <div className="small" style={{ marginTop: 8 }}>
                  Phone: {o.phone}
                </div>

                <div className="small">Address: {o.address}</div>

                <div className="small" style={{ marginTop: 8 }}>
                  Total: ₦{Number(o.total || 0).toLocaleString()}
                </div>

                <div className="small" style={{ marginTop: 8 }}>
                  Items:
                </div>

                <div
                  className="grid"
                  style={{ gridTemplateColumns: "1fr", gap: 6, marginTop: 6 }}
                >
                  {(o.items || []).map((item, idx) => (
                    <div key={idx} className="small">
                      {item.qty} × {item.name} — ₦
                      {Number(item.price || 0).toLocaleString()}
                    </div>
                  ))}
                </div>

                <div className="row" style={{ marginTop: 12 }}>
                  <button
                    className="btn"
                    onClick={() => handleStatus(o.id, "processing")}
                  >
                    Processing
                  </button>

                  <button
                    className="btn primary"
                    onClick={() => handleStatus(o.id, "delivered")}
                  >
                    Delivered
                  </button>

                  <button
                    className="btn danger"
                    onClick={() => handleStatus(o.id, "cancelled")}
                  >
                    Cancelled
                  </button>

                  <button
  className="btn ghost"
  onClick={async () => {
    await deleteOrder(order.id);
    loadOrders();
  }}
>
  Delete
</button>
                </div>
              </div>
            ))
          ) : (
            <div className="small">No orders yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}