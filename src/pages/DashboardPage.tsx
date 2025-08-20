import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Select from '../components/Select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Zap, 
  Star, 
  Clock, 
  Award,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calendar
} from 'lucide-react';

interface DashboardMetric {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

const DashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30dias');

  // Dados para gráficos
  const ideiasPorCategoria = [
    { name: 'Tecnologia', value: 35, fill: '#005CA9' },
    { name: 'Processos', value: 28, fill: '#F78100' },
    { name: 'Atendimento', value: 22, fill: '#007DC5' },
    { name: 'Produtos', value: 15, fill: '#6E6E6E' },
    { name: 'Sustentabilidade', value: 12, fill: '#28A745' },
    { name: 'Outros', value: 8, fill: '#6F42C1' }
  ];

  const ideiasPorStatus = [
    { name: 'Em Votação', value: 45, fill: '#005CA9' },
    { name: 'Aprovado', value: 25, fill: '#28A745' },
    { name: 'Implementado', value: 15, fill: '#F78100' },
    { name: 'Rejeitado', value: 15, fill: '#DC3545' }
  ];

  const votosPorMes = [
    { name: 'Jan', votos: 120, ideias: 15 },
    { name: 'Fev', votos: 180, ideias: 22 },
    { name: 'Mar', votos: 150, ideias: 18 },
    { name: 'Abr', votos: 220, ideias: 25 },
    { name: 'Mai', votos: 280, ideias: 30 },
    { name: 'Jun', votos: 320, ideias: 35 }
  ];

  const scoreIAPorCategoria = [
    { categoria: 'Tecnologia', score: 89.5, implementadas: 8 },
    { categoria: 'Processos', score: 82.3, implementadas: 6 },
    { categoria: 'Atendimento', score: 85.7, implementadas: 5 },
    { categoria: 'Produtos', score: 78.9, implementadas: 3 },
    { categoria: 'Sustentabilidade', score: 91.2, implementadas: 4 },
    { categoria: 'Outros', score: 75.4, implementadas: 2 }
  ];

  // Métricas principais
  const metrics: DashboardMetric[] = [
    {
      title: 'Total de Ideias',
      value: 120,
      change: 12.5,
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'text-caixa-blue'
    },
    {
      title: 'Ideias Aprovadas',
      value: 25,
      change: 8.3,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-green-600'
    },
    {
      title: 'Ideias Implementadas',
      value: 15,
      change: 15.2,
      icon: <Award className="w-6 h-6" />,
      color: 'text-caixa-orange'
    },
    {
      title: 'Score Médio IA',
      value: '87.3',
      change: 5.1,
      icon: <Zap className="w-6 h-6" />,
      color: 'text-purple-600'
    },
    {
      title: 'Economia Gerada',
      value: 'R$ 2.8M',
      change: 22.4,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-green-600'
    },
    {
      title: 'Tempo Médio Implementação',
      value: '4.2 meses',
      change: -8.7,
      icon: <Calendar className="w-6 h-6" />,
      color: 'text-blue-600'
    }
  ];

  const timeRangeOptions = [
    { value: '7dias', label: 'Últimos 7 dias' },
    { value: '30dias', label: 'Últimos 30 dias' },
    { value: '90dias', label: 'Últimos 90 dias' },
    { value: '1ano', label: 'Último ano' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-caixa-white p-3 border border-gray-200 rounded-caixa shadow-lg">
          <p className="font-semibold text-caixa-black">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-caixa-black mb-2">
                Dashboard de Inovação
              </h1>
              <p className="text-caixa-gray">
                Métricas e insights sobre as ideias de inovação da CAIXA
              </p>
            </div>
            
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Select
                label="Período"
                options={timeRangeOptions}
                value={timeRange}
                onChange={setTimeRange}
              />
              <Link
                to="/ranking"
                className="btn-primary inline-flex items-center"
              >
                <span className="mr-2">📊</span>
                Ver Ranking
              </Link>
            </div>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} variant="elevated">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-caixa-gray mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-caixa-black">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`w-4 h-4 ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'} mr-1`} />
                    <span className={`text-sm font-semibold ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change >= 0 ? '+' : ''}{metric.change}%
                    </span>
                    <span className="text-xs text-caixa-gray ml-1">vs mês anterior</span>
                  </div>
                </div>
                <div className={`p-3 rounded-caixa-lg bg-gray-50 ${metric.color}`}>
                  {metric.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Votos por Mês */}
          <Card>
            <h3 className="text-lg font-semibold text-caixa-black mb-4">
              Evolução de Votos e Ideias
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={votosPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="votos" 
                  stroke="#005CA9" 
                  fill="#005CA9" 
                  fillOpacity={0.3}
                  name="Votos"
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="ideias" 
                  stroke="#F78100" 
                  fill="#F78100" 
                  fillOpacity={0.3}
                  name="Ideias"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Gráfico de Ideias por Categoria */}
          <Card>
            <h3 className="text-lg font-semibold text-caixa-black mb-4">
              Ideias por Categoria
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                                 <Pie
                   data={ideiasPorCategoria}
                   cx="50%"
                   cy="50%"
                   labelLine={false}
                   label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                   outerRadius={80}
                   fill="#8884d8"
                   dataKey="value"
                 >
                  {ideiasPorCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Gráficos Adicionais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Score IA por Categoria */}
          <Card>
            <h3 className="text-lg font-semibold text-caixa-black mb-4">
              Score IA por Categoria
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreIAPorCategoria}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" fill="#005CA9" name="Score IA" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Status das Ideias */}
          <Card>
            <h3 className="text-lg font-semibold text-caixa-black mb-4">
              Status das Ideias
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ideiasPorStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ideiasPorStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Top Ideias */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-caixa-black">
              Top 5 Ideias com Maior Score IA
            </h3>
            <Link to="/ranking" className="text-caixa-blue hover:text-caixa-blue-light font-semibold">
              Ver todas →
            </Link>
          </div>
          
          <div className="space-y-4">
            {[
              { titulo: 'Sistema de IA para Detecção de Fraudes', score: 94.5, categoria: 'Tecnologia', autor: 'Maria Silva' },
              { titulo: 'App Mobile para Atendimento Prioritário', score: 89.2, categoria: 'Atendimento', autor: 'João Santos' },
              { titulo: 'Processo Digital com Blockchain', score: 82.7, categoria: 'Processos', autor: 'Ana Costa' },
              { titulo: 'Sistema de Gestão de Energia IoT', score: 78.4, categoria: 'Sustentabilidade', autor: 'Carlos Lima' },
              { titulo: 'Automação de Processos Críticos', score: 76.8, categoria: 'Processos', autor: 'Fernanda Silva' }
            ].map((idea, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-caixa">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-caixa-orange rounded-full flex items-center justify-center text-caixa-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-caixa-black">{idea.titulo}</h4>
                    <p className="text-sm text-caixa-gray">{idea.categoria} • {idea.autor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-caixa-blue">{idea.score}</div>
                  <div className="text-xs text-caixa-gray">Score IA</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default DashboardPage;
