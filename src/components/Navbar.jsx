import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../state/theme.jsx";
import { useAuth } from "../state/auth.jsx";
import { useCart } from "../state/cart.jsx";
import { supabase } from "../lib/supabase.js";
import "../styles/navbar.css";

export default function Navbar({ onOpenSearch }) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin } = useAuth();
  const { count, toggle } = useCart();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    nav("/");
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="navWrap">
        <div className="announceBar">New pieces added weekly / Secure checkout on every order</div>
        <div className="container navBar">
          <button className="navLogo" onClick={() => nav("/")}>
            <span className="navName">Avenoir</span>
            <span className="navTag">modern essentials</span>
          </button>

        <nav className="navLinks">
          <NavLink to="/" className={({ isActive }) => "navLink " + (isActive ? "active" : "")}>Home</NavLink>
          <NavLink to="/shop" className={({ isActive }) => "navLink " + (isActive ? "active" : "")}>Shop</NavLink>
          <NavLink to="/about" className={({ isActive }) => "navLink " + (isActive ? "active" : "")}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => "navLink " + (isActive ? "active" : "")}>Contact</NavLink>
          {isAdmin && <NavLink to="/admin" className={({ isActive }) => "navLink " + (isActive ? "active" : "")}>Admin</NavLink>}
        </nav>

        <div className="navActions">
          <button className="navIconBtn" aria-label="Search" onClick={onOpenSearch}>
            <span className="navIconText">Search</span>
          </button>
          <button className="btn ghost navDesktopOnly" onClick={toggleTheme}>
            {theme === "dark" ? "Dark" : "Light"}
          </button>

          <button className="navCartBtn" onClick={toggle} aria-label={`Cart with ${count} items`}>
            <span className="navDesktopOnly">Cart</span> <span className="navPill">{count}</span>
          </button>
           
           {user ? (
  <button className="btn ghost navDesktopOnly" onClick={handleLogout}>
    Logout
  </button>
) : (
  <button className="btn ghost navDesktopOnly" onClick={() => nav("/auth")}>
    Login
  </button>
)}

          <button className="hamburgerBtn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobileMenu">
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/shop" onClick={closeMenu}>Shop</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>

          {isAdmin && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}

          <button onClick={() => { onOpenSearch(); closeMenu(); }}>Search</button>
          <button onClick={() => { toggleTheme(); closeMenu(); }}>
            {theme === "dark" ? "Dark mode" : "Light mode"}
          </button>

          {user ? (
            <>
              <NavLink to="/account" onClick={closeMenu}>Account</NavLink>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/auth" onClick={closeMenu}>Login</NavLink>
          )}
        </div>
      )}

      </header>

      <nav className="mobileBottomNav" aria-label="Mobile shortcuts">
        <NavLink to="/" onClick={closeMenu}>Home</NavLink>
        <NavLink to="/shop" onClick={closeMenu}>Shop</NavLink>
        <button onClick={() => { onOpenSearch(); closeMenu(); }}>Search</button>
        <button onClick={() => { toggle(); closeMenu(); }}>Cart {count}</button>
        <NavLink to={user ? "/account" : "/auth"} onClick={closeMenu}>{user ? "Account" : "Login"}</NavLink>
      </nav>
    </>
  );
}
