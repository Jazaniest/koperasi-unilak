import { useState, useEffect, useCallback, startTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  PiggyBank,
  CreditCard,
  Plus,
} from 'lucide-react';
import { formatCurrency, getCurrentDate } from '@/utils/formatCurrency';
import type { DashboardProps } from '@/types/Types';
import type { User, Transaction } from '@/types/Types';
import { getUsers, getTransactions, addTransaction, updateUser } from '@/helpers/storageKeys';
import MemberNavbar from './MemberNavbar';

const MemberDashboard: React.FC<DashboardProps> = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<User>(currentUser);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    startTransition(() => {
      setSuccess('');
      setError('');
      setAmount('');
    });
  }, [activeTab]);

  const loadData = useCallback(() => {
    const users = getUsers();
    const updatedUser = users.find(u => u.id === currentUser.id);
    if (updatedUser) {
      setUser(updatedUser);
    }
    const allTransactions = getTransactions();
    setTransactions(allTransactions.filter(t => t.userId === currentUser.id));
  }, [currentUser.id]);

  useEffect(() => {
    startTransition(() => {
      loadData();
    })
  }, [loadData]);

  useEffect(() => {
    let timer: number;
    if (success) {
      timer = window.setTimeout(() => setSuccess(''), 3000);
    }
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [success]);

  const handleSimpanan = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Jumlah tidak valid!');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      userId: user.id,
      type: 'simpanan',
      amount: numAmount,
      date: getCurrentDate(),
      status: 'completed'
    };

    const updatedUser = {
      ...user,
      simpanan: (user.simpanan || 0) + numAmount
    };

    addTransaction(newTransaction);
    updateUser(updatedUser);
    
    setSuccess(`Berhasil menyimpan ${formatCurrency(numAmount)}`);
    setError('');
    setAmount('');
    loadData();
  };

  const handlePinjaman = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Jumlah tidak valid!');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      userId: user.id,
      type: 'pinjaman',
      amount: numAmount,
      date: getCurrentDate(),
      status: 'active'
    };

    const updatedUser = {
      ...user,
      pinjaman: (user.pinjaman || 0) + numAmount
    };

    addTransaction(newTransaction);
    updateUser(updatedUser);
    
    setSuccess(`Berhasil meminjam ${formatCurrency(numAmount)}`);
    setError('');
    setAmount('');
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MemberNavbar 
        currentUser={user} 
        onLogout={onLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Simpanan Anda</CardTitle>
                  <PiggyBank className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                    {formatCurrency(user.simpanan || 0)}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 sm:mt-2">Total simpanan terkumpul</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Pinjaman Anda</CardTitle>
                  <CreditCard className="w-4 h-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600">
                    {formatCurrency(user.pinjaman || 0)}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 sm:mt-2">Pinjaman yang harus dilunasi</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="px-3 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">Riwayat Transaksi</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Semua aktivitas simpanan dan pinjaman Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 sm:px-6">
                {transactions.length > 0 ? (
                  <div className="space-y-2 sm:space-y-3">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`p-1 sm:p-2 rounded-full ${
                            transaction.type === 'simpanan' ? 'bg-green-100' : 'bg-orange-100'
                          }`}>
                            {transaction.type === 'simpanan' ? 
                              <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> :
                              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                            }
                          </div>
                          <div>
                            <p className="font-medium text-sm sm:text-base capitalize">{transaction.type}</p>
                            <p className="text-xs sm:text-sm text-gray-600">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold text-sm sm:text-base ${
                            transaction.type === 'simpanan' ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {formatCurrency(transaction.amount)}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {transaction.status === 'completed' ? 'Selesai' : 'Aktif'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                    <p>Belum ada transaksi</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Simpanan Tab */}
        {activeTab === 'simpanan' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="px-3 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <PiggyBank className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                Lakukan Simpanan
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Tambah simpanan Anda ke koperasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
              {success && (
                <Alert className="bg-green-50 border-green-200 py-2 sm:py-3">
                  <AlertDescription className="text-green-800 text-xs sm:text-sm">{success}</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive" className="py-2 sm:py-3">
                  <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="amount-simpanan" className="text-xs sm:text-sm">Jumlah Simpanan</Label>
                <Input
                  id="amount-simpanan"
                  type="number"
                  placeholder="Masukkan jumlah"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600">Simpanan saat ini:</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                  {formatCurrency(user.simpanan || 0)}
                </p>
              </div>

              <Button className="w-full text-xs sm:text-sm h-9 sm:h-10" onClick={handleSimpanan}>
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Simpan Sekarang
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pinjaman Tab */}
        {activeTab === 'pinjaman' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="px-3 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                Lakukan Pinjaman
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Ajukan pinjaman dari koperasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
              {success && (
                <Alert className="bg-green-50 border-green-200 py-2 sm:py-3">
                  <AlertDescription className="text-green-800 text-xs sm:text-sm">{success}</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive" className="py-2 sm:py-3">
                  <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="amount-pinjaman" className="text-xs sm:text-sm">Jumlah Pinjaman</Label>
                <Input
                  id="amount-pinjaman"
                  type="number"
                  placeholder="Masukkan jumlah"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600">Pinjaman saat ini:</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">
                  {formatCurrency(user.pinjaman || 0)}
                </p>
              </div>

              <Button className="w-full text-xs sm:text-sm h-9 sm:h-10" onClick={handlePinjaman} variant="destructive">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Ajukan Pinjaman
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;