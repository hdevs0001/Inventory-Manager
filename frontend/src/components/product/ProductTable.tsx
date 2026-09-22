import { useState, type ChangeEvent } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_BASE = "/api";

export type Product = {
  id: string;
  name: string;
  price: string;
  quantity: string;
  createdAt: string;
  updatedAt: string;
};

type ProductTableProps = {
  products: Product[];
  loading: boolean;
  error: string | null;
  onProductChanged: () => void;
};

type EditValues = {
  name: string;
  price: string;
  quantity: string;
};

function ProductTable({
  products,
  loading,
  error,
  onProductChanged,
}: ProductTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({
    name: "",
    price: "",
    quantity: "",
  });
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditValues({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ name: "", price: "", quantity: "" });
  };

  const handleSave = async (id: string) => {
    const trimmedName = editValues.name.trim();
    const parsedPrice = Number(editValues.price);
    const parsedQuantity = Number(editValues.quantity);

    if (!trimmedName || !editValues.price || !editValues.quantity) {
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
      setSavingId(id);

      const response = await fetch(`${API_BASE}/product/${id}`, {
        method: "PATCH",
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
        throw new Error(data.message || "Failed to update product");
      }

      setEditingId(null);
      onProductChanged();
    } catch (err) {
      console.error("Error updating product:", err);
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Delete this product? This cannot be undone.",
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(`${API_BASE}/product/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let message = "Failed to delete product";
        try {
          const data = await response.json();
          message = data.message || message;
        } catch {
          // No JSON body.
        }
        throw new Error(message);
      }

      if (editingId === id) {
        setEditingId(null);
      }

      onProductChanged();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-white/60">Loading products...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (products.length === 0) {
    return (
      <p className="text-sm text-white/60">
        No products yet. Add one to get started.
      </p>
    );
  }

  return (
    <Table>
      <TableCaption>A list of the products currently in your inventory.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const isEditing = editingId === product.id;
          const isSaving = savingId === product.id;
          const isDeleting = deletingId === product.id;
          const rowDisabled = isSaving || isDeleting;

          return (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                {isEditing ? (
                  <Input
                    value={editValues.name}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setEditValues((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className="border-white/20 bg-white/10 text-white"
                  />
                ) : (
                  product.name
                )}
              </TableCell>

              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    min="0"
                    value={editValues.price}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setEditValues((prev) => ({ ...prev, price: event.target.value }))
                    }
                    className="border-white/20 bg-white/10 text-white"
                  />
                ) : (
                  `₹${product.price}`
                )}
              </TableCell>

              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    min="0"
                    value={editValues.quantity}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setEditValues((prev) => ({ ...prev, quantity: event.target.value }))
                    }
                    className="border-white/20 bg-white/10 text-white"
                  />
                ) : (
                  product.quantity
                )}
              </TableCell>

              <TableCell className="text-right">
                {isEditing ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSave(product.id)}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={cancelEdit}
                      disabled={isSaving}
                      className="text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(product)}
                      disabled={rowDisabled}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Update
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                      disabled={rowDisabled}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default ProductTable;