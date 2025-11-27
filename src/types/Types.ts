export interface User {
  id: number;
  username: string;
  password: string;
  role: 'admin' | 'member';
  name: string;
  email: string;
  simpanan?: number;
  pinjaman?: number;
}

export interface Transaction {
  id: number;
  userId: number;
  type: 'simpanan' | 'pinjaman';
  amount: number;
  date: string;
  status: 'completed' | 'active';
}

export interface LoginPageProps {
  onLogin: (user: User) => void;
}

export interface DashboardProps {
  currentUser: User;
  onLogout: () => void;
}