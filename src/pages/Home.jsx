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

  const featured = products.slice(0, 8);
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
      <section className="hero">
        <div className="heroMedia" aria-hidden="true">
          <img src="/images/Obsidian-Denim-Jacket.jpg" alt="" />
          <img src="/images/Vanta Street Hoodie.jpg" alt="" />
          <img src="/images/Satin Drift Shirt.jpg" alt="" />
        </div>
        <div className="container heroGrid">
          <div className="heroCard">
            <div className="heroBadge">New season edit</div>
            <h1 className="heroTitle">
              Streetwear, polish, and everyday essentials.
            </h1>
            <p className="heroDesc">
              Clean streetwear and smart casual essentials with sharp silhouettes, rich textures, and easy outfit confidence.
            </p>
            <div className="heroActions">
              <Link className="btn primary heroCta" to="/shop">Shop new in</Link>
              <Link className="heroSecondary" to="/shop?cat=Hoodies">Shop hoodies</Link>
            </div>
            <div className="heroRetailBar">
              <span>Fresh drops weekly</span>
              <span>Secure checkout</span>
              <span>Fast dispatch</span>
            </div>
          </div>

          <div className="heroArt">
            <Link className="heroLookCard heroLookTall" to="/shop">
              <img src="/images/Obsidian-Denim-Jacket.jpg" alt="Model wearing denim outerwear" />
              <span>Outerwear</span>
            </Link>
            <Link className="heroLookCard" to="/shop?cat=Hoodies">
              <img src="/images/Street-hoodie.jpg" alt="Model wearing street hoodie" />
              <span>Hoodies</span>
            </Link>
            <Link className="heroLookCard" to="/shop?cat=Bottoms">
              <img src="/images/Wide-Leg-Trousers.jpg" alt="Wide leg trousers" />
              <span>Bottoms</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="retailStrip" aria-label="Store benefits">
        <div className="container retailStripInner">
          <span>New arrivals</span>
          <span>Best sellers</span>
          <span>Easy returns</span>
          <span>Paystack protected</span>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featuredSection">
        <div className="container">
          <div className="featuredHeader">
            <div>
              <h2 className="featuredTitle">Trending Now</h2>
              <p className="sectionIntro">The pieces shoppers reach for first.</p>
            </div>
            <Link className="featuredLink" to="/shop">View all</Link>
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

      
<section className="categoriesSection">
  <div className="container">
    <div className="categoriesHeader">
      <h2 className="categoriesTitle">Shop by Category</h2>
      <p className="categoriesSubtitle">Shop the rails by category.</p>
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

      <section className="newsletterSection">
        <div className="container">
          <div className="newsletterCard">
            <div className="newsletterContent">
              <h2 className="newsletterTitle">Get first access to every drop</h2>
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
                {quick.badge} / <span className="quickViewRating">★ {Number(quick.rating || 0).toFixed(1)}</span>
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
              <div className="quickViewPrice">{"\u20a6"}{quick.price?.toLocaleString()}</div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
