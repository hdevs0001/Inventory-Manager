import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddButton from "@/components/ButtonComponent/AddButton";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

type ProductFormProps = {
  onProductAdded: () => void;
};

function ProductForm({ onProductAdded }: ProductFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity);

    if (!trimmedName || !price || !quantity) {
      alert("Please fill all fields");
      return;
    }

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      alert("Price must be a positive number");
      return;
    }

    if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) {
      alert("Quantity must be zero or a positive number");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          price: parsedPrice,
          quantity: parsedQuantity,
        }),
      });

      let data: { message?: string } = {};
      try {
        data = await response.json();
      } catch {
        // Response had no JSON body; fall through to status-based error below.
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      console.log("Product added:", data);

      setName("");
      setPrice("");
      setQuantity("");

      onProductAdded();
    } catch (error) {
      console.error("Error adding product:", error);

      alert(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-6 rounded-xl border bg-white p-6 shadow"
    >
      <div>
        <h2 className="text-2xl font-bold">Add Product</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Add a new product to your inventory.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>

        <Input
          id="name"
          type="text"
          placeholder="Enter product name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>

        <Input
          id="price"
          type="number"
          min="0"
          placeholder="Enter price"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>

        <Input
          id="quantity"
          type="number"
          min="0"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
      </div>

      <AddButton />
    </form>
  );
}

export default ProductForm;
