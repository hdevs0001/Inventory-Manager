import { useState, type FormEvent, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AddButton from "@/components/ButtonComponent/AddButton";

const API_BASE = "/api";

type ProductFormProps = {
  onProductAdded: () => void;
  onCancel: () => void;
};

function ProductForm({ onProductAdded, onCancel }: ProductFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      setSubmitting(true);

      const response = await fetch(`${API_BASE}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          price: String(parsedPrice),
          quantity: String(parsedQuantity),
        }),
      });

      let data: { message?: string } = {};
      try {
        data = await response.json();
      } catch {
        // No JSON body; fall through to status-based error below.
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      setName("");
      setPrice("");
      setQuantity("");

      onProductAdded();
    } catch (error) {
      console.error("Error adding product:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-6 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Add Product
          </h2>

          <p className="mt-1 text-sm text-white/60">
            Add a new product to your inventory.
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-white/70 hover:bg-white/10 hover:text-white"
        >
          Cancel
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-white/80">
          Product Name
        </Label>

        <Input
          id="name"
          type="text"
          placeholder="Enter product name"
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
          className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price" className="text-white/80">
          Price
        </Label>

        <Input
          id="price"
          type="number"
          min="0"
          placeholder="Enter price"
          value={price}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setPrice(event.target.value)}
          className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-white/80">
          Quantity
        </Label>

        <Input
          id="quantity"
          type="number"
          min="0"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setQuantity(event.target.value)}
          className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
        />
      </div>

      <AddButton disabled={submitting} />
    </form>
  );
}

export default ProductForm;