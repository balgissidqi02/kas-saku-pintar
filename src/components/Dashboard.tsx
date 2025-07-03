import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, Users, ShoppingCart, TrendingUp } from "lucide-react";
import { useState } from "react";
import { ProductForm } from "./ProductForm";
import { ProductCatalog } from "./ProductCatalog";
import { OrderList } from "./OrderList";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  image?: string;
  category: string;
  date: string;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'delivered';
  deliveryMethod: 'pickup' | 'delivery';
  date: string;
}

export function Dashboard() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Bayam Segar',
      price: 5000,
      stock: 20,
      unit: 'ikat',
      category: 'Sayuran Daun',
      date: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Tomat Merah',
      price: 12000,
      stock: 15,
      unit: 'kg',
      category: 'Sayuran Buah',
      date: new Date().toISOString(),
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      customerName: 'Ibu Sari',
      customerPhone: '081234567890',
      items: [
        { productId: '1', productName: 'Bayam Segar', quantity: 2, price: 5000 }
      ],
      total: 10000,
      status: 'pending',
      deliveryMethod: 'pickup',
      date: new Date().toISOString(),
    }
  ]);

  const todayProducts = products.length;
  const todayOrders = orders.filter(o => 
    new Date(o.date).toDateString() === new Date().toDateString()
  ).length;
  const todaySales = orders
    .filter(o => 
      new Date(o.date).toDateString() === new Date().toDateString() &&
      o.status === 'delivered'
    )
    .reduce((sum, o) => sum + o.total, 0);

  const handleAddProduct = (product: Omit<Product, 'id' | 'date'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setProducts([newProduct, ...products]);
    setShowProductForm(false);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (showProductForm) {
    return (
      <ProductForm
        onSubmit={handleAddProduct}
        onCancel={() => setShowProductForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Toko Sayur Digital</h1>
        <p className="text-muted-foreground">Kelola toko sayur dengan mudah</p>
      </div>

      {/* Today's Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-scale-in">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Total Produk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {todayProducts}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-success" />
              Pesanan Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {todayOrders}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              Penjualan Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(todaySales)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <div className="flex justify-center animate-scale-in">
        <Button
          variant="hero"
          size="lg"
          onClick={() => setShowProductForm(true)}
          className="w-full max-w-sm h-14 text-lg font-semibold"
        >
          <Plus className="mr-2 h-6 w-6" />
          Tambah Produk
        </Button>
      </div>

      {/* Product Catalog */}
      <Card className="shadow-card animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg">Katalog Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductCatalog products={products} />
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="shadow-card animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg">Pesanan Masuk</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderList 
            orders={orders.slice(0, 5)} 
            onUpdateStatus={handleUpdateOrderStatus}
          />
        </CardContent>
      </Card>
    </div>
  );
}