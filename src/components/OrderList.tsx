import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Package, Clock } from "lucide-react";

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

interface OrderListProps {
  orders: Order[];
  onUpdateStatus?: (orderId: string, status: Order['status']) => void;
}

export function OrderList({ orders, onUpdateStatus }: OrderListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'confirmed': return 'Dikonfirmasi';
      case 'delivered': return 'Selesai';
      default: return status;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Belum ada pesanan masuk</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="shadow-card animate-fade-in">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Order Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{order.customerName}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {order.customerPhone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(order.date)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {formatCurrency(order.total)}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {order.deliveryMethod === 'pickup' ? 'Ambil sendiri' : 'Antar'}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Pesanan:</h4>
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.productName}</span>
                      <span className="font-medium">
                        {item.quantity}x {formatCurrency(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {onUpdateStatus && order.status !== 'delivered' && (
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onUpdateStatus(order.id, 'confirmed')}
                      className="flex-1"
                    >
                      Konfirmasi
                    </Button>
                  )}
                  {order.status === 'confirmed' && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => onUpdateStatus(order.id, 'delivered')}
                      className="flex-1"
                    >
                      Selesai
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}