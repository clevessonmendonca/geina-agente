import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Badge } from "../../../../components/ui/badge";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { 
  UserIcon, 
  UsersIcon, 
  TargetIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  ShieldCheckIcon, 
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon
} from "lucide-react";

interface FormData {
  // Identificação
  nomeExperimento: string;
  proponente: {
    nome: string;
    matricula: string;
    cgc: string;
    unidadeGestora: string;
  };
  time: Array<{
    nome: string;
    matricula: string;
  }>;
  
  // Planejamento
  desafio: string;
  descricao: string;
  hipoteses: string[];
  testes: string[];
  horizonte: string;
  baseline: string;
  resultadosEsperados: string;
  metricas: string[];
  diretrizesEstrategicas: string[];
  flexibilizacaoNormas: string;
  
  // Impacto e Recursos
  volume: string;
  areasImpactadas: string[];
  stakeholdersExternos: string[];
  estimativaEsforco: {
    rh: string;
    financeiro: string;
    material: string;
  };
  riscos: Array<{
    descricao: string;
    mitigacao: string;
  }>;
  cronograma: {
    inicio: string;
    fim: string;
    etapas: string[];
  };
  detalhesAdicionais: string;
  
  // Governança
  termos: {
    recursosUnidade: boolean;
    registroPerdas: boolean;
    notificacaoOrcamento: boolean;
    relatoriosPeriodicos: boolean;
  };
  assinatura: {
    aceite: boolean;
    local: string;
    data: string;
    gestor: string;
  };
}

interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

interface NovaIdeiaSubsectionProps {
  onVoltar: () => void;
}

export const NovaIdeiaSubsection = ({ onVoltar }: NovaIdeiaSubsectionProps): JSX.Element => {
  const [formData, setFormData] = useState<FormData>({
    nomeExperimento: "",
    proponente: {
      nome: "João Silva", // Simulado - viria do usuário logado
      matricula: "12345",
      cgc: "CGC001",
      unidadeGestora: ""
    },
    time: [{ nome: "", matricula: "" }],
    desafio: "",
    descricao: "",
    hipoteses: [""],
    testes: [""],
    horizonte: "",
    baseline: "",
    resultadosEsperados: "",
    metricas: [""],
    diretrizesEstrategicas: [""],
    flexibilizacaoNormas: "",
    volume: "",
    areasImpactadas: [""],
    stakeholdersExternos: [""],
    estimativaEsforco: {
      rh: "",
      financeiro: "",
      material: ""
    },
    riscos: [{ descricao: "", mitigacao: "" }],
    cronograma: {
      inicio: "",
      fim: "",
      etapas: [""]
    },
    detalhesAdicionais: "",
    termos: {
      recursosUnidade: false,
      registroPerdas: false,
      notificacaoOrcamento: false,
      relatoriosPeriodicos: false
    },
    assinatura: {
      aceite: false,
      local: "",
      data: "",
      gestor: ""
    }
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): ValidationError[] => {
    const newErrors: ValidationError[] = [];

    // Validações de Identificação
    if (!formData.nomeExperimento || formData.nomeExperimento.length < 10) {
      newErrors.push({
        field: "nomeExperimento",
        message: "Nome do experimento deve ser claro e objetivo (mínimo 10 caracteres)",
        severity: "error"
      });
    }

    if (!formData.proponente.unidadeGestora) {
      newErrors.push({
        field: "unidadeGestora",
        message: "Unidade gestora é obrigatória",
        severity: "error"
      });
    }

    if (formData.time.length === 0 || !formData.time[0].nome) {
      newErrors.push({
        field: "time",
        message: "Time deve ter pelo menos um membro além do proponente",
        severity: "error"
      });
    }

    // Validações de Planejamento
    if (!formData.desafio || formData.desafio.length < 50) {
      newErrors.push({
        field: "desafio",
        message: "Desafio deve ser descrito de forma detalhada (mínimo 50 caracteres)",
        severity: "error"
      });
    }

    if (!formData.descricao || formData.descricao.length < 100) {
      newErrors.push({
        field: "descricao",
        message: "Descrição deve ser detalhada (mínimo 100 caracteres)",
        severity: "error"
      });
    }

    if (!formData.horizonte) {
      newErrors.push({
        field: "horizonte",
        message: "Horizonte de inovação é obrigatório",
        severity: "error"
      });
    }

    if (!formData.metricas[0]) {
      newErrors.push({
        field: "metricas",
        message: "Informe pelo menos uma métrica ou KPI",
        severity: "error"
      });
    }

    // Validações de Impacto e Recursos
    if (!formData.volume) {
      newErrors.push({
        field: "volume",
        message: "Volume de impacto é obrigatório",
        severity: "error"
      });
    }

    if (formData.riscos.length === 0 || !formData.riscos[0].descricao) {
      newErrors.push({
        field: "riscos",
        message: "Descreva ao menos um risco com sua mitigação",
        severity: "error"
      });
    }

    // Validações de Governança
    if (!formData.assinatura.aceite) {
      newErrors.push({
        field: "aceite",
        message: "Aceite dos termos é obrigatório",
        severity: "error"
      });
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulação de envio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sucesso - redirecionar ou mostrar mensagem
      console.log("Formulário enviado com sucesso!", formData);
      
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addArrayField = (field: keyof FormData, type: 'string' | 'object') => {
    const currentArray = formData[field] as any[];
    if (type === 'string') {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentArray, ""]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentArray, { descricao: "", mitigacao: "" }]
      }));
    }
  };

  const removeArrayField = (field: keyof FormData, index: number) => {
    const currentArray = formData[field] as any[];
    if (currentArray.length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: currentArray.filter((_, i) => i !== index)
      }));
    }
  };

  const updateArrayField = (field: keyof FormData, index: number, value: any) => {
    const currentArray = formData[field] as any[];
    const newArray = [...currentArray];
    newArray[index] = value;
    
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header com Botão Voltar */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={onVoltar}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Nova Ideia - Cadastro de Experimento</h1>
          <p className="text-gray-600">Formulário para cadastramento de experimentos no Sandbox CAIXA</p>
        </div>
      </div>

      {/* Alertas de Validação */}
      {errors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangleIcon className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Formulário com erros de validação:</strong>
            <ul className="mt-2 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="flex items-center gap-2">
                  {error.severity === 'error' ? (
                    <XCircleIcon className="h-4 w-4 text-red-600" />
                  ) : (
                    <AlertTriangleIcon className="h-4 w-4 text-yellow-600" />
                  )}
                  {error.message}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção: Identificação */}
        <Card>
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <UserIcon className="h-5 w-5" />
              Identificação do Experimento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nomeExperimento" className="text-sm font-medium">
                  Nome do Experimento *
                </Label>
                <Input
                  id="nomeExperimento"
                  value={formData.nomeExperimento}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, nomeExperimento: e.target.value }))}
                  placeholder="Ex: Sistema de automação para análise de crédito"
                  className={getFieldError("nomeExperimento") ? "border-red-500" : ""}
                  aria-describedby={getFieldError("nomeExperimento") ? "nomeExperimento-error" : undefined}
                />
                {getFieldError("nomeExperimento") && (
                  <p id="nomeExperimento-error" className="text-sm text-red-600">
                    {getFieldError("nomeExperimento")?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidadeGestora" className="text-sm font-medium">
                  Unidade Gestora *
                </Label>
                <Select
                  value={formData.proponente.unidadeGestora}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    proponente: { ...prev.proponente, unidadeGestora: value }
                  }))}
                >
                  <SelectTrigger className={getFieldError("unidadeGestora") ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecionar unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TI">Tecnologia da Informação</SelectItem>
                    <SelectItem value="RH">Recursos Humanos</SelectItem>
                    <SelectItem value="FIN">Financeiro</SelectItem>
                    <SelectItem value="COM">Comercial</SelectItem>
                    <SelectItem value="OPE">Operações</SelectItem>
                  </SelectContent>
                </Select>
                {getFieldError("unidadeGestora") && (
                  <p className="text-sm text-red-600">
                    {getFieldError("unidadeGestora")?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Proponente (readonly) */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Proponente</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Nome</span>
                  <p className="font-medium">{formData.proponente.nome}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Matrícula</span>
                  <p className="font-medium">{formData.proponente.matricula}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">CGC</span>
                  <p className="font-medium">{formData.proponente.cgc}</p>
                </div>
              </div>
            </div>

            {/* Time do Experimento */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Time do Experimento *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('time', 'string')}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <UsersIcon className="h-4 w-4 mr-1" />
                  Adicionar Membro
                </Button>
              </div>
              
              {formData.time.map((membro, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm font-medium">Nome</Label>
                    <Input
                      value={membro.nome}
                      onChange={(e) => updateArrayField('time', index, { ...membro, nome: e.target.value })}
                      placeholder="Nome completo do membro"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm font-medium">Matrícula</Label>
                    <Input
                      value={membro.matricula}
                      onChange={(e) => updateArrayField('time', index, { ...membro, matricula: e.target.value })}
                      placeholder="Matrícula CAIXA"
                    />
                  </div>
                  {formData.time.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayField('time', index)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Remover
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seção: Planejamento */}
        <Card>
          <CardHeader className="bg-green-50 border-b">
            <CardTitle className="flex items-center gap-2 text-green-900">
              <TargetIcon className="h-5 w-5" />
              Planejamento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="desafio" className="text-sm font-medium">
                  Desafio que a ideia resolve *
                </Label>
                <Textarea
                  id="desafio"
                  value={formData.desafio}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, desafio: e.target.value }))}
                  placeholder="Descreva detalhadamente o problema que o experimento busca resolver..."
                  rows={4}
                  className={getFieldError("desafio") ? "border-red-500" : ""}
                />
                {getFieldError("desafio") && (
                  <p className="text-sm text-red-600">
                    {getFieldError("desafio")?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-sm font-medium">
                  Descrição do Experimento *
                </Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Detalhe objetivos, metodologia e etapas do experimento..."
                  rows={4}
                  className={getFieldError("descricao") ? "border-red-500" : ""}
                />
                {getFieldError("descricao") && (
                  <p className="text-sm text-red-600">
                    {getFieldError("descricao")?.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="horizonte" className="text-sm font-medium">
                    Horizonte de Inovação *
                  </Label>
                  <Select
                    value={formData.horizonte}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, horizonte: value }))}
                  >
                    <SelectTrigger className={getFieldError("horizonte") ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecionar horizonte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="H1">H1 - Incremental</SelectItem>
                      <SelectItem value="H2">H2 - Radical</SelectItem>
                      <SelectItem value="H3">H3 - Disruptiva</SelectItem>
                    </SelectContent>
                  </Select>
                  {getFieldError("horizonte") && (
                    <p className="text-sm text-red-600">
                      {getFieldError("horizonte")?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="volume" className="text-sm font-medium">
                    Volume de Impacto *
                  </Label>
                  <Input
                    id="volume"
                    value={formData.volume}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, volume: e.target.value }))}
                    placeholder="Ex: 1000 empregados, 5000 clientes"
                    className={getFieldError("volume") ? "border-red-500" : ""}
                  />
                  {getFieldError("volume") && (
                    <p className="text-sm text-red-600">
                      {getFieldError("volume")?.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Hipóteses */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Hipóteses Testáveis</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayField('hipoteses', 'string')}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    Adicionar Hipótese
                  </Button>
                </div>
                
                {formData.hipoteses.map((hipotese, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Input
                        value={hipotese}
                        onChange={(e) => updateArrayField('hipoteses', index, e.target.value)}
                        placeholder="Ex: Se implementarmos X, então Y acontecerá"
                      />
                    </div>
                    {formData.hipoteses.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('hipoteses', index)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Métricas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Métricas e KPIs *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayField('metricas', 'string')}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    Adicionar Métrica
                  </Button>
                </div>
                
                {formData.metricas.map((metrica, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Input
                        value={metrica}
                        onChange={(e) => updateArrayField('metricas', index, e.target.value)}
                        placeholder="Ex: Redução de 30% no tempo de processamento"
                      />
                    </div>
                    {formData.metricas.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('metricas', index)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção: Impacto e Recursos */}
        <Card>
          <CardHeader className="bg-purple-50 border-b">
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <ChartBarIcon className="h-5 w-5" />
              Impacto e Recursos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="baseline" className="text-sm font-medium">
                  Baseline
                </Label>
                <Textarea
                  id="baseline"
                  value={formData.baseline}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, baseline: e.target.value }))}
                  placeholder="Dados atuais que servirão de referência..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resultadosEsperados" className="text-sm font-medium">
                  Resultados Esperados
                </Label>
                <Textarea
                  id="resultadosEsperados"
                  value={formData.resultadosEsperados}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, resultadosEsperados: e.target.value }))}
                  placeholder="Metas e objetivos mensuráveis..."
                  rows={3}
                />
              </div>
            </div>

            {/* Riscos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Riscos e Mitigações *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('riscos', 'object')}
                  className="text-purple-600 border-purple-600 hover:bg-purple-50"
                >
                  Adicionar Risco
                </Button>
              </div>
              
              {formData.riscos.map((risco, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Descrição do Risco</Label>
                    <Input
                      value={risco.descricao}
                      onChange={(e) => updateArrayField('riscos', index, { ...risco, descricao: e.target.value })}
                      placeholder="Descreva o risco identificado"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Estratégia de Mitigação</Label>
                    <Input
                      value={risco.mitigacao}
                      onChange={(e) => updateArrayField('riscos', index, { ...risco, mitigacao: e.target.value })}
                      placeholder="Como será mitigado este risco"
                    />
                  </div>
                  {formData.riscos.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayField('riscos', index)}
                      className="text-red-600 border-red-600 hover:bg-red-50 md:col-span-2"
                    >
                      Remover Risco
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Cronograma */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Cronograma Macro</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Data de Início</Label>
                  <Input
                    type="date"
                    value={formData.cronograma.inicio}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      cronograma: { ...prev.cronograma, inicio: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Data de Fim</Label>
                  <Input
                    type="date"
                    value={formData.cronograma.fim}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      cronograma: { ...prev.cronograma, fim: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção: Governança */}
        <Card>
          <CardHeader className="bg-orange-50 border-b">
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <ShieldCheckIcon className="h-5 w-5" />
              Governança
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Termos de Responsabilidade</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="recursosUnidade"
                      checked={formData.termos.recursosUnidade}
                      onCheckedChange={(checked: boolean | "indeterminate") => setFormData(prev => ({
                        ...prev,
                        termos: { ...prev.termos, recursosUnidade: checked === true }
                      }))}
                    />
                    <Label htmlFor="recursosUnidade" className="text-sm">
                      Recursos serão providos pela unidade gestora
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="registroPerdas"
                      checked={formData.termos.registroPerdas}
                      onCheckedChange={(checked: boolean | "indeterminate") => setFormData(prev => ({
                        ...prev,
                        termos: { ...prev.termos, registroPerdas: checked === true }
                      }))}
                    />
                    <Label htmlFor="registroPerdas" className="text-sm">
                      Registro de perdas em sistema CAIXA
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="notificacaoOrcamento"
                      checked={formData.termos.notificacaoOrcamento}
                      onCheckedChange={(checked: boolean | "indeterminate") => setFormData(prev => ({
                        ...prev,
                        termos: { ...prev.termos, notificacaoOrcamento: checked === true }
                      }))}
                    />
                    <Label htmlFor="notificacaoOrcamento" className="text-sm">
                      Notificação à GEINA ao atingir 80% do orçamento
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="relatoriosPeriodicos"
                      checked={formData.termos.relatoriosPeriodicos}
                      onCheckedChange={(checked: boolean | "indeterminate") => setFormData(prev => ({
                        ...prev,
                        termos: { ...prev.termos, relatoriosPeriodicos: checked === true }
                      }))}
                    />
                    <Label htmlFor="relatoriosPeriodicos" className="text-sm">
                      Relatórios de evolução periódicos
                    </Label>
                  </div>
                </div>
              </div>

              {/* Assinatura */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="aceite"
                    checked={formData.assinatura.aceite}
                    onCheckedChange={(checked: boolean | "indeterminate") => setFormData(prev => ({
                      ...prev,
                      assinatura: { ...prev.assinatura, aceite: checked === true }
                    }))}
                    className={getFieldError("aceite") ? "border-red-500" : ""}
                  />
                  <Label htmlFor="aceite" className="text-sm font-medium">
                    Aceito os termos e condições *
                  </Label>
                </div>
                {getFieldError("aceite") && (
                  <p className="text-sm text-red-600">
                    {getFieldError("aceite")?.message}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="local" className="text-sm font-medium">Local</Label>
                    <Input
                      id="local"
                      value={formData.assinatura.local}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        assinatura: { ...prev.assinatura, local: e.target.value }
                      }))}
                      placeholder="Cidade/UF"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data" className="text-sm font-medium">Data</Label>
                    <Input
                      id="data"
                      type="date"
                      value={formData.assinatura.data}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        assinatura: { ...prev.assinatura, data: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gestor" className="text-sm font-medium">Gestor da Unidade</Label>
                    <Input
                      id="gestor"
                      value={formData.assinatura.gestor}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        assinatura: { ...prev.assinatura, gestor: e.target.value }
                      }))}
                      placeholder="Nome do gestor"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            className="px-8 py-3"
            onClick={onVoltar}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Enviar Experimento
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
