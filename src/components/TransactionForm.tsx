import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";

interface TransactionFormProps {
  onSubmit: (transaction: {
    type: 'pemasukan' | 'pengeluaran';
    amount: number;
    category: string;
    note?: string;
  }) => void;
  onCancel: () => void;
}

const categories = {
  pemasukan: ['Penjualan', 'Jasa', 'Lain-lain'],
  pengeluaran: ['Bahan Baku', 'Transportasi', 'Makan', 'Operasional', 'Lain-lain']
};

export function TransactionForm({ onSubmit, onCancel }: TransactionFormProps) {
  const [type, setType] = useState<'pemasukan' | 'pengeluaran'>('pemasukan');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onSubmit({
      type,
      amount: parseInt(amount.replace(/\D/g, '')),
      category,
      note: note || undefined,
    });
  };

  const formatNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(parseInt(numbers) || 0);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(formatNumber(value));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Catat Transaksi</h1>
        </div>

        {/* Transaction Type Selection */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={type === 'pemasukan' ? 'success' : 'outline'}
                className="h-16 flex-col gap-2"
                onClick={() => {
                  setType('pemasukan');
                  setCategory('');
                }}
              >
                <TrendingUp className="h-6 w-6" />
                <span className="font-semibold">Pemasukan</span>
              </Button>
              
              <Button
                variant={type === 'pengeluaran' ? 'destructive' : 'outline'}
                className="h-16 flex-col gap-2"
                onClick={() => {
                  setType('pengeluaran');
                  setCategory('');
                }}
              >
                <TrendingDown className="h-6 w-6" />
                <span className="font-semibold">Pengeluaran</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">
              Detail {type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah (Rp)</Label>
                <Input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="text-xl font-semibold text-center"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <div className="grid grid-cols-2 gap-2">
                  {categories[type].map((cat) => (
                    <Button
                      key={cat}
                      type="button"
                      variant={category === cat ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCategory(cat)}
                      className="text-sm"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="note">Catatan (opsional)</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Tambahkan catatan..."
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full mt-6"
                disabled={!amount || !category}
              >
                Simpan Transaksi
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}