import { useCallback, useEffect, useState } from "react";
import ProductForm from "@/components/product/ProductForm";
import ProductTable, { type Product } from "@/components/product/ProductTable";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

type ProductPageProps = {
  isFormOpen: boolean;
  onCloseForm: () => void;
};

function ProductPage({ isFormOpen, onCloseForm }: ProductPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/product`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Could not load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductAdded = () => {
    onCloseForm();
    fetchProducts();
  };

  return (
    <div className="mt-8 space-y-8">
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onCloseForm}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <ProductForm
              onProductAdded={handleProductAdded}
              onCancel={onCloseForm}
            />
          </div>
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Products
        </h2>

        <ProductTable
          products={products}
          loading={loading}
          error={error}
          onProductChanged={fetchProducts}
        />
      </div>
    </div>
  );
}

export default ProductPage;