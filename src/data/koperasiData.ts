import type { User, Transaction } from '@/types/Types';

export const initialUsers: User[] = [
  { 
    id: 1, 
    username: 'admin', 
    password: 'admin123', 
    role: 'admin', 
    name: 'Administrator',
    email: 'admin@koperasi.com'
  },
  { 
    id: 2, 
    username: 'john', 
    password: 'member123', 
    role: 'member', 
    name: 'John Doe',
    email: 'john@email.com',
    simpanan: 5000000,
    pinjaman: 2000000
  },
  { 
    id: 3, 
    username: 'jane', 
    password: 'member123', 
    role: 'member', 
    name: 'Jane Smith',
    email: 'jane@email.com',
    simpanan: 8000000,
    pinjaman: 0
  },
  { 
    id: 4, 
    username: 'bob', 
    password: 'member123', 
    role: 'member', 
    name: 'Bob Wilson',
    email: 'bob@email.com',
    simpanan: 3500000,
    pinjaman: 5000000
  }
];

export const initialTransactions: Transaction[] = [
  { id: 1, userId: 2, type: 'simpanan', amount: 1000000, date: '2024-01-15', status: 'completed' },
  { id: 2, userId: 2, type: 'pinjaman', amount: 2000000, date: '2024-01-20', status: 'active' },
  { id: 3, userId: 3, type: 'simpanan', amount: 2000000, date: '2024-02-01', status: 'completed' },
  { id: 4, userId: 4, type: 'simpanan', amount: 500000, date: '2024-02-10', status: 'completed' },
  { id: 5, userId: 4, type: 'pinjaman', amount: 5000000, date: '2024-02-15', status: 'active' }
];