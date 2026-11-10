import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Briefcase, Eye, ChevronRight } from 'lucide-react';

interface DemoSwitcherProps {
  navigate: (route: string) => void;
  currentRoute: string;
}

export const DemoSwitcher: React.FC<DemoSwitcherProps> = ({ navigate, currentRoute }) => {
  const { user, switchRoleForDemo, logout } = useAuth();

  return (
    <div className="bg-slate-900 text-slate-300 border-b border-slate-800 text-xs px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Role identification */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Current Role Mode:</span>
          {user ? (
            <span className="font-medium text-white flex items-center gap-1.5 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
              {user.role === 'super_admin' && <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />}
              {user.role === 'staff' && <Briefcase className="w-3.5 h-3.5 text-emerald-400" />}
              {user.role === 'client' && <Users className="w-3.5 h-3.5 text-purple-400" />}
              <span className="capitalize">{user.role.replace('_', ' ')}</span>
              <span className="text-slate-400 font-normal">({user.fullName})</span>
            </span>
          ) : (
            <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Guest / Public Visitor
            </span>
          )}
        </div>

        {/* Quick Switch Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <span className="text-slate-400 hidden md:inline">Test as:</span>
          
          <button
            onClick={() => {
              switchRoleForDemo('super_admin');
              navigate('admin');
            }}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap font-medium ${
              user?.role === 'super_admin'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Super Admin
          </button>

          <button
            onClick={() => {
              switchRoleForDemo('staff');
              navigate('admin');
            }}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap font-medium ${
              user?.role === 'staff'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Staff (Carl)
          </button>

          <button
            onClick={() => {
              switchRoleForDemo('client');
              navigate('client-portal');
            }}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap font-medium ${
              user?.role === 'client'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Client (David - Apex)
          </button>

          <button
            onClick={() => {
              logout();
              navigate('home');
            }}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap font-medium ${
              !user
                ? 'bg-slate-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Eye className="w-3 h-3 inline mr-1" />
            Public Visitor
          </button>
        </div>

      </div>
    </div>
  );
};
