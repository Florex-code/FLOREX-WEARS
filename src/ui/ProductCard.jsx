import React from "react";
import { Link } from "react-router-dom";
import { money } from "../utils/money.js";
import { imageUrl } from "../utils/imageUrl.js";
import "../styles/productCard.css";

export default function ProductCard({ p, onQuickView, onAdd }){
  return (
    <div className="pCard">
      <div className="pMedia">
        <div className="pBadge">{p.badge || "FLOREX"}</div>
        <img src={imageUrl(p.images?.[0])} alt={p.name} loading="lazy" onError={(e)=>{e.currentTarget.style.opacity=.55}} />
        <div className="pHover">
          <button className="btn primary" onClick={()=>onAdd?.(p)}>Add</button>
          <button className="btn" onClick={()=>onQuickView?.(p)}>Quick view</button>
          <Link className="btn ghost" to={`/product/${p.id}`}>Details</Link>
        </div>
      </div>
      <div className="pBody">
        <div className="pTop">
          <div className="pName">{p.name}</div>
          <div className="pRate">⭐ {Number(p.rating||0).toFixed(1)}</div>
        </div>
        <div className="pMeta">{p.category} • {p.style} • {p.gender}</div>
        <div className="space" style={{ marginTop: 10 }}>
          <div className="price">{money(p.price)}</div>
          {p.compareAt ? <div className="small strike">{money(p.compareAt)}</div> : <div/>}
        </div>
      </div>
    </div>
  );
}
