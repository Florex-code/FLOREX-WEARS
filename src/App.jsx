import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";

import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Product from "./pages/Product.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Auth from "./pages/Auth.jsx";
import Account from "./pages/Account.jsx";
import Checkout from "./pages/Checkout.jsx";
import Admin from "./pages/Admin.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./ui/ProtectedRoute.jsx";
import SearchModal from "./ui/SearchModal.jsx";

export default function App(){
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    function onKey(e){
      const k = e.key.toLowerCase();
      const cmdK = (e.ctrlKey || e.metaKey) && k === "k";
      if(cmdK){ e.preventDefault(); setSearchOpen(true); }
      if(k === "escape") setSearchOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Navbar onOpenSearch={()=>setSearchOpen(true)} />
      <CartDrawer />
      <SearchModal open={searchOpen} onClose={()=>setSearchOpen(false)} />

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/shop" element={<Shop/>} />
        <Route path="/product/:id" element={<Product/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/auth" element={<Login/>} />
        <Route path="/login" element={<Login />} />

        <Route path="/account" element={
          <ProtectedRoute>
            <Account/>
          </ProtectedRoute>
        } />

        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout/>
          </ProtectedRoute>
        } />

       <Route
  path="/admin"
  element={
    <AdminRoute>
      <Admin />
    </AdminRoute>
  }
/>
      </Routes>


      <Footer />

      <a
  href="https://wa.me/2349138465408?text=Hi%20I%20want%20to%20order"
  className="whatsapp-float"
  target="_blank"
  rel="noreferrer"
>
  💬
</a>
    </>
  );
}
