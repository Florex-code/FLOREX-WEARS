import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useProducts } from "../state/products.jsx";
import ProductCard from "../ui/ProductCard.jsx";
import Modal from "../ui/Modal.jsx";
import { useCart } from "../state/cart.jsx";
import { useToast } from "../ui/toast.jsx";
import { imageUrl } from "../utils/imageUrl.js";
import "../styles/pages.css";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Shop() {
  const { products, categories } = useProducts();
  const { add } = useCart();
  const toast = useToast();
  const q = useQuery();
  const location = useLocation();

  const [search, setSearch] = React.useState("");
  const [cat, setCat] = React.useState(q.get("cat") || "All");
  const [style, setStyle] = React.useState("All");
  const [gender, setGender] = React.useState("All");
  const [sort, setSort] = React.useState("featured");
  const [quick, setQuick] = React.useState(null);

  // Update category from URL
  React.useEffect(() => {
    const urlCat = q.get("cat");
    if (urlCat) setCat(urlCat);
  }, [q]);

  const styles = React.useMemo(() => ["All", ...Array.from(new Set(products.map(p => p.style))).sort()], [products]);
  const genders = React.useMemo(() => ["All", ...Array.from(new Set(products.map(p => p.gender))).sort()], [products]);

  const filtered = React.useMemo(() => {
    const s = search.trim().toLowerCase();
    let list = products.filter(p => {
      if (cat !== "All" && p.category !== cat) return false;
      if (style !== "All" && p.style !== style) return false;
      if (gender !== "All" && p.gender !== gender) return false;
      if (s && !(p.name + " " + p.category + " " + p.style).toLowerCase().includes(s)) return false;
      return true;
    });

    switch (sort) {
      case "price_asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price_desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: break;
    }
    return list;
  }, [products, search, cat, style, gender, sort]);

  const resetFilters = () => {
    setSearch("");
    setCat("All");
    setStyle("All");
    setGender("All");
    setSort("featured");
  };

  return (
    <div className="shopPage">
      <div className="container">
        {/* Header */}
        <div className="shopHeader">
          <div className="shopHeaderTop">
            <div>
              <h1 className="shopTitle">Shop</h1>
              <p className="shopSubtitle">Find the right piece fast, compare styles, and build your cart with confidence.</p>
            </div>
            <span className="shopCount">{filtered.length} items</span>
          </div>
        </div>

        {/* Filters */}
        <div className="filtersPanel">
          <div className="filtersGrid">
            <div className="filterGroup">
              <label className="filterLabel">Search</label>
              <div className="filterSearch">
                <span className="filterSearchIcon">⌕</span>
                <input 
                  className="filterInput" 
                  placeholder="Search products..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
              </div>
            </div>
            <div className="filterGroup">
              <label className="filterLabel">Category</label>
              <select className="filterSelect" value={cat} onChange={(e) => setCat(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="filterGroup">
              <label className="filterLabel">Style</label>
              <select className="filterSelect" value={style} onChange={(e) => setStyle(e.target.value)}>
                {styles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="filterGroup">
              <label className="filterLabel">Gender</label>
              <select className="filterSelect" value={gender} onChange={(e) => setGender(e.target.value)}>
                {genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div className="sortBar">
            <span className="sortLabel">Sort by:</span>
            <div className="sortButtons">
              <button 
                className={`sortButton ${sort === "featured" ? "active" : ""}`} 
                onClick={() => setSort("featured")}
              >
                Featured
              </button>
              <button 
                className={`sortButton ${sort === "rating" ? "active" : ""}`} 
                onClick={() => setSort("rating")}
              >
                Top Rated
              </button>
              <button 
                className={`sortButton ${sort === "price_asc" ? "active" : ""}`} 
                onClick={() => setSort("price_asc")}
              >
                Price low
              </button>
              <button 
                className={`sortButton ${sort === "price_desc" ? "active" : ""}`} 
                onClick={() => setSort("price_desc")}
              >
                Price high
              </button>
            </div>
            <button className="sortReset" onClick={resetFilters}>Reset Filters</button>
          </div>
        </div>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="productsGrid">
            {filtered.map(p => (
              <ProductCard
                key={p.id}
                p={p}
                onQuickView={() => setQuick(p)}
                onAdd={(prod) => { add(prod); toast.push("Added to cart", "good"); }}
              />
            ))}
          </div>
        ) : (
          <div className="emptyState">
            <div className="emptyIcon">0</div>
            <h3 className="emptyTitle">No products found</h3>
            <p className="emptyText">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <Modal
        open={!!quick}
        title={quick ? quick.name : "Quick view"}
        onClose={() => setQuick(null)}
        footer={quick ? (
          <>
            <button className="btn" onClick={() => setQuick(null)}>Close</button>
            <button className="btn primary" onClick={() => { add(quick); toast.push("Added to cart", "good"); }}>Add to cart</button>
          </>
        ) : null}
      >
        {quick ? (
          <div className="quickViewGrid">
            <div className="quickViewImage">
              <img src={imageUrl(quick.images?.[0])} alt={quick.name} />
            </div>
            <div className="quickViewContent">
              <div className="badge quickViewBadge">
                {quick.category} / {quick.style} / {quick.gender}
              </div>
              <p className="quickViewDesc">{quick.desc}</p>
              <div className="quickViewMeta">
                <div className="quickViewMetaItem">
                  <span className="quickViewMetaLabel">Rating</span>
                  <span className="quickViewMetaValue">★ {Number(quick.rating || 0).toFixed(1)}</span>
                </div>
                <div className="quickViewMetaItem">
                  <span className="quickViewMetaLabel">Sizes</span>
                  <span className="quickViewMetaValue">{quick.sizes?.join(", ")}</span>
                </div>
                <div className="quickViewMetaItem">
                  <span className="quickViewMetaLabel">Colors</span>
                  <span className="quickViewMetaValue">{quick.colors?.join(", ")}</span>
                </div>
              </div>
              <div className="quickViewPrice">{"\u20a6"}{quick.price?.toLocaleString()}</div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
