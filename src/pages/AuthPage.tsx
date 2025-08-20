import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-caixa-blue to-caixa-blue-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className="bg-caixa-white rounded-caixa-lg shadow-2xl p-8">
          {isLogin ? (
            <LoginForm onSwitchToRegister={switchToRegister} />
          ) : (
            <RegisterForm onSwitchToLogin={switchToLogin} />
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-caixa-white">
          <p className="text-sm opacity-90">
            © 2024 CAIXA Econômica Federal. Todos os direitos reservados.
          </p>
          <p className="text-xs opacity-75 mt-2">
            Hacktoon - Plataforma de Inovação
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
