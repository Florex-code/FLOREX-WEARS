import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/global.css";

import { ThemeProvider } from "./state/theme.jsx";
import { ToastProvider } from "./ui/toast.jsx";
import { AuthProvider } from "./state/auth.jsx";
import { ProductsProvider } from "./state/products.jsx";
import { CartProvider } from "./state/cart.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <ProductsProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </ProductsProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
