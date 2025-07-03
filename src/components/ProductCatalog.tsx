import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Minus, Plus } from "lucide-react";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  category: string;
  description?: string;
}

interface ProductCatalogProps {
  products: Product[];
  onAddToCart?: (productId: string, quantity: number) => void;
  isCustomerView?: boolean;
}

export function ProductCatalog({ products, onAddToCart, isCustomerView = false }: ProductCatalogProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const updateQuantity = (productId: string, change: number) => {
    const current = quantities[productId] || 0;
    const newQuantity = Math.max(0, current + change);
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  const handleAddToCart = (productId: string) => {
    const quantity = quantities[productId] || 1;
    if (onAddToCart && quantity > 0) {
      onAddToCart(productId, quantity);
      setQuantities(prev => ({
        ...prev,
        [productId]: 0
      }));
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Belum ada produk tersedia</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="shadow-card animate-fade-in hover:shadow-elegant transition-shadow">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Product Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {product.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {formatCurrency(product.price)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    per {product.unit}
                  </div>
                </div>
              </div>

              {/* Stock Info */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Stok:</span>
                <span className={`font-medium ${
                  product.stock > 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {product.stock} {product.unit}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              )}

              {/* Customer Actions */}
              {isCustomerView && product.stock > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Jumlah:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(product.id, -1)}
                        disabled={!quantities[product.id]}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {quantities[product.id] || 0}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(product.id, 1)}
                        disabled={quantities[product.id] >= product.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={!quantities[product.id]}
                  >
                    Tambah ke Keranjang
                  </Button>
                </div>
              )}

              {/* Out of Stock */}
              {isCustomerView && product.stock === 0 && (
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Stok Habis
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}