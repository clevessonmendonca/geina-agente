import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Ranking IA', path: '/ranking', icon: 'trophy' },
    ...(user?.role === 'gestor'
      ? [
          { label: 'Dashboard', path: '/dashboard', icon: 'chart' },
          { label: 'Aprovações', path: '/gestao/aprovacoes', icon: 'check' }
        ]
      : []),
    { label: 'Minhas Ideias', path: '/minhas-ideias', icon: 'list' },
    { label: 'Nova Ideia', path: '/nova-ideia', icon: 'plus' },
    { label: 'Relatar Problema', path: '/relatar-problema', icon: 'alert' }
  ];
  

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'chart':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'trophy':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'list':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'plus':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      case 'alert':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'check':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleProfileMenuClose = () => {
    setIsProfileMenuOpen(false);
  };

  return (
    <header className={`bg-caixa-blue text-caixa-white shadow-lg ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Nome */}
          <div className="flex items-center">
            <Logo size="sm" variant="negative" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems
              .filter((item) => item.path !== '/gestao/aprovacoes' || user?.role === 'gestor')
              .map((item) => (
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
                <span className="mr-2">{getIcon(item.icon)}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:block relative">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-3 p-2 rounded-caixa hover:bg-caixa-blue-light transition-colors duration-200"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.nome}</p>
                    <p className="text-xs opacity-75">{user.cargo} - {user.unidade}</p>
                  </div>
                  <div className="w-8 h-8 bg-caixa-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-caixa-white font-semibold text-sm">
                      {user.nome.charAt(0)}
                    </span>
                  </div>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-caixa shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          handleProfileMenuClose();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Meu Perfil
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/minhas-ideias');
                          handleProfileMenuClose();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Minhas Ideias
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/nova-ideia');
                          handleProfileMenuClose();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Nova Ideia
                        </div>
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          handleLogout();
                          handleProfileMenuClose();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sair
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

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
              {navigationItems
                .filter((item) => item.path !== '/gestao/aprovacoes' || user?.role === 'gestor')
                .map((item) => (
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
                  <span className="mr-3">{getIcon(item.icon)}</span>
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
                <div className="mt-3 px-4 space-y-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-caixa-white hover:bg-caixa-blue-light rounded-caixa transition-colors duration-200"
                  >
                    Meu Perfil
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-200 hover:bg-red-500 hover:text-white rounded-caixa transition-colors duration-200"
                  >
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay para fechar o menu do perfil */}
      {isProfileMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={handleProfileMenuClose}
        />
      )}
    </header>
  );
};

export default Header;
