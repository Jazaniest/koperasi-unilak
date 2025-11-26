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
import { usersData, transactionsData } from '@/data/koperasiData';
import type { DashboardProps } from '@/types/Types';
import { formatCurrency } from '@/utils/formatCurrency';

const AdminDashboard: React.FC<DashboardProps> = ({ currentUser, onLogout }) => {
  const members = usersData.filter(u => u.role === 'member');
  const totalSimpanan = members.reduce((sum, m) => sum + (m.simpanan || 0), 0);
  const totalPinjaman = members.reduce((sum, m) => sum + (m.pinjaman || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Selamat datang, {currentUser.name}
              </span>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Anggota</CardTitle>
              <Users className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.length}</div>
              <p className="text-xs text-gray-600">Anggota aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Simpanan</CardTitle>
              <PiggyBank className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSimpanan)}</div>
              <p className="text-xs text-gray-600">Akumulasi simpanan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Pinjaman</CardTitle>
              <CreditCard className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPinjaman)}</div>
              <p className="text-xs text-gray-600">Pinjaman aktif</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members" className="space-y-4">
          <TabsList>
            <TabsTrigger value="members">Data Anggota</TabsTrigger>
            <TabsTrigger value="transactions">Transaksi</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Anggota</CardTitle>
                <CardDescription>Informasi lengkap anggota koperasi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-3 px-4">Nama</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-right py-3 px-4">Simpanan</th>
                        <th className="text-right py-3 px-4">Pinjaman</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{member.name}</td>
                          <td className="py-3 px-4">{member.email}</td>
                          <td className="py-3 px-4 text-right text-green-600 font-medium">
                            {formatCurrency(member.simpanan || 0)}
                          </td>
                          <td className="py-3 px-4 text-right text-orange-600 font-medium">
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
              <CardHeader>
                <CardTitle>Riwayat Transaksi</CardTitle>
                <CardDescription>Semua transaksi simpanan dan pinjaman</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactionsData.map((transaction) => {
                    const user = usersData.find(u => u.id === transaction.userId);
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'simpanan' ? 'bg-green-100' : 'bg-orange-100'
                          }`}>
                            {transaction.type === 'simpanan' ? 
                              <PiggyBank className="w-5 h-5 text-green-600" /> :
                              <CreditCard className="w-5 h-5 text-orange-600" />
                            }
                          </div>
                          <div>
                            <p className="font-medium">{user?.name}</p>
                            <p className="text-sm text-gray-600 capitalize">{transaction.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                          <p className="text-sm text-gray-600">{transaction.date}</p>
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

export default AdminDashboard