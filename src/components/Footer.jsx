import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footerGrid">
        {/* Brand Column */}
        <div className="footerBrandCol">
          <div className="footerBrand">
            <div className="footerMark">F</div>
            <div>
              <div className="footerName">FLOREX-WEARS</div>
              <div className="footerTag">Built for style. Engineered for confidence.</div>
            </div>
          </div>
          <p className="footerDesc">
            A premium clothing brand delivering quality fashion for the modern individual. 
            Designed in Lagos, worn worldwide.
          </p>
          <div className="footerContact">
            <span>Lagos, Nigeria</span>
            <span>florexstudio.ng@gmail.com</span>
          </div>
        </div>

        {/* Shop Links */}
        <div className="footerCol">
          <div className="footerHead">Shop</div>
          <Link className="footerLink" to="/shop">All Products</Link>
          <Link className="footerLink" to="/shop">New Drops</Link>
          <Link className="footerLink" to="/shop">Best Sellers</Link>
          <Link className="footerLink" to="/shop">Sale</Link>
        </div>

        {/* Company Links */}
        <div className="footerCol">
          <div className="footerHead">Company</div>
          <Link className="footerLink" to="/about">About Us</Link>
          <Link className="footerLink" to="/contact">Contact</Link>
          <Link className="footerLink" to="/account">My Account</Link>
          <Link className="footerLink" to="/faq">FAQ</Link>
        </div>

        {/* Newsletter */}
        <div className="footerCol">
          <div className="footerHead">Stay Updated</div>
          <p className="footerText">Get exclusive drops, deals & styling tips.</p>
          <form className="footerForm" onSubmit={(e) => e.preventDefault()}>
            <input 
              className="footerInput" 
              type="email"
              placeholder="Enter your email" 
              required
            />
            <button className="btn primary" type="submit">Join</button>
          </form>
          <div className="footerSocials">
            <a href="#" className="socialLink" aria-label="Facebook">f</a>
            <a href="#" className="socialLink" aria-label="Instagram">IG</a>
            <a href="#" className="socialLink" aria-label="Twitter">X</a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footerBottom">
        <div className="container footerBottomContent">
          <div className="footerLegal">
            <span>© {currentYear} FLOREX-WEARS. All rights reserved.</span>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
          <div className="footerTech">Secure checkout / Curated fashion</div>
        </div>
      </div>
    </footer>
  );
}
