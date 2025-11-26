import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogOut, 
  PiggyBank,
  CreditCard,
  User,
  Building2
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { transactionsData } from '@/data/koperasiData';
import type { DashboardProps } from '@/types/Types';

const MemberDashboard: React.FC<DashboardProps> = ({ currentUser, onLogout }) => {
  const userTransactions = transactionsData.filter(t => t.userId === currentUser.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Member</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Simpanan Anda</CardTitle>
              <PiggyBank className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(currentUser.simpanan || 0)}
              </div>
              <p className="text-xs text-gray-600 mt-2">Total simpanan terkumpul</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pinjaman Anda</CardTitle>
              <CreditCard className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {formatCurrency(currentUser.pinjaman || 0)}
              </div>
              <p className="text-xs text-gray-600 mt-2">Pinjaman yang harus dilunasi</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile & Transactions */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Profil Saya</TabsTrigger>
            <TabsTrigger value="transactions">Riwayat Transaksi</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
                <CardDescription>Data pribadi anggota koperasi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{currentUser.name}</h3>
                      <p className="text-gray-600">{currentUser.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <Label className="text-gray-600">Username</Label>
                      <p className="font-medium">{currentUser.username}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Status</Label>
                      <p className="font-medium text-green-600">Anggota Aktif</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Transaksi Saya</CardTitle>
                <CardDescription>Semua aktivitas simpanan dan pinjaman Anda</CardDescription>
              </CardHeader>
              <CardContent>
                {userTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {userTransactions.map((transaction) => (
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
                            <p className="font-medium capitalize">{transaction.type}</p>
                            <p className="text-sm text-gray-600">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
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
                  <div className="text-center py-8 text-gray-500">
                    <p>Belum ada transaksi</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberDashboard