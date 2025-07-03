import { Card } from "@/components/ui/card";

interface Transaction {
  id: string;
  type: 'pemasukan' | 'pengeluaran';
  amount: number;
  category: string;
  note?: string;
  date: string;
}

interface CashFlowChartProps {
  transactions: Transaction[];
}

export function CashFlowChart({ transactions }: CashFlowChartProps) {
  // Generate last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const chartData = last7Days.map(date => {
    const dayTransactions = transactions.filter(t => 
      new Date(t.date).toDateString() === date.toDateString()
    );
    
    const income = dayTransactions
      .filter(t => t.type === 'pemasukan')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = dayTransactions
      .filter(t => t.type === 'pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      date,
      income,
      expense,
      balance: income - expense,
    };
  });

  const maxAmount = Math.max(
    ...chartData.flatMap(d => [d.income, d.expense])
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="h-64 flex items-end justify-between gap-2 px-2">
        {chartData.map((data, index) => {
          const incomeHeight = maxAmount > 0 ? (data.income / maxAmount) * 200 : 0;
          const expenseHeight = maxAmount > 0 ? (data.expense / maxAmount) * 200 : 0;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              {/* Balance indicator */}
              <div className="text-xs font-medium text-center mb-1">
                <div className={`text-xs ${
                  data.balance >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {data.balance >= 0 ? '+' : ''}{formatCurrency(data.balance).replace('Rp', '')}
                </div>
              </div>
              
              {/* Bars */}
              <div className="flex gap-1 items-end h-48">
                {/* Income bar */}
                <div 
                  className="w-4 bg-gradient-success rounded-t-sm transition-all duration-300"
                  style={{ height: `${incomeHeight}px` }}
                  title={`Pemasukan: ${formatCurrency(data.income)}`}
                />
                
                {/* Expense bar */}
                <div 
                  className="w-4 bg-destructive rounded-t-sm transition-all duration-300"
                  style={{ height: `${expenseHeight}px` }}
                  title={`Pengeluaran: ${formatCurrency(data.expense)}`}
                />
              </div>
              
              {/* Date label */}
              <div className="text-xs text-muted-foreground text-center">
                {formatDay(data.date)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-success rounded-sm" />
          <span className="text-muted-foreground">Pemasukan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-destructive rounded-sm" />
          <span className="text-muted-foreground">Pengeluaran</span>
        </div>
      </div>
    </div>
  );
}