import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../state/products.jsx";
import ProductCard from "../ui/ProductCard.jsx";
import Modal from "../ui/Modal.jsx";
import { useCart } from "../state/cart.jsx";
import { useToast } from "../ui/toast.jsx";
import { imageUrl } from "../utils/imageUrl.js";
import "../styles/pages.css";

export default function Home() {
  const { products, categories } = useProducts();
  const { add } = useCart();
  const toast = useToast();

  const featured = products.slice(0, 4);
  const [quick, setQuick] = React.useState(null);

  // Get category counts
  const getCategoryCount = (cat) => {
    if (cat === "All") return products.length;
    return products.filter(p => p.category === cat).length;
  };

  // Featured categories for the grid
  const featuredCategories = categories.filter(c => c !== "All").slice(0, 3);

  return (
    <div className="homePage">
      {/* Hero Section */}
      <section className="hero">
        <div className="container heroGrid">
          <div className="heroCard">
            <div className="heroBadge">✨ New Season • Balanced colors • Premium UI</div>
            <h1 className="heroTitle">
              Dress like the <span className="heroTitleAccent">decision</span> is already made.
            </h1>
            <p className="heroDesc">
              FLOREX-WEARS is a premium demo clothing store built with React + Vite. 
              Clean layout, fast pages, smooth UX, and protected checkout.
            </p>
            <div className="heroActions">
              <Link className="btn primary heroCta" to="/shop">Shop Collection</Link>
              <Link className="heroSecondary" to="/about">Our Story</Link>
              <span className="heroSearchHint">
                Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to search
              </span>
            </div>
            <div className="heroFeatures">
              <div className="heroFeature">
                <div className="heroFeatureTitle">⚡ Fast</div>
                <div className="heroFeatureDesc">Vite powered builds and snappy routing</div>
              </div>
              <div className="heroFeature">
                <div className="heroFeatureTitle">🔒 Secure UX</div>
                <div className="heroFeatureDesc">Protected checkout and admin-only dashboard</div>
              </div>
              <div className="heroFeature">
                <div className="heroFeatureTitle">✨ Premium UI</div>
                <div className="heroFeatureDesc">Balanced colors, cards, drawer cart, toasts</div>
              </div>
            </div>
          </div>

          <div className="heroArt">
            <div className="heroVisual">
              <div className="heroVisualHeader">
                <div className="heroVisualDots">
                  <div className="heroVisualDot"></div>
                  <div className="heroVisualDot"></div>
                  <div className="heroVisualDot"></div>
                </div>
                <span className="badge heroVisualBadge">Drop #07</span>
              </div>
           <div className="heroVisualGrid">
  <div className="heroVisualItem">
    <img
      src="/images/Obsidian-Denim-Jacket.jpg"
      alt="New Arrivals"
      className="heroVisualImage"
    />
    <span className="heroVisualItemText">New Arrivals</span>
  </div>

  <div className="heroVisualItem">
    <img
      src="/images/Street-hoodie.jpg"
      alt="Best Sellers"
      className="heroVisualImage"
    />
    <span className="heroVisualItemText">Best Sellers</span>
  </div>

  <div className="heroVisualItem">
    <img
      src="/images/Wide-Leg-Trousers.jpg"
      alt="Trending"
      className="heroVisualImage"
    />
    <span className="heroVisualItemText">Trending</span>
  </div>

  <div className="heroVisualItem">
    <img
      src="/images/Satin Drift Shirt.jpg"
      alt="Sale"
      className="heroVisualImage"
    />
    <span className="heroVisualItemText">Sale</span>
  </div>
</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featuredSection">
        <div className="container">
          <div className="featuredHeader">
            <h2 className="featuredTitle">Featured Pieces</h2>
            <Link className="featuredLink" to="/shop">View all →</Link>
          </div>
          <div className="featuredGrid">
            {featured.map(p => (
              <ProductCard
                key={p.id}
                p={p}
                onQuickView={() => setQuick(p)}
                onAdd={(prod) => { add(prod); toast.push("Added to cart", "good"); }}
              />
            ))}
          </div>
        </div>
      </section>

      
      {/* Categories */}
<section className="categoriesSection">
  <div className="container">
    <div className="categoriesHeader">
      <h2 className="categoriesTitle">Shop by Category</h2>
      <p className="categoriesSubtitle">
        Curated collections for every style
      </p>
    </div>

    <div className="categoriesGrid">
      {featuredCategories.map((cat, idx) => (
        <Link
          key={cat}
          to={`/shop?cat=${encodeURIComponent(cat)}`}
          className="categoryCard"
        >
          {/* Category Image */}
          <img
            src={`/images/categories/${cat.toLowerCase()}.jpg`}
            alt={cat}
            className="categoryCardImage"
          />

          {/* Overlay */}
          <div
            className="categoryCardBg"
            style={{
              background: `linear-gradient(
                180deg,
                rgba(0,0,0,0.1) 0%,
                rgba(0,0,0,0.75) 100%
              )`,
            }}
          />

          {/* Content */}
          <div className="categoryCardContent">
            <h3 className="categoryCardTitle">{cat}</h3>
            <p className="categoryCardCount">
              {getCategoryCount(cat)} items
            </p>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>

      {/* Newsletter */}
      <section className="newsletterSection">
        <div className="container">
          <div className="newsletterCard">
            <div className="newsletterContent">
              <h2 className="newsletterTitle">Join the Inner Circle</h2>
              <p className="newsletterDesc">
                Get exclusive access to new drops, member-only discounts, and styling tips from our team.
              </p>
              <form className="newsletterForm" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  className="newsletterInput" 
                  placeholder="Enter your email"
                  required
                />
                <button type="submit" className="btn primary newsletterButton">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <Modal
        open={!!quick}
        title={quick ? quick.name : "Quick view"}
        onClose={() => setQuick(null)}
        footer={quick ? (
          <>
            <button className="btn" onClick={() => setQuick(null)}>Close</button>
            <Link className="btn ghost" to={quick ? `/product/${quick.id}` : "#"} onClick={() => setQuick(null)}>Details</Link>
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
                {quick.badge} • <span className="quickViewRating">⭐ {Number(quick.rating || 0).toFixed(1)}</span>
              </div>
              <p className="quickViewDesc">{quick.desc}</p>
              <div className="quickViewMeta">
                <div className="quickViewMetaItem">
                  <span className="quickViewMetaLabel">Category</span>
                  <span className="quickViewMetaValue">{quick.category}</span>
                </div>
                <div className="quickViewMetaItem">
                  <span className="quickViewMetaLabel">Style</span>
                  <span className="quickViewMetaValue">{quick.style}</span>
                </div>
                <div className="quickViewMetaItem">
                  <span className="quickViewMetaLabel">Gender</span>
                  <span className="quickViewMetaValue">{quick.gender}</span>
                </div>
                <div className="quickViewMetaItem">
                  <span className="quickViewMetaLabel">Sizes</span>
                  <span className="quickViewMetaValue">{quick.sizes?.join(", ")}</span>
                </div>
              </div>
              <div className="quickViewPrice">₦{quick.price?.toLocaleString()}</div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}