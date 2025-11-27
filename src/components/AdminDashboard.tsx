import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  LogOut, 
  PiggyBank,
  CreditCard,
  Building2
} from 'lucide-react';
import { getUsers, getTransactions } from '@/helpers/storageKeys';
import type { User, Transaction, DashboardProps } from '@/types/Types';
import { formatCurrency } from '@/utils/formatCurrency';
import { useEffect, useState } from 'react';

const AdminDashboard: React.FC<DashboardProps> = ({ currentUser, onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        const transactionsData = await getTransactions();
        setUsers(usersData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const members = users.filter(u => u.role === 'member');
  const totalSimpanan = members.reduce((sum, m) => sum + (m.simpanan || 0), 0);
  const totalPinjaman = members.reduce((sum, m) => sum + (m.pinjaman || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-3 sm:py-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between">
              <span className="text-xs sm:text-sm text-gray-600">
                {currentUser.name}
              </span>
              <Button variant="outline" size="sm" className="text-xs h-8 sm:h-10 sm:text-sm">
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" onClick={onLogout} />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="sm:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Anggota</CardTitle>
              <Users className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{members.length}</div>
              <p className="text-xs text-gray-600">Anggota aktif</p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Simpanan</CardTitle>
              <PiggyBank className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{formatCurrency(totalSimpanan)}</div>
              <p className="text-xs text-gray-600">Akumulasi simpanan</p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Pinjaman</CardTitle>
              <CreditCard className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{formatCurrency(totalPinjaman)}</div>
              <p className="text-xs text-gray-600">Pinjaman aktif</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members" className="space-y-3 sm:space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members" className="text-xs sm:text-sm py-2">Data Anggota</TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs sm:text-sm py-2">Transaksi</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <Card>
              <CardHeader className="px-3 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">Daftar Anggota</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Informasi lengkap anggota koperasi
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 sm:px-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm">Nama</th>
                        <th className="text-left py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm">Email</th>
                        <th className="text-right py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm">Simpanan</th>
                        <th className="text-right py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm">Pinjaman</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm">{member.name}</td>
                          <td className="py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm">{member.email}</td>
                          <td className="py-2 px-3 sm:py-3 sm:px-4 text-right text-green-600 font-medium text-xs sm:text-sm">
                            {formatCurrency(member.simpanan || 0)}
                          </td>
                          <td className="py-2 px-3 sm:py-3 sm:px-4 text-right text-orange-600 font-medium text-xs sm:text-sm">
                            {formatCurrency(member.pinjaman || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader className="px-3 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">Riwayat Transaksi</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Semua transaksi simpanan dan pinjaman
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 sm:px-6">
                <div className="space-y-2 sm:space-y-3">
                  {transactions.map((transaction) => {
                    const user = users.find(u => u.id === transaction.userId);
                    return (
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
                            <p className="font-medium text-sm sm:text-base">{user?.name}</p>
                            <p className="text-xs sm:text-sm text-gray-600 capitalize">{transaction.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm sm:text-base">{formatCurrency(transaction.amount)}</p>
                          <p className="text-xs text-gray-600">{transaction.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;