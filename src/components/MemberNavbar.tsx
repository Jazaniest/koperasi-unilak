import { Building2, Home, PiggyBank, CreditCard, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import type { User } from '@/types/Types';

const MemberNavbar: React.FC<{ 
  currentUser: User; 
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ currentUser, onLogout, activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'simpanan', label: 'Simpanan', icon: PiggyBank },
    { id: 'pinjaman', label: 'Pinjaman', icon: CreditCard },
  ];

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsOpen(false);
  };

  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Desktop Navigation */}
        <div className="hidden sm:flex justify-between items-center py-3 sm:py-4">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-indigo-600" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Koperasi</h1>
            </div>
            
            <nav className="flex gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'default' : 'ghost'}
                    onClick={() => onTabChange(item.id)}
                    className="gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
              {currentUser.name}
            </span>
            <Button 
              variant="outline" 
              onClick={onLogout} 
              size="sm"
              className="h-8 sm:h-10 text-xs sm:text-sm"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Keluar</span>
              <span className="sm:hidden">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex justify-between items-center py-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            <h1 className="text-lg font-bold text-gray-900">Koperasi</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 truncate max-w-[100px]">
              {currentUser.name}
            </span>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-indigo-600" />
                      <h2 className="text-lg font-bold">Koperasi</h2>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 p-0"
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.id}
                          variant={activeTab === item.id ? 'default' : 'ghost'}
                          onClick={() => handleTabChange(item.id)}
                          className="w-full justify-start gap-3 h-12"
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>

                  <div className="pt-6 border-t">
                    <div className="px-2 py-3 text-sm text-gray-600 mb-2">
                      {currentUser.name}
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={onLogout} 
                      className="w-full gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberNavbar;