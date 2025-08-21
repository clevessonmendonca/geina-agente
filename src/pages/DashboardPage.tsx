import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Select from '../components/Select';
import { dashboardService, type DashboardData } from '../services/dashboardService';
import CustomDateModal from '../components/CustomDateModal';
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
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Zap, 
  Award,
  Lightbulb,
  CheckCircle,
  Calendar
} from 'lucide-react';

interface DashboardMetric {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}



const DashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30dias');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange, customStartDate, customEndDate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let dataInicio, dataFim;
      if (timeRange === 'personalizado' && customStartDate && customEndDate) {
        dataInicio = customStartDate;
        dataFim = customEndDate;
      }
      
      const data = await dashboardService.getDashboardData(timeRange, dataInicio, dataFim);
      setDashboardData(data);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomDateApply = (startDate: string, endDate: string) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    setTimeRange('personalizado');
  };

  const handleCustomDateCancel = () => {
    setShowCustomModal(false);
  };

  // Cores para os gráficos
  const chartColors = {
    tecnologia: '#005CA9',
    processos: '#F78100',
    atendimento: '#007DC5',
    produtos: '#6E6E6E',
    sustentabilidade: '#28A745',
    outros: '#6F42C1',
    emVotacao: '#005CA9',
    aprovado: '#28A745',
    implementado: '#F78100',
    rejeitado: '#DC3545'
  };

  // Métricas principais baseadas nos dados dinâmicos
  const getMetrics = (): DashboardMetric[] => {
    if (!dashboardData) return [];

    return [
      {
        title: 'Total de Experimentos',
        value: dashboardData.total_experimentos,
        change: 12.5, // TODO: Calcular mudança real
        icon: <Lightbulb className="w-6 h-6" />,
        color: 'text-caixa-blue'
      },
      {
        title: 'Experimentos Aprovados',
        value: dashboardData.experimentos_aprovados,
        change: 8.3, // TODO: Calcular mudança real
        icon: <CheckCircle className="w-6 h-6" />,
        color: 'text-green-600'
      },
      {
        title: 'Experimentos Implementados',
        value: dashboardData.experimentos_implementados,
        change: 15.2, // TODO: Calcular mudança real
        icon: <Award className="w-6 h-6" />,
        color: 'text-caixa-orange'
      },
      {
        title: 'Score Médio IA',
        value: dashboardData.score_medio_ia.toFixed(1),
        change: 5.1, // TODO: Calcular mudança real
        icon: <Zap className="w-6 h-6" />,
        color: 'text-purple-600'
      },
      {
        title: 'Tempo Médio Implementação',
        value: `${dashboardData.tempo_medio_implementacao} meses`,
        change: -8.7, // TODO: Calcular mudança real
        icon: <Calendar className="w-6 h-6" />,
        color: 'text-blue-600'
      }
    ];
  };

  // Dados para gráficos baseados nos dados dinâmicos
  const getIdeiasPorCategoria = () => {
    if (!dashboardData) return [];
    
    return dashboardData.experimentos_por_categoria.map(item => ({
      name: item.categoria,
      value: item.quantidade,
      fill: chartColors[item.categoria.toLowerCase() as keyof typeof chartColors] || chartColors.outros
    }));
  };

  const getIdeiasPorStatus = () => {
    if (!dashboardData) return [];
    
    return dashboardData.experimentos_por_status.map(item => ({
      name: item.status,
      value: item.quantidade,
      fill: chartColors[item.status.toLowerCase().replace(' ', '') as keyof typeof chartColors] || chartColors.outros
    }));
  };

  const getEvolucaoMensal = () => {
    if (!dashboardData) return [];
    
    return dashboardData.evolucao_mensal.map(item => ({
      name: item.mes,
      votos: item.votos,
      ideias: item.experimentos
    }));
  };

  const getScoreIAPorCategoria = () => {
    if (!dashboardData) return [];
    
    return dashboardData.score_ia_por_categoria.map(item => ({
      categoria: item.categoria,
      score: item.score_medio,
      implementadas: item.implementados
    }));
  };

  const getTimeRangeOptions = () => {
    const baseOptions = [
      { value: '7dias', label: 'Últimos 7 dias' },
      { value: '30dias', label: 'Últimos 30 dias' },
      { value: '90dias', label: 'Últimos 90 dias' },
      { value: '1ano', label: 'Último ano' },
      { value: 'personalizado', label: timeRange === 'personalizado' && customStartDate && customEndDate 
        ? `${new Date(customStartDate).toLocaleDateString('pt-BR')} - ${new Date(customEndDate).toLocaleDateString('pt-BR')}`
        : 'Período Personalizado' 
      }
    ];
    return baseOptions;
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-caixa-white p-3 border border-gray-200 rounded-caixa shadow-lg">
          <p className="font-semibold text-caixa-black">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-caixa-blue"></div>
            <span className="ml-3 text-caixa-gray">Carregando dashboard...</span>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-caixa-error mb-4">{error}</p>
            <button 
              onClick={loadDashboardData}
              className="btn-primary"
            >
              Tentar novamente
            </button>
          </div>
        </main>
      </div>
    );
  }

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
                Métricas e insights sobre os experimentos de inovação da CAIXA
              </p>
            </div>
            
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Select
                label="Período"
                options={getTimeRangeOptions()}
                value={timeRange}
                onChange={(value) => {
                  if (value === 'personalizado') {
                    setShowCustomModal(true);
                  } else {
                    setTimeRange(value);
                    setCustomStartDate('');
                    setCustomEndDate('');
                  }
                }}
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
          {getMetrics().map((metric, index) => (
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
              Evolução de Votos e Experimentos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getEvolucaoMensal()}>
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
                  name="Experimentos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Gráfico de Experimentos por Categoria */}
          <Card>
            <h3 className="text-lg font-semibold text-caixa-black mb-4">
              Experimentos por Categoria
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getIdeiasPorCategoria()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent?: number }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getIdeiasPorCategoria().map((entry, index) => (
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
              <BarChart data={getScoreIAPorCategoria()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" fill="#005CA9" name="Score IA" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Status dos Experimentos */}
          <Card>
            <h3 className="text-lg font-semibold text-caixa-black mb-4">
              Status dos Experimentos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getIdeiasPorStatus()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getIdeiasPorStatus().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Top Experimentos */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-caixa-black">
              Top 5 Experimentos com Maior Score IA
            </h3>
            <Link to="/ranking" className="text-caixa-blue hover:text-caixa-blue-light font-semibold">
              Ver todas →
            </Link>
          </div>
          
          <div className="space-y-4">
            {dashboardData?.top_experimentos.map((experimento, index) => (
              <div key={experimento.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-caixa">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-caixa-orange rounded-full flex items-center justify-center text-caixa-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-caixa-black">{experimento.nome_experimento}</h4>
                    <p className="text-sm text-caixa-gray">{experimento.categoria} • {experimento.proponente_nome}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-caixa-blue">{experimento.score_ia}</div>
                  <div className="text-xs text-caixa-gray">Score IA</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>

      {/* Modal de período personalizado */}
      <CustomDateModal
        isOpen={showCustomModal}
        onClose={handleCustomDateCancel}
        onApply={handleCustomDateApply}
        initialStartDate={customStartDate}
        initialEndDate={customEndDate}
      />
    </div>
  );
};

export default DashboardPage;
