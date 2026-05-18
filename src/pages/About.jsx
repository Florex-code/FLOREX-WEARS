import React from "react";
import { Link } from "react-router-dom";
import "../styles/pages.css"; // We'll add styles here

export default function About() {
  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "500+", label: "Products" },
    { number: "15+", label: "Countries" },
    { number: "4.9", label: "Rating" }
  ];

  const values = [
    {
      icon: "✦",
      title: "Quality Craft",
      desc: "Every piece is crafted with attention to detail using carefully selected materials from ethical suppliers."
    },
    {
      icon: "◈",
      title: "Sustainable Fashion",
      desc: "We are committed to reducing our environmental footprint through eco-friendly practices and packaging."
    },
    {
      icon: "◉",
      title: "Inclusive Design",
      desc: "Fashion for everyone. Our collections celebrate diversity and fit all body types comfortably."
    }
  ];

  return (
    <div className="aboutPage">
      {/* Hero Section */}
      <section className="aboutHero">
        <div className="container">
          <span className="aboutLabel">About Us</span>
          <h1 className="aboutTitle">Redefining Modern Fashion</h1>
          <p className="aboutSubtitle">
            Avenoir is more than a clothing label. It is a refined wardrobe language
            for confident, intentional, and expressive style.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="aboutStats">
        <div className="container">
          <div className="statsGrid">
            {stats.map((stat, idx) => (
              <div key={idx} className="statCard">
                <div className="statNumber">{stat.number}</div>
                <div className="statLabel">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="aboutStory">
        <div className="container storyGrid">
          <div className="storyContent">
            <h2>Our Story</h2>
            <p>
              Founded in Lagos, Avenoir began with a simple mission: to create
              clothing that makes presence feel effortless. Every piece is designed
              to move between sharp streetwear, quiet luxury, and polished everyday living.
            </p>
            <p>
              We believe that great style shouldn't come at the cost of comfort or 
              conscience. Every collection is thoughtfully designed, ethically produced, 
              and made to last.
            </p>
            <Link to="/shop" className="btn primary aboutCta">Explore Collection</Link>
          </div>
          <div className="storyVisual">
            <div className="storyCard">
              <div className="storyIcon">A</div>
              <div className="storyBrand">Avenoir Atelier</div>
              <div className="storyEst">Est. 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="aboutValues">
        <div className="container">
          <h2 className="valuesTitle">What We Stand For</h2>
          <div className="valuesGrid">
            {values.map((value, idx) => (
              <div key={idx} className="valueCard">
                <div className="valueIcon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="aboutCtaSection">
        <div className="container">
          <div className="ctaCard">
            <h2>Join the Avenoir Circle</h2>
            <p>Be the first to know about new drops, exclusive deals, and styling tips.</p>
            <form className="ctaForm" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="btn primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
