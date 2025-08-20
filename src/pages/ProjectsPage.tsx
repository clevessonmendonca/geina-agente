import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Select from '../components/Select';

interface Project {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  autor: string;
  votos: number;
  status: 'em-votacao' | 'aprovado' | 'rejeitado' | 'implementado';
  dataCriacao: string;
  impacto: string;
  viabilidade: string;
}

const ProjectsPage: React.FC = () => {
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('votos');

  // Mock data
  const projects: Project[] = [
    {
      id: '1',
      titulo: 'App Mobile para Atendimento Prioritário',
      descricao: 'Desenvolvimento de aplicativo mobile para agendamento de atendimento prioritário, reduzindo filas e melhorando a experiência do cliente.',
      categoria: 'tecnologia',
      autor: 'Maria Silva',
      votos: 45,
      status: 'em-votacao',
      dataCriacao: '2024-01-15',
      impacto: 'alto',
      viabilidade: 'alta'
    },
    {
      id: '2',
      titulo: 'Sistema de Gestão de Energia Sustentável',
      descricao: 'Implementação de sistema inteligente para monitoramento e otimização do consumo de energia nas agências, promovendo sustentabilidade.',
      categoria: 'sustentabilidade',
      autor: 'João Santos',
      votos: 32,
      status: 'aprovado',
      dataCriacao: '2024-01-10',
      impacto: 'medio',
      viabilidade: 'media'
    },
    {
      id: '3',
      titulo: 'Processo Digital de Abertura de Contas',
      descricao: 'Automação completa do processo de abertura de contas, eliminando papel e reduzindo tempo de processamento em 70%.',
      categoria: 'processos',
      autor: 'Ana Costa',
      votos: 28,
      status: 'em-votacao',
      dataCriacao: '2024-01-12',
      impacto: 'critico',
      viabilidade: 'alta'
    }
  ];

  const categorias = [
    { value: '', label: 'Todas as categorias' },
    { value: 'tecnologia', label: 'Tecnologia' },
    { value: 'processos', label: 'Processos' },
    { value: 'atendimento', label: 'Atendimento ao Cliente' },
    { value: 'produtos', label: 'Produtos e Serviços' },
    { value: 'sustentabilidade', label: 'Sustentabilidade' },
    { value: 'outros', label: 'Outros' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'em-votacao', label: 'Em Votação' },
    { value: 'aprovado', label: 'Aprovado' },
    { value: 'rejeitado', label: 'Rejeitado' },
    { value: 'implementado', label: 'Implementado' }
  ];

  const sortOptions = [
    { value: 'votos', label: 'Mais Votados' },
    { value: 'data', label: 'Mais Recentes' },
    { value: 'impacto', label: 'Maior Impacto' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em-votacao':
        return 'bg-blue-100 text-blue-800';
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      case 'implementado':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'em-votacao':
        return 'Em Votação';
      case 'aprovado':
        return 'Aprovado';
      case 'rejeitado':
        return 'Rejeitado';
      case 'implementado':
        return 'Implementado';
      default:
        return status;
    }
  };

  const filteredProjects = projects
    .filter(project => !filterCategoria || project.categoria === filterCategoria)
    .filter(project => !filterStatus || project.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'votos':
          return b.votos - a.votos;
        case 'data':
          return new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime();
        case 'impacto':
          const impactoOrder = { critico: 4, alto: 3, medio: 2, baixo: 1 };
          return impactoOrder[b.impacto as keyof typeof impactoOrder] - impactoOrder[a.impacto as keyof typeof impactoOrder];
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-caixa-black mb-2">
                Ideias em Votação
              </h1>
              <p className="text-caixa-gray">
                Explore e vote nas melhores ideias de inovação da CAIXA
              </p>
            </div>
            
            <Link
              to="/nova-ideia"
              className="btn-primary mt-4 md:mt-0 inline-flex items-center"
            >
              <span className="mr-2">💡</span>
              Nova Ideia
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Categoria"
              options={categorias}
              value={filterCategoria}
              onChange={setFilterCategoria}
            />
            
            <Select
              label="Status"
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
            />
            
            <Select
              label="Ordenar por"
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
            />
          </div>
        </Card>

        {/* Lista de Projetos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} variant="elevated" className="hover:shadow-xl transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-caixa-black mb-2">
                    {project.titulo}
                  </h3>
                  <p className="text-caixa-gray text-sm mb-3 line-clamp-3">
                    {project.descricao}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-caixa-gray">
                  <span>👤 {project.autor}</span>
                  <span>📅 {new Date(project.dataCriacao).toLocaleDateString('pt-BR')}</span>
                </div>
                
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                  {getStatusLabel(project.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-caixa-gray">Impacto:</span>
                  <span className="ml-1 font-semibold text-caixa-black capitalize">{project.impacto}</span>
                </div>
                <div>
                  <span className="text-caixa-gray">Viabilidade:</span>
                  <span className="ml-1 font-semibold text-caixa-black capitalize">{project.viabilidade}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-caixa-gray text-sm">Votos:</span>
                  <span className="font-semibold text-caixa-blue">{project.votos}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-sm font-semibold text-caixa-blue border border-caixa-blue rounded-caixa hover:bg-caixa-blue hover:text-caixa-white transition-colors duration-200">
                    Votar
                  </button>
                  <button className="px-4 py-2 text-sm font-semibold text-caixa-gray border border-gray-300 rounded-caixa hover:bg-gray-50 transition-colors duration-200">
                    Detalhes
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-caixa-black mb-2">
              Nenhuma ideia encontrada
            </h3>
            <p className="text-caixa-gray mb-4">
              Tente ajustar os filtros ou seja o primeiro a compartilhar uma ideia!
            </p>
            <Link to="/nova-ideia" className="btn-primary">
              Compartilhar Ideia
            </Link>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ProjectsPage;
