import React, { useState } from 'react';
import type { User } from '@/types/Types';
import LoginPage from '@/components/LoginPage';
import AdminDashboard from '@/components/AdminDashboard';
import MemberDashboard from '@/components/MemberDashboard';

const KoperasiPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User): void => {
    setCurrentUser(user);
  };

  const handleLogout = (): void => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentUser.role === 'admin') {
    return <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />;
  }

  return <MemberDashboard currentUser={currentUser} onLogout={handleLogout} />;
};

export default KoperasiPage;