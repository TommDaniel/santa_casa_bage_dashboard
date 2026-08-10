/**
 * Dashboard Estudo de Viabilidade Financeira / Contratual SUS
 * Santa Casa de Caridade de Bagé
 */

// Global Chart Instances
let chartEvolucao = null;
let chartGeral = null;
let chartPreVsPos = null;
let chartReceitasMaster = null;
let chartReceitasSub = null;

// New Modules Data: Specialists & Credit Lines
let ESPECIALISTAS = [
  { nome: 'Dr. Arthur Silveira', especialidade: 'Cardiologia', meta: 200, realizado: 195, custo: 18000 },
  { nome: 'Dra. Helena Marques', especialidade: 'Neurologia', meta: 120, realizado: 118, custo: 22000 },
  { nome: 'Dr. Fernando Gomes', especialidade: 'Traumatologia/Ortopedia', meta: 250, realizado: 248, custo: 25000 },
  { nome: 'Dra. Mariana Costa', especialidade: 'Oftalmologia', meta: 300, realizado: 290, custo: 15000 },
  { nome: 'Dr. Carlos Eduardo', especialidade: 'Ginecologia/Obstetrícia', meta: 180, realizado: 182, custo: 20000 }
];

let DELIBERACOES_DGAE = [
  { acao: 'Protocolar o pedido de revisão do Valora RS na SES/RS', responsavel: 'Diretoria Geral', prazo: '10 dias' },
  { acao: 'Organizar planilha de comprovação física das metas de exames da Portaria 4282', responsavel: 'Faturamento / SUS', prazo: '05 dias' },
  { acao: 'Solicitar vistoria técnica estadual para os leitos de UTI Neonatal', responsavel: 'Diretoria Geral', prazo: '15 dias' }
];

let CASOS_SRAG = [
  { registro: 'PAC-2026-0812', entrada: '2026-07-12', diagnostico: 'COVID-19', unidade: 'UTI Respiratória', diaria: 1500.00, status: 'Internado' },
  { registro: 'PAC-2026-0834', entrada: '2026-07-15', diagnostico: 'Influenza A (H1N1)', unidade: 'Enfermaria Isolamento', diaria: 800.00, status: 'Internado' },
  { registro: 'PAC-2026-0798', entrada: '2026-07-02', diagnostico: 'Vírus Sincicial Respiratório (VSR)', unidade: 'Pediatria Isolamento', diaria: 800.00, status: 'Alta Médica' },
  { registro: 'PAC-2026-0850', entrada: '2026-07-18', diagnostico: 'COVID-19', unidade: 'UTI Respiratória', diaria: 1500.00, status: 'Internado' }
];

let LINHAS_CREDITO = [
  { banco: 'Caixa Hospitais', original: 2500000.00, saldoDevedor: 1850000.00, taxa: 1.15, parcela: 83250.00, vcto: '10/08/2026' },
  { banco: 'BNDES Giro Saúde', original: 1500000.00, saldoDevedor: 1200000.00, taxa: 0.95, parcela: 48500.00, vcto: '15/08/2026' },
  { banco: 'Antecipação Recebíveis (FIDC)', original: 800000.00, saldoDevedor: 350000.00, taxa: 1.45, parcela: 98000.00, vcto: '22/08/2026' }
];
let chartDespesasMaster = null;
let chartDespesasSub = null;
let currentAssistirKey = 'cardiologia';

// Dataset Definitions
const DATASETS = {
  2026: {
    tetoAnual: "R$ 52.200.000",
    faturamentoMensal: 4350000,
    despesasMensais: 4007820,
    recebidoCaixa: 3210450,
    projetadoReceber: 1139550,
    evolucaoMensal: [
      { mes: 'Jan', realizado: 4.10, teto: 4.35 },
      { mes: 'Fev', realizado: 4.15, teto: 4.35 },
      { mes: 'Mar', realizado: 4.28, teto: 4.35 },
      { mes: 'Abr', realizado: 4.30, teto: 4.35 },
      { mes: 'Mai', realizado: 4.32, teto: 4.35 },
      { mes: 'Jun', realizado: 4.34, teto: 4.35 },
      { mes: 'Jul', realizado: 3.85, teto: 4.35 }
    ],
    receitas: {
      master: {
        labels: ['Incentivos Estaduais/Federais', 'Ambulatorial (SIA)', 'Hospitalar (AIH)', 'Alta Complexidade'],
        data: [1350000, 950000, 1250000, 800000],
        colors: ['#10B981', '#3B82F6', '#1E3A8A', '#8B5CF6']
      },
      sub: {
        incentivos: {
          title: "Detalhamento: Incentivos (Valora RS, IAC, Portas)",
          labels: ['Valora RS (Qualidade)', 'IAC (Adesão Contratual)', 'Porta de Entrada (Urgência)', 'QualiSUS Maternidade'],
          data: [650000, 350000, 230000, 120000]
        },
        ambulatorial: {
          title: "Detalhamento: Produção Ambulatorial (SIA)",
          labels: ['Consultas Especializadas', 'Exames de Imagem / Tomografia', 'Patologia Clínica / Lab', 'Pequenas Cirurgias SIA'],
          data: [420000, 280000, 150000, 100000]
        },
        hospitalar: {
          title: "Detalhamento: Produção Hospitalar (AIH)",
          labels: ['AIH Cirúrgica Eletiva', 'AIH Clínica Médica', 'Diárias Maternidade/Pediatria', 'Cirurgias Urgência'],
          data: [520000, 380000, 180000, 170000]
        },
        alta_complexidade: {
          title: "Detalhamento: Alta Complexidade",
          labels: ['UTI Adulto (Leitos)', 'UTI Neonatal', 'Hemodiálise (Terapia Renal)', 'Oncologia / Quimioterapia'],
          data: [320000, 210000, 170000, 100000]
        }
      }
    },
    despesas: {
      master: {
        labels: ['Equipe Médica', 'Equipe Assistencial', 'Prestadores / Terceirizados', 'Equipe Administrativa'],
        data: [1420000, 1280000, 780000, 527820],
        colors: ['#EF4444', '#F59E0B', '#0EA5E9', '#64748B']
      },
      sub: {
        medicos: {
          title: "Detalhamento: Honorários & Escalas Médicas",
          labels: ['Corpo Clínico Concursado', 'Plantonistas Urgência/UTI', 'Sobreavisos Especializados', 'Honorários Cirúrgicos'],
          data: [580000, 420000, 240000, 180000]
        },
        assistencial: {
          title: "Detalhamento: Equipe Assistencial & Insumos",
          labels: ['Folha Enfermagem / Técnicos', 'Farmácia & Insumos Médicos', 'Fisioterapia & Nutrição', 'EPIs & Material Sanitário'],
          data: [680000, 390000, 120000, 90000]
        },
        prestadores: {
          title: "Detalhamento: Prestadores & Serviços Terceirizados",
          labels: ['Higienização & Limpeza', 'Manutenção Equipamentos', 'Laboratório Diagnóstico', 'Lavanderia & Nutrição'],
          data: [280000, 220000, 160000, 120000]
        },
        administrativa: {
          title: "Detalhamento: Equipe Administrativa & TI",
          labels: ['Folha Admin / RH / Faturamento', 'Sistemas Hospitalares / TI', 'Energia, Água & Conectividade', 'Materiais de Escritório'],
          data: [240000, 140000, 107820, 40000]
        }
      }
    },
    metasSIA: [
      { linha: 'Consultas Médicas Especializadas', meta: 2800, realizado: 2710, pct: 96.8 },
      { linha: 'Tomografia Computadorizada', meta: 450, realizado: 442, pct: 98.2 },
      { linha: 'Ultrassonografia / Ecografia', meta: 600, realizado: 580, pct: 96.6 },
      { linha: 'Exames Laboratoriais (Patologia)', meta: 18000, realizado: 17850, pct: 99.1 },
      { linha: 'Sessões de Hemodiálise (TRD)', meta: 1200, realizado: 1190, pct: 99.2 }
    ],
    metasAIH: [
      { esp: 'Internações Clínica Médica', meta: 320, realizado: 310, pct: 96.8 },
      { esp: 'Cirurgias Eletivas Geral/Trauma', meta: 180, realizado: 165, pct: 91.6 },
      { esp: 'Partos e Atendimentos Obstétricos', meta: 90, realizado: 88, pct: 97.7 },
      { esp: 'Diárias UTI Adulto Geral', meta: 280, realizado: 275, pct: 98.2 },
      { esp: 'Diárias UTI Neonatal', meta: 150, realizado: 142, pct: 94.6 }
    ],
    // Incentivos Transcritos dos Documentos Oficiais MS/SES-RS (Federal + Estadual)
    incentivosDiscriminados: [
      // INCENTIVOS FEDERAIS (MINISTÉRIO DA SAÚDE)
      {
        esfera: 'Federal',
        nome: 'Componente Parto e Nascimento - Rede Cegonha',
        subTipo: 'Qualificação de Leito de UTI Neonatal',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA GM/MS Nº 742/2014',
        linkNorma: 'https://bvsms.saude.gov.br/saude-legis/',
        numParcelas: 12,
        valorParcela: 43975.20
      },
      {
        esfera: 'Federal',
        nome: 'INTEGRASUS',
        subTipo: '-',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA GM/MS Nº 3.220/2007',
        linkNorma: 'https://bvsms.saude.gov.br/saude-legis/',
        numParcelas: 12,
        valorParcela: 41397.12
      },
      {
        esfera: 'Federal',
        nome: 'Incentivo de Adesão à Contratualização - IAC',
        subTipo: '-',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA GM/MS Nº 3.166/2013',
        linkNorma: 'https://bvsms.saude.gov.br/saude-legis/',
        numParcelas: 12,
        valorParcela: 441458.03
      },
      {
        esfera: 'Federal',
        nome: 'Rede de Atenção às Urgências e Emergências (RAU)',
        subTipo: 'Enfermarias Clínicas de Retaguarda RUE',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA GM/MS Nº 3.678/2021',
        linkNorma: 'https://bvsms.saude.gov.br/saude-legis/',
        numParcelas: 12,
        valorParcela: 64635.41
      },
      {
        esfera: 'Federal',
        nome: 'Rede de Atenção às Urgências e Emergências (RAU)',
        subTipo: 'Porta de Entrada Hospitalar',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA GM/MS Nº 1.506/2014',
        linkNorma: 'https://bvsms.saude.gov.br/saude-legis/',
        numParcelas: 12,
        valorParcela: 223130.56
      },
      {
        esfera: 'Federal',
        nome: 'Saúde Mental',
        subTipo: '-',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA GM/MS Nº 1.586/2013',
        linkNorma: 'https://bvsms.saude.gov.br/saude-legis/',
        numParcelas: 12,
        valorParcela: 11220.22,
        obs: 'Prestador possui habilitação no valor de R$ 134.642,64/ano'
      },

      // INCENTIVOS ESTADUAIS (VALORA RS / SES-RS)
      {
        esfera: 'Estadual',
        nome: 'SD: Maternidade Completa',
        subTipo: '-',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA SES Nº 419/2025',
        linkNorma: 'https://saude.rs.gov.br/portarias',
        numParcelas: 12,
        valorParcela: 98469.90
      },
      {
        esfera: 'Estadual',
        nome: 'Serviços Especializados de Referência à Saúde da Mulher | SERMulher',
        subTipo: '-',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA SES Nº 223/2024',
        linkNorma: 'https://saude.rs.gov.br/portarias',
        numParcelas: 12,
        valorParcela: 125000.00
      },
      {
        esfera: 'Estadual',
        nome: 'TS: Ambulatório de Egresso de UTI Neonatal',
        subTipo: '-',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA SES Nº 419/2025',
        linkNorma: 'https://saude.rs.gov.br/portarias',
        numParcelas: 12,
        valorParcela: 21882.20
      },
      {
        esfera: 'Estadual',
        nome: 'TS: Ambulatório de Especialidades Clínicas',
        subTipo: 'Cardiologia',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA SES Nº 419/2025',
        linkNorma: 'https://saude.rs.gov.br/portarias',
        numParcelas: 12,
        valorParcela: 76587.70
      },
      {
        esfera: 'Estadual',
        nome: 'TS: Ambulatório de Especialidades Clínicas',
        subTipo: 'Gastroenterologia',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA SES Nº 419/2025',
        linkNorma: 'https://saude.rs.gov.br/portarias',
        numParcelas: 12,
        valorParcela: 76587.70
      },
      {
        esfera: 'Estadual',
        nome: 'TS: Ambulatório de Especialidades Clínico/Cirúrgicas',
        subTipo: 'Ginecologia',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA SES Nº 419/2025',
        linkNorma: 'https://saude.rs.gov.br/portarias',
        numParcelas: 12,
        valorParcela: 76587.70
      },
      {
        esfera: 'Estadual',
        nome: 'TS: Ambulatório de Especialidades Clínico/Cirúrgicas',
        subTipo: 'Cirurgia Geral',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA SES Nº 419/2025',
        linkNorma: 'https://saude.rs.gov.br/portarias',
        numParcelas: 12,
        valorParcela: 76587.70
      },
      {
        esfera: 'Estadual',
        nome: 'TS: Ambulatório de Especialidades Estratégico (Pré-Fixado)',
        subTipo: 'Traumato/Ortopedia - Joelho',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA SES Nº 220/2026',
        linkNorma: 'https://saude.rs.gov.br/portarias',
        numParcelas: 3,
        valorParcela: 235691.59
      },
      {
        esfera: 'Estadual',
        nome: 'TS: Ambulatório de Especialidades Prioritárias',
        subTipo: 'Traumato-Ortopedia',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA SES Nº 419/2025',
        linkNorma: 'https://saude.rs.gov.br/portarias',
        numParcelas: 12,
        valorParcela: 109192.18
      },
      {
        esfera: 'Estadual',
        nome: 'TS: Ambulatório de Gestante de Alto Risco - AGAR',
        subTipo: 'Serviço de Referência à Gestação de Alto Risco (GAR) tipo I',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA SES Nº 419/2025',
        linkNorma: 'https://saude.rs.gov.br/portarias',
        numParcelas: 12,
        valorParcela: 32823.30
      },
      {
        esfera: 'Estadual',
        nome: 'TS: Leitos de UTI e UCI',
        subTipo: 'Sem Alta Complexidade',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA SES Nº 1.109/2025',
        linkNorma: 'https://saude.rs.gov.br/portarias',
        numParcelas: 12,
        valorParcela: 164116.50
      },
      {
        esfera: 'Estadual',
        nome: 'TS: Maternidade de Alto Risco',
        subTipo: '-',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA SES Nº 419/2025',
        linkNorma: 'https://saude.rs.gov.br/portarias',
        numParcelas: 12,
        valorParcela: 27352.75
      },
      {
        esfera: 'Estadual',
        nome: 'TS: Maternidade de Risco Habitual',
        subTipo: '-',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA SES Nº 419/2025',
        linkNorma: 'https://saude.rs.gov.br/portarias',
        numParcelas: 12,
        valorParcela: 175719.55
      },
      {
        esfera: 'Estadual',
        nome: 'TS: Oncologia (Exames)',
        subTipo: '-',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA SES Nº 419/2025',
        linkNorma: 'https://saude.rs.gov.br/portarias',
        numParcelas: 12,
        valorParcela: 197202.38
      },
      {
        esfera: 'Estadual',
        nome: 'TS: Porta de Entrada - RUE',
        subTipo: 'Geral II',
        tipoPagamento: 'Pré-fixado',
        norma: 'PORTARIA SES Nº 1.109/2025',
        linkNorma: 'https://saude.rs.gov.br/portarias',
        numParcelas: 12,
        valorParcela: 107222.78
      }
    ]
  }
};

/* ==========================================================================
   CONTROLE DINÂMICO DE EMENDAS PARLAMENTARES
   ========================================================================== */

let EMENDAS = [
  {
    tipo: 'INDIVIDUAL',
    gnd: 'GND 3 - Custeio MAC',
    autor: 'Deputado Federal Exemplo',
    proposta: '11234.567000/126-01',
    valorIndicado: 1000000.00,
    valorRecebido: 500000.00,
    exigeContrapartida: false,
    executada: 0.00,
    status: 'Recebido 50%'
  },
  {
    tipo: 'DE BANCADA',
    gnd: 'GND 4 - Investimento',
    autor: 'Bancada Gaúcha (Federal)',
    proposta: '11234.567000/126-02',
    valorIndicado: 1000000.00,
    valorRecebido: 0.00,
    exigeContrapartida: true,
    executada: 0.00,
    status: 'Pendente'
  },
  {
    tipo: 'DE COMISSÃO',
    gnd: 'GND 3 - Custeio MAC',
    autor: 'Comissão de Saúde da Câmara',
    proposta: '11234.567000/126-03',
    valorIndicado: 1000000.00,
    valorRecebido: 0.00,
    exigeContrapartida: true,
    executada: 0.00,
    status: 'Pendente'
  },
  {
    tipo: 'RECURSO EXTRAORDINÁRIO',
    gnd: 'GND 3 - Aporte Extra MAC',
    autor: 'Ministério da Saúde (Aporte Extra)',
    proposta: '11234.567000/126-04',
    valorIndicado: 1000000.00,
    valorRecebido: 0.00,
    exigeContrapartida: false,
    executada: 0.00,
    status: 'Pendente'
  }
];

function renderEmendasTable() {
  const tbody = document.getElementById('tableBodyEmendas');
  if (!tbody) return;
  
  let html = '';
  EMENDAS.forEach((emenda, idx) => {
    let tipoBg = 'rgba(37, 99, 235, 0.12)';
    let tipoColor = 'var(--blue-vibrant)';
    if (emenda.tipo === 'DE BANCADA') {
      tipoBg = 'rgba(139, 92, 246, 0.12)';
      tipoColor = 'var(--purple)';
    } else if (emenda.tipo === 'DE COMISSÃO') {
      tipoBg = 'rgba(14, 165, 233, 0.12)';
      tipoColor = 'var(--cyan-accent)';
    } else if (emenda.tipo === 'RECURSO EXTRAORDINÁRIO') {
      tipoBg = 'rgba(100, 116, 139, 0.12)';
      tipoColor = 'var(--text-muted)';
    }
    
    let statusBg = 'rgba(239, 68, 68, 0.12)';
    let statusColor = 'var(--danger)';
    if (emenda.status.includes('50%') || emenda.status.includes('Parcial')) {
      statusBg = 'rgba(245, 158, 11, 0.12)';
      statusColor = 'var(--warning)';
    } else if (emenda.status.includes('Integral') || emenda.status.includes('Concluído')) {
      statusBg = 'rgba(16, 185, 129, 0.12)';
      statusColor = 'var(--success)';
    }
    
    const contrapartidaVal = emenda.exigeContrapartida ? emenda.valorIndicado * 0.3 : 0;
    const contrapartidaStr = emenda.exigeContrapartida ? 'R$ ' + contrapartidaVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : 'Não aplicável';
    const contrapartidaColor = emenda.exigeContrapartida ? 'var(--warning)' : 'var(--text-muted)';
    
    html += `
      <tr>
        <td>
          <span class="badge-sus" style="background: ${tipoBg}; color: ${tipoColor}; font-weight: 700; font-size: 0.7rem; padding: 0.2rem 0.4rem; border-radius: 4px; display: inline-block;">${emenda.tipo}</span><br>
          <small style="color: var(--text-muted); font-size: 0.7rem;">${emenda.gnd}</small>
        </td>
        <td>
          <strong style="color: var(--text-title); font-size: 0.85rem;">${emenda.autor}</strong><br>
          <small style="color: var(--text-muted); font-size: 0.7rem;">Proposta: ${emenda.proposta}</small>
        </td>
        <td style="text-align: right; font-weight: 600; color: var(--text-title); font-size: 0.85rem;">R$ ${emenda.valorIndicado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: right; font-weight: 700; color: var(--blue-vibrant); font-size: 0.85rem;">R$ ${emenda.valorRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: right; font-weight: ${emenda.exigeContrapartida ? '700' : 'normal'}; color: ${contrapartidaColor}; font-size: 0.85rem;">${contrapartidaStr}</td>
        <td style="text-align: right; color: var(--text-title); font-size: 0.85rem;">R$ ${emenda.executada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: center;">
          <span class="badge-sus" style="background: ${statusBg}; color: ${statusColor}; font-weight: 700; font-size: 0.7rem; padding: 0.25rem 0.5rem; border-radius: 4px;">${emenda.status}</span>
        </td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 0.25rem; justify-content: center;">
            <button onclick="openEditEmendaModal(${idx})" class="btn-icon" style="padding: 0.25rem; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: rgba(37, 99, 235, 0.1); color: var(--blue-vibrant); border: none; border-radius: var(--radius-sm);" title="Editar">
              <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
            </button>
            <button onclick="removeEmenda(${idx})" class="btn-icon" style="padding: 0.25rem; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: rgba(239, 68, 68, 0.1); color: var(--danger); border: none; border-radius: var(--radius-sm);" title="Remover">
              <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });
  
  tbody.innerHTML = html;
  recalcEmendasMetrics();
  
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function recalcEmendasMetrics() {
  let totalPactuado = 0;
  let totalRecebido = 0;
  let totalContrapartida = 0;
  let totalExecutado = 0;
  
  EMENDAS.forEach(emenda => {
    totalPactuado += emenda.valorIndicado;
    totalRecebido += emenda.valorRecebido;
    if (emenda.exigeContrapartida) {
      totalContrapartida += emenda.valorIndicado * 0.3;
    }
    totalExecutado += emenda.executada;
  });
  
  const totalPactuadoText = document.getElementById('emendaTotalPactuadoText');
  if (totalPactuadoText) {
    totalPactuadoText.innerText = 'R$ ' + totalPactuado.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }
  
  // Recalcular os cards da aba de emendas parlamentares
  // card 1: total recebido
  // card 2: contrapartida obrigatória 30%
  // card 3: executado
  // card 4: a executar
  
  // Vamos atualizar os cartões na aba de emendas parlamentares e sincronizar com a dashboard se aplicável
}

function openAddEmendaModal() {
  document.getElementById('formAddEmenda').reset();
  document.getElementById('emendaEditIndex').value = "-1";
  document.getElementById('modalEmendaTitle').innerText = "Cadastrar Nova Emenda Parlamentar";
  
  const modal = document.getElementById('modalAddEmenda');
  if (modal) modal.style.display = 'flex';
  
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function openEditEmendaModal(idx) {
  const emenda = EMENDAS[idx];
  if (!emenda) return;
  
  document.getElementById('emendaEditIndex').value = idx;
  document.getElementById('newEmendaTipo').value = emenda.tipo;
  document.getElementById('newEmendaGnd').value = emenda.gnd;
  document.getElementById('newEmendaAutor').value = emenda.autor;
  document.getElementById('newEmendaProposta').value = emenda.proposta;
  document.getElementById('newEmendaValorIndicado').value = emenda.valorIndicado;
  document.getElementById('newEmendaValorRecebido').value = emenda.valorRecebido;
  document.getElementById('newEmendaExecutada').value = emenda.executada;
  document.getElementById('newEmendaStatus').value = emenda.status;
  document.getElementById('newEmendaExigeContrapartida').checked = emenda.exigeContrapartida;
  
  document.getElementById('modalEmendaTitle').innerText = "Editar Emenda Parlamentar";
  
  const modal = document.getElementById('modalAddEmenda');
  if (modal) modal.style.display = 'flex';
  
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function closeAddEmendaModal() {
  const modal = document.getElementById('modalAddEmenda');
  if (modal) modal.style.display = 'none';
  document.getElementById('formAddEmenda').reset();
}

function saveNewEmenda(event) {
  event.preventDefault();
  
  const idx = parseInt(document.getElementById('emendaEditIndex').value);
  const tipo = document.getElementById('newEmendaTipo').value;
  const gnd = document.getElementById('newEmendaGnd').value.trim();
  const autor = document.getElementById('newEmendaAutor').value.trim();
  const proposta = document.getElementById('newEmendaProposta').value.trim();
  const valorIndicado = parseFloat(document.getElementById('newEmendaValorIndicado').value) || 0;
  const valorRecebido = parseFloat(document.getElementById('newEmendaValorRecebido').value) || 0;
  const executada = parseFloat(document.getElementById('newEmendaExecutada').value) || 0;
  const status = document.getElementById('newEmendaStatus').value;
  const exigeContrapartida = document.getElementById('newEmendaExigeContrapartida').checked;
  
  const emendaData = {
    tipo,
    gnd,
    autor,
    proposta,
    valorIndicado,
    valorRecebido,
    exigeContrapartida,
    executada,
    status
  };
  
  if (idx === -1) {
    EMENDAS.push(emendaData);
  } else {
    EMENDAS[idx] = emendaData;
  }
  
  renderEmendasTable();
  closeAddEmendaModal();
}

function removeEmenda(idx) {
  if (confirm("Deseja realmente remover esta emenda parlamentar?")) {
    EMENDAS.splice(idx, 1);
    renderEmendasTable();
  }
}

// Bind globals for inline onclick calls
window.openAddEmendaModal = openAddEmendaModal;
window.openEditEmendaModal = openEditEmendaModal;
window.closeAddEmendaModal = closeAddEmendaModal;
window.saveNewEmenda = saveNewEmenda;
window.removeEmenda = removeEmenda;
window.renderEmendasTable = renderEmendasTable;


// Initialize Dashboard on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  // Bind direct click listeners to navigation tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const tabId = this.getAttribute('data-tab');
      if (tabId) {
        switchTab(this, tabId);
      }
    });
  });

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
  
  try { initOverviewCharts(); } catch (e) { console.warn(e); }
  try { initReceitasCharts(); } catch (e) { console.warn(e); }
  try { initDespesasCharts(); } catch (e) { console.warn(e); }
  try { populateTables(); } catch (e) { console.warn(e); }
  try { runViabilitySimulation(); } catch (e) { console.warn(e); }
  try { renderAssistirAmbulatorio('cardiologia'); } catch (e) { console.warn(e); }
  try { renderEmendasTable(); } catch (e) { console.warn(e); }
  try { renderEspecialistasTable(); } catch (e) { console.warn(e); }
  try { renderCreditoTable(); } catch (e) { console.warn(e); }
  try { renderSragTable(); } catch (e) { console.warn(e); }
  try { renderDgaeTable(); } catch (e) { console.warn(e); }
  try { calculatePphSim(); } catch (e) { console.warn(e); }
  try { recalcCreditSimulation(); } catch (e) { console.warn(e); }
});

// Switch Tab Navigation (Infalível, Defensivo e Global)
function switchTab(targetRef, tabId) {
  try {
    const idToActivate = typeof targetRef === 'string' ? targetRef : tabId;
    if (!idToActivate) return;

    // 1. Esconder todas as abas
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.style.display = 'none';
      pane.classList.remove('active');
    });

    // 2. Remover classe active de todos os botões da barra
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // 3. Exibir a aba alvo
    const targetPane = document.getElementById(idToActivate);
    if (targetPane) {
      targetPane.style.display = 'block';
      targetPane.classList.add('active');
    }

    // 4. Ativar o botão correspondente
    let activeBtn = null;
    if (targetRef && targetRef instanceof HTMLElement) {
      activeBtn = targetRef.closest('.tab-btn');
    }
    if (!activeBtn) {
      activeBtn = document.querySelector(`.tab-btn[data-tab="${idToActivate}"]`);
    }
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    // 5. Se for a aba de Ambulatórios ASSISTIR, garante a renderização do ambulatório atual
    if (idToActivate === 'tab-assistir' && typeof renderAssistirAmbulatorio === 'function') {
      try {
        const keyToRender = (typeof currentAssistirKey !== 'undefined' && currentAssistirKey) ? currentAssistirKey : 'cardiologia';
        renderAssistirAmbulatorio(keyToRender);
      } catch (e) {
        console.warn('Alerta na renderizacao do ASSISTIR:', e);
      }
    }

    // 6. Recriar ícones e ajustar gráficos
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }

    window.dispatchEvent(new Event('resize'));
  } catch (err) {
    console.error('Erro na navegacao de abas:', err);
  }
}

// Tornar a função globalmente acessível
window.switchTab = switchTab;

// Toggle Dark / Light Theme
function toggleTheme() {
  const htmlEl = document.documentElement;
  const currentTheme = htmlEl.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', newTheme);

  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.innerHTML = newTheme === 'dark' ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
    lucide.createIcons();
  }

  // Re-render charts for colors
  initOverviewCharts();
  initReceitasCharts();
  initDespesasCharts();
}

// 1. Overview Tab Charts
function initOverviewCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#F1F5F9' : '#1E293B';

  const ctxEvolucao = document.getElementById('chartEvolucaoFaturamento');
  if (!ctxEvolucao) return;

  if (typeof Chart === 'undefined') {
    renderSvgPieFallback(ctxEvolucao);
    return;
  }

  try {
    const fallbackEl = document.getElementById('fallbackChartEvolucao');
    if (fallbackEl) fallbackEl.style.display = 'none';

    if (chartEvolucao) {
      chartEvolucao.destroy();
      chartEvolucao = null;
    }
    
    chartEvolucao = new Chart(ctxEvolucao, {
      type: 'doughnut',
      data: {
        labels: [
          'Incentivos: R$ 2.191.148,88 (45,63%)',
          'Teto MAC: R$ 2.384.468,73 (49,65%)',
          'FAEC: R$ 226.778,70 (4,72%)'
        ],
        datasets: [{
          data: [2191148.88, 2384468.73, 226778.70],
          backgroundColor: [
            '#10B981', // Incentivos (Verde)
            '#2563EB', // Teto MAC (Azul)
            '#F59E0B'  // FAEC (Laranja)
          ],
          borderWidth: 3,
          borderColor: isDark ? '#1E293B' : '#FFFFFF',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'bottom', 
            labels: { 
              color: textColor, 
              font: { family: 'Plus Jakarta Sans', weight: '800', size: 11 },
              padding: 12,
              usePointStyle: true,
              pointStyle: 'circle'
            } 
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: R$ ${ctx.raw.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
            }
          }
        },
        cutout: '55%'
      }
    });
  } catch (err) {
    console.warn('Fallback SVG ativado para o gráfico de pizza:', err);
    renderSvgPieFallback(ctxEvolucao);
  }
}

function renderSvgPieFallback(canvasEl) {
  if (!canvasEl || !canvasEl.parentElement) return;
  const parent = canvasEl.parentElement;
  
  parent.innerHTML = `
    <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1rem;">
      <svg viewBox="0 0 36 36" style="width: 170px; height: 170px; transform: rotate(-90deg);">
        <!-- Incentivos: 45.63% (dasharray 45.63 54.37) -->
        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10B981" stroke-width="5.5" stroke-dasharray="45.63 54.37" stroke-dashoffset="0"></circle>
        <!-- Teto MAC: 49.65% (dasharray 49.65 50.35) -->
        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#2563EB" stroke-width="5.5" stroke-dasharray="49.65 50.35" stroke-dashoffset="-45.63"></circle>
        <!-- FAEC: 4.72% (dasharray 4.72 95.28) -->
        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#F59E0B" stroke-width="5.5" stroke-dasharray="4.72 95.28" stroke-dashoffset="-95.28"></circle>
      </svg>
      <div style="margin-top: 1rem; display: flex; gap: 0.8rem; flex-wrap: wrap; justify-content: center; font-size: 0.78rem; font-weight: 700;">
        <span style="color: #10B981;">● Incentivos: R$ 2.191.148,88 (45,63%)</span>
        <span style="color: #2563EB;">● Teto MAC: R$ 2.384.468,73 (49,65%)</span>
        <span style="color: #F59E0B;">● FAEC: R$ 226.778,70 (4,72%)</span>
      </div>
    </div>
  `;
}

  // Chart 2: Geral Receitas vs Despesas
  const ctxGeral = document.getElementById('chartGeralReceitaDespesa');
  if (ctxGeral) {
    if (chartGeral) chartGeral.destroy();
    chartGeral = new Chart(ctxGeral, {
      type: 'doughnut',
      data: {
        labels: ['Receitas SUS Executadas', 'Despesas Operacionais', 'Saldo Operacional (Superávit)'],
        datasets: [{
          data: [4350000, 4007820, 342180],
          backgroundColor: ['#10B981', '#EF4444', '#3B82F6'],
          borderWidth: 2,
          borderColor: isDark ? '#1C2541' : '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Inter', weight: 600 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: R$ ${ctx.raw.toLocaleString('pt-BR')}`
            }
          }
        },
        cutout: '65%'
      }
    });
  }

  // Chart 3: Pré-Fixado Garantido vs Pós-Fixado (Exposição de Risco)
  const ctxPrePos = document.getElementById('chartPreVsPosFixado');
  if (ctxPrePos) {
    if (chartPreVsPos) chartPreVsPos.destroy();
    chartPreVsPos = new Chart(ctxPrePos, {
      type: 'doughnut',
      data: {
        labels: ['Pré-Fixado Garantido (69.85%)', 'Pós-Fixado MAC (25.43%)', 'Pós-Fixado FAEC (4.72%)'],
        datasets: [{
          data: [3354549.20, 1221068.41, 226778.70],
          backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
          borderWidth: 2,
          borderColor: isDark ? '#1C2541' : '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Inter', weight: 600 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: R$ ${ctx.raw.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} /mês`
            }
          }
        },
        cutout: '60%'
      }
    });
  }
}
window.initOverviewCharts = initOverviewCharts;

// 2. Receitas Tab Charts (Master Pie + Interactive Sub-chart)
function initReceitasCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#CBD5E1' : '#475569';
  const recData = DATASETS[2026].receitas;

  // Receitas Master Pie Chart
  const ctxMaster = document.getElementById('chartReceitasMaster');
  if (ctxMaster) {
    if (chartReceitasMaster) chartReceitasMaster.destroy();
    chartReceitasMaster = new Chart(ctxMaster, {
      type: 'pie',
      data: {
        labels: recData.master.labels,
        datasets: [{
          data: recData.master.data,
          backgroundColor: recData.master.colors,
          borderWidth: 2,
          borderColor: isDark ? '#1C2541' : '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Inter', weight: 600 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: R$ ${ctx.raw.toLocaleString('pt-BR')}`
            }
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const categories = ['incentivos', 'ambulatorial', 'hospitalar', 'alta_complexidade'];
            const selectedCat = categories[index];
            
            // Highlight matching pill button
            document.querySelectorAll('#tab-receitas .pill-btn').forEach((btn, idx) => {
              if (idx === index) btn.classList.add('active');
              else btn.classList.remove('active');
            });

            loadReceitaSubchart(selectedCat);
          }
        }
      }
    });
  }

  // Load Initial Receitas Subchart (Default: Incentivos)
  loadReceitaSubchart('incentivos');
}

function loadReceitaSubchart(categoryKey, btnEl) {
  if (btnEl) {
    document.querySelectorAll('#tab-receitas .pill-btn').forEach(btn => btn.classList.remove('active'));
    btnEl.classList.add('active');
  }

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#CBD5E1' : '#475569';
  const subInfo = DATASETS[2026].receitas.sub[categoryKey];

  const titleEl = document.getElementById('receitaSubchartTitle');
  if (titleEl) titleEl.innerText = subInfo.title;

  const ctxSub = document.getElementById('chartReceitasSub');
  if (ctxSub) {
    if (chartReceitasSub) chartReceitasSub.destroy();
    chartReceitasSub = new Chart(ctxSub, {
      type: 'bar',
      data: {
        labels: subInfo.labels,
        datasets: [{
          label: 'Valor (R$)',
          data: subInfo.data,
          backgroundColor: '#3B82F6',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` R$ ${ctx.raw.toLocaleString('pt-BR')}`
            }
          }
        },
        scales: {
          x: { ticks: { color: textColor, callback: v => 'R$ ' + (v/1000) + 'k' } },
          y: { ticks: { color: textColor } }
        }
      }
    });
  }
}

// 3. Despesas Tab Charts (Master Pie + Interactive Sub-chart)
function initDespesasCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#CBD5E1' : '#475569';
  const despData = DATASETS[2026].despesas;

  // Despesas Master Pie Chart
  const ctxMaster = document.getElementById('chartDespesasMaster');
  if (ctxMaster) {
    if (chartDespesasMaster) chartDespesasMaster.destroy();
    chartDespesasMaster = new Chart(ctxMaster, {
      type: 'pie',
      data: {
        labels: despData.master.labels,
        datasets: [{
          data: despData.master.data,
          backgroundColor: despData.master.colors,
          borderWidth: 2,
          borderColor: isDark ? '#1C2541' : '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Inter', weight: 600 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: R$ ${ctx.raw.toLocaleString('pt-BR')}`
            }
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const categories = ['medicos', 'assistencial', 'prestadores', 'administrativa'];
            const selectedCat = categories[index];

            document.querySelectorAll('#tab-despesas .pill-btn').forEach((btn, idx) => {
              if (idx === index) btn.classList.add('active');
              else btn.classList.remove('active');
            });

            loadDespesaSubchart(selectedCat);
          }
        }
      }
    });
  }

  // Load Initial Despesas Subchart (Default: Medicos)
  loadDespesaSubchart('medicos');
}

function loadDespesaSubchart(categoryKey, btnEl) {
  if (btnEl) {
    document.querySelectorAll('#tab-despesas .pill-btn').forEach(btn => btn.classList.remove('active'));
    btnEl.classList.add('active');
  }

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#CBD5E1' : '#475569';
  const subInfo = DATASETS[2026].despesas.sub[categoryKey];

  const titleEl = document.getElementById('despesaSubchartTitle');
  if (titleEl) titleEl.innerText = subInfo.title;

  const ctxSub = document.getElementById('chartDespesasSub');
  if (ctxSub) {
    if (chartDespesasSub) chartDespesasSub.destroy();
    chartDespesasSub = new Chart(ctxSub, {
      type: 'bar',
      data: {
        labels: subInfo.labels,
        datasets: [{
          label: 'Custo Mensal (R$)',
          data: subInfo.data,
          backgroundColor: '#EF4444',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` R$ ${ctx.raw.toLocaleString('pt-BR')}`
            }
          }
        },
        scales: {
          x: { ticks: { color: textColor, callback: v => 'R$ ' + (v/1000) + 'k' } },
          y: { ticks: { color: textColor } }
        }
      }
    });
  }
}

// 4. Populate Tables
function populateTables() {
  const data = DATASETS[2026];

  // Render Incentives Table
  renderIncentivesTable();

  // Receitas Table
  const tbodyRec = document.getElementById('tableBodyReceitas');
  if (tbodyRec) {
    const rows = [
      { grupo: 'Incentivos', sub: 'Valora RS (Qualidade + Fixa)', teto: 650000, real: 650000, pct: 14.9, status: 'Regular / Bônus 100%' },
      { grupo: 'Incentivos', sub: 'IAC & Porta de Entrada', teto: 580000, real: 580000, pct: 13.3, status: 'Regular' },
      { grupo: 'Ambulatorial', sub: 'Consultas & Exames SIA', teto: 950000, real: 910000, pct: 20.9, status: '95,7% Executado' },
      { grupo: 'Hospitalar', sub: 'AIH Cirúrgica / Clínica / Diárias', teto: 1250000, real: 1195000, pct: 27.5, status: '95,6% Executado' },
      { grupo: 'Alta Complexidade', sub: 'UTI Adulto/Neo & Hemodiálise', teto: 800000, real: 795000, pct: 18.3, status: '99,3% Executado' }
    ];

    tbodyRec.innerHTML = rows.map(r => `
      <tr>
        <td class="font-bold">${r.grupo}</td>
        <td>${r.sub}</td>
        <td>R$ ${r.teto.toLocaleString('pt-BR')}</td>
        <td class="font-bold" style="color: var(--success);">R$ ${r.real.toLocaleString('pt-BR')}</td>
        <td>${r.pct}%</td>
        <td><span class="badge-sus" style="background: var(--success-bg); color: var(--success);">${r.status}</span></td>
      </tr>
    `).join('');
  }

  // Despesas Table
  const tbodyDesp = document.getElementById('tableBodyDespesas');
  if (tbodyDesp) {
    const rows = [
      { grupo: 'Médicos', sub: 'Corpo Clínico & Escalas Plantão', valor: 1420000, pct: 35.4, imp: '32.6% da Receita', tend: 'Estável' },
      { grupo: 'Equipe Assistencial', sub: 'Enfermagem, Farmácia & Insumos', valor: 1280000, pct: 31.9, imp: '29.4% da Receita', tend: 'Aumento Inflacionário' },
      { grupo: 'Prestadores', sub: 'Limpeza, Manutenção & Lab Terceiro', valor: 780000, pct: 19.5, imp: '17.9% da Receita', tend: 'Contratual' },
      { grupo: 'Equipe Administrativa', sub: 'Folha Admin, TI & Conectividade', valor: 527820, pct: 13.2, imp: '12.1% da Receita', tend: 'Otimizado' }
    ];

    tbodyDesp.innerHTML = rows.map(r => `
      <tr>
        <td class="font-bold">${r.grupo}</td>
        <td>${r.sub}</td>
        <td class="font-bold" style="color: var(--danger);">R$ ${r.valor.toLocaleString('pt-BR')}</td>
        <td>${r.pct}%</td>
        <td>${r.imp}</td>
        <td><span class="badge-sus" style="background: var(--warning-bg); color: var(--warning);">${r.tend}</span></td>
      </tr>
    `).join('');
  }

  // SIA Metas Table
  const tbodySIA = document.getElementById('tableBodySIA');
  if (tbodySIA) {
    tbodySIA.innerHTML = data.metasSIA.map(m => `
      <tr>
        <td class="font-bold">${m.linha}</td>
        <td>${m.meta.toLocaleString('pt-BR')}</td>
        <td>${m.realizado.toLocaleString('pt-BR')}</td>
        <td>
          <div class="cell-progress">
            <span style="font-weight: 700; width: 45px;">${m.pct}%</span>
            <div class="progress-track">
              <div class="progress-bar-fill" style="width: ${m.pct}%; background: var(--blue-vibrant);"></div>
            </div>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // AIH Metas Table
  const tbodyAIH = document.getElementById('tableBodyAIH');
  if (tbodyAIH) {
    tbodyAIH.innerHTML = data.metasAIH.map(m => `
      <tr>
        <td class="font-bold">${m.esp}</td>
        <td>${m.meta.toLocaleString('pt-BR')}</td>
        <td>${m.realizado.toLocaleString('pt-BR')}</td>
        <td>
          <div class="cell-progress">
            <span style="font-weight: 700; width: 45px;">${m.pct}%</span>
            <div class="progress-track">
              <div class="progress-bar-fill" style="width: ${m.pct}%; background: var(--success);"></div>
            </div>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

// 5. Interactive Viability Simulator Logic
function runViabilitySimulation() {
  const elSliderTeto = document.getElementById('sliderTeto');
  if (!elSliderTeto) return;

  const reajusteTeto = parseFloat(elSliderTeto.value);
  const incValora = parseFloat(document.getElementById('sliderValora')?.value || 0);
  const incProd = parseFloat(document.getElementById('sliderProd')?.value || 0);
  const varCustos = parseFloat(document.getElementById('sliderCustos')?.value || 0);

  // Update UI Labels
  document.getElementById('valReajusteTeto').innerText = (reajusteTeto >= 0 ? '+' : '') + reajusteTeto.toFixed(1) + '%';
  document.getElementById('valValoraRS').innerText = 'R$ ' + incValora.toLocaleString('pt-BR') + ' /mês';
  document.getElementById('valMetaProd').innerText = (incProd >= 0 ? '+' : '') + incProd.toFixed(1) + '%';
  document.getElementById('valCustos').innerText = (varCustos >= 0 ? '+' : '') + varCustos.toFixed(1) + '%';

  // Calculate Projected Revenue & Expenses
  const receitaBase = 4350000;
  const custoBase = 4007820;

  const novaReceita = (receitaBase * (1 + reajusteTeto / 100)) + incValora + (receitaBase * 0.2 * (incProd / 100));
  const novosCustos = custoBase * (1 + varCustos / 100) + (custoBase * 0.1 * (incProd / 100));

  const saldoLiquido = novaReceita - novosCustos;

  // Render Simulation Results
  document.getElementById('simNovaReceita').innerText = 'R$ ' + Math.round(novaReceita).toLocaleString('pt-BR') + ' /mês';
  document.getElementById('simNovosCustos').innerText = 'R$ ' + Math.round(novosCustos).toLocaleString('pt-BR') + ' /mês';
  
  const saldoEl = document.getElementById('simResultadoLiquido');
  saldoEl.innerText = (saldoLiquido >= 0 ? '+ R$ ' : '- R$ ') + Math.abs(Math.round(saldoLiquido)).toLocaleString('pt-BR') + ' /mês';
  saldoEl.style.color = saldoLiquido >= 0 ? 'var(--blue-vibrant)' : 'var(--danger)';

  // Update Viability Badge
  const badgeContainer = document.getElementById('simBadgeContainer');
  if (saldoLiquido > 400000) {
    badgeContainer.style.background = 'var(--success-bg)';
    badgeContainer.style.color = 'var(--success)';
    badgeContainer.innerHTML = '<i data-lucide="check-circle-2"></i><span>PROJETO ALTAMENTE VIÁVEL • SUPERÁVIT EXCELENTE</span>';
  } else if (saldoLiquido >= 0) {
    badgeContainer.style.background = 'var(--warning-bg)';
    badgeContainer.style.color = 'var(--warning)';
    badgeContainer.innerHTML = '<i data-lucide="alert-triangle"></i><span>VIABILIDADE MODERADA • MARGEM OPERACIONAL ESTREITA</span>';
  } else {
    badgeContainer.style.background = 'var(--danger-bg)';
    badgeContainer.style.color = 'var(--danger)';
    badgeContainer.innerHTML = '<i data-lucide="x-circle"></i><span>INVIÁVEL • DÉFICIT OPERACIONAL DETECTADO</span>';
  }
  lucide.createIcons();
}

// Update Dashboard Period Filter (Simulated Data Refresh)
function updateDashboardPeriod() {
  const ex = document.getElementById('selectExercício').value;
  const mes = document.getElementById('selectCompetencia').value;

  console.log(`Atualizando dashboard para Exercício ${ex} - Mês ${mes}`);
  // Refresh simulation & UI state
  runViabilitySimulation();
}

// Export Executive Report (Triggers print format)
function exportExecutiveReport() {
  switchTab(null, 'tab-relatorio');
  setTimeout(() => {
    window.print();
  }, 300);
}

// 6. Incentivos Tab Table & Modal Logic
function renderIncentivesTable(filterQuery = "") {
  const incList = DATASETS[2026].incentivosDiscriminados;
  const tbody = document.getElementById('tableBodyIncentivos');
  if (!tbody) return;

  // Calculate Totals
  const totalMensalGlobal = incList.reduce((acc, curr) => acc + curr.mensal, 0);
  const totalAnualGlobal = incList.reduce((acc, curr) => acc + curr.anual, 0);

  const federalItems = incList.filter(i => i.esfera === 'FEDERAL');
  const estadualItems = incList.filter(i => i.esfera === 'ESTADUAL');
  const outrosItems = incList.filter(i => i.esfera !== 'FEDERAL' && i.esfera !== 'ESTADUAL');

  const subFedM = federalItems.reduce((a, c) => a + c.mensal, 0);
  const subFedA = federalItems.reduce((a, c) => a + c.anual, 0);

  const subEstM = estadualItems.reduce((a, c) => a + c.mensal, 0);
  const subEstA = estadualItems.reduce((a, c) => a + c.anual, 0);

  // Filter List
  const applyFilter = (list) => list.filter(item => 
    item.descricao.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.esfera.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const fFederal = applyFilter(federalItems);
  const fEstadual = applyFilter(estadualItems);
  const fOutros = applyFilter(outrosItems);

  let html = '';

  // 1. Grupo Federal
  if (fFederal.length > 0) {
    html += `
      <tr style="background: rgba(37, 99, 235, 0.06); font-weight: 800;">
        <td colspan="6" style="color: var(--navy-primary); font-size: 0.88rem; padding: 0.6rem 1rem;">
          <i data-lucide="flag" style="width: 14px; height: 14px; display: inline; margin-right: 0.4rem;"></i>
          INCENTIVOS FEDERAIS (MINISTÉRIO DA SAÚDE)
        </td>
      </tr>
    `;
    fFederal.forEach((item) => {
      const globalIdx = incList.indexOf(item);
      const pct = totalMensalGlobal > 0 ? ((item.mensal / totalMensalGlobal) * 100).toFixed(1) : '0.0';
      html += `
        <tr>
          <td><span class="badge-sus" style="background: rgba(37, 99, 235, 0.1); color: var(--blue-vibrant);">${item.esfera}</span></td>
          <td class="font-bold" style="color: var(--text-title); font-size: 0.85rem;">${item.descricao}</td>
          <td style="text-align: right; font-weight: 700; color: var(--success);">R$ ${item.mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td style="text-align: right; font-weight: 700; color: var(--blue-vibrant);">R$ ${item.anual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td style="text-align: center; font-weight: 600;">${pct}%</td>
          <td style="text-align: center;">
            <button onclick="removeIncentive(${globalIdx})" style="border: none; background: transparent; color: var(--danger); cursor: pointer;" title="Excluir Linha">
              <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
            </button>
          </td>
        </tr>
      `;
    });
    // Federal Subtotal Row
    html += `
      <tr style="background: var(--bg-card-hover); font-weight: 800; border-bottom: 2px solid var(--border-color);">
        <td colspan="2" style="font-size: 0.85rem; color: var(--blue-vibrant); padding-left: 1.5rem;">SUBTOTAL INCENTIVOS FEDERAIS</td>
        <td style="text-align: right; color: var(--success);">R$ ${subFedM.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: right; color: var(--blue-vibrant);">R$ ${subFedA.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: center;">${((subFedM / totalMensalGlobal)*100).toFixed(1)}%</td>
        <td></td>
      </tr>
    `;
  }

  // 2. Grupo Estadual
  if (fEstadual.length > 0) {
    html += `
      <tr style="background: rgba(16, 185, 129, 0.06); font-weight: 800;">
        <td colspan="6" style="color: var(--success); font-size: 0.88rem; padding: 0.6rem 1rem;">
          <i data-lucide="map-pin" style="width: 14px; height: 14px; display: inline; margin-right: 0.4rem;"></i>
          INCENTIVOS ESTADUAIS (VALORA RS / SES-RS)
        </td>
      </tr>
    `;
    fEstadual.forEach((item) => {
      const globalIdx = incList.indexOf(item);
      const pct = totalMensalGlobal > 0 ? ((item.mensal / totalMensalGlobal) * 100).toFixed(1) : '0.0';
      const mText = item.mensal > 0 ? `R$ ${item.mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-';
      html += `
        <tr>
          <td><span class="badge-sus" style="background: var(--success-bg); color: var(--success);">${item.esfera}</span></td>
          <td class="font-bold" style="color: var(--text-title); font-size: 0.85rem;">${item.descricao}</td>
          <td style="text-align: right; font-weight: 700; color: var(--success);">${mText}</td>
          <td style="text-align: right; font-weight: 700; color: var(--blue-vibrant);">R$ ${item.anual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td style="text-align: center; font-weight: 600;">${pct}%</td>
          <td style="text-align: center;">
            <button onclick="removeIncentive(${globalIdx})" style="border: none; background: transparent; color: var(--danger); cursor: pointer;" title="Excluir Linha">
              <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
            </button>
          </td>
        </tr>
      `;
    });
    // Estadual Subtotal Row
    html += `
      <tr style="background: var(--bg-card-hover); font-weight: 800; border-bottom: 2px solid var(--border-color);">
        <td colspan="2" style="font-size: 0.85rem; color: var(--success); padding-left: 1.5rem;">SUBTOTAL INCENTIVOS ESTADUAIS</td>
        <td style="text-align: right; color: var(--success);">R$ ${subEstM.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: right; color: var(--blue-vibrant);">R$ ${subEstA.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: center;">${((subEstM / totalMensalGlobal)*100).toFixed(1)}%</td>
        <td></td>
      </tr>
    `;
  }

  // 3. Outros (Se cadastrado novos)
  if (fOutros.length > 0) {
    fOutros.forEach((item) => {
      const globalIdx = incList.indexOf(item);
      const pct = totalMensalGlobal > 0 ? ((item.mensal / totalMensalGlobal) * 100).toFixed(1) : '0.0';
      html += `
        <tr>
          <td><span class="badge-sus">${item.esfera}</span></td>
          <td class="font-bold" style="color: var(--text-title); font-size: 0.85rem;">${item.descricao}</td>
          <td style="text-align: right; font-weight: 700; color: var(--success);">R$ ${item.mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td style="text-align: right; font-weight: 700; color: var(--blue-vibrant);">R$ ${item.anual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td style="text-align: center; font-weight: 600;">${pct}%</td>
          <td style="text-align: center;">
            <button onclick="removeIncentive(${globalIdx})" style="border: none; background: transparent; color: var(--danger); cursor: pointer;" title="Excluir Linha">
              <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
            </button>
          </td>
        </tr>
      `;
    });
  }

  tbody.innerHTML = html;

  // Update Footer & Metric Header Cards
  const fmtMensal = 'R$ ' + totalMensalGlobal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  const fmtAnual = 'R$ ' + totalAnualGlobal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  const fmtFedM = 'R$ ' + subFedM.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  const fmtEstM = 'R$ ' + subEstM.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  const elFootM = document.getElementById('tfootMensalTotal');
  const elFootA = document.getElementById('tfootAnualTotal');
  if (elFootM) elFootM.innerText = fmtMensal;
  if (elFootA) elFootA.innerText = fmtAnual;

  const elSubM = document.getElementById('incSubtotalMensalText');
  const elSubA = document.getElementById('incSubtotalAnualText');
  const elCard1M = document.getElementById('card1SubtotalMensal');
  const elCount = document.getElementById('incTotalLinhasCount');
  const elFedSubText = document.getElementById('card1FedSub');
  const elEstSubText = document.getElementById('card1EstSub');

  if (elSubM) elSubM.innerText = fmtMensal;
  if (elSubA) elSubA.innerText = fmtAnual;
  if (elCard1M) elCard1M.innerText = fmtMensal;
  if (elCount) elCount.innerText = incList.length + ' Incentivos';
  if (elFedSubText) elFedSubText.innerText = fmtFedM;
  if (elEstSubText) elEstSubText.innerText = fmtEstM;

  lucide.createIcons();
}

function filterIncentivesTable() {
  const query = document.getElementById('searchIncentivo').value;
  renderIncentivesTable(query);
}

function openAddIncentiveModal() {
  const modal = document.getElementById('modalAddIncentive');
  if (modal) modal.style.display = 'flex';
}

function closeAddIncentiveModal() {
  const modal = document.getElementById('modalAddIncentive');
  if (modal) modal.style.display = 'none';
  document.getElementById('formAddIncentive').reset();
}

function autoCalcAnual() {
  const mensalVal = parseFloat(document.getElementById('newIncValorMensal').value) || 0;
  document.getElementById('newIncValorAnual').value = (mensalVal * 12).toFixed(2);
}

function saveNewIncentive(event) {
  event.preventDefault();
  const esfera = document.getElementById('newIncEsfera').value;
  const descricao = document.getElementById('newIncDescricao').value.trim();
  const mensal = parseFloat(document.getElementById('newIncValorMensal').value) || 0;
  const anual = mensal * 12;

  if (!descricao || mensal <= 0) {
    alert("Por favor, preencha a descrição e um valor mensal válido.");
    return;
  }

  DATASETS[2026].incentivosDiscriminados.push({
    esfera,
    descricao,
    mensal,
    anual
  });

  renderIncentivesTable();
  closeAddIncentiveModal();
}

function removeIncentive(index) {
  if (confirm("Deseja remover este item de incentivo?")) {
    DATASETS[2026].incentivosDiscriminados.splice(index, 1);
    renderIncentivesTable();
  }
}

/* ==========================================================================
   PROGRAMA ASSISTIR / RS - AMBULATÓRIOS DE ESPECIALIDADES (TABELA 18, 7, 16)
   ========================================================================== */

let currentAssistirKey = 'cardiologia';

const AMBULATORIOS_ASSISTIR = {
  traumato: {
    id: 'traumato',
    titulo: 'V. AMBULATÓRIO DE ESPECIALIDADE EM TRAUMATOLOGIA E ORTOPEDIA',
    tabelaRef: 'Tabela 5 - Portaria ASSISTIR / RS',
    descricao: 'Atendimento especializado para diagnóstico, tratamento e reabilitação de patologias do sistema musculoesquelético (ossos, articulações, ligamentos e tendões). Atuação integrada com a rede de urgência e emergência e atenção primária.',
    metaConsultas: 180,
    metaCirurgias: 15,
    producaoAtual: {
      consultas: 195,
      cirurgias: 18,
      exames: 210
    },
    equipe: [
      'Médico Ortopedista e Traumatologista com RQE (carga horária mínima consolidada de 20h semanais)',
      'Fisioterapeuta',
      'Equipe de Enfermagem'
    ],
    diagnosticosTratamentos: [
      { codigo: '02.06', nome: 'Radiologia Convencional', realizado: 150 },
      { codigo: '02.05', nome: 'Ultrassonografia Articular', realizado: 45 },
      { codigo: '03.01.07.007-5', nome: 'Atendimento de Fisioterapia', realizado: 15 }
    ],
    procedimentosAvaliados: [
      { codigo: '03.01.01.007-2', nome: 'Consulta Médica em Traumatologia e Ortopedia' },
      { codigo: '04.08', nome: 'Cirurgia Ortopédica e Traumatológica' }
    ],
    procedimentosComplementares: [],
    referencia: 'Referência regional para urgências ortopédicas de média complexidade.',
    contrarreferencia: 'Encaminhamento para reabilitação básica na atenção primária.'
  },
  maternidade_ar: {
    id: 'maternidade_ar',
    titulo: 'IX. AMBULATÓRIO DE GESTAÇÃO DE ALTO RISCO (MATERNIDADE AR)',
    tabelaRef: 'Tabela 9 - Portaria ASSISTIR / RS',
    descricao: 'Acompanhamento pré-natal especializado para gestantes que apresentam condições clínicas ou obstétricas de alto risco, visando a redução da morbimortalidade materna e neonatal na região de saúde da Campanha.',
    metaConsultas: 120,
    metaCirurgias: 0,
    producaoAtual: {
      consultas: 125,
      cirurgias: 0,
      exames: 180
    },
    equipe: [
      'Médico Obstetra especialista em Alto Risco com RQE (mínimo 20h semanais)',
      'Enfermeira Obstétrica',
      'Assistente Social',
      'Psicólogo'
    ],
    diagnosticosTratamentos: [
      { codigo: '02.05.02.014-3', nome: 'Ultrassonografia Obstétrica com Doppler', realizado: 90 },
      { codigo: '02.05.02.015-1', nome: 'Ultrassonografia Obstétrica Morfológica', realizado: 45 },
      { codigo: '02.11.02.005-2', nome: 'Cardiotocografia Anteparto', realizado: 45 }
    ],
    procedimentosAvaliados: [
      { codigo: '03.01.01.007-2', nome: 'Consulta Pré-Natal de Alto Risco' },
      { codigo: '03.02.05.002-6', nome: 'Atendimento Individual em Pré-Natal de Alto Risco' }
    ],
    procedimentosComplementares: [],
    referencia: 'Referência regional para gestantes classificadas como Alto Risco na atenção básica.',
    contrarreferencia: 'Vínculo pós-parto com a unidade de saúde da família de origem.'
  },
  cardiologia: {
    id: 'cardiologia',
    titulo: 'XIII. AMBULATÓRIO DE ESPECIALIDADE EM CARDIOLOGIA',
    tabelaRef: 'Tabela 18 - Portaria ASSISTIR / RS',
    descricao: 'Este serviço deverá atender ao diagnóstico e tratamento das doenças que acometem o coração bem como os outros componentes do sistema circulatório. O cardiologista e a equipe do Laboratório de Exames Complementares em Cardiologia se organizam em articulação com os NASF ou equipes da atenção primária. A unidade deverá atender adultos, adolescentes e crianças.',
    metaConsultas: 240,
    metaCirurgias: 0,
    producaoAtual: {
      consultas: 258,
      cirurgias: 0,
      exames: 680
    },
    equipe: [
      'Médico cardiologista, com Registro de Qualificação Profissional com carga horária mínima de 30 horas semanais',
      'Nutricionista',
      'Equipe de enfermagem.'
    ],
    diagnosticosTratamentos: [
      { codigo: '02.02', nome: 'Exames laboratoriais', realizado: 420 },
      { codigo: '02.11.02.003-6', nome: 'Eletrocardiograma', realizado: 145 },
      { codigo: '02.05.01.003-2', nome: 'Ecocardiograma transtorácico', realizado: 62 },
      { codigo: '02.05.01.002-4', nome: 'Ecocardiograma transesofágico', realizado: 12 },
      { codigo: '02.11.02.004-4', nome: 'Holter', realizado: 28 },
      { codigo: '02.11.02.006-0', nome: 'Prova de esforço', realizado: 13 }
    ],
    procedimentosAvaliados: [
      { codigo: '03.01.01.007-2', nome: 'Consulta Médica em Atenção Especializada CBO Médico Cardiologista' },
      { codigo: '03.01.01.030-7', nome: 'Teleconsulta Médica na Atenção Especializada CBO Médico Cardiologista' }
    ],
    procedimentosComplementares: [],
    referencia: 'Serviço de Alta Complexidade em Cardiologia.',
    contrarreferencia: 'Atenção primária.'
  },

  cirurgia_geral: {
    id: 'cirurgia_geral',
    titulo: 'III. AMBULATÓRIO DE ESPECIALIDADE EM CIRURGIA GERAL',
    tabelaRef: 'Tabela 7 - Portaria ASSISTIR / RS',
    descricao: 'Este serviço deverá oferecer consultas, procedimentos diagnósticos e terapêuticos, de forma multidisciplinar, e intervenções cirúrgicas a hérnias da parede abdominal, doenças do aparelho digestivo, incluindo estomias e reversões de estomias, tumores de pele e tecidos moles e cirurgias de tireóide/paratireóide/suprarrenal, com avaliação pré-operatória. As cirurgias realizadas nessa especialidade são hospitalares, de média complexidade, financiamento MAC, caráter eletivo, com exceção da Colangiopancreatografia Retrógrada Via Endoscópica de alta complexidade e financiamento FAEC, que representa um procedimento complementar. A unidade deverá atender adultos, adolescentes e crianças. Pacientes ostomizados devem ser acompanhados pela Atenção Básica e permanecerem vinculados ao serviço, inclusive para cirurgia de reversão, quando indicada. Para ofertar procedimentos cirúrgicos de Vasectomia, o serviço deverá possuir habilitação federal – 1902 – Vasectomia.',
    metaConsultas: 120,
    metaCirurgias: 30,
    producaoAtual: {
      consultas: 134,
      cirurgias: 32,
      exames: 210
    },
    equipe: [
      'Médico cirurgião geral, com mínimo de 2 cirurgiões, com Registro de Qualificação Profissional, com carga horária mínima de 20 horas semanais cada',
      'Equipe de enfermagem.'
    ],
    diagnosticosTratamentos: [
      { codigo: '02.02', nome: 'Exames laboratoriais', realizado: 130 },
      { codigo: '02.04', nome: 'Raio X', realizado: 45 },
      { codigo: '02.11.02.003-6', nome: 'Eletrocardiograma', realizado: 22 },
      { codigo: '02.05', nome: 'Ultrassonografia', realizado: 13 }
    ],
    procedimentosAvaliados: [
      { codigo: '04.07', nome: 'Cirurgia do aparelho digestivo, órgãos anexos e parede abdominal' },
      { codigo: '03.01.01.007-2', nome: 'Consulta Médica em Atenção Especializada CBO Médico Cirurgião geral' },
      { codigo: '03.01.01.030-7', nome: 'Teleconsulta Médica na Atenção Especializada CBO Médico Cirurgião geral' }
    ],
    procedimentosComplementares: [
      { codigo: '04.09.04.024-0', nome: 'Vasectomia - quando o hospital possuir habilitação no CNES.' },
      { codigo: '04.09.06.018-6', nome: 'Laqueadura Tubária - quando o hospital possuir habilitação no CNES.' },
      { codigo: '04.02', nome: 'Cirurgia de Glândulas Endócrinas' },
      { codigo: '04.09.05.008-3', nome: 'Postectomia' },
      { codigo: 'Ostomias', nome: 'Acompanhamento e Reversão de Ostomias' },
      { codigo: '04.07.03.025-5', nome: 'Colangiopancreatografia Retrógrada Endoscópica Terapêutica' }
    ],
    referencia: 'Procedimentos com necessidade de uso de alta tecnologia. Unidade de Alta complexidade em Oncologia.',
    contrarreferencia: 'Atenção primária.'
  },

  gastroenterologia: {
    id: 'gastroenterologia',
    titulo: 'IX. AMBULATÓRIO DE ESPECIALIDADE EM GASTROENTEROLOGIA',
    tabelaRef: 'Tabela 14 - Portaria ASSISTIR / RS',
    descricao: 'Este serviço deverá oferecer diagnóstico e tratamento para as doenças digestivas, como as que acometem o esôfago, estômago, duodeno, intestino delgado, intestino grosso (tubo digestivo) e também ao pâncreas, fígado e vesícula biliar. A unidade deverá atender adultos, adolescentes e crianças.',
    metaConsultas: 240,
    metaCirurgias: 0,
    producaoAtual: {
      consultas: 245,
      cirurgias: 0,
      exames: 395
    },
    equipe: [
      'Médico gastroenterologista, com Registro de Qualificação Profissional com carga horária mínima de 30 horas semanais',
      'Nutricionista com carga horária mínima de 20 horas semanais',
      'Equipe de enfermagem.'
    ],
    diagnosticosTratamentos: [
      { codigo: '02.02', nome: 'Exames laboratoriais', realizado: 180 },
      { codigo: '02.04', nome: 'Raio X', realizado: 35 },
      { codigo: '02.09.01.003-7', nome: 'Endoscopia Digestiva Alta (mínimo de 50/mês)', realizado: 65 },
      { codigo: '02.09.01.002-9', nome: 'Colonoscopia (coloscopia)', realizado: 42 },
      { codigo: '02.05', nome: 'Ultrassonografia', realizado: 38 },
      { codigo: '02.06', nome: 'Tomografia Computadorizada', realizado: 18 },
      { codigo: '02.07', nome: 'RNM abdômen', realizado: 12 },
      { codigo: '02.07.03.004-9', nome: 'Ressonância magnética de vias biliares/colangiorressonancia', realizado: 5 }
    ],
    procedimentosAvaliados: [
      { codigo: '03.01.01.007-2', nome: 'Consulta Médica em Atenção Especializada CBO Médico Gastroenterologista' },
      { codigo: '03.01.01.030-7', nome: 'Teleconsulta Médica na Atenção Especializada CBO Médico Gastroenterologista' }
    ],
    procedimentosComplementares: [],
    referencia: 'Referência para o serviço de cirurgia geral ou oncologia e contrarreferência do mesmo, para acompanhamento do paciente após cirurgia em acompanhamento ambulatorial quando necessário.',
    contrarreferencia: 'Atenção primária.'
  },

  ginecologia: {
    id: 'ginecologia',
    titulo: 'XI. AMBULATÓRIO DE ESPECIALIDADE EM GINECOLOGIA',
    tabelaRef: 'Tabela 16 - Portaria ASSISTIR / RS',
    descricao: 'Este Serviço deverá prestar atendimento nas diversas áreas da saúde da mulher, da adolescência à terceira idade. Atenderá os casos de oncologia ginecológica, patologia do trato genital inferior, Endoscopia e Endometriose, Sexologia, Climatério de Endocrinopatias, Uroginecologia, Estática Pélvica e de Ginecologia Infanto-Puberal, Planejamento Reprodutivo. O serviço de Ginecologia deverá seguir os critérios de encaminhamento da atenção básica para o Ambulatório de Especialidade em Ginecologia de acordo com o Protocolo de Regulação Ambulatorial Ginecologia e o Protocolo de encaminhamento para Mastologia, e as atualizações dos mesmos. As cirurgias realizadas nessa especialidade são hospitalares, de média complexidade, financiamento MAC, caráter eletivo, nas formas de organização descritas na tabela 16. Para realização de laqueadura tubária o hospital precisa ser credenciado no código 1901 – Laqueadura e com o CNES atualizado. O serviço deve utilizar o Protocolo de Planejamento Familiar do estado do Rio Grande do Sul, e as atualizações do mesmo, que regulamenta e orienta as questões em relação à laqueadura tubária e vasectomia, conforme pactuação em CIB/RS.',
    metaConsultas: 240,
    metaCirurgias: 30,
    producaoAtual: {
      consultas: 248,
      cirurgias: 31,
      exames: 315
    },
    equipe: [
      'Médico cirurgião Ginecologista, com mínimo de 2 cirurgiões, com Registro de Qualificação Profissional com carga horária mínima de 20 horas semanais cada',
      'Enfermeiro com carga horária mínima de 30 horas semanais',
      'Equipe de enfermagem.'
    ],
    diagnosticosTratamentos: [
      { codigo: '02.02', nome: 'Exames laboratoriais', realizado: 120 },
      { codigo: '02.04', nome: 'Raio X', realizado: 18 },
      { codigo: '02.11.02.003-6', nome: 'Eletrocardiograma', realizado: 24 },
      { codigo: '02.11.04.002-9', nome: 'Colposcopia', realizado: 32 },
      { codigo: '02.05.02.004-6', nome: 'Ultrassonografia de Abdômen Total - 25/mês', realizado: 26 },
      { codigo: '02.05.02.018-6', nome: 'Ultrassonografia Transvaginal - 25/mês', realizado: 27 },
      { codigo: '02.05.02.009-7', nome: 'Ultrassonografia Mamária Bilateral – 25/mês', realizado: 25 },
      { codigo: '02.06', nome: 'Tomografia', realizado: 8 },
      { codigo: '02.07', nome: 'RNM', realizado: 5 },
      { codigo: '02.04.03.018-8', nome: 'Mamografia Bilateral de Rastreamento - 30/mês', realizado: 32 },
      { codigo: '02.04.06.002-8', nome: 'Densitometria óssea', realizado: 14 }
    ],
    procedimentosAvaliados: [
      { codigo: '04.09.01', nome: 'Cirurgia do aparelho geniturinário (rim, ureter e bexiga)' },
      { codigo: '04.09.02', nome: 'Cirurgia do aparelho geniturinário (uretra)' },
      { codigo: '04.09.06', nome: 'Cirurgia do Aparelho Geniturinário (útero e anexos)' },
      { codigo: '04.09.07', nome: 'Cirurgia do Aparelho Geniturinário (vagina, vulva e períneo)' },
      { codigo: '03.01.01.007-2', nome: 'Consulta Médica em Atenção Especializada CBO Médico Ginecologista' },
      { codigo: '03.01.01.030-7', nome: 'Teleconsulta Médica na Atenção Especializada CBO Médico Ginecologista' }
    ],
    procedimentosComplementares: [],
    referencia: 'Procedimentos com necessidade de uso de alta tecnologia. Serviço de Alta complexidade em Oncologia',
    contrarreferencia: 'Atenção primária.'
  }
};

function switchAssistirAmbulatorio(key, btnEl) {
  currentAssistirKey = key;
  document.querySelectorAll('.assistir-sidebar-nav .pill-btn').forEach(btn => btn.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderAssistirAmbulatorio(key);
}
window.switchAssistirAmbulatorio = switchAssistirAmbulatorio;

function renderAssistirAmbulatorio(key) {
  const item = AMBULATORIOS_ASSISTIR[key];
  const container = document.getElementById('assistirMainContent');
  if (!item || !container) return;

  const pctConsultas = item.metaConsultas > 0 ? ((item.producaoAtual.consultas / item.metaConsultas) * 100).toFixed(1) : '100.0';
  const pctCirurgias = item.metaCirurgias > 0 ? ((item.producaoAtual.cirurgias / item.metaCirurgias) * 100).toFixed(1) : '100.0';
  const isConforme = parseFloat(pctConsultas) >= 100 && parseFloat(pctCirurgias) >= 100;

  let html = `
    <!-- CABEÇALHO OFICIAL GOVERNO DO ESTADO DO RIO GRANDE DO SUL / PORTARIA ASSISTIR -->
    <div class="card" style="margin-bottom: 1.5rem; text-align: center; padding: 1.5rem 2rem; background: linear-gradient(180deg, var(--bg-card) 0%, var(--bg-card-hover) 100%); border: 1px solid var(--border-color);">
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <img src="logo_rs.svg" alt="Governo do Estado do Rio Grande do Sul - Secretaria da Saúde" style="height: 100px; width: auto; margin-bottom: 0.5rem;">
        <h2 style="font-size: 1.45rem; font-weight: 900; color: var(--text-title); text-transform: uppercase; letter-spacing: 0.5px; margin: 0.3rem 0;">
          PORTARIA SES Nº 46/2026
        </h2>
      </div>
      
      <div style="max-width: 820px; margin: 0.6rem auto 0 auto; text-align: justify; text-align-last: center; font-size: 0.85rem; color: var(--text-main); line-height: 1.6; background: rgba(37, 99, 235, 0.04); padding: 0.75rem 1.25rem; border-radius: var(--radius-sm); border: 1px solid rgba(37, 99, 235, 0.15);">
        Altera a Portaria SES/RS nº 537, de 3 de agosto de 2021, que regulamenta, no âmbito do Estado do Rio Grande do Sul, o <strong>ASSISTIR - Programa de Incentivos Hospitalares</strong> (PROA 21/2000-0079506-0).
      </div>
    </div>

    <!-- Header Box da Especialidade Selecionada -->
    <div class="card" style="margin-bottom: 1.5rem;">
      <div class="card-header" style="flex-wrap: wrap; gap: 1rem;">
        <div>
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--blue-vibrant); text-transform: uppercase;">${item.tabelaRef}</span>
          <h2 style="font-size: 1.35rem; color: var(--text-title); margin: 0.2rem 0;">${item.titulo}</h2>
          <p style="font-size: 0.83rem; color: var(--text-main); line-height: 1.6; margin-top: 0.4rem; max-width: 850px;">${item.descricao}</p>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span class="badge-sus" style="background: rgba(37, 99, 235, 0.1); color: var(--blue-vibrant); font-size: 0.8rem; padding: 0.4rem 0.8rem;">
            Meta: ${item.metaConsultas} consultas/mês
          </span>
          ${item.metaCirurgias > 0 ? `
          <span class="badge-sus" style="background: rgba(139, 92, 246, 0.1); color: var(--purple); font-size: 0.8rem; padding: 0.4rem 0.8rem;">
            Meta: ${item.metaCirurgias} cirurgias/mês
          </span>
          ` : ''}
          <span class="badge-sus" style="background: ${isConforme ? 'var(--success-bg)' : 'var(--danger-bg)'}; color: ${isConforme ? 'var(--success)' : 'var(--danger)'}; font-size: 0.8rem; padding: 0.4rem 0.8rem;">
            ${isConforme ? '🟢 Em Conformidade Contratual' : '⚠️ Alerta de Meta'}
          </span>
        </div>
      </div>
    </div>

    <!-- Metric KPI Cards -->
    <div class="grid-4" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 1.5rem;">
      <div class="card kpi-card">
        <div class="card-header">
          <span class="kpi-label">Consultas Médicas (Mês)</span>
          <div class="card-icon" style="background: rgba(37, 99, 235, 0.15); color: var(--blue-vibrant);"><i data-lucide="user-check"></i></div>
        </div>
        <div class="kpi-value" style="color: var(--blue-vibrant);">${item.producaoAtual.consultas} <span style="font-size: 0.8rem; color: var(--text-muted);">/ ${item.metaConsultas} min</span></div>
        <div class="kpi-subtext trend-up">
          <i data-lucide="check-circle"></i>
          <span>${pctConsultas}% da Meta ASSISTIR</span>
        </div>
      </div>

      ${item.metaCirurgias > 0 ? `
      <div class="card kpi-card">
        <div class="card-header">
          <span class="kpi-label">Cirurgias Mensais</span>
          <div class="card-icon" style="background: rgba(139, 92, 246, 0.15); color: var(--purple);"><i data-lucide="scissors"></i></div>
        </div>
        <div class="kpi-value" style="color: var(--purple);">${item.producaoAtual.cirurgias} <span style="font-size: 0.8rem; color: var(--text-muted);">/ ${item.metaCirurgias} min</span></div>
        <div class="kpi-subtext trend-up">
          <i data-lucide="check-circle"></i>
          <span>${pctCirurgias}% Atingido</span>
        </div>
      </div>
      ` : `
      <div class="card kpi-card">
        <div class="card-header">
          <span class="kpi-label">Caráter de Atendimento</span>
          <div class="card-icon" style="background: rgba(16, 185, 129, 0.15); color: var(--success);"><i data-lucide="shield"></i></div>
        </div>
        <div class="kpi-value" style="font-size: 1.1rem; color: var(--success);">Clínico / Eletivo</div>
        <div class="kpi-subtext trend-up">
          <i data-lucide="check"></i>
          <span>Regulação via SISREG / CIB</span>
        </div>
      </div>
      `}

      <div class="card kpi-card">
        <div class="card-header">
          <span class="kpi-label">Diagnósticos & Procedimentos</span>
          <div class="card-icon" style="background: rgba(245, 158, 11, 0.15); color: var(--warning);"><i data-lucide="activity"></i></div>
        </div>
        <div class="kpi-value" style="color: var(--warning);">${item.producaoAtual.exames}</div>
        <div class="kpi-subtext trend-up">
          <i data-lucide="layers"></i>
          <span>Procedimentos SIA no Mês</span>
        </div>
      </div>

      <div class="card kpi-card">
        <div class="card-header">
          <span class="kpi-label">Status Portaria ASSISTIR</span>
          <div class="card-icon" style="background: var(--success-bg); color: var(--success);"><i data-lucide="award"></i></div>
        </div>
        <div class="kpi-value" style="font-size: 1.1rem; color: var(--success);">100% Homologado</div>
        <div class="kpi-subtext trend-up">
          <i data-lucide="check"></i>
          <span>Sem Retenção Financeira</span>
        </div>
      </div>
    </div>

    <!-- Tabela de Especificações Oficiais da Portaria ASSISTIR/RS -->
    <div class="card" style="margin-bottom: 1.5rem;">
      <div class="card-header">
        <h3>Requisitos e Classificação Oficial da Portaria (${item.tabelaRef})</h3>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 220px;">Classificação</th>
              <th>Especialidade / Especificação Pactuada</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold" style="color: var(--blue-vibrant);">Equipe Multiprofissional</td>
              <td>
                <ul style="margin: 0; padding-left: 1.2rem; line-height: 1.6;">
                  ${item.equipe.map(eq => `<li>${eq}</li>`).join('')}
                </ul>
              </td>
            </tr>
            <tr>
              <td class="font-bold" style="color: var(--blue-vibrant);">Consultas Médicas Mínimas</td>
              <td><strong style="color: var(--success); font-size: 1.05rem;">Mínimo de ${item.metaConsultas} consultas/mês</strong></td>
            </tr>
            ${item.metaCirurgias > 0 ? `
            <tr>
              <td class="font-bold" style="color: var(--purple);">Cirurgias Mensais Mínimas</td>
              <td><strong style="color: var(--purple); font-size: 1.05rem;">Mínimo de ${item.metaCirurgias} cirurgias mensais</strong> com procedimento anestésico, equipe auxiliar, avaliação pré-cirúrgica e avaliação pré-anestésica.</td>
            </tr>
            ` : ''}
            <tr>
              <td class="font-bold" style="color: var(--blue-vibrant);">Diagnósticos e Tratamentos (Exames)</td>
              <td>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 0.5rem;">
                  ${item.diagnosticosTratamentos.map(diag => `
                    <div style="background: var(--bg-card-hover); padding: 0.45rem 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--blue-vibrant); font-size: 0.82rem;">
                      <span style="font-weight: 700; color: var(--blue-vibrant);">${diag.codigo}</span> - ${diag.nome}
                    </div>
                  `).join('')}
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-bold" style="color: var(--blue-vibrant);">Procedimentos Avaliados (SIGTAP)</td>
              <td>
                <ul style="margin: 0; padding-left: 1.2rem; line-height: 1.6;">
                  ${item.procedimentosAvaliados.map(pa => `<li><strong>${pa.codigo}</strong> – ${pa.nome}</li>`).join('')}
                </ul>
              </td>
            </tr>
            ${item.procedimentosComplementares.length > 0 ? `
            <tr>
              <td class="font-bold" style="color: var(--warning);">Procedimentos Complementares</td>
              <td>
                <ul style="margin: 0; padding-left: 1.2rem; line-height: 1.6;">
                  ${item.procedimentosComplementares.map(pc => `<li><strong>${pc.codigo}</strong> – ${pc.nome}</li>`).join('')}
                </ul>
              </td>
            </tr>
            ` : ''}
            <tr>
              <td class="font-bold" style="color: var(--blue-vibrant);">Referência / Contrarreferência</td>
              <td>
                <p style="margin: 0;"><strong>Referência:</strong> ${item.referencia}</p>
                <p style="margin: 0.2rem 0 0 0;"><strong>Contrarreferência:</strong> ${item.contrarreferencia}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Painel Interativo de Controle Mensal de Produção -->
    <div class="card">
      <div class="card-header">
        <div class="card-title-group">
          <div class="card-icon" style="background: rgba(16, 185, 129, 0.15); color: var(--success);"><i data-lucide="sliders"></i></div>
          <div>
            <h3>Controle Mensal de Produção Realizada - ${item.titulo.split('EM ')[1] || 'Especialidade'}</h3>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Lance a produção do mês corrente para recalcular o percentual de conformidade da Portaria ASSISTIR</span>
          </div>
        </div>
      </div>

      <form onsubmit="updateAssistirProducao('${key}', event)" style="padding: 0.5rem 0;">
        <div class="grid-3" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div class="sim-control-group">
            <label for="inputConsultas_${key}">Consultas Médicas Realizadas no Mês:</label>
            <input type="number" id="inputConsultas_${key}" value="${item.producaoAtual.consultas}" min="0" class="select-control" style="width: 100%; font-weight: 800; font-size: 1rem;" required>
          </div>

          ${item.metaCirurgias > 0 ? `
          <div class="sim-control-group">
            <label for="inputCirurgias_${key}">Cirurgias Mensais Realizadas:</label>
            <input type="number" id="inputCirurgias_${key}" value="${item.producaoAtual.cirurgias}" min="0" class="select-control" style="width: 100%; font-weight: 800; font-size: 1rem;" required>
          </div>
          ` : ''}

          <div class="sim-control-group">
            <label for="inputExames_${key}">Total de Diagnósticos & Exames SIA:</label>
            <input type="number" id="inputExames_${key}" value="${item.producaoAtual.exames}" min="0" class="select-control" style="width: 100%; font-weight: 800; font-size: 1rem;" required>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button type="submit" class="btn-primary" style="padding: 0.65rem 1.5rem;">
            <i data-lucide="check"></i> Atualizar Produção Mensal
          </button>
        </div>
      </form>
    </div>
  `;

    <!-- ESTUDO DE VIABILIDADE FINANCEIRA - MODELO EXCEL ASSISTIR -->
    <div class="card" style="margin-top: 1.5rem; border: 2px solid var(--navy-primary);">
      <!-- Top Title Bar -->
      <div style="background: var(--navy-primary); color: #FFFFFF; padding: 0.85rem 1.25rem; text-align: center; border-top-left-radius: var(--radius-sm); border-top-right-radius: var(--radius-sm);">
        <h2 style="font-size: 1.15rem; font-weight: 900; margin: 0; letter-spacing: 0.5px;">
          ESTUDO DE VIABILIDADE FINANCEIRA - ASSISTIR | ${item.titulo.split('EM ')[1] || 'ESPECIALIDADE'}
        </h2>
      </div>

      <!-- Sub-header Bar -->
      <div style="background: #334155; color: #FFFFFF; padding: 0.45rem 1.25rem; text-align: center; font-weight: 800; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">
        AMBULATÓRIO DE ${item.titulo.split('EM ')[1] || 'ESPECIALIDADE'}
      </div>

      <div class="table-responsive" style="padding: 0.5rem 0;">
        <table class="data-table" id="tableViabilidade_${key}" style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">
          <thead>
            <tr style="font-weight: 800; color: #FFFFFF;">
              <th style="background: #0284C7; width: 110px; text-align: center;">Item #1</th>
              <th style="background: #10B981; min-width: 250px;">PESSOAL / PROCEDIMENTO</th>
              <th style="background: #10B981; width: 100px; text-align: center;">QUANTIDADE</th>
              <th style="background: #10B981; width: 110px; text-align: right;">R$ SIGTAP</th>
              <th style="background: #10B981; width: 120px; text-align: right;">R$ PRODUÇÃO</th>
              <th style="background: #059669; width: 130px; text-align: right;">R$ INCENTIVO</th>
              <th style="background: #8B5CF6; width: 110px; text-align: right;">R$ CUSTO</th>
              <th style="background: #7C3AED; width: 130px; text-align: right;">TOTAL CUSTO</th>
            </tr>
          </thead>
          <tbody>
            <!-- SEÇÃO 1: PROCEDIMENTOS E EXAMES DA PORTARIA -->
            ${(VIABILIDADE_EXCEL[key]?.itensProcedimentos || []).map((p, idx) => {
              const rProducao = (p.qtd || 0) * (p.sigtap || 0);
              const rTotalCusto = (p.qtd || 0) * (p.custoUnit || 0);
              return `
                <tr data-type="proc" data-index="${idx}">
                  <td style="text-align: center; font-weight: 700; color: var(--blue-vibrant); background: rgba(37, 99, 235, 0.05);">${p.id}</td>
                  <td class="font-bold" style="color: var(--text-title);">${p.descricao}</td>
                  <td style="text-align: center;">
                    <input type="number" step="1" min="0" value="${p.qtd}" class="input-excel-qtd" oninput="recalcViabilityTable('${key}')" style="width: 70px; text-align: center; padding: 0.2rem; font-weight: 700; border: 1px solid var(--border-color); border-radius: 4px; background: #FEF3C7; color: #92400E;">
                  </td>
                  <td style="text-align: right;">
                    <input type="number" step="0.01" min="0" value="${p.sigtap}" class="input-excel-sigtap" oninput="recalcViabilityTable('${key}')" style="width: 80px; text-align: right; padding: 0.2rem; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-card);">
                  </td>
                  <td style="text-align: right; font-weight: 800; color: var(--success);" class="cell-producao">
                    R$ ${rProducao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style="text-align: right;">
                    <input type="number" step="0.01" min="0" value="${p.incentivo}" class="input-excel-incentivo" oninput="recalcViabilityTable('${key}')" style="width: 95px; text-align: right; padding: 0.2rem; font-weight: 700; border: 1px solid var(--border-color); border-radius: 4px; background: rgba(16, 185, 129, 0.1); color: var(--success);">
                  </td>
                  <td style="text-align: right;">
                    <input type="number" step="0.01" min="0" value="${p.custoUnit}" class="input-excel-custo" oninput="recalcViabilityTable('${key}')" style="width: 80px; text-align: right; padding: 0.2rem; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-card);">
                  </td>
                  <td style="text-align: right; font-weight: 800; color: var(--purple);" class="cell-total-custo">
                    R$ ${rTotalCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              `;
            }).join('')}

            <!-- SEÇÃO 2: EQUIPE MULTIPROFISSIONAL E PESSOAL (ROSA) -->
            ${(VIABILIDADE_EXCEL[key]?.itensPessoal || []).map((p, idx) => {
              const rTotalCusto = (p.qtd || 0) * (p.custoUnit || 0);
              return `
                <tr data-type="pessoal" data-index="${idx}" style="background: rgba(244, 114, 182, 0.12);">
                  <td style="text-align: center; font-weight: 700; color: #DB2777;">${p.id}</td>
                  <td class="font-bold" style="color: #9D174D;">${p.funcao}</td>
                  <td style="text-align: center;">
                    <input type="number" step="0.5" min="0" value="${p.qtd}" class="input-pessoal-qtd" oninput="recalcViabilityTable('${key}')" style="width: 70px; text-align: center; padding: 0.2rem; font-weight: 700; border: 1px solid #F472B6; border-radius: 4px; background: #FCE7F3; color: #9D174D;">
                  </td>
                  <td style="text-align: right; color: var(--text-muted);">-</td>
                  <td style="text-align: right; color: var(--text-muted);">-</td>
                  <td style="text-align: right; color: var(--text-muted);">-</td>
                  <td style="text-align: right;">
                    <input type="number" step="0.01" min="0" value="${p.custoUnit}" class="input-pessoal-custo" oninput="recalcViabilityTable('${key}')" style="width: 85px; text-align: right; padding: 0.2rem; border: 1px solid #F472B6; border-radius: 4px; background: #FFFFFF; color: #9D174D;">
                  </td>
                  <td style="text-align: right; font-weight: 800; color: #9D174D;" class="cell-pessoal-total">
                    R$ ${rTotalCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>

          <!-- TOTALS AND FINANCIAL RESULT FOOTER -->
          <tfoot>
            <tr style="background: var(--bg-card-hover); font-weight: 800; border-top: 2px solid var(--navy-primary);">
              <td colspan="4" style="text-align: right; font-size: 0.9rem; color: var(--text-title);">TOTAIS CONSOLIDADOS:</td>
              <td style="text-align: right; color: var(--success); font-size: 0.95rem;" id="calcTotalProducao_${key}">R$ 0,00</td>
              <td style="text-align: right; color: var(--success); font-size: 0.95rem;" id="calcTotalIncentivo_${key}">R$ 0,00</td>
              <td style="text-align: right; color: var(--text-muted);">CUSTO TOTAL:</td>
              <td style="text-align: right; color: var(--danger); font-size: 0.95rem;" id="calcTotalCusto_${key}">R$ 0,00</td>
            </tr>

            <!-- BALANÇO FINANCEIRO FINAL (RECEITA vs CUSTO vs RESULTADO) -->
            <tr style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%); font-weight: 900; font-size: 1rem;">
              <td colspan="3" style="color: var(--navy-primary); padding: 0.8rem 1rem;">
                RECEITA TOTAL: <span style="color: var(--success);" id="calcReceitaBruta_${key}">R$ 0,00</span>
              </td>
              <td colspan="3" style="color: var(--navy-primary); padding: 0.8rem 1rem;">
                DESPESAS TOTAIS: <span style="color: var(--danger);" id="calcCustoTotalDisplay_${key}">R$ 0,00</span>
              </td>
              <td colspan="2" style="text-align: right; padding: 0.8rem 1rem;">
                RESULTADO LÍQUIDO: <span id="calcResultadoLiquido_${key}" style="font-size: 1.15rem; color: var(--success);">R$ 0,00</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = html;
  lucide.createIcons();
  recalcViabilityTable(key);
}

function updateAssistirProducao(key, event) {
  event.preventDefault();
  const item = AMBULATORIOS_ASSISTIR[key];
  if (!item) return;

  const consultasInput = document.getElementById(`inputConsultas_${key}`);
  const cirurgiasInput = document.getElementById(`inputCirurgias_${key}`);
  const examesInput = document.getElementById(`inputExames_${key}`);

  if (consultasInput) item.producaoAtual.consultas = parseInt(consultasInput.value) || 0;
  if (cirurgiasInput) item.producaoAtual.cirurgias = parseInt(cirurgiasInput.value) || 0;
  if (examesInput) item.producaoAtual.exames = parseInt(examesInput.value) || 0;

  renderAssistirAmbulatorio(key);
}

function openAddEspecialidadeModal() {
  const nomeSpec = prompt("Informe o nome do novo Ambulatório de Especialidade (ex: Neurologia, Ortopedia):");
  if (nomeSpec && nomeSpec.trim() !== "") {
    const slug = nomeSpec.toLowerCase().trim().replace(/\s+/g, '_');
    AMBULATORIOS_ASSISTIR[slug] = {
      id: slug,
      titulo: `AMBULATÓRIO DE ESPECIALIDADE EM ${nomeSpec.toUpperCase()}`,
      tabelaRef: 'Portaria ASSISTIR / RS',
      descricao: `Serviço especializado de atendimento ambulatorial em ${nomeSpec}.`,
      metaConsultas: 120,
      metaCirurgias: 0,
      producaoAtual: { consultas: 120, cirurgias: 0, exames: 150 },
      equipe: [`Médico especialista em ${nomeSpec}`, 'Equipe de enfermagem.'],
      diagnosticosTratamentos: [{ codigo: '02.02', nome: 'Exames laboratoriais', realizado: 100 }],
      procedimentosAvaliados: [{ codigo: '03.01.01.007-2', nome: `Consulta Médica em ${nomeSpec}` }],
      procedimentosComplementares: [],
      referencia: 'Serviço de Alta Complexidade.',
      contrarreferencia: 'Atenção primária.'
    };

    VIABILIDADE_EXCEL[slug] = {
      tituloEstudo: `ESTUDO DE VIABILIDADE FINANCEIRA - ASSISTIR | ${nomeSpec.toUpperCase()}`,
      subtitulo: `AMBULATÓRIO DE ${nomeSpec.toUpperCase()}`,
      itensProcedimentos: [
        { id: '03.01.01.007-2', descricao: `CONSULTA MÉDICA (${nomeSpec.toUpperCase()})`, qtd: 120, sigtap: 10.00, incentivo: 76587.70, custoUnit: 100.00 }
      ],
      itensPessoal: [
        { id: 'x', funcao: `MÉDICO ESPECIALISTA EM ${nomeSpec.toUpperCase()}`, qtd: 1.0, custoUnit: 500.00 },
        { id: 'x', funcao: 'SECRETARIA', qtd: 0.5, custoUnit: 3086.43 },
        { id: 'x', funcao: 'TECNICO DE ENFERMAGEM', qtd: 0.5, custoUnit: 3086.43 }
      ]
    };

    alert(`Ambulatório de ${nomeSpec} adicionado com sucesso ao Programa ASSISTIR!`);
    switchAssistirAmbulatorio(slug, null);
  }
}

/* DATASET DO ESTUDO DE VIABILIDADE FINANCEIRA (MODELO EXCEL OFICIAL) */
const VIABILIDADE_EXCEL = {
  cardiologia: {
    tituloEstudo: 'ESTUDO DE VIABILIDADE FINANCEIRA - ASSISTIR | CARDIOLOGIA',
    subtitulo: 'AMBULATÓRIO DE CARDIOLOGIA',
    itensProcedimentos: [
      { id: '03.01.01.007-2', descricao: 'CONSULTA MÉDICA (AT. ESPECIALIZADA)', qtd: 240, sigtap: 10.00, incentivo: 0, custoUnit: 100.00 },
      { id: '03.01.01.030-7', descricao: 'TELECONSULTA MÉDICA (AT. ESPECIALIZADA)', qtd: 0, sigtap: 23.73, incentivo: 0, custoUnit: 568.00 },
      { id: '02.02', descricao: 'EXAMES LABORATORIAIS', qtd: 420, sigtap: 9.00, incentivo: 0, custoUnit: 20.00 },
      { id: '02.11.02.003-6', descricao: 'ELETROCARDIOGRAMA', qtd: 145, sigtap: 4.80, incentivo: 0, custoUnit: 18.50 },
      { id: '02.05.01.003-2', descricao: 'ECOCARDIOGRAMA TRANSTORÁCICO', qtd: 62, sigtap: 24.20, incentivo: 0, custoUnit: 150.00 },
      { id: '02.05.01.002-4', descricao: 'ECOCARDIOGRAMA TRANSESOFÁGICO', qtd: 12, sigtap: 0, incentivo: 0, custoUnit: 0 },
      { id: '02.11.02.004-4', descricao: 'HOLTER', qtd: 28, sigtap: 0, incentivo: 0, custoUnit: 0 },
      { id: '02.11.02.006-0', descricao: 'PROVA DE ESFORÇO', qtd: 13, sigtap: 120.00, incentivo: 76587.70, custoUnit: 60.00 }
    ],
    itensPessoal: [
      { id: 'x', funcao: 'MÉDICO CARDIOLOGISTA + VISITA HOSPITALAR', qtd: 1.0, custoUnit: 500.00 },
      { id: 'x', funcao: 'SECRETARIA', qtd: 0.5, custoUnit: 3086.43 },
      { id: 'x', funcao: 'ENFERMEIRO 20h', qtd: 0.0, custoUnit: 0 },
      { id: 'x', funcao: 'NUTRICIONISTA', qtd: 0.5, custoUnit: 2500.00 },
      { id: 'x', funcao: 'TECNICO DE ENFERMAGEM', qtd: 0.5, custoUnit: 3086.43 }
    ]
  },

  cirurgia_geral: {
    tituloEstudo: 'ESTUDO DE VIABILIDADE FINANCEIRA - ASSISTIR | CIRURGIA GERAL',
    subtitulo: 'AMBULATÓRIO DE CIRURGIA GERAL',
    itensProcedimentos: [
      { id: '03.01.01.007-2', descricao: 'CONSULTA MÉDICA (AT. ESPECIALIZADA)', qtd: 120, sigtap: 10.00, incentivo: 0, custoUnit: 100.00 },
      { id: '03.01.01.030-7', descricao: 'TELECONSULTA MÉDICA (AT. ESPECIALIZADA)', qtd: 0, sigtap: 23.73, incentivo: 0, custoUnit: 568.00 },
      { id: '04.07', descricao: 'CIRURGIA APARELHO DIGESTIVO E PAREDE ABDOMINAL', qtd: 30, sigtap: 350.00, incentivo: 76587.70, custoUnit: 450.00 },
      { id: '02.02', descricao: 'EXAMES LABORATORIAIS', qtd: 130, sigtap: 9.00, incentivo: 0, custoUnit: 20.00 },
      { id: '02.04', descricao: 'RAIO X', qtd: 45, sigtap: 15.00, incentivo: 0, custoUnit: 30.00 },
      { id: '02.11.02.003-6', descricao: 'ELETROCARDIOGRAMA', qtd: 22, sigtap: 4.80, incentivo: 0, custoUnit: 18.50 },
      { id: '02.05', descricao: 'ULTRASSONOGRAFIA', qtd: 13, sigtap: 24.20, incentivo: 0, custoUnit: 80.00 },
      { id: '04.09.04.024-0', descricao: 'VASECTOMIA / LAQUEADURA', qtd: 5, sigtap: 220.00, incentivo: 0, custoUnit: 300.00 }
    ],
    itensPessoal: [
      { id: 'x', funcao: 'MÉDICO CIRURGIÃO GERAL (2 MÉDICOS)', qtd: 2.0, custoUnit: 500.00 },
      { id: 'x', funcao: 'SECRETARIA', qtd: 0.5, custoUnit: 3086.43 },
      { id: 'x', funcao: 'ENFERMEIRO 30h', qtd: 1.0, custoUnit: 4200.00 },
      { id: 'x', funcao: 'TECNICO DE ENFERMAGEM', qtd: 1.0, custoUnit: 3086.43 }
    ]
  },

  ginecologia: {
    tituloEstudo: 'ESTUDO DE VIABILIDADE FINANCEIRA - ASSISTIR | GINECOLOGIA',
    subtitulo: 'AMBULATÓRIO DE GINECOLOGIA',
    itensProcedimentos: [
      { id: '03.01.01.007-2', descricao: 'CONSULTA MÉDICA (AT. ESPECIALIZADA)', qtd: 240, sigtap: 10.00, incentivo: 0, custoUnit: 100.00 },
      { id: '03.01.01.030-7', descricao: 'TELECONSULTA MÉDICA (AT. ESPECIALIZADA)', qtd: 0, sigtap: 23.73, incentivo: 0, custoUnit: 568.00 },
      { id: '04.09.06', descricao: 'CIRURGIA APARELHO GENITURINÁRIO (ÚTERO/ANEXOS)', qtd: 30, sigtap: 380.00, incentivo: 76587.70, custoUnit: 480.00 },
      { id: '02.02', descricao: 'EXAMES LABORATORIAIS', qtd: 120, sigtap: 9.00, incentivo: 0, custoUnit: 20.00 },
      { id: '02.11.04.002-9', descricao: 'COLPOSCOPIA', qtd: 32, sigtap: 35.00, incentivo: 0, custoUnit: 60.00 },
      { id: '02.05.02.004-6', descricao: 'ULTRASSONOGRAFIA ABDÔMEN TOTAL', qtd: 26, sigtap: 24.20, incentivo: 0, custoUnit: 80.00 },
      { id: '02.05.02.018-6', descricao: 'ULTRASSONOGRAFIA TRANSVAGINAL', qtd: 27, sigtap: 24.20, incentivo: 0, custoUnit: 85.00 },
      { id: '02.04.03.018-8', descricao: 'MAMOGRAFIA BILATERAL RASTREAMENTO', qtd: 32, sigtap: 45.00, incentivo: 0, custoUnit: 90.00 }
    ],
    itensPessoal: [
      { id: 'x', funcao: 'MÉDICO GINECOLOGISTA (2 MÉDICOS)', qtd: 2.0, custoUnit: 500.00 },
      { id: 'x', funcao: 'SECRETARIA', qtd: 0.5, custoUnit: 3086.43 },
      { id: 'x', funcao: 'ENFERMEIRO 30h', qtd: 1.0, custoUnit: 4200.00 },
      { id: 'x', funcao: 'TECNICO DE ENFERMAGEM', qtd: 1.0, custoUnit: 3086.43 }
    ]
  },

  gastroenterologia: {
    tituloEstudo: 'ESTUDO DE VIABILIDADE FINANCEIRA - ASSISTIR | GASTROENTEROLOGIA',
    subtitulo: 'AMBULATÓRIO DE GASTROENTEROLOGIA',
    itensProcedimentos: [
      { id: '03.01.01.007-2', descricao: 'CONSULTA MÉDICA (AT. ESPECIALIZADA)', qtd: 240, sigtap: 10.00, incentivo: 76587.70, custoUnit: 100.00 },
      { id: '03.01.01.030-7', descricao: 'TELECONSULTA MÉDICA (AT. ESPECIALIZADA)', qtd: 0, sigtap: 23.73, incentivo: 0, custoUnit: 568.00 },
      { id: '02.02', descricao: 'EXAMES LABORATORIAIS', qtd: 180, sigtap: 9.00, incentivo: 0, custoUnit: 20.00 },
      { id: '02.04', descricao: 'RAIO X', qtd: 35, sigtap: 15.00, incentivo: 0, custoUnit: 30.00 },
      { id: '02.09.01.003-7', descricao: 'ENDOSCOPIA DIGESTIVA ALTA', qtd: 65, sigtap: 48.16, incentivo: 0, custoUnit: 120.00 },
      { id: '02.09.01.002-9', descricao: 'COLONOSCOPIA', qtd: 42, sigtap: 112.66, incentivo: 0, custoUnit: 250.00 },
      { id: '02.05', descricao: 'ULTRASSONOGRAFIA', qtd: 38, sigtap: 24.20, incentivo: 0, custoUnit: 80.00 },
      { id: '02.06', descricao: 'TOMOGRAFIA COMPUTADORIZADA', qtd: 18, sigtap: 126.90, incentivo: 0, custoUnit: 200.00 },
      { id: '02.07', descricao: 'RNM ABDÔMEN', qtd: 12, sigtap: 268.75, incentivo: 0, custoUnit: 450.00 },
      { id: '02.07.03.004-9', descricao: 'COLANGIORRESSONÂNCIA', qtd: 5, sigtap: 268.75, incentivo: 0, custoUnit: 500.00 }
    ],
    itensPessoal: [
      { id: 'x', funcao: 'MÉDICO GASTROENTEROLOGISTA 30h', qtd: 1.0, custoUnit: 6000.00 },
      { id: 'x', funcao: 'NUTRICIONISTA 20h', qtd: 0.5, custoUnit: 2500.00 },
      { id: 'x', funcao: 'SECRETARIA', qtd: 0.5, custoUnit: 3086.43 },
      { id: 'x', funcao: 'TECNICO DE ENFERMAGEM', qtd: 1.0, custoUnit: 3086.43 }
    ]
  }
};

/* RECALCULA A TABELA DO EXCEL DA VIABILIDADE EM TEMPO REAL */
function recalcViabilityTable(key) {
  const table = document.getElementById(`tableViabilidade_${key}`);
  if (!table) return;

  let totalProducao = 0;
  let totalIncentivo = 0;
  let totalCustos = 0;

  // Recalcular Linhas de Procedimentos
  table.querySelectorAll('tr[data-type="proc"]').forEach(tr => {
    const qtd = parseFloat(tr.querySelector('.input-excel-qtd')?.value) || 0;
    const sigtap = parseFloat(tr.querySelector('.input-excel-sigtap')?.value) || 0;
    const incentivo = parseFloat(tr.querySelector('.input-excel-incentivo')?.value) || 0;
    const custo = parseFloat(tr.querySelector('.input-excel-custo')?.value) || 0;

    const producaoRow = qtd * sigtap;
    const totalCustoRow = qtd * custo;

    const cellProducao = tr.querySelector('.cell-producao');
    if (cellProducao) cellProducao.innerText = `R$ ${producaoRow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    const cellTotalCusto = tr.querySelector('.cell-total-custo');
    if (cellTotalCusto) cellTotalCusto.innerText = `R$ ${totalCustoRow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    totalProducao += producaoRow;
    totalIncentivo += incentivo;
    totalCustos += totalCustoRow;
  });

  // Recalcular Linhas de Pessoal
  table.querySelectorAll('tr[data-type="pessoal"]').forEach(tr => {
    const qtd = parseFloat(tr.querySelector('.input-pessoal-qtd')?.value) || 0;
    const custo = parseFloat(tr.querySelector('.input-pessoal-custo')?.value) || 0;

    const totalCustoRow = qtd * custo;
    const cellTotal = tr.querySelector('.cell-pessoal-total');
    if (cellTotal) cellTotal.innerText = `R$ ${totalCustoRow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    totalCustos += totalCustoRow;
  });

  const receitaBruta = totalProducao + totalIncentivo;
  const resultadoLiquido = receitaBruta - totalCustos;

  // Atualizar Exibição do Rodapé
  const elProd = document.getElementById(`calcTotalProducao_${key}`);
  if (elProd) elProd.innerText = `R$ ${totalProducao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  const elInc = document.getElementById(`calcTotalIncentivo_${key}`);
  if (elInc) elInc.innerText = `R$ ${totalIncentivo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  const elCusto = document.getElementById(`calcTotalCusto_${key}`);
  if (elCusto) elCusto.innerText = `R$ ${totalCustos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  const elRecBruta = document.getElementById(`calcReceitaBruta_${key}`);
  if (elRecBruta) elRecBruta.innerText = `R$ ${receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  const elCustoDisplay = document.getElementById(`calcCustoTotalDisplay_${key}`);
  if (elCustoDisplay) elCustoDisplay.innerText = `R$ ${totalCustos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  const elRes = document.getElementById(`calcResultadoLiquido_${key}`);
  if (elRes) {
    elRes.innerText = `R$ ${resultadoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (resultadoLiquido >= 0) {
      elRes.style.color = 'var(--success)';
    } else {
      elRes.style.color = 'var(--danger)';
    }
  }
}



/* ==========================================================================
   CARTEIRA DE OPÇÕES B3 (OCIs) - GENIAL INVESTIMENTOS
   ========================================================================== */

const OCI_DATA = {
  "dados": [
    {
      "Ativo": "AUAU3",
      "Ver": "v26",
      "Grupo": "◉ Custódia ativa",
      "Realizado": -172.0,
      "Em_aberto": -1750.0,
      "PM_Base": 1.78,
      "PM_Ajust": 3.43,
      "Custodia": 400,
      "Capital_Result": 711.22,
      "Proventos": -487.57,
      "Pct_Premio": -0.028
    },
    {
      "Ativo": "AXIA3",
      "Ver": "v31",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 7571.0,
      "Em_aberto": 0.0,
      "PM_Base": 91.64,
      "PM_Ajust": 117.29,
      "Custodia": 100,
      "Capital_Result": 9164.29,
      "Proventos": 310.59,
      "Pct_Premio": 0.751
    },
    {
      "Ativo": "B3SA3",
      "Ver": "v25",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 1957.0,
      "Em_aberto": -340.0,
      "PM_Base": 13.61,
      "PM_Ajust": 0.98,
      "Custodia": 160,
      "Capital_Result": 2176.96,
      "Proventos": 63.66,
      "Pct_Premio": 0.255
    },
    {
      "Ativo": "BBAS3",
      "Ver": "v27",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 26455.0,
      "Em_aberto": 14087.0,
      "PM_Base": 23.6,
      "PM_Ajust": 20.11,
      "Custodia": 10400,
      "Capital_Result": 245444.89,
      "Proventos": 9887.78,
      "Pct_Premio": 0.132
    },
    {
      "Ativo": "BBSE3",
      "Ver": "v26",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 3093.0,
      "Em_aberto": 2960.0,
      "PM_Base": 34.39,
      "PM_Ajust": 33.27,
      "Custodia": 5350,
      "Capital_Result": 183997.89,
      "Proventos": 2873.9,
      "Pct_Premio": 0.153
    },
    {
      "Ativo": "BEEF3",
      "Ver": "v28",
      "Grupo": "◉ Custódia ativa",
      "Realizado": -1235.0,
      "Em_aberto": 2380.0,
      "PM_Base": 5.84,
      "PM_Ajust": 6.24,
      "Custodia": 2200,
      "Capital_Result": 12846.4,
      "Proventos": 361.6,
      "Pct_Premio": -0.113
    },
    {
      "Ativo": "BPAC11 ◆",
      "Ver": "v28",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 1265.0,
      "Em_aberto": 0.0,
      "PM_Base": -60.41,
      "PM_Ajust": -313.41,
      "Custodia": 5,
      "Capital_Result": -302.05,
      "Proventos": 0.0,
      "Pct_Premio": 0.342
    },
    {
      "Ativo": "CMIG4",
      "Ver": "v30",
      "Grupo": "◉ Custódia ativa",
      "Realizado": -149.0,
      "Em_aberto": 130.0,
      "PM_Base": 11.25,
      "PM_Ajust": 15.21,
      "Custodia": 30,
      "Capital_Result": 337.42,
      "Proventos": 30.12,
      "Pct_Premio": -0.153
    },
    {
      "Ativo": "CPLE3",
      "Ver": "v30",
      "Grupo": "◉ Custódia ativa",
      "Realizado": -100.0,
      "Em_aberto": 81.0,
      "PM_Base": 5.32,
      "PM_Ajust": 5.7,
      "Custodia": 95,
      "Capital_Result": 505.8,
      "Proventos": 63.65,
      "Pct_Premio": -0.578
    },
    {
      "Ativo": "CSMG3",
      "Ver": "v30",
      "Grupo": "◉ Custódia ativa",
      "Realizado": -36359.0,
      "Em_aberto": 29066.0,
      "PM_Base": 53.58,
      "PM_Ajust": 79.18,
      "Custodia": 1390,
      "Capital_Result": 74480.0,
      "Proventos": 781.46,
      "Pct_Premio": -0.43
    },
    {
      "Ativo": "CSNA3",
      "Ver": "v31",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 2197.0,
      "Em_aberto": 0.0,
      "PM_Base": 11.46,
      "PM_Ajust": 10.92,
      "Custodia": 14400,
      "Capital_Result": 165069.21,
      "Proventos": 5572.83,
      "Pct_Premio": 0.052
    },
    {
      "Ativo": "CXSE3",
      "Ver": "v31",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 612.0,
      "Em_aberto": 130.0,
      "PM_Base": 17.57,
      "PM_Ajust": 16.95,
      "Custodia": 2190,
      "Capital_Result": 38477.58,
      "Proventos": 753.33,
      "Pct_Premio": 0.233
    },
    {
      "Ativo": "EGIE3",
      "Ver": "v31",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 2574.0,
      "Em_aberto": 809.0,
      "PM_Base": 29.64,
      "PM_Ajust": 25.94,
      "Custodia": 1030,
      "Capital_Result": 30532.7,
      "Proventos": 1237.93,
      "Pct_Premio": 0.278
    },
    {
      "Ativo": "GGBR4",
      "Ver": "v32",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 126.0,
      "Em_aberto": 0.0,
      "PM_Base": 19.47,
      "PM_Ajust": 16.02,
      "Custodia": 50,
      "Capital_Result": 973.5,
      "Proventos": 46.54,
      "Pct_Premio": 0.15
    },
    {
      "Ativo": "HYPE3 ◆",
      "Ver": "v32",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 155.0,
      "Em_aberto": -1070.0,
      "PM_Base": -30.31,
      "PM_Ajust": -29.65,
      "Custodia": 31,
      "Capital_Result": -939.47,
      "Proventos": -175.48,
      "Pct_Premio": 0.434
    },
    {
      "Ativo": "ITSA4",
      "Ver": "v32",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 900.0,
      "Em_aberto": 0.0,
      "PM_Base": 12.33,
      "PM_Ajust": 11.55,
      "Custodia": 2000,
      "Capital_Result": 24667.57,
      "Proventos": 651.19,
      "Pct_Premio": 0.275
    },
    {
      "Ativo": "JBSS3 ◆",
      "Ver": "v32",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 11363.4,
      "Em_aberto": 222.0,
      "PM_Base": 26.33,
      "PM_Ajust": -96.91,
      "Custodia": 100,
      "Capital_Result": 2632.55,
      "Proventos": 960.79,
      "Pct_Premio": 0.135
    },
    {
      "Ativo": "LJQQ3",
      "Ver": "v32",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 42.0,
      "Em_aberto": 0.0,
      "PM_Base": 3.73,
      "PM_Ajust": 3.6,
      "Custodia": 1200,
      "Capital_Result": 4480.89,
      "Proventos": 118.8,
      "Pct_Premio": 0.24
    },
    {
      "Ativo": "LREN3",
      "Ver": "v32",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 1318.5,
      "Em_aberto": 2564.0,
      "PM_Base": 13.72,
      "PM_Ajust": 12.2,
      "Custodia": 300,
      "Capital_Result": 4115.55,
      "Proventos": -863.17,
      "Pct_Premio": 0.115
    },
    {
      "Ativo": "MDIA3",
      "Ver": "v33",
      "Grupo": "◉ Custódia ativa",
      "Realizado": -1091.0,
      "Em_aberto": -280.0,
      "PM_Base": 15.93,
      "PM_Ajust": 26.94,
      "Custodia": 100,
      "Capital_Result": 1592.7,
      "Proventos": -9.68,
      "Pct_Premio": -0.87
    },
    {
      "Ativo": "PETR4",
      "Ver": "v33",
      "Grupo": "◉ Custódia ativa",
      "Realizado": -10818.0,
      "Em_aberto": 13680.0,
      "PM_Base": 32.62,
      "PM_Ajust": 44.95,
      "Custodia": 600,
      "Capital_Result": 19574.83,
      "Proventos": 3418.5,
      "Pct_Premio": -0.249
    },
    {
      "Ativo": "RADL3",
      "Ver": "v33",
      "Grupo": "◉ Custódia ativa",
      "Realizado": -1402.0,
      "Em_aberto": 110.0,
      "PM_Base": -12.5,
      "PM_Ajust": 1.03,
      "Custodia": 100,
      "Capital_Result": -1250.46,
      "Proventos": 49.21,
      "Pct_Premio": -0.156
    },
    {
      "Ativo": "SAPR11",
      "Ver": "v34",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 3770.0,
      "Em_aberto": 545.0,
      "PM_Base": 30.49,
      "PM_Ajust": 22.94,
      "Custodia": 500,
      "Capital_Result": 15246.88,
      "Proventos": 5.23,
      "Pct_Premio": 0.797
    },
    {
      "Ativo": "SAUD3",
      "Ver": "v33",
      "Grupo": "◉ Custódia ativa",
      "Realizado": -587.0,
      "Em_aberto": 4342.0,
      "PM_Base": 11.99,
      "PM_Ajust": 12.24,
      "Custodia": 2000,
      "Capital_Result": 23989.68,
      "Proventos": 81.22,
      "Pct_Premio": -0.041
    },
    {
      "Ativo": "SBSP3 ◆",
      "Ver": "v33",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 20372.0,
      "Em_aberto": 650.0,
      "PM_Base": 24.68,
      "PM_Ajust": -994.1,
      "Custodia": 20,
      "Capital_Result": 493.53,
      "Proventos": 3.67,
      "Pct_Premio": 0.238
    },
    {
      "Ativo": "SUZB3",
      "Ver": "v33",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 2321.0,
      "Em_aberto": 86.0,
      "PM_Base": 48.67,
      "PM_Ajust": 36.3,
      "Custodia": 200,
      "Capital_Result": 9734.98,
      "Proventos": 152.68,
      "Pct_Premio": 0.177
    },
    {
      "Ativo": "TOTS3",
      "Ver": "v33",
      "Grupo": "◉ Custódia ativa",
      "Realizado": -1271.0,
      "Em_aberto": 3000.0,
      "PM_Base": 38.56,
      "PM_Ajust": 59.59,
      "Custodia": 60,
      "Capital_Result": 2313.77,
      "Proventos": 9.01,
      "Pct_Premio": -0.138
    },
    {
      "Ativo": "UGPA3 ◆",
      "Ver": "v33",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 3956.0,
      "Em_aberto": -290.0,
      "PM_Base": 22.83,
      "PM_Ajust": -5.64,
      "Custodia": 150,
      "Capital_Result": 3425.17,
      "Proventos": 314.03,
      "Pct_Premio": 0.395
    },
    {
      "Ativo": "VALE3",
      "Ver": "v33",
      "Grupo": "◉ Custódia ativa",
      "Realizado": -8785.0,
      "Em_aberto": 4914.0,
      "PM_Base": 46.22,
      "PM_Ajust": 45.26,
      "Custodia": 1100,
      "Capital_Result": 50840.81,
      "Proventos": 9836.31,
      "Pct_Premio": -0.325
    },
    {
      "Ativo": "VIVA3",
      "Ver": "v33",
      "Grupo": "◉ Custódia ativa",
      "Realizado": -188.0,
      "Em_aberto": 3749.0,
      "PM_Base": 25.68,
      "PM_Ajust": 25.94,
      "Custodia": 600,
      "Capital_Result": 15405.3,
      "Proventos": 31.02,
      "Pct_Premio": -0.021
    },
    {
      "Ativo": "VIVT3",
      "Ver": "v34",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 3302.0,
      "Em_aberto": 0.0,
      "PM_Base": 44.76,
      "PM_Ajust": 9.38,
      "Custodia": 100,
      "Capital_Result": 4476.21,
      "Proventos": 235.91,
      "Pct_Premio": 0.246
    },
    {
      "Ativo": "WEGE3",
      "Ver": "v33",
      "Grupo": "◉ Custódia ativa",
      "Realizado": 3886.0,
      "Em_aberto": 5193.0,
      "PM_Base": 44.23,
      "PM_Ajust": 41.37,
      "Custodia": 1500,
      "Capital_Result": 66345.1,
      "Proventos": 400.58,
      "Pct_Premio": 0.057
    },
    {
      "Ativo": "ABEV3",
      "Ver": "v26",
      "Grupo": "▼ Posição short",
      "Realizado": -4250.0,
      "Em_aberto": 6977.0,
      "PM_Base": 15.57,
      "PM_Ajust": 13.22,
      "Custodia": -2000,
      "Capital_Result": -31135.35,
      "Proventos": -449.09,
      "Pct_Premio": -0.181
    },
    {
      "Ativo": "ALPA4",
      "Ver": "v33",
      "Grupo": "▼ Posição short",
      "Realizado": -53.0,
      "Em_aberto": 0.0,
      "PM_Base": 11.33,
      "PM_Ajust": 10.43,
      "Custodia": -4000,
      "Capital_Result": -45308.45,
      "Proventos": -3560.84,
      "Pct_Premio": -0.048
    },
    {
      "Ativo": "ALPK3",
      "Ver": "v33",
      "Grupo": "▼ Posição short",
      "Realizado": 0.0,
      "Em_aberto": 0.0,
      "PM_Base": 3.81,
      "PM_Ajust": 3.81,
      "Custodia": -7000,
      "Capital_Result": -26683.0,
      "Proventos": 0.0,
      "Pct_Premio": 0.0
    },
    {
      "Ativo": "BBDC4",
      "Ver": "v25",
      "Grupo": "▼ Posição short",
      "Realizado": 273.0,
      "Em_aberto": 0.0,
      "PM_Base": 16.66,
      "PM_Ajust": 16.93,
      "Custodia": -600,
      "Capital_Result": -9995.5,
      "Proventos": -112.56,
      "Pct_Premio": 0.077
    },
    {
      "Ativo": "BOVA11",
      "Ver": "v32",
      "Grupo": "▼ Posição short",
      "Realizado": -20015.11,
      "Em_aberto": 19741.2,
      "PM_Base": 168.85,
      "PM_Ajust": 122.3,
      "Custodia": -430,
      "Capital_Result": -72604.28,
      "Proventos": 0.0,
      "Pct_Premio": -0.112
    },
    {
      "Ativo": "BRKM5",
      "Ver": "v30",
      "Grupo": "▼ Posição short",
      "Realizado": -1054.0,
      "Em_aberto": -147.0,
      "PM_Base": 7.43,
      "PM_Ajust": 5.32,
      "Custodia": -500,
      "Capital_Result": -3716.73,
      "Proventos": 0.0,
      "Pct_Premio": -0.062
    },
    {
      "Ativo": "EMBJ3",
      "Ver": "v31",
      "Grupo": "▼ Posição short",
      "Realizado": -110615.0,
      "Em_aberto": 119163.0,
      "PM_Base": 64.66,
      "PM_Ajust": 37.68,
      "Custodia": -4200,
      "Capital_Result": -271575.85,
      "Proventos": -2683.63,
      "Pct_Premio": -0.137
    },
    {
      "Ativo": "LEVE3",
      "Ver": "v33",
      "Grupo": "▼ Posição short",
      "Realizado": 0.0,
      "Em_aberto": 0.0,
      "PM_Base": 29.72,
      "PM_Ajust": 26.63,
      "Custodia": -1200,
      "Capital_Result": -35664.84,
      "Proventos": -3702.71,
      "Pct_Premio": 0.0
    },
    {
      "Ativo": "MBRF3",
      "Ver": "v31",
      "Grupo": "▼ Posição short",
      "Realizado": 15513.8,
      "Em_aberto": -150.0,
      "PM_Base": 24.73,
      "PM_Ajust": 31.47,
      "Custodia": -1500,
      "Capital_Result": -37101.9,
      "Proventos": -5400.44,
      "Pct_Premio": 0.102
    },
    {
      "Ativo": "NEOE3",
      "Ver": "v33",
      "Grupo": "▼ Posição short",
      "Realizado": 811.0,
      "Em_aberto": 0.0,
      "PM_Base": 0.0,
      "PM_Ajust": 0.0,
      "Custodia": 0,
      "Capital_Result": -2905.24,
      "Proventos": -836.52,
      "Pct_Premio": 0.272
    },
    {
      "Ativo": "PRIO3",
      "Ver": "v33",
      "Grupo": "▼ Posição short",
      "Realizado": 3567.0,
      "Em_aberto": 0.0,
      "PM_Base": 88.21,
      "PM_Ajust": 211.31,
      "Custodia": -29,
      "Capital_Result": -2558.17,
      "Proventos": 2.84,
      "Pct_Premio": 0.29
    },
    {
      "Ativo": "ALOS3",
      "Ver": "v26",
      "Grupo": "⊘ Posição zerada",
      "Realizado": 1950.0,
      "Em_aberto": 214.0,
      "PM_Base": 0.0,
      "PM_Ajust": 0.0,
      "Custodia": 0,
      "Capital_Result": 80.96,
      "Proventos": 55.79,
      "Pct_Premio": 0.47
    },
    {
      "Ativo": "ASAI3",
      "Ver": "v25",
      "Grupo": "⊘ Posição zerada",
      "Realizado": 44.0,
      "Em_aberto": 0.0,
      "PM_Base": 0.0,
      "PM_Ajust": 0.0,
      "Custodia": 0,
      "Capital_Result": -30.39,
      "Proventos": 0.0,
      "Pct_Premio": 0.052
    },
    {
      "Ativo": "BRAV3",
      "Ver": "v27",
      "Grupo": "⊘ Posição zerada",
      "Realizado": 68.0,
      "Em_aberto": 3830.0,
      "PM_Base": 0.0,
      "PM_Ajust": 0.0,
      "Custodia": 0,
      "Capital_Result": 0.0,
      "Proventos": 0.0,
      "Pct_Premio": 0.091
    },
    {
      "Ativo": "BRFS3",
      "Ver": "v29",
      "Grupo": "⊘ Posição zerada",
      "Realizado": 6103.0,
      "Em_aberto": 1610.0,
      "PM_Base": 0.0,
      "PM_Ajust": 0.0,
      "Custodia": 0,
      "Capital_Result": 6321.18,
      "Proventos": -619.84,
      "Pct_Premio": 0.134
    },
    {
      "Ativo": "COGN3",
      "Ver": "v30",
      "Grupo": "⊘ Posição zerada",
      "Realizado": -654.0,
      "Em_aberto": 0.0,
      "PM_Base": 0.0,
      "PM_Ajust": 0.0,
      "Custodia": 0,
      "Capital_Result": 2923.52,
      "Proventos": 203.55,
      "Pct_Premio": -0.274
    },
    {
      "Ativo": "CVCB3",
      "Ver": "v31",
      "Grupo": "⊘ Posição zerada",
      "Realizado": 0.0,
      "Em_aberto": -390.0,
      "PM_Base": 0.0,
      "PM_Ajust": 0.0,
      "Custodia": 0,
      "Capital_Result": 666.0,
      "Proventos": 0.0,
      "Pct_Premio": 0.0
    },
    {
      "Ativo": "ENEV3",
      "Ver": "v31",
      "Grupo": "⊘ Posição zerada",
      "Realizado": -1478.0,
      "Em_aberto": 3740.0,
      "PM_Base": 0.0,
      "PM_Ajust": 0.0,
      "Custodia": 0,
      "Capital_Result": 2490.28,
      "Proventos": 0.0,
      "Pct_Premio": -0.093
    },
    {
      "Ativo": "FLRY3",
      "Ver": "v31",
      "Grupo": "⊘ Posição zerada",
      "Realizado": 596.0,
      "Em_aberto": 2170.0,
      "PM_Base": 0.0,
      "PM_Ajust": 0.0,
      "Custodia": 0,
      "Capital_Result": 211.15,
      "Proventos": 431.88,
      "Pct_Premio": 0.088
    },
    {
      "Ativo": "GMAT3",
      "Ver": "v32",
      "Grupo": "⊘ Posição zerada",
      "Realizado": -300.0,
      "Em_aberto": 0.0,
      "PM_Base": 0.0,
      "PM_Ajust": 0.0,
      "Custodia": 0,
      "Capital_Result": -148.34,
      "Proventos": 1.04,
      "Pct_Premio": 0.0
    },
    {
      "Ativo": "INTB3",
      "Ver": "v32",
      "Grupo": "⊘ Posição zerada",
      "Realizado": 0.0,
      "Em_aberto": 0.0,
      "PM_Base": 0.0,
      "PM_Ajust": 0.0,
      "Custodia": 0,
      "Capital_Result": 243.08,
      "Proventos": 97.31,
      "Pct_Premio": 0.0
    },
    {
      "Ativo": "ITUB4",
      "Ver": "v32",
      "Grupo": "⊘ Posição zerada",
      "Realizado": 1401.0,
      "Em_aberto": 0.0,
      "PM_Base": 0.0,
      "PM_Ajust": 0.0,
      "Custodia": 0,
      "Capital_Result": 0.0,
      "Proventos": 0.0,
      "Pct_Premio": 0.348
    },
    {
      "Ativo": "MRFG3",
      "Ver": "v29",
      "Grupo": "⊘ Posição zerada",
      "Realizado": 3518.0,
      "Em_aberto": 3985.0,
      "PM_Base": 0.0,
      "PM_Ajust": 0.0,
      "Custodia": 0,
      "Capital_Result": 0.0,
      "Proventos": 0.0,
      "Pct_Premio": 0.052
    },
    {
      "Ativo": "RAIL3",
      "Ver": "v33",
      "Grupo": "⊘ Posição zerada",
      "Realizado": 42.0,
      "Em_aberto": 0.0,
      "PM_Base": 0.0,
      "PM_Ajust": 0.0,
      "Custodia": 0,
      "Capital_Result": -1289.24,
      "Proventos": 180.57,
      "Pct_Premio": 1.0
    },
    {
      "Ativo": "RANI3",
      "Ver": "v33",
      "Grupo": "⊘ Posição zerada",
      "Realizado": 140.0,
      "Em_aberto": 0.0,
      "PM_Base": 0.0,
      "PM_Ajust": 0.0,
      "Custodia": 0,
      "Capital_Result": -406.64,
      "Proventos": 216.15,
      "Pct_Premio": 1.0
    },
    {
      "Ativo": "VULC3",
      "Ver": "v34",
      "Grupo": "⊘ Posição zerada",
      "Realizado": -115.0,
      "Em_aberto": 0.0,
      "PM_Base": 0.0,
      "PM_Ajust": 0.0,
      "Custodia": 0,
      "Capital_Result": -1105.92,
      "Proventos": 1101.21,
      "Pct_Premio": -0.371
    }
  ],
  "proventos": [
    {
      "ano": "2023",
      "jan": 0.0,
      "fev": 0.0,
      "mar": 0.0,
      "abr": 0.0,
      "mai": 0.0,
      "jun": 0.0,
      "jul": 0.0,
      "ago": 0.0,
      "set": 0.0,
      "out": 0.0,
      "nov": 98.46,
      "dez": 186.75,
      "anual": 285.21,
      "media_mensal": 23.7675,
      "acum_corrido": 285.21
    },
    {
      "ano": "2024",
      "jan": 12.72,
      "fev": 285.9,
      "mar": 650.24,
      "abr": -58.61,
      "mai": 1008.27,
      "jun": 119.92,
      "jul": 52.69,
      "ago": 321.91,
      "set": 654.3,
      "out": 336.37,
      "nov": 4271.79,
      "dez": -545.76,
      "anual": 7109.74,
      "media_mensal": 592.478333333333,
      "acum_corrido": 7394.95
    },
    {
      "ano": "2025",
      "jan": 243.49,
      "fev": 213.59,
      "mar": 4365.97,
      "abr": 109.9,
      "mai": 76.22,
      "jun": 2250.71,
      "jul": -253.63,
      "ago": 1010.0,
      "set": -1473.09,
      "out": -358.66,
      "nov": 219.26,
      "dez": -413.68,
      "anual": 5990.08,
      "media_mensal": 499.173333333333,
      "acum_corrido": 13385.03
    },
    {
      "ano": "2026",
      "jan": 975.09,
      "fev": -523.58,
      "mar": 8152.3,
      "abr": -18.79,
      "mai": -2118.82,
      "jun": 1729.26,
      "jul": 14.49,
      "ago": 2025.81,
      "set": 201.24,
      "out": -113.34,
      "nov": 2.77,
      "dez": 33.19,
      "anual": 10359.62,
      "media_mensal": 863.301666666667,
      "acum_corrido": 23744.65
    },
    {
      "ano": "2027",
      "jan": 0.0,
      "fev": 0.0,
      "mar": 95.82,
      "abr": 36.8,
      "mai": -973.54,
      "jun": 4.53,
      "jul": 0.0,
      "ago": 293.11,
      "set": 9.12,
      "out": 0.0,
      "nov": 2.77,
      "dez": 4.53,
      "anual": -526.86,
      "media_mensal": -43.905,
      "acum_corrido": 23217.79
    },
    {
      "ano": "2028",
      "jan": 0.0,
      "fev": 0.0,
      "mar": 0.0,
      "abr": 0.0,
      "mai": 0.0,
      "jun": 0.0,
      "jul": 0.0,
      "ago": 293.11,
      "set": 0.0,
      "out": 0.0,
      "nov": 2.77,
      "dez": 51.99,
      "anual": 347.87,
      "media_mensal": 28.9891666666667,
      "acum_corrido": 23565.66
    },
    {
      "ano": "MÉDIA",
      "jan": 205.216666666667,
      "fev": -4.01500000000001,
      "mar": 2210.72166666667,
      "abr": 11.55,
      "mai": -334.645,
      "jun": 684.07,
      "jul": -31.075,
      "ago": 657.323333333333,
      "set": -101.405,
      "out": -22.605,
      "nov": 766.303333333333,
      "dez": -113.83,
      "anual": 3927.61,
      "media_mensal": 327.300833333333,
      "acum_corrido": 0
    }
  ]
};

let currentOciPage = 1;
const ociPageSize = 10;
let filteredOciData = [...OCI_DATA.dados];

function initOciTab() {
  renderProventosTable();
  filterOciTable();
}

function renderProventosTable() {
  const tbody = document.getElementById('tableBodyProventos');
  if (!tbody) return;
  
  let html = '';
  OCI_DATA.proventos.forEach(row => {
    const isMedia = row.ano === 'MÉDIA';
    const rowStyle = isMedia ? 'background: rgba(37, 99, 235, 0.12); font-weight: 800; border-top: 2px solid var(--border-color);' : '';
    const labelStyle = isMedia ? 'font-weight: 800; color: var(--navy-primary);' : 'font-weight: 700; color: var(--text-title);';
    
    html += `
      <tr style="${rowStyle}">
        <td style="${labelStyle}">${row.ano}</td>
        <td style="text-align: right; color: ${row.jan < 0 ? 'var(--danger)' : 'var(--text-title)'};">${row.jan !== 0 ? 'R$ ' + row.jan.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}</td>
        <td style="text-align: right; color: ${row.fev < 0 ? 'var(--danger)' : 'var(--text-title)'};">${row.fev !== 0 ? 'R$ ' + row.fev.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}</td>
        <td style="text-align: right; color: ${row.mar < 0 ? 'var(--danger)' : 'var(--text-title)'};">${row.mar !== 0 ? 'R$ ' + row.mar.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}</td>
        <td style="text-align: right; color: ${row.abr < 0 ? 'var(--danger)' : 'var(--text-title)'};">${row.abr !== 0 ? 'R$ ' + row.abr.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}</td>
        <td style="text-align: right; color: ${row.mai < 0 ? 'var(--danger)' : 'var(--text-title)'};">${row.mai !== 0 ? 'R$ ' + row.mai.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}</td>
        <td style="text-align: right; color: ${row.jun < 0 ? 'var(--danger)' : 'var(--text-title)'};">${row.jun !== 0 ? 'R$ ' + row.jun.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}</td>
        <td style="text-align: right; color: ${row.jul < 0 ? 'var(--danger)' : 'var(--text-title)'};">${row.jul !== 0 ? 'R$ ' + row.jul.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}</td>
        <td style="text-align: right; color: ${row.ago < 0 ? 'var(--danger)' : 'var(--text-title)'};">${row.ago !== 0 ? 'R$ ' + row.ago.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}</td>
        <td style="text-align: right; color: ${row.set < 0 ? 'var(--danger)' : 'var(--text-title)'};">${row.set !== 0 ? 'R$ ' + row.set.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}</td>
        <td style="text-align: right; color: ${row.out < 0 ? 'var(--danger)' : 'var(--text-title)'};">${row.out !== 0 ? 'R$ ' + row.out.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}</td>
        <td style="text-align: right; color: ${row.nov < 0 ? 'var(--danger)' : 'var(--text-title)'};">${row.nov !== 0 ? 'R$ ' + row.nov.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}</td>
        <td style="text-align: right; color: ${row.dez < 0 ? 'var(--danger)' : 'var(--text-title)'};">${row.dez !== 0 ? 'R$ ' + row.dez.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}</td>
        <td style="text-align: right; font-weight: 800; background: rgba(0,0,0,0.03); color: ${row.anual < 0 ? 'var(--danger)' : 'var(--text-title)'};">R$ ${row.anual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: right; background: rgba(0,0,0,0.03); color: ${row.media_mensal < 0 ? 'var(--danger)' : 'var(--text-title)'};">R$ ${row.media_mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: right; background: rgba(0,0,0,0.03);">${row.acum_corrido !== 0 ? 'R$ ' + row.acum_corrido.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'}</td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

function filterOciTable() {
  const searchInput = document.getElementById('searchOci');
  const groupSelect = document.getElementById('filterOciGrupo');
  
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const groupFilter = groupSelect ? groupSelect.value : 'ALL';
  
  filteredOciData = OCI_DATA.dados.filter(item => {
    const matchesQuery = item.Ativo.toLowerCase().includes(query) || item.Grupo.toLowerCase().includes(query);
    let matchesGroup = true;
    if (groupFilter === 'CUSTODIA') {
      matchesGroup = item.Grupo.includes('Custódia');
    } else if (groupFilter === 'SHORT') {
      matchesGroup = item.Grupo.includes('short');
    } else if (groupFilter === 'ZERADA') {
      matchesGroup = item.Grupo.includes('zerada');
    }
    return matchesQuery && matchesGroup;
  });
  
  currentOciPage = 1;
  renderOciTablePage();
}

function renderOciTablePage() {
  const tbody = document.getElementById('tableBodyOcis');
  if (!tbody) return;
  
  const totalItems = filteredOciData.length;
  const totalPages = Math.ceil(totalItems / ociPageSize) || 1;
  
  if (currentOciPage > totalPages) currentOciPage = totalPages;
  if (currentOciPage < 1) currentOciPage = 1;
  
  const startIndex = (currentOciPage - 1) * ociPageSize;
  const endIndex = Math.min(startIndex + ociPageSize, totalItems);
  
  const pageItems = filteredOciData.slice(startIndex, endIndex);
  
  let html = '';
  if (pageItems.length === 0) {
    html = `<tr><td colspan="11" style="text-align: center; color: var(--text-muted); padding: 2rem;">Nenhum ativo encontrado.</td></tr>`;
  } else {
    pageItems.forEach(item => {
      let badgeStyle = 'background: rgba(37, 99, 235, 0.1); color: var(--blue-vibrant);';
      if (item.Grupo.includes('short')) {
        badgeStyle = 'background: rgba(245, 158, 11, 0.1); color: var(--warning);';
      } else if (item.Grupo.includes('zerada')) {
        badgeStyle = 'background: rgba(100, 116, 139, 0.1); color: var(--text-muted);';
      }
      
      const realStr = item.Realizado !== 0 ? 'R$ ' + item.Realizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-';
      const openStr = item.Em_aberto !== 0 ? 'R$ ' + item.Em_aberto.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-';
      const capStr = item.Capital_Result !== 0 ? 'R$ ' + item.Capital_Result.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-';
      const provStr = item.Proventos !== 0 ? 'R$ ' + item.Proventos.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-';
      
      html += `
        <tr>
          <td class="font-bold" style="color: var(--navy-primary);">${item.Ativo}</td>
          <td>${item.Ver}</td>
          <td><span class="badge-sus" style="${badgeStyle}">${item.Grupo}</span></td>
          <td style="text-align: right; color: ${item.Realizado < 0 ? 'var(--danger)' : 'inherit'};">${realStr}</td>
          <td style="text-align: right; color: ${item.Em_aberto < 0 ? 'var(--danger)' : 'inherit'};">${openStr}</td>
          <td style="text-align: right;">R$ ${item.PM_Base.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td style="text-align: right;">R$ ${item.PM_Ajust.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td style="text-align: right;">${item.Custodia.toLocaleString('pt-BR')}</td>
          <td style="text-align: right; color: ${item.Capital_Result < 0 ? 'var(--danger)' : 'inherit'};">${capStr}</td>
          <td style="text-align: right; color: ${item.Proventos < 0 ? 'var(--danger)' : 'inherit'};">${provStr}</td>
          <td style="text-align: right; font-weight: 700; color: ${item.Pct_Premio < 0 ? 'var(--danger)' : 'var(--success)'};">${(item.Pct_Premio * 100).toFixed(1)}%</td>
        </tr>
      `;
    });
  }
  
  tbody.innerHTML = html;
  
  const statsEl = document.getElementById('ociTableStats');
  if (statsEl) {
    statsEl.innerText = `Exibindo ${totalItems > 0 ? startIndex + 1 : 0} a ${endIndex} de ${totalItems} ativos`;
  }
  
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function prevOciPage() {
  if (currentOciPage > 1) {
    currentOciPage--;
    renderOciTablePage();
  }
}

function nextOciPage() {
  const totalPages = Math.ceil(filteredOciData.length / ociPageSize) || 1;
  if (currentOciPage < totalPages) {
    currentOciPage++;
    renderOciTablePage();
  }
}

window.initOciTab = initOciTab;
window.filterOciTable = filterOciTable;
window.prevOciPage = prevOciPage;
window.nextOciPage = nextOciPage;




/* ==========================================================================
   MÓDULO DINÂMICO: + ESPECIALISTAS
   ========================================================================== */

function renderEspecialistasTable() {
  const tbody = document.getElementById('tableBodyEspecialistas');
  if (!tbody) return;
  
  let html = '';
  let totalMeta = 0;
  let totalRealizado = 0;
  let totalCusto = 0;
  let sumCompliance = 0;
  
  ESPECIALISTAS.forEach((esp, idx) => {
    totalMeta += esp.meta;
    totalRealizado += esp.realizado;
    totalCusto += esp.custo;
    
    const compliance = esp.meta > 0 ? (esp.realizado / esp.meta) * 100 : 0;
    sumCompliance += compliance;
    
    let compColor = 'var(--danger)';
    if (compliance >= 95) compColor = 'var(--success)';
    else if (compliance >= 85) compColor = 'var(--warning)';
    
    html += `
      <tr>
        <td class="font-bold" style="color: var(--text-title);">${esp.nome}</td>
        <td><span class="badge-sus" style="background: rgba(37, 99, 235, 0.1); color: var(--blue-vibrant); font-weight: 700; font-size: 0.7rem; padding: 0.2rem 0.4rem; border-radius: 4px;">${esp.especialidade}</span></td>
        <td style="text-align: right; font-weight: 600;">${esp.meta.toLocaleString('pt-BR')}</td>
        <td style="text-align: right; font-weight: 600; color: var(--text-title);">${esp.realizado.toLocaleString('pt-BR')}</td>
        <td style="text-align: right; font-weight: 700; color: var(--blue-vibrant);">R$ ${esp.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: center; font-weight: 700; color: ${compColor};">${compliance.toFixed(1)}%</td>
        <td style="text-align: center;">
          <button onclick="removeSpecialist(${idx})" class="btn-icon" style="padding: 0.25rem; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: rgba(239, 68, 68, 0.1); color: var(--danger); border: none; border-radius: var(--radius-sm);" title="Remover Specialist">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
          </button>
        </td>
      </tr>
    `;
  });
  
  tbody.innerHTML = html;
  
  // Update header counters
  const totalCountEl = document.getElementById('espTotalCount');
  if (totalCountEl) totalCountEl.innerText = ESPECIALISTAS.length.toString();
  
  const totalMetaEl = document.getElementById('espTotalMeta');
  if (totalMetaEl) totalMetaEl.innerText = totalMeta.toLocaleString('pt-BR');
  
  const totalCustoEl = document.getElementById('espTotalCusto');
  if (totalCustoEl) totalCustoEl.innerText = 'R$ ' + totalCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  
  const avgComplianceEl = document.getElementById('espAvgCompliance');
  if (avgComplianceEl) {
    const avg = ESPECIALISTAS.length > 0 ? sumCompliance / ESPECIALISTAS.length : 0;
    avgComplianceEl.innerText = avg.toFixed(1) + '%';
  }
  
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function addSpecialist(event) {
  event.preventDefault();
  const nome = document.getElementById('espNome').value.trim();
  const especialidade = document.getElementById('espEspecialidade').value;
  const meta = parseInt(document.getElementById('espMeta').value) || 0;
  const realizado = parseInt(document.getElementById('espRealizado').value) || 0;
  const custo = parseFloat(document.getElementById('espCusto').value) || 0;
  
  ESPECIALISTAS.push({ nome, especialidade, meta, realizado, custo });
  document.getElementById('formAddSpecialist').reset();
  renderEspecialistasTable();
}

function removeSpecialist(idx) {
  if (confirm("Remover este profissional da escala de especialistas?")) {
    ESPECIALISTAS.splice(idx, 1);
    renderEspecialistasTable();
  }
}

/* ==========================================================================
   MÓDULO DINÂMICO: CRÉDITO FINANCEIRO
   ========================================================================== */

function renderCreditoTable() {
  const tbody = document.getElementById('tableBodyCredito');
  if (!tbody) return;
  
  let html = '';
  let totalSaldo = 0;
  let totalParcela = 0;
  let sumWeightedRate = 0;
  
  LINHAS_CREDITO.forEach((linha) => {
    totalSaldo += linha.saldoDevedor;
    totalParcela += linha.parcela;
    sumWeightedRate += (linha.saldoDevedor * linha.taxa);
    
    html += `
      <tr>
        <td class="font-bold" style="color: var(--text-title);">${linha.banco}</td>
        <td style="text-align: right; font-weight: 500;">R$ ${linha.original.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: right; font-weight: 700; color: var(--danger);">R$ ${linha.saldoDevedor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: center; font-weight: 600; color: var(--warning);">${linha.taxa.toFixed(2)}% a.m.</td>
        <td style="text-align: right; font-weight: 700; color: var(--blue-vibrant);">R$ ${linha.parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: center; font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">${linha.vcto}</td>
      </tr>
    `;
  });
  
  tbody.innerHTML = html;
  
  // Update header counters
  const totalSaldoEl = document.getElementById('credSaldoDevedor');
  if (totalSaldoEl) totalSaldoEl.innerText = 'R$ ' + totalSaldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  
  const totalParcelaEl = document.getElementById('credParcelaMensal');
  if (totalParcelaEl) totalParcelaEl.innerText = 'R$ ' + totalParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  
  const avgTaxaEl = document.getElementById('credTaxaMedia');
  if (avgTaxaEl) {
    const avgRate = totalSaldo > 0 ? sumWeightedRate / totalSaldo : 0;
    avgTaxaEl.innerText = avgRate.toFixed(2) + '% a.m.';
  }
}

function recalcCreditSimulation() {
  const pv = parseFloat(document.getElementById('simCredValor').value) || 0;
  const taxa = parseFloat(document.getElementById('simCredTaxa').value) || 0;
  const n = parseInt(document.getElementById('simCredPrazo').value) || 0;
  
  const simResParcela = document.getElementById('simResParcela');
  const simResJuros = document.getElementById('simResJuros');
  const simResCustoTotal = document.getElementById('simResCustoTotal');
  
  if (pv <= 0 || taxa <= 0 || n <= 0) {
    if (simResParcela) simResParcela.innerText = 'R$ 0,00';
    if (simResJuros) simResJuros.innerText = 'R$ 0,00';
    if (simResCustoTotal) simResCustoTotal.innerText = 'R$ 0,00';
    return;
  }
  
  const i = taxa / 100;
  // PMT = PV * (i * (1 + i)^n) / ((1 + i)^n - 1)
  const pmt = pv * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  const custoTotal = pmt * n;
  const totalJuros = custoTotal - pv;
  
  if (simResParcela) simResParcela.innerText = 'R$ ' + pmt.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  if (simResJuros) simResJuros.innerText = 'R$ ' + totalJuros.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  if (simResCustoTotal) simResCustoTotal.innerText = 'R$ ' + custoTotal.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

// Bind to window for inline HTML onclick/onsubmit calls
window.renderEspecialistasTable = renderEspecialistasTable;
window.addSpecialist = addSpecialist;
window.removeSpecialist = removeSpecialist;
window.renderCreditoTable = renderCreditoTable;
window.recalcCreditSimulation = recalcCreditSimulation;


/* ==========================================================================
   MÓDULO DINÂMICO: SRAG (SÍNDROME RESPIRATÓRIA AGUDA GRAVE)
   ========================================================================== */

function renderSragTable() {
  const tbody = document.getElementById('tableBodySrag');
  if (!tbody) return;
  
  let html = '';
  let countNotificados = CASOS_SRAG.length;
  let countInternados = 0;
  let sumDiarias = 0;
  
  CASOS_SRAG.forEach((caso, idx) => {
    const isInternado = caso.status === 'Internado';
    if (isInternado) {
      countInternados++;
      sumDiarias += caso.diaria;
    }
    
    let statusBg = 'rgba(100, 116, 139, 0.12)';
    let statusColor = 'var(--text-muted)';
    if (caso.status === 'Internado') {
      statusBg = 'rgba(239, 68, 68, 0.12)';
      statusColor = 'var(--danger)';
    } else if (caso.status === 'Alta Médica') {
      statusBg = 'rgba(16, 185, 129, 0.12)';
      statusColor = 'var(--success)';
    } else if (caso.status === 'Óbito') {
      statusBg = 'rgba(15, 23, 42, 0.2)';
      statusColor = 'var(--navy-primary)';
    }
    
    let unidadeColor = caso.unidade.includes('UTI') ? 'var(--danger)' : 'var(--blue-vibrant)';
    
    html += `
      <tr>
        <td class="font-bold" style="color: var(--text-title);">${caso.registro}</td>
        <td style="font-weight: 500;">${caso.entrada.split('-').reverse().join('/')}</td>
        <td><strong style="color: var(--text-title);">${caso.diagnostico}</strong></td>
        <td><span style="font-weight: 700; color: ${unidadeColor};">${caso.unidade}</span></td>
        <td style="text-align: right; font-weight: 700; color: var(--success);">R$ ${caso.diaria.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td style="text-align: center;">
          <span class="badge-sus" style="background: ${statusBg}; color: ${statusColor}; font-weight: 700; font-size: 0.7rem; padding: 0.2rem 0.4rem; border-radius: 4px;">${caso.status}</span>
        </td>
        <td style="text-align: center;">
          <button onclick="removeSragCase(${idx})" class="btn-icon" style="padding: 0.25rem; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: rgba(239, 68, 68, 0.1); color: var(--danger); border: none; border-radius: var(--radius-sm);" title="Remover Caso">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
          </button>
        </td>
      </tr>
    `;
  });
  
  tbody.innerHTML = html;
  
  // Update header counters
  const totalCasosEl = document.getElementById('sragTotalCasos');
  if (totalCasosEl) totalCasosEl.innerText = countNotificados.toString();
  
  const totalInternadosEl = document.getElementById('sragTotalInternados');
  if (totalInternadosEl) totalInternadosEl.innerText = countInternados.toString() + (countInternados === 1 ? ' paciente' : ' pacientes');
  
  const totalRepasseEl = document.getElementById('sragTotalRepasse');
  if (totalRepasseEl) totalRepasseEl.innerText = 'R$ ' + sumDiarias.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  
  const ocupacaoPctEl = document.getElementById('sragOcupacaoPct');
  if (ocupacaoPctEl) {
    // Exemplo: total de leitos de contingência = 16
    const totalLeitos = 16;
    const ocupacao = totalLeitos > 0 ? (countInternados / totalLeitos) * 100 : 0;
    ocupacaoPctEl.innerText = ocupacao.toFixed(1) + '%';
  }
  
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function addSragCase(event) {
  event.preventDefault();
  const registro = document.getElementById('sragReg').value.trim();
  const entrada = document.getElementById('sragEntrada').value;
  const diagnostico = document.getElementById('sragDiagnostico').value;
  const unidade = document.getElementById('sragUnidade').value;
  const diaria = parseFloat(document.getElementById('sragDiaria').value) || 0;
  const status = document.getElementById('sragStatus').value;
  
  CASOS_SRAG.push({ registro, entrada, diagnostico, unidade, diaria, status });
  document.getElementById('formAddSrag').reset();
  document.getElementById('sragDiaria').value = "1500"; // restore default
  renderSragTable();
}

function removeSragCase(idx) {
  if (confirm("Remover este registro de internação SRAG?")) {
    CASOS_SRAG.splice(idx, 1);
    renderSragTable();
  }
}

// Bind to window for inline HTML onclick/onsubmit calls
window.renderSragTable = renderSragTable;
window.addSragCase = addSragCase;
window.removeSragCase = removeSragCase;


/* ==========================================================================
   MÓDULO DINÂMICO: REUNIÃO DGAE
   ========================================================================== */

function renderDgaeTable() {
  const tbody = document.getElementById('tableBodyDgaeActions');
  if (!tbody) return;
  
  let html = '';
  if (DELIBERACOES_DGAE.length === 0) {
    html = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Nenhum encaminhamento registrado.</td></tr>`;
  } else {
    DELIBERACOES_DGAE.forEach((item, idx) => {
      html += `
        <tr>
          <td><strong style="color: var(--text-title);">${item.acao}</strong></td>
          <td><span class="badge-sus" style="background: rgba(37, 99, 235, 0.1); color: var(--blue-vibrant); font-size: 0.68rem; padding: 0.2rem 0.35rem; font-weight: 700;">${item.responsavel}</span></td>
          <td style="font-weight: 600; color: var(--text-main); font-size: 0.75rem;">${item.prazo}</td>
          <td style="text-align: center;">
            <button onclick="removeDgaeAction(${idx})" class="btn-icon" style="padding: 0.2rem; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: rgba(239, 68, 68, 0.1); color: var(--danger); border: none; border-radius: var(--radius-sm);" title="Remover Ação">
              <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
            </button>
          </td>
        </tr>
      `;
    });
  }
  
  tbody.innerHTML = html;
  
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function addDgaeAction(event) {
  event.preventDefault();
  const acao = document.getElementById('dgaeActionTexto').value.trim();
  const responsavel = document.getElementById('dgaeActionResponsavel').value;
  const prazo = document.getElementById('dgaeActionPrarea').value.trim();
  
  DELIBERACOES_DGAE.push({ acao, responsavel, prazo });
  document.getElementById('formAddDgaeAction').reset();
  renderDgaeTable();
}

function removeDgaeAction(idx) {
  if (confirm("Remover esta deliberação da comissão?")) {
    DELIBERACOES_DGAE.splice(idx, 1);
    renderDgaeTable();
  }
}

// Bind to window for inline HTML calls
window.renderDgaeTable = renderDgaeTable;
window.addDgaeAction = addDgaeAction;
window.removeDgaeAction = removeDgaeAction;


/* ==========================================================================
   MÓDULO DINÂMICO: PRÓ-HOSPITAIS (PPH/RS)
   ========================================================================== */

function calculatePphSim() {
  const icmsDevedorEl = document.getElementById('pphIcmsDevedor');
  const aporteEl = document.getElementById('pphAporte');
  
  if (!icmsDevedorEl || !aporteEl) return;
  
  const icmsDevedor = parseFloat(icmsDevedorEl.value) || 0;
  const aporte = parseFloat(aporteEl.value) || 0;
  
  // Limite legal de 5%
  const limiteCompensacao = icmsDevedor * 0.05;
  const valorCompensado = Math.min(aporte, limiteCompensacao);
  const icmsResidual = icmsDevedor - valorCompensado;
  
  // Render results
  document.getElementById('pphResultLimite').innerText = 'R$ ' + limiteCompensacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  document.getElementById('pphResultCompensado').innerText = 'R$ ' + valorCompensado.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  document.getElementById('pphResultResidual').innerText = 'R$ ' + icmsResidual.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  document.getElementById('pphResultDestinado').innerText = 'R$ ' + valorCompensado.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  
  // Warning display
  const warningEl = document.getElementById('pphSimWarning');
  if (warningEl) {
    if (aporte > limiteCompensacao) {
      warningEl.style.display = 'block';
    } else {
      warningEl.style.display = 'none';
    }
  }
}

function switchPphSubTab(tabName) {
  const contentLc = document.getElementById('pphContentLc');
  const contentPortaria = document.getElementById('pphContentPortaria');
  const btnLc = document.getElementById('btnSubTabLc');
  const btnPortaria = document.getElementById('btnSubTabPortaria');
  
  if (!contentLc || !contentPortaria || !btnLc || !btnPortaria) return;
  
  if (tabName === 'lc') {
    contentLc.style.display = 'block';
    contentPortaria.style.display = 'none';
    btnLc.classList.add('active');
    btnPortaria.classList.remove('active');
  } else {
    contentLc.style.display = 'none';
    contentPortaria.style.display = 'block';
    btnLc.classList.remove('active');
    btnPortaria.classList.add('active');
  }
}

// Bind to window for inline calls
window.calculatePphSim = calculatePphSim;
window.switchPphSubTab = switchPphSubTab;
