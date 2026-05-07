import React from "react";
import Modal from "./Modal.jsx";
import { useProducts } from "../state/products.jsx";
import { Link } from "react-router-dom";
import { imageUrl } from "../utils/imageUrl.js";

export default function SearchModal({ open, onClose }){
  const { products } = useProducts();
  const [q, setQ] = React.useState("");

  React.useEffect(() => { if(open) setQ(""); }, [open]);

  const results = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    if(!query) return [];
    return products
      .filter(p => (p.name + " " + p.category + " " + p.style).toLowerCase().includes(query))
      .slice(0, 8);
  }, [q, products]);

  return (
    <Modal
      open={open}
      title="Search FLOREX-WEARS"
      onClose={onClose}
      footer={<div className="small">Tip: press <span className="kbd">Esc</span> to close.</div>}
    >
      <input className="input" placeholder="Search products…" value={q} autoFocus onChange={(e)=>setQ(e.target.value)} />
      <div className="hr" />
      {!q.trim() ? <div className="small">Start typing to search.</div> : results.length ? (
        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 10 }}>
          {results.map(p => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              onClick={onClose}
              className="card"
              style={{ padding: 12, display: "flex", gap: 12, alignItems: "center" }}
            >
              <div style={{ width: 54, height: 54, borderRadius: 14, overflow: "hidden", border: "1px solid var(--line)" }}>
                <img src={imageUrl(p.images?.[0])} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900 }}>{p.name}</div>
                <div className="small">{p.category} • {p.style}</div>
              </div>
              <div className="kbd">Open</div>
            </Link>
          ))}
        </div>
      ) : <div className="small">No matches.</div>}
    </Modal>
  );
}
