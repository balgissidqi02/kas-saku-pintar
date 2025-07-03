import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { useState } from "react";
import { TransactionForm } from "./TransactionForm";
import { CashFlowChart } from "./CashFlowChart";
import { TransactionList } from "./TransactionList";

interface Transaction {
  id: string;
  type: 'pemasukan' | 'pengeluaran';
  amount: number;
  category: string;
  note?: string;
  date: string;
}

export function Dashboard() {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'pemasukan',
      amount: 150000,
      category: 'Penjualan',
      note: 'Jualan bakso',
      date: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'pengeluaran',
      amount: 75000,
      category: 'Bahan Baku',
      note: 'Beli daging dan sayuran',
      date: new Date().toISOString(),
    },
  ]);

  const todayIncome = transactions
    .filter(t => t.type === 'pemasukan' && 
      new Date(t.date).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.amount, 0);

  const todayExpense = transactions
    .filter(t => t.type === 'pengeluaran' && 
      new Date(t.date).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.amount, 0);

  const todayBalance = todayIncome - todayExpense;

  const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
    setShowTransactionForm(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (showTransactionForm) {
    return (
      <TransactionForm
        onSubmit={handleAddTransaction}
        onCancel={() => setShowTransactionForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Kas Saku Pintar</h1>
        <p className="text-muted-foreground">Kelola keuangan harian dengan mudah</p>
      </div>

      {/* Today's Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-scale-in">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              Pemasukan Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(todayIncome)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              Pengeluaran Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(todayExpense)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Saldo Bersih
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              todayBalance >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {formatCurrency(todayBalance)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="shadow-card animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg">Arus Kas 7 Hari Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          <CashFlowChart transactions={transactions} />
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center animate-scale-in">
        <Button
          variant="hero"
          size="lg"
          onClick={() => setShowTransactionForm(true)}
          className="w-full max-w-sm h-14 text-lg font-semibold"
        >
          <Plus className="mr-2 h-6 w-6" />
          Catat Transaksi
        </Button>
      </div>

      {/* Recent Transactions */}
      <Card className="shadow-card animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg">Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionList transactions={transactions.slice(0, 5)} />
        </CardContent>
      </Card>
    </div>
  );
}