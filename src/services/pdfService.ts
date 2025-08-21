import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface PDFData {
  proponente_nome: string;
  proponente_matricula: string;
  proponente_cgc: string;
  unidade_gestora: string;
  desafio: string;
  hipoteses: string;
  horizonte_inovacao: string;
  volume_impacto: string;
  baseline: string;
  resultados_esperados: string;
  metricas_kpis: string;
  data_inicio: string;
  data_fim: string;
  termos_recursos_unidade: boolean;
  termos_registro_perdas: boolean;
  termos_notificacao_geina: boolean;
  termos_relatorios: boolean;
  aceito_termos: boolean;
  local_assinatura: string;
  data_assinatura: string;
  gestor_unidade: string;
  time_membros: Array<{ nome: string; matricula: string }>;
  riscos: Array<{ descricao_risco: string; estrategia_mitigacao: string }>;
}

export const pdfService = {
  generateExperimentPDF(data: PDFData): void {
    const doc = new jsPDF();
    
    // Configurações de estilo
    const titleFontSize = 16;
    const subtitleFontSize = 12;
    const normalFontSize = 10;
    const smallFontSize = 8;
    
    let yPosition = 20;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - (margin * 2);
    
    // Cabeçalho
    doc.setFontSize(titleFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text('PROPOSTA DE EXPERIMENTO DE INOVAÇÃO', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(smallFontSize);
    doc.setFont('helvetica', 'normal');
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;
    
    // 1. Informações do Proponente
    this.addSection(doc, '1. INFORMAÇÕES DO PROPONENTE', yPosition, pageWidth, margin);
    yPosition += 10;
    
    const proponenteData = [
      ['Nome:', data.proponente_nome || '-'],
      ['Matrícula:', data.proponente_matricula || '-'],
      ['CGC:', data.proponente_cgc || '-'],
      ['Unidade Gestora:', data.unidade_gestora || '-']
    ];
    
    yPosition = this.addTable(doc, proponenteData, yPosition, pageWidth, margin);
    yPosition += 15;
    
    // 2. Detalhes do Experimento
    this.addSection(doc, '2. DETALHES DO EXPERIMENTO', yPosition, pageWidth, margin);
    yPosition += 10;
    
    const experimentoData = [
      ['Desafio:', data.desafio || '-'],
      ['Hipóteses:', data.hipoteses || '-'],
      ['Horizonte de Inovação:', data.horizonte_inovacao || '-'],
      ['Volume de Impacto:', data.volume_impacto || '-']
    ];
    
    yPosition = this.addTable(doc, experimentoData, yPosition, pageWidth, margin);
    yPosition += 15;
    
    // 3. Métricas e Resultados
    this.addSection(doc, '3. MÉTRICAS E RESULTADOS', yPosition, pageWidth, margin);
    yPosition += 10;
    
    const metricasData = [
      ['Baseline:', data.baseline || '-'],
      ['Resultados Esperados:', data.resultados_esperados || '-'],
      ['Métricas/KPIs:', data.metricas_kpis || '-']
    ];
    
    yPosition = this.addTable(doc, metricasData, yPosition, pageWidth, margin);
    yPosition += 15;
    
    // 4. Cronograma
    this.addSection(doc, '4. CRONOGRAMA', yPosition, pageWidth, margin);
    yPosition += 10;
    
    const cronogramaData = [
      ['Data de Início:', this.formatDate(data.data_inicio)],
      ['Data de Fim:', this.formatDate(data.data_fim)]
    ];
    
    yPosition = this.addTable(doc, cronogramaData, yPosition, pageWidth, margin);
    yPosition += 15;
    
    // 5. Termos e Condições
    this.addSection(doc, '5. TERMOS E CONDIÇÕES', yPosition, pageWidth, margin);
    yPosition += 10;
    
    const termosData = [
      ['Uso de recursos da unidade gestora:', data.termos_recursos_unidade ? 'Aceito' : 'Não aceito'],
      ['Registro de perdas:', data.termos_registro_perdas ? 'Aceito' : 'Não aceito'],
      ['Notificação à GEINA:', data.termos_notificacao_geina ? 'Aceito' : 'Não aceito'],
      ['Elaboração de relatórios:', data.termos_relatorios ? 'Aceito' : 'Não aceito'],
      ['Aceito todos os termos:', data.aceito_termos ? 'Aceito' : 'Não aceito']
    ];
    
    yPosition = this.addTable(doc, termosData, yPosition, pageWidth, margin);
    yPosition += 15;
    
    // 6. Assinatura
    this.addSection(doc, '6. ASSINATURA', yPosition, pageWidth, margin);
    yPosition += 10;
    
    const assinaturaData = [
      ['Local de Assinatura:', data.local_assinatura || '-'],
      ['Data de Assinatura:', this.formatDate(data.data_assinatura)],
      ['Gestor da Unidade:', data.gestor_unidade || '-']
    ];
    
    yPosition = this.addTable(doc, assinaturaData, yPosition, pageWidth, margin);
    yPosition += 15;
    
    // 7. Time e Riscos
    this.addSection(doc, '7. TIME E RISCOS', yPosition, pageWidth, margin);
    yPosition += 10;
    
    // Membros do Time
    doc.setFontSize(subtitleFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text('Membros do Time:', margin, yPosition);
    yPosition += 8;
    
    if (data.time_membros && data.time_membros.length > 0) {
      const timeData = data.time_membros.map(member => [member.nome, member.matricula]);
      yPosition = this.addTable(doc, timeData, yPosition, pageWidth, margin, ['Nome', 'Matrícula']);
    } else {
      doc.setFontSize(normalFontSize);
      doc.setFont('helvetica', 'normal');
      doc.text('Nenhum membro adicionado', margin, yPosition);
      yPosition += 8;
    }
    
    yPosition += 10;
    
    // Riscos
    doc.setFontSize(subtitleFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text('Riscos Identificados:', margin, yPosition);
    yPosition += 8;
    
    if (data.riscos && data.riscos.length > 0) {
      data.riscos.forEach((risk, index) => {
        doc.setFontSize(normalFontSize);
        doc.setFont('helvetica', 'normal');
        doc.text(`Risco ${index + 1}: ${risk.descricao_risco}`, margin, yPosition);
        yPosition += 6;
        doc.text(`Estratégia de Mitigação: ${risk.estrategia_mitigacao}`, margin, yPosition);
        yPosition += 8;
      });
    } else {
      doc.setFontSize(normalFontSize);
      doc.setFont('helvetica', 'normal');
      doc.text('Nenhum risco identificado', margin, yPosition);
      yPosition += 8;
    }
    
    // Salvar o PDF
    const fileName = `experimento_${data.proponente_nome?.replace(/\s+/g, '_') || 'proposta'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  },
  
  addSection(doc: jsPDF, title: string, y: number, pageWidth: number, margin: number): void {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, y);
  },
  
  addTable(doc: jsPDF, data: string[][], y: number, pageWidth: number, margin: number, headers?: string[]): number {
    const tableConfig = {
      startY: y,
      head: headers ? [headers] : undefined,
      body: data,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [0, 70, 140],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: margin, right: margin }
    };
    
    const finalY = (doc as any).autoTable(tableConfig);
    return finalY.finalY + 5;
  },
  
  formatDate(dateString: string): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
};
