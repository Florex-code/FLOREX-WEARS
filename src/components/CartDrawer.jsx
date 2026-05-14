import React from "react";
import { useCart } from "../state/cart.jsx";
import { money } from "../utils/money.js";
import { imageUrl } from "../utils/imageUrl.js";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cartDrawer.css";

export default function CartDrawer(){
  const { items, isOpen, close, setQty, remove, subtotal, clear } = useCart();
  const nav = useNavigate();

  React.useEffect(() => {
    function onKey(e){ if(e.key === "Escape") close(); }
    if(isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  function goCheckout(){ close(); nav("/checkout"); }

  return (
    <>
      <div className={"drawerOverlay "+(isOpen?"open":"")} onMouseDown={close} />
      <aside className={"drawer "+(isOpen?"open":"")} aria-hidden={!isOpen}>
        <div className="drawerTop">
          <div>
            <div style={{fontWeight:900,letterSpacing:"-0.02em"}}>Your Cart</div>
            <div className="small">{items.length ? "Ready when you are." : "Empty cart. Let's fix that."}</div>
          </div>
          <button className="btn ghost" onClick={close} aria-label="Close cart">×</button>
        </div>

        <div className="drawerBody">
          {items.length ? (
            <div className="drawerList">
              {items.map(it => (
                <div key={it.key} className="drawerItem">
                  <div className="drawerThumb"><img src={imageUrl(it.image)} alt={it.name} onError={(e)=>{e.currentTarget.style.opacity=.55}}/></div>
                  <div>
                    <div className="drawerName">{it.name}</div>
                    <div className="small">Size: <b>{it.size}</b> / Color: <b>{it.color}</b></div>

                    <div className="space" style={{marginTop:8}}>
                      <div className="price">{money(it.price * it.qty)}</div>
                      <div className="row">
                        <button className="qtyBtn" onClick={()=>setQty(it.key, it.qty-1)}>-</button>
                        <input className="qtyInput" value={it.qty} onChange={(e)=>setQty(it.key, e.target.value)} />
                        <button className="qtyBtn" onClick={()=>setQty(it.key, it.qty+1)}>+</button>
                      </div>
                    </div>

                    <div style={{marginTop:8}}>
                      <button className="btn ghost" onClick={()=>remove(it.key)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="drawerEmpty">
              <div className="drawerEmptyIcon">0</div>
              <div style={{fontWeight:900}}>Your cart is empty</div>
              <div className="small">Go to the shop and pick a few pieces.</div>
              <Link className="btn primary" to="/shop" onClick={close}>Browse Shop</Link>
            </div>
          )}
        </div>

        <div className="drawerBottom">
          <div className="space"><div className="small">Subtotal</div><div className="price">{money(subtotal)}</div></div>
          <div className="row" style={{marginTop:10}}>
            <button className="btn ghost" onClick={clear} disabled={!items.length}>Clear</button>
            <button className="btn primary right" onClick={goCheckout} disabled={!items.length}>Checkout</button>
          </div>
          <div className="small" style={{marginTop:10}}>Checkout is protected. If you're not logged in, you'll be asked to login first.</div>
        </div>
      </aside>
    </>
  );
}
