import { useCallback, useEffect, useState } from "react";
import ProductForm from "@/components/product/ProductForm";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

function ProductPage() {
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

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold">
          Inventory Manager
        </h1>

        <div className="grid gap-10 md:grid-cols-2">
          <ProductForm
            onProductAdded={fetchProducts}
          />

          <div className="rounded-xl border bg-white p-6 shadow">
            <h2 className="mb-6 text-2xl font-bold">
              Products
            </h2>

            {loading ? (
              <p>Loading products...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : products.length === 0 ? (
              <p className="text-muted-foreground">
                No products found.
              </p>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-lg border p-4"
                  >
                    <h3 className="font-semibold">
                      {product.name}
                    </h3>

                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>
                        Price: ₹{product.price}
                      </p>

                      <p>
                        Quantity: {product.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductPage;