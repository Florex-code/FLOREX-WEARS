import React from "react";
import { getProducts } from "../lib/products";

const Ctx = React.createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
    }

    loadProducts();
  }, []);

  function upsert(product) {
    console.log("Admin save will connect to Supabase next:", product);
  }

  function remove(id) {
    console.log("Delete will connect to Supabase next:", id);
  }

  function resetToSeed() {
    setProducts([]);
  }

  function getById(id) {
    return products.find((p) => p.id === id) || null;
  }

  const categories = React.useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [products]);

  return (
    <Ctx.Provider
      value={{
        products,
        setProducts,
        upsert,
        remove,
        resetToSeed,
        getById,
        categories,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useProducts() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}