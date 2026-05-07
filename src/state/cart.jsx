import React from "react";
import { load, save } from "../utils/storage.js";
import { clamp } from "../utils/clamp.js";

const Ctx = React.createContext(null);

function keyOf({ id, size, color }){
  return `${id}__${size||"—"}__${color||"—"}`;
}

export function CartProvider({ children }){
  const [items, setItems] = React.useState(() => load("fxw_cart", []));
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => save("fxw_cart", items), [items]);

  function add(product, { qty=1, size, color } = {}){
    const row = {
      key: keyOf({ id: product.id, size, color }),
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      size: size || product.sizes?.[0] || "M",
      color: color || product.colors?.[0] || "Default",
      qty: clamp(Number(qty||1), 1, 99)
    };
    setItems(prev => {
      const found = prev.find(x => x.key === row.key);
      if(found) return prev.map(x => x.key === row.key ? { ...x, qty: clamp(x.qty + row.qty, 1, 99) } : x);
      return [row, ...prev];
    });
    setOpen(true);
  }

  function setQty(key, qty){
    const q = clamp(Number(qty || 1), 1, 99);
    setItems(prev => prev.map(x => x.key === key ? { ...x, qty: q } : x));
  }

  function remove(key){ setItems(prev => prev.filter(x => x.key !== key)); }
  function clear(){ setItems([]); }

  const count = items.reduce((a,b) => a + b.qty, 0);
  const subtotal = items.reduce((a,b) => a + b.price * b.qty, 0);

  return <Ctx.Provider value={{
    items, add, setQty, remove, clear,
    count, subtotal,
    isOpen: open, open: () => setOpen(true), close: () => setOpen(false), toggle: () => setOpen(s => !s)
  }}>{children}</Ctx.Provider>;
}

export function useCart(){
  const ctx = React.useContext(Ctx);
  if(!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
