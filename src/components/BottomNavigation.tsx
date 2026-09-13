import React from 'react';
import { useApp, AppView } from '../context/AppContext';
import { Home, Sparkles, CircleDollarSign, Heart } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const navItems: { id: AppView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'ama', label: 'Ama', icon: Sparkles },
    { id: 'earn', label: 'Earn', icon: CircleDollarSign },
    { id: 'care', label: 'Care', icon: Heart },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F0EBE9] shadow-lg"
    >
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => setCurrentView(item.id)}
              className={`flex-1 flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
                isActive ? 'text-[#E61964]' : 'text-[#64748B] hover:text-[#1E232B]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E61964] rounded-full" />
                )}
              </div>
              <span className={`text-[11px] mt-1 whitespace-nowrap ${isActive ? 'font-bold text-[#E61964]' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
