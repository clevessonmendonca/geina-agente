import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Ranking IA', path: '/ranking', icon: '🏆' },
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Nova Ideia', path: '/nova-ideia', icon: '💡' },
    { label: 'Relatar Problema', path: '/relatar-problema', icon: '🚨' }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={`bg-caixa-blue text-caixa-white shadow-lg ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Nome */}
          <div className="flex items-center">
            <Logo size="sm" variant="negative" />
            <h1 className="ml-3 text-xl font-bold">Hacktoon</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-4 py-2 rounded-caixa font-medium transition-colors duration-200
                  ${location.pathname === item.path 
                    ? 'bg-caixa-white text-caixa-blue' 
                    : 'text-caixa-white hover:bg-caixa-blue-light hover:text-caixa-white'
                  }
                `}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.nome}</p>
                  <p className="text-xs opacity-75">{user.cargo} - {user.unidade}</p>
                </div>
                <div className="w-8 h-8 bg-caixa-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-caixa-white font-semibold text-sm">
                    {user.nome.charAt(0)}
                  </span>
                </div>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="btn-secondary text-sm px-4 py-2"
            >
              Sair
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-caixa text-caixa-white hover:bg-caixa-blue-light transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-caixa-blue-light">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    flex items-center px-4 py-3 rounded-caixa font-medium transition-colors duration-200
                    ${location.pathname === item.path 
                      ? 'bg-caixa-white text-caixa-blue' 
                      : 'text-caixa-white hover:bg-caixa-blue-light'
                    }
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {user && (
              <div className="mt-4 pt-4 border-t border-caixa-blue-light">
                <div className="flex items-center space-x-3 px-4">
                  <div className="w-8 h-8 bg-caixa-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-caixa-white font-semibold text-sm">
                      {user.nome.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.nome}</p>
                    <p className="text-xs opacity-75">{user.cargo} - {user.unidade}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
