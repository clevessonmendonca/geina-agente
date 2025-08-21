interface ExperimentData {
  volume_impacto?: string;
  horizonte_inovacao?: string;
  desafio?: string;
  descricao?: string;
  metricas_kpis?: string;
  baseline?: string;
  resultados_esperados?: string;
  data_inicio?: string;
  data_fim?: string;
  unidade_gestora?: string;
  time_membros?: Array<{ nome: string; matricula: string }>;
  riscos?: Array<{ descricao_risco: string; estrategia_mitigacao: string }>;
}

interface RankingScores {
  impacto: number;
  viabilidade: number;
  urgencia: number;
  alcance: number;
  inovacao: number;
  scoreIA: number;
  prioridade: 'alta' | 'media' | 'baixa';
  tempoEstimado: string;
  recursosNecessarios: string;
}

export const calculateRankingScores = (experiment: ExperimentData): RankingScores => {
  // 1. IMPACTO (50%) - Baseado no volume_impacto e resultados_esperados
  let impactoScore = 50; // Base
  
  if (experiment.volume_impacto) {
    switch (experiment.volume_impacto.toLowerCase()) {
      case 'alto':
        impactoScore = 90;
        break;
      case 'médio':
        impactoScore = 70;
        break;
      case 'baixo':
        impactoScore = 50;
        break;
    }
  }
  
  // Bonus por resultados esperados bem definidos
  if (experiment.resultados_esperados && experiment.resultados_esperados.length > 50) {
    impactoScore += 10;
  }
  
  impactoScore = Math.min(100, impactoScore);

  // 2. VIABILIDADE (75%) - Baseado no horizonte_inovacao e time_membros
  let viabilidadeScore = 50; // Base
  
  if (experiment.horizonte_inovacao) {
    switch (experiment.horizonte_inovacao) {
      case 'H1':
        viabilidadeScore = 85;
        break;
      case 'H2':
        viabilidadeScore = 75;
        break;
      case 'H3':
        viabilidadeScore = 65;
        break;
    }
  }
  
  // Bonus por ter time definido
  if (experiment.time_membros && experiment.time_membros.length > 0) {
    viabilidadeScore += 10;
  }
  
  viabilidadeScore = Math.min(100, viabilidadeScore);

  // 3. URGÊNCIA (94%) - Baseado no desafio e data_inicio
  let urgenciaScore = 70; // Base
  
  // Analisar o desafio para determinar urgência
  const desafio = experiment.desafio?.toLowerCase() || '';
  if (desafio.includes('crítico') || desafio.includes('urgente') || desafio.includes('emergência')) {
    urgenciaScore = 95;
  } else if (desafio.includes('importante') || desafio.includes('necessário')) {
    urgenciaScore = 85;
  } else if (desafio.includes('melhoria') || desafio.includes('otimização')) {
    urgenciaScore = 75;
  }
  
  // Bonus por ter data de início próxima
  if (experiment.data_inicio) {
    const dataInicio = new Date(experiment.data_inicio);
    const hoje = new Date();
    const diffDias = Math.ceil((dataInicio.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDias <= 30) urgenciaScore += 15;
    else if (diffDias <= 90) urgenciaScore += 10;
    else if (diffDias <= 180) urgenciaScore += 5;
  }
  
  urgenciaScore = Math.min(100, urgenciaScore);

  // 4. ALCANCE (81%) - Baseado na unidade_gestora e descrição
  let alcanceScore = 60; // Base
  
  // Analisar unidade gestora para determinar alcance
  const unidade = experiment.unidade_gestora?.toLowerCase() || '';
  if (unidade.includes('nacional') || unidade.includes('geral')) {
    alcanceScore = 90;
  } else if (unidade.includes('regional') || unidade.includes('estadual')) {
    alcanceScore = 80;
  } else if (unidade.includes('local') || unidade.includes('municipal')) {
    alcanceScore = 70;
  }
  
  // Bonus por descrição detalhada
  if (experiment.descricao && experiment.descricao.length > 200) {
    alcanceScore += 10;
  }
  
  alcanceScore = Math.min(100, alcanceScore);

  // 5. INOVAÇÃO (98%) - Baseado na descrição e tecnologias mencionadas
  let inovacaoScore = 70; // Base
  
  const descricao = experiment.descricao?.toLowerCase() || '';
  
  // Tecnologias inovadoras
  const tecnologiasInovadoras = [
    'inteligência artificial', 'ia', 'machine learning', 'ml', 'deep learning',
    'blockchain', 'iot', 'internet das coisas', 'realidade virtual', 'rv',
    'realidade aumentada', 'ra', 'chatbot', 'automação', 'robótica',
    'biometria', 'cloud', 'nuvem', 'big data', 'analytics'
  ];
  
  const tecnologiasEncontradas = tecnologiasInovadoras.filter(tech => 
    descricao.includes(tech)
  ).length;
  
  inovacaoScore += tecnologiasEncontradas * 8;
  
  // Bonus por métricas bem definidas
  if (experiment.metricas_kpis && experiment.metricas_kpis.length > 30) {
    inovacaoScore += 10;
  }
  
  inovacaoScore = Math.min(100, inovacaoScore);

  // Calcular score final
  const scoreIA = Math.round((impactoScore + viabilidadeScore + urgenciaScore + alcanceScore + inovacaoScore) / 5);
  
  // Determinar prioridade
  const prioridade: 'alta' | 'media' | 'baixa' = scoreIA >= 85 ? 'alta' : scoreIA >= 75 ? 'media' : 'baixa';

  // Calcular tempo estimado baseado no horizonte
  let tempoEstimado = '6 meses';
  if (experiment.horizonte_inovacao === 'H1') {
    tempoEstimado = '3 meses';
  } else if (experiment.horizonte_inovacao === 'H2') {
    tempoEstimado = '6 meses';
  } else if (experiment.horizonte_inovacao === 'H3') {
    tempoEstimado = '12 meses';
  }

  // Calcular recursos necessários baseado no time e complexidade
  const numMembros = experiment.time_membros?.length || 1;
  const complexidade = scoreIA > 80 ? 'alta' : scoreIA > 60 ? 'média' : 'baixa';
  
  let recursosNecessarios = `Equipe de ${numMembros} pessoas`;
  if (complexidade === 'alta') {
    recursosNecessarios += `, R$ ${(numMembros * 0.5 + 1).toFixed(1)}M`;
  } else if (complexidade === 'média') {
    recursosNecessarios += `, R$ ${(numMembros * 0.3 + 0.5).toFixed(1)}M`;
  } else {
    recursosNecessarios += `, R$ ${(numMembros * 0.2 + 0.2).toFixed(1)}M`;
  }

  return {
    impacto: impactoScore,
    viabilidade: viabilidadeScore,
    urgencia: urgenciaScore,
    alcance: alcanceScore,
    inovacao: inovacaoScore,
    scoreIA,
    prioridade,
    tempoEstimado,
    recursosNecessarios
  };
};

export const generateTags = (experiment: ExperimentData): string[] => {
  const tags = [];
  const descricao = experiment.descricao?.toLowerCase() || '';
  const desafio = experiment.desafio?.toLowerCase() || '';
  const unidade = experiment.unidade_gestora?.toLowerCase() || '';
  
  // Tags baseadas em tecnologias
  if (descricao.includes('ia') || descricao.includes('inteligência artificial')) tags.push('IA');
  if (descricao.includes('mobile') || descricao.includes('app')) tags.push('Mobile');
  if (descricao.includes('blockchain')) tags.push('Blockchain');
  if (descricao.includes('iot') || descricao.includes('internet das coisas')) tags.push('IoT');
  if (descricao.includes('segurança') || descricao.includes('fraude')) tags.push('Segurança');
  if (descricao.includes('sustentabilidade') || descricao.includes('energia')) tags.push('Sustentabilidade');
  if (descricao.includes('atendimento') || descricao.includes('cliente')) tags.push('Atendimento');
  if (descricao.includes('processo') || descricao.includes('automação')) tags.push('Automação');
  if (descricao.includes('dados') || descricao.includes('analytics')) tags.push('Analytics');
  
  // Tags baseadas na unidade gestora
  if (unidade.includes('habitação')) tags.push('Habitação');
  if (unidade.includes('risco')) tags.push('Risco');
  if (unidade.includes('ti') || unidade.includes('tecnologia')) tags.push('Tecnologia');
  if (unidade.includes('compliance')) tags.push('Compliance');
  if (unidade.includes('atendimento')) tags.push('Atendimento');
  
  // Tags baseadas no desafio
  if (desafio.includes('tempo') || desafio.includes('velocidade')) tags.push('Performance');
  if (desafio.includes('custo') || desafio.includes('economia')) tags.push('Eficiência');
  if (desafio.includes('qualidade') || desafio.includes('precisão')) tags.push('Qualidade');
  
  // Remover duplicatas e garantir pelo menos uma tag
  const uniqueTags = [...new Set(tags)];
  return uniqueTags.length > 0 ? uniqueTags : ['Inovação'];
};

export const determineCategory = (experiment: ExperimentData): string => {
  const unidade = experiment.unidade_gestora?.toLowerCase() || '';
  const descricao = experiment.descricao?.toLowerCase() || '';
  
  if (unidade.includes('habitação') || descricao.includes('habitação')) return 'produtos';
  if (unidade.includes('risco') || unidade.includes('compliance') || descricao.includes('processo')) return 'processos';
  if (unidade.includes('ti') || unidade.includes('tecnologia') || descricao.includes('tecnologia')) return 'tecnologia';
  if (unidade.includes('atendimento') || descricao.includes('atendimento') || descricao.includes('cliente')) return 'atendimento';
  if (descricao.includes('sustentabilidade') || descricao.includes('energia') || descricao.includes('ambiental')) return 'sustentabilidade';
  
  return 'outros';
};
