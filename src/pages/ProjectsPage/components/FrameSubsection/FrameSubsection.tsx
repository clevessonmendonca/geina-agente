import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";
import { Separator } from "../../../../components/ui/separator";
import { Badge } from "../../../../components/ui/badge";

const ideasData = [
  {
    category: "PRODUTO - CANAIS DIGITAIS | 15/12/2024",
    title: "App Caixa com reconhecimento biométrico avançado para transações de alto valor",
    author: "Maria Santos - Agência Centro",
    aiScore: 8.5,
    impact: "Alto",
    viability: 85,
    status: "Em Triagem",
    description: "Implementar reconhecimento facial e de voz no app para aumentar segurança em transações acima de R$ 10.000"
  },
  {
    category: "PROCESSO INTERNO - CRÉDITO | 14/12/2024", 
    title: "Automatização completa da análise de crédito habitacional usando IA",
    author: "Carlos Lima - Superintendência Regional SP",
    aiScore: 9.2,
    impact: "Muito Alto",
    viability: 78,
    status: "Em Avaliação",
    description: "Sistema de IA para análise automática de documentos e histórico creditício, reduzindo tempo de aprovação de 30 para 5 dias"
  },
  {
    category: "ATENDIMENTO - AGÊNCIAS | 13/12/2024",
    title: "Chatbot especializado em FGTS com integração ao sistema interno",
    author: "Ana Paula - Agência Brasília Norte",
    aiScore: 7.8,
    impact: "Médio",
    viability: 92,
    status: "Em Triagem",
    description: "Assistente virtual para consultas de FGTS, saque emergencial e orientações sobre benefícios"
  },
  {
    category: "TECNOLOGIA - INFRAESTRUTURA | 12/12/2024",
    title: "Migração para arquitetura de microserviços na plataforma de pagamentos",
    author: "Roberto Silva - TI Corporativa",
    aiScore: 8.9,
    impact: "Alto",
    viability: 65,
    status: "Em Avaliação",
    description: "Modernização da arquitetura para suportar maior volume de transações PIX e reduzir latência"
  },
  {
    category: "PRODUTO - HABITAÇÃO | 11/12/2024",
    title: "Plataforma digital para simulação e contratação de financiamento habitacional",
    author: "Fernanda Costa - Habitação Nacional",
    aiScore: 8.1,
    impact: "Alto",
    viability: 88,
    status: "Aprovada",
    description: "Portal completo para simulação, documentação digital e assinatura eletrônica de contratos habitacionais"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Em Triagem": return "bg-yellow-100 text-yellow-800";
    case "Em Avaliação": return "bg-blue-100 text-blue-800";
    case "Aprovada": return "bg-green-100 text-green-800";
    case "Implementada": return "bg-purple-100 text-purple-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "Muito Alto": return "text-red-600";
    case "Alto": return "text-orange-600";
    case "Médio": return "text-yellow-600";
    case "Baixo": return "text-green-600";
    default: return "text-gray-600";
  }
};

export const FrameSubsection = (): JSX.Element => {
  return (
    <section className="flex flex-col w-full max-w-[1140px] mx-auto items-start gap-6 relative">
      {ideasData.map((idea, index) => (
        <Card
          key={index}
          className="flex flex-col w-full items-end gap-6 relative border border-gray-200 shadow-sm bg-white rounded-lg p-6"
        >
          <CardContent className="flex w-full items-start justify-between relative p-0">
            <div className="flex flex-col w-[800px] items-start gap-4 relative">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {idea.category}
                </Badge>
                <Badge className={getStatusColor(idea.status)}>
                  {idea.status}
                </Badge>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 leading-tight">
                {idea.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {idea.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Por: <strong>{idea.author}</strong></span>
              </div>

              <div className="flex flex-col w-full gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Viabilidade Técnica</span>
                  <span className="font-semibold text-gray-800">{idea.viability}%</span>
                </div>
                <Progress
                  value={idea.viability}
                  className="w-full h-2 bg-gray-200"
                />
              </div>
            </div>

            <Separator orientation="vertical" className="w-px h-32 bg-gray-200 mx-6" />

            <div className="flex flex-col items-center gap-4 min-w-[200px]">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {idea.aiScore}
                </div>
                <div className="text-sm text-gray-600">Score IA</div>
              </div>

              <div className="text-center">
                <div className={`text-lg font-semibold mb-1 ${getImpactColor(idea.impact)}`}>
                  {idea.impact}
                </div>
                <div className="text-sm text-gray-600">Impacto Esperado</div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Ver Detalhes
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};