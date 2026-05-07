import React from "react";
import { useProducts } from "../state/products.jsx";
import { useToast } from "../ui/toast.jsx";
import { imageUrl } from "../utils/imageUrl.js";
import "../styles/pages.css";

const empty = {
  id: "",
  name: "",
  category: "Tops",
  style: "Street",
  gender: "Unisex",
  price: 25000,
  compareAt: 0,
  rating: 4.5,
  colors: ["Black","White"],
  sizes: ["S","M","L","XL"],
  badge: "New",
  desc: "",
  images: ["/images/tee.svg"]
};

export default function Admin(){
  const { products, upsert, remove, resetToSeed } = useProducts();
  const toast = useToast();
  const [form, setForm] = React.useState(empty);

  function set(field, value){
    setForm(f => ({ ...f, [field]: value }));
  }

  function edit(p){ setForm({ ...p }); window.scrollTo({ top: 0, behavior: "smooth" }); }

  function reset(){ setForm(empty); }

  function normalizeImagePath(value){
    const raw = String(value || "").trim();
    if(!raw) return "";
    if(raw.startsWith("data:") || raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) return raw;
    return `/images/${raw}`;
  }

  function handleImageText(value){
    set("images", [normalizeImagePath(value)]);
  }

  function handleImageUpload(e){
    const file = e.target.files?.[0];
    if(!file) return;
    if(!file.type.startsWith("image/")){
      toast.push("Please choose an image file.", "bad");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      set("images", [reader.result]);
      toast.push("Image uploaded into this product.", "good");
    };
    reader.onerror = () => toast.push("Could not read that image.", "bad");
    reader.readAsDataURL(file);
  }

  function save(e){
    e.preventDefault();
    if(!form.name.trim()){ toast.push("Product name required.", "bad"); return; }
    if(!form.desc.trim()){ toast.push("Add a description.", "warn"); return; }
    const fixed = {
      ...form,
      price: Number(form.price||0),
      compareAt: Number(form.compareAt||0),
      rating: Number(form.rating||0),
      colors: String(form.colors).includes(",") ? String(form.colors).split(",").map(s=>s.trim()).filter(Boolean) : (Array.isArray(form.colors)?form.colors:[String(form.colors)]),
      sizes: String(form.sizes).includes(",") ? String(form.sizes).split(",").map(s=>s.trim()).filter(Boolean) : (Array.isArray(form.sizes)?form.sizes:[String(form.sizes)])
    };
    const id = upsert(fixed);
    toast.push("Saved product ("+id+")", "good");
    reset();
  }

  return (
    <div className="container section">
      <div className="badge">🛠 Admin • CRUD • LocalStorage</div>
      <h1 className="h2" style={{margin:"12px 0 6px"}}>Admin Dashboard</h1>
      <div className="small">Add / edit products. This is a demo admin panel (no backend yet).</div>

      <div className="grid" style={{gridTemplateColumns:"1fr 1fr", gap:16, marginTop:14}}>
        <div className="card" style={{padding:18}}>
          <div style={{fontWeight:900}}>Add / Edit product</div>
          <div className="hr" />
          <form onSubmit={save}>
            <div className="small">Name</div>
            <input className="input" value={form.name} onChange={(e)=>set("name", e.target.value)} />
            <div style={{height:10}} />

            <div className="grid" style={{gridTemplateColumns:"1fr 1fr", gap:12}}>
              <div>
                <div className="small">Category</div>
                <input className="input" value={form.category} onChange={(e)=>set("category", e.target.value)} />
              </div>
              <div>
                <div className="small">Style</div>
                <input className="input" value={form.style} onChange={(e)=>set("style", e.target.value)} />
              </div>
            </div>

            <div style={{height:10}} />

            <div className="grid" style={{gridTemplateColumns:"1fr 1fr", gap:12}}>
              <div>
                <div className="small">Gender</div>
                <input className="input" value={form.gender} onChange={(e)=>set("gender", e.target.value)} />
              </div>
              <div>
                <div className="small">Badge</div>
                <input className="input" value={form.badge} onChange={(e)=>set("badge", e.target.value)} />
              </div>
            </div>

            <div style={{height:10}} />

            <div className="grid" style={{gridTemplateColumns:"1fr 1fr 1fr", gap:12}}>
              <div>
                <div className="small">Price</div>
                <input className="input" value={form.price} onChange={(e)=>set("price", e.target.value)} />
              </div>
              <div>
                <div className="small">Compare at</div>
                <input className="input" value={form.compareAt} onChange={(e)=>set("compareAt", e.target.value)} />
              </div>
              <div>
                <div className="small">Rating</div>
                <input className="input" value={form.rating} onChange={(e)=>set("rating", e.target.value)} />
              </div>
            </div>

            <div style={{height:10}} />
            <div className="small">Sizes (comma-separated)</div>
            <input className="input" value={Array.isArray(form.sizes)?form.sizes.join(", "):form.sizes} onChange={(e)=>set("sizes", e.target.value)} />

            <div style={{height:10}} />
            <div className="small">Colors (comma-separated)</div>
            <input className="input" value={Array.isArray(form.colors)?form.colors.join(", "):form.colors} onChange={(e)=>set("colors", e.target.value)} />

            <div style={{height:10}} />
            <div className="small">Image path or upload</div>
            <input
              className="input"
              value={form.images?.[0]?.startsWith("data:") ? "Uploaded image stored in browser" : (form.images?.[0] || "")}
              onChange={(e)=>handleImageText(e.target.value)}
              placeholder="/images/your-image.jpg or just your-image.jpg"
            />
            <div className="small" style={{marginTop:6}}>
              For files inside public/images, use /images/file-name.jpg. Or upload from your computer below.
            </div>
            <input className="input" type="file" accept="image/*" onChange={handleImageUpload} style={{marginTop:8}} />
            {form.images?.[0] ? (
              <div style={{marginTop:10, width:120, height:120, borderRadius:18, overflow:"hidden", border:"1px solid var(--line)"}}>
                <img src={imageUrl(form.images?.[0])} alt="Preview" style={{width:"100%",height:"100%",objectFit:"cover"}} />
              </div>
            ) : null}

            <div style={{height:10}} />
            <div className="small">Description</div>
            <textarea className="textarea" rows="4" value={form.desc} onChange={(e)=>set("desc", e.target.value)} />

            <div className="row" style={{marginTop:14}}>
              <button className="btn primary" type="submit">Save</button>
              <button className="btn ghost" type="button" onClick={reset}>Reset</button>
            </div>
          </form>
        </div>

        <div className="card" style={{padding:18}}>
          <div className="space">
            <div>
              <div style={{fontWeight:900}}>Products</div>
              <div className="small">Use Reset to reload the latest productSeed.js without opening DevTools.</div>
            </div>
            <div className="row">
              <button className="btn ghost" type="button" onClick={()=>{ resetToSeed(); toast.push("Products reloaded from productSeed.js", "good"); }}>Reset to seed</button>
              <div className="badge">{products.length}</div>
            </div>
          </div>
          <div className="hr" />
          <div className="grid" style={{gridTemplateColumns:"1fr", gap:10, maxHeight:520, overflow:"auto", paddingRight:4}}>
            {products.map(p => (
              <div key={p.id} className="card" style={{padding:12, display:"flex", gap:12, alignItems:"center"}}>
                <div style={{width:54,height:54,borderRadius:14,overflow:"hidden",border:"1px solid var(--line)"}}>
                  <img src={imageUrl(p.images?.[0])} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}} />
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:900}}>{p.name}</div>
                  <div className="small">{p.category} • {p.style} • {p.gender}</div>
                </div>
                <button className="btn" onClick={()=>edit(p)}>Edit</button>
                <button className="btn danger" onClick={()=>{ remove(p.id); toast.push("Deleted product", "warn"); }}>Delete</button>
              </div>
            ))}
          </div>
          <div className="small" style={{marginTop:10}}>Tip: Uploaded images are saved in your browser LocalStorage. Files in public/images still use paths like /images/miles.jpg.</div>
        </div>
      </div>
    </div>
  );
}
