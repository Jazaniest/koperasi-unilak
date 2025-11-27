import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2 } from 'lucide-react';
import { initializeStorage, getUsers } from '@/helpers/storageKeys';
import type { LoginPageProps } from '@/types/Types';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initializeStorage();
  }, []);

  const handleLogin = (): void => {
    const users = getUsers();
    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      onLogin(user);
    } else {
      setError('Username atau password salah!');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
      <Card className="w-full max-w-sm sm:max-w-md mx-auto">
        <CardHeader className="text-center px-4 sm:px-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-600" />
          </div>
          <CardTitle className="text-xl sm:text-2xl">Koperasi Simpan Pinjam</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Masuk ke akun Anda</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-3 sm:space-y-4">
            {error && (
              <Alert variant="destructive" className="py-2 sm:py-3">
                <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="username" className="text-xs sm:text-sm">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-sm sm:text-base"
              />
            </div>

            <Button className="w-full text-sm sm:text-base h-9 sm:h-10" onClick={handleLogin}>
              Masuk
            </Button>

            <div className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded">
              <p className="font-semibold mb-1 sm:mb-2">Demo Akun:</p>
              <p className="break-words">Admin: admin / admin123</p>
              <p className="break-words">Member: john / member123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage