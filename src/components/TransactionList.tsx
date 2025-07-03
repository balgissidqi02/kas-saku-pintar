import { TrendingUp, TrendingDown } from "lucide-react";

interface Transaction {
  id: string;
  type: 'pemasukan' | 'pengeluaran';
  amount: number;
  category: string;
  note?: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
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
      minute: '2-digit',
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Belum ada transaksi hari ini</p>
        <p className="text-sm">Mulai catat transaksi pertama Anda!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className={`p-2 rounded-full ${
              transaction.type === 'pemasukan' 
                ? 'bg-success/10 text-success' 
                : 'bg-destructive/10 text-destructive'
            }`}>
              {transaction.type === 'pemasukan' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>

            {/* Transaction details */}
            <div>
              <div className="font-medium text-sm">
                {transaction.category}
              </div>
              {transaction.note && (
                <div className="text-xs text-muted-foreground">
                  {transaction.note}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                {formatTime(transaction.date)}
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className={`text-right ${
            transaction.type === 'pemasukan' ? 'text-success' : 'text-destructive'
          }`}>
            <div className="font-semibold">
              {transaction.type === 'pemasukan' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}