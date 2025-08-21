import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import type { User } from '../services/userService';

interface UserSelectorProps {
  onUserSelect: (user: User) => void;
  selectedUsers: User[];
  className?: string;
}

const UserSelector: React.FC<UserSelectorProps> = ({ 
  onUserSelect, 
  selectedUsers, 
  className = '' 
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await userService.getAllUsers();
      // Filtrar apenas usuários ativos
      const activeUsers = allUsers.filter(user => user.status);
      setUsers(activeUsers);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.nome_completo.toLowerCase().includes(searchLower) ||
      user.matricula.includes(searchLower) ||
      user.cargo.toLowerCase().includes(searchLower) ||
      user.unidade_departamento.toLowerCase().includes(searchLower)
    );
  });

  const isUserSelected = (user: User) => {
    return selectedUsers.some(selected => selected.user_id === user.user_id);
  };

  const handleUserClick = (user: User) => {
    if (!isUserSelected(user)) {
      onUserSelect(user);
    }
  };

  if (loading) {
    return (
      <div className={`p-4 text-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-caixa-blue mx-auto"></div>
        <p className="text-caixa-gray mt-2">Carregando usuários...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 text-center ${className}`}>
        <p className="text-caixa-error">{error}</p>
        <button 
          onClick={loadUsers}
          className="mt-2 px-4 py-2 bg-caixa-blue text-white rounded-lg hover:bg-caixa-dark-blue"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Campo de busca */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por nome, matrícula, cargo ou departamento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caixa-blue focus:border-transparent"
        />
        <svg 
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Lista de usuários */}
      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-caixa-gray">
            {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário disponível'}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div
                key={user.user_id}
                onClick={() => handleUserClick(user)}
                className={`
                  p-3 cursor-pointer transition-colors duration-200
                  ${isUserSelected(user) 
                    ? 'bg-caixa-blue bg-opacity-10 border-l-4 border-caixa-blue' 
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-caixa-black">
                      {user.nome_completo}
                      {isUserSelected(user) && (
                        <span className="ml-2 text-caixa-blue text-sm">✓ Selecionado</span>
                      )}
                    </h4>
                    <p className="text-sm text-caixa-gray">Matrícula: {user.matricula}</p>
                    <p className="text-sm text-caixa-gray">{user.cargo}</p>
                    <p className="text-xs text-caixa-gray">{user.unidade_departamento}</p>
                  </div>
                  {isUserSelected(user) && (
                    <div className="text-caixa-blue">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSelector;
