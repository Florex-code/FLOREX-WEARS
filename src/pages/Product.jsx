import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../state/products.jsx";
import { useCart } from "../state/cart.jsx";
import { imageUrl } from "../utils/imageUrl.js";
import { useToast } from "../ui/toast.jsx";
import { money } from "../utils/money.js";

export default function Product(){
  const { id } = useParams();
  const { getById } = useProducts();
  const { add } = useCart();
  const toast = useToast();

  const p = getById(id);
  const [size, setSize] = React.useState(p?.sizes?.[0] || "M");
  const [color, setColor] = React.useState(p?.colors?.[0] || "Default");
  const [qty, setQty] = React.useState(1);

  React.useEffect(() => {
    if(p){
      setSize(p.sizes?.[0] || "M");
      setColor(p.colors?.[0] || "Default");
      setQty(1);
    }
  }, [p?.id]);

  if(!p){
    return (
      <div className="container section">
        <div className="card" style={{padding:18}}>
          <div style={{fontWeight:900}}>Product not found</div>
          <div className="small" style={{marginTop:6}}>Go back to the shop.</div>
          <div style={{marginTop:12}}><Link className="btn primary" to="/shop">Back to shop</Link></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="grid" style={{gridTemplateColumns:"1fr 1.1fr", gap:16}}>
        <div className="card" style={{padding:0, overflow:"hidden"}}>
          <img src={imageUrl(p.images?.[0])} alt={p.name} style={{width:"100%", height:420, objectFit:"cover"}} />
        </div>

        <div className="card" style={{padding:18}}>
          <div className="badge">{p.badge} / ★ {Number(p.rating||0).toFixed(1)}</div>
          <h1 className="h2" style={{margin:"10px 0 8px"}}>{p.name}</h1>
          <div className="small">{p.category} / {p.style} / {p.gender}</div>

          <div className="hr" />

          <div className="space">
            <div className="price" style={{fontSize:22}}>{money(p.price)}</div>
            {p.compareAt ? <div className="small strike">{money(p.compareAt)}</div> : <div/>}
          </div>

          <p className="p" style={{marginTop:12}}>{p.desc}</p>

          <div className="grid" style={{gridTemplateColumns:"1fr 1fr", gap:12, marginTop:12}}>
            <div>
              <div className="small">Size</div>
              <select className="select" value={size} onChange={(e)=>setSize(e.target.value)}>
                {p.sizes?.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div className="small">Color</div>
              <select className="select" value={color} onChange={(e)=>setColor(e.target.value)}>
                {p.colors?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="row" style={{marginTop:12}}>
            <div style={{width:120}}>
              <div className="small">Qty</div>
              <input className="input" type="number" min="1" value={qty} onChange={(e)=>setQty(e.target.value)} />
            </div>
            <button className="btn primary right" onClick={() => { add(p, { qty, size, color }); toast.push("Added to cart", "good"); }}>
              Add to cart
            </button>
          </div>

          <div className="hr" />
          <div className="small">Shipping: <b>1-3 days</b> in Lagos. Returns: <b>7 days</b> after delivery.</div>
        </div>
      </div>
    </div>
  );
}
