import React from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../lib/products";

const Ctx = React.createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  async function refreshProducts() {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  }

  React.useEffect(() => {
    refreshProducts();
  }, []);

  async function upsert(product) {
    let saved;

    if (product.id) {
      saved = await updateProduct(product.id, product);
    } else {
      saved = await createProduct(product);
    }

    await refreshProducts();
    return saved.id;
  }

  async function remove(id) {
    await deleteProduct(id);
    await refreshProducts();
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
        loading,
        refreshProducts,
        upsert,
        remove,
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