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

// Initialize Dashboard on DOM Content Loaded (Defensivo e Garantido)
function initApp() {
  // Search filter for SUS Gaúcho - Avançar table
  try {
    const inputSearchAvancar = document.getElementById('inputSearchAvancar');
    if (inputSearchAvancar) {
      inputSearchAvancar.addEventListener('input', function(e) {
        const q = e.target.value.toLowerCase().trim();
        const rows = document.querySelectorAll('#tab-sus-gaucho-avancar table.data-table tbody tr');
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(q) ? '' : 'none';
        });
      });
    }
  } catch (e) {
    console.warn('Erro ao inicializar busca do SUS Gaúcho - Avançar:', e);
  }

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
  try { populateTables(); } catch (e) { console.warn('populateTables error:', e); }
  try { if (typeof renderAssistirSidebar === 'function') renderAssistirSidebar(); } catch (e) { console.warn('renderAssistirSidebar error:', e); }
  try { runViabilitySimulation(); } catch (e) { console.warn(e); }
  try { renderAssistirAmbulatorio('cardiologia'); } catch (e) { console.warn(e); }
}

// initApp trigger moved to bottom to prevent TDZ error

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
    if (idToActivate === 'tab-pro-hospitais' && typeof window.initPphTab === 'function') {
      try {
        window.initPphTab();
      } catch (e) {
        console.warn('Alerta na renderizacao do Pró-Hospitais:', e);
      }
    }
    if (idToActivate === 'tab-relatorio' && typeof window.initOciTab === 'function') {
      try {
        window.initOciTab();
      } catch (e) {
        console.warn('Alerta na renderizacao do PMAE OCIs:', e);
      }
    }
    if (idToActivate === 'tab-especialistas' && typeof window.initPmaeCcTab === 'function') {
      try {
        window.initPmaeCcTab();
      } catch (e) {
        console.warn('Alerta na renderizacao do PMAE CC:', e);
      }
    }
    if (idToActivate === 'tab-credito' && typeof window.initCreditoTab === 'function') {
      try {
        window.initCreditoTab();
      } catch (e) {
        console.warn('Alerta na renderizacao do Crédito Financeiro:', e);
      }
    }
            if (idToActivate === 'tab-emendas' && typeof window.initEmendasTab === 'function') {
      try {
        window.initEmendasTab();
      } catch (e) {
        console.warn('Alerta na renderizacao de Emendas:', e);
      }
    }
        if (idToActivate === 'tab-sigtap' && typeof window.initSigtapTab === 'function') {
      try {
        window.initSigtapTab();
      } catch (e) {
        console.warn('Alerta na renderizacao do SIGTAP:', e);
      }
    }
    if (idToActivate === 'tab-cisa') {
      try {
        if (typeof renderCisaSidebar === 'function') renderCisaSidebar();
        if (typeof renderCisaServico === 'function') renderCisaServico(window.currentCisaKey || 'oftalmologia');
      } catch (e) {
        console.warn('Alerta na renderizacao do Consórcio CISA:', e);
      }
    }
    if (idToActivate === 'tab-prestacao-contas') {
      try {
        if (typeof renderPrestacaoSidebar === 'function') renderPrestacaoSidebar();
        if (typeof renderPrestacaoServico === 'function') renderPrestacaoServico(window.currentPrestacaoKey || 'oftalmologia');
      } catch (e) {
        console.warn('Alerta na renderizacao de Prestacao de Contas:', e);
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
window.initOverviewCharts = initOverviewCharts;

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
window.initOverviewCharts = initOverviewCharts;

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

  // Helpers to handle both original items and newly added items
  const getMensal = (item) => typeof item.mensal !== 'undefined' ? item.mensal : (item.valorParcela || 0);
  const getAnual = (item) => typeof item.anual !== 'undefined' ? item.anual : ((item.valorParcela || 0) * (item.numParcelas || 0));
  const getDesc = (item) => item.descricao || item.nome || '';

  // Calculate Totals
  const totalMensalGlobal = incList.reduce((acc, curr) => acc + getMensal(curr), 0);
  const totalAnualGlobal = incList.reduce((acc, curr) => acc + getAnual(curr), 0);

  const federalItems = incList.filter(i => i.esfera.toUpperCase() === 'FEDERAL');
  const estadualItems = incList.filter(i => i.esfera.toUpperCase() === 'ESTADUAL');
  const outrosItems = incList.filter(i => i.esfera.toUpperCase() !== 'FEDERAL' && i.esfera.toUpperCase() !== 'ESTADUAL');

  const subFedM = federalItems.reduce((a, c) => a + getMensal(c), 0);
  const subFedA = federalItems.reduce((a, c) => a + getAnual(c), 0);

  const subEstM = estadualItems.reduce((a, c) => a + getMensal(c), 0);
  const subEstA = estadualItems.reduce((a, c) => a + getAnual(c), 0);

  // Filter List
  const applyFilter = (list) => list.filter(item => 
    getDesc(item).toLowerCase().includes(filterQuery.toLowerCase()) ||
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
      const mVal = getMensal(item);
      const aVal = getAnual(item);
      const descText = getDesc(item);
      const pct = totalMensalGlobal > 0 ? ((mVal / totalMensalGlobal) * 100).toFixed(1) : '0.0';
      html += `
        <tr>
          <td><span class="badge-sus" style="background: rgba(37, 99, 235, 0.1); color: var(--blue-vibrant);">${item.esfera}</span></td>
          <td class="font-bold" style="color: var(--text-title); font-size: 0.85rem;">${descText}</td>
          <td style="text-align: right; font-weight: 700; color: var(--success);">R$ ${mVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td style="text-align: right; font-weight: 700; color: var(--blue-vibrant);">R$ ${aVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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
        <td style="text-align: center;">${totalMensalGlobal > 0 ? ((subFedM / totalMensalGlobal)*100).toFixed(1) : '0.0'}%</td>
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
      const mVal = getMensal(item);
      const aVal = getAnual(item);
      const descText = getDesc(item);
      const pct = totalMensalGlobal > 0 ? ((mVal / totalMensalGlobal) * 100).toFixed(1) : '0.0';
      const mText = mVal > 0 ? `R$ ${mVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-';
      html += `
        <tr>
          <td><span class="badge-sus" style="background: var(--success-bg); color: var(--success);">${item.esfera}</span></td>
          <td class="font-bold" style="color: var(--text-title); font-size: 0.85rem;">${descText}</td>
          <td style="text-align: right; font-weight: 700; color: var(--success);">${mText}</td>
          <td style="text-align: right; font-weight: 700; color: var(--blue-vibrant);">R$ ${aVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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
        <td style="text-align: center;">${totalMensalGlobal > 0 ? ((subEstM / totalMensalGlobal)*100).toFixed(1) : '0.0'}%</td>
        <td></td>
      </tr>
    `;
  }

  // 3. Outros / Novos Grupos
  if (fOutros.length > 0) {
    html += `
      <tr style="background: rgba(245, 158, 11, 0.06); font-weight: 800;">
        <td colspan="6" style="color: var(--warning); font-size: 0.88rem; padding: 0.6rem 1rem;">
          <i data-lucide="help-circle" style="width: 14px; height: 14px; display: inline; margin-right: 0.4rem;"></i>
          OUTROS REPASSES E CONVÊNIOS
        </td>
      </tr>
    `;
    fOutros.forEach((item) => {
      const globalIdx = incList.indexOf(item);
      const mVal = getMensal(item);
      const aVal = getAnual(item);
      const descText = getDesc(item);
      const pct = totalMensalGlobal > 0 ? ((mVal / totalMensalGlobal) * 100).toFixed(1) : '0.0';
      html += `
        <tr>
          <td><span class="badge-sus" style="background: var(--warning-bg); color: var(--warning);">${item.esfera}</span></td>
          <td class="font-bold" style="color: var(--text-title); font-size: 0.85rem;">${descText}</td>
          <td style="text-align: right; font-weight: 700; color: var(--success);">R$ ${mVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td style="text-align: right; font-weight: 700; color: var(--blue-vibrant);">R$ ${aVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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

  // 4. Linha de Total Geral
  html += `
    <tr style="background: var(--bg-card); font-weight: 900; font-size: 0.92rem; border-top: 2px solid var(--navy-primary); border-bottom: 2px double var(--navy-primary);">
      <td colspan="2" style="color: var(--navy-primary); text-transform: uppercase;">TOTAL GERAL INCENTIVOS CONTRATUALIZADOS</td>
      <td style="text-align: right; color: var(--success);">R$ ${totalMensalGlobal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
      <td style="text-align: right; color: var(--blue-vibrant);">R$ ${totalAnualGlobal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
      <td style="text-align: center;">100.0%</td>
      <td></td>
    </tr>
  `;

  tbody.innerHTML = html;
  
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
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




const BLOCOS_COMUNS = {
  "legislacao": [
    {
      "Camada": "Programa",
      "Norma": "Decreto nº 56.015/2021"
    },
    {
      "Camada": "Unidade monetária (UIH)",
      "Norma": "Decreto nº 56.016/2021, alt. Decretos nº 57.496/2024 e nº 58.115/2025"
    },
    {
      "Camada": "Regulamento",
      "Norma": "Portaria SES/RS nº 537/2021 — arts. 11 a 17, 18 a 22, 25 a 32, 36"
    },
    {
      "Camada": "Anexo técnico vigente",
      "Norma": "Portaria SES/RS nº 46/2026 — substitui integralmente os Anexos I e II"
    },
    {
      "Camada": "Fatores de cálculo",
      "Norma": "Portaria SES/RS nº 415, de 03/06/2026 — altera Tabelas 1 e 2. Anexos não obtidos"
    },
    {
      "Camada": "Habilitação e valores",
      "Norma": "Portaria SES/RS nº 419/2025 e alterações (491, 561, 602-604, 683, 839, 950, 1.109/2025)"
    },
    {
      "Camada": "Cadeia da 537/2021",
      "Norma": "638/2021 → 703/2021 → 882/2021 → 766/2023 → 104/2024 → 688/2024 → 318/2025 → 968/2025 → 35/2026 → 46/2026 → 415/2026"
    },
    {
      "Camada": "Correlatas",
      "Norma": "RDC ANVISA nº 50/2002 · LGPD nº 13.709/2018 · Portaria de Consolidação MS nº 02/2017 · Portaria SES nº 727/2015 (CAC)"
    }
  ],
  "financeiro": [
    {
      "Item": "Fórmula",
      "Conteúdo": "VITS anual = UIH × Peso × UR (art. 13 da Portaria 537/2021)"
    },
    {
      "Item": "UIH 2026",
      "Conteúdo": "R$ 1.140,72 — reajuste IPCA de 4,6% sobre R$ 1.094,11. `SUB_JUDICE`: a confirmar em decreto"
    },
    {
      "Item": "Natureza",
      "Conteúdo": "Incentivo estadual pré-fixado, fundo a fundo. Aditivo ao MAC federal, não substitutivo (art. 1º, § 2º)"
    },
    {
      "Item": "Marco inicial",
      "Conteúdo": "Competência subsequente à portaria de habilitação, condicionado a inclusão contratual e efetivo funcionamento (art. 12)"
    },
    {
      "Item": "Prazo de pagamento",
      "Conteúdo": "Até o último dia útil do mês subsequente à prestação (art. 36)"
    },
    {
      "Item": "Valor vinculante",
      "Conteúdo": "O publicado na portaria de habilitação do hospital (art. 11) — não o cálculo referencial"
    },
    {
      "Item": "Suplementar Diferencial",
      "Conteúdo": "Hospital público até 99 leitos +25% · acima de 100 leitos +30%. Vedada incidência de SD sobre SD (art. 15, par. único). `SUB_JUDICE`"
    },
    {
      "Item": "Vedação",
      "Conteúdo": "Ampliação do incentivo exige ato formal da SES; não decorre de mera ampliação de oferta (art. 16)"
    }
  ],
  "modelos": [
    {
      "Modelo": "CLINICO_CIRURGICO",
      "TS": "Item 2",
      "Peso": "840 por ambulatório (até 10 = 8.400)",
      "UR": "Dec. 56.015/2021, art. 7º § 3º III — fator unitário"
    },
    {
      "Modelo": "CLINICO",
      "TS": "Item 3",
      "Peso": "840 por ambulatório (até 10 = 8.400)",
      "UR": "Dec. 56.015/2021, art. 7º § 3º III — fator unitário"
    },
    {
      "Modelo": "PRIORITARIO",
      "TS": "Item 5",
      "Peso": "Oftalmologia 0,76 · Cirurgia Geral 1,90 · Urologia 2,00 · Traumato/Ortopedia 2,40",
      "UR": "Dec. 56.015/2021, art. 7º § 3º I — produção cirúrgica de média complexidade aprovada em 2023. SIA para Oftalmologia; SIH para as demais"
    }
  ],
  "vits": [
    {
      "Ambulatórios": "1",
      "Anual": "R$ 958.204,80",
      "Mensal": "R$ 79.850,40"
    },
    {
      "Ambulatórios": "2",
      "Anual": "R$ 1.916.409,60",
      "Mensal": "R$ 159.700,80"
    },
    {
      "Ambulatórios": "3",
      "Anual": "R$ 2.874.614,40",
      "Mensal": "R$ 239.551,20"
    },
    {
      "Ambulatórios": "5",
      "Anual": "R$ 4.791.024,00",
      "Mensal": "R$ 399.252,00"
    },
    {
      "Ambulatórios": "10",
      "Anual": "R$ 9.582.048,00",
      "Mensal": "R$ 798.504,00"
    }
  ],
  "sub_judice_aviso": "Peso, UR e percentuais de Suplementar Diferencial dependem das Tabelas 1 e 2, substituídas pela Portaria SES/RS nº 415/2026, cujos anexos não foram obtidos. Os valores são referenciais.",
  "piso_prioritarias": "Traumato Ortopedia e Urologia, que só existem como prioritárias, têm garantia de que a produção usada no cálculo não gere montante inferior ao valor do TS Ambulatório de Especialidade clínico/cirúrgico, quando não houver quantitativo mínimo de procedimentos aprovados no período-base.",
  "pontos_atencao": [
    {
      "Tema": "Teleconsulta",
      "Regra": "Complementar no atingimento da meta. Só casos eletivos, pacientes clinicamente estáveis e situações em que o exame físico não seja imprescindível, observada a LGPD"
    },
    {
      "Tema": "Exames",
      "Regra": "O rol de diagnósticos e tratamentos é piso. O serviço deve providenciar os demais procedimentos solicitados no atendimento"
    },
    {
      "Tema": "Procedimentos complementares",
      "Regra": "Se realizados, seus quantitativos computam no cumprimento de metas da habilitação"
    },
    {
      "Tema": "Integralidade",
      "Regra": "Acesso a todos os métodos diagnósticos, próprios ou terceirizados. Interconsulta em outras especialidades dentro do próprio hospital habilitado"
    },
    {
      "Tema": "Avaliação cardiológica",
      "Regra": "Deve ser fornecida pelo estabelecimento habilitado sempre que o especialista julgar necessário, em qualquer especialidade"
    },
    {
      "Tema": "Alta complexidade",
      "Regra": "Procedimentos de AC apenas em unidades habilitadas em AC nas especialidades de cardiologia, neurologia/neurocirurgia, traumatologia e oftalmologia"
    },
    {
      "Tema": "Transferência inter-hospitalar",
      "Regra": "Obrigatório aceitar e assistir usuário internado em outra instituição, inclusive em procedimentos eletivos, quando regulado pelo Estado"
    },
    {
      "Tema": "Lista de espera",
      "Regra": "Manter atualizada no GERINT"
    },
    {
      "Tema": "Negativa de acesso",
      "Regra": "Configura-se por agenda não disponibilizada no prazo das equipes reguladoras, ou DITA sem justificativa técnica por serviço com referência pactuada. Reiteração cancela a habilitação"
    },
    {
      "Tema": "Alta responsável",
      "Regra": "Contrarreferência com orientação a usuários e familiares, autocuidado e desospitalização"
    },
    {
      "Tema": "Subespecialidades",
      "Regra": "Vedada habilitação de subespecialidades idênticas ou semelhantes sem que o território já tenha cobertura nas demais"
    },
    {
      "Tema": "Parâmetro de consultas cirúrgicas",
      "Regra": "Ambulatórios clínico/cirúrgicos: 2 consultas pré e 1 pós por procedimento; as demais consultas destinam-se a atendimento clínico na especialidade"
    },
    {
      "Tema": "Pacientes sem indicação cirúrgica",
      "Regra": "Devem ser atendidos e acompanhados clinicamente pelo especialista"
    },
    {
      "Tema": "Interrupção",
      "Regra": "Temporária: notificar em 5 dias úteis com plano de ação. Desativação: 60 dias de antecedência, mantida a prestação até o referenciamento"
    },
    {
      "Tema": "Monitoramento",
      "Regra": "Relatório-padrão da CAC ao DGAE, trimestral, até o último dia útil do mês subsequente. Omissão da CAC transfere o dever ao hospital, sob pena de suspensão dos repasses"
    },
    {
      "Tema": "Sanções",
      "Regra": "I desconto até 50% do valor mensal do TS por até 3 meses · II suspensão por até 3 meses ou até regularização · III desabilitação. Sem pagamento retroativo (art. 31, § 4º)"
    },
    {
      "Tema": "Risco de substituição federal",
      "Regra": "Art. 17: habilitação ou qualificação do mesmo TS pelo Ministério da Saúde pode ensejar revisão, suspensão ou redução do incentivo estadual"
    }
  ],
  "requisitos_habilitacao": "Projeto Assistencial contendo: (i) descrição da especialidade com protocolos adotados e procedimentos com códigos; (ii) equipe multiprofissional com registros, carga horária e comprovação de especialidade; (iii) lista de equipamentos; (iv) serviços de referência para os demais pontos de atenção.",
  "observacoes": [
    {
      "Item": "Fonte",
      "Conteúdo": "Portaria SES/RS nº 46/2026 (Anexos) e Portaria SES/RS nº 537/2021 (corpo normativo)"
    },
    {
      "Item": "Códigos CBO",
      "Conteúdo": "A portaria só traz o número do CBO em cinco casos: 223268 bucomaxilofacial · 223208 cirurgião dentista · 225235 cirurgião plástico · 225250 ginecologista e obstetra · 225255 mastologista. Nos demais registra apenas a denominação da especialidade"
    },
    {
      "Item": "Pendência 1",
      "Conteúdo": "Anexos 1 e 2 da Portaria SES/RS nº 415, de 03/06/2026 (DOE de 03/06/2026), que substituem as Tabelas 1 e 2"
    },
    {
      "Item": "Pendência 2",
      "Conteúdo": "Decreto de 2026 que atualiza a UIH — não publicizado na página do Programa Assistir"
    },
    {
      "Item": "Pendência 3",
      "Conteúdo": "Metodologia de apuração da produção-base 2023 das especialidades prioritárias"
    },
    {
      "Item": "Falha de publicidade",
      "Conteúdo": "A página oficial do Programa Assistir, atualizada em 03/07/2026, não lista a Portaria 415/2026 entre as Portarias de Regulamentação"
    },
    {
      "Item": "Consolidado em",
      "Conteúdo": "10/08/2026 — AUDITAR Medicina do Trabalho, Auditoria e Gestão em Saúde"
    }
  ],
  "sem_ficha_avisos": {
    "maternidade_ar": "Dado pendente. A Maternidade de Alto Risco é Tipo de Serviço item 10 da Tabela 1 (peso 300), com bloco normativo próprio, fora do conjunto \"Ambulatório de Especialidades\". O rótulo \"TAB. 9\" não corresponde: a Tabela 9 é Urologia Litotripsia, e o Ambulatório de Gestação de Alto Risco (AGAR) é a Tabela 3. Ficha técnica a levantar.",
    "idoso_60": "Dado pendente. Não há Tipo de Serviço com esta denominação na Tabela 1 do Anexo 1 da Portaria SES/RS nº 46/2026. A portaria menciona o \"Ambulatório de Condições Crônicas para Adultos, Pessoas Idosas e Lesões de Pele\" apenas como destino de contrarreferência da Cirurgia Bariátrica, sem tabela própria. Verificar a denominação pretendida antes de habilitar."
  }
};

const AMBULATORIOS_ASSISTIR = {
  "dermatologia": {
    "ficha_id": "FICHA_01",
    "nome": "Dermatologia",
    "fields": {
      "ID": "I",
      "TABELA": "4",
      "CLASSIFICACAO": "Especialidade clínico/cirúrgica",
      "MODELO": "CLINICO_CIRURGICO · TS_ITEM: 2 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Avaliação integral de pele, cabelos e unhas. Consultas especializadas, exames diagnósticos e cirurgias ambulatoriais de pequeno porte. Adultos, adolescentes e crianças",
      "EQUIPE": "Dermatologista com RQE 30h/semana · equipe de enfermagem",
      "META_CONSULTAS": "240/mês",
      "META_CIRURGICA": "150 cirurgias ambulatoriais/mês",
      "EXAMES_MINIMOS": "02.04 laboratoriais · 02.03 cito/histopatologia · 02.03.02 anatomopatológico · 02.01.01.037-2 biópsia de pele e partes moles · 02.01.01.002-0 biópsia/punção de tumor superficial de pele",
      "COMPUTAM_META": "03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO dermatologista · 040101 pequenas cirurgias e cirurgias de pele, tecido subcutâneo e mucosa (exceto curativo)",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "cirurgia geral, cirurgia plástica ou oncologia",
      "CONTRARREFERENCIA": "atenção primária",
      "PONTOS_ESPECIFICOS": "Cirurgias ambulatoriais, média complexidade, financiamento MAC, eletivo · Tumores de pele não resolvidos no serviço vão à Unidade Oncológica de referência"
    }
  },
  "traumato": {
    "ficha_id": "FICHA_02",
    "nome": "Traumato Ortopedia (prioritário)",
    "fields": {
      "ID": "II",
      "TABELA": "5 (e 6, subespecialidades)",
      "CLASSIFICACAO": "Especialidade clínico/cirúrgica — prioritária",
      "MODELO": "PRIORITARIO · TS_ITEM: 5 · PESO: 2,40 · UR: produção cirúrgica de média complexidade aprovada no SIH em 2023",
      "VITS_MENSAL_REFERENCIAL": "não há valor fixo. VITS anual = R$ 1.140,72 × 2,40 × produção SIH 2023",
      "ESCOPO": "Patologias do aparelho musculoesquelético e as classificadas como 2º tempo do trauma. Adultos, adolescentes e crianças",
      "EQUIPE": "mínimo 2 traumato ortopedistas com RQE 20h/semana cada · fisioterapeuta 20h/semana · equipe de enfermagem · técnico de gesso",
      "META_CONSULTAS": "8/mês por cirurgia prevista no cálculo do incentivo",
      "META_CIRURGICA": "base na produção 2023, com procedimento anestésico, equipe auxiliar, avaliação clínica pré-cirúrgica e pré-anestésica",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.04 raio X · 02.11.02.003-6 ECG · 02.05 ultrassonografia · 02.07 RNM (terceirizável) · 02.06 tomografia (terceirizável)",
      "COMPUTAM_META": "04.08 cirurgia do sistema osteomuscular · 03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO traumato ortopedista",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "unidade de alta complexidade em traumato ortopedia · serviço de reabilitação física ou CER para OPM · fisioterapia municipal para tratamento conservador",
      "CONTRARREFERENCIA": "atenção primária",
      "PONTOS_ESPECIFICOS": "- Segundo tempo do trauma: alta do atendimento de urgência já com retorno agendado via GERCON, consulta em até 15 dias e cirurgia em até 30 dias. O hospital de referência cirúrgica deve atender como demanda espontânea, sem agendamento prévio no GERCON, garantindo cirurgia em até 30 dias do trauma, ainda que o primeiro atendimento tenha ocorrido em outro hospital\n- Composição da meta: até 40% na forma de organização 040806; no mínimo 60% nas subespecialidades 04.08.01 cintura escapular, 04.08.02 membros superiores, 04.08.03 coluna vertebral e caixa torácica, 04.08.04 cintura pélvica, 04.08.05 membros inferiores\n- Infraestrutura: consultório, sala de gesso, sala de curativo, acesso a exames complementares próprios ou terceirizados (RDC 50/2002)\n- Pediatria: malformações congênitas (pé torto, escoliose) e adquiridas em crianças e adolescentes vão ao Serviço de Alta Complexidade de Traumatologia e Ortopedia Pediátrica"
    }
  },
  "cirurgia_geral": {
    "ficha_id": "FICHA_03",
    "nome": "Cirurgia Geral (prioritário)",
    "fields": {
      "ID": "III",
      "TABELA": "7",
      "CLASSIFICACAO": "Especialidade clínico/cirúrgica — prioritária",
      "MODELO": "PRIORITARIO · TS_ITEM: 5 · PESO: 1,90 · UR: produção cirúrgica de média complexidade aprovada no SIH em 2023",
      "VITS_MENSAL_REFERENCIAL": "não há valor fixo. VITS anual = R$ 1.140,72 × 1,90 × produção SIH 2023",
      "ESCOPO": "Hérnias de parede abdominal, doenças do aparelho digestivo incluindo estomias e reversões, tumores de pele e tecidos moles, cirurgias de tireoide, paratireoide e suprarrenal. Adultos, adolescentes e crianças",
      "EQUIPE": "mínimo 2 cirurgiões gerais com RQE 20h/semana cada · equipe de enfermagem",
      "META_CONSULTAS": "120/mês",
      "META_CIRURGICA": "30/mês com procedimento anestésico, equipe auxiliar, avaliação clínica pré-cirúrgica e pré-anestésica",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.04 raio X · 02.11.02.003-6 ECG · 02.05 ultrassonografia · 02.09.01.001-0 colangiopancreatografia retrógrada endoscópica",
      "COMPUTAM_META": "04.07 cirurgia do aparelho digestivo, órgãos anexos e parede abdominal · 03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO cirurgião geral",
      "COMPLEMENTARES": "04.09.04.024-0 vasectomia com habilitação CNES · 04.09.06.018-6 laqueadura tubária com habilitação CNES · 04.02 cirurgia de glândulas endócrinas · 04.09.05.008-3 postectomia · ostomias · 04.07.03.025-5 CPRE terapêutica",
      "REFERENCIA": "procedimentos de alta tecnologia · unidade de alta complexidade em oncologia",
      "CONTRARREFERENCIA": "atenção primária",
      "PONTOS_ESPECIFICOS": "CPRE é alta complexidade com financiamento FAEC, exceção ao MAC da especialidade · Vasectomia exige habilitação federal 1902 · Ostomizados acompanhados pela APS e vinculados ao serviço, inclusive para reversão"
    }
  },
  "urologia": {
    "ficha_id": "FICHA_04",
    "nome": "Urologia (prioritário)",
    "fields": {
      "ID": "IV",
      "TABELA": "8",
      "CLASSIFICACAO": "Especialidade clínica/cirúrgica — prioritária",
      "MODELO": "PRIORITARIO · TS_ITEM: 5 · PESO: 2,00 · UR: produção cirúrgica de média complexidade aprovada no SIH em 2023",
      "VITS_MENSAL_REFERENCIAL": "não há valor fixo. VITS anual = R$ 1.140,72 × 2,00 × produção SIH 2023",
      "ESCOPO": "Prevenção, diagnóstico e tratamento do aparelho geniturinário, eletivos e de urgência, média complexidade hospitalar. Uro-oncologia, uroginecologia, andrologia, endoscopias e laparoscopias. Ambos os sexos, adultos, adolescentes e crianças",
      "EQUIPE": "mínimo 2 urologistas com RQE 20h/semana cada · equipe de enfermagem",
      "META_CONSULTAS": "7/mês por cirurgia prevista no cálculo do incentivo",
      "META_CIRURGICA": "base na produção 2023, com procedimento anestésico, equipe auxiliar, avaliação clínica pré-cirúrgica e pré-anestésica",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.09.02.001-6 cistoscopia · 02.11.09 diagnóstico em urologia · 02.05 ultrassonografia · 02.05.02.011-9 e 02.01.01.041-0 US próstata transretal com biópsia, mínimo 20/mês em cada procedimento · 02.06 tomografia de abdômen total",
      "COMPUTAM_META": "04.09.01 rim, ureter e bexiga · 04.09.02 uretra · 04.09.03 próstata e vesícula seminal · 04.09.04 bolsa escrotal, testículos e cordão espermático · 04.09.05 pênis · 03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO urologista",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "procedimentos de alta tecnologia · unidade de alta complexidade em oncologia",
      "CONTRARREFERENCIA": "atenção primária"
    }
  },
  "urologia_litotripsia": {
    "ficha_id": "FICHA_05",
    "nome": "Urologia Litotripsia",
    "fields": {
      "ID": "V",
      "TABELA": "9",
      "CLASSIFICACAO": "Especialidade clínica/cirúrgica",
      "MODELO": "CLINICO_CIRURGICO · TS_ITEM: 2 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Litíase do trato urinário. Cirurgias e terapias do aparelho geniturinário, hospitalares e ambulatoriais, média e/ou alta complexidade, urgência e eletivo. Adultos, adolescentes e crianças",
      "EQUIPE": "mínimo 2 urologistas com RQE 20h/semana cada · equipe de enfermagem",
      "META_CONSULTAS": "120/mês com cirurgião",
      "META_CIRURGICA": "30 procedimentos/mês com procedimento anestésico, equipe auxiliar, avaliação clínica pré-cirúrgica e pré-anestésica se necessário",
      "EXAMES_MINIMOS": "02.04.05.013-8 raio X simples de abdômen · 02.05.02.005-4 US do trato urinário · 02.06.03.003-7 tomografia de abdômen · 02.04.05.018-9 urografia excretora",
      "COMPUTAM_META": "03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO urologista · 03.09.03 terapias do aparelho · 040901 cirurgia do aparelho geniturinário nos casos de litíase",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "não especificada na tabela",
      "CONTRARREFERENCIA": "atenção primária",
      "PONTOS_ESPECIFICOS": "Exige no CNES o Serviço Especializado 169 Atenção em Urologia, subtipo 002 Litotripsia"
    }
  },
  "bucomaxilofacial": {
    "ficha_id": "FICHA_06",
    "nome": "Cirurgia e Traumatologia Bucomaxilofacial",
    "fields": {
      "ID": "VI",
      "TABELA": "10",
      "CLASSIFICACAO": "Especialidade clínica/cirúrgica",
      "MODELO": "CLINICO_CIRURGICO · TS_ITEM: 2 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Referência hospitalar em CTBMF e estomatologia: deformidades e assimetrias craniofaciais, distúrbios da ATM, traumatismos faciais, lesões bucais, doenças infecciosas com manifestação bucal, sequelas oncológicas, cirurgia oral menor. Adultos, adolescentes e crianças",
      "EQUIPE": "mínimo 2 cirurgiões bucomaxilofaciais 20h/semana cada · equipe de enfermagem · fonoaudiólogo",
      "META_CONSULTAS": "120/mês",
      "META_CIRURGICA": "30 procedimentos cirúrgicos/mês com procedimento anestésico, equipe auxiliar, avaliação clínica pré-cirúrgica e pré-anestésica",
      "EXAMES_MINIMOS": "avaliação clínica pré-operatória · raio X extraoral panorâmico e intrabucais periapical e interproximal · 02.02 laboratório de análises clínicas · 02.06 tomografia · 02.04 raio X",
      "COMPUTAM_META": "04.14 bucomaxilofacial e/ou 04.04.02 cirurgia da face e sistema estomatognático e/ou 04.04.03 deformidades lábio-palatal e craniofacial · 03.01.01.004-8 consulta de nível superior exceto médico · 03.01.01.031-5 teleconsulta de nível superior — CBO 223268 cirurgião dentista traumatologista bucomaxilofacial",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "não especificada na tabela",
      "CONTRARREFERENCIA": "atenção primária",
      "PONTOS_ESPECIFICOS": "Anomalias de crânio e bucomaxilofaciais como fendas palatinas e/ou labiais (04.04.03) apenas em serviços também habilitados pelo MS como Centros de Tratamento da Má Formação Lábio Palatal · Normatização conforme validação DAS/Saúde Bucal"
    }
  },
  "odontologia_pcd": {
    "ficha_id": "FICHA_07",
    "nome": "Odontologia Hospitalar para Pessoas com Deficiência",
    "fields": {
      "ID": "VII",
      "TABELA": "12 (rol de procedimentos na Tabela 11)",
      "CLASSIFICACAO": "Especialidade clínica/cirúrgica",
      "MODELO": "CLINICO_CIRURGICO · TS_ITEM: 2 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Procedimentos odontológicos em ambiente hospitalar sob anestesia geral ou sedação, em pessoas com deficiência que não possam ser atendidas em situação ambulatorial convencional. Adultos, adolescentes e crianças",
      "EQUIPE": "mínimo 1 cirurgião-dentista, preferencialmente especialista em Odontologia para PCD/Necessidades Especiais e/ou Bucomaxilofacial e/ou Odontologia Hospitalar · 1 ASB ou TSB · 1 médico anestesista · equipe auxiliar de enfermagem",
      "META_CONSULTAS": "90/mês reguladas, com mínimo de 30 novos usuários ingressos/mês, e/ou definido pelo número de habitantes da referência abrangida",
      "META_CIRURGICA": "definida pelo número de novos ingressos/mês, com procedimento anestésico, equipe auxiliar, avaliação clínica pré-cirúrgica e pré-anestésica",
      "EXAMES_MINIMOS": "avaliação clínica pré-operatória · raio X extraoral panorâmico e intrabucais periapical e interproximal · exames laboratoriais",
      "COMPUTAM_META": "04.14.02.041-3 tratamento odontológico para pacientes com necessidades especiais, mínimo 30/mês · 03.01.01.004-8 consulta de nível superior exceto médico, CBO 223208 cirurgião dentista, mínimo 90/mês · 03.01.01.031-5 teleconsulta de nível superior · procedimentos secundários conforme Portaria MS nº 1.032/2010",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "não especificada na tabela",
      "CONTRARREFERENCIA": "atenção primária, com contrarreferência obrigatória após alta",
      "PONTOS_ESPECIFICOS": "- Protocolo de 6 passos: consulta de avaliação inicial, bloco cirúrgico, monitoramento transcirúrgico sob responsabilidade do anestesista, documentação de drogas e doses, sala de recuperação, alta hospitalar com alta anestésica pelo anestesiologista\n- Jejum absoluto de 10 horas · TCLE assinado pelo responsável · ECG para pacientes acima de 50 anos ou com alterações cardíacas prévias\n- Equipamentos essenciais: consultório odontológico com equipo, RX intra e extraoral, e no bloco cirúrgico do oxímetro ao carro de parada cardiorrespiratória, equipo odontológico, instrumentos manuais e rotatórios, fotopolimerizador, aspirador de secreções, ultrassom para raspagem, abridores de boca\n- Regulação: encaminhamento conforme Nota Técnica DAS Saúde Bucal SES/RS, com documento de referência contendo CID da deficiência, descrição do caso, justificativa do insucesso ambulatorial e risco classificado\n- A Tabela 11 lista 39 procedimentos, de aplicação de selante a ulotomia/ulectomia"
    }
  },
  "endocrinologia": {
    "ficha_id": "FICHA_08",
    "nome": "Endocrinologia",
    "fields": {
      "ID": "VIII",
      "TABELA": "13",
      "CLASSIFICACAO": "Especialidade clínica",
      "MODELO": "CLINICO · TS_ITEM: 3 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Doenças endocrinológicas e metabólicas em pacientes adultos e pediátricos. Adultos, adolescentes e crianças",
      "EQUIPE": "endocrinologista com RQE 30h/semana · nutricionista e enfermeiro 20h/semana cada · equipe de enfermagem",
      "META_CONSULTAS": "240/mês",
      "META_CIRURGICA": "não aplicável",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.01.01.047-0 PAAF de nódulos tireoidianos · 02.04 raio X · 02.05 ultrassonografia · 02.08.03.001-8 cintilografia das paratireoides · 02.08.03.002-6 cintilografia de tireoide com ou sem captação · 02.06.01.006-0 tomografia de sela túrcica · 02.07.01.007-2 RNM de sela túrcica · 02.04.06.002-8 densitometria",
      "COMPUTAM_META": "03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO endocrinologista",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "cirurgia geral ou alta complexidade em oncologia e/ou obesidade",
      "CONTRARREFERENCIA": "atenção primária"
    }
  },
  "gastroenterologia": {
    "ficha_id": "FICHA_09",
    "nome": "Gastroenterologia",
    "fields": {
      "ID": "IX",
      "TABELA": "14",
      "CLASSIFICACAO": "Especialidade clínica",
      "MODELO": "CLINICO · TS_ITEM: 3 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Doenças digestivas: esôfago, estômago, duodeno, intestino delgado e grosso, pâncreas, fígado e vesícula biliar. Adultos, adolescentes e crianças",
      "EQUIPE": "gastroenterologista com RQE 30h/semana · nutricionista 20h/semana · equipe de enfermagem",
      "META_CONSULTAS": "240/mês",
      "META_CIRURGICA": "não aplicável",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.04 raio X · 02.09.01.003-7 endoscopia digestiva alta, mínimo 50/mês · 02.09.01.002-9 colonoscopia · 02.05 ultrassonografia · 02.06 tomografia · 02.07 RNM de abdômen · 02.07.03.004-9 ressonância magnética de vias biliares e colangiorressonância",
      "COMPUTAM_META": "03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO gastroenterologista",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "cirurgia geral ou oncologia, com contrarreferência do mesmo para acompanhamento ambulatorial pós-cirúrgico quando necessário",
      "CONTRARREFERENCIA": "atenção primária"
    }
  },
  "genetica": {
    "ficha_id": "FICHA_10",
    "nome": "Genética",
    "fields": {
      "ID": "X",
      "TABELA": "15",
      "CLASSIFICACAO": "Especialidade clínica",
      "MODELO": "CLINICO · TS_ITEM: 3 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Manejo clínico e aconselhamento genético, adultos e pediátricos. Erros inatos do metabolismo, dismorfologia, oncogenética, neurogenética, genética reprodutiva, fibrose cística e competências do Programa Nacional de Triagem Neonatal",
      "EQUIPE": "geneticista com RQE 30h/semana · biomédico, nutricionista e enfermeiro 30h/semana cada",
      "META_CONSULTAS": "240/mês, médicas e de profissionais de nível superior, considerando a teleconsulta para o geneticista",
      "META_CIRURGICA": "não aplicável",
      "EXAMES_MINIMOS": "02.02 laboratoriais",
      "COMPUTAM_META": "03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO geneticista",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "Serviço de Doenças Raras",
      "CONTRARREFERENCIA": "atenção primária",
      "NORMAS_PROPRIAS": "PNTN — Cap. VI do Título I da Portaria de Consolidação MS nº 05/2017, origem Portaria GM/MS nº 822/2001, com alteração da Portaria nº 187/2019"
    }
  },
  "ginecologia": {
    "ficha_id": "FICHA_11",
    "nome": "Ginecologia",
    "fields": {
      "ID": "XI",
      "TABELA": "16",
      "CLASSIFICACAO": "Especialidade clínico/cirúrgica",
      "MODELO": "CLINICO_CIRURGICO · TS_ITEM: 2 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Saúde da mulher da adolescência à terceira idade: oncologia ginecológica, patologia do trato genital inferior, endoscopia e endometriose, sexologia, climatério e endocrinopatias, uroginecologia, estática pélvica, ginecologia infanto-puberal, planejamento reprodutivo",
      "EQUIPE": "mínimo 2 ginecologistas cirurgiões com RQE 20h/semana cada · enfermeiro 30h/semana · equipe de enfermagem",
      "META_CONSULTAS": "240/mês com ginecologista",
      "META_CIRURGICA": "30/mês com procedimento anestésico, equipe auxiliar, avaliação clínica pré-cirúrgica e pré-anestésica",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.04 raio X · 02.11.02.003-6 ECG · 02.11.04.002-9 colposcopia · 02.05.02.004-6 US de abdômen total 25/mês · 02.05.02.008-6 US transvaginal 25/mês · 02.05.02.009-7 US mamária bilateral 25/mês · 02.04.03 mamografia bilateral de rastreamento 30/mês · 02.06 tomografia · 02.07 RNM · 02.04.06.002-8 densitometria óssea",
      "COMPUTAM_META": "04.09.01 rim, ureter e bexiga · 04.09.02 uretra · 04.09.06 útero e anexos · 04.09.07 vagina, vulva e períneo · 03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO ginecologista",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "procedimentos de alta tecnologia · serviço de alta complexidade em oncologia",
      "CONTRARREFERENCIA": "atenção primária",
      "PONTOS_ESPECIFICOS": "Laqueadura tubária exige credenciamento no código 1901 com CNES atualizado, seguindo o Protocolo de Planejamento Familiar do RS pactuado em CIB/RS · Encaminhamento conforme Protocolo de Regulação Ambulatorial Ginecologia e Protocolo de Encaminhamento para Mastologia"
    }
  },
  "neurologia": {
    "ficha_id": "FICHA_12",
    "nome": "Neurologia",
    "fields": {
      "ID": "XII",
      "TABELA": "17",
      "CLASSIFICACAO": "Especialidade clínica",
      "MODELO": "CLINICO · TS_ITEM: 3 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Doenças do cérebro, medula espinhal e nervos periféricos: epilepsias de difícil controle, doenças do movimento como Parkinson, problemas de memória como Alzheimer, cefaleias, alterações de nervos e músculos, neuropsicologia. Adultos, adolescentes, crianças e neonatos",
      "EQUIPE": "neurologista com RQE 30h/semana · fisioterapeuta, psicólogo e fonoaudiólogo 20h/semana · equipe de enfermagem",
      "META_CONSULTAS": "240/mês, com no mínimo 20% das consultas para pacientes pediátricos incluindo neonatos, crianças e adolescentes",
      "META_CIRURGICA": "não aplicável",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.05 ultrassonografia · 02.11.05 EEG sono e vigília 240/mês, 1 a cada consulta · 02.11.05.008-3 ENMG 10/mês · 02.07 RNM com e sem sedação · 02.06 tomografia com e sem sedação",
      "COMPUTAM_META": "03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO neurologista",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "alta complexidade em neurocirurgia · serviços de reabilitação ou CER · Centros de Atendimento ao Transtorno do Espectro Autista TEAcolhe",
      "CONTRARREFERENCIA": "atenção primária ou ambulatório de doenças crônicas e idosos",
      "PONTOS_ESPECIFICOS": "Pediatria abrange doenças do desenvolvimento e maturação do sistema nervoso até 15 anos, 11 meses e 29 dias, nos casos de epilepsia, paralisia cerebral, cefaleias, deficiência intelectual, TEA, distúrbios de aprendizagem e TDAH · Casos que necessitem reabilitação vão aos serviços de reabilitação ou CER · Deve oferecer RNM e tomografia, ambas com e sem sedação"
    }
  },
  "cardiologia": {
    "ficha_id": "FICHA_13",
    "nome": "Cardiologia",
    "fields": {
      "ID": "XIII",
      "TABELA": "18",
      "CLASSIFICACAO": "Especialidade clínica",
      "MODELO": "CLINICO · TS_ITEM: 3 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Diagnóstico e tratamento das doenças que acometem o coração e os demais componentes do sistema circulatório. Adultos, adolescentes e crianças",
      "EQUIPE": "cardiologista com RQE 30h/semana · nutricionista · equipe de enfermagem",
      "META_CONSULTAS": "240/mês",
      "META_CIRURGICA": "não aplicável",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.11.02.003-6 eletrocardiograma · 02.05.01.003-2 ecocardiograma transtorácico · 02.05.01.002-4 ecocardiograma transesofágico · 02.11.02.004-4 Holter · 02.11.02.006-0 prova de esforço",
      "COMPUTAM_META": "03.01.01.007-2 consulta médica em atenção especializada · 03.01.01.030-7 teleconsulta médica na atenção especializada — CBO médico cardiologista, código 225120 não expresso na portaria",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "Serviço de Alta Complexidade em Cardiologia",
      "CONTRARREFERENCIA": "atenção primária",
      "PONTOS_ESPECIFICOS": "O cardiologista e a equipe do Laboratório de Exames Complementares em Cardiologia se organizam em articulação com os NASF ou equipes da atenção primária"
    }
  },
  "oftalmologia": {
    "ficha_id": "FICHA_14",
    "nome": "Oftalmologia (prioritário)",
    "fields": {
      "ID": "XIV",
      "TABELA": "19",
      "CLASSIFICACAO": "Especialidade clínico/cirúrgica — prioritária",
      "MODELO": "PRIORITARIO · TS_ITEM: 5 · PESO: 0,76 · UR: produção cirúrgica de média complexidade aprovada no SIA em 2023",
      "VITS_MENSAL_REFERENCIAL": "não há valor fixo. VITS anual = R$ 1.140,72 × 0,76 × produção SIA 2023",
      "ESCOPO": "Doenças oftalmológicas com procedimentos clínicos de média e/ou alta complexidade, intervencionistas e cirúrgicos especializados. Adultos, adolescentes e crianças",
      "EQUIPE": "mínimo 2 oftalmologistas cirurgiões com RQE 20h/semana cada · equipe de enfermagem",
      "META_CONSULTAS": "240/mês com oftalmologista",
      "META_CIRURGICA": "100 cirurgias/mês com procedimento anestésico e equipe auxiliar",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.05.02.002-0 paquimetria ultrassônica · 02.05.02.008-9 US do globo ocular e órbita monocular · 02.11.06 métodos diagnósticos em oftalmologia · 03.03.05 tratamento de doenças do aparelho da visão",
      "COMPUTAM_META": "04.05 cirurgia do aparelho da visão · 04.05.05.037-2 facoemulsificação com implante de lente intraocular dobrável, considerada até 20% do total de cirurgias realizadas · 03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO oftalmologista",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "alta complexidade de oftalmologia · serviço de oftalmologia com DMRI e RD",
      "CONTRARREFERENCIA": "atenção primária",
      "PONTOS_ESPECIFICOS": "Glaucoma com terapia medicamentosa exige habilitação 0506 Tratamento do Glaucoma com Medicamentos no âmbito da Política Nacional de Atenção Oftalmológica, com observância do PCDT Glaucoma CONITEC 2018 · Deve atender retinopatia diabética e DMRI conforme protocolos, referenciando ao ambulatório de oftalmologia com DMRI os casos que necessitem antiangiogênico",
      "NORMAS_PROPRIAS": "PT/SAS nº 288/2008 · PT GM/MS nº 1.631/2015"
    }
  },
  "oftalmologia_retina": {
    "ficha_id": "FICHA_15",
    "nome": "Oftalmologia para Retinopatia Diabética e DMRI",
    "fields": {
      "ID": "XV",
      "TABELA": "20",
      "CLASSIFICACAO": "Especialidade clínica",
      "MODELO": "CLINICO · TS_ITEM: 3 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Retinopatia diabética e degeneração macular relacionada à idade, com diagnóstico, dispensação e aplicação de medicação antiangiogênica",
      "EQUIPE": "mínimo 2 oftalmologistas com RQE 20h/semana cada, podendo ser os mesmos profissionais do ambulatório de oftalmologia · equipe de enfermagem",
      "META_CONSULTAS": "240/mês com oftalmologista",
      "META_CIRURGICA": "100 tratamentos binoculares mensais",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.05.02.002-0 paquimetria ultrassônica · 02.05.02.008-9 US do globo ocular e órbita monocular · 02.11.06.028-3 tomografia de coerência óptica",
      "COMPUTAM_META": "03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO oftalmologista · 03.03.05.023-3 tratamento medicamentoso da doença da retina com medicação antiangiogênica",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "alta complexidade de oftalmologia",
      "CONTRARREFERENCIA": "atenção primária",
      "PONTOS_ESPECIFICOS": "Tratamento da retina com antiangiogênicos é média complexidade com financiamento FAEC · O serviço é responsável pela dispensação e aplicação da medicação antiangiogênica",
      "NORMAS_PROPRIAS": "PT/SAS nº 288/2008 · PT SAS/SCTIE MS nº 18 de 02/07/2018, PCDT da DMRI forma neovascular · PT SAS nº 4.225/2018 · PT SCTIE nº 18/2021"
    }
  },
  "otorrinolaringologia": {
    "ficha_id": "FICHA_16",
    "nome": "Otorrinolaringologia",
    "fields": {
      "ID": "XVI",
      "TABELA": "21",
      "CLASSIFICACAO": "Especialidade clínico/cirúrgica",
      "MODELO": "CLINICO_CIRURGICO · TS_ITEM: 2 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Diagnóstico e tratamento clínico e cirúrgico das patologias de ouvido, nariz, seios paranasais, faringe e laringe. Adultos, adolescentes e crianças",
      "EQUIPE": "otorrinolaringologista(s) com RQE, carga horária mínima total de 40h semanais · fonoaudiólogo(s) com carga horária mínima total de 20h semanais",
      "META_CONSULTAS": "210/mês com otorrinolaringologista",
      "META_CIRURGICA": "30/mês com procedimento anestésico, equipe auxiliar, avaliação clínica pré-cirúrgica e pré-anestésica, considerando apenas os procedimentos realizados a nível hospitalar",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.04 raio X · 02.11.07.002-5 audiometria de reforço visual · 02.11.07.004-1 audiometria tonal limiar · 02.11.07.020-3 imitanciometria · 02.11.07.021-1 logoaudiometria · 02.11.07.005-0 avaliação auditiva comportamental infantil · 02.09.04.004-1 videolaringoscopia",
      "EXAMES_POR_PACTUACAO_REGIONAL": "02.11.07.027-0 potencial evocado auditivo para triagem PEATE/BERA triagem · 02.11.07.026-2 potencial evocado auditivo de curta, média e longa latência PEATE/BERA diagnóstico · 02.11.07.014-9 emissões otoacústicas evocadas para triagem auditiva, teste da orelhinha · 02.11.07.035-1 testes vestibulares",
      "COMPUTAM_META": "04.04 cirurgia das vias aéreas superiores, da face, da cabeça e do pescoço · 04.15 cirurgias múltiplas, podendo ser lançado até 60% do quantitativo da meta cirúrgica nesse subgrupo, contabilizada uma meta por AIH independentemente do número de procedimentos lançados · 03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO otorrinolaringologista",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "alta complexidade em oncologia · pacientes com perdas auditivas e indicação de aparelho vão aos Serviços SUS de Reabilitação Auditiva de referência regional, conforme protocolos TelessaúdeRS pediátrico e adulto",
      "CONTRARREFERENCIA": "atenção primária"
    }
  },
  "pneumologia": {
    "ficha_id": "FICHA_17",
    "nome": "Pneumologia",
    "fields": {
      "ID": "XVII",
      "TABELA": "22",
      "CLASSIFICACAO": "Especialidade clínica",
      "MODELO": "CLINICO · TS_ITEM: 3 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Doenças pulmonares, reabilitação pulmonar, tratamento de asma, tratamento do tabagismo, DPOC, fibrose cística, neoplasias, entre outros. Adultos, adolescentes e crianças",
      "EQUIPE": "pneumologista com RQE 30h/semana · fisioterapeuta 20h/semana · equipe de enfermagem",
      "META_CONSULTAS": "240/mês",
      "META_CIRURGICA": "não aplicável",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.01.01.054-2 biópsia percutânea orientada por tomografia, ultrassonografia, ressonância magnética ou raio X · 02.04 raio X · 02.11.08.005-5 espirometria · 02.07 RNM · 02.06 tomografia · 02.11.08.002-0 gasometria · 03.02.04 assistência fisioterapêutica cardiovascular e pneumofuncional",
      "COMPUTAM_META": "03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO pneumologista",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "serviço de cirurgia torácica · serviço de alta complexidade em oncologia",
      "CONTRARREFERENCIA": "atenção primária"
    }
  },
  "cirurgia_toracica": {
    "ficha_id": "FICHA_18",
    "nome": "Cirurgia Torácica",
    "fields": {
      "ID": "XVIII",
      "TABELA": "23",
      "CLASSIFICACAO": "Especialidade clínica/cirúrgica",
      "MODELO": "CLINICO_CIRURGICO · TS_ITEM: 2 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Patologias pulmonares e torácicas de alta e média complexidade passíveis de abordagem cirúrgica, exceto as que acometem o coração e grandes vasos. Pulmão, pleura, mediastino e vias aéreas inferiores, traqueia e brônquios. Adultos, adolescentes e crianças",
      "EQUIPE": "2 cirurgiões torácicos, ou 1 cirurgião torácico e 1 cirurgião geral, com RQE 20h/semana cada · fisioterapeuta · equipe de enfermagem",
      "META_CONSULTAS": "120/mês com cirurgião torácico",
      "META_CIRURGICA": "10/mês, podendo ser de média ou alta complexidade, com procedimento anestésico, equipe auxiliar, avaliação clínica pré-cirúrgica e pré-anestésica",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.11.02.003-6 ECG · 02.01.01.054-2 biópsia percutânea orientada por tomografia, ultrassonografia, ressonância magnética ou raio X · 02.04 raio X · 02.05 ultrassonografia · 02.09.04.001-7 broncoscopia · 02.11.08.005-5 espirometria · 02.07 RNM · 02.06 tomografia · 02.08 cintilografia",
      "COMPUTAM_META": "04.12 cirurgia torácica · 03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO cirurgião torácico",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "unidade oncológica e serviço de pneumologia",
      "CONTRARREFERENCIA": "atenção primária",
      "PONTOS_ESPECIFICOS": "Procedimentos hospitalares de média e alta complexidade, caráter eletivo. Urgência e emergência devem ser realizadas no local de primeiro atendimento do paciente. A portaria registra que 80% dos procedimentos cirúrgicos da especialidade ocorrem em situações de urgência e emergência, nas portas de entrada · Procedimentos eletivos de destaque: descortinação pulmonar, lobectomia pulmonar, mediastinotomia, toracostomia com drenagem pleural fechada, traqueoplastia, traqueorrafia, colocação de prótese laringotraqueal, drenagem tubular pleural aberta, tratamento cirúrgico de defeitos congênitos do tórax e de parede torácica"
    }
  },
  "proctologia": {
    "ficha_id": "FICHA_19",
    "nome": "Coloproctologia (Proctologia)",
    "fields": {
      "ID": "XIX",
      "TABELA": "24",
      "CLASSIFICACAO": "Especialidade clínico/cirúrgica",
      "MODELO": "CLINICO_CIRURGICO · TS_ITEM: 2 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Prevenção, diagnóstico e tratamento clínico e cirúrgico das doenças do cólon, do reto e do ânus. Adultos, adolescentes e crianças",
      "EQUIPE": "2 coloproctologistas, ou 1 coloproctologista e 1 cirurgião geral, com RQE 20h/semana cada · equipe de enfermagem",
      "META_CONSULTAS": "210/mês com coloproctologista",
      "META_CIRURGICA": "30/mês com procedimento anestésico, equipe auxiliar, avaliação clínica pré-cirúrgica e pré-anestésica",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.01.01 biópsias · 02.03.02 anatomopatológico · 02.04 raio X · 02.05 ultrassonografia · 02.09.01.002-9 colonoscopia, mínimo 50/mês · 02.09.01.005-3 retossigmoidoscopia · 02.06.03 tomografia de abdômen · 02.07.03 RNM de abdômen e pelve",
      "COMPUTAM_META": "04.07.02 intestinos, reto e ânus · 03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO coloproctologista",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "serviço de alta complexidade em oncologia",
      "CONTRARREFERENCIA": "atenção primária",
      "PONTOS_ESPECIFICOS": "Pacientes ostomizados devem ser acompanhados pela Atenção Básica e permanecer vinculados ao serviço, inclusive para cirurgia de reversão quando indicada"
    }
  },
  "reumatologia": {
    "ficha_id": "FICHA_20",
    "nome": "Reumatologia",
    "fields": {
      "ID": "XX",
      "TABELA": "25",
      "CLASSIFICACAO": "Especialidade clínica",
      "MODELO": "CLINICO · TS_ITEM: 3 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Tratamento das doenças reumáticas em adultos, adolescentes e crianças",
      "EQUIPE": "reumatologista com RQE 30h/semana · fisioterapeuta 20h/semana · farmacêutico responsável 40h/semana · enfermeiro capacitado · terapeuta ocupacional",
      "META_CONSULTAS": "240/mês",
      "META_CIRURGICA": "não aplicável",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.05 ultrassonografia · 02.04 raio X de articulações · 02.07 RNM",
      "COMPUTAM_META": "03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO reumatologista",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "serviço de traumato/ortopedia · serviço de reabilitação física ou CER com modalidade de reabilitação física no caso de necessidade de OPM · referência de fisioterapia nos municípios para tratamento conservador",
      "CONTRARREFERENCIA": "atenção primária",
      "PONTOS_ESPECIFICOS": "- Estrutura obrigatória: condições para preparo adequado das medicações reumatológicas, capela de preparação das medicações, sala para administração de medicamentos com bomba de infusão e profissionais capacitados para a função\n- Vedação expressa: a aplicação das medicações deve ser realizada no ambulatório especializado com acompanhamento da equipe, sendo vedado o encaminhamento do paciente para aplicação em outros locais sem a estrutura adequada\n- Encaminhamento conforme Protocolo de Encaminhamento da Atenção Básica para Atenção Especializada, Reumatologia e Ortopedia, e Protocolo da Artrite Reumatoide do Ministério da Saúde"
    }
  },
  "plastica_reparadora": {
    "ficha_id": "FICHA_21",
    "nome": "Plástica Reparadora",
    "fields": {
      "ID": "XXI",
      "TABELA": "26-A pós-bariátrica e 26-B queimados",
      "CLASSIFICACAO": "Especialidade clínica/cirúrgica",
      "MODELO": "CLINICO_CIRURGICO · TS_ITEM: 2 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "OBSERVACAO_ESTRUTURAL": "duas modalidades com parâmetros distintos. As avaliações das metas estarão relacionadas à especialidade habilitada. Renderizar as duas modalidades lado a lado ou em abas dentro da mesma página\n\n**Modalidade 26-A — Pós-bariátrica**",
      "EQUIPE": "médico cirurgião plástico, mínimo 1 cirurgião, com RQE 15h/semana · equipe de enfermagem · médico dermatologista",
      "META_CONSULTAS": "100/mês com cirurgião plástico",
      "META_CIRURGICA": "10/mês com procedimento anestésico, equipe auxiliar, avaliação clínica pré-cirúrgica e pré-anestésica",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.04 raio X · 02.06 tomografia · 04.13 cirurgia reparadora",
      "COMPUTAM_META": "03.01.01.007-2 consulta — CBO cirurgião plástico · 04.13 cirurgia reparadora. Atenção: a teleconsulta não é listada nesta modalidade, diferentemente de todas as demais especialidades",
      "CONTRARREFERENCIA": "atenção primária em saúde",
      "HABILITACAO_EXIGIDA": "critérios da Portaria GM/MS nº 1.273, de 21 de novembro de 2000"
    }
  },
  "cirurgia_vascular": {
    "ficha_id": "FICHA_22",
    "nome": "Cirurgia Vascular",
    "fields": {
      "ID": "XXII",
      "TABELA": "27",
      "CLASSIFICACAO": "Especialidade clínica/cirúrgica",
      "MODELO": "CLINICO_CIRURGICO · TS_ITEM: 2 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Doenças que acometem os sistemas arterial, venoso e linfático, com tratamento de varizes, microvarizes e teleangiectasias. Pode ofertar cirurgia de confecção e reintervenção em acessos à diálise, conforme referências. Adultos, adolescentes e crianças",
      "EQUIPE": "mínimo 2 cirurgiões vasculares com RQE 20h/semana cada · equipe de enfermagem",
      "META_CONSULTAS": "120/mês com cirurgião vascular",
      "META_CIRURGICA": "30/mês com procedimento anestésico, equipe auxiliar, avaliação clínica pré-cirúrgica e pré-anestésica",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.11.02.003-6 eletrocardiograma · 02.05.01.004-0 ultrassonografia doppler de vasos",
      "COMPUTAM_META": "03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO cirurgião vascular · 04.06.02 cirurgia vascular · 03.09.07.001-5 tratamento esclerosante não estético de varizes dos membros inferiores unilateral · 03.09.07.002-3 bilateral",
      "COMPLEMENTARES": "04.18.01 acessos para diálise · 04.18.02 intervenções cirúrgicas em acessos para diálise",
      "REFERENCIA": "serviço de alta complexidade cardiovascular",
      "CONTRARREFERENCIA": "serviços de hemodiálise e atenção primária",
      "PONTOS_ESPECIFICOS": "Composição da meta cirúrgica: até 80% dos procedimentos podem ser cirurgia de varizes 040602 e/ou tratamentos esclerosantes não estéticos de varizes 0309070015 e 0309070023; os 20% restantes devem ser compostos pelos demais procedimentos previstos na especialidade não relacionados às cirurgias de varizes · Financiamento: cirúrgicos hospitalares de média complexidade em MAC, e/ou tratamento esclerosante não estético ambulatorial em FAEC"
    }
  },
  "cirurgia_bariatrica": {
    "ficha_id": "FICHA_23",
    "nome": "Cirurgia Bariátrica",
    "fields": {
      "ID": "XXIII",
      "TABELA": "28",
      "CLASSIFICACAO": "Especialidade clínico/cirúrgica",
      "MODELO": "CLINICO_CIRURGICO · TS_ITEM: 2 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Atenção à saúde integral, contínua, multiprofissional e interdisciplinar, com assistência diagnóstica, cirurgia bariátrica e acompanhamento pré e pós-cirúrgico",
      "EQUIPE_MINIMA": "mínimo 2 médicos especialistas em cirurgia geral ou cirurgia do aparelho digestivo com titulação reconhecida pelo CRM · nutricionista com titulação reconhecida pelo CRN · psicólogo ou psiquiatra com titulação reconhecida pelo CRP ou CRM · clínico geral ou endocrinologista com titulação reconhecida pelo CRM",
      "EQUIPE_COMPLEMENTAR": "clínico geral, cardiologista, pneumologista, endocrinologista, angiologista ou cirurgião vascular, cirurgião plástico e anestesiologista · equipe de enfermagem · fisioterapeuta · assistente social, com titulação reconhecida pelos respectivos conselhos",
      "META_CONSULTAS": "15/mês com cirurgião geral ou cirurgião do aparelho digestivo",
      "META_ACOMPANHAMENTO": "120 acompanhamentos pós-cirurgia bariátrica por equipe multiprofissional/mês",
      "META_CIRURGICA": "15 cirurgias bariátricas/mês",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.04.03 RX simples de tórax · 02.11.02.003-6 eletrocardiograma · 02.05.01.003-2 ecocardiografia transtorácica · 02.05.01.004-0 ultrassonografia doppler colorido até 3 vasos · 02.05.02.004-6 ultrassonografia de abdômen total · 02.09.01.003-7 esofagogastroduodenoscopia · 02.11.08.005-5 prova de função pulmonar completa com broncodilatador, espirometria",
      "COMPUTAM_META": "03.01.01.007-2 consulta — CBO médico cirurgião geral ou cirurgião do aparelho digestivo · 03.01.12.005-6 acompanhamento de paciente pós-cirurgia bariátrica por equipe multiprofissional · 04.07.01.012-2 gastrectomia com ou sem desvio duodenal · 04.07.01.017-3 gastroplastia com derivação intestinal · 04.07.01.018-1 gastroplastia vertical com banda · 04.07.01.036-0 gastrectomia vertical em manga, sleeve · 04.07.01.038-6 cirurgia bariátrica por videolaparoscopia",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "não especificada na tabela",
      "CONTRARREFERENCIA": "atenção primária em saúde e Ambulatório de Condições Crônicas para Adultos, Pessoas Idosas e Lesões de Pele",
      "PONTOS_ESPECIFICOS": "Integração aos demais pontos de atenção à saúde do território, com compartilhamento do cuidado dos usuários com a APS de acordo com o plano de cuidados integrado",
      "HABILITACAO_EXIGIDA": "02.03 Assistência de Alta Complexidade ao Indivíduo com Obesidade, ou 02.02 Unidade de Alta Complexidade ao Paciente Portador de Obesidade Grave, com atendimento integral à PT MS/GM nº 425/2013"
    }
  },
  "processo_transexualizador": {
    "ficha_id": "FICHA_24",
    "nome": "Processo Transexualizador (ambulatorial)",
    "fields": {
      "ID": "XXIV",
      "TABELA": "29",
      "CLASSIFICACAO": "Especialidade clínica",
      "MODELO": "CLINICO · TS_ITEM: 3 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Atendimento clínico, com oferta de exames laboratoriais e de imagem, e psicossocial, desenvolvido por equipe multiprofissional, nas modalidades individual e coletiva",
      "EQUIPE": "endocrinologista com Registro de Qualificação, 8h/semana · psiquiatra com Registro de Qualificação, 8h/semana · clínico geral 20h/semana · psicólogo, assistente social e enfermeiro 20h/semana cada",
      "EQUIPE_COMPLEMENTAR_OPCIONAL": "urologista, ginecologista e fonoaudiólogo",
      "META_CONSULTAS": "200 consultas médicas/mês",
      "META_CIRURGICA": "não aplicável",
      "EXAMES_MINIMOS": "02.02 laboratoriais — hemograma, perfil hepático, perfil metabólico, pesquisa de ISTs e outros · 02.02 laboratoriais — perfil hormonal: estradiol, testosterona total, SHBG, LH, FSH, prolactina e outros",
      "COMPUTAM_META": "03.01.01.007-2 consulta médica na atenção especializada, CBO endocrinologista, psiquiatra e clínica geral · 03.01.01.004-8 consulta por profissionais de nível superior na atenção especializada exceto médico, CBO psicóloga, assistente social e enfermeira · 03.01.01.030-7 teleconsulta médica · 03.01.01.031-5 teleconsulta por profissionais de nível superior exceto médico · 03.01.04.003-6 terapia em grupo, psiquiatra, psicóloga e assistente social · 03.01.04.004-4 terapia individual, psiquiatra, psicóloga e assistente social",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "Serviço Especializado no Processo Transexualizador, habilitação 30.01 ou 30.03",
      "CONTRARREFERENCIA": "atenção primária",
      "PONTOS_ESPECIFICOS": "Escopo obrigatório em três frentes: garantia do acesso à hormonização, através da compra e da dispensação de hormônios para travestis e transexuais; acompanhamento pré e pós-operatório, independentemente de os usuários manifestarem ou não o desejo de encaminhamento para procedimentos cirúrgicos; e realização de ações de educação permanente e de matriciamento para a rede de atenção à saúde, principalmente a atenção primária · Encaminhamento realizado pela APS conforme Protocolos de Regulação Ambulatorial Psiquiatria Adulto, TelessaúdeRS 2021 e atualizações posteriores"
    }
  },
  "nefrologia": {
    "ficha_id": "FICHA_25",
    "nome": "Nefrologia",
    "fields": {
      "ID": "XXV",
      "TABELA": "30",
      "CLASSIFICACAO": "Especialidade clínica",
      "MODELO": "CLINICO · TS_ITEM: 3 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Tratamento das doenças renais em adultos e crianças, considerando o padrão etário estabelecido pelo Ministério da Saúde de 0 a 130 anos",
      "EQUIPE": "nefrologista · enfermeiro · técnico de enfermagem · nutricionista · psicólogo · assistente social. Atenção: a Tabela 30 não especifica cargas horárias, diferentemente das demais especialidades",
      "META_CONSULTAS": "60 consultas médicas/mês para nefrologia geral, além do atendimento aos pacientes com DRC pré-dialíticos ou dialíticos",
      "META_CIRURGICA": "não estabelecida como meta, porém acessos para diálise são obrigatórios",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.04 raio X · 02.11.02.003-6 eletrocardiograma · 02.05.01.004-0 ultrassonografia doppler de vasos · 02.10.01.007-0 arteriografias de membros e venografias · 02.05.02.004-6 ultrassom de abdômen total, rins e vias urinárias · 02.05.02.005-4 ultrassonografia de vias urinárias · 03.05 tratamento em nefrologia · 04.18.01 acessos para diálise · 04.18.02 intervenções cirúrgicas em acessos para diálise",
      "COMPUTAM_META": "03.01.01.007-2 consulta · 03.01.01.030-7 teleconsulta — CBO nefrologista",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "não especificada na tabela",
      "CONTRARREFERENCIA": "atenção primária",
      "HABILITACOES_FEDERAIS_EXIGIDAS": "15.06 Atenção Ambulatorial Especializada em Doença Renal Crônica nos estágios 3, 4 e 5 pré-dialítico · 15.04 Atenção Especializada em DRC com hemodiálise · 15.05 Atenção Especializada em DRC com diálise peritoneal",
      "PONTOS_ESPECIFICOS": "Vedação de encaminhamento — o estabelecimento deve realizar obrigatoriamente a confecção e/ou reintervenção em acessos para diálise, incluindo fístulas arteriovenosas, fístulas arteriovenosas com enxertia de politetrafluoretileno PTFE, fístulas arteriovenosas com enxerto autólogo, cateter de curta e longa permanência e cateter de Tenckhoff ou similar, para suas referências, não devendo encaminhar a outra referência para este fim"
    }
  },
  "cirurgias_processo_transexualizador": {
    "ficha_id": "FICHA_26",
    "nome": "Cirurgias do Processo Transexualizador",
    "fields": {
      "ID": "XXVI",
      "TABELA": "31",
      "CLASSIFICACAO": "Especialidade clínica/cirúrgica",
      "MODELO": "CLINICO_CIRURGICO · TS_ITEM: 2 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Serviço de âmbito hospitalar para plástica mamária reconstrutiva bilateral incluindo prótese mamária de silicone bilateral, mastectomia simples bilateral com reposicionamento do complexo aréolo-mamilar, e histerectomia com anexectomia bilateral e colpectomia sob processo transexualizador, em caráter eletivo, com acompanhamento pré e pós-operatório por equipe multiprofissional",
      "EQUIPE": "médico cirurgião plástico CBO 225235 · médico ginecologista e obstetra CBO 225250 · psicólogo ou psiquiatra · assistente social · equipe de enfermagem",
      "META_CONSULTAS": "não estabelecida na tabela",
      "META_CIRURGICA": "12 cirurgias mensais com procedimento anestésico, equipe auxiliar, avaliação clínica pré-cirúrgica e pré-anestésica",
      "EXAMES_MINIMOS": "02.02 laboratoriais · 02.04 exames radiológicos · 02.11.02.003-6 eletrocardiograma · 02.05 ultrassonografia",
      "COMPUTAM_META": "04.10.01.020-0 plástica mamária reconstrutiva bilateral incluindo prótese mamária de silicone bilateral no processo transexualizador · 04.10.01.019-7 mastectomia simples bilateral em usuária sob processo transexualizador · 04.09.06.029-1 histerectomia com anexectomia bilateral e colpectomia sob processo transexualizador",
      "COMPLEMENTARES": "médico mastologista CBO 225255 que realizar o procedimento 04.10.01.019-7",
      "REFERENCIA": "demandas de redesignação sexual e cirurgias complementares vão ao Serviço Especializado no Processo Transexualizador, habilitação 30.01 ou 30.03",
      "CONTRARREFERENCIA": "Ambulatório de Especialidades no Processo Transexualizador, ficha XXIV",
      "PONTOS_ESPECIFICOS": "Infraestrutura conforme RDC nº 50/2002 e demais portarias estaduais complementares, compatível com o porte do serviço proposto"
    }
  },
  "saude_indigena": {
    "ficha_id": "FICHA_27",
    "nome": "Saúde Indígena",
    "fields": {
      "ID": "XXVII",
      "TABELA": "32",
      "CLASSIFICACAO": "Especialidade clínica",
      "MODELO": "CLINICO · TS_ITEM: 3 · PESO: 840 · UR: fator unitário",
      "VITS_MENSAL_REFERENCIAL": "R$ 79.850,40 por ambulatório",
      "ESCOPO": "Acolhimento intercultural dentro da unidade hospitalar e atenção à saúde diferenciada conforme a Política Nacional de Atenção à Saúde dos Povos Indígenas, no âmbito da atenção especializada. Coordenação do cuidado de indígenas em trânsito na média e alta complexidade, com primeiro atendimento, resolução de casos de menor complexidade, referenciamento e acompanhamento em consultas especializadas",
      "EQUIPE": "1 médico clínico geral 40h · 1 enfermeiro 40h · 1 assistente social 30h · 1 psicólogo 40h · 1 técnico de enfermagem 40h — todos com experiência em saúde indígena · 1 intérprete indígena 40h, Kaingang ou Guarani, a depender do predomínio étnico regional",
      "META_CONSULTAS": "não fixada em número. Quantitativo conforme documento e nota técnica específica a ser editada pela SES",
      "META_CIRURGICA": "não aplicável",
      "EXAMES_MINIMOS": "acolhimento intercultural, anamnese clínica, consulta multiprofissional, exames, procedimentos cirúrgicos e demais procedimentos que integrem a linha de cuidado do indígena",
      "COMPUTAM_META": "conforme nota técnica específica da SES",
      "COMPLEMENTARES": "não previstos",
      "REFERENCIA": "instituições habilitadas para atendimento à população indígena na atenção especializada",
      "CONTRARREFERENCIA": "Equipes Multidisciplinares de Saúde Indígena da SESAI · equipe de saúde de atenção primária municipal, a depender da organização do fluxo local · hospitais de maior complexidade",
      "HABILITACAO_FEDERAL_EXIGIDA": "IAEPI",
      "REGULACAO": "subespecialidade MEDICINA INTERNA — SAÚDE INDÍGENA no sistema GERCON",
      "MONITORAMENTO": "com auxílio do Distrito Sanitário Interior Sul da SESAI · quantitativo de atendimentos ambulatoriais mensais através do sistema GERCON e parâmetros estabelecidos em nota técnica",
      "PONTOS_ESPECIFICOS": "- Necessidades específicas: Projeto Terapêutico Singular do usuário indígena · enfoque na saúde da gestante e criança visando reduzir a mortalidade infantil indígena · enfoque na saúde mental visando reduzir violências e suicídio · enfoque na saúde do idoso para enfrentamento de doenças crônicas e agravos decorrentes de causas externas · compartilhamento do cuidado com a equipe multidisciplinar de saúde indígena da SESAI · pactuação com a SESAI do provimento de alimentação do usuário, acompanhante e curadores tradicionais durante atendimento ambulatorial e internação, com garantia subsidiária do município · articulação com a SESAI de hospedagem e alimentação para acompanhante · realização de visitas e atendimentos na aldeia indígena · monitoramento e articulação junto à regulação dos usuários indígenas que aguardam consulta com especialista ou especialidade cirúrgica\n- Diretrizes operacionais em 26 incisos, incluindo: viabilizar o direito do paciente indígena a intérprete e acompanhante · assegurar o compartilhamento diagnóstico e condutas de forma compreensível · respeitar e articular a medicina tradicional indígena, adaptando protocolos clínicos quando necessário · favorecer acesso diferenciado e priorizado aos indígenas de recente contato, com alojamento de internação individualizado quando necessário · respeitar os rituais espirituais de cura de cada etnia · garantir dieta especial de acordo com os hábitos de cada etnia · participar dos Comitês de Vigilância do Óbito · proporcionar serviços de atenção especializada em terras e territórios indígenas\n- Requisito de instalação: preferencialmente em unidades hospitalares que abranjam o maior número de especialidades e nível de complexidade, com atendimento integral à nota técnica específica da SES/RS\n\n---\n\n# FIM DO PACOTE"
    }
  },
  "maternidade_ar": {
    "ficha_id": "PENDENTE",
    "nome": "Maternidade AR",
    "fields": {},
    "is_sem_ficha": true,
    "aviso": "Dado pendente. A Maternidade de Alto Risco é Tipo de Serviço item 10 da Tabela 1 (peso 300), com bloco normativo próprio, fora do conjunto \"Ambulatório de Especialidades\". O rótulo \"TAB. 9\" não corresponde: a Tabela 9 é Urologia Litotripsia, e o Ambulatório de Gestação de Alto Risco (AGAR) é a Tabela 3. Ficha técnica a levantar."
  },
  "idoso_60": {
    "ficha_id": "PENDENTE",
    "nome": "Idoso 60+",
    "fields": {},
    "is_sem_ficha": true,
    "aviso": "Dado pendente. Não há Tipo de Serviço com esta denominação na Tabela 1 do Anexo 1 da Portaria SES/RS nº 46/2026. A portaria menciona o \"Ambulatório de Condições Crônicas para Adultos, Pessoas Idosas e Lesões de Pele\" apenas como destino de contrarreferência da Cirurgia Bariátrica, sem tabela própria. Verificar a denominação pretendida antes de habilitar."
  }
};

window.assistirViewMode = 'viabilidade';

window.setAssistirViewMode = function(mode) {
  window.assistirViewMode = mode;
  const btnViab = document.getElementById('btn-view-viabilidade');
  const btnPort = document.getElementById('btn-view-portaria');

  if (mode === 'viabilidade') {
    if (btnViab) {
      btnViab.classList.add('active-period');
      btnViab.style.border = '1px solid var(--blue-vibrant)';
      btnViab.style.background = 'var(--blue-vibrant)';
      btnViab.style.color = '#FFFFFF';
      btnViab.style.boxShadow = '0 2px 8px rgba(37,99,235,0.3)';
    }
    if (btnPort) {
      btnPort.classList.remove('active-period');
      btnPort.style.border = '1px solid var(--border-color)';
      btnPort.style.background = 'var(--bg-card)';
      btnPort.style.color = 'var(--text-muted)';
      btnPort.style.boxShadow = 'none';
    }
  } else {
    if (btnPort) {
      btnPort.classList.add('active-period');
      btnPort.style.border = '1px solid var(--blue-vibrant)';
      btnPort.style.background = 'var(--blue-vibrant)';
      btnPort.style.color = '#FFFFFF';
      btnPort.style.boxShadow = '0 2px 8px rgba(37,99,235,0.3)';
    }
    if (btnViab) {
      btnViab.classList.remove('active-period');
      btnViab.style.border = '1px solid var(--border-color)';
      btnViab.style.background = 'var(--bg-card)';
      btnViab.style.color = 'var(--text-muted)';
      btnViab.style.boxShadow = 'none';
    }
  }

  renderAssistirAmbulatorio(currentAssistirKey || 'cardiologia');
};

function switchAssistirAmbulatorio(key, btnEl) {
  currentAssistirKey = key;
  window.currentAssistirKey = key;
  // Update active class in ASSISTIR sidebar
  document.querySelectorAll('#assistirSidebarNav .pill-btn').forEach(btn => {
    if (btn.getAttribute('data-key') === key) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderAssistirAmbulatorio(key);
}
window.switchAssistirAmbulatorio = switchAssistirAmbulatorio;
window.renderAssistirAmbulatorio = renderAssistirAmbulatorio;
window.currentAssistirKey = 'cardiologia';

const ICON_MAPPING = {
  cardiologia: 'heart-pulse',
  cirurgia_geral: 'scissors',
  gastroenterologia: 'activity',
  ginecologia: 'user',
  traumato: 'bone',
  maternidade_ar: 'baby',
  nefrologia: 'droplet',
  reumatologia: 'activity',
  pneumologia: 'wind',
  neurologia: 'brain',
  endocrinologia: 'activity',
  genetica: 'dna',
  idoso_60: 'users',
  dermatologia: 'sparkles',
  urologia: 'activity',
  urologia_litotripsia: 'activity',
  bucomaxilofacial: 'smile',
  odontologia_pcd: 'smile',
  oftalmologia: 'eye',
  oftalmologia_retina: 'eye',
  otorrinolaringologia: 'music',
  cirurgia_toracica: 'activity',
  proctologia: 'activity',
  plastica_reparadora: 'sparkles',
  cirurgia_vascular: 'activity',
  cirurgia_bariatrica: 'activity',
  processo_transexualizador: 'user',
  cirurgias_processo_transexualizador: 'scissors',
  saude_indigena: 'heart'
};

function renderAssistirSidebar() {
  const container = document.getElementById('assistirSidebarNav');
  if (!container) return;

  // Group into Homologados and Planned/Pending
  const homologados = [];
  const planejados = [];
  
  for (const [key, item] of Object.entries(AMBULATORIOS_ASSISTIR)) {
    if (item.is_sem_ficha) {
      planejados.push({ key, ...item });
    } else {
      homologados.push({ key, ...item });
    }
  }

  // Sort alphabetically by name
  homologados.sort((a, b) => a.nome.localeCompare(b.nome));
  planejados.sort((a, b) => a.nome.localeCompare(b.nome));

  let html = '';
  html += `<div style="margin-bottom: 0.5rem;">
    <div style="font-size: 0.72rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.4rem; letter-spacing: 0.5px;">Homologados</div>
    <div style="display: flex; flex-direction: column; gap: 0.35rem;">`;
    
  homologados.forEach(item => {
    const iconName = ICON_MAPPING[item.key] || 'activity';
    const isActive = (item.key === currentAssistirKey) ? 'active' : '';
    let badgeText = 'TAB. ' + (item.fields.TABELA || 'N/A');
    if (item.fields.MODELO && item.fields.MODELO.includes('PRIORITARIO')) {
      badgeText = 'PRIORITARIO';
    }
    
    html += `
      <button class="pill-btn ${isActive}" data-key="${item.key}" style="width: 100%; text-align: left; padding: 0.55rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.8rem; display: flex; align-items: center; justify-content: space-between;" onclick="switchAssistirAmbulatorio('${item.key}', this)">
        <span style="display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">
          <i data-lucide="${iconName}" style="width: 14px; height: 14px; flex-shrink: 0;"></i> 
          <span>${item.nome}</span>
        </span>
        <span class="badge-sus" style="background: rgba(37, 99, 235, 0.1); color: var(--blue-vibrant); font-size: 0.58rem; padding: 0.1rem 0.35rem; border-radius: 3px; font-weight: 700; flex-shrink: 0;">${badgeText}</span>
      </button>
    `;
  });
  
  html += `</div></div>`;
  
  if (planejados.length > 0) {
    html += `<div style="margin-top: 0.75rem;">
      <div style="font-size: 0.72rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.4rem; letter-spacing: 0.5px;">Em Planejamento</div>
      <div style="display: flex; flex-direction: column; gap: 0.35rem;">`;
      
    planejados.forEach(item => {
      const iconName = ICON_MAPPING[item.key] || 'users';
      const isActive = (item.key === currentAssistirKey) ? 'active' : '';
      
      html += `
        <button class="pill-btn ${isActive}" data-key="${item.key}" style="width: 100%; text-align: left; padding: 0.55rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.8rem; display: flex; align-items: center; justify-content: space-between;" onclick="switchAssistirAmbulatorio('${item.key}', this)">
          <span style="display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">
            <i data-lucide="${iconName}" style="width: 14px; height: 14px; flex-shrink: 0;"></i> 
            <span>${item.nome}</span>
          </span>
          <span class="badge-sus" style="background: rgba(100, 116, 139, 0.15); color: var(--text-muted); font-size: 0.58rem; padding: 0.1rem 0.35rem; border-radius: 3px; font-weight: 700; flex-shrink: 0;">PENDENTE</span>
        </button>
      `;
    });
    
    html += `</div></div>`;
  }
  
  container.innerHTML = html;
  lucide.createIcons();
}
window.renderAssistirSidebar = renderAssistirSidebar;

// ==========================================
// SERVIÇOS DO CONSÓRCIO INTERMUNICIPAL DE SAÚDE (CISA)
// ==========================================
const SERVICOS_CISA = {
  todas: {
    key: 'todas',
    nome: 'Todas Especialidades',
    icon: 'layers',
    badge: 'TOTAL',
    titulo: 'PROGRAMA CISA REGIONAL — CONSOLIDAÇÃO DE TODAS AS ESPECIALIDADES',
    contrato: 'Consórcio Intermunicipal de Saúde (CISA) · Regional',
    tabelaRef: 'Portaria SES nº 46/2026 · CISA Regional',
    fields: {
      ID: 'CISA-CONSOLIDADO',
      TABELA: 'Todas as Linhas de Cuidado',
      CLASSIFICACAO: 'Consolidação Geral do Consórcio Intermunicipal de Saúde (CISA)',
      MODELO: 'CONSORCIO CISA · UR: Produção Pactuada Multiespecialidades',
      VITS_MENSAL_REFERENCIAL: 'Conforme pactuação regional global CISA',
      ESCOPO: 'Consolidação de todos os serviços ambulatoriais e cirúrgicos pactuados via Consórcio Intermunicipal de Saúde (CISA) com a Santa Casa de Caridade de Bagé.',
      EQUIPE: 'Corpo clínico multidisciplinar especializado com RQE nas especialidades pactuadas, equipes dedicadas de enfermagem e apoio técnico de regulação.',
      META_CONSULTAS: 'Soma das metas ambulatoriais regionais CISA',
      META_CIRURGICA: 'Soma das metas cirúrgicas regionais CISA',
      EXAMES_MINIMOS: 'Métodos diagnósticos e exames especializados de todas as linhas de cuidado contratualizadas.',
      COMPUTAM_META: 'Procedimentos e consultas com codificação CISA e correspondência SIGTAP/SUS.',
      REFERENCIA: 'Santa Casa de Caridade de Bagé — Centro Macrorregional de Referência CISA',
      CONTRARREFERENCIA: 'Atenção Primária dos Municípios Consorciados CISA',
      PONTOS_ESPECIFICOS: 'Regulação de acessos, encaminhamentos e faturamento das cotas municipais gerenciadas via CISA.'
    }
  },
  oftalmologia: {
    key: 'oftalmologia',
    nome: 'Oftalmologia',
    icon: 'eye',
    badge: 'CISA',
    titulo: 'AMBULATÓRIO DE OFTALMOLOGIA — CONSÓRCIO CISA',
    contrato: 'Consórcio Intermunicipal de Saúde (CISA)',
    tabelaRef: 'Portaria SES nº 46/2026 (Tabela 19) · CISA Regional',
    fields: {
      ID: 'CISA-OFT',
      TABELA: '19',
      CLASSIFICACAO: 'Especialidade Clínico-Cirúrgica Regional (Consórcio CISA)',
      MODELO: 'CONSORCIO CISA · UR: Produção Pactuada',
      VITS_MENSAL_REFERENCIAL: 'Conforme pactuação regional CISA',
      ESCOPO: 'Atendimento oftalmológico regionalizado: consultas clínicas especializadas, métodos diagnósticos e cirurgias oftalmológicas (facoemulsificação de catarata, capsulotomia a laser, etc.). Atendimento integral a adultos, idosos e crianças.',
      EQUIPE: 'Mínimo 2 Médicos Oftalmologistas Cirurgiões com RQE (20h/sem cada) · Enfermeiro Centro Cirúrgico / Ambulatório · Técnicos de Enfermagem · Apoio e Recepção para Regulação CISA.',
      META_CONSULTAS: '240 consultas/mês',
      META_CIRURGICA: '100 cirurgias/mês com procedimento anestésico e equipe auxiliar',
      EXAMES_MINIMOS: 'Paquimetria ultrassônica · US globo ocular e órbita · Métodos diagnósticos em oftalmologia (tonometria, mapeamento de retina, campo visual computadorizado).',
      COMPUTAM_META: '04.05 Cirurgia do aparelho da visão · 04.05.05.037-2 Facoemulsificação com implante de LIO dobrável · 03.01.01.007-2 Consulta médica em atenção especializada — CBO 225265 Oftalmologista.',
      REFERENCIA: 'Serviço de Alta Complexidade em Oftalmologia / DMRI / Retinopatia Diabética',
      CONTRARREFERENCIA: 'Atenção Primária dos Municípios Consorciados CISA',
      PONTOS_ESPECIFICOS: 'Encaminhamentos e agendamentos realizados estritamente através da Central de Regulação do Consórcio Intermunicipal de Saúde (CISA) e sistema GERCON para munícipes consorciados referenciados à Santa Casa de Caridade de Bagé.'
    }
  }
};
window.SERVICOS_CISA = SERVICOS_CISA;

window.currentCisaKey = 'todas';
window.cisaViewMode = 'viabilidade';

function setCisaViewMode(mode) {
  window.cisaViewMode = mode;
  const btnViab = document.getElementById('btn-cisa-view-viabilidade');
  const btnPort = document.getElementById('btn-cisa-view-portaria');

  if (mode === 'viabilidade') {
    if (btnViab) {
      btnViab.classList.add('active-period');
      btnViab.style.border = '1px solid #2563eb';
      btnViab.style.background = '#2563eb';
      btnViab.style.color = '#FFFFFF';
      btnViab.style.boxShadow = '0 2px 8px rgba(37,99,235,0.3)';
    }
    if (btnPort) {
      btnPort.classList.remove('active-period');
      btnPort.style.border = '1px solid var(--border-color)';
      btnPort.style.background = 'var(--bg-card)';
      btnPort.style.color = 'var(--text-muted)';
      btnPort.style.boxShadow = 'none';
    }
    renderCisaViabilidade(window.currentCisaKey || 'todas');
  } else {
    if (btnPort) {
      btnPort.classList.add('active-period');
      btnPort.style.border = '1px solid #2563eb';
      btnPort.style.background = '#2563eb';
      btnPort.style.color = '#FFFFFF';
      btnPort.style.boxShadow = '0 2px 8px rgba(37,99,235,0.3)';
    }
    if (btnViab) {
      btnViab.classList.remove('active-period');
      btnViab.style.border = '1px solid var(--border-color)';
      btnViab.style.background = 'var(--bg-card)';
      btnViab.style.color = 'var(--text-muted)';
      btnViab.style.boxShadow = 'none';
    }
    renderCisaPortaria(window.currentCisaKey || 'todas');
  }
}
window.setCisaViewMode = setCisaViewMode;

function renderCisaSidebar() {
  const container = document.getElementById('cisaSidebarNav');
  if (!container) return;

  let html = '';
  for (const [key, item] of Object.entries(SERVICOS_CISA)) {
    const isActive = (key === (window.currentCisaKey || 'todas')) ? 'active' : '';
    const iconName = item.icon || (key === 'todas' ? 'layers' : 'stethoscope');
    const badgeText = item.badge || (key === 'todas' ? 'TOTAL' : 'CISA');
    const badgeBg = key === 'todas' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(37, 99, 235, 0.12)';
    const badgeColor = key === 'todas' ? '#059669' : '#2563eb';
    const iconColor = key === 'todas' ? '#10b981' : '#2563eb';

    html += `
      <button class="pill-btn ${isActive}" data-key="${key}" style="width: 100%; text-align: left; padding: 0.55rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.8rem; display: flex; align-items: center; justify-content: space-between;" onclick="switchCisaServico('${key}', this)">
        <span style="display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">
          <i data-lucide="${iconName}" style="width: 14px; height: 14px; flex-shrink: 0; color: ${iconColor};"></i> 
          <span>${item.nome}</span>
        </span>
        <span class="badge-sus" style="background: ${badgeBg}; color: ${badgeColor}; font-size: 0.58rem; padding: 0.1rem 0.35rem; border-radius: 3px; font-weight: 700; flex-shrink: 0;">${badgeText}</span>
      </button>
    `;
  }
  container.innerHTML = html;
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}
window.renderCisaSidebar = renderCisaSidebar;

function switchCisaServico(key, btnEl) {
  window.currentCisaKey = key;
  document.querySelectorAll('#cisaSidebarNav .pill-btn').forEach(btn => {
    if (btn.getAttribute('data-key') === key) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderCisaServico(key);
}
window.switchCisaServico = switchCisaServico;

function renderCisaServico(key) {
  if (!key) key = window.currentCisaKey || 'todas';
  window.currentCisaKey = key;
  if (window.cisaViewMode === 'portaria') {
    renderCisaPortaria(key);
  } else {
    renderCisaViabilidade(key);
  }
}
window.renderCisaServico = renderCisaServico;

// ============================================================================
// SIMULADOR DE VIABILIDADE FINANCEIRA DEDICADO AO CONSÓRCIO CISA (ANEXO 3)
// ============================================================================

// ============================================================================
// CONSÓRCIO CISA - RELAÇÃO OFICIAL CONTRATUAL COMPLETA (15 PROCEDIMENTOS PACTUADOS)
// ============================================================================
window.cisaContratoOficialProcs = [
  // 01 · Consultas especializadas
  { especialidade: 'Oftalmologia', grupo: '01 · Consultas especializadas', cod: '00483', desc: 'Consulta especializada em oftalmologia (c/ mapeam. + tonome)', val: null },

  // 11 · Diagnóstico em oftalmologia
  { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00256', desc: 'Campimetria computadorizada (01 olho)', val: 64.24 },
  { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00257', desc: 'Biometria ultrassônica (01 olho)', val: 64.24 },
  { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00258', desc: 'Ultra-sonografia de globo ocular / órbita (01 olho)', val: 71.95 },
  { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00260', desc: 'Gonioscopia', val: 45.42 },
  { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00261', desc: 'Mapeamento de retina (01 olho)', val: null },
  { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00262', desc: 'Microscopia especular de córnea (01 olho)', val: 149.09 },
  { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00263', desc: 'Paquimetria ultrassônica (01 olho)', val: 40.40 },
  { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00264', desc: 'Retinografia colorida binocular (02 olhos)', val: 71.95 },
  { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00266', desc: 'Tonometria (01 olho)', val: 14.21 },
  { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00267', desc: 'Topografia computadorizada de córnea (01 olho)', val: 64.24 },
  { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00269', desc: 'Fundoscopia', val: null },
  { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00543', desc: 'Potencial de acuidade visual', val: null },
  { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00593', desc: 'Retirada de corpo estranho do olho (hon/sala/mat)', val: null },
  { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00870', desc: 'Tomografia de coerência óptica (ambos os olhos)', val: 313.47 }
];

// ============================================================================
// CONSÓRCIO CISA - PAINEL EXECUTIVO NATIVO (PRODUÇÃO REAL APURADA - AGOSTO/2026)
// ============================================================================

window.cisaSimState = {
  procs: [
    // 11 · Diagnóstico em oftalmologia (Somente procedimentos efetivamente realizados em Agosto/26)
    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00256', desc: 'Campimetria computadorizada (01 olho)', qtd: 2, val: 64.24, prestador: 'Dr. Heron Gomes Correia' },

    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00257', desc: 'Biometria ultrassônica (01 olho)', qtd: 40, val: 64.24, prestador: 'Dr. Christian Pretto' },
    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00257', desc: 'Biometria ultrassônica (01 olho)', qtd: 4, val: 64.24, prestador: 'Dr. Heron Gomes Correia' },

    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00258', desc: 'Ultra-sonografia de globo ocular / órbita (01 olho)', qtd: 4, val: 71.95, prestador: 'Dr. Christian Pretto' },

    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00260', desc: 'Gonioscopia', qtd: 2, val: 45.42, prestador: 'Dr. Christian Pretto' },

    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00262', desc: 'Microscopia especular de córnea (01 olho)', qtd: 50, val: 149.09, prestador: 'Dr. Christian Pretto' },
    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00262', desc: 'Microscopia especular de córnea (01 olho)', qtd: 6, val: 149.09, prestador: 'Dr. Heron Gomes Correia' },

    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00263', desc: 'Paquimetria ultrassônica (01 olho)', qtd: 6, val: 40.40, prestador: 'Dr. Christian Pretto' },
    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00263', desc: 'Paquimetria ultrassônica (01 olho)', qtd: 2, val: 40.40, prestador: 'Dr. Heron Gomes Correia' },

    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00264', desc: 'Retinografia colorida binocular (02 olhos)', qtd: 19, val: 71.95, prestador: 'Dr. Christian Pretto' },
    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00264', desc: 'Retinografia colorida binocular (02 olhos)', qtd: 3, val: 71.95, prestador: 'Dr. Heron Gomes Correia' },

    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00266', desc: 'Tonometria (01 olho)', qtd: 8, val: 14.21, prestador: 'Dr. Christian Pretto' },
    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00266', desc: 'Tonometria (01 olho)', qtd: 4, val: 14.21, prestador: 'Dr. Heron Gomes Correia' },

    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00267', desc: 'Topografia computadorizada de córnea (01 olho)', qtd: 8, val: 64.24, prestador: 'Dr. Christian Pretto' },
    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00267', desc: 'Topografia computadorizada de córnea (01 olho)', qtd: 2, val: 64.24, prestador: 'Dr. Heron Gomes Correia' },

    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00870', desc: 'Tomografia de coerência óptica (ambos os olhos)', qtd: 8, val: 313.47, prestador: 'Dr. Christian Pretto' },
    { especialidade: 'Oftalmologia', grupo: '11 · Diagnóstico em oftalmologia', cod: '00870', desc: 'Tomografia de coerência óptica (ambos os olhos)', qtd: 2, val: 313.47, prestador: 'Dr. Heron Gomes Correia' }
  ],
  custos: [
    { especialidade: 'Oftalmologia', item: 'Médicos Oftalmologistas Cirurgiões com RQE (por produção)', rateio: 100, qtd: 2, val: 0.00, classificacao: 'Prestador' },
    { especialidade: 'Oftalmologia', item: 'Enfermeiro(a) / Ambulatório Especializado', rateio: 30, qtd: 2, val: 5688.50, classificacao: 'Pessoal' },
    { especialidade: 'Oftalmologia', item: 'Técnicos de Enfermagem (Triagem/Suporte Ambulatorial)', rateio: 30, qtd: 2, val: 3740.95, classificacao: 'Pessoal' },
    { especialidade: 'Oftalmologia', item: 'Equipe de Recepção', rateio: 20, qtd: 1, val: 2639.07, classificacao: 'Pessoal' },
    { especialidade: 'Oftalmologia', item: 'Equipe de Supervisão/Regulação Agendas GERCON/CISA', rateio: 20, qtd: 1, val: 3404.23, classificacao: 'Pessoal' },
    { especialidade: 'Oftalmologia', item: 'Equipe de Faturamento', rateio: 10, qtd: 1, val: 3192.73, classificacao: 'Pessoal' },
    { especialidade: 'Oftalmologia', item: 'Equipe Administrativa (Adm, Financeiro, RH,...)', rateio: 5, qtd: 1, val: 20000.00, classificacao: 'Pessoal' },
    { especialidade: 'Oftalmologia', item: 'Equipe de Higienização', rateio: 20, qtd: 1, val: 2639.07, classificacao: 'Pessoal' },
    { especialidade: 'Oftalmologia', item: 'Material de Almoxarifado', rateio: 20, qtd: 1, val: 2639.07, classificacao: 'Material' },
    { especialidade: 'Oftalmologia', item: 'Manutenção Sistema Hospitalar - TASY', rateio: 10, qtd: 1, val: 5100.00, classificacao: 'Sistemas TI' },
    { especialidade: 'Oftalmologia', item: 'Manutenção e Infra Predial (Luz/Agua/Net)', rateio: 3, qtd: 1, val: 20000.00, classificacao: 'Taxa de Sala' }
  ]
};

window.cisaProcedimentosDescricoes = [
  {
    cod: '00483',
    nome: 'Consulta especializada em oftalmologia (c/ mapeam. + tonome)',
    grupo: 'Grupo 01 · Consultas',
    sigtap: '03.01.01.007-2',
    icon: 'stethoscope',
    descricao: 'Avaliação médica oftalmológica especializada ambulatorial completa. Compreende anamnese clínica detalhada, exame de acuidade visual com refração subjetiva/objetiva, biomicroscopia do segmento anterior em lâmpada de fenda, aferição da pressão intraocular por tonometria de aplanação e avaliação minuciosa dos meios transparentes e fundo de olho (mapeamento/fundoscopia).',
    finalidade: 'Diagnóstico clínico precoce de afecções oculares, triagem e prescrição óptica de ametropias, estadiamento clínico e indicação de conduta cirúrgica especializada.'
  },
  {
    cod: '00257',
    nome: 'Biometria ultrassônica (01 olho)',
    grupo: 'Grupo 11 · Diagnóstico',
    sigtap: '02.11.06.001-1',
    icon: 'eye',
    descricao: 'Exame de ecografia ocular diagnóstica (Modo A) que mensura com precisão micrométrica as dimensões anatômicas do globo ocular, determinando o diâmetro axial anteroposterior, espessura do cristalino e a profundidade da câmara anterior.',
    finalidade: 'Cálculo biométrico indispensável para a escolha do poder dióptrico exato da Lente Intraocular (LIO) no planejamento cirúrgico da facoemulsificação (catarata).'
  },
  {
    cod: '00256',
    nome: 'Campimetria computadorizada (01 olho)',
    grupo: 'Grupo 11 · Diagnóstico',
    sigtap: '02.11.06.003-8',
    icon: 'target',
    descricao: 'Exame psicofísico quantitativo automatizado que mapeia minuciosamente a percepção e sensibilidade da retina a estímulos luminosos em múltiplos pontos do campo visual central e periférico do paciente, quantificando escotomas e depressões retinianas.',
    finalidade: 'Padrão-ouro mandatório para detecção precoce, estadiamento e monitoramento contínuo da perda de campo visual no glaucoma e em neuropatias ópticas.'
  },
  {
    cod: '00269',
    nome: 'Fundoscopia',
    grupo: 'Grupo 11 · Diagnóstico',
    sigtap: '02.11.06.010-0',
    icon: 'eye',
    descricao: 'Exame oftalmoscópico biomicroscópico do polo posterior ocular (fundo de olho), permitindo a visualização direta da papila do nervo óptico (escavação, rima neural), mácula retiniana, arcadas vasculares e parênquima retiniano.',
    finalidade: 'Identificação e estadiamento de retinopatia diabética, retinopatia hipertensiva, edema ou atrofia de papila e degenerações maculares.'
  },
  {
    cod: '00260',
    nome: 'Gonioscopia',
    grupo: 'Grupo 11 · Diagnóstico',
    sigtap: '02.11.06.011-9',
    icon: 'scan',
    descricao: 'Exame biomicroscópico realizado com lente de contato espelhada especial (Goldmann ou Zeiss) apoiada sobre a córnea, que neutraliza o fenômeno óptico de reflexão total para visualização direta do ângulo iridocorneano e da malha trabecular.',
    finalidade: 'Classificação anatômica mandatória entre glaucoma de ângulo aberto e glaucoma de ângulo fechado/estreito, detecção de sinéquias anteriores e neovasos angulares.'
  },
  {
    cod: '00261',
    nome: 'Mapeamento de retina (01 olho)',
    grupo: 'Grupo 11 · Diagnóstico',
    sigtap: '02.11.06.012-7',
    icon: 'eye',
    descricao: 'Exame detalhado de toda a extensão retiniana realizado sob midríase medicamentosa máxima, utilizando oftalmoscópio binocular indireto (OBI) e lente de alta dioptria, associado à depressão escleral para examinar a periferia extrema.',
    finalidade: 'Inspeção completa da retina até a ora serrata, fundamental para o rastreamento e bloqueio de roturas retinianas, degenerações "lattice", descolamento de retina e hemorragias.'
  },
  {
    cod: '00262',
    nome: 'Microscopia especular de córnea (01 olho)',
    grupo: 'Grupo 11 · Diagnóstico',
    sigtap: '02.11.06.014-3',
    icon: 'layers',
    descricao: 'Fotomicrografia óptica digital de altíssima ampliação que fotografa e quantifica as células do endotélio corneano (camada posterior responsável pela transparência da córnea), mensurando densidade celular (cél/mm²), hexagonalidade (pleomorfismo) e variação de área (polimegatismo).',
    finalidade: 'Avaliação da integridade e reserva celular endotelial no pré-operatório de cirurgia de catarata, distrofia de Fuchs e após traumas corneanos.'
  },
  {
    cod: '00263',
    nome: 'Paquimetria ultrassônica (01 olho)',
    grupo: 'Grupo 11 · Diagnóstico',
    sigtap: '02.05.02.002-0',
    icon: 'gauge',
    descricao: 'Mensuração ultrassônica de contato da espessura total da córnea expressa em micrômetros (µm), realizada com transdutor ecográfico de alta frequência perpendicular ao centro óptico corneano.',
    finalidade: 'Correção fidedigna dos valores da pressão intraocular (PIO) medida por aplanação no glaucoma, rastreamento de ectasias corneanas e acompanhamento de edema corneano.'
  },
  {
    cod: '00543',
    nome: 'Potencial de acuidade visual (PAM)',
    grupo: 'Grupo 11 · Diagnóstico',
    sigtap: '02.11.06.015-1',
    icon: 'sparkles',
    descricao: 'Teste funcional eletro-óptico que projeta micro-feixes luminosos com optotipos miniaturizados através de micro-aberturas transparentes nos meios opacos do olho diretamente sobre a fóvea retiniana.',
    finalidade: 'Estimativa prognóstica fidedigna da acuidade visual potencial máxima que o paciente atingirá após a realização de cirurgia desobstrutiva de catarata ou ceratoplastia.'
  },
  {
    cod: '00264',
    nome: 'Retinografia colorida binocular (02 olhos)',
    grupo: 'Grupo 11 · Diagnóstico',
    sigtap: '02.11.06.017-8',
    icon: 'camera',
    descricao: 'Registro fotográfico digital e colorimétrico de alta resolução do polo posterior e da retina em ambos os olhos, documentando com fidelidade o nervo óptico, mácula, vasos retinianos e eventuais lesões.',
    finalidade: 'Documentação auditável para acompanhamento evolutivo seriado de retinopatia diabética, oclusões vasculares retinianas, DMRI, nevus de coroide e laudos para auditoria SUS.'
  },
  {
    cod: '00593',
    nome: 'Retirada de corpo estranho do olho (hon/sala/mat)',
    grupo: 'Grupo 11 · Intervenção',
    sigtap: '04.05.05.025-9',
    icon: 'activity',
    descricao: 'Procedimento microcirúrgico ambulatorial realizado sob anestesia tópica e lâmpada de fenda para extração instrumental delicada de partículas (metálicas, vegetais ou minerais) aderidas ou incrustadas na córnea ou conjuntiva, com curetagem do anel de ferrugem.',
    finalidade: 'Tratamento resolutivo de urgência de trauma ocular superficial, cessação imediata da dor, prevenção de ceratite bacteriana, úlcera de córnea e preservação da integridade ocular.'
  },
  {
    cod: '00870',
    nome: 'Tomografia de coerência óptica (ambos os olhos / OCT)',
    grupo: 'Grupo 11 · Diagnóstico',
    sigtap: '02.11.06.028-3',
    icon: 'scan',
    descricao: 'Tomografia computadorizada óptica não invasiva de varredura interferométrica que captura cortes transversais de altíssima resolução micrométrica (< 5 µm) das camadas da retina e do nervo óptico, atuando como uma biópsia óptica in vivo.',
    finalidade: 'Padrão-ouro no diagnóstico e seguimento de edema macular diabético, degeneração macular relacionada à idade (DMRI úmida/seca), buraco macular e espessura da Camada de Fibras Nervosas (CFNR) no glaucoma.'
  },
  {
    cod: '00266',
    nome: 'Tonometria (01 olho)',
    grupo: 'Grupo 11 · Diagnóstico',
    sigtap: '02.11.06.025-9',
    icon: 'gauge',
    descricao: 'Medição quantitativa rigorosa da pressão intraocular (PIO) expressa em milímetros de mercúrio (mmHg), realizada por aplanação através do tonômetro de Goldmann na lâmpada de fenda após instilação de colírio anestésico e fluoresceína.',
    finalidade: 'Rastreio compulsório da hipertensão ocular, diagnóstico precoce do glaucoma e controle terapêutico do alvo pressórico.'
  },
  {
    cod: '00267',
    nome: 'Topografia computadorizada de córnea (01 olho)',
    grupo: 'Grupo 11 · Diagnóstico',
    sigtap: '02.11.06.026-7',
    icon: 'activity',
    descricao: 'Mapeamento ceratoscópico digital tridimensional da curvatura da superfície corneana anterior através da reflexão de múltiplos anéis concêntricos de Plácido, fornecendo mapas refrativos, altimétricos e de curvatura (K1, K2).',
    finalidade: 'Diagnóstico precoce de ceratocone e ectasias corneanas, avaliação de astigmatismos irregulares, adaptação de lentes de contato especiais e planejamento cirúrgico pré-operatório.'
  },
  {
    cod: '00258',
    nome: 'Ultra-sonografia de globo ocular / órbita (01 olho)',
    grupo: 'Grupo 11 · Diagnóstico',
    sigtap: '02.05.02.008-9',
    icon: 'waves',
    descricao: 'Exame de ecografia ocular e orbitária bidimensional (Modo B) complementado por Modo A vetorial, permitindo a visualização da cavidade vítrea, paredes oculares e estruturas orbitárias mesmo na presença de opacidades densas dos meios refrativos.',
    finalidade: 'Diagnóstico de descolamento de retina ou coroide oculto por hemorragia vítrea ou catarata total, detecção de corpos estranhos intraoculares e avaliação de tumores oculares e orbitários.'
  }
];

const CISA_MESES = [
  { id: '01', sigla: 'JAN', nome: 'Janeiro' },
  { id: '02', sigla: 'FEV', nome: 'Fevereiro' },
  { id: '03', sigla: 'MAR', nome: 'Março' },
  { id: '04', sigla: 'ABR', nome: 'Abril' },
  { id: '05', sigla: 'MAI', nome: 'Maio' },
  { id: '06', sigla: 'JUN', nome: 'Junho' },
  { id: '07', sigla: 'JUL', nome: 'Julho' },
  { id: '08', sigla: 'AGO', nome: 'Agosto' },
  { id: '09', sigla: 'SET', nome: 'Setembro' },
  { id: '10', sigla: 'OUT', nome: 'Outubro' },
  { id: '11', sigla: 'NOV', nome: 'Novembro' },
  { id: '12', sigla: 'DEZ', nome: 'Dezembro' }
];

window.cisaSelectedMonth = window.cisaSelectedMonth || '08';

function getCisaMonthlyStore(monthId) {
  if (!window.cisaMonthlyStore) {
    try {
      const saved = localStorage.getItem('cisa_monthly_store_2026_v16');
      if (saved) window.cisaMonthlyStore = JSON.parse(saved);
    } catch (e) {}
    if (!window.cisaMonthlyStore || typeof window.cisaMonthlyStore !== 'object') {
      window.cisaMonthlyStore = {};
    }
  }

  if (!monthId) monthId = window.cisaSelectedMonth || '08';

  if (!window.cisaMonthlyStore[monthId] || !Array.isArray(window.cisaMonthlyStore[monthId].procs)) {
    const isAgosto = (monthId === '08');

    // Somente Agosto possui produção física e financeira cadastrada inicialmente (apenas procedimentos realizados).
    // Os demais meses iniciam zerados (quantidades = 0), permitindo lançamentos mensais sob demanda.
    const baseProcs = window.cisaSimState.procs.map(p => ({
      ...p,
      qtd: isAgosto ? ((p.qtd !== undefined && p.qtd !== null) ? p.qtd : 0) : 0,
      prestador: p.prestador || 'Dr. Christian Pretto'
    }));

    const baseCustos = window.cisaSimState.custos.map(c => ({
      ...c,
      rateio: (c.rateio !== undefined && c.rateio !== null) ? c.rateio : 100,
      qtd: isAgosto ? ((c.qtd !== undefined && c.qtd !== null) ? c.qtd : 0) : 0,
      classificacao: c.classificacao || 'Pessoal'
    }));

    window.cisaMonthlyStore[monthId] = {
      procs: JSON.parse(JSON.stringify(baseProcs)),
      custos: JSON.parse(JSON.stringify(baseCustos)),
      regraAtiva: 'rateio8020'
    };
  }

  return window.cisaMonthlyStore[monthId];
}

function saveCisaMonthlyStore() {
  try {
    if (window.cisaMonthlyStore) {
      localStorage.setItem('cisa_monthly_store_2026_v16', JSON.stringify(window.cisaMonthlyStore));
    }
  } catch (e) {}
}

function getCisaDefaultState() {
  return JSON.parse(JSON.stringify(window.cisaSimState));
}

// ----------------------------------------------------------------------------
// 1. ESTUDO DE VIABILIDADE FINANCEIRA NATIVO (ANTIGRAVITY DASHBOARD)
// ----------------------------------------------------------------------------
function renderCisaViabilidade(key) {
  if (!key) key = window.currentCisaKey || 'todas';
  window.currentCisaKey = key;
  const container = document.getElementById('cisaMainContent');
  if (!container) return;

  const curMonth = window.cisaSelectedMonth || '08';
  const curMonthObj = CISA_MESES.find(m => m.id === curMonth) || CISA_MESES[7];
  const monthData = getCisaMonthlyStore(curMonth);

  if (!window.activeCisaSim) {
    window.activeCisaSim = getCisaDefaultState();
  }
  const state = window.activeCisaSim;
  state.procs = monthData.procs;
  state.custos = monthData.custos;
  state.regraAtiva = monthData.regraAtiva || 'rateio8020';
  const isTodas = (key === 'todas');

  container.innerHTML = `
    <div id="cisaNativeDashboard" style="display: flex; flex-direction: column; gap: 1.5rem;">
      
      <!-- 1. CABEÇALHO EXECUTIVO DO SERVIÇO CISA -->
      <div class="card" style="padding: 1.5rem 1.75rem; border-left: 5px solid ${isTodas ? '#10b981' : '#2563eb'}; background: linear-gradient(135deg, var(--bg-card) 0%, ${isTodas ? 'rgba(16, 185, 129, 0.04)' : 'rgba(37, 99, 235, 0.04)'} 100%);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <img src="logos/LOGO__SC_Bage.png" alt="Santa Casa de Bagé" style="height: 52px; width: auto;" onerror="this.style.display='none'">
            <div style="width: 2px; height: 42px; background: ${isTodas ? 'rgba(16, 185, 129, 0.25)' : 'rgba(37, 99, 235, 0.25)'};"></div>
            <img src="logo_cisa.png" alt="CISA" style="height: 48px; width: auto;" onerror="this.style.display='none'">
            <div style="margin-left: 0.5rem;">
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.35rem;">
                ${isTodas ? `
                  <span class="badge-sus" style="background: rgba(16, 185, 129, 0.12); color: #059669; font-size: 0.68rem; font-weight: 800; padding: 0.25rem 0.6rem; border-radius: 99px; display: inline-flex; align-items: center; gap: 4px;">
                    <i data-lucide="layers" style="width: 11px; height: 11px;"></i> TODAS ESPECIALIDADES
                  </span>
                  <span class="badge-sus" style="background: rgba(37, 99, 235, 0.12); color: #2563eb; font-size: 0.68rem; font-weight: 800; padding: 0.25rem 0.6rem; border-radius: 99px;">
                    PACTUAÇÃO CISA REGIONAL
                  </span>
                  <span class="badge-sus" style="background: rgba(37, 99, 235, 0.1); color: var(--blue-vibrant); font-size: 0.68rem; font-weight: 800; padding: 0.25rem 0.6rem; border-radius: 99px;">
                    CONTRATO INTERMUNICIPAL CONSOLIDADO
                  </span>
                ` : `
                  <span class="badge-sus" style="background: rgba(37, 99, 235, 0.12); color: #2563eb; font-size: 0.68rem; font-weight: 800; padding: 0.25rem 0.6rem; border-radius: 99px;">
                    PACTUAÇÃO CISA REGIONAL
                  </span>
                  <span class="badge-sus" style="background: rgba(37, 99, 235, 0.1); color: var(--blue-vibrant); font-size: 0.68rem; font-weight: 800; padding: 0.25rem 0.6rem; border-radius: 99px;">
                    CONTRATO INTERMUNICIPAL
                  </span>
                  <span class="badge-sus" style="background: rgba(245, 158, 11, 0.12); color: #b45309; font-size: 0.68rem; font-weight: 800; padding: 0.25rem 0.6rem; border-radius: 99px;">
                    HABILITAÇÃO 0506 GLAUCOMA
                  </span>
                `}
              </div>
              <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--text-title); margin: 0; line-height: 1.2;">
                ${isTodas ? 'Consórcio CISA — Consolidação Geral de Especialidades' : 'Ambulatório de Especialidade em Oftalmologia Clínico-Cirúrgica'}
              </h2>
              <div style="font-size: 0.84rem; color: var(--text-muted); margin-top: 0.3rem;">
                ${isTodas ? 'Demonstrativo Consolidado de Viabilidade Econômico-Financeira · Santa Casa de Caridade de Bagé & Consórcio Intermunicipal de Saúde (CNPJ: 02.231.696/0001-92)' : 'Estudo de Viabilidade Econômico-Financeira · Santa Casa de Caridade de Bagé & Consórcio Intermunicipal de Saúde (CNPJ: 02.231.696/0001-92 · licitacoes@cisaijui.com.br)'}
              </div>
            </div>
          </div>

          <!-- Ações Rápidas -->
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <button class="btn-primary" id="btnCisaAddProcTop" style="background: ${isTodas ? '#10b981' : '#2563eb'}; border-color: ${isTodas ? '#10b981' : '#2563eb'}; font-size: 0.8rem; padding: 0.45rem 0.85rem; border-radius: 6px; box-shadow: 0 2px 6px ${isTodas ? 'rgba(16,185,129,0.25)' : 'rgba(37,99,235,0.25)'};">
              <i data-lucide="plus-circle" style="width: 15px; height: 15px;"></i> Novo Procedimento
            </button>
            <button class="btn-icon" id="btnCisaExportCsvTop" title="Exportar CSV" style="border-radius: 6px;">
              <i data-lucide="download" style="width: 16px; height: 16px;"></i>
            </button>
            <button class="btn-icon" id="btnCisaPrintTop" title="Imprimir Relatório" style="border-radius: 6px;">
              <i data-lucide="printer" style="width: 16px; height: 16px;"></i>
            </button>
            <button class="btn-icon" id="btnCisaResetTop" title="Restaurar Padrões CISA" style="border-radius: 6px; color: var(--danger);">
              <i data-lucide="rotate-ccw" style="width: 16px; height: 16px;"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 2. GRID EXECUTIVO DE INDICADORES (KPIs NATIVOS - 3 CARDS EM 1 LINHA) -->
      <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem;">
        
        <!-- KPI 1: Receita Mensal Média -->
        <div class="card kpi-card" style="border-top: 4px solid #2563eb; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <span class="kpi-label">${isTodas ? 'Receita Mensal Média (Consolidada)' : 'Receita Mensal Média'}</span>
              <div class="card-icon" style="background: rgba(37, 99, 235, 0.12); color: #2563eb;">
                <i data-lucide="wallet" style="width: 20px; height: 20px;"></i>
              </div>
            </div>
            <div class="kpi-value" id="kpiCisaReceita" style="color: #2563eb; font-size: 1.85rem; margin: 0.65rem 0 0.25rem 0;">
              Aguardando valores
            </div>
          </div>
          <div style="margin-top: 1.25rem; padding-top: 0.5rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.75rem;">
            <span style="color: var(--text-muted);">${isTodas ? 'Projeção Anual Consolidada:' : 'Projeção Anual:'}</span>
            <strong id="kpiCisaReceitaAno" style="color: var(--text-title); font-weight: 800;">Conforme demanda mensal</strong>
          </div>
        </div>

        <!-- KPI 2: Custo Operacional Médio -->
        <div class="card kpi-card" style="border-top: 4px solid #dc2626; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <span class="kpi-label">${isTodas ? 'Custo Operacional Médio (Consolidado)' : 'Custo Operacional Médio'}</span>
              <div class="card-icon" style="background: rgba(239, 68, 68, 0.12); color: #dc2626;">
                <i data-lucide="users" style="width: 20px; height: 20px;"></i>
              </div>
            </div>
            <div class="kpi-value" id="kpiCisaDespesa" style="color: #dc2626; font-size: 1.85rem; margin: 0.65rem 0 0.25rem 0;">
              R$ 0,00
            </div>
          </div>
          <div style="margin-top: 1.25rem; padding-top: 0.5rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.75rem;">
            <span style="color: var(--text-muted);">${isTodas ? 'Custo Anual Consolidado:' : 'Custo Anual Total:'}</span>
            <strong id="kpiCisaDespesaAno" style="color: var(--text-title); font-weight: 800;">R$ 0,00</strong>
          </div>
        </div>

        <!-- KPI 3: Resultado Operacional Médio -->
        <div class="card kpi-card" style="border-top: 4px solid #059669; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <span class="kpi-label">${isTodas ? 'Resultado Operacional Médio (Consolidado)' : 'Resultado Operacional Médio'}</span>
              <div class="card-icon" style="background: rgba(16, 185, 129, 0.12); color: #059669;">
                <i data-lucide="trending-up" style="width: 20px; height: 20px;"></i>
              </div>
            </div>
            <div class="kpi-value" id="kpiCisaResultado" style="color: #059669; font-size: 1.85rem; margin: 0.65rem 0 0.25rem 0;">
              Aguardando valores
            </div>
            <div class="kpi-subtext" style="color: var(--text-muted); font-size: 0.78rem;">
              <span>Margem Líquida: <strong id="kpiCisaMargemTxt" style="color: #059669; font-weight: 800;">77,8%</strong></span>
              <span style="margin: 0 4px;">•</span>
              <span>Break-Even: <strong id="kpiCisaBreakeven" style="color: var(--text-title); font-weight: 800;">22,2%</strong></span>
            </div>
          </div>
          <div style="margin-top: 0.75rem; padding-top: 0.5rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.75rem;">
            <span style="color: var(--text-muted);">${isTodas ? 'Resultado Anual do Programa:' : 'Resultado Anual Líquido:'}</span>
            <strong id="kpiCisaResultadoAno" style="color: #059669; font-weight: 800;">Aguardando valores</strong>
          </div>
        </div>

      </div>

      <!-- 2.5 BARRA DE CONTROLE MENSAL DA PRODUÇÃO CISA -->
      <div class="card cisa-month-bar ${isTodas ? 'theme-todas' : ''}" style="padding: 1rem 1.4rem; border-left: 5px solid ${isTodas ? '#10b981' : '#2563eb'}; background: var(--bg-card); display: flex; flex-direction: column; gap: 0.85rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <div style="width: 34px; height: 34px; border-radius: 8px; background: ${isTodas ? 'rgba(16,185,129,0.12)' : 'rgba(37,99,235,0.12)'}; color: ${isTodas ? '#059669' : '#2563eb'}; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="calendar" style="width: 18px; height: 18px;"></i>
            </div>
            <div>
              <div style="font-weight: 800; color: var(--text-title); font-size: 0.95rem; line-height: 1.2;">
                Controle Mensal da Produção & Repasse CISA · Exercício 2026
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">
                Selecione o mês de competência para lançar a produção física (Qtd), faturamento e apurar a divisão de valores
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span class="badge" id="cisaMonthKpiBadge" style="background: ${isTodas ? 'rgba(16,185,129,0.12)' : 'rgba(37,99,235,0.1)'}; color: ${isTodas ? '#059669' : '#2563eb'}; font-weight: 800; font-size: 0.78rem; padding: 0.35rem 0.75rem; border-radius: 99px; border: 1px solid ${isTodas ? 'rgba(16,185,129,0.25)' : 'rgba(37,99,235,0.2)'}; display: inline-flex; align-items: center; gap: 6px;">
              <i data-lucide="calendar-check" style="width: 13px; height: 13px;"></i>
              <span id="cisaMonthSelectedLabel">COMPETÊNCIA: ${curMonthObj.nome.toUpperCase()} / 2026</span>
            </span>
          </div>
        </div>

        <!-- Tira de 12 Meses (Pills) -->
        <div style="display: flex; gap: 0.45rem; flex-wrap: wrap; align-items: center;">
          ${CISA_MESES.map(m => `
            <button type="button" class="cisa-month-pill ${m.id === curMonth ? 'active' : ''}" data-month="${m.id}" style="flex: 1 1 calc(8.33% - 0.45rem); min-width: 68px; text-align: center; padding: 7px 6px; border-radius: 8px; font-size: 0.78rem; font-weight: 800; border: 1px solid var(--border-color); background: var(--bg-card); cursor: pointer; transition: all 0.15s ease;">
              <div style="font-size: 0.8rem; font-weight: 800;">${m.sigla}</div>
              <div class="cisa-month-subval" id="cisaMonthSub_${m.id}" style="font-size: 0.65rem; font-weight: 600; opacity: 0.8; margin-top: 2px;">—</div>
            </button>
          `).join('')}
        </div>
      </div>

      ${isTodas ? `
        <!-- QUADRO EXECUTIVO DE CONSOLIDAÇÃO POR ESPECIALIDADE -->
        <div class="card" style="padding: 1.5rem; width: 100%; box-sizing: border-box; border-left: 5px solid #10b981;">
          <div class="card-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div class="card-title-group">
              <div class="card-icon" style="background: rgba(16, 185, 129, 0.12); color: #059669;">
                <i data-lucide="layers" style="width: 20px; height: 20px;"></i>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: var(--text-title);">
                  Quadro de Consolidação das Especialidades CISA
                </h3>
                <span style="font-size: 0.82rem; color: var(--text-muted);">
                  Demonstrativo analítico consolidado por linha de cuidado contratualizada com o Consórcio Regional
                </span>
              </div>
            </div>
            <span class="badge" style="background: rgba(16, 185, 129, 0.12); color: #059669; font-weight: 800; font-size: 0.72rem; padding: 0.35rem 0.65rem; border-radius: 99px;">
              PROGRAMA REGIONAL CISA
            </span>
          </div>

          <div class="table-responsive" style="overflow-x: auto;">
            <table class="cisa-table-modern">
              <thead>
                <tr>
                  <th style="min-width: 220px;">Especialidade CISA</th>
                  <th style="width: 140px; text-align: center;">Procedimentos</th>
                  <th style="width: 150px; text-align: center;">Status Cotação</th>
                  <th style="width: 160px; text-align: right;">Receita Estimada/mês</th>
                  <th style="width: 160px; text-align: right;">Custo Fixo/mês</th>
                  <th style="width: 160px; text-align: right;">Saldo Estimado/mês</th>
                  <th style="width: 110px; text-align: center;">Ações</th>
                </tr>
              </thead>
              <tbody id="tbCisaConsolidacaoBody"></tbody>
              <tfoot>
                <tr style="background: rgba(16, 185, 129, 0.06); font-weight: 800; border-top: 2px solid rgba(16, 185, 129, 0.25);">
                  <td style="padding: 14px 18px; color: #059669; font-size: 0.88rem;">TOTAL DO PROGRAMA CISA</td>
                  <td id="totConsolQtdProcs" style="padding: 14px 18px; text-align: center; color: var(--text-title); font-size: 0.88rem;">—</td>
                  <td id="totConsolStatus" style="padding: 14px 18px; text-align: center; color: var(--text-title); font-size: 0.82rem;">—</td>
                  <td id="totConsolReceita" style="padding: 14px 18px; text-align: right; color: #2563eb; font-size: 1rem; font-weight: 800;">—</td>
                  <td id="totConsolCusto" style="padding: 14px 18px; text-align: right; color: #dc2626; font-size: 1rem; font-weight: 800;">—</td>
                  <td id="totConsolSaldo" style="padding: 14px 18px; text-align: right; color: #059669; font-size: 1.05rem; font-weight: 800;">—</td>
                  <td style="text-align: center; padding: 14px 18px;">
                    <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-size: 0.68rem; font-weight: 800;">CONSOLIDADO</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- 3. GRADE PRINCIPAL: TABELAS EXECUTIVAS EMPILHADAS VERTICALMENTE -->
      <div style="display: flex; flex-direction: column; gap: 1.75rem;">
        
        <!-- 3.1 TABELA VERDE: PROCEDIMENTOS DO CONTRATO CISA (LARGURA TOTAL 100%) -->
        <div class="card" style="padding: 1.5rem; width: 100%; box-sizing: border-box;">
          <div class="card-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
            <div class="card-title-group">
              <div class="card-icon" style="background: rgba(37, 99, 235, 0.12); color: #2563eb;">
                <i data-lucide="calculator" style="width: 20px; height: 20px;"></i>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: var(--text-title);">
                  ${isTodas ? 'Tabela Geral de Procedimentos e Valores Pactuados (Todas as Especialidades CISA)' : 'Tabela de Procedimentos e Valores Pactuados (Contrato CISA)'}
                </h3>
                <span style="font-size: 0.82rem; color: var(--text-muted);">
                  ${isTodas ? 'Procedimentos ambulatoriais e cirúrgicos com codificação própria oficial do Consórcio CISA' : 'Procedimentos oftalmológicos com codificação própria oficial do Consórcio CISA'}
                </span>
              </div>
            </div>
          </div>

          <div class="table-responsive" style="overflow-x: auto;">
            <table class="cisa-table-modern">
              <thead>
                <tr>
                  <th style="width: 100px;">Código</th>
                  <th style="min-width: 380px;">Procedimento</th>
                  <th style="width: 80px; text-align: center;">Qtd</th>
                  <th style="width: 140px; text-align: right;">R$ Unitário</th>
                  <th style="width: 150px; text-align: right;">Total/mês</th>
                  <th style="width: 130px; text-align: center;">Status</th>
                  <th style="min-width: 180px; text-align: center;">Prestador</th>
                </tr>
              </thead>
              <tbody id="tbCisaProcs"></tbody>
              <tfoot>
                <tr style="background: rgba(37, 99, 235, 0.05); font-weight: 800; border-top: 2px solid rgba(37, 99, 235, 0.2);">
                  <td colspan="4" style="padding: 14px 18px; color: #2563eb; font-size: 0.88rem;">
                    ${isTodas ? 'SOMA DA RECEITA ESTIMADA PACTUADA (PROGRAMA CISA COMPLETO)' : 'SOMA DA RECEITA ESTIMADA PACTUADA (TABELA CISA)'}
                  </td>
                  <td id="totCisaRec" style="padding: 14px 18px; text-align: right; color: #2563eb; font-size: 1.05rem; font-weight: 800;">
                    Aguardando valores
                  </td>
                  <td colspan="2"></td>
                </tr>
                <tr id="cisaDoctorBreakdownRow" style="background: rgba(248, 250, 252, 0.95); font-size: 0.82rem; border-top: 1px dashed rgba(37, 99, 235, 0.25);">
                  <td colspan="7" style="padding: 10px 18px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                      <span style="font-weight: 800; color: var(--text-muted); text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
                        <i data-lucide="users" style="width: 14px; height: 14px; color: #2563eb;"></i> Subtotais por Médico Prestador:
                      </span>
                      <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
                        <span class="badge" style="background: rgba(37, 99, 235, 0.08); color: #2563eb; font-weight: 700; padding: 5px 12px; border-radius: 99px; border: 1px solid rgba(37, 99, 235, 0.25); display: inline-flex; align-items: center; gap: 6px;">
                          <i data-lucide="user-check" style="width: 13px; height: 13px;"></i> Dr. Christian Pretto: <strong id="cisaSubtotChristian" style="font-size: 0.88rem; margin-left: 2px;">R$ 0,00</strong> (<span id="cisaQtdChristian">0</span> exames)
                        </span>
                        <span class="badge" style="background: rgba(16, 185, 129, 0.08); color: #059669; font-weight: 700; padding: 5px 12px; border-radius: 99px; border: 1px solid rgba(16, 185, 129, 0.25); display: inline-flex; align-items: center; gap: 6px;">
                          <i data-lucide="user-check" style="width: 13px; height: 13px;"></i> Dr. Heron Gomes Correia: <strong id="cisaSubtotHeron" style="font-size: 0.88rem; margin-left: 2px;">R$ 0,00</strong> (<span id="cisaQtdHeron">0</span> exames)
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Nota Técnica do Contrato -->
          <div style="margin-top: 1.25rem; background: rgba(37, 99, 235, 0.04); border-left: 3px solid #2563eb; padding: 0.85rem 1.15rem; border-radius: 0 6px 6px 0; font-size: 0.82rem; color: var(--text-main); line-height: 1.55;">
            ${isTodas
              ? '<strong>Codificação Própria CISA:</strong> Relação consolidada dos procedimentos de todas as especialidades pactuadas junto ao Consórcio Intermunicipal de Saúde (CISA). Os valores unitários encontram-se em fase de cotação e pactuação formal com os municípios consorciados.'
              : '<strong>Codificação Própria CISA:</strong> Os códigos e procedimentos acima seguem a tabela oficial do Consórcio Intermunicipal de Saúde (CISA), compreendendo o Grupo 01 (Consultas Especializadas) e o Grupo 11 (Diagnóstico em Oftalmologia). Os valores pactuados unitários encontram-se em branco e serão preenchidos conforme o contrato formal.'}
          </div>
        </div>

        <!-- 3.2 TABELA VERMELHA: RATEIO DE CUSTOS OPERACIONAIS AMBULATORIAIS (LARGURA TOTAL 100% ABAIXO DA VERDE) -->
        <div class="card" id="cardCisaCustosRateio" style="padding: 1.5rem; width: 100%; box-sizing: border-box;">
          <div class="card-header cisa-custos-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1.15rem; margin-bottom: 1.15rem; display: flex; justify-content: space-between; align-items: center; gap: 1.25rem;">
            <!-- Canto Superior Esquerdo: Logo do Hospital + Título Oficial -->
            <div style="display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0;">
              <div class="cisa-hbp-logo-wrap" style="width: 58px; height: 58px; border-radius: 12px; overflow: hidden; border: 1.5px solid rgba(16, 185, 129, 0.35); background: #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06); flex-shrink: 0; padding: 2px;">
                <img src="logo_hbp.jpg" alt="Hospital Bom Pastor - Santo Augusto" style="width: 100%; height: 100%; object-fit: contain;">
              </div>
              <div style="min-width: 0;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 3px; flex-wrap: wrap;">
                  <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #059669; background: rgba(16, 185, 129, 0.1); padding: 2px 8px; border-radius: 4px;">Hospital Bom Pastor • Santo Augusto</span>
                  <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted);">|</span>
                  <span style="font-size: 0.72rem; font-weight: 700; color: #dc2626; background: rgba(239, 68, 68, 0.08); padding: 2px 8px; border-radius: 4px;">CISA / Oftalmologia</span>
                </div>
                <h3 style="margin: 0; font-size: 1.18rem; font-weight: 800; color: var(--text-title); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${isTodas ? 'Rateio de Custos Operacionais Ambulatoriais (Todas as Especialidades)' : 'Rateio de Custos Operacionais Ambulatoriais'}
                </h3>
                <span style="font-size: 0.82rem; color: var(--text-muted); display: block;">
                  ${isTodas ? 'Custos operacionais compartilhados e rateados proporcionalmente entre os diversos ambulatórios que dividem a mesma estrutura' : 'Custos operacionais e de apoio rateados proporcionalmente entre os ambulatórios especializados que dividem a mesma estrutura física e operacional'}
                </span>
              </div>
            </div>

            <!-- Canto Superior Direito: Botão Baixar em PDF (Comprovante Documental) -->
            <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
              <button type="button" id="btnExportCisaCustosPDF" onclick="exportCisaCustosPDF()" class="btn-cisa-pdf-export" title="Gerar comprovante documental oficial em PDF para impressão e arquivamento">
                <i data-lucide="file-down" style="width: 18px; height: 18px;"></i>
                <span>Baixar Comprovante PDF</span>
              </button>
            </div>
          </div>

          <div class="table-responsive" style="overflow-x: auto;">
            <table class="cisa-table-modern">
              <thead>
                <tr>
                  <th style="min-width: 340px;">Função / Recurso Operacional</th>
                  <th style="width: 140px; text-align: center;">Centro de Custo</th>
                  <th style="width: 95px; text-align: center;">Rateio</th>
                  <th style="width: 75px; text-align: center;">Qtd</th>
                  <th style="width: 130px; text-align: right;">R$ Unitário</th>
                  <th style="width: 150px; text-align: right;">Total/mês</th>
                  <th style="width: 70px; text-align: center;">Ações</th>
                </tr>
              </thead>
              <tbody id="tbCisaCustos"></tbody>
              <tfoot>
                <tr style="background: rgba(239, 68, 68, 0.05); font-weight: 800; border-top: 2px solid rgba(239, 68, 68, 0.2);">
                  <td colspan="5" style="padding: 14px 18px; color: #dc2626; font-size: 0.88rem;">
                    SUBTOTAL DE CUSTOS OPERACIONAIS RATEADOS PELA OFTALMOLOGIA
                  </td>
                  <td id="totCisaFixo" style="padding: 14px 18px; text-align: right; color: #dc2626; font-size: 1.05rem; font-weight: 800;">
                    R$ 0,00
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Área de Destaque: Versão para Aprovação -->
          <div class="cisa-aprovacao-box">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(217, 119, 6, 0.15); color: #b45309; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(217, 119, 6, 0.3);">
                  <i data-lucide="file-check-2" style="width: 22px; height: 22px;"></i>
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 3px;">
                    <span class="cisa-aprovacao-pill">
                      <i data-lucide="alert-circle" style="width: 13px; height: 13px;"></i> Versão para Aprovação
                    </span>
                    <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">• Documento Preliminar para Deliberação</span>
                  </div>
                  <p style="margin: 0; font-size: 0.85rem; color: var(--text-main); font-weight: 500; line-height: 1.45;">
                    Memória de cálculo dos custos operacionais rateados e provisão de encargos ambulatoriais submetida à deliberação e homologação formal entre a <strong>Direção Hospitalar / Provedoria</strong> e o <strong>Corpo Clínico Prestador (Oftalmologia)</strong>.
                  </p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px; background: var(--bg-card); padding: 8px 14px; border-radius: 8px; border: 1px solid var(--border-color); box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="text-align: right;">
                  <span style="font-size: 0.70rem; text-transform: uppercase; font-weight: 800; color: var(--text-muted); display: block; letter-spacing: 0.5px;">Status do Demonstrativo</span>
                  <span style="font-size: 0.82rem; font-weight: 800; color: #d97706; display: inline-flex; align-items: center; gap: 5px;">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background: #d97706; display: inline-block;"></span>
                    Aguardando Aprovação Formal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3.3 REGRA DE NEGOCIAÇÃO | ESTUDO DE VIABILIDADE CISA -->
        <div class="card cisa-neg-card" id="cisaRegraNegCard" style="padding: 0; overflow: hidden; width: 100%; box-sizing: border-box; border: 1px solid var(--border-color);">
          <div class="cisa-neg-header" style="padding: 14px 20px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: var(--bg-card);">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <h3 style="margin: 0; font-size: 0.95rem; font-weight: 800; letter-spacing: 0.6px; color: var(--text-title); text-transform: uppercase;">
                REGRA DE NEGOCIAÇÃO <span style="color: var(--text-muted); font-weight: 400; margin: 0 4px;">|</span> ESTUDO DE VIABILIDADE
              </h3>
            </div>
            <span class="cisa-neg-badge" id="cisaRuleBadge">ATIVA</span>
          </div>

          <div style="padding: 16px 20px 0 20px;">
            <p style="margin: 0 0 16px 0; font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
              Define como o custo de cada procedimento é derivado do valor SIGTAP na negociação com a equipe médica. A regra escolhida passa a alimentar a coluna <b>R$ custo</b> da produção.
            </p>

            <!-- Grade de Regras -->
            <div class="cisa-rule-grid" role="group" aria-label="Regra de negociação">
              <!-- 1. 50% Margem Hospitalar -->
              <button type="button" class="cisa-rule-card" data-rule="margem50" aria-pressed="false">
                <div class="cisa-rule-head">
                  <span class="cisa-rule-dot"></span>
                  <span class="cisa-rule-name">50% Margem Hospitalar</span>
                </div>
                <div class="cisa-rule-desc">O hospital retém metade do valor de cada procedimento; a outra metade remunera a equipe executora.</div>
                <div class="cisa-rule-formula">custo = Receita × 50%</div>
              </button>

              <!-- 2. Rateio 80% / 20% -->
              <button type="button" class="cisa-rule-card" data-rule="rateio8020" aria-pressed="true">
                <div class="cisa-rule-head">
                  <span class="cisa-rule-dot"></span>
                  <span class="cisa-rule-name">Rateio 80% / 20%</span>
                </div>
                <div class="cisa-rule-desc">Após a retirada das despesas operacionais, o resultado líquido é dividido entre 80% para os prestadores e 20% para o hospital.</div>
                <div class="cisa-rule-formula">repasse médico = saldo líquido × 80%</div>
              </button>

              <!-- 3. Nova Regra Personalizada -->
              <button type="button" class="cisa-rule-card cisa-rule-add" id="cisaAddRule" title="Disponível em versão futura">
                <span class="cisa-plus">+</span>
                <span class="cisa-rule-name" style="font-size: 11.5px;">Nova regra</span>
                <span class="cisa-rule-desc" style="font-size: 10.5px;">Personalizada</span>
              </button>
            </div>


            <!-- Nota Explicativa da Regra -->
            <div class="cisa-rule-note" id="cisaRuleNote">
              <strong>Rateio 80% / 20%.</strong> Após a retirada de todas as despesas operacionais, o resultado líquido apurado é dividido na proporção de 80% para os prestadores médicos e 20% para o hospital.
            </div>
          </div>

          <!-- Pool / Faixa de Resultado (Dark Bar) -->
          <div class="cisa-pool" id="cisaPoolBox">
            <div class="cisa-pool-item">
              <span class="cisa-pl">RECEITA TOTAL</span>
              <span class="cisa-pv" id="cisaPoolRec">—</span>
            </div>
            <span class="cisa-pool-op">−</span>
            <div class="cisa-pool-item">
              <span class="cisa-pl">DESPESA TOTAL</span>
              <span class="cisa-pv" id="cisaPoolDes">—</span>
            </div>
            <span class="cisa-pool-op">=</span>
            <div class="cisa-pool-item cisa-forte">
              <span class="cisa-pl">RESULTADO A RATEAR</span>
              <span class="cisa-pv" id="cisaPoolLiq">—</span>
            </div>
          </div>

          <!-- Split: 2 Colunas (Hospital vs Prestador) -->
          <!-- Split: 2 Colunas (Receitas vs Despesas) -->
          <div class="cisa-split" id="cisaSplitBox">
            <!-- Coluna RECEITAS -->
            <div class="cisa-side cisa-hosp" style="display: flex; flex-direction: column;">
              <h3><span class="cisa-sq" style="background: #2563eb;"></span>■ RECEITAS</h3>
              <div class="cisa-kv" id="cisaHStream">
                <span class="cisa-k">Incentivo ASSISTIR</span><span class="cisa-v" id="cisaHInc">R$&nbsp;0,00</span>
                <span class="cisa-k">Produção Tabela CISA</span><span class="cisa-v" id="cisaHProd" style="color: #2563eb; font-weight: 700;">—</span>
              </div>
              <div class="cisa-res" style="margin-top: auto;">
                <span class="cisa-lb">RESULTADO MENSAL</span>
                <span class="cisa-vl" id="cisaHRes" style="color: #10b981;">—</span>
              </div>
            </div>

            <!-- Coluna DESPESAS -->
            <div class="cisa-side cisa-pres" style="display: flex; flex-direction: column;">
              <h3><span class="cisa-sq" style="background: #dc2626;"></span>■ DESPESAS</h3>
              <div class="cisa-kv" id="cisaPStream">
                <span class="cisa-k">Despesas de Pessoal</span><span class="cisa-v" id="cisaDPessoal" style="color: #dc2626; font-weight: 700;">—</span>
                <span class="cisa-k">Sistema Hospitalar TASY</span><span class="cisa-v" id="cisaDTasy" style="color: #dc2626; font-weight: 700;">—</span>
                <span class="cisa-k">Manutenção e infra predial (tx de sala)</span><span class="cisa-v" id="cisaDInfra" style="color: #dc2626; font-weight: 700;">—</span>
                <div id="cisaBlockRateio80" style="display: contents;">
                  <span class="cisa-sep" style="grid-column: 1 / -1; margin: 4px 0; border-top: 1px dashed #cbd5e1;"></span>
                  <span class="cisa-k" style="font-weight: 700; color: var(--text-title);">Subtotal das Despesas</span><span class="cisa-v" id="cisaDSubtotal" style="color: #dc2626; font-weight: 700;">—</span>
                  <span class="cisa-k" style="font-weight: 700; color: #b91c1c;">Rateio 80% Médico</span><span class="cisa-v" id="cisaDRateioMed" style="color: #dc2626; font-weight: 700;">—</span>
                </div>
              </div>
              <div class="cisa-res" style="margin-top: auto;">
                <span class="cisa-lb">TOTAL DA DESPESA</span>
                <span class="cisa-vl" id="cisaPRes2" style="color: #dc2626;">—</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- 4. FOOTER INSTITUCIONAL -->
      <div class="card" style="padding: 1rem 1.5rem; background: var(--bg-card-hover); font-size: 0.78rem; color: var(--text-muted); line-height: 1.6;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <strong>Base Normativa:</strong> Contrato de Rateio e Termo de Pactuação do Consórcio Intermunicipal de Saúde (CISA) nº 03/2026 · Contrato de Rateio Intermunicipal · Santa Casa de Caridade de Bagé.
          </div>
          <div style="font-weight: 700; color: #2563eb;">
            Sistema de Gestão & Viabilidade SUS © 2026
          </div>
        </div>
      </div>

    </div>
  `;

  initCisaInteractiveSimulation(key);
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

// ----------------------------------------------------------------------------
// 2. MOTOR INTERATIVO DE CÁLCULO E CONTROLES CISA
// ----------------------------------------------------------------------------
function initCisaInteractiveSimulation(currentKey) {
  if (!currentKey) currentKey = window.currentCisaKey || 'todas';
  const isTodas = (currentKey === 'todas');
  const root = document.getElementById('cisaNativeDashboard');
  if (!root) return;

  const state = window.activeCisaSim;
  const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  let editingProc = null;
  let editingCusto = null;

  function matchSpec(itemSpec, key) {
    if (!itemSpec || !key) return true;
    const s = itemSpec.toLowerCase();
    const k = key.toLowerCase();
    return s === k || s.startsWith(k) || k.startsWith(s);
  }

  function getFilteredProcs() {
    let raw = isTodas
      ? state.procs
      : state.procs.filter(p => !p.especialidade || matchSpec(p.especialidade, currentKey));

    // No mês de Agosto/26, exibe exclusivamente os procedimentos efetivamente realizados (quantitativo maior que zero)
    if (window.cisaSelectedMonth === '08') {
      raw = raw.filter(p => p.qtd !== undefined && p.qtd !== null && p.qtd !== '' && Number(p.qtd) > 0);
    }

    // Ordena para que o mesmo procedimento realizado por médicos diferentes fique com uma linha abaixo da outra
    return raw.slice().sort((a, b) => {
      const isGrp01A = (a.grupo && (a.grupo.includes('01') || a.grupo.includes('Consultas'))) || a.cod === '00483';
      const isGrp01B = (b.grupo && (b.grupo.includes('01') || b.grupo.includes('Consultas'))) || b.cod === '00483';
      if (isGrp01A !== isGrp01B) return isGrp01A ? -1 : 1;

      const codA = String(a.cod || '');
      const codB = String(b.cod || '');
      if (codA !== codB) return codA.localeCompare(codB);

      const prestA = String(a.prestador || '');
      const prestB = String(b.prestador || '');
      return prestA.localeCompare(prestB);
    });
  }

  function getFilteredCustos() {
    return isTodas
      ? state.custos
      : state.custos.filter(c => !c.especialidade || matchSpec(c.especialidade, currentKey));
  }

  function renderProcsTable() {
    const tb = root.querySelector('#tbCisaProcs');
    if (!tb) return;
    tb.innerHTML = '';

    const list = getFilteredProcs();
    let lastGroupKey = null;

    list.forEach((p) => {
      const isGroup01 = (p.grupo && (p.grupo.includes('01') || p.grupo.includes('Consultas'))) || p.cod === '00483';
      const specName = p.especialidade || 'Oftalmologia';
      const currentGroupKey = isTodas ? `${specName}__${isGroup01 ? '01' : '11'}` : (isGroup01 ? '01' : '11');

      if (currentGroupKey !== lastGroupKey) {
        lastGroupKey = currentGroupKey;
        const trGroup = document.createElement('tr');
        trGroup.className = 'cisa-group-row';

        const tdGroup = document.createElement('td');
        tdGroup.colSpan = 7;

        const groupTitle = isGroup01
          ? '01 · Consultas especializadas'
          : '11 · Diagnóstico em oftalmologia';
        const displayGroup = isTodas ? `${specName} · ${groupTitle}` : groupTitle;
        const groupIcon = isGroup01 ? 'stethoscope' : 'eye';

        tdGroup.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 0.55rem;">
              <i data-lucide="${groupIcon}" style="width: 16px; height: 16px;"></i>
              <span>${displayGroup}</span>
            </div>
            ${isTodas ? `<span style="background: rgba(37, 99, 235, 0.15); color: #2563eb; font-size: 0.65rem; font-weight: 800; padding: 2px 8px; border-radius: 99px;">${specName.toUpperCase()}</span>` : ''}
          </div>
        `;
        trGroup.appendChild(tdGroup);
        tb.appendChild(trGroup);
      }

      const tr = document.createElement('tr');
      tr.className = 'cisa-row';

      const isEditing = (editingProc === p);

      if (isEditing) {
        // MODO DE EDIÇÃO INLINE
        tr.style.background = 'rgba(99, 102, 241, 0.05)';

        // 1. Código
        const tdCod = document.createElement('td');
        tdCod.className = 'cisa-cell';
        const inCod = document.createElement('input');
        inCod.className = 'cisa-inline-input';
        inCod.style.width = '75px';
        inCod.value = p.cod || '';
        tdCod.appendChild(inCod);
        tr.appendChild(tdCod);

        // 2. Procedimento
        const tdDesc = document.createElement('td');
        tdDesc.className = 'cisa-cell';
        const inDesc = document.createElement('input');
        inDesc.className = 'cisa-inline-input';
        inDesc.style.width = '100%';
        inDesc.style.minWidth = '260px';
        inDesc.value = p.desc || '';
        tdDesc.appendChild(inDesc);
        tr.appendChild(tdDesc);

        // 3. Qtd
        const tdQtd = document.createElement('td');
        tdQtd.className = 'cisa-cell';
        tdQtd.style.textAlign = 'center';
        const inQtd = document.createElement('input');
        inQtd.type = 'number';
        inQtd.step = '1';
        inQtd.min = '0';
        inQtd.className = 'cisa-inline-input';
        inQtd.style.width = '60px';
        inQtd.style.textAlign = 'center';
        inQtd.value = (p.qtd !== undefined && p.qtd !== null && p.qtd !== '') ? p.qtd : 1;
        tdQtd.appendChild(inQtd);
        tr.appendChild(tdQtd);

        // 4. Valor Unitário (R$)
        const tdVal = document.createElement('td');
        tdVal.className = 'cisa-cell';
        tdVal.style.textAlign = 'right';
        const inVal = document.createElement('input');
        inVal.type = 'number';
        inVal.step = '0.01';
        inVal.min = '0';
        inVal.placeholder = '0,00';
        inVal.className = 'cisa-inline-input';
        inVal.style.width = '110px';
        inVal.style.textAlign = 'right';
        inVal.value = (p.val !== null && p.val !== undefined && p.val !== '') ? p.val : '';
        tdVal.appendChild(inVal);
        tr.appendChild(tdVal);

        // 5. Total/mês
        const tdTot = document.createElement('td');
        tdTot.className = 'cisa-cell';
        tdTot.style.textAlign = 'right';
        tdTot.style.fontWeight = '800';
        tdTot.style.color = '#2563eb';
        const updateTot = () => {
          const q = parseFloat(inQtd.value) || 0;
          const v = parseFloat(inVal.value) || 0;
          if (v > 0 && q > 0) {
            tdTot.textContent = BRL.format(q * v);
          } else {
            tdTot.textContent = '—';
          }
        };
        tr.appendChild(tdTot);

        // 6. Status Preview
        const tdStatus = document.createElement('td');
        tdStatus.className = 'cisa-cell';
        tdStatus.style.textAlign = 'center';
        const updateStatusPreview = () => {
          const v = inVal.value;
          if (v !== '' && !isNaN(v) && parseFloat(v) > 0) {
            tdStatus.innerHTML = `<span class="cisa-status-badge status-cotado"><i data-lucide="check-circle-2" style="width:14px;height:14px;"></i> Realizado</span>`;
          } else {
            tdStatus.innerHTML = `<span class="cisa-status-badge status-a-definir"><i data-lucide="clock" style="width:14px;height:14px;"></i> A definir</span>`;
          }
          if (window.lucide && lucide.createIcons) lucide.createIcons();
        };
        inQtd.oninput = () => { updateTot(); updateStatusPreview(); };
        inVal.oninput = () => { updateTot(); updateStatusPreview(); };
        updateTot();
        updateStatusPreview();
        tr.appendChild(tdStatus);

        // 7. Prestador e Ações (Edição)
        const tdPrest = document.createElement('td');
        tdPrest.className = 'cisa-cell';
        tdPrest.style.textAlign = 'center';
        const prestadorAtual = p.prestador || 'Dr. Christian Pretto';
        tdPrest.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 4px; align-items: center;">
            <select class="cisa-prestador-select-edit" style="font-size: 0.75rem; font-weight: 700; padding: 3px 6px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-title); width: 100%; min-width: 150px;">
              <option value="Dr. Christian Pretto" ${!prestadorAtual.includes('Heron') ? 'selected' : ''}>Dr. Christian Pretto</option>
              <option value="Dr. Heron Gomes Correia" ${prestadorAtual.includes('Heron') ? 'selected' : ''}>Dr. Heron Gomes Correia</option>
            </select>
            <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
              <button class="btn-cisa-action btn-cisa-save" title="Salvar alterações">
                <i data-lucide="check" style="width:14px;height:14px;"></i>
              </button>
              <button class="btn-cisa-action btn-cisa-cancel" title="Cancelar">
                <i data-lucide="x" style="width:14px;height:14px;"></i>
              </button>
              <button class="btn-cisa-action btn-cisa-del" title="Excluir procedimento">
                <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
              </button>
            </div>
          </div>
        `;
        const inPrestEdit = tdPrest.querySelector('.cisa-prestador-select-edit');
        tdPrest.querySelector('.btn-cisa-save').onclick = () => {
          p.cod = inCod.value.trim();
          p.desc = inDesc.value.trim();
          p.qtd = inQtd.value !== '' ? (parseFloat(inQtd.value) || 0) : 1;
          p.val = inVal.value !== '' ? parseFloat(inVal.value) : null;
          p.prestador = inPrestEdit.value;
          editingProc = null;
          saveCisaMonthlyStore();
          renderProcsTable();
          recalc();
        };
        tdPrest.querySelector('.btn-cisa-cancel').onclick = () => {
          editingProc = null;
          renderProcsTable();
        };
        tdPrest.querySelector('.btn-cisa-del').onclick = () => {
          const realIdx = state.procs.indexOf(p);
          if (realIdx !== -1) state.procs.splice(realIdx, 1);
          editingProc = null;
          saveCisaMonthlyStore();
          renderProcsTable();
          recalc();
        };
        tr.appendChild(tdPrest);

      } else {
        // MODO VISUALIZAÇÃO LIMPO COM EDIÇÃO RÁPIDA DE PRODUÇÃO
        const qVal = (p.qtd !== undefined && p.qtd !== null && p.qtd !== '') ? p.qtd : 0;
        const hasVal = (p.val !== null && p.val !== undefined && p.val !== '' && !isNaN(p.val) && Number(p.val) > 0);

        // 1. Código
        const tdCod = document.createElement('td');
        tdCod.className = 'cisa-cell';
        tdCod.innerHTML = `<span class="cisa-cell-code">${p.cod || '—'}</span>`;
        tr.appendChild(tdCod);

        // 2. Procedimento
        const tdDesc = document.createElement('td');
        tdDesc.className = 'cisa-cell';
        tdDesc.innerHTML = `<span class="cisa-cell-desc">${p.desc || '—'}</span>`;
        tr.appendChild(tdDesc);

        // 3. Qtd (Lançamento Mensal Rápido)
        const tdQtd = document.createElement('td');
        tdQtd.className = 'cisa-cell';
        tdQtd.style.textAlign = 'center';
        tdQtd.innerHTML = `
          <input type="number" min="0" step="1" class="cisa-inline-input cisa-qtd-input" value="${qVal}" title="Alterar quantidade produzida neste mês" style="width: 58px; text-align: center; font-weight: 700; padding: 3px 5px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-title); font-size: 0.85rem;">
        `;
        const inQtdQuick = tdQtd.querySelector('.cisa-qtd-input');
        inQtdQuick.oninput = (e) => {
          const newQ = Math.max(0, parseInt(e.target.value) || 0);
          p.qtd = newQ;
          saveCisaMonthlyStore();
          if (hasVal) {
            tdTot.innerHTML = `<strong style="color: #2563eb; font-size: 0.92rem;">${BRL.format(newQ * p.val)}</strong>`;
          }
          recalc();
        };
        tr.appendChild(tdQtd);

        // 4. Valor Unitário (R$)
        const tdVal = document.createElement('td');
        tdVal.className = 'cisa-cell';
        tdVal.style.textAlign = 'right';
        if (hasVal) {
          tdVal.innerHTML = `<span class="cisa-cell-val">${BRL.format(p.val)}</span>`;
        } else {
          tdVal.innerHTML = `<span class="cisa-val-empty">—</span>`;
        }
        tr.appendChild(tdVal);

        // 5. Total/mês
        const tdTot = document.createElement('td');
        tdTot.className = 'cisa-cell';
        tdTot.style.textAlign = 'right';
        if (hasVal) {
          tdTot.innerHTML = `<strong style="color: #2563eb; font-size: 0.92rem;">${BRL.format(qVal * p.val)}</strong>`;
        } else {
          tdTot.innerHTML = `<span class="cisa-val-empty">—</span>`;
        }
        tr.appendChild(tdTot);

        // 6. Status
        const tdStatus = document.createElement('td');
        tdStatus.className = 'cisa-cell';
        tdStatus.style.textAlign = 'center';
        if (hasVal) {
          tdStatus.innerHTML = `<span class="cisa-status-badge status-cotado"><i data-lucide="check-circle-2" style="width:14px;height:14px;"></i> Realizado</span>`;
        } else {
          tdStatus.innerHTML = `<span class="cisa-status-badge status-a-definir"><i data-lucide="clock" style="width:14px;height:14px;"></i> A definir</span>`;
        }
        tr.appendChild(tdStatus);

        // 7. Prestador (Médico Oftalmologista)
        const tdPrest = document.createElement('td');
        tdPrest.className = 'cisa-cell';
        tdPrest.style.textAlign = 'center';
        const prestadorAtual = p.prestador || 'Dr. Christian Pretto';
        const isHeron = prestadorAtual.includes('Heron');
        tdPrest.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center;">
            <select class="cisa-prestador-select" title="Médico Oftalmologista Responsável" style="font-size: 0.78rem; font-weight: 700; padding: 4px 8px; border-radius: 6px; border: 1px solid ${isHeron ? 'rgba(16, 185, 129, 0.4)' : 'rgba(37, 99, 235, 0.4)'}; background: ${isHeron ? 'rgba(16, 185, 129, 0.08)' : 'rgba(37, 99, 235, 0.08)'}; color: ${isHeron ? '#047857' : '#1d4ed8'}; cursor: pointer; width: 100%; min-width: 165px; max-width: 195px;">
              <option value="Dr. Christian Pretto" ${!isHeron ? 'selected' : ''}>Dr. Christian Pretto</option>
              <option value="Dr. Heron Gomes Correia" ${isHeron ? 'selected' : ''}>Dr. Heron Gomes Correia</option>
            </select>
          </div>
        `;
        const selPrest = tdPrest.querySelector('.cisa-prestador-select');
        selPrest.onchange = (e) => {
          p.prestador = e.target.value;
          saveCisaMonthlyStore();
          renderProcsTable();
          recalc();
        };
        tr.appendChild(tdPrest);
      }

      tb.appendChild(tr);
    });

    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  function getClassPillHtml(classificacao) {
    const cls = classificacao || 'Pessoal';
    let icon = 'users';
    let slug = 'pessoal';

    if (cls === 'Prestador') {
      icon = 'user-check';
      slug = 'prestador';
    } else if (cls === 'Material') {
      icon = 'package';
      slug = 'material';
    } else if (cls === 'Sistemas TI') {
      icon = 'monitor';
      slug = 'sistemas-ti';
    } else if (cls === 'Taxa de Sala') {
      icon = 'building';
      slug = 'taxa-de-sala';
    } else if (cls === 'Encargos') {
      icon = 'shield-check';
      slug = 'encargos';
    } else {
      icon = 'users';
      slug = 'pessoal';
    }

    return `<span class="cisa-cat-pill cat-${slug}"><i data-lucide="${icon}" style="width: 12px; height: 12px;"></i> ${cls}</span>`;
  }

  function renderCustosTable() {
    const tb = root.querySelector('#tbCisaCustos');
    if (!tb) return;
    tb.innerHTML = '';

    const list = getFilteredCustos();

    // Calcula total rateado de Pessoal para a linha de Encargos (30,91%)
    let folhaPessoalRateada = 0;
    list.forEach(c => {
      if (c.classificacao === 'Pessoal') {
        const r = (c.rateio !== undefined && c.rateio !== null && c.rateio !== '') ? parseFloat(c.rateio) : 100;
        const q = (c.qtd !== undefined && c.qtd !== null && c.qtd !== '') ? parseFloat(c.qtd) : 0;
        const v = (c.val || 0);
        folhaPessoalRateada += (q * v * (r / 100));
      }
    });
    const valEncargos = folhaPessoalRateada * 0.3091;

    list.forEach((c, idx) => {
      const tr = document.createElement('tr');
      tr.className = 'cisa-row';

      const isEditing = (editingCusto === c);
      const rateioVal = (c.rateio !== undefined && c.rateio !== null && c.rateio !== '') ? parseFloat(c.rateio) : 100;
      const qVal = (c.qtd !== undefined && c.qtd !== null && c.qtd !== '') ? parseFloat(c.qtd) : 0;
      const uVal = (c.val !== undefined && c.val !== null && c.val !== '') ? parseFloat(c.val) : 0;
      const curClass = c.classificacao || 'Pessoal';

      if (isEditing) {
        tr.style.background = 'rgba(239, 68, 68, 0.05)';

        // 1. Função / Item
        const tdItem = document.createElement('td');
        tdItem.className = 'cisa-cell';
        const inItem = document.createElement('input');
        inItem.className = 'cisa-inline-input';
        inItem.style.width = '100%';
        inItem.value = c.item || '';
        tdItem.appendChild(inItem);
        tr.appendChild(tdItem);

        // 2. Classificação (Select de Edição)
        const tdClass = document.createElement('td');
        tdClass.className = 'cisa-cell';
        tdClass.style.textAlign = 'center';
        tdClass.innerHTML = `
          <select class="cisa-class-select-edit" style="font-size: 0.75rem; font-weight: 700; padding: 4px 6px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-title); width: 100%;">
            <option value="Prestador" ${curClass === 'Prestador' ? 'selected' : ''}>Prestador</option>
            <option value="Pessoal" ${curClass === 'Pessoal' ? 'selected' : ''}>Pessoal</option>
            <option value="Material" ${curClass === 'Material' ? 'selected' : ''}>Material</option>
            <option value="Sistemas TI" ${curClass === 'Sistemas TI' ? 'selected' : ''}>Sistemas TI</option>
            <option value="Taxa de Sala" ${curClass === 'Taxa de Sala' ? 'selected' : ''}>Taxa de Sala</option>
          </select>
        `;
        const inClassEdit = tdClass.querySelector('.cisa-class-select-edit');
        tr.appendChild(tdClass);

        // 3. Rateio (%)
        const tdRateio = document.createElement('td');
        tdRateio.className = 'cisa-cell';
        tdRateio.style.textAlign = 'center';
        const inRateio = document.createElement('input');
        inRateio.type = 'number';
        inRateio.step = '5';
        inRateio.min = '0';
        inRateio.max = '100';
        inRateio.className = 'cisa-inline-input';
        inRateio.style.width = '55px';
        inRateio.style.textAlign = 'center';
        inRateio.value = rateioVal;
        tdRateio.appendChild(inRateio);
        tr.appendChild(tdRateio);

        // 4. Qtd
        const tdQtd = document.createElement('td');
        tdQtd.className = 'cisa-cell';
        tdQtd.style.textAlign = 'center';
        const inQtd = document.createElement('input');
        inQtd.type = 'number';
        inQtd.step = '1';
        inQtd.min = '0';
        inQtd.className = 'cisa-inline-input';
        inQtd.style.width = '55px';
        inQtd.style.textAlign = 'center';
        inQtd.value = qVal;
        tdQtd.appendChild(inQtd);
        tr.appendChild(tdQtd);

        // 5. Valor Unitário (R$)
        const tdVal = document.createElement('td');
        tdVal.className = 'cisa-cell';
        tdVal.style.textAlign = 'right';
        const inVal = document.createElement('input');
        inVal.type = 'number';
        inVal.step = '10';
        inVal.min = '0';
        inVal.className = 'cisa-inline-input';
        inVal.style.width = '105px';
        inVal.style.textAlign = 'right';
        inVal.value = uVal;
        tdVal.appendChild(inVal);
        tr.appendChild(tdVal);

        // 6. Total/mês
        const tdTot = document.createElement('td');
        tdTot.className = 'cisa-cell';
        tdTot.style.textAlign = 'right';
        tdTot.style.fontWeight = '800';
        tdTot.style.color = '#dc2626';
        const updateTot = () => {
          const r = parseFloat(inRateio.value) || 0;
          const q = parseFloat(inQtd.value) || 0;
          const v = parseFloat(inVal.value) || 0;
          tdTot.textContent = BRL.format(q * v * (r / 100));
        };
        inRateio.oninput = updateTot;
        inQtd.oninput = updateTot;
        inVal.oninput = updateTot;
        updateTot();
        tr.appendChild(tdTot);

        // 7. Ações
        const tdAct = document.createElement('td');
        tdAct.className = 'cisa-cell';
        tdAct.style.textAlign = 'center';
        tdAct.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
            <button class="btn-cisa-action btn-cisa-save" title="Salvar alterações">
              <i data-lucide="check" style="width:16px;height:16px;"></i>
            </button>
            <button class="btn-cisa-action btn-cisa-cancel" title="Cancelar">
              <i data-lucide="x" style="width:16px;height:16px;"></i>
            </button>
            <button class="btn-cisa-action btn-cisa-del" title="Excluir custo">
              <i data-lucide="trash-2" style="width:15px;height:15px;"></i>
            </button>
          </div>
        `;
        tdAct.querySelector('.btn-cisa-save').onclick = () => {
          c.item = inItem.value.trim();
          c.classificacao = inClassEdit.value;
          c.rateio = parseFloat(inRateio.value) || 0;
          c.qtd = parseFloat(inQtd.value) || 0;
          c.val = parseFloat(inVal.value) || 0;
          editingCusto = null;
          saveCisaMonthlyStore();
          renderCustosTable();
          recalc();
        };
        tdAct.querySelector('.btn-cisa-cancel').onclick = () => {
          editingCusto = null;
          renderCustosTable();
        };
        tdAct.querySelector('.btn-cisa-del').onclick = () => {
          const realIdx = state.custos.indexOf(c);
          if (realIdx !== -1) state.custos.splice(realIdx, 1);
          editingCusto = null;
          saveCisaMonthlyStore();
          renderCustosTable();
          recalc();
        };
        tr.appendChild(tdAct);

      } else {
        // MODO VISUALIZAÇÃO LIMPO
        // 1. Função / Item
        const tdItem = document.createElement('td');
        tdItem.className = 'cisa-cell';
        tdItem.innerHTML = `<span class="cisa-cell-desc">${c.item}</span>`;
        tr.appendChild(tdItem);

        // 2. Classificação (Pill Badge)
        const tdClass = document.createElement('td');
        tdClass.className = 'cisa-cell';
        tdClass.style.textAlign = 'center';
        tdClass.innerHTML = getClassPillHtml(curClass);
        tr.appendChild(tdClass);

        // 3. Rateio (%) (Lançamento Rápido)
        const tdRateio = document.createElement('td');
        tdRateio.className = 'cisa-cell';
        tdRateio.style.textAlign = 'center';
        tdRateio.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
            <input type="number" min="0" max="100" step="5" class="cisa-inline-input cisa-rateio-input" value="${rateioVal}" title="Percentual de rateio para a Oftalmologia" style="width: 50px; text-align: center; font-weight: 700; padding: 3px 4px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-title); font-size: 0.85rem;">
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">%</span>
          </div>
        `;
        const inRateioQuick = tdRateio.querySelector('.cisa-rateio-input');
        inRateioQuick.oninput = (e) => {
          c.rateio = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
          saveCisaMonthlyStore();
          const curR = c.rateio;
          const curQ = (c.qtd !== undefined && c.qtd !== null) ? parseFloat(c.qtd) : 0;
          const curV = (c.val || 0);
          tdTot.innerHTML = `<strong style="color: #dc2626; font-size: 0.92rem;">${BRL.format(curQ * curV * (curR / 100))}</strong>`;
          renderCustosTable();
          recalc();
        };
        tr.appendChild(tdRateio);

        // 4. Qtd (Lançamento Rápido)
        const tdQtd = document.createElement('td');
        tdQtd.className = 'cisa-cell';
        tdQtd.style.textAlign = 'center';
        tdQtd.innerHTML = `
          <input type="number" min="0" step="1" class="cisa-inline-input cisa-qtd-input" value="${qVal}" title="Alterar quantidade para este mês" style="width: 52px; text-align: center; font-weight: 700; padding: 3px 5px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-title); font-size: 0.85rem;">
        `;
        const inCustoQtd = tdQtd.querySelector('.cisa-qtd-input');
        inCustoQtd.oninput = (e) => {
          c.qtd = Math.max(0, parseFloat(e.target.value) || 0);
          saveCisaMonthlyStore();
          const curR = (c.rateio !== undefined && c.rateio !== null) ? parseFloat(c.rateio) : 100;
          const curQ = c.qtd;
          const curV = (c.val || 0);
          tdTot.innerHTML = `<strong style="color: #dc2626; font-size: 0.92rem;">${BRL.format(curQ * curV * (curR / 100))}</strong>`;
          renderCustosTable();
          recalc();
        };
        tr.appendChild(tdQtd);

        // 5. Valor Unitário
        const tdVal = document.createElement('td');
        tdVal.className = 'cisa-cell';
        tdVal.style.textAlign = 'right';
        tdVal.innerHTML = `<span class="cisa-cell-val">${BRL.format(c.val || 0)}</span>`;
        tr.appendChild(tdVal);

        // 6. Total/mês
        const tdTot = document.createElement('td');
        tdTot.className = 'cisa-cell';
        tdTot.style.textAlign = 'right';
        const lineVal = qVal * (c.val || 0) * (rateioVal / 100);
        tdTot.innerHTML = `<strong style="color: #dc2626; font-size: 0.92rem;">${BRL.format(lineVal)}</strong>`;
        tr.appendChild(tdTot);

        // 7. Ação (Editar)
        const tdAct = document.createElement('td');
        tdAct.className = 'cisa-cell';
        tdAct.style.textAlign = 'center';
        tdAct.innerHTML = `
          <button class="btn-cisa-action btn-cisa-edit" title="Editar custo">
            <i data-lucide="pencil" style="width:16px;height:16px;"></i>
          </button>
        `;
        tdAct.querySelector('.btn-cisa-edit').onclick = () => {
          editingCusto = c;
          renderCustosTable();
        };
        tr.appendChild(tdAct);
      }

      tb.appendChild(tr);

      // Ao final do bloco de pessoal (após a última linha de Pessoal), insere a linha especial de Encargos da Folha (30,91%)
      const isPessoal = (c.classificacao === 'Pessoal');
      const isLastPessoal = isPessoal && (!list[idx + 1] || list[idx + 1].classificacao !== 'Pessoal');
      if (isLastPessoal) {
        const trEnc = document.createElement('tr');
        trEnc.className = 'cisa-row cisa-row-encargos';

        // 1. Função / Recurso
        const tdItemEnc = document.createElement('td');
        tdItemEnc.className = 'cisa-cell';
        tdItemEnc.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 26px; height: 26px; border-radius: 6px; background: rgba(37, 99, 235, 0.15); color: #1d4ed8; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="calculator" style="width: 14px; height: 14px;"></i>
            </div>
            <div>
              <strong style="color: #1e40af; font-size: 0.88rem;">Encargos da Folha (Provisão 30,91%)</strong>
              <div style="font-size: 0.72rem; color: var(--text-muted);">
                INSS patronal, FGTS, férias e 13º c/ CEBAS Ativos + Equipe Substituitiva (Base: ${BRL.format(folhaPessoalRateada)})
              </div>
            </div>
          </div>
        `;
        trEnc.appendChild(tdItemEnc);

        // 2. Classificação
        const tdClassEnc = document.createElement('td');
        tdClassEnc.className = 'cisa-cell';
        tdClassEnc.style.textAlign = 'center';
        tdClassEnc.innerHTML = `<span class="cisa-cat-pill cat-encargos"><i data-lucide="shield-check" style="width: 12px; height: 12px;"></i> Encargos</span>`;
        trEnc.appendChild(tdClassEnc);

        // 3. Rateio (%)
        const tdRateioEnc = document.createElement('td');
        tdRateioEnc.className = 'cisa-cell';
        tdRateioEnc.style.textAlign = 'center';
        tdRateioEnc.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
            <span style="font-weight: 800; font-size: 0.85rem; color: #1d4ed8;">30,91</span>
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">%</span>
          </div>
        `;
        trEnc.appendChild(tdRateioEnc);

        // 4. Qtd
        const tdQtdEnc = document.createElement('td');
        tdQtdEnc.className = 'cisa-cell';
        tdQtdEnc.style.textAlign = 'center';
        tdQtdEnc.innerHTML = `<span style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600;">—</span>`;
        trEnc.appendChild(tdQtdEnc);

        // 5. R$ Unitário (Base de Cálculo)
        const tdValEnc = document.createElement('td');
        tdValEnc.className = 'cisa-cell';
        tdValEnc.style.textAlign = 'right';
        tdValEnc.innerHTML = `<span class="cisa-cell-val" style="color: var(--text-muted); font-size: 0.84rem;">${BRL.format(folhaPessoalRateada)}</span>`;
        trEnc.appendChild(tdValEnc);

        // 6. Total/mês
        const tdTotEnc = document.createElement('td');
        tdTotEnc.className = 'cisa-cell';
        tdTotEnc.style.textAlign = 'right';
        tdTotEnc.innerHTML = `<strong style="color: #dc2626; font-size: 0.92rem;">${BRL.format(valEncargos)}</strong>`;
        trEnc.appendChild(tdTotEnc);

        // 7. Ações
        const tdActEnc = document.createElement('td');
        tdActEnc.className = 'cisa-cell';
        tdActEnc.style.textAlign = 'center';
        tdActEnc.innerHTML = `
          <span title="Calculado dinamicamente: 30,91% sobre a folha rateada de pessoal" style="font-size: 0.72rem; font-weight: 700; color: #2563eb; background: rgba(37, 99, 235, 0.08); padding: 3px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px;">
            <i data-lucide="sparkles" style="width: 12px; height: 12px;"></i> Auto
          </span>
        `;
        trEnc.appendChild(tdActEnc);

        tb.appendChild(trEnc);
      }
    });

    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  function recalc() {
    const listProcs = getFilteredProcs();
    const listCustos = getFilteredCustos();

    let totRec = 0;
    let countComValor = 0;
    let recChristian = 0;
    let qtdChristian = 0;
    let recHeron = 0;
    let qtdHeron = 0;

    listProcs.forEach((p) => {
      const q = (p.qtd !== undefined && p.qtd !== null && p.qtd !== '') ? parseFloat(p.qtd) : 0;
      const isHeron = (p.prestador && p.prestador.includes('Heron'));
      if (p.val !== null && p.val !== undefined && p.val !== '' && !isNaN(p.val)) {
        const lineTot = q * parseFloat(p.val);
        totRec += lineTot;
        if (q > 0) countComValor++;
        if (isHeron) {
          recHeron += lineTot;
          qtdHeron += q;
        } else {
          recChristian += lineTot;
          qtdChristian += q;
        }
      } else {
        if (q > 0) {
          if (isHeron) qtdHeron += q;
          else qtdChristian += q;
        }
      }
    });

    let totFix = 0;
    let despPessoal = 0;
    let folhaPessoal = 0;
    let despTasy = 0;
    let despInfra = 0;

    listCustos.forEach((c) => {
      const q = (c.qtd !== undefined && c.qtd !== null && c.qtd !== '') ? parseFloat(c.qtd) : 0;
      const rateioPct = (c.rateio !== undefined && c.rateio !== null && c.rateio !== '') ? parseFloat(c.rateio) : 100;
      const totLinha = q * (c.val || 0) * (rateioPct / 100);
      totFix += totLinha;

      const cls = c.classificacao || '';
      const itemLower = (c.item || '').toLowerCase();
      if (cls === 'Sistemas TI' || itemLower.includes('tasy')) {
        despTasy += totLinha;
      } else if (cls === 'Taxa de Sala' || itemLower.includes('infra') || itemLower.includes('predial') || itemLower.includes('luz') || itemLower.includes('sala')) {
        despInfra += totLinha;
      } else {
        despPessoal += totLinha;
        if (cls === 'Pessoal') {
          folhaPessoal += totLinha;
        }
      }
    });

    // 30,91% de Encargos da Folha sobre o total rateado de Pessoal
    const valEncargos = folhaPessoal * 0.3091;
    totFix += valEncargos;
    despPessoal += valEncargos;

    const despesaTotal = totFix;
    const resultadoMensal = totRec - despesaTotal;

    // Atualiza Totais das Tabelas da Competência Ativa
    const elTotRec = root.querySelector('#totCisaRec');
    if (elTotRec) elTotRec.textContent = BRL.format(totRec);

    // Atualiza Subtotais por Médico
    const elSubtotChristian = root.querySelector('#cisaSubtotChristian');
    if (elSubtotChristian) elSubtotChristian.textContent = BRL.format(recChristian);
    const elQtdChristian = root.querySelector('#cisaQtdChristian');
    if (elQtdChristian) elQtdChristian.textContent = qtdChristian;

    const elSubtotHeron = root.querySelector('#cisaSubtotHeron');
    if (elSubtotHeron) elSubtotHeron.textContent = BRL.format(recHeron);
    const elQtdHeron = root.querySelector('#cisaQtdHeron');
    if (elQtdHeron) elQtdHeron.textContent = qtdHeron;

    const elTotFix = root.querySelector('#totCisaFixo');
    if (elTotFix) elTotFix.textContent = BRL.format(totFix);

    // LOOP DOS 12 MESES: Atualiza subvalores de cada pill e calcula acumulado anual e médias mensais
    let annualRec = 0;
    let annualDesp = 0;
    let countMonthsActive = 0;

    CISA_MESES.forEach(m => {
      let mProcs, mCustos;
      if (m.id === window.cisaSelectedMonth) {
        mProcs = listProcs;
        mCustos = listCustos;
      } else {
        const mStore = getCisaMonthlyStore(m.id);
        mProcs = isTodas ? mStore.procs : mStore.procs.filter(p => !p.especialidade || matchSpec(p.especialidade, currentKey));
        mCustos = isTodas ? mStore.custos : mStore.custos.filter(c => !c.especialidade || matchSpec(c.especialidade, currentKey));
      }

      let mRec = 0;
      mProcs.forEach(p => {
        if (p.val !== null && p.val !== undefined && p.val !== '' && !isNaN(p.val)) {
          const q = (p.qtd !== undefined && p.qtd !== null && p.qtd !== '') ? parseFloat(p.qtd) : 0;
          mRec += (q * parseFloat(p.val));
        }
      });

      let mCus = 0;
      let mPessoal = 0;
      mCustos.forEach(c => {
        const q = (c.qtd !== undefined && c.qtd !== null && c.qtd !== '') ? parseFloat(c.qtd) : 0;
        const rateioPct = (c.rateio !== undefined && c.rateio !== null && c.rateio !== '') ? parseFloat(c.rateio) : 100;
        const linha = (q * (c.val || 0) * (rateioPct / 100));
        mCus += linha;
        if (c.classificacao === 'Pessoal') {
          mPessoal += linha;
        }
      });
      mCus += (mPessoal * 0.3091);

      annualRec += mRec;
      annualDesp += mCus;
      if (mRec > 0 || mCus > 0) {
        countMonthsActive++;
      }

      const elPillSub = root.querySelector(`#cisaMonthSub_${m.id}`);
      if (elPillSub) {
        if (mRec > 0) {
          elPillSub.textContent = BRL.format(mRec);
        } else {
          elPillSub.textContent = 'R$ 0,00';
        }
      }
    });

    const divisor = Math.max(1, countMonthsActive);
    const mediaRec = annualRec / divisor;
    const mediaDesp = annualDesp / divisor;
    const mediaRes = mediaRec - mediaDesp;
    const margemMedia = mediaRec > 0 ? ((mediaRes / mediaRec) * 100) : 0;
    const bkMedia = mediaRec > 0 ? ((mediaDesp / mediaRec) * 100) : 0;

    // Atualiza KPIs Executivos com as Médias Mensais
    const elKpiRec = root.querySelector('#kpiCisaReceita');
    if (elKpiRec) elKpiRec.textContent = mediaRec > 0 ? BRL.format(mediaRec) : 'R$ 0,00';

    const elKpiDesp = root.querySelector('#kpiCisaDespesa');
    if (elKpiDesp) elKpiDesp.textContent = BRL.format(mediaDesp);

    const elKpiRes = root.querySelector('#kpiCisaResultado');
    if (elKpiRes) {
      if (mediaRec > 0 || mediaDesp > 0) {
        elKpiRes.textContent = (mediaRes > 0 ? '+ ' : '') + BRL.format(mediaRes);
        elKpiRes.style.color = mediaRes >= 0 ? '#059669' : '#dc2626';
      } else {
        elKpiRes.textContent = 'R$ 0,00';
        elKpiRes.style.color = 'var(--text-title)';
      }
    }

    const elKpiMargem = root.querySelector('#kpiCisaMargemTxt');
    if (elKpiMargem) elKpiMargem.textContent = mediaRec > 0 ? margemMedia.toFixed(1).replace('.', ',') + '%' : '0,0%';

    const elKpiBk = root.querySelector('#kpiCisaBreakeven');
    if (elKpiBk) elKpiBk.textContent = mediaRec > 0 ? bkMedia.toFixed(1).replace('.', ',') + '%' : '0,0%';

    const annualRes = annualRec - annualDesp;

    // Atualiza KPIs Anuais (rodapé dos cards)
    const elKpiRecAno = root.querySelector('#kpiCisaReceitaAno');
    if (elKpiRecAno) elKpiRecAno.textContent = BRL.format(annualRec);

    const elKpiDespAno = root.querySelector('#kpiCisaDespesaAno');
    if (elKpiDespAno) elKpiDespAno.textContent = BRL.format(annualDesp);

    const elKpiResAno = root.querySelector('#kpiCisaResultadoAno');
    if (elKpiResAno) {
      if (annualRec > 0 || annualDesp > 0) {
        elKpiResAno.textContent = (annualRes > 0 ? '+ ' : '') + BRL.format(annualRes);
        elKpiResAno.style.color = annualRes >= 0 ? '#059669' : '#dc2626';
      } else {
        elKpiResAno.textContent = 'R$ 0,00';
        elKpiResAno.style.color = 'var(--text-muted)';
      }
    }

    // DIVISÃO DE VALORES / RATEIO (HOSPITAL VS PRESTADOR)
    const elPoolRec = root.querySelector('#cisaPoolRec');
    if (elPoolRec) elPoolRec.textContent = BRL.format(totRec);
    const elPoolDes = root.querySelector('#cisaPoolDes');
    if (elPoolDes) elPoolDes.textContent = BRL.format(totFix);
    const elPoolLiq = root.querySelector('#cisaPoolLiq');
    if (elPoolLiq) {
      elPoolLiq.textContent = (resultadoMensal > 0 ? '+ ' : '') + BRL.format(resultadoMensal);
      elPoolLiq.style.color = resultadoMensal >= 0 ? '#10b981' : '#dc2626';
    }

    const activeRule = state.regraAtiva || 'margem50';
    let hospProd = 0;
    let presProd = 0;

    if (activeRule === 'margem50') {
      hospProd = totRec * 0.50;
      presProd = totRec * 0.50;
    } else if (activeRule === 'rateio8020') {
      hospProd = totRec * 0.20;
      presProd = totRec * 0.80;
    } else {
      hospProd = totRec * 0.50;
      presProd = totRec * 0.50;
    }

    const hospRes = hospProd - totFix;
    const presRes = presProd;

    // Coluna RECEITAS (Total da Receita do Programa CISA)
    const elHInc = root.querySelector('#cisaHInc');
    if (elHInc) elHInc.textContent = 'R$ 0,00';
    const elHProd = root.querySelector('#cisaHProd');
    if (elHProd) elHProd.textContent = BRL.format(totRec);
    const elHRes = root.querySelector('#cisaHRes');
    if (elHRes) {
      elHRes.textContent = totRec > 0 ? ('+ ' + BRL.format(totRec)) : 'R$ 0,00';
      elHRes.style.color = '#10b981';
    }

    // Coluna DESPESAS (Consolidação em 3 Linhas do Programa CISA)
    const elDPessoal = root.querySelector('#cisaDPessoal');
    if (elDPessoal) elDPessoal.textContent = BRL.format(despPessoal);

    const elDTasy = root.querySelector('#cisaDTasy');
    if (elDTasy) elDTasy.textContent = BRL.format(despTasy);

    const elDInfra = root.querySelector('#cisaDInfra');
    if (elDInfra) elDInfra.textContent = BRL.format(despInfra);

    // Rateio 80/20 do saldo total que sobrou (Receita Total - Subtotal de Despesas Operacionais)
    const saldoTotalSobrou = Math.max(0, totRec - totFix);
    const rateioMed80 = saldoTotalSobrou * 0.80;

    const elBlockRateio = root.querySelector('#cisaBlockRateio80');
    const elDSubtotal = root.querySelector('#cisaDSubtotal');
    const elDRateioMed = root.querySelector('#cisaDRateioMed');
    const elPRes = root.querySelector('#cisaPRes2');

    if (activeRule === 'rateio8020') {
      if (elBlockRateio) elBlockRateio.style.display = 'contents';
      if (elDSubtotal) elDSubtotal.textContent = BRL.format(totFix);
      if (elDRateioMed) elDRateioMed.textContent = BRL.format(rateioMed80);
      if (elPRes) {
        const totalDespesa8020 = totFix + rateioMed80;
        elPRes.textContent = BRL.format(totalDespesa8020);
        elPRes.style.color = '#dc2626';
      }
    } else {
      if (elBlockRateio) elBlockRateio.style.display = 'none';
      if (elPRes) {
        elPRes.textContent = BRL.format(totFix);
        elPRes.style.color = '#dc2626';
      }
    }

    // Se for TODAS ESPECIALIDADES, preenche também o Quadro de Consolidação por Especialidade
    if (isTodas) {
      const tbConsol = root.querySelector('#tbCisaConsolidacaoBody');
      if (tbConsol) {
        tbConsol.innerHTML = '';
        let totalGeralProcs = 0;
        let totalGeralCotados = 0;
        let totalGeralRec = 0;
        let totalGeralCusto = 0;

        Object.entries(SERVICOS_CISA).forEach(([sKey, sItem]) => {
          if (sKey === 'todas') return;

          const sProcs = state.procs.filter(p => !p.especialidade || p.especialidade.toLowerCase() === sKey.toLowerCase());
          const sCustos = state.custos.filter(c => !c.especialidade || c.especialidade.toLowerCase() === sKey.toLowerCase());

          let sRec = 0;
          let sCotados = 0;
          sProcs.forEach(p => {
            if (p.val !== null && p.val !== undefined && p.val !== '' && !isNaN(p.val)) {
              const q = (p.qtd !== undefined && p.qtd !== null && p.qtd !== '') ? parseFloat(p.qtd) : 1;
              sRec += (q * parseFloat(p.val));
              sCotados++;
            }
          });

          let sCus = 0;
          sCustos.forEach(c => {
            sCus += (c.qtd * c.val);
          });

          const sSaldo = sRec > 0 ? (sRec - sCus) : -sCus;

          totalGeralProcs += sProcs.length;
          totalGeralCotados += sCotados;
          totalGeralRec += sRec;
          totalGeralCusto += sCus;

          const tr = document.createElement('tr');
          tr.className = 'cisa-row';
          tr.innerHTML = `
            <td class="cisa-cell">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <div style="width: 32px; height: 32px; border-radius: 6px; background: rgba(37, 99, 235, 0.1); color: #2563eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <i data-lucide="${sItem.icon || 'eye'}" style="width: 16px; height: 16px;"></i>
                </div>
                <div>
                  <div style="font-weight: 800; color: var(--text-title); font-size: 0.88rem;">${sItem.nome}</div>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">${sItem.fields?.CLASSIFICACAO || 'Linha de Cuidado Regional'}</div>
                </div>
              </div>
            </td>
            <td class="cisa-cell" style="text-align: center;">
              <span style="display: inline-block; padding: 3px 10px; border-radius: 99px; background: rgba(0,0,0,0.04); font-weight: 700; font-size: 0.82rem; color: var(--text-title);">${sProcs.length} procs</span>
            </td>
            <td class="cisa-cell" style="text-align: center;">
              <span class="cisa-status-badge ${sCotados > 0 ? 'status-cotado' : 'status-a-definir'}">
                <i data-lucide="${sCotados > 0 ? 'check-circle-2' : 'clock'}" style="width:13px;height:13px;"></i>
                ${sCotados}/${sProcs.length} cotados
              </span>
            </td>
            <td class="cisa-cell" style="text-align: right;">
              <strong style="color: #2563eb; font-size: 0.92rem;">${sRec > 0 ? BRL.format(sRec) : 'Aguardando valores'}</strong>
            </td>
            <td class="cisa-cell" style="text-align: right;">
              <strong style="color: #dc2626; font-size: 0.92rem;">${BRL.format(sCus)}</strong>
            </td>
            <td class="cisa-cell" style="text-align: right;">
              <strong style="color: ${sSaldo >= 0 ? '#059669' : '#dc2626'}; font-size: 0.95rem;">
                ${sRec > 0 ? (sSaldo >= 0 ? '+ ' : '') + BRL.format(sSaldo) : 'Definir receita'}
              </strong>
            </td>
            <td class="cisa-cell" style="text-align: center;">
              <button class="pill-btn active" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;" onclick="switchCisaServico('${sKey}')">
                <span>Detalhar</span>
                <i data-lucide="arrow-right" style="width: 12px; height: 12px;"></i>
              </button>
            </td>
          `;
          tbConsol.appendChild(tr);
        });

        // Atualiza footer da tabela de consolidação
        const elTotProcs = root.querySelector('#totConsolQtdProcs');
        if (elTotProcs) elTotProcs.textContent = `${totalGeralProcs} procedimentos`;

        const elTotStatus = root.querySelector('#totConsolStatus');
        if (elTotStatus) elTotStatus.textContent = `${totalGeralCotados} de ${totalGeralProcs} cotados`;

        const elTotRecConsol = root.querySelector('#totConsolReceita');
        if (elTotRecConsol) elTotRecConsol.textContent = totalGeralRec > 0 ? BRL.format(totalGeralRec) : 'Aguardando valores';

        const elTotCusConsol = root.querySelector('#totConsolCusto');
        if (elTotCusConsol) elTotCusConsol.textContent = BRL.format(totalGeralCusto);

        const elTotSalConsol = root.querySelector('#totConsolSaldo');
        if (elTotSalConsol) {
          const saldoGeral = totalGeralRec > 0 ? (totalGeralRec - totalGeralCusto) : -totalGeralCusto;
          elTotSalConsol.textContent = totalGeralRec > 0 ? ((saldoGeral >= 0 ? '+ ' : '') + BRL.format(saldoGeral)) : 'Em apuração';
        }
      }
    }
  }

  // Sincronização dos 12 Meses (Pills de Navegação e Competência)
  const monthPills = root.querySelectorAll('.cisa-month-pill[data-month]');
  monthPills.forEach(pill => {
    pill.onclick = () => {
      const mId = pill.dataset.month;
      if (mId === window.cisaSelectedMonth) return;

      saveCisaMonthlyStore();
      window.cisaSelectedMonth = mId;

      const newStore = getCisaMonthlyStore(mId);
      state.procs = newStore.procs;
      state.custos = newStore.custos;
      state.regraAtiva = newStore.regraAtiva || 'margem50';

      const curMObj = CISA_MESES.find(m => m.id === mId) || CISA_MESES[0];
      const lbl = root.querySelector('#cisaMonthSelectedLabel');
      if (lbl) lbl.textContent = `COMPETÊNCIA: ${curMObj.nome.toUpperCase()} / 2026`;

      monthPills.forEach(p => p.classList.toggle('active', p.dataset.month === mId));

      ruleCards.forEach(c => {
        c.setAttribute('aria-pressed', c.dataset.rule === state.regraAtiva ? 'true' : 'false');
      });
      if (cisaRegras[state.regraAtiva] && ruleNote) {
        const r = cisaRegras[state.regraAtiva];
        ruleNote.innerHTML = `<strong>${r.nome}.</strong> ${r.nota}`;
      }

      renderProcsTable();
      renderCustosTable();
      recalc();
    };
  });


  // Handlers para Adicionar Itens
  const handleAddProc = () => {
    const spec = (currentKey && currentKey !== 'todas') ? (SERVICOS_CISA[currentKey]?.nome || 'Oftalmologia') : 'Oftalmologia';
    const newProc = { especialidade: spec, grupo: '01 · Consultas especializadas', cod: '', desc: '', qtd: 1, val: null };
    state.procs.unshift(newProc);
    editingProc = newProc;
    saveCisaMonthlyStore();
    renderProcsTable();
    recalc();
  };
  const btnAddPTop = root.querySelector('#btnCisaAddProcTop');
  if (btnAddPTop) btnAddPTop.onclick = handleAddProc;

  const handleAddCusto = () => {
    const spec = (currentKey && currentKey !== 'todas') ? (SERVICOS_CISA[currentKey]?.nome || 'Oftalmologia') : 'Oftalmologia';
    const newCusto = { especialidade: spec, item: '', rateio: 100, qtd: 1, val: 0, classificacao: 'Pessoal' };
    state.custos.unshift(newCusto);
    editingCusto = newCusto;
    saveCisaMonthlyStore();
    renderCustosTable();
    recalc();
  };

  // Reset
  const handleReset = () => {
    if (confirm('Deseja restaurar os procedimentos e valores originais do Anexo 3 do CISA para o mês atual?')) {
      const defState = getCisaDefaultState();
      state.procs = defState.procs;
      state.custos = defState.custos;
      state.regraAtiva = 'margem50';
      const curStore = getCisaMonthlyStore(window.cisaSelectedMonth);
      curStore.procs = JSON.parse(JSON.stringify(defState.procs));
      curStore.custos = JSON.parse(JSON.stringify(defState.custos));
      curStore.regraAtiva = 'margem50';
      saveCisaMonthlyStore();
      renderProcsTable();
      renderCustosTable();
      recalc();
    }
  };
  const btnResetTop = root.querySelector('#btnCisaResetTop');
  if (btnResetTop) btnResetTop.onclick = handleReset;

  // Exportar CSV
  const handleCsv = () => {
    let csv = 'Especialidade;Tipo;Codigo;Descricao;Quantidade_Meta;Valor_Unitario;Total_Mensal\n';
    const listP = getFilteredProcs();
    const listC = getFilteredCustos();
    listP.forEach(p => {
      csv += `"${p.especialidade || 'Oftalmologia'}";Procedimento;"${p.cod}";"${p.desc}";${p.qtd};${p.val};${p.qtd*(p.val||0)}\n`;
    });
    listC.forEach(c => {
      csv += `"${c.especialidade || 'Oftalmologia'}";Custo_Operacional;"-";"${c.item}";${c.qtd};${c.val};${c.qtd*c.val}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isTodas ? 'viabilidade_cisa_consolidado.csv' : `viabilidade_cisa_${currentKey}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const btnCsvTop = root.querySelector('#btnCisaExportCsvTop');
  if (btnCsvTop) btnCsvTop.onclick = handleCsv;

  // Imprimir
  const handlePrint = () => window.print();
  const btnPrintTop = root.querySelector('#btnCisaPrintTop');
  if (btnPrintTop) btnPrintTop.onclick = handlePrint;

  // Modelos de Viabilidade / Regras de Negociação
  const cisaRegras = {
    margem50: {
      nome: '50% Margem Hospitalar',
      nota: 'O hospital retém metade do valor de cada procedimento; a outra metade remunera a equipe executora.'
    },
    rateio8020: {
      nome: 'Rateio 80% / 20%',
      nota: 'Após a retirada de todas as despesas operacionais, o resultado líquido apurado é dividido na proporção de 80% para os prestadores médicos e 20% para o hospital.'
    }
  };

  if (!state.regraAtiva || !cisaRegras[state.regraAtiva]) {
    state.regraAtiva = 'rateio8020';
  }

  const ruleCards = root.querySelectorAll('.cisa-rule-card[data-rule]');
  const ruleNote = root.querySelector('#cisaRuleNote');

  // Sincronizar estado inicial visual
  ruleCards.forEach(c => {
    c.setAttribute('aria-pressed', c.dataset.rule === state.regraAtiva ? 'true' : 'false');
  });
  if (cisaRegras[state.regraAtiva] && ruleNote) {
    const r = cisaRegras[state.regraAtiva];
    ruleNote.innerHTML = `<strong>${r.nome}.</strong> ${r.nota}`;
  }

  ruleCards.forEach(card => {
    card.onclick = () => {
      ruleCards.forEach(c => c.setAttribute('aria-pressed', 'false'));
      card.setAttribute('aria-pressed', 'true');
      const ruleKey = card.dataset.rule;
      const r = cisaRegras[ruleKey];
      if (r && ruleNote) {
        ruleNote.innerHTML = `<strong>${r.nome}.</strong> ${r.nota}`;
      }
      state.regraAtiva = ruleKey;
      const curStore = getCisaMonthlyStore(window.cisaSelectedMonth);
      curStore.regraAtiva = ruleKey;
      saveCisaMonthlyStore();
      recalc();
    };
  });

  // Primeira renderização
  renderProcsTable();
  renderCustosTable();
  recalc();
}

window.renderCisaViabilidade = renderCisaViabilidade;

// ----------------------------------------------------------------------------
// EXPORTAÇÃO OFICIAL EM PDF: COMPROVANTE DOCUMENTAL DE CUSTOS & RATEIO CISA
// ----------------------------------------------------------------------------
window.exportCisaCustosPDF = function() {
  const currentMonth = window.cisaSelectedMonth || '2026-09';
  const monthNames = {
    '2026-01': 'Janeiro/2026', '2026-02': 'Fevereiro/2026', '2026-03': 'Março/2026',
    '2026-04': 'Abril/2026', '2026-05': 'Maio/2026', '2026-06': 'Junho/2026',
    '2026-07': 'Julho/2026', '2026-08': 'Agosto/2026', '2026-09': 'Setembro/2026',
    '2026-10': 'Outubro/2026', '2026-11': 'Novembro/2026', '2026-12': 'Dezembro/2026'
  };
  const compLabel = monthNames[currentMonth] || currentMonth;
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Pega as linhas renderizadas na tabela atual de custos
  const tb = document.getElementById('tbCisaCustos');
  let rowsHtml = '';
  if (tb) {
    const rows = tb.querySelectorAll('tr');
    rows.forEach(tr => {
      const cells = tr.querySelectorAll('td');
      if (cells.length < 6) return;
      const isEncargos = tr.classList.contains('cisa-row-encargos');
      const itemText = cells[0].innerText.trim().replace(/\n+/g, ' — ');
      const centroCusto = cells[1].innerText.trim();
      
      let rateio = '';
      const inRateio = cells[2].querySelector('input');
      if (inRateio) {
        rateio = inRateio.value + '%';
      } else {
        rateio = cells[2].innerText.trim();
      }

      let qtd = '';
      const inQtd = cells[3].querySelector('input');
      if (inQtd) {
        qtd = inQtd.value;
      } else {
        qtd = cells[3].innerText.trim();
      }

      const valUnit = cells[4].innerText.trim();
      const valTot = cells[5].innerText.trim();

      const bgStyle = isEncargos ? 'background-color: #eff6ff; font-weight: 700;' : '';
      const textStyle = isEncargos ? 'color: #1e40af;' : '';

      rowsHtml += `
        <tr style="${bgStyle}">
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; ${textStyle}">${itemText}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; text-align: center; font-size: 8.5px; font-weight: 700;">${centroCusto}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 600;">${rateio}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; text-align: center;">${qtd}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; text-align: right;">${valUnit}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: 800; color: #dc2626;">${valTot}</td>
        </tr>
      `;
    });
  }

  const subtotalVal = document.getElementById('totCisaFixo') ? document.getElementById('totCisaFixo').innerText.trim() : 'R$ 13.044,55';
  const recVal = document.getElementById('cisaHProd') ? document.getElementById('cisaHProd').innerText.trim() : 'R$ 17.536,44';
  const rateio80Val = document.getElementById('cisaDRateioMed') ? document.getElementById('cisaDRateioMed').innerText.trim() : 'R$ 3.593,51';
  const totalDespVal = document.getElementById('cisaPRes2') ? document.getElementById('cisaPRes2').innerText.trim() : 'R$ 16.638,06';

  const parseMoney = (txt) => parseFloat((txt || '0').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  const recNum = parseMoney(recVal);
  const subtotalNum = parseMoney(subtotalVal);
  const saldoNum = Math.max(0, recNum - subtotalNum);
  const saldoVal = BRL.format(saldoNum);
  const hosp20Val = BRL.format(saldoNum * 0.20);

  const printDoc = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Comprovante Documental - Rateio de Custos Operacionais CISA</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 12mm 12mm 12mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #1f2937;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 10px;
      line-height: 1.35;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2.5px solid #059669;
      padding-bottom: 8px;
      margin-bottom: 10px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-img {
      width: 58px;
      height: 58px;
      object-fit: contain;
      border-radius: 8px;
      border: 1px solid #d1d5db;
    }
    .header-title h1 {
      margin: 0;
      font-size: 13px;
      font-weight: 900;
      color: #065f46;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .header-title h2 {
      margin: 2px 0 0 0;
      font-size: 11px;
      font-weight: 800;
      color: #111827;
    }
    .header-title p {
      margin: 2px 0 0 0;
      font-size: 9px;
      color: #4b5563;
    }
    .header-right {
      text-align: right;
      font-size: 9px;
    }
    .badge-versao {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      border: 1.5px solid #f59e0b;
      font-weight: 900;
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 3px;
    }
    .meta-strip {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 5px 8px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 9px;
    }
    .table-custos {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      font-size: 9px;
    }
    .table-custos th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 8.5px;
      letter-spacing: 0.5px;
      border: 1px solid #cbd5e1;
      padding: 5px 6px;
    }
    .subtotal-box td {
      background: #fef2f2;
      border-top: 2px solid #ef4444;
      font-weight: 900;
      color: #dc2626;
      font-size: 9.5px;
    }
    .neg-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    .neg-card {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 6px 10px;
      background: #f8fafc;
    }
    .neg-card h4 {
      margin: 0 0 4px 0;
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      color: #1e293b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
    }
    .neg-line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
      font-size: 9px;
    }
    .neg-line.bold {
      font-weight: 800;
      border-top: 1px dashed #cbd5e1;
      padding-top: 3px;
      margin-top: 3px;
    }
    .destaque-aprovacao {
      background: #fffbeb;
      border: 1.5px dashed #f59e0b;
      border-radius: 6px;
      padding: 6px 10px;
      margin-bottom: 12px;
    }
    .destaque-aprovacao strong {
      color: #b45309;
      font-size: 9.5px;
      text-transform: uppercase;
      display: block;
      margin-bottom: 2px;
    }
    .destaque-aprovacao p {
      margin: 0;
      font-size: 8.5px;
      color: #78350f;
      line-height: 1.35;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      gap: 25px;
      margin-top: 22px;
      padding-top: 5px;
    }
    .sig-col {
      flex: 1;
      text-align: center;
      border-top: 1px solid #64748b;
      padding-top: 4px;
      font-size: 8.5px;
      color: #475569;
    }
    .sig-col strong {
      display: block;
      font-size: 9.5px;
      color: #0f172a;
      margin-bottom: 1px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <img src="logo_hbp.jpg" alt="Logo Hospital Bom Pastor" class="logo-img">
      <div class="header-title">
        <h1>Hospital Bom Pastor • Santo Augusto / RS</h1>
        <h2>Comprovante Documental de Rateio de Custos Operacionais</h2>
        <p>Consórcio Intermunicipal de Saúde (CISA) • Ambulatório de Oftalmologia Especializada</p>
      </div>
    </div>
    <div class="header-right">
      <div class="badge-versao">Versão para Aprovação</div>
      <div><strong>Competência:</strong> ${compLabel}</div>
      <div><strong>Emissão:</strong> ${dateFormatted}</div>
    </div>
  </div>

  <div class="meta-strip">
    <div><strong>Documento:</strong> COMPROVANTE DOCUMENTAL DE RATEIO AMBULATORIAL</div>
    <div><strong>Modelo de Negociação:</strong> Rateio 80% Médico / 20% Hospital</div>
    <div><strong>Status:</strong> VERSÃO PARA APROVAÇÃO FORMAL</div>
  </div>

  <table class="table-custos">
    <thead>
      <tr>
        <th style="text-align: left; width: 40%;">Função / Recurso Operacional</th>
        <th style="text-align: center; width: 14%;">Centro de Custo</th>
        <th style="text-align: center; width: 10%;">Rateio</th>
        <th style="text-align: center; width: 8%;">Qtd</th>
        <th style="text-align: right; width: 13%;">R$ Unitário</th>
        <th style="text-align: right; width: 15%;">Total/mês</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
      <tr class="subtotal-box">
        <td colspan="5" style="padding: 6px 8px; border: 1px solid #cbd5e1; text-transform: uppercase;">
          SUBTOTAL DE CUSTOS OPERACIONAIS RATEADOS PELA OFTALMOLOGIA
        </td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: right;">
          ${subtotalVal}
        </td>
      </tr>
    </tbody>
  </table>

  <div class="neg-grid">
    <div class="neg-card">
      <h4>Demonstrativo de Receitas CISA</h4>
      <div class="neg-line"><span>Produção Tabela CISA (147 procedimentos):</span> <strong>${recVal}</strong></div>
      <div class="neg-line"><span>Incentivo ASSISTIR / Outros:</span> <span>R$ 0,00</span></div>
      <div class="neg-line bold" style="color: #059669;"><span>Total Receita Pactual CISA:</span> <strong>${recVal}</strong></div>
    </div>
    <div class="neg-card">
      <h4>Consolidação de Despesas & Rateio (80% / 20%)</h4>
      <div class="neg-line"><span>Subtotal Custos Operacionais Rateados:</span> <strong>${subtotalVal}</strong></div>
      <div class="neg-line"><span>Saldo Líquido a Ratear (Receita - Custos):</span> <strong style="color: #059669;">${saldoVal}</strong></div>
      <div class="neg-line"><span>Rateio 80% Equipe Médica Prestadora:</span> <strong style="color: #dc2626;">${rateio80Val}</strong></div>
      <div class="neg-line"><span>Retenção Hospitalar Líquida (20%):</span> <strong style="color: #059669;">${hosp20Val}</strong></div>
      <div class="neg-line bold" style="color: #dc2626;"><span>TOTAL GERAL DA DESPESA DO PROGRAMA:</span> <strong>${totalDespVal}</strong></div>
    </div>
  </div>

  <div class="destaque-aprovacao">
    <strong>Homologação Técnica • Versão para Aprovação</strong>
    <p>Este comprovante documental consolida a memória técnica dos custos rateados e os parâmetros financeiros pactuados para a contratualização do serviço ambulatorial de Oftalmologia junto ao CISA. Documento emitido para deliberação, apreciação e homologação formal pelas partes signatárias.</p>
  </div>

  <div class="signatures">
    <div class="sig-col">
      <strong>Hospital Bom Pastor de Santo Augusto</strong>
      Direção Executiva / Provedoria
    </div>
    <div class="sig-col">
      <strong>Coordenação do Corpo Clínico</strong>
      Responsável Técnico - Oftalmologia
    </div>
    <div class="sig-col">
      <strong>Contratualização SUS & Faturamento</strong>
      Auditoria e Controles Internos
    </div>
  </div>
</body>
</html>
  `;

  let printFrame = document.getElementById('cisaPrintFrame');
  if (!printFrame) {
    printFrame = document.createElement('iframe');
    printFrame.id = 'cisaPrintFrame';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);
  }

  const doc = printFrame.contentWindow.document;
  doc.open();
  doc.write(printDoc);
  doc.close();

  setTimeout(() => {
    printFrame.contentWindow.focus();
    printFrame.contentWindow.print();
  }, 400);
};

// ----------------------------------------------------------------------------
// 3. FICHA TÉCNICA OFICIAL DO SERVIÇO CISA (ANEXO 3 NATIVO)
// ----------------------------------------------------------------------------
function renderCisaPortaria(key) {
  if (!key) key = window.currentCisaKey || 'todas';
  window.currentCisaKey = key;
  const isTodas = (key === 'todas');
  const container = document.getElementById('cisaMainContent');
  if (!container) return;

  const allProcs = window.cisaContratoOficialProcs || (window.activeCisaSim && window.activeCisaSim.procs) || window.cisaSimState.procs;
  const rawProcs = isTodas
    ? allProcs
    : allProcs.filter(p => !p.especialidade || p.especialidade.toLowerCase() === key.toLowerCase());

  // Na Ficha Técnica (especificação contratual oficial), mantém 1 linha por código (15 itens pactuados únicos)
  const procs = [];
  const seenCod = new Set();
  rawProcs.forEach(p => {
    if (!seenCod.has(p.cod)) {
      seenCod.add(p.cod);
      procs.push(p);
    }
  });

  container.innerHTML = `
    <div id="cisaNativePortaria" style="display: flex; flex-direction: column; gap: 1.5rem;">
      
      <!-- CABEÇALHO OFICIAL CISA -->
      <div class="card" style="padding: 1.75rem 2rem; border-left: 5px solid ${isTodas ? '#10b981' : '#2563eb'}; background: linear-gradient(135deg, var(--bg-card) 0%, ${isTodas ? 'rgba(16, 185, 129, 0.04)' : 'rgba(37, 99, 235, 0.04)'} 100%);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <img src="logos/LOGO__SC_Bage.png" alt="Santa Casa de Bagé" style="height: 56px; width: auto;" onerror="this.style.display='none'">
            <div style="width: 2px; height: 44px; background: ${isTodas ? 'rgba(16, 185, 129, 0.25)' : 'rgba(37, 99, 235, 0.25)'};"></div>
            <img src="logo_cisa.png" alt="Consórcio CISA" style="height: 52px; width: auto;" onerror="this.style.display='none'">
            <div style="margin-left: 0.5rem;">
              <span style="font-size: 0.72rem; font-weight: 800; color: ${isTodas ? '#059669' : '#2563eb'}; text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 0.2rem;">
                ${isTodas ? 'FICHA TÉCNICA OFICIAL DO PROGRAMA REGIONAL CISA — CONSOLIDADO' : 'FICHA TÉCNICA OFICIAL DO SERVIÇO DE OFTALMOLOGIA CISA'}
              </span>
              <h2 style="font-size: 1.55rem; font-weight: 800; color: var(--text-title); margin: 0; line-height: 1.2;">
                ${isTodas ? 'Consórcio CISA — Portfólio Geral de Especialidades' : 'Ambulatório de Especialidade em Oftalmologia'}
              </h2>
              <div style="font-size: 0.84rem; color: var(--text-muted); margin-top: 0.35rem;">
                ${isTodas ? 'Contrato Intermunicipal de Serviços de Saúde · Consórcio Intermunicipal de Saúde (CNPJ: 02.231.696/0001-92)' : 'Contrato Intermunicipal de Serviços de Saúde · Consórcio Intermunicipal de Saúde (CNPJ: 02.231.696/0001-92 · licitacoes@cisaijui.com.br)'}
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${isTodas ? `
              <span class="badge-sus" style="background: rgba(16, 185, 129, 0.12); color: #059669; font-size: 0.7rem; font-weight: 800; padding: 0.35rem 0.75rem; border-radius: 99px;">
                TODAS AS ESPECIALIDADES
              </span>
              <span class="badge-sus" style="background: rgba(37, 99, 235, 0.12); color: #2563eb; font-size: 0.7rem; font-weight: 800; padding: 0.35rem 0.75rem; border-radius: 99px;">
                PACTUAÇÃO CISA / REGIONAL
              </span>
              <span class="badge-sus" style="background: rgba(37, 99, 235, 0.1); color: var(--blue-vibrant); font-size: 0.7rem; font-weight: 800; padding: 0.35rem 0.75rem; border-radius: 99px;">
                CONTRATO INTERMUNICIPAL
              </span>
            ` : `
              <span class="badge-sus" style="background: rgba(37, 99, 235, 0.12); color: #2563eb; font-size: 0.7rem; font-weight: 800; padding: 0.35rem 0.75rem; border-radius: 99px;">
                PACTUAÇÃO CISA / REGIONAL
              </span>
              <span class="badge-sus" style="background: rgba(37, 99, 235, 0.1); color: var(--blue-vibrant); font-size: 0.7rem; font-weight: 800; padding: 0.35rem 0.75rem; border-radius: 99px;">
                CONTRATO INTERMUNICIPAL
              </span>
              <span class="badge-sus" style="background: rgba(245, 158, 11, 0.12); color: #b45309; font-size: 0.7rem; font-weight: 800; padding: 0.35rem 0.75rem; border-radius: 99px;">
                HABILITAÇÃO 0506 GLAUCOMA
              </span>
            `}
          </div>
        </div>
      </div>

      <!-- TABELA OFICIAL DE PROCEDIMENTOS CISA -->
      <div class="card" style="padding: 1.5rem;">
        <div class="card-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; width: 100%;">
            <div class="card-title-group">
              <div class="card-icon" style="background: rgba(37, 99, 235, 0.12); color: #2563eb;">
                <i data-lucide="layers" style="width: 20px; height: 20px;"></i>
              </div>
              <h3 style="font-size: 1.15rem; color: var(--text-title); font-weight: 800; margin: 0;">
                ${isTodas ? 'Tabela Geral de Procedimentos e Valores Pactuados (Todas as Especialidades CISA)' : 'Tabela Oficial de Procedimentos e Valores Pactuados (Contrato CISA)'}
              </h3>
            </div>
            <span class="badge-sus" style="background: rgba(37, 99, 235, 0.12); color: #2563eb; font-size: 0.78rem; font-weight: 800; padding: 0.35rem 0.75rem; border-radius: 4px;">
              ${procs.length} PROCEDIMENTOS PACTUADOS
            </span>
          </div>
        </div>

        <div class="table-responsive" style="overflow-x: auto;">
          <table class="cisa-table-modern">
            <thead>
              <tr>
                <th style="width: 100px;">Código</th>
                <th style="min-width: 380px;">Procedimento</th>
                <th style="width: 150px; text-align: center;">Especialidade</th>
                <th style="width: 180px; text-align: right;">Valor Unitário (R$)</th>
                <th style="width: 130px; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              <!-- FAIXA EM LINHA: GRUPO 01 -->
              <tr class="cisa-group-row">
                <td colspan="5">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 0.55rem;">
                      <i data-lucide="stethoscope" style="width: 15px; height: 15px;"></i>
                      <span>01 · Consultas especializadas</span>
                    </div>
                    <span style="background: #4f46e5; color: #ffffff; font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 99px;">
                      ${procs.filter(p => (p.grupo && (p.grupo.includes('01') || p.grupo.includes('Consultas'))) || p.cod === '00483').length} Procedimento
                    </span>
                  </div>
                </td>
              </tr>
              ${procs.filter(p => (p.grupo && (p.grupo.includes('01') || p.grupo.includes('Consultas'))) || p.cod === '00483').map((p) => {
                const hasVal = (p.val !== null && p.val !== undefined && p.val !== '' && !isNaN(p.val) && Number(p.val) > 0);
                const specName = p.especialidade || 'Oftalmologia';
                const specIcon = specName.toLowerCase() === 'oftalmologia' ? 'eye' : 'stethoscope';
                return `
                  <tr class="cisa-row">
                    <td class="cisa-cell"><span class="cisa-cell-code">${p.cod || '—'}</span></td>
                    <td class="cisa-cell"><span class="cisa-cell-desc">${p.desc || '—'}</span></td>
                    <td class="cisa-cell" style="text-align: center;">
                      <span class="badge" style="background: rgba(37, 99, 235, 0.08); color: #2563eb; font-weight: 700; font-size: 0.72rem; padding: 3px 8px; border-radius: 99px; border: 1px solid rgba(37, 99, 235, 0.2); display: inline-flex; align-items: center; gap: 4px;">
                        <i data-lucide="${specIcon}" style="width: 11px; height: 11px;"></i> ${specName}
                      </span>
                    </td>
                    <td class="cisa-cell" style="text-align: right;">
                      ${hasVal ? `<span class="cisa-cell-val">R$ ${Number(p.val).toFixed(2).replace('.', ',')}</span>` : `<span class="cisa-val-empty">—</span>`}
                    </td>
                    <td class="cisa-cell" style="text-align: center;">
                      ${hasVal
                        ? `<span class="cisa-status-badge status-cotado"><i data-lucide="check-circle" style="width:13px;height:13px;"></i> Cotado</span>`
                        : `<span class="cisa-status-badge status-a-definir"><i data-lucide="clock" style="width:13px;height:13px;"></i> A definir</span>`}
                    </td>
                  </tr>
                `;
              }).join('')}

              <!-- FAIXA EM LINHA: GRUPO 11 -->
              <tr class="cisa-group-row">
                <td colspan="5">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 0.55rem;">
                      <i data-lucide="eye" style="width: 15px; height: 15px;"></i>
                      <span>11 · Diagnóstico em oftalmologia</span>
                    </div>
                    <span style="background: #4f46e5; color: #ffffff; font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 99px;">
                      ${procs.filter(p => !((p.grupo && (p.grupo.includes('01') || p.grupo.includes('Consultas'))) || p.cod === '00483')).length} Procedimentos
                    </span>
                  </div>
                </td>
              </tr>
              ${procs.filter(p => !((p.grupo && (p.grupo.includes('01') || p.grupo.includes('Consultas'))) || p.cod === '00483')).map((p) => {
                const hasVal = (p.val !== null && p.val !== undefined && p.val !== '' && !isNaN(p.val) && Number(p.val) > 0);
                const specName = p.especialidade || 'Oftalmologia';
                const specIcon = specName.toLowerCase() === 'oftalmologia' ? 'eye' : 'stethoscope';
                return `
                  <tr class="cisa-row">
                    <td class="cisa-cell"><span class="cisa-cell-code">${p.cod || '—'}</span></td>
                    <td class="cisa-cell"><span class="cisa-cell-desc">${p.desc || '—'}</span></td>
                    <td class="cisa-cell" style="text-align: center;">
                      <span class="badge" style="background: rgba(37, 99, 235, 0.08); color: #2563eb; font-weight: 700; font-size: 0.72rem; padding: 3px 8px; border-radius: 99px; border: 1px solid rgba(37, 99, 235, 0.2); display: inline-flex; align-items: center; gap: 4px;">
                        <i data-lucide="${specIcon}" style="width: 11px; height: 11px;"></i> ${specName}
                      </span>
                    </td>
                    <td class="cisa-cell" style="text-align: right;">
                      ${hasVal ? `<span class="cisa-cell-val">R$ ${Number(p.val).toFixed(2).replace('.', ',')}</span>` : `<span class="cisa-val-empty">—</span>`}
                    </td>
                    <td class="cisa-cell" style="text-align: center;">
                      ${hasVal
                        ? `<span class="cisa-status-badge status-cotado"><i data-lucide="check-circle" style="width:13px;height:13px;"></i> Cotado</span>`
                        : `<span class="cisa-status-badge status-a-definir"><i data-lucide="clock" style="width:13px;height:13px;"></i> A definir</span>`}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr style="background: rgba(37, 99, 235, 0.05); font-weight: 800; border-top: 2px solid rgba(37, 99, 235, 0.2);">
                <td colspan="3" style="padding: 14px 18px; color: #2563eb; font-size: 0.88rem;">
                  VALOR MÉDIO DOS PROCEDIMENTOS (${procs.filter(p => p.val !== null && p.val !== undefined && p.val !== '' && !isNaN(p.val) && Number(p.val) > 0).length} DE ${procs.length} ITENS COTADOS)
                </td>
                <td style="padding: 14px 18px; text-align: right; color: #2563eb; font-size: 1.05rem; font-weight: 800;">
                  ${(() => {
                    const cotados = procs.filter(p => p.val !== null && p.val !== undefined && p.val !== '' && !isNaN(p.val) && Number(p.val) > 0);
                    if (cotados.length === 0) return 'Valores a definir';
                    const avg = cotados.reduce((acc, p) => acc + Number(p.val), 0) / cotados.length;
                    return 'R$ ' + avg.toFixed(2).replace('.', ',');
                  })()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="margin-top: 1.25rem; background: rgba(37, 99, 235, 0.04); border-left: 3px solid #2563eb; padding: 0.85rem 1.15rem; border-radius: 0 6px 6px 0; font-size: 0.82rem; color: var(--text-main); line-height: 1.55;">
          <strong>Nota de Governança CISA:</strong> Relação completa dos 15 procedimentos do serviço oftalmológico com códigos do Consórcio CISA. Os valores contratuais pactuados serão preenchidos e consolidados conforme o termo aditivo de rateio dos municípios.
        </div>
      </div>

      <!-- CATÁLOGO TÉCNICO E DIRETRIZES CLÍNICAS DOS PROCEDIMENTOS CISA -->
      <div class="card" style="padding: 1.5rem 1.75rem; border-left: 5px solid #2563eb;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div style="width: 40px; height: 40px; border-radius: 8px; background: rgba(37, 99, 235, 0.1); display: flex; align-items: center; justify-content: center; color: #2563eb;">
              <i data-lucide="book-open" style="width: 20px; height: 20px;"></i>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: var(--text-title); display: flex; align-items: center; gap: 0.5rem;">
                ${isTodas ? 'Descrição Técnica e Diretrizes dos Procedimentos CISA (Todas as Especialidades)' : 'Descrição Técnica e Diretrizes dos Procedimentos CISA'}
              </h3>
              <span style="font-size: 0.82rem; color: var(--text-muted);">
                ${isTodas ? 'Detalhamento clínico de cada exame e procedimento pactuado no Contrato Regional CISA, finalidade e correspondência com a Tabela SIGTAP / SUS' : 'Detalhamento clínico de cada exame e procedimento pactuado no Contrato CISA, finalidade e correspondência com a Tabela SIGTAP / SUS'}
              </span>
            </div>
          </div>

          <!-- Busca / Filtro Rápido -->
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div style="position: relative;">
              <i data-lucide="search" style="width: 14px; height: 14px; position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
              <input type="text" id="cisaProcCatalogSearch" placeholder="Buscar por nome, CISA ou SIGTAP..." style="padding: 0.45rem 0.85rem 0.45rem 2rem; font-size: 0.8rem; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-main); width: 280px;">
            </div>
            <span class="badge" style="background: rgba(37, 99, 235, 0.1); color: #2563eb; font-weight: 800; font-size: 0.72rem; padding: 0.35rem 0.65rem; border-radius: 99px;">${(window.cisaProcedimentosDescricoes || []).length} PROCEDIMENTOS</span>
          </div>
        </div>

        <!-- Grade de Cards de Procedimentos -->
        <div id="cisaProcCatalogGrid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 0.85rem;">
          ${(window.cisaProcedimentosDescricoes || []).map(item => `
            <div class="cisa-proc-card" style="display: flex; flex-direction: column; justify-content: space-between; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.85rem 0.95rem; transition: all 0.2s ease;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.4rem; margin-bottom: 0.45rem; flex-wrap: wrap;">
                  <div style="display: flex; align-items: center; gap: 0.35rem;">
                    <span style="background: rgba(37, 99, 235, 0.08); color: #2563eb; font-weight: 800; font-size: 0.68rem; padding: 1px 6px; border-radius: 4px; font-family: monospace; border: 1px solid rgba(37, 99, 235, 0.2);">
                      CISA ${item.cod}
                    </span>
                    <span style="font-size: 0.64rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">
                      ${item.grupo}
                    </span>
                  </div>
                  <span class="badge" style="background: rgba(16, 185, 129, 0.12); color: #059669; border: 1px solid rgba(16, 185, 129, 0.25); font-weight: 800; font-size: 0.68rem; padding: 1px 6px; border-radius: 99px; font-family: monospace; display: inline-flex; align-items: center; gap: 4px;">
                    <i data-lucide="tag" style="width: 9px; height: 9px;"></i> SIGTAP: ${item.sigtap}
                  </span>
                </div>

                <h4 style="margin: 0 0 0.4rem 0; font-size: 0.84rem; font-weight: 800; color: var(--text-title); line-height: 1.3; display: flex; align-items: center; gap: 0.4rem;">
                  <i data-lucide="${item.icon}" style="width: 14px; height: 14px; color: #2563eb; flex-shrink: 0;"></i>
                  <span>${item.nome}</span>
                </h4>

                <p style="margin: 0 0 0.55rem 0; font-size: 0.74rem; color: var(--text-main); line-height: 1.45; text-align: justify; text-justify: inter-word; hyphens: auto;">
                  ${item.descricao}
                </p>
              </div>

              <div style="background: rgba(37, 99, 235, 0.03); border-left: 3px solid #2563eb; padding: 0.45rem 0.65rem; border-radius: 0 4px 4px 0; font-size: 0.70rem; color: var(--text-muted); line-height: 1.4; text-align: justify; text-justify: inter-word; hyphens: auto;">
                <strong style="color: var(--text-title);">Finalidade Clínica:</strong> ${item.finalidade}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;

  // Filtro Rápido do Catálogo Técnico de Procedimentos
  const inputSearch = container.querySelector('#cisaProcCatalogSearch');
  if (inputSearch) {
    inputSearch.oninput = (e) => {
      const q = e.target.value.toLowerCase().trim();
      const cards = container.querySelectorAll('.cisa-proc-card');
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? 'flex' : 'none';
      });
    };
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

window.renderCisaPortaria = renderCisaPortaria;



// SIMULAÇÕES DE VIABILIDADE PERSISTENTES EM MEMÓRIA
let SIMULACOES_VIABILIDADE = {};

function getSimulacaoValue(key, field, defaultValue) {
  if (!SIMULACOES_VIABILIDADE[key]) {
    SIMULACOES_VIABILIDADE[key] = {};
  }
  if (SIMULACOES_VIABILIDADE[key][field] === undefined) {
    SIMULACOES_VIABILIDADE[key][field] = defaultValue;
  }
  return SIMULACOES_VIABILIDADE[key][field];
}

function updateSimulacaoValue(key, field, value) {
  if (!SIMULACOES_VIABILIDADE[key]) {
    SIMULACOES_VIABILIDADE[key] = {};
  }
  SIMULACOES_VIABILIDADE[key][field] = value;
  recalcResultadoViabilidade(key);
}

window.updateSimulacaoValue = updateSimulacaoValue;

function recalcResultadoViabilidade(key) {
  const item = AMBULATORIOS_ASSISTIR[key];
  if (!item) return;

  const inputConsultas = document.getElementById(`via_consultas_${key}`);
  const inputCirurgias = document.getElementById(`via_cirurgias_${key}`);
  const selectEquipe = document.getElementById(`via_equipe_${key}`);
  const selectExames = document.getElementById(`via_exames_${key}`);
  const inputCusto = document.getElementById(`via_custo_${key}`);
  const selectParecer = document.getElementById(`via_parecer_${key}`);
  const textObs = document.getElementById(`via_obs_${key}`);

  // Prioritario specific fields
  const inputProdBase = document.getElementById(`via_prod_base_${key}`);
  const selectSD = document.getElementById(`via_sd_${key}`);

  // Read values
  const consultas = inputConsultas ? inputConsultas.value : '';
  const cirurgias = inputCirurgias ? inputCirurgias.value : '';
  const equipe = selectEquipe ? selectEquipe.value : 'Atende';
  const exames = selectExames ? selectExames.value : 'Próprios';
  const custo = inputCusto ? parseFloat(inputCusto.value) || 0 : 0;
  const parecer = selectParecer ? selectParecer.value : 'Viável';
  const obs = textObs ? textObs.value : '';

  const prodBase = inputProdBase ? parseFloat(inputProdBase.value) || 0 : 0;
  const sd = selectSD ? parseFloat(selectSD.value) || 0 : 0;

  // Save to state
  if (!SIMULACOES_VIABILIDADE[key]) SIMULACOES_VIABILIDADE[key] = {};
  SIMULACOES_VIABILIDADE[key].consultas = consultas;
  SIMULACOES_VIABILIDADE[key].cirurgias = cirurgias;
  SIMULACOES_VIABILIDADE[key].equipe = equipe;
  SIMULACOES_VIABILIDADE[key].exames = exames;
  SIMULACOES_VIABILIDADE[key].custo = custo;
  SIMULACOES_VIABILIDADE[key].parecer = parecer;
  SIMULACOES_VIABILIDADE[key].obs = obs;
  SIMULACOES_VIABILIDADE[key].prodBase = prodBase;
  SIMULACOES_VIABILIDADE[key].sd = sd;

  // Calculate VITS referencial
  let vitsMensal = 0;
  let isPrioritario = false;
  let peso = 0;
  
  if (item.fields && item.fields.MODELO) {
    if (item.fields.MODELO.includes('PRIORITARIO')) {
      isPrioritario = true;
      if (key === 'traumato') peso = 2.40;
      else if (key === 'urologia') peso = 2.00;
      else if (key === 'cirurgia_geral') peso = 1.90;
      else if (key === 'oftalmologia') peso = 0.76;
      else {
        const pesoMatch = item.fields.MODELO.match(/PESO:\s*([\d,.]+)/);
        if (pesoMatch) peso = parseFloat(pesoMatch[1].replace(',', '.')) || 0;
      }
      vitsMensal = (1140.72 * peso * prodBase) / 12;
    } else {
      if (item.fields.VITS_MENSAL_REFERENCIAL) {
        const cleanVits = item.fields.VITS_MENSAL_REFERENCIAL.replace(/[^\d,]/g, '').replace(',', '.');
        vitsMensal = parseFloat(cleanVits) || 79850.40;
      } else {
        vitsMensal = 79850.40;
      }
    }
  }

  const vitsMensalFinal = vitsMensal * (1 + sd);
  const resultadoBruto = vitsMensalFinal - custo;

  const elVits = document.getElementById(`res_vits_${key}`);
  const elResultado = document.getElementById(`res_resultado_${key}`);
  
  if (elVits) {
    elVits.innerText = 'R$ ' + vitsMensalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (elResultado) {
    elResultado.innerText = 'R$ ' + resultadoBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (resultadoBruto > 0) {
      elResultado.style.color = 'var(--success)';
    } else if (resultadoBruto < 0) {
      elResultado.style.color = 'var(--danger)';
    } else {
      elResultado.style.color = 'var(--text-title)';
    }
  }
}

window.recalcResultadoViabilidade = recalcResultadoViabilidade;

window.renderEstudoViabilidade = renderEstudoViabilidade;
function renderEstudoViabilidade(key, targetContainerId = 'assistirMainContent') {
  const container = document.getElementById(targetContainerId);
  if (!container) return;

  if (!key) {
    key = (targetContainerId === 'cisaMainContent') ? (window.currentCisaKey || 'oftalmologia') : (currentAssistirKey || 'cardiologia');
  }

  const isCisa = (targetContainerId === 'cisaMainContent' || (typeof SERVICOS_CISA !== 'undefined' && SERVICOS_CISA[key]));
  const item = (isCisa ? (typeof SERVICOS_CISA !== 'undefined' && SERVICOS_CISA[key]) : null) || (typeof AMBULATORIOS_ASSISTIR !== 'undefined' && AMBULATORIOS_ASSISTIR[key]) || {
    nome: 'Ambulatório de Especialidade',
    fields: { TABELA: '—', CLASSIFICACAO: 'Especialidade Ambulatorial', META_CONSULTAS: '240 consultas/mês', MODELO: 'CLINICO · TS_ITEM: 3 · PESO: 840 · UR: 1' }
  };

  const nomeEsp = item.nome || 'Ambulatório de Especialidade';
  const fields = item.fields || {};
  const tabelaNum = fields.TABELA || '—';
  const classif = fields.CLASSIFICACAO || 'Especialidade Ambulatorial';
  const metaConsultas = fields.META_CONSULTAS || '240 consultas/mês';

  let tsNum = '3';
  let pesoVal = '840';
  if (fields.MODELO) {
    const tsMatch = fields.MODELO.match(/TS_ITEM:\s*(\d+)/i);
    if (tsMatch) tsNum = tsMatch[1];
    const pesoMatch = fields.MODELO.match(/PESO:\s*([\d,\.]+)/i);
    if (pesoMatch) pesoVal = pesoMatch[1].replace(',', '.');
  }

  const eyebrowText = isCisa ? 'Consórcio Intermunicipal de Saúde (CISA) · Regional' : 'Programa ASSISTIR · Secretaria Estadual da Saúde / RS';
  const subtitleText = isCisa ? 'Serviço de Especialidade — Estudo de Viabilidade Financeira CISA' : 'Ambulatório de Especialidade — Estudo de Viabilidade Financeira';

  container.innerHTML = `<div class="cardio-simulator">
<div class="wrap">

  <div class="topbar">
    <img src="logos/LOGO__SC_Bage.png" alt="Santa Casa de Caridade de Bagé" onerror="this.style.visibility='hidden'">
    <div class="mark">${isCisa ? 'Consórcio CISA · Viabilidade Financeira' : 'Estudo de viabilidade financeira'}</div>
    <img src="logos/LOGO__FluxSUS.png" alt="FluxSUS Auditar" onerror="this.style.visibility='hidden'">
  </div>

  <div class="masthead">
    <div class="eyebrow">${eyebrowText}</div>
    <h1><span>${nomeEsp}</span><span>${subtitleText}</span></h1>
    <div class="chips">
      ${isCisa ? '<span class="chip" style="background:rgba(16,185,129,0.15);color:#059669;font-weight:800;border:1px solid rgba(16,185,129,0.3);">Consórcio CISA</span>' : ''}
      <span class="chip">Tabela <b>${tabelaNum}</b></span>
      <span class="chip">${isCisa ? 'Pactuação <b>CISA Regional</b>' : 'Portaria SES/RS <b>46/2026</b>'}</span>
      <span class="chip">Classificação <b>${classif}</b></span>
      <span class="chip">${isCisa ? 'Modelo <b>Regional CISA</b>' : 'TS nº <b>' + tsNum + '</b> · Peso <b>' + pesoVal + '</b>'}</span>
      <span class="chip">Meta <b>${metaConsultas}</b></span>
    </div>
  </div>

  <!-- ASSINATURA: a balança -->
  <section class="scale" aria-label="Resultado do ambulatório">
    <div class="beam-zone" aria-hidden="true">
      <div class="fulcrum"></div>
      <div class="beam" id="beam"></div>
    </div>

    <div class="bars">
      <div class="bar-row">
        <span class="lbl">Produção</span>
        <div class="track"><div class="fillA" id="barProd" style="width:0"></div></div>
        <span class="val" id="vProd">—</span>
      </div>
      <div class="bar-row">
        <span class="lbl">Incentivo</span>
        <div class="track"><div class="fillI" id="barInc" style="width:0"></div></div>
        <span class="val" id="vInc">—</span>
      </div>
      <div class="bar-row">
        <span class="lbl">Despesa</span>
        <div class="track"><div class="fillB" id="barDesp" style="width:0"></div></div>
        <span class="val" id="vDesp">—</span>
      </div>
    </div>

    <div class="verdict">
      <div class="metric">
        <span class="cap" id="capRes">Resultado mensal</span>
        <span class="big pos" id="resMes">—</span>
      </div>
      <div class="metric">
        <span class="cap">Resultado anual</span>
        <span class="m" id="resAno">—</span>
      </div>
      <div class="metric">
        <span class="cap">Margem sobre receita</span>
        <span class="m" id="margem">—</span>
      </div>
      <div class="metric">
        <span class="cap">Dependência do incentivo</span>
        <span class="m" id="depend">—</span>
      </div>
      <div class="metric">
        <span class="cap">Ponto de equilíbrio</span>
        <span class="m" id="breakeven">—</span>
      </div>
    </div>
  </section>

  <section class="panel neg" style="margin-bottom:20px">
    <header>
      <h2>Regra de negociação <span style="color:var(--ink-3);font-weight:500">|</span> Estudo de viabilidade</h2>
      <span class="badge" id="ruleBadge">Pré-visualização</span>
    </header>
    <p class="hint">Define como o custo de cada procedimento é derivado do valor SIGTAP na negociação com a equipe médica. A regra escolhida passa a alimentar a coluna <b>R$ custo</b> da produção.</p>
    <div class="rule-grid" role="group" aria-label="Regra de negociação">

      <button type="button" class="rule-card" data-rule="margem50" aria-pressed="false">
        <span class="rule-head"><span class="rule-dot"></span><span class="rule-name">50% Margem Hospitalar</span></span>
        <span class="rule-desc">O hospital retém metade do valor SIGTAP de cada procedimento; a outra metade remunera a equipe executora.</span>
        <span class="rule-formula">custo = SIGTAP × 50%</span>
      </button>

      <button type="button" class="rule-card" data-rule="mingar" aria-pressed="false">
        <span class="rule-head"><span class="rule-dot"></span><span class="rule-name">Mínimo Garantido</span></span>
        <span class="rule-desc">A equipe recebe um piso por procedimento, independente do volume alcançado. Protege o prestador em meses de baixa produção.</span>
        <span class="rule-formula">custo = máx(piso; SIGTAP × %)</span>
      </button>

      <button type="button" class="rule-card" data-rule="rateio7030" aria-pressed="false">
        <span class="rule-head"><span class="rule-dot"></span><span class="rule-name">Rateio 70% / 30%</span></span>
        <span class="rule-desc">Setenta por cento do valor SIGTAP vai para a equipe e trinta permanecem com o hospital, que arca com estrutura e insumos.</span>
        <span class="rule-formula">custo = SIGTAP × 70%</span>
      </button>

      <button type="button" class="rule-card" data-rule="rateio8020" aria-pressed="false">
        <span class="rule-head"><span class="rule-dot"></span><span class="rule-name">Rateio 80% / 20%</span></span>
        <span class="rule-desc">Oitenta por cento do valor SIGTAP vai para a equipe e vinte permanecem com o hospital, que arca com estrutura e insumos.</span>
        <span class="rule-formula">custo = SIGTAP × 80%</span>
      </button>

      <button type="button" class="rule-card" data-rule="livre" aria-pressed="true">
        <span class="rule-head"><span class="rule-dot"></span><span class="rule-name">Construção Livre</span></span>
        <span class="rule-desc">Sem fórmula. Cada linha da produção recebe o custo digitado manualmente, como em uma planilha.</span>
        <span class="rule-formula">custo = valor informado</span>
      </button>

      <button type="button" class="rule-card add" id="addRule" title="Disponível em versão futura">
        <span class="plus">+</span>
        <span class="rule-name" style="font-size:11.5px">Nova regra</span>
        <span class="rule-desc" style="font-size:10.5px">Personalizada</span>
      </button>
    </div>

    <div class="rule-params" id="ruleParams" hidden>
      <div class="pgroup" id="gInc">
        <label for="pInc">Incentivo ASSISTIR — hospital</label>
        <input type="number" id="pInc" min="0" max="100" step="1" value="50"><span class="pct">%</span>
        <span class="mirror" id="mInc"></span>
      </div>
      <div class="pgroup" id="gProd">
        <label for="pProd">Produção SIGTAP — hospital</label>
        <input type="number" id="pProd" min="0" max="100" step="1" value="100"><span class="pct">%</span>
        <span class="mirror" id="mProd"></span>
      </div>
      <div class="pgroup" id="gMin">
        <label for="pMin">Mínimo garantido ao prestador</label>
        <span class="pct">R$</span><input type="number" id="pMin" min="0" step="500" value="15000" style="width:86px">
      </div>
      <div class="pgroup" id="gSplit">
        <label for="pSplit">Excedente — hospital</label>
        <input type="number" id="pSplit" min="0" max="100" step="1" value="50"><span class="pct">%</span>
        <span class="mirror" id="mSplit"></span>
      </div>
      <div class="pgroup" id="gRes">
        <label for="pRes">Taxa do hospital sobre o resultado</label>
        <input type="number" id="pRes" min="0" max="100" step="1" value="30"><span class="pct">%</span>
        <span class="mirror" id="mRes"></span>
      </div>
    </div>
    <p class="rule-note" id="ruleNote"></p>

    <div class="split" id="splitBox" hidden>
      <div class="pool" id="poolBox" hidden>
        <div class="pool-item"><span class="pl">Receita total</span><span class="pv" id="poolRec">—</span></div>
        <span class="pool-op">−</span>
        <div class="pool-item"><span class="pl">Despesa total</span><span class="pv" id="poolDes">—</span></div>
        <span class="pool-op">=</span>
        <div class="pool-item forte"><span class="pl">Resultado a ratear</span><span class="pv" id="poolLiq">—</span></div>
      </div>
      <div class="side hosp">
        <h3><span class="sq"></span>Hospital</h3>
        <div class="kv" id="hStream">
          <span class="k">Incentivo ASSISTIR</span><span class="v" id="hInc">—</span>
          <span class="k">Produção SIGTAP</span><span class="v" id="hProd">—</span>
          <span class="k">Exames Linha de Cuidado</span><span class="v" id="hCusVar">—</span>
          <span class="k">Custos de Produção/Fixos</span><span class="v" id="hCusFix">—</span>
        </div>
        <div class="kv" id="hMin" hidden>
          <span class="sep"></span>
          <span class="k tot">Resultado da operação</span><span class="v tot" id="hLiqM">—</span>
          <span class="k">Mínimo garantido ao prestador</span><span class="v" id="hMinV">—</span>
          <span class="k tot">Excedente a ratear</span><span class="v tot" id="hExc">—</span>
          <span class="k">Participação no excedente</span><span class="v" id="hPctM">—</span>
        </div>
        <div class="kv" id="hPool" hidden>
          <span class="sep"></span>
          <span class="k tot">Resultado da operação</span><span class="v tot" id="hLiq">—</span>
          <span class="k tot">Participação — taxa de administração</span><span class="v" id="hPct">—</span>
        </div>
        <div class="res"><span class="lb">Resultado mensal</span><span class="vl pos" id="hRes">—</span></div>
      </div>
      <div class="side pres">
        <h3><span class="sq"></span>Prestador</h3>
        <div class="kv" id="pStream">
          <span class="k">Incentivo ASSISTIR</span><span class="v" id="pIncV">—</span>
          <span class="k">Produção SIGTAP</span><span class="v" id="pProdV">—</span>
          <span class="k">Exames Linha de Cuidado</span><span class="v" id="pCusVar">—</span>
          <span class="k">Custos de Produção/Fixos</span><span class="v" id="pCusFix">—</span>
        </div>
        <div class="kv" id="pMin" hidden>
          <span class="k">Mínimo garantido</span><span class="v" id="pMinV">—</span>
          <span class="k">Excedente a ratear</span><span class="v" id="pExcBase">—</span>
          <span class="k">Participação no excedente</span><span class="v" id="pPctM">—</span>
          <span class="sep"></span>
          <span class="k tot">Parcela variável</span><span class="v tot" id="pExcV">—</span>
        </div>
        <div class="kv" id="pPool" hidden>
          <span class="k">Resultado da operação</span><span class="v" id="pLiq">—</span>
          <span class="k tot">Participação — operação do serviço</span><span class="v" id="pPct">—</span>
        </div>
        <div class="res"><span class="lb">Resultado mensal</span><span class="vl pos" id="pRes2">—</span></div>
        <p class="res-nota" id="pResNota" hidden></p>
      </div>
    </div>
  </section>

  <div class="grid">
    <!-- COLUNA ESQUERDA -->
    <div>
      <section class="panel rec">
        <header>
          <h2>Produção SIGTAP</h2>
          <button class="btn sm" id="addProc">Adicionar procedimento</button>
        </header>
        <p class="hint">Valores de produção física e financeira mensal de procedimentos ambulatoriais aprovados no SIA/SUS.</p>
        <div class="body">
          <table>
            <thead>
              <tr>
                <th class="l">Código</th><th class="l">Procedimento</th>
                <th>Qtde</th><th>R$ SIGTAP</th><th>R$ custo<span class="col-tag" id="colTag">livre</span></th>
                <th class="num">Receita</th><th class="num">Custo direto</th><th></th>
              </tr>
            </thead>
            <tbody id="tbProc"></tbody>
            <tfoot>
              <tr>
                <td class="l" colspan="5">Subtotal produção</td>
                <td class="num" id="totProcRec">—</td>
                <td class="num" id="totProcCus">—</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <section class="panel inc" style="margin-top:20px">
        <header><h2>Incentivo estadual</h2></header>
        <div class="calc">
          <div class="formula">VITS anual = UIH × Peso × UR &nbsp;·&nbsp; Decreto 56.015/2021, Art. 7º</div>
          <div class="kv">
            <span class="k">UIH vigente</span>
            <span class="v"><input type="number" id="uih" value="1140.72" step="0.01" aria-label="UIH"></span>
            <span class="k">Peso do Tipo de Serviço</span>
            <span class="v"><input type="number" id="peso" value="${pesoVal}" step="0.01" aria-label="Peso"></span>
            <span class="k">Unidade de Referência</span>
            <span class="v"><input type="number" id="ur" value="1" step="0.01" aria-label="UR"></span>
            <span class="sep"></span>
            <span class="k">VITS anual</span><span class="v" id="vits">—</span>
            <span class="k tot">Incentivo mensal</span><span class="v tot" id="incMes">—</span>
          </div>
        </div>
      </section>
    </div>

    <!-- COLUNA DIREITA -->
    <div>
      <section class="panel des">
        <header>
          <h2>Custos fixos do serviço</h2>
          <button class="btn sm" id="addCusto">Adicionar item</button>
        </header>
        <p class="ribbon" id="fixRibbon" hidden></p>
        <p class="hint">Equipe, estrutura e rateios que não variam com o volume. Os custos por procedimento já entram na tabela de produção.</p>
        <div class="body">
          <table>
            <thead>
              <tr><th class="l">Item</th><th>Qtde</th><th>R$ unitário</th><th>Total/mês</th><th></th></tr>
            </thead>
            <tbody id="tbCusto"></tbody>
            <tfoot>
              <tr>
                <td class="l" colspan="3">Subtotal custos fixos</td>
                <td class="num" id="totFixo">—</td><td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <section class="panel conf" style="margin-top:20px">
        <header><h2>Conformidade com a portaria</h2></header>
        <ul id="confList"></ul>
      </section>
    </div>
  </div>

  <div class="toolbar">
    <button class="btn" id="btnSalvar">Salvar cenário</button>
    <button class="btn" id="btnCarregar">Carregar cenário</button>
    <button class="btn" id="btnCsv">Exportar CSV</button>
    <span class="spacer"></span>
    <button class="btn" id="btnImprimir">Imprimir</button>
    <button class="btn" id="btnZerar">Zerar valores</button>
    <input type="file" id="fileIn" accept="application/json" hidden>
  </div>

  <footer class="note">
    <b>Base normativa.</b> ${isCisa ? 'Contrato de Rateio e Termo de Pactuação do Consórcio Intermunicipal de Saúde (CISA) · Tabela ' + tabelaNum + ' · Santa Casa de Caridade de Bagé.' : 'Portaria SES/RS nº 46/2026 (ASSISTIR consolidada), Tabela ' + tabelaNum + ' · Decreto Estadual nº 56.015/2021, Art. 7º (fórmula do VITS) · Decreto nº 56.016/2021 e alterações, incluindo o Decreto nº 58.115/2025 (UIH de R$ 1.140,72 a partir da competência maio/2026).'}<br>
    <b>Natureza do repasse.</b> ${isCisa ? 'Produção ambulatorial e cirúrgica contratualizada com rateio municipal consorciado.' : 'O incentivo é aditivo ao teto MAC por adesão, não substitutivo. Os códigos listados como procedimentos avaliados servem para aferir meta, não para remunerar.'}<br>
    <b>Trilha de auditoria.</b> ${isCisa ? 'Todo usuário atendido deve ter sido agendado e regulado via Central CISA / GERCON.' : 'Todo usuário atendido deve ter sido regulado pelo GERCON. Produção não regulada não é reconhecida, ainda que realizada e faturada.'}<br>
    <b>Uso dos dados.</b> Modelo de simulação financeira e parametrização de receitas e custos operacionais.
  </footer>
</div>
</div>`;

  if (typeof window.initViabilidadeSimulation === 'function') {
    window.initViabilidadeSimulation(key, '#' + targetContainerId);
  }
  lucide.createIcons();
}

function renderPortariaAmbulatorio(key) {
  const item = AMBULATORIOS_ASSISTIR[key];
  const container = document.getElementById('assistirMainContent');
  if (!item || !container) return;

  // Se for página sem ficha (Maternidade AR ou Idoso 60+)
  if (item.is_sem_ficha) {
    container.innerHTML = `
      <!-- CABEÇALHO OFICIAL GOVERNO DO ESTADO DO RIO GRANDE DO SUL -->
      <div class="card" style="margin-bottom: 1.5rem; text-align: center; padding: 1.5rem 2rem; background: linear-gradient(180deg, var(--bg-card) 0%, var(--bg-card-hover) 100%); border: 1px solid var(--border-color);">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <img src="logo_rs.svg" alt="Governo do Estado do Rio Grande do Sul - Secretaria da Saúde" style="height: 100px; width: auto; margin-bottom: 0.5rem;">
          <h2 style="font-size: 1.45rem; font-weight: 900; color: var(--text-title); text-transform: uppercase; letter-spacing: 0.5px; margin: 0.3rem 0;">
            PORTARIA SES Nº 46/2026
          </h2>
        </div>
      </div>

      <!-- Card do Título PENDENTE -->
      <div class="card" style="margin-bottom: 1.5rem; padding: 1.5rem 2rem; border-left: 5px solid var(--danger);">
        <span style="font-size: 0.72rem; font-weight: 700; color: var(--danger); text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 0.2rem;">
          AMBULATÓRIO PLANEJADO / PENDENTE
        </span>
        <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-title); margin: 0;">
          ${item.nome}
        </h2>
      </div>

      <!-- Alerta de Dado Pendente (PAGINAS_SEM_FICHA) -->
      <div class="card" style="margin-bottom: 1.5rem; padding: 1.5rem 2rem; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: var(--radius-sm);">
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
          <i data-lucide="alert-octagon" style="color: var(--danger); width: 24px; height: 24px; flex-shrink: 0; margin-top: 0.1rem;"></i>
          <div>
            <h4 style="color: var(--danger); font-weight: 800; margin: 0 0 0.4rem 0; font-size: 0.95rem;">Especificações Indisponíveis nesta Versão</h4>
            <p style="color: var(--text-main); font-size: 0.88rem; line-height: 1.6; margin: 0;">
              ${item.aviso}
            </p>
          </div>
        </div>
      </div>

      <!-- Bloco de Legislação Comum -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
          <h3 style="font-size: 1.15rem; color: var(--text-title); font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="scroll" style="color: var(--blue-vibrant); width: 20px; height: 20px;"></i>
            Legislação Geral do Programa ASSISTIR
          </h3>
        </div>
        <div class="table-responsive">
          <table class="data-table" style="font-size: 0.85rem;">
            <thead style="background: #1e293b; color: #ffffff;">
              <tr>
                <th style="width: 200px; color: #ffffff; padding: 10px; font-weight: 700; text-transform: uppercase; font-size: 0.72rem; border: none;">Camada</th>
                <th style="color: #ffffff; padding: 10px; font-weight: 700; text-transform: uppercase; font-size: 0.72rem; border: none;">Norma</th>
              </tr>
            </thead>
            <tbody>
              ${BLOCOS_COMUNS.legislacao.map(row => `
              <tr>
                <td style="color: var(--blue-vibrant); font-weight: 700; padding: 0.75rem;">${row.Camada || row.camada}</td>
                <td style="color: var(--text-main); padding: 0.75rem;">${row.Norma || row.norma}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bloco de Observações Comuns -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
          <h3 style="font-size: 1.15rem; color: var(--text-title); font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="info" style="color: var(--navy-primary); width: 20px; height: 20px;"></i>
            Observações Gerais & Diretrizes Complementares
          </h3>
        </div>
        <div class="table-responsive">
          <table class="data-table" style="font-size: 0.85rem;">
            <thead style="background: #1e293b; color: #ffffff;">
              <tr>
                <th style="width: 200px; color: #ffffff; padding: 10px; font-weight: 700; text-transform: uppercase; font-size: 0.72rem; border: none;">Item</th>
                <th style="color: #ffffff; padding: 10px; font-weight: 700; text-transform: uppercase; font-size: 0.72rem; border: none;">Diretriz</th>
              </tr>
            </thead>
            <tbody>
              ${BLOCOS_COMUNS.observacoes.map(row => `
              <tr>
                <td style="color: var(--navy-primary); font-weight: 700; padding: 0.75rem;">${row.Item || row.item}</td>
                <td style="color: var(--text-main); padding: 0.75rem;">${row["Conteúdo"] || row.conteudo || row.Conteudo}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // Lógica de Ficha Ativa
  const fields = item.fields;
  
  // Parse Modelo e ID
  const isPrioritario = fields.MODELO && fields.MODELO.includes('PRIORITARIO');
  const isClinicoCirurgico = fields.CLASSIFICACAO && fields.CLASSIFICACAO.toLowerCase().includes('cirúrgica');
  
  // Default values for simulation fields in memory
  const valConsultas = getSimulacaoValue(key, 'consultas', fields.META_CONSULTAS || '');
  const valCirurgias = getSimulacaoValue(key, 'cirurgias', isClinicoCirurgico ? (fields.META_CIRURGICA || '') : '');
  const valEquipe = getSimulacaoValue(key, 'equipe', 'Atende');
  const valExames = getSimulacaoValue(key, 'exames', 'Próprios');
  const valCusto = getSimulacaoValue(key, 'custo', 0);
  const valParecer = getSimulacaoValue(key, 'parecer', 'Viável');
  const valObs = getSimulacaoValue(key, 'obs', '');
  const valProdBase = getSimulacaoValue(key, 'prodBase', isPrioritario ? 1.0 : 0);
  const valSD = getSimulacaoValue(key, 'sd', 0);

  // VITS referencial calculation
  let vitsMensal = 79850.40;
  let peso = 840;
  if (isPrioritario) {
    if (key === 'traumato') peso = 2.40;
    else if (key === 'urologia') peso = 2.00;
    else if (key === 'cirurgia_geral') peso = 1.90;
    else if (key === 'oftalmologia') peso = 0.76;
    vitsMensal = (1140.72 * peso * valProdBase) / 12;
  } else {
    if (fields.VITS_MENSAL_REFERENCIAL) {
      const cleanVits = fields.VITS_MENSAL_REFERENCIAL.replace(/[^\d,]/g, '').replace(',', '.');
      vitsMensal = parseFloat(cleanVits) || 79850.40;
    }
    const pesoMatch = fields.MODELO ? fields.MODELO.match(/PESO:\s*([\d,.]+)/) : null;
    if (pesoMatch) {
      peso = parseFloat(pesoMatch[1].replace(',', '.')) || 840;
    }
  }

  const vitsMensalFinal = vitsMensal * (1 + valSD);
  const resultadoBruto = vitsMensalFinal - valCusto;

  let html = `
    <!-- CABEÇALHO OFICIAL GOVERNO DO ESTADO DO RIO GRANDE DO SUL -->
    <div class="card" style="margin-bottom: 1.5rem; text-align: center; padding: 1.5rem 2rem; background: linear-gradient(180deg, var(--bg-card) 0%, var(--bg-card-hover) 100%); border: 1px solid var(--border-color);">
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <img src="logo_rs.svg" alt="Governo do Estado do Rio Grande do Sul - Secretaria da Saúde" style="height: 100px; width: auto; margin-bottom: 0.5rem;">
        <h2 style="font-size: 1.45rem; font-weight: 900; color: var(--text-title); text-transform: uppercase; letter-spacing: 0.5px; margin: 0.3rem 0;">
          PORTARIA SES Nº 46/2026
        </h2>
      </div>
      <div style="max-width: 820px; margin: 0.6rem auto 0 auto; text-align: justify; text-align-last: center; font-size: 0.85rem; color: var(--text-main); line-height: 1.6; background: rgba(37, 99, 235, 0.04); padding: 0.75rem 1.25rem; border-radius: var(--radius-sm); border: 1px solid rgba(37, 99, 235, 0.15);">
        Altera a Portaria SES/RS nº 537, de 3 de agosto de 2021, que regulamenta, no âmbito do Estado do Rio Grande do Sul, o <strong>ASSISTIR - Programa de Incentivos Hospitalares</strong>.
      </div>
    </div>

    <!-- 1. IDENTIFICAÇÃO -->
    <div class="card" style="margin-bottom: 1.5rem; padding: 1.5rem 2rem; border-left: 5px solid var(--blue-vibrant);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span style="font-size: 0.72rem; font-weight: 700; color: var(--blue-vibrant); text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 0.2rem;">
            Ficha Técnica ${fields.ID || item.ficha_id}
          </span>
          <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-title); margin: 0;">
            ${item.nome}
          </h2>
          <div style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.85rem;">
            Tabela de Especialidade nº ${fields.TABELA || 'N/A'} — ${fields.CLASSIFICACAO || 'N/A'}
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span class="badge-sus" style="background: rgba(37, 99, 235, 0.1); color: var(--blue-vibrant); font-size: 0.7rem; font-weight: 700; padding: 0.35rem 0.75rem; border-radius: 99px;">
            MODELO: ${fields.MODELO ? fields.MODELO.split(' · ')[0] : 'N/A'}
          </span>
          <span class="badge-sus" style="background: rgba(16, 185, 129, 0.1); color: var(--success); font-size: 0.7rem; font-weight: 700; padding: 0.35rem 0.75rem; border-radius: 99px;">
            PESO: ${peso}
          </span>
        </div>
      </div>
    </div>

    <!-- 2. FINANCEIRO -->
    <div class="card" style="margin-bottom: 1.5rem;">
      <div class="card-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.25rem;">
        <h3 style="font-size: 1.15rem; color: var(--text-title); font-weight: 800; display: flex; align-items: center; gap: 0.5rem; margin: 0;">
          <i data-lucide="coins" style="color: var(--success); width: 20px; height: 20px;"></i>
          Financiamento e Valores Referenciais
        </h3>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
        <!-- Card VITS Referencial -->
        <div style="background: var(--bg-card-hover); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.4rem;">
            VITS Mensal Referencial
          </div>
          <div style="font-size: 1.4rem; font-weight: 900; color: var(--success);">
            ${isPrioritario ? 'Variável (Prioritário)' : (fields.VITS_MENSAL_REFERENCIAL || 'R$ 79.850,40')}
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem;">
            ${isPrioritario ? 'Calculado na simulação abaixo' : 'Valor bruto de incentivo básico'}
          </div>
        </div>

        <!-- Card Peso -->
        <div style="background: var(--bg-card-hover); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.4rem;">
            Peso Hospitalar Pactuado
          </div>
          <div style="font-size: 1.4rem; font-weight: 900; color: var(--blue-vibrant);">
            ${peso}
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem;">
            Fator do Tipo de Serviço do Ambulatório
          </div>
        </div>

        <!-- Card UR -->
        <div style="background: var(--bg-card-hover); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.4rem;">
            Unidade de Referência (UR)
          </div>
          <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-title); line-height: 1.4; word-break: break-word;">
            ${isPrioritario ? 'Produção Cirúrgica 2023' : 'Fator Unitário'}
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem;">
            Base de reajuste e cálculo anual
          </div>
        </div>
      </div>

      <!-- Fórmula e Detalhes da Regra de Viabilidade -->
      <div style="background: rgba(16, 185, 129, 0.03); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid rgba(16, 185, 129, 0.15); font-size: 0.85rem; line-height: 1.6; color: var(--text-main);">
        <div style="font-weight: 800; color: var(--navy-primary); margin-bottom: 0.4rem;">Fórmula de Incentivo do Programa ASSISTIR:</div>
        <code style="display: block; background: var(--bg-card); padding: 0.5rem; border-radius: 4px; font-family: monospace; font-size: 0.85rem; margin-bottom: 0.6rem; color: #4f46e5; border: 1px solid var(--border-color);">
          VITS Anual = UIH [R$ 1.140,72] × Peso × UR
        </code>
        ${isPrioritario ? `
        <div style="display: flex; align-items: flex-start; gap: 0.5rem; margin-top: 0.5rem; background: rgba(59, 130, 246, 0.05); padding: 0.75rem; border-radius: 4px; border-left: 3px solid var(--blue-vibrant);">
          <i data-lucide="info" style="color: var(--blue-vibrant); width: 18px; height: 18px; flex-shrink: 0; margin-top: 0.1rem;"></i>
          <div>
            <strong>Regra de Piso das Prioritárias:</strong> ${BLOCOS_COMUNS.piso_prioritarias}
          </div>
        </div>
        ` : ''}
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.6rem; font-style: italic;">
          * <strong>Nota de Sub-judice:</strong> ${BLOCOS_COMUNS.sub_judice_aviso}
        </div>
      </div>

      <!-- Acordo Financeiro Comum Expandido -->
      <details style="margin-top: 1rem; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
        <summary style="padding: 0.75rem 1rem; font-weight: 700; color: var(--text-title); cursor: pointer; background: var(--bg-card-hover); font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; user-select: none;">
          <i data-lucide="chevron-down" style="width: 16px; height: 16px;"></i> Ver Tabela de Regras Financeiras Comuns (Portaria 537/2021)
        </summary>
        <div style="padding: 1rem; border-top: 1px solid var(--border-color);">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; line-height: 1.5;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-color); text-align: left;">
                <th style="padding: 0.5rem; font-weight: 800; color: var(--text-title);">Parâmetro</th>
                <th style="padding: 0.5rem; font-weight: 800; color: var(--text-title);">Regra Operacional</th>
              </tr>
            </thead>
            <tbody>
              ${BLOCOS_COMUNS.financeiro.map(row => `
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.5rem 0.25rem; font-weight: 700; color: var(--navy-primary); width: 180px;">${row.Item || row.item}</td>
                <td style="padding: 0.5rem; color: var(--text-main);">${row["Conteúdo"] || row.conteudo || row.Conteudo}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </details>
    </div>

    <!-- 3. LINHA DE CUIDADO ASSISTENCIAL -->
    <div class="card" style="margin-bottom: 1.5rem;">
      <div class="card-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.25rem;">
        <h3 style="font-size: 1.15rem; color: var(--text-title); font-weight: 800; display: flex; align-items: center; gap: 0.5rem; margin: 0;">
          <i data-lucide="activity" style="color: var(--blue-vibrant); width: 20px; height: 20px;"></i>
          Linha de Cuidado Assistencial e Requisitos Técnicos
        </h3>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; flex-wrap: wrap;">
        <!-- Left Side: Scope, Team, Referral -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <h4 style="font-size: 0.85rem; font-weight: 800; color: var(--navy-primary); text-transform: uppercase; margin: 0 0 0.3rem 0; display: flex; align-items: center; gap: 0.3rem;">
              <i data-lucide="clipboard-list" style="width: 16px; height: 16px; color: var(--blue-vibrant);"></i> Escopo de Atuação
            </h4>
            <p style="font-size: 0.88rem; color: var(--text-main); line-height: 1.5; margin: 0;">
              ${fields.ESCOPO || 'Não especificado.'}
            </p>
          </div>

          <div>
            <h4 style="font-size: 0.85rem; font-weight: 800; color: var(--navy-primary); text-transform: uppercase; margin: 0 0 0.3rem 0; display: flex; align-items: center; gap: 0.3rem;">
              <i data-lucide="users" style="width: 16px; height: 16px; color: var(--blue-vibrant);"></i> Equipe Mínima Exigida
            </h4>
            <p style="font-size: 0.88rem; color: var(--text-main); line-height: 1.5; margin: 0; background: var(--bg-card-hover); padding: 0.75rem; border-radius: 4px; border-left: 3px solid var(--purple);">
              ${fields.EQUIPE || fields.EQUIPE_MINIMA || 'Não especificada.'}
            </p>
            ${fields.EQUIPE_COMPLEMENTAR ? `
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.4rem; padding-left: 0.75rem;">
              <strong>Complementar:</strong> ${fields.EQUIPE_COMPLEMENTAR}
            </div>
            ` : ''}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div>
              <h5 style="font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin: 0 0 0.2rem 0;">Referência</h5>
              <p style="font-size: 0.82rem; color: var(--text-main); line-height: 1.4; margin: 0;">
                ${fields.REFERENCIA || 'Atenção secundária/terciária correspondente.'}
              </p>
            </div>
            <div>
              <h5 style="font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin: 0 0 0.2rem 0;">Contrarreferência</h5>
              <p style="font-size: 0.82rem; color: var(--text-main); line-height: 1.4; margin: 0;">
                ${fields.CONTRARREFERENCIA || 'Atenção primária em saúde (APS).'}
              </p>
            </div>
          </div>
        </div>

        <!-- Right Side: Goals, Exams, Billing -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div style="background: rgba(37, 99, 235, 0.03); padding: 0.75rem; border-radius: 4px; border: 1px solid rgba(37, 99, 235, 0.15);">
              <h4 style="font-size: 0.75rem; font-weight: 800; color: var(--blue-vibrant); text-transform: uppercase; margin: 0 0 0.2rem 0;">Meta de Consultas</h4>
              <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-title);">${fields.META_CONSULTAS || 'N/A'}</div>
            </div>
            <div style="background: rgba(124, 58, 237, 0.03); padding: 0.75rem; border-radius: 4px; border: 1px solid rgba(124, 58, 237, 0.15);">
              <h4 style="font-size: 0.75rem; font-weight: 800; color: var(--purple); text-transform: uppercase; margin: 0 0 0.2rem 0;">Meta Cirúrgica</h4>
              <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-title);">${fields.META_CIRURGICA || 'N/A'}</div>
            </div>
          </div>

          <div>
            <h4 style="font-size: 0.85rem; font-weight: 800; color: var(--navy-primary); text-transform: uppercase; margin: 0 0 0.3rem 0; display: flex; align-items: center; gap: 0.3rem;">
              <i data-lucide="microscope" style="width: 16px; height: 16px; color: var(--blue-vibrant);"></i> Exames Mínimos Obrigatórios
            </h4>
            <p style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5; margin: 0; background: var(--bg-card-hover); padding: 0.5rem 0.75rem; border-radius: 4px; font-family: sans-serif;">
              ${fields.EXAMES_MINIMOS || 'Não previstos.'}
            </p>
          </div>

          <div>
            <h4 style="font-size: 0.85rem; font-weight: 800; color: var(--navy-primary); text-transform: uppercase; margin: 0 0 0.3rem 0; display: flex; align-items: center; gap: 0.3rem;">
              <i data-lucide="file-text" style="width: 16px; height: 16px; color: var(--blue-vibrant);"></i> Procedimentos SIA/SIH para Meta
            </h4>
            <p style="font-size: 0.82rem; color: var(--text-main); line-height: 1.4; margin: 0; font-family: monospace; background: var(--bg-card-hover); padding: 0.5rem 0.75rem; border-radius: 4px; border: 1px dashed var(--border-color);">
              ${fields.COMPUTAM_META || 'Conforme Nota Técnica específica da SES/RS.'}
            </p>
            ${fields.COMPLEMENTARES ? `
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.3rem; font-family: monospace; padding-left: 0.5rem;">
              <strong>Complementares:</strong> ${fields.COMPLEMENTARES}
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>

    <!-- 4. PONTOS DE ATENÇÃO -->
    <div class="card" style="margin-bottom: 1.5rem;">
      <div class="card-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.25rem;">
        <h3 style="font-size: 1.15rem; color: var(--text-title); font-weight: 800; display: flex; align-items: center; gap: 0.5rem; margin: 0;">
          <i data-lucide="alert-triangle" style="color: var(--warning); width: 20px; height: 20px;"></i>
          Diretrizes Contratuais e Critérios de Glosa (Pontos de Atenção)
        </h3>
      </div>

      <!-- Specific specialty points -->
      <div style="background: rgba(245, 158, 11, 0.04); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid rgba(245, 158, 11, 0.2); border-left: 5px solid var(--warning); margin-bottom: 1rem;">
        <h4 style="color: #d97706; font-weight: 800; margin: 0 0 0.5rem 0; font-size: 0.95rem; text-transform: uppercase;">Diretrizes Específicas do Ambulatório</h4>
        <p style="color: var(--text-main); font-size: 0.88rem; line-height: 1.6; margin: 0; white-space: pre-line;">
          ${fields.PONTOS_ESPECIFICOS || 'Seguir as normas padrão descritas no regulamento comum do Programa ASSISTIR.'}
        </p>
      </div>

      <!-- Common guidelines toggle -->
      <details style="border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
        <summary style="padding: 0.75rem 1rem; font-weight: 700; color: var(--text-title); cursor: pointer; background: var(--bg-card-hover); font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; user-select: none;">
          <i data-lucide="chevron-down" style="width: 16px; height: 16px;"></i> Ver 17 Critérios Comuns de Monitoramento & Glosa (CIB / Auditoria)
        </summary>
        <div style="padding: 1rem; border-top: 1px solid var(--border-color); max-height: 350px; overflow-y: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.80rem; line-height: 1.5;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-color); text-align: left;">
                <th style="padding: 0.5rem; font-weight: 800; color: var(--text-title); width: 140px;">Tema</th>
                <th style="padding: 0.5rem; font-weight: 800; color: var(--text-title);">Diretriz Contratual / Requisito</th>
              </tr>
            </thead>
            <tbody>
              ${BLOCOS_COMUNS.pontos_atencao.map(row => `
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.5rem 0.25rem; font-weight: 700; color: var(--navy-primary);">${row.Tema || row.tema}</td>
                <td style="padding: 0.5rem; color: var(--text-main);">${row["Diretriz Contratual"] || row.diretriz || row["Diretriz Contratual / Requisito"]}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </details>
    </div>

    <!-- 5. LEGISLAÇÃO -->
    <div class="card" style="margin-bottom: 1.5rem;">
      <div class="card-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.25rem;">
        <h3 style="font-size: 1.15rem; color: var(--text-title); font-weight: 800; display: flex; align-items: center; gap: 0.5rem; margin: 0;">
          <i data-lucide="scroll" style="color: var(--blue-vibrant); width: 20px; height: 20px;"></i>
          Arcabouço Normativo e Habilitação
        </h3>
      </div>

      ${fields.NORMAS_PROPRIAS || fields.HABILITACAO_EXIGIDA || fields.HABILITACOES_FEDERAIS_EXIGIDAS ? `
      <div style="background: rgba(37, 99, 235, 0.02); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); border-left: 4px solid var(--blue-vibrant); margin-bottom: 1rem;">
        <h4 style="font-size: 0.85rem; font-weight: 800; color: var(--blue-vibrant); text-transform: uppercase; margin: 0 0 0.4rem 0;">Habilitação Exigida / Normas Específicas</h4>
        <div style="font-size: 0.88rem; color: var(--text-main); line-height: 1.5;">
          ${fields.NORMAS_PROPRIAS || fields.HABILITACAO_EXIGIDA || fields.HABILITACOES_FEDERAIS_EXIGIDAS}
        </div>
      </div>
      ` : ''}

      <details style="border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
        <summary style="padding: 0.75rem 1rem; font-weight: 700; color: var(--text-title); cursor: pointer; background: var(--bg-card-hover); font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; user-select: none;">
          <i data-lucide="chevron-down" style="width: 16px; height: 16px;"></i> Ver Legislação e Portarias Estaduais Comuns do ASSISTIR
        </summary>
        <div style="padding: 1rem; border-top: 1px solid var(--border-color);">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.80rem; line-height: 1.5;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-color); text-align: left;">
                <th style="padding: 0.5rem; font-weight: 800; color: var(--text-title); width: 140px;">Camada</th>
                <th style="padding: 0.5rem; font-weight: 800; color: var(--text-title);">Dispositivo / Norma</th>
              </tr>
            </thead>
            <tbody>
              ${BLOCOS_COMUNS.legislacao.map(row => `
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.5rem 0.25rem; font-weight: 700; color: var(--blue-vibrant);">${row.Camada || row.camada}</td>
                <td style="padding: 0.5rem; color: var(--text-main);">${row.Norma || row.norma}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </details>
    </div>

    <!-- 6. OBSERVAÇÕES E PENDÊNCIAS -->
    <div class="card" style="margin-bottom: 1.5rem;">
      <div class="card-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.25rem;">
        <h3 style="font-size: 1.15rem; color: var(--text-title); font-weight: 800; display: flex; align-items: center; gap: 0.5rem; margin: 0;">
          <i data-lucide="info" style="color: var(--navy-primary); width: 20px; height: 20px;"></i>
          Observações e Pendências
        </h3>
      </div>

      ${fields.OBSERVACAO_ESTRUTURAL || fields.OBSERVACAO_DIFERENCIAL ? `
      <div style="background: rgba(30, 41, 59, 0.02); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 1rem; font-size: 0.88rem; line-height: 1.5; color: var(--text-main);">
        <strong>Nota Estrutural do Ambulatório:</strong>
        <div style="margin-top: 0.4rem; font-style: italic;">
          ${fields.OBSERVACAO_ESTRUTURAL || fields.OBSERVACAO_DIFERENCIAL}
        </div>
      </div>
      ` : ''}

      <details style="border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
        <summary style="padding: 0.75rem 1rem; font-weight: 700; color: var(--text-title); cursor: pointer; background: var(--bg-card-hover); font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; user-select: none;">
          <i data-lucide="chevron-down" style="width: 16px; height: 16px;"></i> Ver Diretrizes Operacionais Gerais e Regulamento Administrativo
        </summary>
        <div style="padding: 1rem; border-top: 1px solid var(--border-color);">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.80rem; line-height: 1.5;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-color); text-align: left;">
                <th style="padding: 0.5rem; font-weight: 800; color: var(--text-title); width: 140px;">Regra</th>
                <th style="padding: 0.5rem; font-weight: 800; color: var(--text-title);">Conteúdo do Regulamento</th>
              </tr>
            </thead>
            <tbody>
              ${BLOCOS_COMUNS.observacoes.map(row => `
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.5rem 0.25rem; font-weight: 700; color: var(--navy-primary);">${row.Item || row.item}</td>
                <td style="padding: 0.5rem; color: var(--text-main);">${row["Conteúdo"] || row.conteudo || row.Conteudo}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </details>
    </div>

    <!-- 7. AVALIAÇÃO DE VIABILIDADE (Módulo Interativo) -->
    <div class="card" style="margin-bottom: 1.5rem; border: 2px solid var(--navy-primary); padding: 0;">
      <!-- Title -->
      <div style="background: var(--navy-primary); color: #FFFFFF; padding: 1rem 1.5rem; border-top-left-radius: var(--radius-sm); border-top-right-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.5rem;">
        <i data-lucide="sliders" style="width: 20px; height: 20px;"></i>
        <h3 style="font-size: 1.2rem; font-weight: 900; margin: 0; color: #ffffff; letter-spacing: 0.5px;">
          AVALIAÇÃO DE VIABILIDADE DO AMBULATÓRIO
        </h3>
      </div>

      <div style="padding: 1.5rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; flex-wrap: wrap;">
          
          <!-- Left Col -->
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="sim-control-group">
              <label for="via_consultas_${key}" style="font-weight: 700; color: var(--text-title); display: block; margin-bottom: 0.4rem; font-size: 0.85rem;">
                Consultas/mês estimadas:
              </label>
              <input type="text" id="via_consultas_${key}" value="${valConsultas}" oninput="recalcResultadoViabilidade('${key}')" class="select-control" style="width: 100%; font-size: 0.9rem;" placeholder="Ex: 240/mês">
            </div>

            ${isPrioritario || isClinicoCirurgico ? `
            <div class="sim-control-group">
              <label for="via_cirurgias_${key}" style="font-weight: 700; color: var(--text-title); display: block; margin-bottom: 0.4rem; font-size: 0.85rem;">
                Cirurgias/mês estimadas:
              </label>
              <input type="text" id="via_cirurgias_${key}" value="${valCirurgias}" oninput="recalcResultadoViabilidade('${key}')" class="select-control" style="width: 100%; font-size: 0.9rem;" placeholder="Ex: 15/mês">
            </div>
            ` : ''}

            <div class="sim-control-group">
              <label for="via_equipe_${key}" style="font-weight: 700; color: var(--text-title); display: block; margin-bottom: 0.4rem; font-size: 0.85rem;">
                Equipe disponível:
              </label>
              <select id="via_equipe_${key}" onchange="recalcResultadoViabilidade('${key}')" class="select-control" style="width: 100%; font-size: 0.9rem;">
                <option value="Atende" ${valEquipe === 'Atende' ? 'selected' : ''}>Atende (Equipe completa disponível)</option>
                <option value="Não atende" ${valEquipe === 'Não atende' ? 'selected' : ''}>Não atende (Sem equipe técnica)</option>
                <option value="Parcial" ${valEquipe === 'Parcial' ? 'selected' : ''}>Parcial (Carga horária/especialistas incompletos)</option>
              </select>
            </div>

            <div class="sim-control-group">
              <label for="via_exames_${key}" style="font-weight: 700; color: var(--text-title); display: block; margin-bottom: 0.4rem; font-size: 0.85rem;">
                Exames mínimos necessários:
              </label>
              <select id="via_exames_${key}" onchange="recalcResultadoViabilidade('${key}')" class="select-control" style="width: 100%; font-size: 0.9rem;">
                <option value="Próprios" ${valExames === 'Próprios' ? 'selected' : ''}>Próprios (Realizados na estrutura do hospital)</option>
                <option value="Terceirizados" ${valExames === 'Terceirizados' ? 'selected' : ''}>Terceirizados (Pactuados/referenciados)</option>
                <option value="Indisponíveis" ${valExames === 'Indisponíveis' ? 'selected' : ''}>Indisponíveis (Gargalo estrutural)</option>
              </select>
            </div>
          </div>

          <!-- Right Col -->
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="sim-control-group">
              <label for="via_custo_${key}" style="font-weight: 700; color: var(--text-title); display: block; margin-bottom: 0.4rem; font-size: 0.85rem;">
                Custo mensal estimado da equipe (R$):
              </label>
              <input type="number" id="via_custo_${key}" value="${valCusto}" oninput="recalcResultadoViabilidade('${key}')" class="select-control" style="width: 100%; font-size: 0.9rem; font-weight: bold;" min="0" step="500" placeholder="Ex: 50000">
            </div>

            <div class="sim-control-group">
              <label for="via_sd_${key}" style="font-weight: 700; color: var(--text-title); display: block; margin-bottom: 0.4rem; font-size: 0.85rem;">
                Suplementar Diferencial (SD) de Incentivo:
              </label>
              <select id="via_sd_${key}" onchange="recalcResultadoViabilidade('${key}')" class="select-control" style="width: 100%; font-size: 0.9rem;">
                <option value="0" ${valSD === 0 ? 'selected' : ''}>0% - Sem Adicional Diferencial</option>
                <option value="0.25" ${valSD === 0.25 ? 'selected' : ''}>+25% - Hosp. Público até 99 Leitos</option>
                <option value="0.30" ${valSD === 0.30 ? 'selected' : ''}>+30% - Hosp. Público acima de 100 Leitos</option>
              </select>
            </div>

            ${isPrioritario ? `
            <div class="sim-control-group" style="background: rgba(79, 70, 229, 0.05); padding: 0.75rem; border-radius: 4px; border: 1px solid rgba(79, 70, 229, 0.15);">
              <label for="via_prod_base_${key}" style="font-weight: 700; color: #4f46e5; display: block; margin-bottom: 0.4rem; font-size: 0.85rem;">
                Produção cirúrgica de média complexidade base (anual):
              </label>
              <input type="number" id="via_prod_base_${key}" value="${valProdBase}" oninput="recalcResultadoViabilidade('${key}')" class="select-control" style="width: 100%; font-size: 0.9rem; border-color: #818cf8; font-weight: bold; background: #ffffff;" min="0" step="5">
              <span style="font-size: 0.68rem; color: var(--text-muted); display: block; margin-top: 0.25rem;">
                * Parâmetro de cálculo obrigatório para especialidades sob modelo PRIORITÁRIO.
              </span>
            </div>
            ` : ''}

            <div class="sim-control-group">
              <label for="via_parecer_${key}" style="font-weight: 700; color: var(--text-title); display: block; margin-bottom: 0.4rem; font-size: 0.85rem;">
                Parecer técnico da equipe:
              </label>
              <select id="via_parecer_${key}" onchange="recalcResultadoViabilidade('${key}')" class="select-control" style="width: 100%; font-size: 0.9rem; font-weight: bold;">
                <option value="Viável" ${valParecer === 'Viável' ? 'selected' : ''} style="color: var(--success);">Viável</option>
                <option value="Inviável" ${valParecer === 'Inviável' ? 'selected' : ''} style="color: var(--danger);">Inviável</option>
                <option value="Viável com condições" ${valParecer === 'Viável com condições' ? 'selected' : ''} style="color: var(--warning);">Viável com condições</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Observações livres -->
        <div style="margin-top: 1rem;">
          <label for="via_obs_${key}" style="font-weight: 700; color: var(--text-title); display: block; margin-bottom: 0.4rem; font-size: 0.85rem;">
            Observações / Condicionantes de Implantação:
          </label>
          <textarea id="via_obs_${key}" oninput="recalcResultadoViabilidade('${key}')" class="select-control" style="width: 100%; min-height: 80px; font-size: 0.9rem; padding: 0.5rem; line-height: 1.5;" placeholder="Digite anotações complementares, gargalos identificados ou exigências de infraestrutura... font-size: 0.9rem;">${valObs}</textarea>
        </div>

        <!-- RESULTADO FINANCEIRO ESTIMADO (Calculado Reativamente) -->
        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; flex-wrap: wrap;">
          
          <div style="background: var(--bg-card-hover); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: center;">
            <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">
              VITS Mensal Final Simulado
            </span>
            <div id="res_vits_${key}" style="font-size: 1.25rem; font-weight: 800; color: var(--text-title); margin-top: 0.2rem;">
              R$ ${vitsMensalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span style="font-size: 0.65rem; color: var(--text-muted); margin-top: 0.25rem; display: block; font-style: italic;">
              * Incentivo mensal recalculado com base no SD e produção-base.
            </span>
          </div>

          <div style="background: var(--bg-card-hover); padding: 1.25rem; border-radius: var(--radius-sm); border: 1.5px solid var(--border-color); border-left: 5px solid var(--navy-primary); display: flex; flex-direction: column; justify-content: center;">
            <span style="font-size: 0.75rem; font-weight: 800; color: var(--navy-primary); text-transform: uppercase; letter-spacing: 0.5px;">
              Resultado Bruto Estimado
            </span>
            <div id="res_resultado_${key}" style="font-size: 1.6rem; font-weight: 900; color: 	ext-title; margin-top: 0.2rem;">
              R$ ${resultadoBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span style="font-size: 0.65rem; color: var(--text-muted); margin-top: 0.25rem; display: block; font-style: italic;">
              * Estimativa referencial (Incentivo Simulado - Custo Pessoal).
            </span>
          </div>

        </div>

      </div>
    </div>
  `;

  container.innerHTML = html;
  lucide.createIcons();
}

function renderAssistirAmbulatorio(key) {
  if (!key) key = currentAssistirKey || 'cardiologia';
  currentAssistirKey = key;
  window.currentAssistirKey = key;

  if (window.assistirViewMode === 'portaria') {
    renderPortariaAmbulatorio(key);
  } else {
    renderEstudoViabilidade(key);
  }
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
  },

  oftalmologia: {
    tituloEstudo: 'ESTUDO DE VIABILIDADE FINANCEIRA - CONSÓRCIO CISA | OFTALMOLOGIA',
    subtitulo: 'AMBULATÓRIO DE OFTALMOLOGIA',
    itensProcedimentos: [
      { id: '03.01.01.007-2', descricao: 'CONSULTA MÉDICA OFTALMOLÓGICA', qtd: 240, sigtap: 10.00, incentivo: 0, custoUnit: 60.00 },
      { id: '04.05.05.037-2', descricao: 'FACOEMULSIFICAÇÃO C/ IMPLANTE LIO (CATARATA)', qtd: 50, sigtap: 640.00, incentivo: 76587.70, custoUnit: 480.00 },
      { id: '04.05.05.011-9', descricao: 'CAPSULOTOMIA A YAG LASER', qtd: 25, sigtap: 65.00, incentivo: 0, custoUnit: 40.00 },
      { id: '02.05.02.002-0', descricao: 'PAQUIMETRIA ULTRASSÔNICA', qtd: 40, sigtap: 18.50, incentivo: 0, custoUnit: 12.00 },
      { id: '02.05.02.008-9', descricao: 'ULTRASSONOGRAFIA DO GLOBO OCULAR', qtd: 30, sigtap: 24.20, incentivo: 0, custoUnit: 15.00 },
      { id: '02.11.06.010-9', descricao: 'MAPEAMENTO DE RETINA', qtd: 80, sigtap: 21.00, incentivo: 0, custoUnit: 14.00 },
      { id: '02.11.06.026-5', descricao: 'TONOMETRIA (GLAUCOMA)', qtd: 120, sigtap: 4.80, incentivo: 0, custoUnit: 3.00 },
      { id: '02.11.06.003-6', descricao: 'CAMPIMETRIA COMPUTADORIZADA', qtd: 35, sigtap: 28.00, incentivo: 0, custoUnit: 18.00 }
    ],
    itensPessoal: [
      { id: 'x', funcao: 'MÉDICO OFTALMOLOGISTA CIRURGIÃO (2 PROFISSIONAIS)', qtd: 2.0, custoUnit: 12000.00 },
      { id: 'x', funcao: 'ENFERMEIRO CENTRO CIRÚRGICO / AMBULATÓRIO', qtd: 1.0, custoUnit: 4200.00 },
      { id: 'x', funcao: 'TÉCNICO DE ENFERMAGEM', qtd: 2.0, custoUnit: 3086.43 },
      { id: 'x', funcao: 'RECEPCIONISTA / REGULAÇÃO CISA', qtd: 1.0, custoUnit: 2200.00 }
    ]
  }
};

/* RECALCULA A TABELA DO EXCEL DA VIABILIDADE EM TEMPO REAL */

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
   MÓDULO DINÂMICO: PRÓ-HOSPITAIS (PPH/RS) - IMPLEMENTAÇÃO INTEGRAL
   ========================================================================== */

/* ============ armazenamento com fallback ============ */
const Store={
  mem:{},
  get(k){try{const v=localStorage.getItem(k);return v!==null?v:(this.mem[k]??null)}catch(e){return this.mem[k]??null}},
  set(k,v){try{localStorage.setItem(k,v)}catch(e){this.mem[k]=v}}
};

/* ============ dados ============ */
const FASES=[
  {nome:"Fase 1 — Preparação",cor:"var(--azul2)",bg:"var(--azul-bg)"},
  {nome:"Fase 2 — Protocolo",cor:"var(--roxo)",bg:"var(--roxo-bg)"},
  {nome:"Fase 3 — Análise",cor:"var(--ambar)",bg:"var(--ambar-bg)"},
  {nome:"Fase 4 — Execução",cor:"var(--verde)",bg:"var(--verde-bg)"}
];

const ETAPAS=[
 {f:0,t:"Ler a Portaria SES nº 1.255/2025",d:"Base normativa: LC 16.163/2024 e Decreto 58.419/2025",infog:true,
  req:["Obter os decretos 58.659/2026 e 58.740/2026, que alteram a regulamentação",
       "Confirmar se os 5% incidem sobre saldo devedor mensal ou anual",
       "Verificar o teto vigente e a modalidade admitida no exercício (obra ou equipamento)"]},
 {f:0,t:"Estruturar o projeto",d:"Plano de trabalho com viabilidade técnica e financeira",infog:false,
  req:["Justificativa com diagnóstico assistencial e série histórica de produção SIA/SIH",
       "Metas e indicadores de produção adicional em procedimentos SIGTAP",
       "Três orçamentos com especificação técnica idêntica e memória de cálculo",
       "Cronograma físico-financeiro compatível com o prazo de 6 meses",
       "Viabilidade: manutenção, insumos, RH habilitado e adequação física",
       "Declaração de uso exclusivo pelo SUS"]},
 {f:0,t:"Captar o patrocinador",d:"Empresa contribuinte de ICMS assina a Carta de Anuência (CAP)",infog:false,
  req:["Mapear empresas com saldo devedor de ICMS compatível (usar o simulador)",
       "Descartar optantes do Simples, exportadores e beneficiários de crédito presumido",
       "Obter CNPJ, inscrição estadual e regularidade fiscal estadual do patrocinador",
       "Colher a CAP com valor e cronograma de destinação",
       "Declaração de inexistência de vínculo com dirigentes do proponente"]},
 {f:1,t:"Protocolar no Sistema de Convênios e Parcerias",d:"Anexar os documentos do Anexo I da Portaria 1.255/2025",infog:true,
  req:["Estatuto, ata de eleição da diretoria e documentos do representante legal",
       "CNPJ, alvará sanitário, licença de funcionamento e AVCB",
       "CNES atualizado com leitos, serviços e habilitações",
       "CEBAS vigente, no caso de entidade filantrópica",
       "Certidões: FGTS, INSS/RFB, dívida ativa estadual e municipal, CNDT",
       "Contrato ou termo de contratualização com o gestor do SUS",
       "Demonstrações contábeis do último exercício",
       "Sem anexação no sistema, o projeto não é analisado pelo Conselho Gestor"]},
 {f:1,t:"Ofício à SES e ao Conselho-Gestor",d:"Número da proposta e CAP para pph@saude.rs.gov.br",infog:true,
  req:["Ofício institucional assinado pelo representante legal",
       "Informar o número da proposta gerado no sistema",
       "Anexar a Carta de Anuência do Patrocinador",
       "Guardar comprovante de envio e protocolo"]},
 {f:2,t:"Análise técnica e deliberação",d:"Manifestação da SES e voto do CGPPH/RS",infog:false,
  req:["Acompanhar o processo SEI e responder diligências no prazo",
       "Deliberação do Conselho Gestor registrada em ata",
       "Integrantes com vínculo ao proponente ou patrocinador ficam impedidos de votar"]},
 {f:3,t:"Homologação, CHP e execução",d:"Até 6 meses para a aquisição ou realização da obra",infog:false,
  req:["Homologação pela Secretária de Estado da Saúde, publicada no site da SES",
       "Emissão da Carta de Habilitação de Patrocínio (CHP)",
       "Processo de compra formalizado com os três orçamentos",
       "Nota fiscal, termo de recebimento e tombamento patrimonial"]},
 {f:3,t:"Prestação de contas",d:"Libera a compensação do ICMS pelo patrocinador",infog:false,
  req:["Registro do equipamento no CNES",
       "Relatório de produção SUS após a implantação",
       "Comprovação documental completa da execução",
       "Falha aqui gera exposição direta ao patrocinador"]}
];

const LEIS=[
 {ano:"2024",data:"30 jul",tipo:"Lei Complementar",cor:"var(--roxo)",n:"Lei Complementar Estadual nº 16.163/2024",
  d:"Institui o Programa Pró-Hospitais. Até 5% do saldo devedor do ICMS.",novo:false},
 {ano:"2025",data:"jul",tipo:"Marco",cor:"#5F5E5A",n:"Aprovação pelo CONFAZ",
  d:"Autoriza o benefício fiscal, requisito prévio para a regulamentação estadual.",novo:false},
 {ano:"2025",data:"24 out",tipo:"Decreto",cor:"var(--azul2)",n:"Decreto Estadual nº 58.419/2025",
  d:"Regulamenta o Programa. Cria o CEP e a CHP; teto de 0,5% da receita de ICMS.",novo:false},
 {ano:"2025",data:"1º dez",tipo:"Portaria",cor:"var(--verde)",n:"Portaria SES nº 1.255/2025",
  d:"Procedimentos operacionais e Anexo I — documentos da proposta.",novo:false},
 {ano:"2025",data:"1º dez",tipo:"Portaria",cor:"var(--verde)",n:"Portaria SES nº 1.256/2025",
  d:"Institui o Conselho Gestor do Programa Pró-Hospitais (CGPPH/RS).",novo:false},
 {ano:"2026",data:"—",tipo:"Portaria",cor:"var(--verde)",n:"Portaria SES nº 132/2026",
  d:"Homologa o Regimento Interno do Conselho Gestor.",novo:true},
 {ano:"2026",data:"—",tipo:"Decreto",cor:"var(--azul2)",n:"Decreto Estadual nº 58.659/2026",
  d:"Altera a regulamentação do Programa e as condições de operacionalização.",novo:true},
 {ano:"2026",data:"—",tipo:"Decreto",cor:"var(--azul2)",n:"Decreto Estadual nº 58.740/2026",
  d:"Altera a regulamentação do Programa e as condições de operacionalização.",novo:true}
];

const SETORES=[
 ["Atacado e distribuição — alimentos e bebidas",2.5,"Alta"],
 ["Distribuição de medicamentos",2.0,"Alta"],
 ["Supermercados e varejo alimentar",3.5,"Alta"],
 ["Varejo geral — construção, móveis, eletro",3.5,"Alta"],
 ["Concessionárias de veículos e máquinas",2.5,"Alta"],
 ["Indústria de alimentos — mercado interno",4.0,"Alta"],
 ["Indústria metalmecânica",3.0,"Alta"],
 ["Distribuição de combustíveis",1.5,"Média"],
 ["Cooperativa agroindustrial",2.0,"Média"],
 ["Energia e telecomunicações",10.0,"Média"],
 ["Indústria exportadora",0.2,"Baixa"],
 ["Empresa com crédito presumido ou Fundopem",0.5,"Baixa"],
 ["Optante do Simples Nacional",0,"Inapta"],
 ["Prestador de serviços — recolhe ISS",0,"Inapta"]
];

const PORTES=[[0,"Pequena empresa — inviável isoladamente"],[20e6,"Média empresa regional"],
 [50e6,"Média-grande empresa"],[200e6,"Grande empresa"],[500e6,"Muito grande — ou consórcio"]];

const brl=v=>isFinite(v)?v.toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}):"—";
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ============ fluxo ============ */
function renderFluxo(){
  let h="";
  FASES.forEach((fa,fi)=>{
    const its=ETAPAS.map((e,i)=>({e,i})).filter(o=>o.e.f===fi);
    if(!its.length)return;
    h+=`<div class="fase"><div class="fase-tit"><i style="background:${fa.cor}"></i>
        <strong style="color:${fa.cor}">${fa.nome}</strong>
        <span>${its.length} etapa${its.length>1?"s":""}</span></div><div class="etapas">`;
    its.forEach(({e,i})=>{
      h+=`<div class="etapa" style="border-left-color:${fa.cor}" onclick="this.classList.toggle('aberta')">
        <div class="etapa-top">
          <div class="num" style="background:${fa.cor}">${i+1}</div>
          <div><h4>${esc(e.t)}</h4><div class="desc">${esc(e.d)}</div></div>
          ${e.infog?'<div class="tag">INFOGRÁFICO SES</div>':""}
        </div>
        <div class="detalhe"><ul>${e.req.map(r=>`<li>${esc(r)}</li>`).join("")}</ul></div>
      </div>`;
    });
    h+="</div></div>";
  });
  document.getElementById("fluxoBox").innerHTML=h;
}

/* ============ legislacao ============ */
function renderLeis(){
  document.getElementById("leisBox").innerHTML=LEIS.map(l=>`
    <div class="lei ${l.novo?"nova":""}">
      <div class="ano">${l.data}<br>${l.ano}</div>
      <div class="bar-tipo" style="background:${l.cor}"></div>
      <div><h4>${esc(l.n)}</h4><p>${esc(l.d)}</p></div>
      ${l.novo?'<div class="selo">NOVO — 2026</div>':""}
    </div>`).join("");
}

/* ============ simulador ============ */
function renderSetores(){
  document.getElementById("sSetor").innerHTML=
    '<option value="">Informar carga manualmente</option>'+
    SETORES.map((s,i)=>`<option value="${i}">${esc(s[0])}</option>`).join("");
  document.getElementById("setoresBox").innerHTML=SETORES.map(s=>
    `<tr><td>${esc(s[0])}</td><td class="n">${s[1].toFixed(1).replace(".",",")}%</td>
     <td><span class="apt ${s[2]}">${s[2]}</span></td></tr>`).join("");
}
function calc(){
  const v=+sValor.value||0, pct=(+sPct.value||0)/100, meses=+sMeses.value||1,
        carga=(+sCarga.value||0)/100, np=+sPatroc.value||1;
  const total=pct>0?v/pct:0, porPat=total/np, mensal=porPat/meses,
        anual=mensal*12, fat=carga>0?anual/carga:0, mult=v>0?total/v:0;
  rTotal.textContent=brl(total); rPorPat.textContent=brl(porPat);
  rMensal.textContent=brl(mensal); rFat.textContent=brl(fat);
  rMult.textContent=mult.toFixed(1).replace(".",",")+"x";
  let p=PORTES[0][1]; PORTES.forEach(f=>{if(fat>=f[0])p=f[1]});
  rPorte.textContent=carga>0?p:"Informe a carga de ICMS";
}
function setSetor(){
  const i=sSetor.value; if(i!=="")sCarga.value=SETORES[+i][1]; calc();
}

/* ============ projetos ============ */
let PROJ=[];
function carregar(){
  try{PROJ=JSON.parse(Store.get("pph_projetos")||"[]")}catch(e){PROJ=[]}
}
function salvar(){Store.set("pph_projetos",JSON.stringify(PROJ));renderProj()}

function addProjeto(){
  const nome=pNome.value.trim();
  if(!nome){alert("Informe o nome ou objeto do projeto.");pNome.focus();return}
  PROJ.push({id:Date.now(),nome,inst:pInst.value.trim(),valor:+pValor.value||0,
    patroc:pPatroc.value.trim(),proposta:pProposta.value.trim(),obs:pObs.value.trim(),
    etapas:Array(ETAPAS.length).fill(false)});
  pNome.value="";pValor.value="";pPatroc.value="";pProposta.value="";pObs.value="";
  salvar();
}
function toggleEtapa(id,i){
  const p=PROJ.find(x=>x.id===id); if(!p)return;
  const marcar=!p.etapas[i];
  for(let k=0;k<=i;k++) if(marcar) p.etapas[k]=true;
  if(!marcar) for(let k=i;k<p.etapas.length;k++) p.etapas[k]=false;
  salvar();
}
function remover(id){
  if(confirm("Remover este projeto do painel?")){PROJ=PROJ.filter(x=>x.id!==id);salvar()}
}
function renderProj(){
  const box=document.getElementById("listaProjetos");
  if(!PROJ.length){
    box.innerHTML='<div class="vazio">Nenhum projeto cadastrado ainda.</div>';
    if(typeof updatePphStatus === 'function') updatePphStatus();
    return;
  }
  box.innerHTML=PROJ.map(p=>{
    const feitas=p.etapas.filter(Boolean).length;
    const atual=feitas<ETAPAS.length?feitas:ETAPAS.length-1;
    const nomeAtual=feitas>=ETAPAS.length?"Concluído":ETAPAS[atual].t;
    const icms=p.valor*20;
    return `<div class="proj">
      <div class="proj-top">
        <div>
          <h4>${esc(p.nome)}</h4>
          <div class="meta">${esc(p.inst||"—")} · Patrocinador: ${esc(p.patroc||"a definir")}
          ${p.proposta?" · Proposta "+esc(p.proposta):""}</div>
        </div>
        <div class="valor"><b>${brl(p.valor)}</b><span>exige ${brl(icms)} de ICMS/ano</span></div>
      </div>
      <div class="trilha">${p.etapas.map((ok,i)=>
        `<div class="passo ${ok?"ok":(i===feitas?"atual":"")}" title="${esc(ETAPAS[i].t)}"
          onclick="toggleEtapa(${p.id},${i})"></div>`).join("")}</div>
      <div class="trilha-info">
        <span>Etapa atual: <b>${esc(nomeAtual)}</b></span>
        <span>${feitas} de ${ETAPAS.length} concluídas</span>
      </div>
      ${p.obs?`<div class="meta" style="margin-top:8px;font-size:12.5px;color:var(--tinta2)">${esc(p.obs)}</div>`:""}
      <div class="acoes"><button class="btn d" onclick="remover(${p.id})">Remover</button></div>
    </div>`;
  }).join("");
  if(typeof updatePphStatus === 'function') updatePphStatus();
}
function exportar(){
  const b=new Blob([JSON.stringify(PROJ,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(b);a.download="pph-projetos.json";a.click();
}
function importar(ev){
  const f=ev.target.files[0]; if(!f)return;
  const r=new FileReader();
  r.onload=()=>{try{const d=JSON.parse(r.result);
    if(Array.isArray(d)){PROJ=d;salvar();alert("Dados importados.")}else alert("Arquivo inválido.")}
    catch(e){alert("Não foi possível ler o arquivo.")}};
  r.readAsText(f);
}



// Helper function to wrap initialization and attach event listeners once
let pphInitialized = false;
function initPphTab() {
  const fluxoEl = document.getElementById("fluxoBox");
  if (!fluxoEl) return; // defensive check in case tab is not fully in DOM
  
  renderFluxo();
  renderLeis();
  renderSetores();
  carregar();
  renderProj();
  calc();
  
  if (!pphInitialized) {
    ["sValor","sCarga","sPct","sMeses","sPatroc"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", calc);
      }
    });
    const sSetorEl = document.getElementById("sSetor");
    if (sSetorEl) {
      sSetorEl.addEventListener("change", setSetor);
    }
    pphInitialized = true;
    console.log("Pró-Hospitais tab initialized and event listeners bound.");
  }
}

// Bind all functions to window to ensure inline HTML onclick/onchange/onsubmit works perfectly
function updatePphStatus() {
  const container = document.getElementById("pphStatusAcompanhamento");
  const statusIcon = document.getElementById("pphStatusIcon");
  const statusText = document.getElementById("pphStatusText");
  const badgeContainer = document.getElementById("pphStatusBadgeContainer");
  
  if (!statusText || !statusIcon || !badgeContainer || !container) return;
  
  if (typeof PROJ !== 'undefined' && PROJ && PROJ.length > 0) {
    // Project is active! Reset layout to green success
    container.style.background = "var(--bg-card)";
    container.style.border = "1px solid var(--border-color)";
    
    const p = PROJ[0];
    statusIcon.style.background = "rgba(16, 185, 129, 0.15)";
    statusIcon.style.color = "var(--success)";
    statusIcon.innerHTML = '<i data-lucide="check-circle" style="width: 22px; height: 22px;"></i>';
    statusText.innerHTML = `Projeto ativo: <strong>${esc(p.nome)}</strong> (R$ ${p.valor.toLocaleString('pt-BR')}) - Acompanhamento Inicial Ativo`;
    statusText.style.color = "var(--text-title)";
    badgeContainer.innerHTML = '<span class="badge-sus" style="background: rgba(16, 185, 129, 0.15); color: var(--success); font-weight: 800; font-size: 0.8rem; padding: 0.4rem 0.8rem; border-radius: var(--radius-xs);">ATIVO</span>';
  } else {
    // No projects - Set to red warning layout to create urgency
    container.style.background = "rgba(239, 68, 68, 0.03)";
    container.style.border = "1px solid rgba(239, 68, 68, 0.3)";
    
    statusIcon.style.background = "rgba(239, 68, 68, 0.15)";
    statusIcon.style.color = "var(--danger)";
    statusIcon.innerHTML = '<i data-lucide="alert-triangle" class="pulse-red" style="width: 22px; height: 22px;"></i>';
    statusText.innerHTML = "Aguardando cadastro de projeto de 100k para acompanhamento inicial";
    statusText.style.color = "var(--text-title)";
    badgeContainer.innerHTML = '<span class="badge-sus" style="background: rgba(239, 68, 68, 0.15); color: var(--danger); font-weight: 800; font-size: 0.8rem; padding: 0.4rem 0.8rem; border-radius: var(--radius-xs);">ATENÇÃO</span>';
  }
  
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}
window.updatePphStatus = updatePphStatus;

window.initPphTab = initPphTab;
window.renderFluxo = renderFluxo;
window.renderLeis = renderLeis;
window.renderSetores = renderSetores;
window.calc = calc;
window.setSetor = setSetor;
window.addProjeto = addProjeto;
window.toggleEtapa = toggleEtapa;
window.remover = remover;
window.renderProj = renderProj;
window.exportar = exportar;
window.importar = importar;
window.carregar = carregar;
window.salvar = salvar;



// --- CREDITO FINANCEIRO INIT AND LOGIC ---
let creditoInitialized = false;
function initCreditoTab() {
  const checkEl = document.getElementById('linhas');
  if (!checkEl) return;
  
  if (creditoInitialized) return;
  creditoInitialized = true;
  
  console.log("Initializing Crédito Financeiro tab...");
  
  
const ITENS = [{"c": "02.07.01.001-3", "n": "Angiorressonância cerebral", "v": 268.75, "i": 0.86, "na": false, "g": "Ressonância"}, {"c": "02.11.02.001-0", "n": "Cateterismo cardíaco", "v": 730.04, "i": 2.0, "na": false, "g": "Hemodinâmica"}, {"c": "02.11.02.002-8", "n": "Cateterismo cardíaco em pediatria", "v": 653.72, "i": 2.0, "na": false, "g": "Hemodinâmica"}, {"c": "02.08.05.001-9", "n": "Cintilografia de articulações e/ou extremidades e/ou osso", "v": 180.32, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.01.001-7", "n": "Cintilografia de coração com gálio 67", "v": 457.55, "i": 1.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.09.001-0", "n": "Cintilografia de corpo inteiro com gálio 67 para pesquisa de neoplasias", "v": 906.8, "i": 0, "na": true, "g": "Medicina nuclear"}, {"c": "02.08.02.001-2", "n": "Cintilografia de fígado e baço (mínimo 5 imagens)", "v": 133.26, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.02.002-0", "n": "Cintilografia de fígado e vias biliares", "v": 187.93, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.09.002-9", "n": "Cintilografia de glândula lacrimal (dacriocintilografia)", "v": 66.23, "i": 2.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.02.003-9", "n": "Cintilografia de glândulas salivares com ou sem estímulo", "v": 87.89, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.09.003-7", "n": "Cintilografia de mama (bilateral)", "v": 289.43, "i": 2.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.01.002-5", "n": "Cintilografia de miocárdio para avaliação da perfusão em situação de estresse", "v": 408.52, "i": 1.2, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.01.003-3", "n": "Cintilografia de miocárdio para avaliação da perfusão in situação de repouso", "v": 383.07, "i": 1.3, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.01.004-1", "n": "Cintilografia de miocárdio para localização de necrose", "v": 166.47, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.05.003-5", "n": "Cintilografia de ossos com ou sem fluxo sanguíneo (corpo inteiro)", "v": 190.99, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.03.001-8", "n": "Cintilografia de paratireoides", "v": 324.54, "i": 2.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.06.001-4", "n": "Cintilografia de perfusão cerebral com tálio (spect)", "v": 438.01, "i": 1.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.07.001-0", "n": "Cintilografia de pulmão com gálio 67", "v": 457.55, "i": 1.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.07.002-8", "n": "Cintilografia de pulmão para pesquisa de aspiração", "v": 127.51, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.07.003-6", "n": "Cintilografia de pulmão por inalação (mínimo 2 projeções)", "v": 127.12, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.07.004-4", "n": "Cintilografia de pulmão por perfusão (mínimo 4 projeções)", "v": 130.5, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.04.002-1", "n": "Cintilografia de rim com gálio 67", "v": 457.55, "i": 1.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.05.004-3", "n": "Cintilografia de segmento ósseo com gálio 67", "v": 457.55, "i": 1.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.08.001-5", "n": "Cintilografia de sistema retículo-endotelial (medula óssea)", "v": 112.61, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.04.003-0", "n": "Cintilografia de testículo e bolsa escrotal", "v": 108.94, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.03.003-4", "n": "Cintilografia de tireoide com teste de supressão / estímulo", "v": 107.3, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.03.002-6", "n": "Cintilografia de tireoide com ou sem captação", "v": 77.28, "i": 1.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.01.005-0", "n": "Cintilografia para avaliação de fluxo sanguíneo de extremidades", "v": 114.02, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.02.005-5", "n": "Cintilografia para estudo de trânsito esofágico (líquido)", "v": 135.38, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.02.006-3", "n": "Cintilografia para estudo de trânsito esofágico (semi-sólido)", "v": 135.38, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.02.007-1", "n": "Cintilografia para estudo de trânsito gástrico", "v": 144.22, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.02.008-0", "n": "Cintilografia para pesquisa de diverticulose de Meckel", "v": 114.86, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.02.009-8", "n": "Cintilografia para pesquisa de hemorragia digestiva ativa", "v": 157.23, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.02.010-1", "n": "Cintilografia para pesquisa de hemorragia digestiva não ativa", "v": 310.82, "i": 2.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.02.011-0", "n": "Cintilografia para pesquisa de refluxo gastro-esofágico", "v": 135.38, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.03.004-2", "n": "Cintilografia para pesquisa do corpo inteiro", "v": 338.7, "i": 1.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.01.006-8", "n": "Cintilografia para quantificação de shunt extracardíaco", "v": 142.57, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.04.005-6", "n": "Cintilografia renal/renograma (qualitativa e/ou quantitativa)", "v": 133.03, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.01.007-6", "n": "Cintilografia sincronizada de câmaras cardíacas em situação de esforço", "v": 214.85, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.01.008-4", "n": "Cintilografia sincronizada de câmaras cardíacas em repouso (ventriculografia)", "v": 176.72, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.06.002-2", "n": "Cisternocintilografia (incluindo pesquisa e/ou avaliação do trânsito liquórico)", "v": 205.34, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.04.006-4", "n": "Cistocintilografia direta", "v": 122.97, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.08.04.007-2", "n": "Cistocintilografia indireta", "v": 144.5, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.09.01.001-0", "n": "Colangiopancreatografia retrógrada (via endoscópica)", "v": 90.68, "i": 3.0, "na": false, "g": "Endoscopia"}, {"c": "02.09.01.002-9", "n": "Colonoscopia (coloscopia)", "v": 112.66, "i": 3.0, "na": false, "g": "Endoscopia"}, {"c": "02.04.06.002-8", "n": "Densitometria óssea duo-energetica de coluna (vértebras lombares e/ou fêmur)", "v": 55.1, "i": 3.0, "na": false, "g": "Densitometria"}, {"c": "02.05.01.003-2", "n": "Ecocardiografia transtorácica", "v": 67.86, "i": 1.36, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.02.022-4", "n": "Elastografia hepática ultrassônica", "v": 24.2, "i": 3.13, "na": false, "g": "Ultrassonografia"}, {"c": "02.09.01.003-7", "n": "Esofagogastroduodenoscopia", "v": 48.16, "i": 6.27, "na": false, "g": "Endoscopia"}, {"c": "02.08.02.012-8", "n": "Imuno-cintilografia (anticorpo monoclonal)", "v": 1103.26, "i": 0, "na": true, "g": "Medicina nuclear"}, {"c": "02.08.08.004-0", "n": "Linfocintilografia", "v": 141.33, "i": 3.0, "na": false, "g": "Medicina nuclear"}, {"c": "02.04.03.018-8", "n": "Mamografia bilateral para rastreamento", "v": 45.0, "i": 1.22, "na": false, "g": "Radiologia"}, {"c": "02.07.02.006-0", "n": "Ressonância magnética da mama", "v": 268.75, "i": 0.86, "na": false, "g": "Ressonância"}, {"c": "02.07.03.001-4", "n": "Ressonância magnética de abdome superior", "v": 268.75, "i": 0.86, "na": false, "g": "Ressonância"}, {"c": "02.07.01.002-1", "n": "Ressonância magnética de articulação temporo-mandibular (bilateral)", "v": 268.75, "i": 0.86, "na": false, "g": "Ressonância"}, {"c": "02.07.03.002-2", "n": "Ressonância magnética de bacia / pelve / abdome inferior", "v": 268.75, "i": 0.86, "na": false, "g": "Ressonância"}, {"c": "02.07.01.003-0", "n": "Ressonância magnética de coluna cervical/pescoço", "v": 268.75, "i": 0.86, "na": false, "g": "Ressonância"}, {"c": "02.07.01.004-8", "n": "Ressonância magnética de coluna lombo-sacra", "v": 268.75, "i": 0.86, "na": false, "g": "Ressonância"}, {"c": "02.07.01.005-6", "n": "Ressonância magnética de coluna torácica", "v": 268.75, "i": 0.86, "na": false, "g": "Ressonância"}, {"c": "02.07.02.001-9", "n": "Ressonância magnética de coração / aorta com cine", "v": 361.25, "i": 0.38, "na": false, "g": "Ressonância"}, {"c": "02.07.01.006-4", "n": "Ressonância magnética de crânio", "v": 268.75, "i": 0.86, "na": false, "g": "Ressonância"}, {"c": "02.07.03.003-0", "n": "Ressonância magnética de membro inferior (unilateral)", "v": 268.75, "i": 0.86, "na": false, "g": "Ressonância"}, {"c": "02.07.02.002-7", "n": "Ressonância magnética de membro superior (unilateral)", "v": 268.75, "i": 0.86, "na": false, "g": "Ressonância"}, {"c": "02.07.01.007-2", "n": "Ressonância magnética de sela túrcica", "v": 268.75, "i": 0.86, "na": false, "g": "Ressonância"}, {"c": "02.07.02.003-5", "n": "Ressonância magnética de tórax", "v": 268.75, "i": 0.86, "na": false, "g": "Ressonância"}, {"c": "02.07.03.004-9", "n": "Ressonância magnética de vias biliares / colangiorressonância", "v": 268.75, "i": 0.86, "na": false, "g": "Ressonância"}, {"c": "02.07.03.005-7", "n": "Ressonância magnética multiparamétrica da próstata", "v": 268.75, "i": 0.86, "na": false, "g": "Ressonância"}, {"c": "04.07.01.025-4", "n": "Retirada de pólipo do tubo digestivo por endoscopia", "v": 29.84, "i": 2.0, "na": false, "g": "Complementar"}, {"c": "04.17.01.006-0", "n": "Sedação", "v": 15.15, "i": 8.9, "na": false, "g": "Complementar"}, {"c": "02.06.03.001-0", "n": "Tomografia computadorizada de abdome superior", "v": 138.63, "i": 1.16, "na": false, "g": "Tomografia"}, {"c": "02.06.03.002-9", "n": "Tomografia computadorizada de articulações de membro inferior", "v": 86.75, "i": 2.46, "na": false, "g": "Tomografia"}, {"c": "02.06.02.001-5", "n": "Tomografia computadorizada de articulações de membro superior", "v": 86.75, "i": 2.46, "na": false, "g": "Tomografia"}, {"c": "02.06.01.001-0", "n": "Tomografia computadorizada de coluna cervical com ou sem contraste", "v": 86.76, "i": 2.46, "na": false, "g": "Tomografia"}, {"c": "02.06.01.002-8", "n": "Tomografia computadorizada de coluna lombo-sacra com ou sem contraste", "v": 101.1, "i": 1.97, "na": false, "g": "Tomografia"}, {"c": "02.06.01.003-6", "n": "Tomografia computadorizada de coluna torácica com ou sem contraste", "v": 86.76, "i": 2.46, "na": false, "g": "Tomografia"}, {"c": "02.06.01.004-4", "n": "Tomografia computadorizada de face / seios da face / atm", "v": 86.75, "i": 2.46, "na": false, "g": "Tomografia"}, {"c": "02.06.03.003-7", "n": "Tomografia computadorizada de pelve / bacia / abdome inferior", "v": 138.63, "i": 1.16, "na": false, "g": "Tomografia"}, {"c": "02.06.02.002-3", "n": "Tomografia computadorizada de segmentos apendiculares", "v": 86.75, "i": 2.46, "na": false, "g": "Tomografia"}, {"c": "02.06.01.006-0", "n": "Tomografia computadorizada de sela túrcica", "v": 97.44, "i": 2.08, "na": false, "g": "Tomografia"}, {"c": "02.06.02.003-1", "n": "Tomografia computadorizada de tórax", "v": 136.41, "i": 1.2, "na": false, "g": "Tomografia"}, {"c": "02.06.01.007-9", "n": "Tomografia computadorizada do crânio", "v": 97.44, "i": 2.08, "na": false, "g": "Tomografia"}, {"c": "02.06.01.005-2", "n": "Tomografia computadorizada do pescoço", "v": 86.75, "i": 2.46, "na": false, "g": "Tomografia"}, {"c": "02.05.02.003-8", "n": "Ultrassonografia de abdome superior", "v": 24.2, "i": 3.13, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.02.004-6", "n": "Ultrassonografia de abdome total", "v": 37.95, "i": 1.64, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.02.005-4", "n": "Ultrassonografia de aparelho urinário", "v": 24.2, "i": 3.13, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.02.006-2", "n": "Ultrassonografia de articulação", "v": 24.2, "i": 3.13, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.02.007-0", "n": "Ultrassonografia de bolsa escrotal", "v": 24.2, "i": 3.13, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.02.008-9", "n": "Ultrassonografia de globo ocular / órbita (monocular)", "v": 24.2, "i": 3.13, "na": false, "g": "Ultrassonografia"}, {"c": "05.01.08.009-0", "n": "Ultrassonografia de órgão transplantado", "v": 12.0, "i": 3.0, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.02.011-9", "n": "Ultrassonografia de próstata (via transretal)", "v": 24.2, "i": 3.13, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.02.010-0", "n": "Ultrassonografia de próstata por via abdominal", "v": 24.2, "i": 3.13, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.02.012-7", "n": "Ultrassonografia de tireoide", "v": 24.2, "i": 3.13, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.02.013-5", "n": "Ultrassonografia de tórax (extracardíaca)", "v": 24.2, "i": 3.13, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.01.004-0", "n": "Ultrassonografia Doppler colorido de vasos", "v": 39.6, "i": 1.53, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.01.005-9", "n": "Ultrassonografia Doppler de fluxo obstétrico", "v": 42.9, "i": 1.33, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.02.009-7", "n": "Ultrassonografia mamária bilateral", "v": 24.2, "i": 3.13, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.02.014-3", "n": "Ultrassonografia obstétrica", "v": 24.2, "i": 3.13, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.02.015-1", "n": "Ultrassonografia obstétrica com Doppler colorido e pulsado", "v": 39.6, "i": 1.53, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.02.016-0", "n": "Ultrassonografia pélvica (ginecológica)", "v": 24.2, "i": 3.13, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.02.017-8", "n": "Ultrassonografia transfontanela", "v": 24.2, "i": 3.13, "na": false, "g": "Ultrassonografia"}, {"c": "02.05.02.018-6", "n": "Ultrassonografia transvaginal", "v": 24.2, "i": 3.13, "na": false, "g": "Ultrassonografia"}];
const brl = n => n.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:2});
const brl0 = n => n.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
const vol = {};
let filtro = '', grupoSel = 'Todos', base = 'valorizado';

const tbody = document.getElementById('linhas');
const busca = document.getElementById('busca');

function visiveis(){
  const q = filtro.trim().toLowerCase();
  return ITENS.filter(it =>
    (grupoSel === 'Todos' || it.g === grupoSel) &&
    (!q || it.n.toLowerCase().includes(q) || it.c.includes(q)));
}

function desenha(){
  const lista = visiveis();
  tbody.innerHTML = lista.map(it => {
    const incUn = it.v * it.i, valorizado = it.v + incUn, v = vol[it.c] || 0;
    return `<tr class="${v>0?'on':''}">
      <td class="cod">${it.c}</td>
      <td>${it.n}</td>
      <td class="grp">${it.g}</td>
      <td class="num">${brl(it.v)}</td>
      <td class="num"><span class="pct ${it.na?'na':''}">${it.na?'n/a':(it.i*100).toFixed(0)+'%'}</span></td>
      <td class="num">${brl(incUn)}</td>
      <td class="num">${brl(valorizado)}</td>
      <td class="num"><input class="vol" type="number" min="0" step="1" value="${v}" data-c="${it.c}" aria-label="Volume mensal de ${it.n}"></td>
      <td class="num">${v ? brl(base==='valorizado' ? valorizado*v : incUn*v) : '—'}</td>
    </tr>`;
  }).join('');
  document.getElementById('conta').textContent = lista.length + ' de ' + ITENS.length + ' procedimentos';
  totaliza();
}

function totaliza(){
  let prod = 0, inc = 0, qtd = 0;
  for (const it of ITENS){
    const v = vol[it.c] || 0; if (!v) continue;
    qtd += v; inc += it.v * it.i * v; prod += (it.v + it.v * it.i) * v;
  }
  const credito = base === 'valorizado' ? prod : inc;
  document.getElementById('m-credito').textContent = brl0(credito);
  document.getElementById('m-ano').textContent = brl0(credito * 12);
  document.getElementById('b-qtd').textContent = qtd.toLocaleString('pt-BR');
  document.getElementById('b-prod').textContent = brl0(prod);
  document.getElementById('b-inc').textContent = brl0(inc);
  document.getElementById('b-credito').textContent = brl0(credito);
  const divida = parseFloat(document.getElementById('divida').value) || 0;
  const meses = credito > 0 && divida > 0 ? divida / credito : 0;
  document.getElementById('b-meses').textContent =
    meses ? (meses < 600 ? meses.toFixed(1).replace('.', ',') + ' meses' : '—') : '—';
}

tbody.addEventListener('input', e => {
  const el = e.target; if (!el.classList.contains('vol')) return;
  const n = Math.max(0, parseInt(el.value || '0', 10) || 0);
  vol[el.dataset.c] = n;
  el.closest('tr').classList.toggle('on', n > 0);
  const it = ITENS.find(x => x.c === el.dataset.c);
  const incUn = it.v * it.i;
  el.closest('tr').lastElementChild.textContent =
    n ? brl(base === 'valorizado' ? (it.v + incUn) * n : incUn * n) : '—';
  totaliza();
});

busca.addEventListener('input', e => { filtro = e.target.value; desenha(); });
document.getElementById('divida').addEventListener('input', totaliza);

document.querySelectorAll('.chip[data-g]').forEach(b => b.addEventListener('click', () => {
  grupoSel = b.dataset.g;
  document.querySelectorAll('.chip[data-g]').forEach(x => x.setAttribute('aria-pressed', x === b));
  desenha();
}));

document.getElementById('base').addEventListener('change', e => { base = e.target.value; desenha(); });

document.getElementById('limpar').addEventListener('click', () => {
  for (const k in vol) delete vol[k];
  desenha();
});

document.getElementById('csv').addEventListener('click', () => {
  const linhas = [['Codigo','Procedimento','Grupo','Valor SIGTAP','Percentual incremento','Incremento unitario','Valor valorizado','Volume mensal','Base de credito mensal']];
  for (const it of ITENS){
    const v = vol[it.c] || 0; if (!v) continue;
    const incUn = it.v * it.i;
    linhas.push([it.c, it.n, it.g, it.v.toFixed(2), it.na ? 'n/a' : (it.i*100).toFixed(0)+'%',
                 incUn.toFixed(2), (it.v+incUn).toFixed(2), v,
                 (base==='valorizado' ? (it.v+incUn)*v : incUn*v).toFixed(2)]);
  }
  if (linhas.length === 1){ alert('Informe ao menos um volume mensal antes de exportar.'); return; }
  const csv = linhas.map(l => l.map(c => `"${String(c).replace(/"/g,'""')}"`).join(';')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\ufeff'+csv], {type:'text/csv;charset=utf-8'}));
  a.download = 'simulacao-creditos-financeiros-imagem.csv';
  a.click(); URL.revokeObjectURL(a.href);
});

desenha();

}
window.initCreditoTab = initCreditoTab;







// --- PMAE COMPONENTE CIRURGIAS (CC 29.02) INIT AND LOGIC ---
let pmaeCcInitialized = false;
function initPmaeCcTab() {
  const checkEl = document.getElementById('gates');
  if (!checkEl) return;
  
  if (pmaeCcInitialized) return;
  pmaeCcInitialized = true;
  
  console.log("Initializing PMAE CC tab...");
  
  



/* ---------- shim de persistencia: usa localStorage fora do ambiente Claude ---------- */

if(!window.storage){

  window.storage={

    async get(k){const v=localStorage.getItem(k); if(v===null)return null; return {key:k,value:v};},

    async set(k,v){localStorage.setItem(k,v); return {key:k,value:v};},

    async delete(k){localStorage.removeItem(k); return {key:k,deleted:true};},

    async list(p=""){return {keys:Object.keys(localStorage).filter(x=>x.startsWith(p)),prefix:p};}

  };

}



/* ---------------- estado ---------------- */

const GATES=[

 {id:"g0",t:"Ato normativo de autorização vigente",s:"Resolução ou portaria que autoriza a participação do estabelecimento — condição para o gestor local inserir a 29.02 no CNES.",c:1,p:15},

 {id:"g1",t:"Habilitação 29.02 ativa no CNES",s:"Marcação descentralizada feita pelo gestor local; competência inicial ≤ competência da cirurgia e sem competência final vencida.",c:1,p:15},

 {id:"g9",t:"Habilitações assistenciais específicas mantidas",s:"A 29.02 não substitui habilitação de alta complexidade ou de serviço exigida pelo procedimento — é requisito adicional.",c:1,p:14},

 {id:"g2",t:"Adesão pactuada em CIB/RS",s:"Programação aprovada pela SAES e rateio publicado em Resolução CIB/RS.",c:1,p:12},

 {id:"g3",t:"Rol e complementação conferidos",s:"Procedimentos dentro do rol vigente; complementação do anexo confirmada (inclusive as zeradas).",c:1,p:12},

 {id:"g5",t:"Numeração de autorização correta",s:"AIH com <mark style='background: yellow; font-weight: bold; color: black; padding: 0 4px; border-radius: 2px;'>5º dígito 5</mark> e APAC com 5º dígito 6, emitidas pelo gestor.",c:1,p:12},

 {id:"g4",t:"CNES revisado na competência",s:"Profissionais, serviços especializados e leitos compatíveis com os procedimentos apresentados.",c:0,p:7},

 {id:"g6",t:"Paciente oriundo da fila regulada",s:"Origem em fila de espera / regulação documentada, com data de entrada rastreável.",c:0,p:5},

 {id:"g7",t:"Prontuário e laudo instruídos",s:"Laudo de solicitação, descrição cirúrgica e documentos de comprovação arquivados.",c:0,p:5},

 {id:"g8",t:"Conciliação produção × repasse",s:"Produção apresentada, aprovada e repassada conferidas por competência.",c:0,p:3}

];

let ativos={};

let linhas=[

 {cod:"04.07.04.014-5",desc:"Herniorrafia inguinal (unilateral)",prog:40,real:26,vsus:445.00,comp:600.00,hab:"na",reg:"AIH"},

 {cod:"04.07.02.005-0",desc:"Colecistectomia videolaparoscópica",prog:30,real:19,vsus:702.00,comp:900.00,hab:"na",reg:"AIH"},

 {cod:"04.05.05.014-9",desc:"Facoemulsificação com implante de LIO",prog:120,real:88,vsus:673.00,comp:400.00,hab:"ok",reg:"APAC"},

 {cod:"04.09.06.018-6",desc:"Laqueadura tubária",prog:20,real:11,vsus:396.00,comp:0.00,hab:"ok",reg:"AIH"},

 {cod:"04.09.04.024-0",desc:"Vasectomia",prog:15,real:4,vsus:145.00,comp:0.00,hab:"ok",reg:"APAC"}

];



const $=s=>document.querySelector(s);

const brl=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});



/* ---------------- trilha ---------------- */

function pintarGates(){

  $("#gates").innerHTML=GATES.map(g=>`<li class="gate ${ativos[g.id]?"ok":""}" data-critico="${g.c}">

    <input type="checkbox" id="${g.id}" ${ativos[g.id]?"checked":""}>

    <span class="g-tx"><label class="g-tt" for="${g.id}">${g.t}</label><span class="g-sb">${g.s}</span></span></li>`).join("");

  $("#gates").querySelectorAll("input").forEach(i=>i.onchange=e=>{ativos[e.target.id]=e.target.checked;pintarGates();calcular();salvar()});

}

function conformidade(){

  const tot=GATES.reduce((a,g)=>a+g.p,0);

  const at=GATES.filter(g=>ativos[g.id]).reduce((a,g)=>a+g.p,0);

  const bloq=GATES.filter(g=>g.c&&!ativos[g.id]);

  return {pct:Math.round(at/tot*100),bloq};

}



/* ---------------- tabela ---------------- */

function pintarTabela(){

  $("#tbody").innerHTML=linhas.map((l,i)=>`<tr>

    <td><input value="${l.cod}" data-i="${i}" data-k="cod" style="font-family:var(--mono);font-size:12px"></td>

    <td><input value="${l.desc}" data-i="${i}" data-k="desc"></td>

    <td><input type="number" min="0" value="${l.prog}" data-i="${i}" data-k="prog"></td>

    <td><input type="number" min="0" value="${l.real}" data-i="${i}" data-k="real"></td>

    <td><input type="number" step="0.01" min="0" value="${l.vsus.toFixed(2)}" data-i="${i}" data-k="vsus"></td>

    <td class="hab-${l.hab||"na"}"><select data-i="${i}" data-k="hab">

      <option value="na" ${(l.hab||"na")=="na"?"selected":""}>Não exige</option>

      <option value="ok" ${l.hab=="ok"?"selected":""}>Exige — ativa</option>

      <option value="pend" ${l.hab=="pend"?"selected":""}>Exige — pendente</option></select></td>

    <td><select data-i="${i}" data-k="reg"><option ${l.reg=="AIH"?"selected":""}>AIH</option><option ${l.reg=="APAC"?"selected":""}>APAC</option></select></td>

    <td class="dir num">${brl((l.vsus+l.comp)*l.real)}</td>

    <td><button class="lixo" data-del="${i}" title="Remover">×</button></td></tr>`).join("");

  $("#tbody").querySelectorAll("input,select").forEach(el=>el.oninput=e=>{

    const {i,k}=e.target.dataset, v=e.target.value;

    linhas[i][k]=["prog","real"].includes(k)?(parseInt(v)||0):["vsus","comp"].includes(k)?(parseFloat(v)||0):v;

    calcular();salvar();

    if(["prog","real","vsus","comp"].includes(k)){

      e.target.closest("tr").children[8].textContent=brl((linhas[i].vsus+linhas[i].comp)*linhas[i].real);

    }

    if(k=="hab")e.target.closest("td").className="hab-"+v;

  });

  $("#tbody").querySelectorAll("[data-del]").forEach(b=>b.onclick=e=>{linhas.splice(+e.target.dataset.del,1);pintarTabela();calcular();salvar()});

}



/* ---------------- cálculo ---------------- */

function calcular(){

  const prog=linhas.reduce((a,l)=>a+l.prog,0), real=linhas.reduce((a,l)=>a+l.real,0);

  const fat=linhas.reduce((a,l)=>a+(l.vsus+l.comp)*l.real,0);

  const progVal=linhas.reduce((a,l)=>a+(l.vsus+l.comp)*l.prog,0);

  const teto=parseFloat($("#f-teto").value)||0, rep=parseFloat($("#f-repass").value)||0;

  const meses=parseInt($("#f-meses").value)||1;

  const saldo=teto-rep-fat;

  const execPct=teto?Math.round((rep+fat)/teto*100):0;

  const projecao=rep+fat*meses;

  const cumpr=prog?Math.round(real/prog*100):0;



  $("#t-prog").textContent=prog; $("#t-real").textContent=real; $("#t-fat").textContent=brl(fat);



  const c=conformidade();

  $("#m-pct").textContent=c.pct+"%";

  $("#m-barra").style.width=c.pct+"%";

  $("#m-barra").style.background=c.bloq.length?(c.pct<50?"var(--rubro)":"var(--ambar)"):"var(--verde)";

  $("#m-rot").textContent=c.bloq.length?`${c.bloq.length} requisito(s) bloqueante(s) em aberto`:"Apto ao faturamento da competência";



  $("#kpis").innerHTML=`

   <div class="kpi"><span>Faturamento da competência</span><b>${brl(fat)}</b><em>${real} procedimentos</em></div>

   <div class="kpi ${cumpr>=90?"ok":cumpr>=60?"alerta":"risco"}"><span>Cumprimento da programação</span><b>${cumpr}%</b><em>${real} de ${prog} · previsto ${brl(progVal)}</em></div>

   <div class="kpi ${execPct>100?"risco":execPct>=70?"ok":"alerta"}"><span>Execução do teto</span><b>${execPct}%</b><em>repassado + competência</em></div>

   <div class="kpi ${saldo<0?"risco":"ok"}"><span>Saldo do teto</span><b>${brl(saldo)}</b><em>${saldo<0?"extrapolado":"disponível"}</em></div>

   <div class="kpi ${projecao>teto?"risco":projecao<teto*0.85?"alerta":"ok"}"><span>Projeção fim do exercício</span><b>${brl(projecao)}</b><em>${meses} meses no ritmo atual</em></div>`;



  /* alertas */

  const a=[];

  c.bloq.forEach(g=>a.push(["risco","BLOQUEIO",`<b>${g.t}</b> não confirmado. Sem esse requisito a produção da competência é inapresentável ou glosável.`]));

  linhas.filter(l=>l.hab=="pend").forEach(l=>a.push(["risco","HABILITAÇÃO ASSISTENCIAL",

    `<b>${l.cod}</b> — ${l.desc}: exige habilitação assistencial própria e ela está <b>pendente</b>. A 29.02 não supre essa exigência; é requisito adicional. Produção sujeita a glosa integral.`]));

  linhas.filter(l=>l.comp===0&&l.real>0).forEach(l=>a.push(["alerta","SEM COMPLEMENTO",

    `<b>${l.cod}</b> — ${l.desc}: complementação zerada. Fatura dentro da programação, mas remunera apenas o valor de Tabela SUS. Conferir se o rol vigente manteve o zeramento antes de dimensionar a meta.`]));

  linhas.filter(l=>l.real>l.prog).forEach(l=>a.push(["alerta","ACIMA DA PROGRAMAÇÃO",

    `<b>${l.cod}</b>: ${l.real} realizados contra ${l.prog} programados. Produção excedente só é paga se houver remanejamento formalizado em CIB/RS.`]));

  if(saldo<0)a.push(["risco","TETO EXTRAPOLADO",`A competência ultrapassa o teto pactuado em <b>${brl(Math.abs(saldo))}</b>. Suspender apresentação adicional ou pleitear suplementação antes do fechamento.`]);

  if(projecao<teto*0.85&&teto>0)a.push(["alerta","SUBEXECUÇÃO",

    `Projeção de <b>${brl(projecao)}</b> contra teto de ${brl(teto)}. Subexecução é fundamento recorrente para remanejamento do recurso a outro prestador na próxima pactuação.`]);

  a.push(["info","NÃO CONFUNDIR",

    "Habilitação <b>29.02</b> é o componente cirúrgico. <b>38.01</b> é OCI (APAC 5º dígito 7) e <b>38.05</b> é Créditos Financeiros (AIH 8 / APAC 9). Marcar a habilitação errada no CNES desloca todo o repasse da competência."]);

  if(!c.bloq.length)a.push(["ok","CONFORME","Todos os requisitos bloqueantes confirmados para a competência informada."]);

  $("#alertas").innerHTML=a.map(x=>`<li class="al ${x[0]}"><span class="tag">${x[1]}</span><span>${x[2]}</span></li>`).join("");

}



/* ---------------- validador ---------------- */

const MAPA={"5":["PMAE — Componente Cirurgias","AIH"],"6":["PMAE — Componente Cirurgias","APAC"],

 "7":["PMAE — Oferta de Cuidados Integrados (OCI)","APAC"],"8":["Agora Tem Especialistas — Créditos Financeiros","AIH"],

 "9":["Agora Tem Especialistas — Créditos Financeiros","APAC"],"1":["AIH normal/eletiva — recurso MAC","AIH"],

 "2":["APAC normal — recurso MAC","APAC"],"3":["CNRAC","AIH"],"4":["CNRAC","APAC"],"0":["Parcela única","AIH/APAC"]};

function validar(){

  const n=$("#aut").value.replace(/\D/g,""), instr=$("#instr").value, v=$("#veredito");

  if(n.length<5){v.className="veredito";v.innerHTML="<b>Aguardando</b>Informe ao menos 5 dígitos.";return}

  const d=n[4], m=MAPA[d], esperado=instr=="AIH"?"5":"6";

  if(d===esperado){v.className="veredito ok";

    v.innerHTML=`<b>Conforme</b>5º dígito <b>${d}</b> — ${instr} do PMAE Componente Cirurgias. Numeração compatível com a habilitação 29.02.`}

  else{v.className="veredito erro";

    v.innerHTML=`<b>Divergente</b>5º dígito <b>${d}</b> → ${m?m[0]+" ("+m[1]+")":"faixa não prevista"}. Para ${instr} do PMAE-CC o dígito deve ser <b>${esperado}</b>. Como está, a produção não será imputada ao teto do componente cirúrgico.`}

}



/* ---------------- persistência ---------------- */

function pacote(){return{ident:{estab:$("#i-estab").value,cnes:$("#i-cnes").value,comp:$("#i-comp").value,

  gestao:$("#i-gestao").value,cib:$("#i-cib").value,resp:$("#i-resp").value},

  fin:{teto:$("#f-teto").value,repass:$("#f-repass").value,meses:$("#f-meses").value},ativos,linhas}}

async function salvar(){try{await window.storage.set("pmae-cc-2902",JSON.stringify(pacote()))}catch(e){}}

async function carregar(){

  try{const r=await window.storage.get("pmae-cc-2902"); if(!r)return;

    const p=JSON.parse(r.value);

    if(p.ident){$("#i-estab").value=p.ident.estab;$("#i-cnes").value=p.ident.cnes;$("#i-comp").value=p.ident.comp;

      $("#i-gestao").value=p.ident.gestao;$("#i-cib").value=p.ident.cib;$("#i-resp").value=p.ident.resp}

    if(p.fin){$("#f-teto").value=p.fin.teto;$("#f-repass").value=p.fin.repass;$("#f-meses").value=p.fin.meses}

    if(p.ativos)ativos=p.ativos; if(p.linhas&&p.linhas.length)linhas=p.linhas;

  }catch(e){}

}



/* ---------------- eventos ---------------- */

$("#add").onclick=()=>{linhas.push({cod:"",desc:"",prog:0,real:0,vsus:0,comp:0,hab:"na",reg:"AIH"});pintarTabela();calcular();salvar()};

$("#prt").onclick=()=>window.print();

$("#exp").onclick=()=>{const b=new Blob([JSON.stringify(pacote(),null,2)],{type:"application/json"});

  const a=document.createElement("a");a.href=URL.createObjectURL(b);

  a.download="painel-pmae-cc-"+($("#i-comp").value.replace("/","-"))+".json";a.click()};

$("#imp").onclick=()=>$("#arq").click();

$("#arq").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();

  r.onload=()=>{try{const p=JSON.parse(r.result);

    if(p.ident){$("#i-estab").value=p.ident.estab||"";$("#i-cnes").value=p.ident.cnes||"";$("#i-comp").value=p.ident.comp||"";$("#i-cib").value=p.ident.cib||"";$("#i-resp").value=p.ident.resp||""}

    if(p.fin){$("#f-teto").value=p.fin.teto;$("#f-repass").value=p.fin.repass;$("#f-meses").value=p.fin.meses}

    ativos=p.ativos||{};linhas=p.linhas||[];pintarGates();pintarTabela();calcular();salvar()

  }catch(x){alert("Arquivo inválido.")}};r.readAsText(f)};

["#f-teto","#f-repass","#f-meses"].forEach(s=>$(s).oninput=()=>{calcular();salvar()});

["#i-estab","#i-cnes","#i-comp","#i-gestao","#i-cib","#i-resp"].forEach(s=>$(s).oninput=salvar);

$("#aut").oninput=validar; $("#instr").onchange=validar;



(async()=>{await carregar();pintarGates();pintarTabela();calcular();validar()})();


}
window.initPmaeCcTab = initPmaeCcTab;



// --- PMAE OFERTAS DE CUIDADOS INTEGRADOS (OCI 38.01) INIT AND LOGIC ---
let ociInitialized = false;
function initOciTab() {
  const checkEl = document.getElementById('placar');
  if (!checkEl) return;
  
  if (ociInitialized) return;
  ociInitialized = true;
  
  console.log("Initializing PMAE OCI tab...");
  
  

/* =====================================================================

   PAINEL OCI / PMAE — Catálogo e decisão de habilitação

   Arquivo único, sem build e sem dependências além das fontes do Google.



   FONTES DO CONTEÚDO NORMATIVO

   · Manual PMAE — Registro da Produção, Controle e Avaliação (SAES/MS, mar/2025)

   · Relação de OCI, valores e secundários — DGAE/SES-RS, competência 04/2025

   · Estrutura vigente do Grupo 09 da Tabela de Procedimentos do SUS



   REGRAS DE DOMÍNIO — NÃO VIOLAR AO EDITAR

   1. A OCI é indivisível: faltando um secundário obrigatório, a APAC não se

      sustenta. O executado vai para BPA-I, nunca forçado dentro da APAC.

   2. Só o procedimento principal tem valor. Os secundários entram zerados

      (regra condicionada 0009). NUNCA somar valores de secundários.

   3. Financiamento FAEC: principal e secundários na aba FAEC da FPO

      (regra 0012). Não consome teto MAC.

   4. Mínimo de dois secundários, um deles consulta OU teleconsulta e o outro

      diferente dela (regra 0011).

   5. APAC única, tipo 3. Não existe APAC de continuidade no programa.

   6. Secundário pode ser executado por terceiro cadastrado no CNES do

      executor; a APAC continua sendo do hospital principal.

   7. A divisão obrigatório/facultativo NÃO é definitiva: validar em

      SIGTAP > Relatórios > Compatibilidades, filtro "APAC (Proc. Principal) x

      APAC (Proc. Secundário) (Obrigatória)". É ela que trava o registro no SIA.

   8. valor === null significa "não parametrizado". Não inferir, não estimar.

   9. Habilitação 38.01 depende de PAR pactuado em CIB e homologado pelo MS.

      O hospital não se habilita por decisão própria.



   Subgrupos 09.07 (Saúde Bucal) e 09.08 (Infectologia) já têm forma de

   organização criada e nenhum procedimento publicado.



   ── Abaixo: DADOS (capacidades + catálogo). Alterações normativas entram aqui.

   ── Depois: ESTADO, AVALIAÇÃO, RENDER, EVENTOS. Não misturar dado com lógica.

   ===================================================================== */



/* ============ CAPACIDADES ============ */

const EIXOS=[

 ["Atendimento",[

  ["consulta","Consulta médica especializada presencial"],

  ["tele","Teleconsulta na atenção especializada"]]],

 ["Imagem e métodos gráficos",[

  ["rx","Radiologia convencional"],

  ["usg","Ultrassonografia geral (mama, articulação)"],

  ["usgtr","Ultrassonografia transretal de próstata"],

  ["mamo","Mamografia"],

  ["tc","Tomografia computadorizada"],

  ["rm","Ressonância magnética"],

  ["nuclear","Medicina nuclear — cintilografia miocárdica"]]],

 ["Cardiologia funcional",[

  ["ecg","Eletrocardiografia"],

  ["eco","Ecocardiografia transtorácica"],

  ["ecoest","Ecocardiografia de estresse"],

  ["ergo","Teste ergométrico"],

  ["holter","Holter 24 horas"],

  ["lab","Laboratório clínico (inclui BNP)"]]],

 ["Endoscopia e procedimentos",[

  ["eda","Endoscopia digestiva alta"],

  ["colono","Colonoscopia"],

  ["biopmama","Punção e biópsia de mama"],

  ["biopcolo","Biópsia de colo uterino"],

  ["caf","Excisão de colo uterino (CAF) ambulatorial"],

  ["colpo","Colposcopia"],

  ["biopprost","Biópsia de próstata"]]],

 ["Patologia",[

  ["cito","Citopatologia"],

  ["ap","Anatomia patológica"],

  ["imuno","Imuno-histoquímica"]]],

 ["Otorrinolaringologia",[

  ["audio","Audiometria e imitanciometria"],

  ["bera","Potencial evocado auditivo"],

  ["videolaringo","Videolaringoscopia"]]],

 ["Oftalmologia",[

  ["oftbase","Exames básicos: mapeamento de retina, tonometria, biomicroscopia"],

  ["ortoptico","Teste ortóptico"],

  ["retino","Retinografia colorida binocular"],

  ["campi","Campimetria computadorizada"],

  ["cores","Teste de visão de cores"],

  ["usgocular","Ultrassonografia de globo ocular / órbita"],

  ["sedacao","Sedação para exame oftalmológico"]]]

];

const CAPNOME={}; EIXOS.forEach(([,l])=>l.forEach(([k,n])=>CAPNOME[k]=n));



/* ============ CATÁLOGO ============ */

/* obr: capacidades obrigatórias. "CT" = consulta OU teleconsulta. "C" = só consulta. */

function o(c,n,esp,valor,obr,opc,nota){return{c,n,esp,valor,obr,opc:opc||[],nota:nota||""}}

const CAT=[

o("09.01.01.001-4","Avaliação diagnóstica inicial de câncer de mama","Oncologia",125,["CT","mamo"],["usg"]),

o("09.01.01.009-0","Progressão da avaliação diagnóstica de câncer de mama — I","Oncologia",400,["CT","biopmama","cito"],[]),

o("09.01.01.010-3","Progressão da avaliação diagnóstica de câncer de mama — II","Oncologia",400,["CT","biopmama","ap"],[]),

o("09.01.01.013-8","Imuno-histoquímica de neoplasia maligna de mama","Oncologia",null,["CT","imuno"],[],"Incluída após a relação SES/RS 04/2025. Valor e rol de secundários a confirmar no SIGTAP."),

o("09.01.01.005-7","Investigação diagnóstica de câncer de colo do útero","Oncologia",100,["CT","biopcolo","ap"],["colpo"]),

o("09.01.01.011-1","Avaliação diagnóstica e terapêutica de câncer de colo do útero — I","Oncologia",220,["CT","caf","ap"],["colpo"]),

o("09.01.01.012-0","Avaliação diagnóstica e terapêutica de câncer de colo do útero — II","Oncologia",220,["C","caf","ap"],["colpo"],"Sem compatibilidade com teleconsulta: exige consulta presencial."),

o("09.01.01.004-9","Progressão da avaliação diagnóstica de câncer de próstata","Oncologia",300,["CT","usgtr","biopprost","ap"],[]),

o("09.01.01.007-3","Avaliação diagnóstica de câncer gástrico","Oncologia",250,["CT","eda","ap"],[]),

o("09.01.01.008-1","Avaliação diagnóstica de câncer colorretal","Oncologia",282,["CT","colono","ap"],[]),



o("09.02.01.001-8","Avaliação de risco cirúrgico","Cardiologia",130,["CT","ecg"],["rx","lab"]),

o("09.02.01.002-6","Avaliação cardiológica","Cardiologia",200,["CT","ecg","rx"],["eco","lab"]),

o("09.02.01.003-4","Avaliação diagnóstica inicial — síndrome coronariana crônica","Cardiologia",270,["CT","ecg","ergo"],["eco","lab"]),

o("09.02.01.004-2","Progressão da avaliação diagnóstica I — síndrome coronariana crônica","Cardiologia",250,["CT","ecoest"],[]),

o("09.02.01.005-0","Progressão da avaliação diagnóstica II — síndrome coronariana crônica","Cardiologia",840,["CT","nuclear"],[]),

o("09.02.01.006-9","Avaliação diagnóstica — insuficiência cardíaca","Cardiologia",350,["CT","ecg","ergo"],["eco","holter","lab"]),

o("09.02.01.007-7","Gestão do pré-operatório","Cardiologia",null,["CT"],[],"Incluída após a relação SES/RS 04/2025. Valor e rol de secundários a confirmar no SIGTAP."),



o("09.03.01.001-1","Avaliação diagnóstica em ortopedia com radiologia","Ortopedia",100,["CT","rx"],[]),

o("09.03.01.002-0","Avaliação diagnóstica em ortopedia com radiologia e ultrassonografia","Ortopedia",140,["CT","rx","usg"],[]),

o("09.03.01.003-8","Avaliação diagnóstica em ortopedia com radiologia e tomografia","Ortopedia",230,["CT","rx","tc"],[]),

o("09.03.01.004-6","Avaliação diagnóstica em ortopedia com radiologia e ressonância","Ortopedia",360,["CT","rx","rm"],[]),



o("09.04.01.001-5","Avaliação inicial diagnóstica de déficit auditivo","Otorrinolaringologia",100,["C","audio"],[],"Sem compatibilidade com teleconsulta."),

o("09.04.01.002-3","Progressão da avaliação diagnóstica de déficit auditivo","Otorrinolaringologia",150,["C","audio","bera"],[],"Sem compatibilidade com teleconsulta."),

o("09.04.01.003-1","Avaliação diagnóstica de nasofaringe e de orofaringe","Otorrinolaringologia",200,["C","videolaringo"],[],"Sem compatibilidade com teleconsulta."),



o("09.05.01.001-9","Avaliação inicial em oftalmologia — 0 a 8 anos","Oftalmologia",200,["C","ortoptico","oftbase"],[],"Sem compatibilidade com teleconsulta."),

o("09.05.01.002-7","Avaliação de estrabismo","Oftalmologia",200,["C","ortoptico","oftbase"],["retino"],"Sem compatibilidade com teleconsulta."),

o("09.05.01.003-5","Avaliação inicial em oftalmologia — a partir de 9 anos","Oftalmologia",160,["C","oftbase"],["ortoptico"],"Sem compatibilidade com teleconsulta."),

o("09.05.01.004-3","Avaliação de retinopatia diabética","Oftalmologia",200,["C","oftbase","retino"],[],"Sem compatibilidade com teleconsulta."),

o("09.05.01.005-1","Avaliação inicial para oncologia oftalmológica","Oftalmologia",250,["C","usgocular","oftbase"],["retino"],"Sem compatibilidade com teleconsulta."),

o("09.05.01.006-0","Avaliação diagnóstica em neuro-oftalmologia","Oftalmologia",300,["C","campi","oftbase"],["cores","retino"],"Sem compatibilidade com teleconsulta."),

o("09.05.01.007-8","Exames oftalmológicos sob sedação","Oftalmologia",200,["C","sedacao","oftbase"],[],"Sem compatibilidade com teleconsulta."),



o("09.06.01.001-2","GIN1 — Avaliação diagnóstica inicial em ginecologia I","Saúde da Mulher",null,["CT"],[],"Portaria GM/MS nº 7.273/2025, posterior à relação SES/RS. Valor e rol a confirmar no SIGTAP."),

o("09.06.01.002-0","GIN1 — Avaliação diagnóstica inicial em ginecologia II","Saúde da Mulher",null,["CT"],[],"Portaria GM/MS nº 7.273/2025. Valor e rol a confirmar no SIGTAP."),

o("09.06.01.003-9","GIN2 — Progressão diagnóstica — sangramento uterino anormal I","Saúde da Mulher",null,["CT"],[],"Portaria GM/MS nº 7.273/2025. Valor e rol a confirmar no SIGTAP."),

o("09.06.01.004-7","GIN2 — Progressão diagnóstica — sangramento uterino anormal II","Saúde da Mulher",null,["CT"],[],"Portaria GM/MS nº 7.273/2025. Valor e rol a confirmar no SIGTAP."),

o("09.06.01.005-5","GIN3 — Endometriose profunda, casos complexos e programação cirúrgica","Saúde da Mulher",null,["CT"],[],"Portaria GM/MS nº 7.273/2025. Valor e rol a confirmar no SIGTAP.")

];

const ESPS=["Oncologia","Cardiologia","Ortopedia","Otorrinolaringologia","Oftalmologia","Saúde da Mulher"];



/* ============ ESTADO ============ */

const KEY="oci-decisao-habilitacao-v1";

const mem={};

const Store={

  async get(k){ if(window.storage) return await window.storage.get(k); return mem[k]?{value:mem[k]}:null; },

  async set(k,v){ if(window.storage) return await window.storage.set(k,v); mem[k]=v; }

};

let ST={caps:{},vols:{},volRef:30};

async function load(){ try{const r=await Store.get(KEY); if(r&&r.value) ST=Object.assign(ST,JSON.parse(r.value));}catch(e){} }

async function save(){ try{ await Store.set(KEY,JSON.stringify(ST)); }catch(e){} }



const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

const brl=v=>v==null?"—":v.toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0});

const lvl=k=>ST.caps[k]==null?0:+ST.caps[k];



/* ============ AVALIAÇÃO ============ */

function reqDe(oc){ // devolve [{k,label,nivel}] resolvendo CT/C

  return oc.obr.map(k=>{

    if(k==="CT"){ const n=Math.max(lvl("consulta"),lvl("tele"));

      return {k:"consulta",label:"Consulta ou teleconsulta especializada",nivel:n}; }

    if(k==="C") return {k:"consulta",label:CAPNOME.consulta,nivel:lvl("consulta")};

    return {k,label:CAPNOME[k],nivel:lvl(k)};

  });

}

function avaliar(oc){

  const req=reqDe(oc);

  const faltam=req.filter(r=>r.nivel===0);

  if(oc.valor==null) return {sit:"tbd",req,faltam};

  if(faltam.length) return {sit:"gap",req,faltam};

  return {sit:req.every(r=>r.nivel===2)?"ok":"terc",req,faltam};

}

const SITLAB={ok:"Apta — estrutura própria",terc:"Apta — com terceiro",gap:"Lacuna de capacidade",tbd:"Requisitos a confirmar"};

const volDe=oc=>ST.vols[oc.c]!=null?+ST.vols[oc.c]:0;



/* ============ RENDER ============ */

function renderCaps(){

  $("#capsBox").innerHTML=EIXOS.map(([eixo,list])=>

    `<div class="eixo"><h3>${eixo}</h3><div class="caps">`+list.map(([k,n])=>{

      const v=lvl(k);

      return `<div class="cap ${v===2?"has2":v===1?"has1":""}"><span class="nm">${n}</span>

        <span class="seg">

          <button data-cap="${k}" data-v="2" aria-pressed="${v===2}">PRÓPRIA</button>

          <button data-cap="${k}" data-v="1" aria-pressed="${v===1}">TERCEIRO</button>

          <button data-cap="${k}" data-v="0" aria-pressed="${v===0}">NÃO</button>

        </span></div>`;

    }).join("")+`</div></div>`).join("");

}



function renderTudo(){

  const av=CAT.map(oc=>({oc,...avaliar(oc)}));

  const n=s=>av.filter(x=>x.sit===s).length;

  const recAno=av.filter(x=>x.sit==="ok"||x.sit==="terc").reduce((s,x)=>s+volDe(x.oc)*(x.oc.valor||0)*12,0);



  $("#placar").innerHTML=[

    {cls:"ok",k:"Aptas com estrutura própria",v:n("ok"),n:"nenhum secundário terceirizado"},

    {cls:"terc",k:"Aptas com terceiro",v:n("terc"),n:"exigem CNES terceiro cadastrado"},

    {cls:"gap",k:"Com lacuna",v:n("gap"),n:"falta ao menos um obrigatório"},

    {cls:"tbd",k:"A confirmar",v:n("tbd"),n:"rol ainda não parametrizado"},

    {cls:"terc",k:"Receita anual projetada",v:brl(recAno),n:"FAEC, fora do teto MAC"}

  ].map(x=>`<div class="pc ${x.cls}"><div class="k">${x.k}</div><div class="v">${x.v}</div><div class="n">${x.n}</div></div>`).join("");



  // alavancas

  const ref=+$("#volRef").value||0;

  const map={};

  av.filter(x=>x.sit==="gap").forEach(x=>x.faltam.forEach(f=>{

    (map[f.k]=map[f.k]||{ocis:[],rec:0});

    map[f.k].ocis.push(x); }));

  Object.keys(map).forEach(k=>{

    map[k].rec=map[k].ocis.filter(x=>x.faltam.length===1).reduce((s,x)=>s+ref*(x.oc.valor||0)*12,0);

  });

  const rows=Object.entries(map).sort((a,b)=>b[1].rec-a[1].rec||b[1].ocis.length-a[1].ocis.length);

  $("#alavancaBody").innerHTML=rows.map(([k,d])=>{

    const solo=d.ocis.filter(x=>x.faltam.length===1).length;

    return `<tr><td><b>${CAPNOME[k]}</b></td>

      <td class="num">${solo} de ${d.ocis.length}</td>

      <td style="font-size:12px;color:var(--ink2)">${d.ocis.map(x=>x.oc.c.slice(0,8)+(x.faltam.length===1?"":" *")).join(" · ")}</td>

      <td class="num" style="font-weight:700;color:var(--ok)">${brl(d.rec)}</td></tr>`;

  }).join("");

  $("#alavancaEmpty").innerHTML=rows.length?`<div style="font-size:11.5px;color:var(--ink3);margin-top:10px">Contagem "OCI destravadas" considera apenas as que ficam aptas com essa única aquisição. As marcadas com * dependem de mais de uma capacidade.</div>`

    :`<div class="empty">Sem lacunas: todas as OCI com rol parametrizado estão cobertas pela capacidade declarada.</div>`;



  renderLista(av);

}



function renderLista(av){

  const fe=$("#fEsp").value, fs=$("#fSit").value, fo=$("#fOrd").value;

  let l=av.slice();

  if(fe) l=l.filter(x=>x.oc.esp===fe);

  if(fs==="apta") l=l.filter(x=>x.sit==="ok"||x.sit==="terc");

  else if(fs) l=l.filter(x=>x.sit===fs);

  const ordSit={ok:0,terc:1,tbd:2,gap:3};

  if(fo==="sit") l.sort((a,b)=>ordSit[a.sit]-ordSit[b.sit]||(b.oc.valor||0)-(a.oc.valor||0));

  if(fo==="valor") l.sort((a,b)=>(b.oc.valor||0)-(a.oc.valor||0));

  if(fo==="rec") l.sort((a,b)=>volDe(b.oc)*(b.oc.valor||0)-volDe(a.oc)*(a.oc.valor||0));

  if(fo==="cod") l.sort((a,b)=>a.oc.c.localeCompare(b.oc.c));



  $("#listaLede").textContent=`${CAT.length} procedimentos principais em 6 subgrupos com rol ativo. Exibindo ${l.length}.`;

  $("#ociBox").innerHTML=l.map(x=>{

    const oc=x.oc, apta=x.sit==="ok"||x.sit==="terc", v=volDe(oc);

    return `<div class="oci s-${x.sit}">

      <div class="hd"><div>

        <div class="cod mono">${oc.c}</div>

        <div class="nome">${oc.n}</div></div>

        <div class="val ${oc.valor==null?"tbd":""}">${oc.valor==null?"valor a confirmar":brl(oc.valor)}</div></div>

      <div><span class="badge b-${x.sit}">${SITLAB[x.sit]}</span></div>

      <div class="req">${x.req.map(r=>`<span class="${r.nivel===2?"have2":r.nivel===1?"have1":"miss"}">${r.label}</span>`).join("")}

        ${oc.opc.length?`<span style="border-style:dashed">opcionais: ${oc.opc.map(k=>CAPNOME[k]).join(", ")}</span>`:""}</div>

      ${oc.nota?`<div class="nota">${oc.nota}</div>`:""}

      <div class="foot">

        <label style="font-size:11.5px;color:var(--ink3)">Volume mensal

          <input type="number" min="0" data-vol="${oc.c}" value="${v||""}" placeholder="0" ${apta?"":"disabled"}></label>

        <span class="rec">${apta&&v?brl(v*(oc.valor||0)*12)+" / ano":""}</span>

      </div></div>`;

  }).join("");

  $("#ociEmpty").innerHTML=l.length?"":`<div class="empty">Nenhuma OCI neste filtro.</div>`;

}



/* ============ EVENTOS ============ */

document.addEventListener("click",async e=>{

  const b=e.target.closest("[data-cap]");

  if(b){ ST.caps[b.dataset.cap]=+b.dataset.v; await save(); renderCaps(); renderTudo(); }

});

document.addEventListener("input",async e=>{

  if(e.target.dataset.vol){ ST.vols[e.target.dataset.vol]=e.target.value; await save(); renderTudo(); }

});

$("#volRef").oninput=async()=>{ ST.volRef=+$("#volRef").value; await save(); renderTudo(); };

["#fEsp","#fSit","#fOrd"].forEach(s=>$(s).onchange=()=>renderTudo());

$("#btnReset").onclick=async()=>{ if(confirm("Limpar a avaliação de capacidade e os volumes?")){ ST={caps:{},vols:{},volRef:30}; await save(); $("#volRef").value=30; renderCaps(); renderTudo(); } };

$("#btnCsv").onclick=()=>{

  const head=["Codigo","OCI","Especialidade","Valor","Situacao","CapacidadesObrigatorias","Lacunas","VolumeMensal","ReceitaAnual"];

  const rows=CAT.map(oc=>{ const a=avaliar(oc), v=volDe(oc);

    return [oc.c,oc.n,oc.esp,oc.valor==null?"":String(oc.valor).replace(".",","),SITLAB[a.sit],

      a.req.map(r=>r.label).join(" | "),a.faltam.map(r=>r.label).join(" | "),v||0,

      (a.sit==="ok"||a.sit==="terc")?String(v*(oc.valor||0)*12).replace(".",","):"0"]; });

  const csv="\uFEFF"+[head,...rows].map(r=>r.map(c=>`"${String(c??"").replace(/"/g,'""')}"`).join(";")).join("\n");

  const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));

  const a=document.createElement("a"); a.href=url; a.download="catalogo_oci_habilitacao.csv"; a.click(); URL.revokeObjectURL(url);

};



/* ============ BOOT ============ */

(async()=>{

  await load();

  $("#volRef").value=ST.volRef||30;

  $("#fEsp").innerHTML=`<option value="">Todas</option>`+ESPS.map(e=>`<option>${e}</option>`).join("");

  renderCaps(); renderTudo();

})();


}
window.initOciTab = initOciTab;






// --- ESTUDO DE VIABILIDADE FINANCEIRA (ASSISTIR) GLOBAL STATE & LOGIC ---
window.assistirSimState = window.assistirSimState || {};

function getGenericProcsForSpecialty(key, item) {
  if (key === 'cardiologia') {
    return [
      {cod:"03.01.01.007-2", desc:"Consulta médica em atenção especializada — CBO 225120 Cardiologista", qtd:240, sig:10.00, cus:100.00, meta:"consulta", nota:"Valor a confirmar no tb_procedimento. Registro: BPA-I."},
      {cod:"03.01.01.030-7", desc:"Teleconsulta médica na atenção especializada — CBO 225120", qtd:0, sig:0, cus:0, meta:"consulta", nota:"Valor a confirmar. Complementar à meta de consultas."},
      {cod:"02.02",          desc:"Exames laboratoriais (subgrupo — informar valor médio da cesta)", qtd:1000, sig:4.80, cus:18.50, meta:"", nota:"Subgrupo sem valor único no SIGTAP."},
      {cod:"02.11.02.003-6", desc:"Eletrocardiograma", qtd:0, sig:5.15, cus:0, meta:"", nota:"SA R$ 5,15. Exige serviço CNES 122/003."},
      {cod:"02.05.01.003-2", desc:"Ecocardiografia transtorácica", qtd:0, sig:67.86, cus:0, meta:"", nota:"SA R$ 67,86 (total R$ 135,72 inclui SH). Exige serviço CNES 121/002."},
      {cod:"02.05.01.002-4", desc:"Ecocardiografia transesofágica — alta complexidade", qtd:0, sig:165.00, cus:0, meta:"", nota:"SA R$ 165,00 (total R$ 330,00 inclui SH). CBO restrito a 225120 e 225320."},
      {cod:"02.11.02.004-4", desc:"Monitoramento pelo sistema Holter 24h (3 canais)", qtd:0, sig:30.00, cus:0, meta:"", nota:"SA R$ 30,00. Exige serviço CNES 122/002."},
      {cod:"02.11.02.006-0", desc:"Teste de esforço / teste ergométrico", qtd:0, sig:30.00, cus:0, meta:"", nota:"SA R$ 30,00. Exige serviço CNES 122/001."}
    ];
  }

  if (key === 'oftalmologia') {
    return [
      {cod:"03.01.01.007-2", desc:"Consulta médica em atenção especializada — Oftalmologia (CBO 225265)", qtd:240, sig:10.00, cus:60.00, meta:"240/mês", nota:"Meta ambulatorial. Pactuação Consórcio CISA / ASSISTIR."},
      {cod:"04.05.05.037-2", desc:"Facoemulsificação c/ implante de LIO dobrável (Catarata)", qtd:50, sig:640.00, cus:480.00, meta:"100/mês", nota:"Cirurgia do aparelho da visão. Procedimento prioritário."},
      {cod:"04.05.05.011-9", desc:"Capsulotomia a YAG Laser", qtd:25, sig:65.00, cus:40.00, meta:"Demanda", nota:"Tratamento de opacidade de cápsula posterior."},
      {cod:"02.05.02.002-0", desc:"Paquimetria ultrassônica", qtd:40, sig:18.50, cus:12.00, meta:"Mínimo", nota:"Exame diagnóstico obrigatório da portaria."},
      {cod:"02.05.02.008-9", desc:"Ultrassonografia do globo ocular e órbita monocular", qtd:30, sig:24.20, cus:15.00, meta:"Mínimo", nota:"Exame de apoio diagnóstico."},
      {cod:"02.11.06.010-9", desc:"Mapeamento de retina", qtd:80, sig:21.00, cus:14.00, meta:"Mínimo", nota:"Avaliação de fundo de olho e retina."},
      {cod:"02.11.06.026-5", desc:"Tonometria (avaliação pressão intraocular / glaucoma)", qtd:120, sig:4.80, cus:3.00, meta:"Mínimo", nota:"Exame de rotina para rastreio e acompanhamento."},
      {cod:"02.11.06.003-6", desc:"Campimetria computadorizada / Campo visual", qtd:35, sig:28.00, cus:18.00, meta:"Mínimo", nota:"Diagnóstico funcional de glaucoma e neuro-oftalmo."}
    ];
  }

  const nomeEsp = (item && item.nome) ? item.nome : 'Especialidade';
  let metaQtd = 240;
  if (item && item.fields && item.fields.META_CONSULTAS) {
    const m = parseInt(item.fields.META_CONSULTAS);
    if (!isNaN(m)) metaQtd = m;
  }

  return [
    {cod:"03.01.01.007-2", desc:`Consulta médica em atenção especializada — ${nomeEsp}`, qtd:metaQtd, sig:10.00, cus:0.00, meta:`${metaQtd}/mês`, nota:"Meta principal da portaria"},
    {cod:"03.01.01.030-7", desc:`Teleconsulta médica na atenção especializada — ${nomeEsp}`, qtd:0, sig:23.73, cus:0.00, meta:"Opcional", nota:"Teleatendimento regulado GERCON"},
    {cod:"02.02",          desc:"Exames laboratoriais correlacionados (subgrupo)", qtd:0, sig:4.80, cus:0.00, meta:"Demanda", nota:"Apoio diagnóstico ambulatorial"},
    {cod:"02.11",          desc:"Métodos diagnósticos / Exames complementares especializados", qtd:0, sig:15.00, cus:0.00, meta:"—", nota:"Conforme portaria homologada"},
    {cod:"04.01",          desc:"Procedimentos clínicos e cirúrgicos ambulatoriais", qtd:0, sig:25.00, cus:0.00, meta:"—", nota:"Procedimentos de média complexidade"}
  ];
}

function getGenericCustosForSpecialty(key, item) {
  if (key === 'cardiologia') {
    return [
      {item:"Médico cardiologista (RQE) 30h + visita hospitalar", qtd:1, val:500.00},
      {item:"Secretária", qtd:0.5, val:3086.43},
      {item:"Enfermeiro 20h", qtd:1, val:3086.43},
      {item:"Nutricionista", qtd:1, val:3086.43},
      {item:"Técnico de enfermagem", qtd:1, val:3086.43}
    ];
  }

  if (key === 'oftalmologia') {
    return [
      {item:"Médico(a) Oftalmologista Cirurgião (RQE 20h cada - 2 prof.)", qtd:2, val:12000.00},
      {item:"Enfermeiro(a) Centro Cirúrgico / Ambulatório", qtd:1, val:4200.00},
      {item:"Técnico(a) de Enfermagem", qtd:2, val:3086.43},
      {item:"Recepcionista / Apoio Regulação CISA", qtd:1, val:2200.00},
      {item:"Manutenção preventiva de equipamentos oftalmológicos", qtd:1, val:2500.00}
    ];
  }

  const nomeEsp = (item && item.nome) ? item.nome : 'Especialista';
  return [
    {item:`Médico ${nomeEsp} com RQE — Carga horária semanal`, qtd:1, val:0.00},
    {item:"Enfermeiro(a) do ambulatório", qtd:1, val:3086.43},
    {item:"Técnico(a) de Enfermagem", qtd:1, val:2400.00},
    {item:"Apoio Administrativo / Recepção e Regulação", qtd:0.5, val:1800.00},
    {item:"Outro profissional da equipe mínima multiprofissional", qtd:1, val:0.00}
  ];
}

function getSimState(key) {
  if (!key) key = currentAssistirKey || 'cardiologia';
  if (!window.assistirSimState[key]) {
    const item = (typeof SERVICOS_CISA !== 'undefined' && SERVICOS_CISA[key]) || (typeof AMBULATORIOS_ASSISTIR !== 'undefined' && AMBULATORIOS_ASSISTIR[key]) || {};
    let pesoDefault = 840;
    if (item && item.fields && item.fields.MODELO) {
      const pMatch = item.fields.MODELO.match(/PESO:\s*([\d,\.]+)/i);
      if (pMatch) {
        const parsed = parseFloat(pMatch[1].replace(',', '.'));
        if (!isNaN(parsed)) pesoDefault = parsed;
      }
    }

    window.assistirSimState[key] = {
      procs: getGenericProcsForSpecialty(key, item),
      custos: getGenericCustosForSpecialty(key, item),
      uihVal: 1140.72,
      pesoVal: pesoDefault,
      urVal: 1,
      pIncVal: 50,
      pProdVal: 100,
      pMinVal: 15000,
      pSplitVal: 50,
      pResVal: 30,
      regraAtiva: 'livre'
    };
  }
  return window.assistirSimState[key];
}

function initViabilidadeSimulation(specKey, rootSelector = '#assistirMainContent') {
  const root = (rootSelector ? document.querySelector(rootSelector) : null) || document;
  const checkEl = root.querySelector('#beam');
  if (!checkEl) return;

  const key = specKey || (rootSelector && rootSelector.includes('cisa') ? (window.currentCisaKey || 'oftalmologia') : (currentAssistirKey || 'cardiologia'));
  const item = (typeof SERVICOS_CISA !== 'undefined' && SERVICOS_CISA[key]) || (typeof AMBULATORIOS_ASSISTIR !== 'undefined' && AMBULATORIOS_ASSISTIR[key]) || {};
  const state = getSimState(key);

  let procs = state.procs;
  let custos = state.custos;
  let regraAtiva = state.regraAtiva;

  // Set current DOM values from state
  const elUih = root.querySelector('#uih');
  const elPeso = root.querySelector('#peso');
  const elUr = root.querySelector('#ur');
  const elPInc = root.querySelector('#pInc');
  const elPProd = root.querySelector('#pProd');
  const elPMin = root.querySelector('#pMin');
  const elPSplit = root.querySelector('#pSplit');
  const elPRes = root.querySelector('#pRes');

  if (elUih) elUih.value = state.uihVal;
  if (elPeso) elPeso.value = state.pesoVal;
  if (elUr) elUr.value = state.urVal;
  if (elPInc) elPInc.value = state.pIncVal;
  if (elPProd) elPProd.value = state.pProdVal;
  if (elPMin) elPMin.value = state.pMinVal;
  if (elPSplit) elPSplit.value = state.pSplitVal;
  if (elPRes) elPRes.value = state.pResVal;

  if (elUih) elUih.oninput = () => { state.uihVal = parseFloat(elUih.value) || 0; render(); };
  if (elPeso) elPeso.oninput = () => { state.pesoVal = parseFloat(elPeso.value) || 0; render(); };
  if (elUr) elUr.oninput = () => { state.urVal = parseFloat(elUr.value) || 0; render(); };
  if (elPInc) elPInc.oninput = () => { state.pIncVal = parseFloat(elPInc.value) || 0; render(); };
  if (elPProd) elPProd.oninput = () => { state.pProdVal = parseFloat(elPProd.value) || 0; render(); };
  if (elPMin) elPMin.oninput = () => { state.pMinVal = parseFloat(elPMin.value) || 0; render(); };
  if (elPSplit) elPSplit.oninput = () => { state.pSplitVal = parseFloat(elPSplit.value) || 0; render(); };
  if (elPRes) elPRes.oninput = () => { state.pResVal = parseFloat(elPRes.value) || 0; render(); };

  const BRL = new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
  const NUM = new Intl.NumberFormat('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:0});
  const PCT = new Intl.NumberFormat('pt-BR',{style:'percent',minimumFractionDigits:1});
  
  const $ = s => root.querySelector(s);
  const el = (t,c) => { const e=document.createElement(t); if(c) e.className=c; return e; };
  
  































function inputCell(val, onChange, opts={}){

  const td = el('td', opts.text ? '' : 'num');

  const i = document.createElement('input');

  i.type = opts.text ? 'text' : 'number';

  if(opts.text) i.className='l';

  i.value = val;

  if(!opts.text){ i.step = opts.step || '0.01'; i.min='0'; }

  i.addEventListener('input', ()=>{ onChange(opts.text ? i.value : (parseFloat(i.value)||0));  });

  td.appendChild(i);

  return td;

}



function renderProcs(){

  const tb = $('#tbProc'); tb.innerHTML='';

  procs.forEach((p,idx)=>{

    const tr = el('tr');

    const c1 = el('td'); c1.className='code';

    const ci = document.createElement('input');

    ci.type='text'; ci.className='l'; ci.value=p.cod; ci.style.fontFamily='"IBM Plex Mono",monospace'; ci.style.fontSize='11px';

    ci.addEventListener('input',()=>{p.cod=ci.value;});

    if(p.nota){ ci.title = p.nota; c1.title = p.nota; }

    c1.appendChild(ci); tr.appendChild(c1);



    const c2 = el('td'); c2.className='desc';

    const di = document.createElement('input');

    di.type='text'; di.className='l'; di.value=p.desc;

    di.addEventListener('input',()=>{p.desc=di.value;});

    c2.appendChild(di); tr.appendChild(c2);



    tr.appendChild(inputCell(p.qtd, v=>p.qtd=v, {step:'1'}));

    tr.appendChild(inputCell(p.sig, v=>p.sig=v));

    const pa = paramsAtivos();

    const zerado = pa.zeraCustoProducao;

    const tdCus = inputCell(zerado ? 0 : p.cus, v=>{ if(!zerado) p.cus=v; });

    if(zerado){

      const ic = tdCus.querySelector('input');

      ic.classList.add('locked'); ic.disabled = true;

      ic.title = 'Zerado pela regra ativa — o custo de execução é definido pelo prestador.';

    }

    tr.appendChild(tdCus);



    const r = el('td','num'); r.textContent = BRL.format(p.qtd*p.sig);

    if(pa.prodHosp === 0){ r.className='num alheio'; r.innerHTML = BRL.format(p.qtd*p.sig)+'<span class="tag-p">P</span>'; }

    tr.appendChild(r);

    const k = el('td','num');

    if(zerado){ k.className='num alheio'; k.innerHTML = BRL.format(0)+'<span class="tag-p">P</span>'; }

    else { k.textContent = BRL.format(p.qtd*p.cus); }

    tr.appendChild(k);



    const del = el('td');

    const b = el('button','btn ghost sm'); b.textContent='×'; b.title='Remover linha';

    b.setAttribute('aria-label','Remover '+p.cod);

    b.onclick = ()=>{ procs.splice(idx,1);  };

    del.appendChild(b); tr.appendChild(del);

    tb.appendChild(tr);

  });

}



function renderCustos(){

  const tb = $('#tbCusto'); tb.innerHTML='';

  custos.forEach((c,idx)=>{

    const tr = el('tr');

    const c1 = el('td');

    const ii = document.createElement('input');

    ii.type='text'; ii.className='l'; ii.value=c.item;

    ii.addEventListener('input',()=>{c.item=ii.value;});

    c1.appendChild(ii); tr.appendChild(c1);

    tr.appendChild(inputCell(c.qtd, v=>c.qtd=v));

    tr.appendChild(inputCell(c.val, v=>c.val=v));

    const t = el('td','num'); t.textContent = BRL.format(c.qtd*c.val); tr.appendChild(t);

    const del = el('td');

    const b = el('button','btn ghost sm'); b.textContent='×'; b.title='Remover item';

    b.onclick = ()=>{ custos.splice(idx,1);  };

    del.appendChild(b); tr.appendChild(del);

    tb.appendChild(tr);

  });

}



function paramsAtivos(){

  const R = REGRAS[regraAtiva];

  const p = Object.assign({modo:'fluxo', zeraCustoProducao:false, cusProdIndefinido:false,

                           incHosp:1, prodHosp:1, cusProdHosp:1, cusFixoHosp:1}, R.params);

  if(R.aplicada && R.ajustavel){

    if(p.modo === 'minimo'){

      p.minimo  = parseFloat($('#pMin').value)||0;

      p.resHosp = (parseFloat($('#pSplit').value)||0)/100;

    } else if(p.modo === 'resultado'){

      p.resHosp = (parseFloat($('#pRes').value)||0)/100;

    } else {

      p.incHosp  = (parseFloat($('#pInc').value)||0)/100;

      p.prodHosp = (parseFloat($('#pProd').value)||0)/100;

    }

  }

  return p;

}



function calc(){

  const rec = procs.reduce((s,p)=>s+p.qtd*p.sig,0);

  const cusVar = procs.reduce((s,p)=>s+p.qtd*p.cus,0);

  const fixo = custos.reduce((s,c)=>s+c.qtd*c.val,0);

  const uih = parseFloat($('#uih').value)||0;

  const peso = parseFloat($('#peso').value)||0;

  const ur = parseFloat($('#ur').value)||0;

  const vits = uih*peso*ur;

  const inc = vits/12;



  const p = paramsAtivos();



  if(p.modo === 'minimo'){

    const receitaTotal = rec + inc;

    const despesaTotal = cusVar + fixo;

    const liquido = receitaTotal - despesaTotal;

    const excedente = liquido - p.minimo;

    const excH = excedente >= 0 ? excedente*p.resHosp : excedente;

    const excP = excedente >= 0 ? excedente*(1-p.resHosp) : 0;

    const H = {inc, prod:rec, cusVar, cusFix:fixo, receita:receitaTotal, despesa:despesaTotal,

               pct:p.resHosp, res:excH};

    const P = {inc:0, prod:0, cusVar:0, cusFix:0, receita:0, despesa:0,

               pct:1-p.resHosp, res:p.minimo+excP, indefinido:false};

    const consultasM = procs.filter(x=>x.meta==='consulta').reduce((s,x)=>s+x.qtd,0);

    return {rec,cusVar,cusVarEfetivo:cusVar,fixo,vits,inc,p,H,P,consultas:consultasM,

            liquido, excedente, minimo:p.minimo, excP,

            receita:receitaTotal, despesa:despesaTotal, res:excH, rateado:true};

  }



  if(p.modo === 'resultado'){

    const receitaTotal = rec + inc;

    const despesaTotal = cusVar + fixo;

    const liquido = receitaTotal - despesaTotal;

    const H = {inc, prod:rec, cusVar, cusFix:fixo,

               receita:receitaTotal, despesa:despesaTotal,

               base:liquido, pct:p.resHosp, res:liquido*p.resHosp};

    const P = {inc:0, prod:0, cusVar:0, cusFix:0, receita:0, despesa:0,

               base:liquido, pct:1-p.resHosp, res:liquido*(1-p.resHosp), indefinido:false};

    const consultasR = procs.filter(x=>x.meta==='consulta').reduce((s,x)=>s+x.qtd,0);

    return {rec,cusVar,cusVarEfetivo:cusVar,fixo,vits,inc,p,H,P,consultas:consultasR,

            liquido, receita:receitaTotal, despesa:despesaTotal, res:H.res, rateado:true};

  }



  const cusVarEfetivo = p.zeraCustoProducao ? 0 : cusVar;

  const H = {

    inc: inc*p.incHosp,

    prod: rec*p.prodHosp,

    cusVar: cusVarEfetivo*p.cusProdHosp,

    cusFix: fixo*p.cusFixoHosp

  };

  H.receita = H.inc+H.prod; H.despesa = H.cusVar+H.cusFix; H.res = H.receita-H.despesa;

  const P = {

    inc: inc-H.inc,

    prod: rec-H.prod,

    cusVar: cusVarEfetivo-H.cusVar,

    cusFix: fixo-H.cusFix,

    indefinido: p.cusProdIndefinido

  };

  P.receita = P.inc+P.prod; P.despesa = P.cusVar+P.cusFix; P.res = P.receita-P.despesa;



  const consultas = procs.filter(x=>x.meta==='consulta').reduce((s,x)=>s+x.qtd,0);

  return {rec,cusVar,cusVarEfetivo,fixo,vits,inc,p,H,P,consultas,

          receita:H.receita, despesa:H.despesa, res:H.res,

          rateado: p.incHosp<1 || p.prodHosp<1 || p.cusFixoHosp<1 || p.zeraCustoProducao};

}



function render(){

  renderProcs(); renderCustos();

  const d = calc();



  $('#totProcRec').textContent = BRL.format(d.H.prod);

  $('#totProcCus').textContent = BRL.format(d.H.cusVar);

  $('#totFixo').textContent = BRL.format(d.H.cusFix);

  $('#vits').textContent = BRL.format(d.vits);

  $('#incMes').textContent = BRL.format(d.inc);



  const max = Math.max(d.H.prod, d.H.inc, d.H.despesa, 1);

  $('#barProd').style.width = (d.H.prod/max*100)+'%';

  $('#barInc').style.width  = (d.H.inc/max*100)+'%';

  $('#barDesp').style.width = (d.H.despesa/max*100)+'%';

  $('#vProd').textContent = BRL.format(d.H.prod);

  $('#vInc').textContent  = BRL.format(d.H.inc);

  $('#vDesp').textContent = BRL.format(d.H.despesa);



  // divisão hospital / prestador

  const sb = $('#splitBox');

  sb.hidden = !d.rateado;

  const modoMin = d.p.modo === 'minimo';

  const modoRes = d.p.modo === 'resultado';

  $('#hMin').hidden = !modoMin;  $('#pMin').hidden = !modoMin;

  $('#poolBox').hidden = true;

  $('#hStream').hidden = false;  $('#pStream').hidden = modoRes || modoMin;

  $('#hPool').hidden = !modoRes;   $('#pPool').hidden = !modoRes;



  if(modoMin){

    const q = (id,v)=>{ $(id).textContent = BRL.format(v); };

    q('#hInc', d.inc); q('#hProd', d.rec); q('#hCusVar', -d.cusVar); q('#hCusFix', -d.fixo);

    q('#hLiqM', d.liquido); q('#hMinV', -d.minimo); q('#hExc', d.excedente);

    q('#pMinV', d.minimo); q('#pExcBase', d.excedente); q('#pExcV', d.excP);

    $('#hPctM').textContent = d.excedente >= 0 ? PCT.format(d.H.pct) : '100% do déficit';

    $('#pPctM').textContent = d.excedente >= 0 ? PCT.format(d.P.pct) : 'protegido pelo piso';

    const hr=$('#hRes'), pr=$('#pRes2'), pn=$('#pResNota');

    hr.textContent = BRL.format(d.H.res); hr.className = 'vl '+(d.H.res>=0?'pos':'negv');

    pr.textContent = BRL.format(d.P.res); pr.className = 'vl '+(d.P.res>=0?'pos':'negv');

    pn.hidden = false;

    pn.textContent = d.excedente >= 0

      ? 'Piso de ' + BRL.format(d.minimo) + ' assegurado, mais a metade do excedente.'

      : 'O excedente é negativo. O prestador recebe o piso integralmente e o hospital absorve sozinho o déficit de ' + BRL.format(-d.excedente) + '.';

    $('#mSplit').textContent = 'prestador ' + Math.round(d.P.pct*100) + '%';

  } else if(modoRes){

    $('#poolRec').textContent = BRL.format(d.receita);

    $('#poolDes').textContent = BRL.format(d.despesa);

    $('#poolLiq').textContent = BRL.format(d.liquido);

    const q = (id,v)=>{ $(id).textContent = BRL.format(v); };

    q('#hInc', d.inc);   q('#hProd', d.rec);

    q('#hCusVar', -d.cusVar); q('#hCusFix', -d.fixo);

    q('#hLiq', d.liquido);

    $('#hPct').textContent = PCT.format(d.H.pct);

    $('#pLiq').textContent = BRL.format(d.liquido);

    $('#pPct').textContent = PCT.format(d.P.pct);

    const hr=$('#hRes'), pr=$('#pRes2'), pn=$('#pResNota');

    hr.textContent = BRL.format(d.H.res); hr.className = 'vl '+(d.H.res>=0?'pos':'negv');

    pr.textContent = BRL.format(d.P.res); pr.className = 'vl '+(d.P.res>=0?'pos':'negv');

    pn.hidden = false;

    pn.textContent = d.liquido >= 0

      ? 'Resultado partilhado: os dois lados dependem do desempenho do serviço no mês.'

      : 'O mês fecha negativo. Nesta regra o prejuízo também é rateado — o prestador absorve ' + PCT.format(d.P.pct) + ' dele.';

    $('#mRes').textContent = 'prestador ' + Math.round(d.P.pct*100) + '%';

  } else if(d.rateado){

    const set=(id,v)=>{ $(id).textContent = BRL.format(v); };

    set('#hInc',d.H.inc); set('#hProd',d.H.prod); set('#hCusVar',-d.H.cusVar); set('#hCusFix',-d.H.cusFix);

    set('#pIncV',d.P.inc); set('#pProdV',d.P.prod); set('#pCusFix',-d.P.cusFix);

    const hr=$('#hRes'), pr=$('#pRes2'), pcv=$('#pCusVar'), pn=$('#pResNota');

    hr.textContent = BRL.format(d.H.res); hr.className = 'vl '+(d.H.res>=0?'pos':'negv');

    if(d.P.indefinido){

      pcv.innerHTML = '<span class="indef">a definir</span>';

      pr.innerHTML = BRL.format(d.P.receita) + '<span class="menos">− a definir</span>';

      pr.className = 'vl recebido';

      pn.hidden = false;

      pn.innerHTML = 'O prestador recebe integralmente ' + BRL.format(d.P.inc) +

        ' de incentivo. O que sobra depende do custo de execução que ele praticar — valor não conhecido pelo hospital neste modelo.';

    } else {

      pcv.textContent = BRL.format(-d.P.cusVar);

      pr.textContent = BRL.format(d.P.res); pr.className = 'vl '+(d.P.res>=0?'pos':'negv');

      pn.hidden = true;

    }

    $('#mInc').textContent  = 'prestador '+Math.round((1-d.p.incHosp)*100)+'%';

    $('#mProd').textContent = 'prestador '+Math.round((1-d.p.prodHosp)*100)+'%';

  }



  // faixa nos custos fixos

  const rib = $('#fixRibbon'), painelFixo = rib.closest('.panel');

  if(d.p.cusFixoHosp === 0){

    rib.hidden = false;

    rib.innerHTML = '<b>A cargo do prestador.</b> Pela regra ativa, estes custos não oneram o hospital. Continue preenchendo-os — eles alimentam o resultado do prestador e mostram se a proposta é sustentável para o outro lado da mesa.';

    painelFixo.classList.add('dim');

  } else { rib.hidden = true; painelFixo.classList.remove('dim'); }



  const total = d.receita + d.despesa;

  const tilt = total>0 ? Math.max(-5, Math.min(5, ((d.despesa-d.receita)/total)*10)) : 0;

  $('#beam').style.transform = `translateX(-50%) rotate(${tilt}deg)`;



  $('#capRes').textContent = d.rateado ? 'Resultado mensal do hospital' : 'Resultado mensal';

  const rm = $('#resMes');

  rm.textContent = BRL.format(d.res);

  rm.className = 'big ' + (d.res>=0 ? 'pos' : 'negv');

  $('#resAno').textContent = BRL.format(d.res*12);

  $('#margem').textContent = d.receita>0 ? PCT.format(d.res/d.receita) : '—';

  $('#depend').textContent = d.receita>0 ? PCT.format(d.inc/d.receita) : '—';



  const custoUnitHosp = d.p.zeraCustoProducao ? 0 : (procs[0] ? procs[0].cus*d.p.cusProdHosp : 0);

  const margemConsulta = procs[0] ? (procs[0].sig*d.p.prodHosp - custoUnitHosp) : 0;

  let be;

  if(d.p.modo === 'minimo'){

    be = d.excedente>=0 ? 'Excedente positivo' : 'Piso não coberto';

  } else if(d.p.modo === 'resultado'){

    be = d.liquido>=0 ? 'Operação superavitária' : 'Operação deficitária';

  } else if(d.p.prodHosp === 0 && d.H.cusVar === 0){

    be = d.H.res>=0 ? 'Independe do volume' : 'Inatingível por volume';

  } else if(margemConsulta > 0){

    be = Math.ceil(Math.max(0,(d.H.cusFix - d.H.inc - (d.H.prod - procs[0].qtd*procs[0].sig*d.p.prodHosp) + (d.H.cusVar - procs[0].qtd*custoUnitHosp)))/margemConsulta);

    be = (be === 0) ? 'Coberto pelo incentivo' : NUM.format(be) + ' consultas/mês';

  } else {

    be = d.res>=0 ? 'Coberto pelo incentivo' : 'Inatingível por volume';

  }

  $('#breakeven').textContent = be;



  renderConf(d);

}



function renderConf(d){
  const ul = $('#confList'); ul.innerHTML='';
  const metaQtd = (item && item.fields && parseInt(item.fields.META_CONSULTAS)) ? parseInt(item.fields.META_CONSULTAS) : 240;
  const tabNum = (item && item.fields && item.fields.TABELA) ? item.fields.TABELA : '—';
  const nomeEsp = (item && item.nome) ? item.nome : 'Especialidade';

  const isCisa = (rootSelector && rootSelector.includes('cisa')) || (item && (item.grupo === 'cisa' || item.is_cisa));
  const normaText = isCisa ? 'Pactuação Consórcio CISA · Regional' : `Tabela ${tabNum} da Portaria SES/RS nº 46/2026`;

  const itens = [
    { t:`Mínimo de ${metaQtd} consultas/mês`,
      s: normaText,
      ok: d.consultas>=metaQtd, st: NUM.format(d.consultas)+` / ${metaQtd}` },
    { t:'Teleconsulta computa meta',
      s:'Complementar, para casos eletivos e estáveis, quando o exame físico não for imprescindível',
      ok: null, st: NUM.format(procs.find(p=>p.cod && p.cod.startsWith('03.01.01.030'))?.qtd||0)+' /mês' },
    { t:'Resultado operacional positivo',
      s:'Receita total contra custo direto e fixo',
      ok: d.res>=0, st: BRL.format(d.res) },
    { t:'Serviço não depende só do incentivo',
      s:'Participação do incentivo abaixo de 80% da receita indica menor exposição à perda da habilitação',
      ok: d.receita>0 ? (d.inc/d.receita)<0.8 : null,
      st: d.receita>0 ? PCT.format(d.inc/d.receita) : '—' },
    { t:'Serviços especializados no CNES',
      s: isCisa ? 'Habilitações e serviços oftalmológicos cadastrados no CNES' : (tabNum === '18' ? 'ECG exige 122/003 · Holter 122/002 · Ergométrico 122/001 · Ecocardiografia 121/002. Sem o serviço cadastrado, o procedimento é glosado' : `Serviços especializados exigidos pela Tabela ${tabNum} cadastrados no CNES`),
      ok:null, st:'Conferir CNES' },
    { t: isCisa ? 'Regulação estrita via Central GERCON / CISA' : (tabNum === '18' ? 'Avaliação cardiológica para outras especialidades' : `Atenção especializada em ${nomeEsp}`),
      s: isCisa ? 'Pactuação regional para munícipes consorciados referenciados à Santa Casa de Bagé' : (tabNum === '18' ? 'A portaria obriga o hospital habilitado a fornecê-la quando o especialista julgar necessário' : 'Conformidade com a linha de cuidado e diretrizes assistenciais da portaria'),
      ok:null, st:'Verificar' }
  ];

  itens.forEach(i=>{

    const li = el('li');

    const f = el('span','flag ' + (i.ok===true?'ok':i.ok===false?'no':'na'));

    const d2 = el('div');

    const t = el('div','t'); t.textContent = i.t;

    const s = el('div','s'); s.textContent = i.s;

    d2.appendChild(t); d2.appendChild(s);

    const st = el('span','st'); st.textContent = i.st;

    li.appendChild(f); li.appendChild(d2); li.appendChild(st);

    ul.appendChild(li);

  });

}







$('#addProc').onclick = ()=>{ procs.push({cod:'', desc:'', qtd:0, sig:0, cus:0, meta:''});  };

$('#addCusto').onclick = ()=>{ custos.push({item:'', qtd:0, val:0});  };



$('#btnZerar').onclick = ()=>{

  if(!confirm('Zerar todas as quantidades e valores? Os códigos e descrições permanecem.')) return;

  procs.forEach(p=>{p.qtd=0;p.sig=0;p.cus=0});

  custos.forEach(c=>{c.qtd=0;c.val=0});

  

};



if ($('#btnSalvar')) {
  $('#btnSalvar').onclick = ()=>{
    const data = {ambulatorio: item.nome || 'Especialidade', tabela: (item.fields && item.fields.TABELA) || 'Tabela',
      uih: parseFloat($('#uih').value),
      peso: parseFloat($('#peso').value),
      ur: parseFloat($('#ur').value),
      regra: regraAtiva,
      pInc: parseFloat($('#pInc').value),
      pProd: parseFloat($('#pProd').value),
      pRes: parseFloat($('#pRes').value),
      pMin: parseFloat($('#pMin').value),
      pSplit: parseFloat($('#pSplit').value),
      procs, custos, gerado: new Date().toISOString()};
    baixar(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}), `viabilidade-${key}.json`);
  };
}




$('#btnCarregar').onclick = ()=> $('#fileIn').click();

$('#fileIn').onchange = e=>{

  const f = e.target.files[0]; if(!f) return;

  const r = new FileReader();

  r.onload = () => {
    try {
      const d = JSON.parse(r.result);
      if(!Array.isArray(d.procs) || !Array.isArray(d.custos)) throw 0;
      state.procs = d.procs; procs = state.procs;
      state.custos = d.custos; custos = state.custos;
      cardioUihVal = d.uih || 1140.72;
      cardioPesoVal = d.peso || 840;
      cardioUrVal = d.ur || 1;
      cardioPIncVal = d.pInc !== undefined ? d.pInc : 50;
      cardioPProdVal = d.pProd !== undefined ? d.pProd : 100;
      cardioPMinVal = d.pMin !== undefined ? d.pMin : 15000;
      cardioPSplitVal = d.pSplit !== undefined ? d.pSplit : 50;
      cardioPResVal = d.pRes !== undefined ? d.pRes : 30;
      cardioRegraAtiva = d.regra || 'livre';
      initCardioSimulation();

      if(d.uih) $('#uih').value = d.uih;

      if(d.peso) $('#peso').value = d.peso;

      if(d.ur) $('#ur').value = d.ur;

      if(d.pInc!=null) $('#pInc').value = d.pInc;

      if(d.pProd!=null) $('#pProd').value = d.pProd;

      if(d.pRes!=null) $('#pRes').value = d.pRes;

      if(d.pMin!=null) $('#pMin').value = d.pMin;

      if(d.pSplit!=null) $('#pSplit').value = d.pSplit;

      aplicarRegra(d.regra && REGRAS[d.regra] ? d.regra : 'livre');

    }catch(err){

      alert('Esse arquivo não é um cenário válido. Use um arquivo gerado por “Salvar cenário”.');

    }

    e.target.value='';

  };

  r.readAsText(f);

};



$('#btnCsv').onclick = ()=>{

  const d = calc();

  const q = s => '"'+String(s).replace(/"/g,'""')+'"';

  const L = [];

  L.push(['Bloco','Codigo','Descricao','Qtde','ValorUnit','CustoUnit','Receita','Custo'].map(q).join(';'));

  procs.forEach(p=>L.push(['Producao',p.cod,p.desc,p.qtd,p.sig,p.cus,(p.qtd*p.sig).toFixed(2),(p.qtd*p.cus).toFixed(2)].map(q).join(';')));

  custos.forEach(c=>L.push(['CustoFixo','',c.item,c.qtd,c.val,'','',(c.qtd*c.val).toFixed(2)].map(q).join(';')));

  L.push('');

  [['Regra de negociacao',REGRAS[regraAtiva].nome],

   ['Producao SIGTAP total',d.rec],['Incentivo mensal total',d.inc],

   ['HOSPITAL - Incentivo',d.H.inc],['HOSPITAL - Producao',d.H.prod],

   ['HOSPITAL - Custo producao',d.H.cusVar],['HOSPITAL - Custo fixo',d.H.cusFix],

   ['HOSPITAL - Resultado mensal',d.H.res],['HOSPITAL - Resultado anual',d.H.res*12],

   ['PRESTADOR - Incentivo',d.P.inc],['PRESTADOR - Producao',d.P.prod],

   ['PRESTADOR - Custo producao',d.P.cusVar],['PRESTADOR - Custo fixo',d.P.cusFix],

   ['PRESTADOR - Resultado mensal',d.P.res]]

   .forEach(r=>L.push([q(r[0]),q(typeof r[1]==='number'?r[1].toFixed(2):r[1])].join(';')));

  baixar(new Blob(['\uFEFF'+L.join('\r\n')],{type:'text/csv;charset=utf-8'}),'viabilidade-cardiologia.csv');

};



$('#btnImprimir').onclick = ()=>window.print();



function baixar(blob, nome){

  const a = document.createElement('a');

  a.href = URL.createObjectURL(blob); a.download = nome;

  document.body.appendChild(a); a.click();

  setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();},0);

}



/* ---------- regras de negociação (layout; cálculo em versão futura) ---------- */

const REGRAS = {

  margem50:{

    nome:'50% Margem Hospitalar', tag:'50%', aplicada:true, ajustavel:true,

    campos:['gInc','gProd'],

    params:{modo:'fluxo', incHosp:0.50, prodHosp:1.00, cusProdHosp:0, cusFixoHosp:1,

            zeraCustoProducao:true, cusProdIndefinido:true},

    nota:'O incentivo é dividido com o prestador, que assume por conta própria o custo de execução dos procedimentos — pessoal assistencial, materiais e insumos da produção. O hospital mantém integralmente a receita SIGTAP e continua arcando com a estrutura fixa do serviço. Os custos de produção não entram na conta de nenhum dos dois lados de forma fechada: o hospital zera essa coluna e o prestador define seu próprio custo.'

  },

  mingar:{

    nome:'Mínimo Garantido', tag:'piso', aplicada:true, ajustavel:true,

    campos:['gMin','gSplit'],

    params:{modo:'minimo', minimo:15000, resHosp:0.50},

    nota:'O prestador tem receita mínima assegurada, paga antes de qualquer divisão. O que sobra do resultado da operação é partilhado meio a meio. Dá previsibilidade ao corpo clínico e mantém o incentivo por desempenho na parcela variável — mas o risco de meses ruins fica todo com o hospital, que honra o piso mesmo quando o excedente é negativo.'

  },

  rateio7030:{

    nome:'Rateio 70% / 30%', tag:'70/30', aplicada:true, ajustavel:true,

    campos:['gRes'],

    params:{modo:'resultado', resHosp:0.30},

    nota:'Operação conjunta com resultado partilhado. Somam-se todas as receitas — produção SIGTAP e incentivo — abatem-se todas as despesas, e o que sobra é dividido: 70% para o prestador e 30% ao hospital, a título de taxa de administração. Os dois lados correm o mesmo risco: se o mês fecha negativo, ambos absorvem prejuízo na mesma proporção.'

  },

  rateio8020:{

    nome:'Rateio 80% / 20%', tag:'80/20', aplicada:true, ajustavel:true,

    campos:['gRes'],

    params:{modo:'resultado', resHosp:0.20},

    nota:'Operação conjunta com resultado partilhado. Somam-se todas as receitas — produção SIGTAP e incentivo — abatem-se todas as despesas, e o que sobra é dividido: 80% para o prestador e 20% ao hospital, a título de taxa de administração. Os dois lados correm o mesmo risco: se o mês fecha negativo, ambos absorvem prejuízo na mesma proporção.'

  },

  livre:{

    nome:'Construção Livre', tag:'livre', aplicada:true, ajustavel:false,

    params:{incHosp:1, prodHosp:1, cusProdHosp:1, cusFixoHosp:1},

    nota:'Nenhum rateio é aplicado — o hospital opera e arca com tudo, e cada linha recebe o custo digitado. É o modo indicado quando o custo vem da apuração contábil e não de percentual sobre a tabela.'

  }

};





function aplicarRegra(id){

  regraAtiva = id;

  document.querySelectorAll('.rule-card[data-rule]').forEach(b=>{

    b.setAttribute('aria-pressed', String(b.dataset.rule === id));

  });

  const r = REGRAS[id];

  $('#colTag').textContent = r.tag;

  $('#ruleParams').hidden = !(r.aplicada && r.ajustavel);

  ['gInc','gProd','gRes','gMin','gSplit'].forEach(g=>{

    $('#'+g).hidden = !(r.campos && r.campos.includes(g));

  });

  $('#ruleNote').innerHTML = '<b>' + r.nome + '.</b> ' + r.nota +

    (r.aplicada ? '' : ' <b>Ainda não aplicada ao cálculo</b> — defina a fórmula para ativá-la.');

  $('#ruleBadge').textContent = r.aplicada ? 'Ativa' : 'Pré-visualização';

  

}



root.querySelectorAll('.rule-card[data-rule]').forEach(b=>{
  b.addEventListener('click', ()=>aplicarRegra(b.dataset.rule));
});

const addRuleEl = root.querySelector('#addRule');
if (addRuleEl) {
  addRuleEl.addEventListener('click', ()=>{
    alert('As regras personalizadas entram na próxima versão. Você poderá nomear a regra, escolher a fórmula e definir os parâmetros por procedimento.');
  });
}








  
  // Overwrite local rule application to save choice to outer scope
  const originalAplicarRegra = aplicarRegra;
  aplicarRegra = (id) => {
    state.regraAtiva = id; regraAtiva = id;
    if (id === 'rateio7030') {
      const pResEl = root.querySelector('#pRes');
      if (pResEl) { pResEl.value = 30; state.pResVal = 30; }
    } else if (id === 'rateio8020') {
      const pResEl = root.querySelector('#pRes');
      if (pResEl) { pResEl.value = 20; state.pResVal = 20; }
    }
    originalAplicarRegra(id);
    render();
  };
  
  // Re-bind click events to rules to use the overwritten rule handler
  root.querySelectorAll('.rule-card[data-rule]').forEach(b => {
    b.onclick = () => aplicarRegra(b.dataset.rule);
  });
  
  // Trigger initial render
  aplicarRegra(state.regraAtiva);
}
window.initCardioSimulation = function() { initViabilidadeSimulation('cardiologia', '#assistirMainContent'); };
window.initViabilidadeSimulation = initViabilidadeSimulation;



// --- EMENDAS PARLAMENTARES GLOBAL STATE & LOGIC ---
let emendasInitialized = false;
let emendasEstado = null;

function initEmendasTab() {
  const checkEl = document.getElementById("busca");
  if (!checkEl) return;
  
  console.log("Initializing Emendas Parlamentares Tab...");
  
  if (emendasInitialized) {
    // If already initialized, just trigger a render
    if (typeof render === 'function') {
      render();
    }
    return;
  }
  
  

const DADOS = {

  "meta": {

    "titulo": "Controle de Emendas Parlamentares — Santa Casa de Caridade de Bagé",

    "entidade": "SANTA CASA DE CARIDADE DE BAGÉ",

    "cnes": "2261987",

    "exercicio": 2026,

    "fonte": "Planilha institucional de acompanhamento (documento físico digitalizado) + anotações manuscritas de conferência",

    "data_referencia": "2026-08-11",

    "total_carteira": 5708715.0,

    "total_creditado": 3418715.0,

    "total_aguardando": 2290000.0,

    "observacoes_de_conferencia": [

      "Números de proposta dos itens EP-03 e EP-04 iniciam por 63000 (demais por 36000) — confirmar no FNS.",

      "Número de proposta do item EP-01 apresenta 16 dígitos na fonte (padrão observado: 17) — confirmar no FNS.",

      "Anotação manuscrita indica destinação 'CTI NEO — R$ 372.000,00' sem vínculo explícito a proposta — confirmar objeto junto à Provedoria.",

      "Campos de objeto, conta específica, data de crédito e execução não constam da fonte — preenchimento interno obrigatório.",

      "Contrapartida de 30% em serviços aplicada a EP-01 (bancada) e EP-02 (comissão) — validar o percentual e a base de cálculo no instrumento que formalizou cada emenda."

    ],

    "regra_contrapartida": "Emendas de BANCADA e de COMISSÃO exigem contrapartida de 30% em serviços prestados. O percentual incide sobre o valor da emenda: 70% constituem recurso livre e 30% ficam comprometidos com a contrapartida, que precisa ser comprovada em serviços.",

    "total_contrapartida": 365614.5,

    "total_livre": 5343100.5

  },

  "estagios": [

    {

      "id": 1,

      "nome": "Proposta cadastrada",

      "sistema": "FNS / InvestSUS"

    },

    {

      "id": 2,

      "nome": "Portaria publicada",

      "sistema": "DOU — GM/MS"

    },

    {

      "id": 3,

      "nome": "Empenho emitido",

      "sistema": "FNS / SIAFI"

    },

    {

      "id": 4,

      "nome": "Recurso creditado",

      "sistema": "Ordem bancária — conta específica"

    },

    {

      "id": 5,

      "nome": "Objeto executado",

      "sistema": "Controle interno / contratos"

    },

    {

      "id": 6,

      "nome": "Contas prestadas",

      "sistema": "Relatório de execução — FNS"

    },

    {

      "id": 7,

      "nome": "Contas aprovadas",

      "sistema": "FNS / DENASUS"

    }

  ],

  "emendas": [

    {

      "id": "EP-01",

      "cnes": "2261987",

      "portaria": "PORTARIA GM/MS Nº 11.372",

      "portaria_data": "2026-05-21",

      "proposta": "3600079606202600",

      "valor": 1018710.0,

      "tipo": "BANCADA",

      "referencia_pt": "PT 10.352",

      "situacao_fonte": "C/RECURSO",

      "anotacao_manuscrita": "Pago",

      "estagio": 4,

      "data_credito": "",

      "objeto": "",

      "conta_especifica": "",

      "percentual_executado": 0,

      "conferir_proposta": true,

      "observacoes": "",

      "contrapartida_pct": 0.3,

      "contrapartida_comprovada_pct": 0,

      "contrapartida_base": "valor da emenda"

    },

    {

      "id": "EP-02",

      "cnes": "2261987",

      "portaria": "PORTARIA GM/MS Nº 11.570",

      "portaria_data": "2026-06-15",

      "proposta": "36000800519202600",

      "valor": 200005.0,

      "tipo": "COMISSÃO",

      "referencia_pt": "PT 10.352",

      "situacao_fonte": "C/RECURSO",

      "anotacao_manuscrita": "Pago",

      "estagio": 4,

      "data_credito": "",

      "objeto": "",

      "conta_especifica": "",

      "percentual_executado": 0,

      "conferir_proposta": false,

      "observacoes": "",

      "contrapartida_pct": 0.3,

      "contrapartida_comprovada_pct": 0,

      "contrapartida_base": "valor da emenda"

    },

    {

      "id": "EP-03",

      "cnes": "2261987",

      "portaria": "PORTARIA GM/MS Nº 11.699",

      "portaria_data": "2026-06-24",

      "proposta": "63000758080202600",

      "valor": 500000.0,

      "tipo": "SUPLEMENTAR",

      "referencia_pt": "PT 10.169/2026 — Parcela suplementar",

      "situacao_fonte": "C/RECURSO",

      "anotacao_manuscrita": "Pago",

      "estagio": 4,

      "data_credito": "",

      "objeto": "",

      "conta_especifica": "",

      "percentual_executado": 0,

      "conferir_proposta": true,

      "observacoes": "",

      "contrapartida_pct": 0.0,

      "contrapartida_comprovada_pct": 0,

      "contrapartida_base": "valor da emenda"

    },

    {

      "id": "EP-04",

      "cnes": "2261987",

      "portaria": "PORTARIA GM/MS Nº 11.699",

      "portaria_data": "2026-06-24",

      "proposta": "63000758282202600",

      "valor": 1500000.0,

      "tipo": "SUPLEMENTAR",

      "referencia_pt": "PT 10.169/2026 — Parcela suplementar",

      "situacao_fonte": "C/RECURSO",

      "anotacao_manuscrita": "Pago",

      "estagio": 4,

      "data_credito": "",

      "objeto": "",

      "conta_especifica": "",

      "percentual_executado": 0,

      "conferir_proposta": true,

      "observacoes": "",

      "contrapartida_pct": 0.0,

      "contrapartida_comprovada_pct": 0,

      "contrapartida_base": "valor da emenda"

    },

    {

      "id": "EP-05",

      "cnes": "2261987",

      "portaria": "PORTARIA GM/MS Nº 10.685",

      "portaria_data": "2026-04-02",

      "proposta": "36000752625202600",

      "valor": 200000.0,

      "tipo": "INDIVIDUAL",

      "referencia_pt": "PT 10.297",

      "situacao_fonte": "C/RECURSO",

      "anotacao_manuscrita": "Pago",

      "estagio": 4,

      "data_credito": "",

      "objeto": "",

      "conta_especifica": "",

      "percentual_executado": 0,

      "conferir_proposta": false,

      "observacoes": "",

      "contrapartida_pct": 0.0,

      "contrapartida_comprovada_pct": 0,

      "contrapartida_base": "valor da emenda"

    },

    {

      "id": "EP-06",

      "cnes": "2261987",

      "portaria": "PORTARIA GM/MS Nº 10.497",

      "portaria_data": "2026-03-30",

      "proposta": "36000747481202600",

      "valor": 190000.0,

      "tipo": "INDIVIDUAL",

      "referencia_pt": "PT 10.297",

      "situacao_fonte": "AGUARDA RECURSO DO FNS",

      "anotacao_manuscrita": "S/R",

      "estagio": 2,

      "data_credito": "",

      "objeto": "",

      "conta_especifica": "",

      "percentual_executado": 0,

      "conferir_proposta": false,

      "observacoes": "",

      "contrapartida_pct": 0.0,

      "contrapartida_comprovada_pct": 0,

      "contrapartida_base": "valor da emenda"

    },

    {

      "id": "EP-07",

      "cnes": "2261987",

      "portaria": "PORTARIA GM/MS Nº 10.497",

      "portaria_data": "2026-03-30",

      "proposta": "36000749334202600",

      "valor": 400000.0,

      "tipo": "INDIVIDUAL",

      "referencia_pt": "PT 10.297",

      "situacao_fonte": "AGUARDA RECURSO DO FNS",

      "anotacao_manuscrita": "S/R",

      "estagio": 2,

      "data_credito": "",

      "objeto": "",

      "conta_especifica": "",

      "percentual_executado": 0,

      "conferir_proposta": false,

      "observacoes": "",

      "contrapartida_pct": 0.0,

      "contrapartida_comprovada_pct": 0,

      "contrapartida_base": "valor da emenda"

    },

    {

      "id": "EP-08",

      "cnes": "2261987",

      "portaria": "PORTARIA GM/MS Nº 10.497",

      "portaria_data": "2026-03-30",

      "proposta": "36000749539202600",

      "valor": 200000.0,

      "tipo": "INDIVIDUAL",

      "referencia_pt": "PT 10.297",

      "situacao_fonte": "AGUARDA RECURSO DO FNS",

      "anotacao_manuscrita": "S/R",

      "estagio": 2,

      "data_credito": "",

      "objeto": "",

      "conta_especifica": "",

      "percentual_executado": 0,

      "conferir_proposta": false,

      "observacoes": "",

      "contrapartida_pct": 0.0,

      "contrapartida_comprovada_pct": 0,

      "contrapartida_base": "valor da emenda"

    },

    {

      "id": "EP-09",

      "cnes": "2261987",

      "portaria": "PORTARIA GM/MS Nº 10.685",

      "portaria_data": "2026-04-02",

      "proposta": "36000750992202600",

      "valor": 1000000.0,

      "tipo": "INDIVIDUAL",

      "referencia_pt": "PT 10.297",

      "situacao_fonte": "AGUARDA RECURSO DO FNS",

      "anotacao_manuscrita": "S/R",

      "estagio": 2,

      "data_credito": "",

      "objeto": "",

      "conta_especifica": "",

      "percentual_executado": 0,

      "conferir_proposta": false,

      "observacoes": "",

      "contrapartida_pct": 0.0,

      "contrapartida_comprovada_pct": 0,

      "contrapartida_base": "valor da emenda"

    },

    {

      "id": "EP-10",

      "cnes": "2261987",

      "portaria": "PORTARIA GM/MS Nº 10.685",

      "portaria_data": "2026-04-02",

      "proposta": "36000756437202600",

      "valor": 500000.0,

      "tipo": "INDIVIDUAL",

      "referencia_pt": "PT 10.297",

      "situacao_fonte": "AGUARDA RECURSO DO FNS",

      "anotacao_manuscrita": "S/R",

      "estagio": 2,

      "data_credito": "",

      "objeto": "",

      "conta_especifica": "",

      "percentual_executado": 0,

      "conferir_proposta": false,

      "observacoes": "",

      "contrapartida_pct": 0.0,

      "contrapartida_comprovada_pct": 0,

      "contrapartida_base": "valor da emenda"

    }

  ]

};



const HOJE = new Date(DADOS.meta.data_referencia + "T12:00:00");

const brl = v => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

const brlCurto = v => "R$ " + v.toLocaleString("pt-BR",{minimumFractionDigits:0,maximumFractionDigits:0});

const dt = s => s ? new Date(s+"T12:00:00").toLocaleDateString("pt-BR") : "—";

const dias = s => s ? Math.round((HOJE - new Date(s+"T12:00:00"))/864e5) : null;

const addDias = (s,n) => { const d=new Date(s+"T12:00:00"); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };



/* Parâmetros internos de controle — ajustáveis pela entidade */

const PARAM = {

  diasAlertaSemOB: 90,      // portaria publicada sem ordem bancária

  diasAlertaSemExec: 120,   // recurso em conta sem execução

  prazoExecucaoDias: 365,   // prazo de aplicação a contar do crédito

  prazoContasDias: 60       // relatório de execução após conclusão do objeto

};



if (!emendasEstado) { emendasEstado = JSON.parse(JSON.stringify(DADOS.emendas)); } let estado = emendasEstado;

let selecionada = null;



/* ---------- Regras de negócio ---------- */

function derivar(e){

  const d = {...e};

  d.diasPortaria = dias(e.portaria_data);

  d.diasCredito = dias(e.data_credito);

  d.prazoExecucao = e.data_credito ? addDias(e.data_credito, PARAM.prazoExecucaoDias) : "";

  d.diasParaPrazo = d.prazoExecucao ? -dias(d.prazoExecucao) : null;

  d.creditado = e.estagio >= 4;

  d.valorExecutado = e.valor * (e.percentual_executado||0)/100;

  d.saldoConta = d.creditado ? e.valor - d.valorExecutado : 0;



  /* Contrapartida em serviços — bancada e comissão */

  d.pctContra = e.contrapartida_pct || 0;

  d.temContra = d.pctContra > 0;

  d.valorContrapartida = e.valor * d.pctContra;

  d.valorLivre = e.valor - d.valorContrapartida;

  d.contraComprovada = d.valorContrapartida * (e.contrapartida_comprovada_pct||0)/100;

  d.contraPendente = d.valorContrapartida - d.contraComprovada;



  d.alertas = [];

  if(e.estagio === 2 && d.diasPortaria > PARAM.diasAlertaSemOB){

    d.alertas.push({n:"Portaria publicada há "+d.diasPortaria+" dias sem ordem bancária", g:"grave"});

  }

  if(e.estagio === 3 && d.diasPortaria > PARAM.diasAlertaSemOB){

    d.alertas.push({n:"Empenho emitido sem crédito em conta", g:"grave"});

  }

  if(d.creditado && !e.data_credito){

    d.alertas.push({n:"Crédito confirmado sem data de ordem bancária registrada", g:"medio"});

  }

  if(d.creditado && (e.percentual_executado||0) === 0 && d.diasCredito !== null && d.diasCredito > PARAM.diasAlertaSemExec){

    d.alertas.push({n:"Recurso em conta há "+d.diasCredito+" dias sem execução", g:"grave"});

  }

  if(d.creditado && !e.objeto){

    d.alertas.push({n:"Objeto da emenda não registrado no controle interno", g:"medio"});

  }

  if(d.creditado && !e.conta_especifica){

    d.alertas.push({n:"Conta específica não informada", g:"medio"});

  }

  if(d.temContra && d.creditado && (e.contrapartida_comprovada_pct||0) === 0){

    d.alertas.push({n:"Contrapartida de "+(d.pctContra*100)+"% em serviços sem comprovação registrada", g:"grave"});

  }

  if(d.temContra && (e.contrapartida_comprovada_pct||0) > 0 && (e.contrapartida_comprovada_pct||0) < 100){

    d.alertas.push({n:"Contrapartida em serviços comprovada parcialmente", g:"medio"});

  }

  if(e.conferir_proposta){

    d.alertas.push({n:"Número de proposta divergente do padrão — conferir no FNS", g:"medio"});

  }

  if(e.estagio === 5){

    d.alertas.push({n:"Objeto executado — prestação de contas pendente", g:"medio"});

  }

  if(d.diasParaPrazo !== null && d.diasParaPrazo < 60 && e.estagio < 6){

    d.alertas.push({n:"Prazo de aplicação encerra em "+d.diasParaPrazo+" dias", g:"grave"});

  }

  return d;

}

const derivadas = () => estado.map(derivar);



function rotuloEtapa(n){ return DADOS.estagios.find(s=>s.id===n)?.nome || "—"; }

function classeSituacao(e){

  if(e.estagio >= 7) return "b-ok";

  if(e.estagio >= 4) return "b-neutro";

  if(e.estagio <= 2) return "b-esp";

  return "b-esp";

}



/* ---------- Esteira ---------- */

function pintarEsteira(){

  const ds = derivadas();

  const total = ds.reduce((a,b)=>a+b.valor,0);

  const alvo = document.getElementById("trilho");

  alvo.innerHTML = DADOS.estagios.map(s=>{

    const itens = ds.filter(e=>e.estagio >= s.id);

    const v = itens.reduce((a,b)=>a+b.valor,0);

    const pct = total ? v/total*100 : 0;

    const cls = v>0 ? (pct>=99.5 ? "viva" : "parcial viva") : "zero";

    return `<div class="etapa ${cls}">

      <div class="marca">${s.id}</div>

      <h3>${s.nome}</h3>

      <div class="sistema">${s.sistema}</div>

      <div class="valor">${brlCurto(v)}</div>

      <div class="qtd">${itens.length} de ${ds.length} emendas · ${pct.toFixed(0)}%</div>

      <div class="barra-etapa"><i style="width:${pct}%"></i></div>

    </div>`;

  }).join("");

  const creditado = ds.filter(e=>e.estagio>=4).reduce((a,b)=>a+b.valor,0);

  document.getElementById("esteiraResumo").textContent =

    (creditado/total*100).toFixed(0) + "% da carteira já creditada · 0% com contas aprovadas";

}



/* ---------- Indicadores ---------- */

function pintarKPIs(){

  const ds = derivadas();

  const total = ds.reduce((a,b)=>a+b.valor,0);

  const creditado = ds.filter(e=>e.estagio>=4).reduce((a,b)=>a+b.valor,0);

  const aguardando = total - creditado;

  const executado = ds.reduce((a,b)=>a+b.valorExecutado,0);

  const emConta = creditado - executado;

  const nAlertas = ds.reduce((a,b)=>a+b.alertas.length,0);

  const nGraves = ds.reduce((a,b)=>a+b.alertas.filter(x=>x.g==="grave").length,0);



  const contra = ds.reduce((a,b)=>a+b.valorContrapartida,0);

  const livre = total - contra;

  const nContra = ds.filter(e=>e.temContra).length;



  const cards = [

    {c:"neutro", r:"Carteira 2026", v:brl(total), d:ds.length+" emendas · CNES 2261987"},

    {c:"ok", r:"Creditado pelo FNS", v:brl(creditado), d:ds.filter(e=>e.estagio>=4).length+" emendas · "+(creditado/total*100).toFixed(0)+"% da carteira"},

    {c:"esp", r:"Aguardando crédito", v:brl(aguardando), d:ds.filter(e=>e.estagio<4).length+" emendas sem ordem bancária"},

    {c:"esp", r:"Contrapartida em serviços", v:brl(contra), d:nContra+" emendas com 30% comprometidos"},

    {c:"ok", r:"Recurso livre", v:brl(livre), d:(livre/total*100).toFixed(1).replace(".",",")+"% da carteira · sem contrapartida"},

    {c:nGraves?"risco":"esp", r:"Providências abertas", v:String(nAlertas), d:nGraves+" de prioridade alta · "+brl(emConta)+" parado em conta"}

  ];

  document.getElementById("kpis").innerHTML = cards.map(k=>

    `<div class="kpi ${k.c}"><div class="rot">${k.r}</div><div class="v">${k.v}</div><div class="d">${k.d}</div></div>`

  ).join("");

  document.getElementById("seloTotal").textContent = brl(total);

}





/* ---------- Contrapartida em serviços ---------- */

function pintarContrapartida(){

  const ds = derivadas();

  const com = ds.filter(e=>e.temContra);

  const alvo = document.getElementById("contraBox");

  if(!com.length){

    document.getElementById("secContra").style.display = "none";

    return;

  }

  const base = com.reduce((a,b)=>a+b.valor,0);

  const contra = com.reduce((a,b)=>a+b.valorContrapartida,0);

  const livre = base - contra;

  const comprovada = com.reduce((a,b)=>a+b.contraComprovada,0);

  const pctLivre = livre/base*100, pctContra = contra/base*100;



  alvo.innerHTML = `

    <div class="contra-topo">

      <div>

        <h3>${com.length} emendas exigem 30% em serviços</h3>

        <p>Sobre emendas de bancada e de comissão incide contrapartida de 30% em serviços prestados. Do total de ${brl(base)} dessas emendas, apenas a faixa verde é recurso livre — a faixa hachurada já está comprometida e precisa ser comprovada em produção assistencial.</p>

      </div>

      <div class="contra-total">

        <div class="r">Livre nessas emendas</div>

        <div class="v" style="color:var(--verde)">${brl(livre)}</div>

        <div class="r" style="margin-top:8px">Comprometido</div>

        <div class="v" style="color:var(--ambar);font-size:16px">${brl(contra)}</div>

      </div>

    </div>



    <div class="split">

      <i class="livre" style="width:${pctLivre}%">${brl(livre)} livre</i>

      <i class="contra-fatia" style="width:${pctContra}%">${brl(contra)}</i>

    </div>

    <div class="legenda">

      <span><em class="l"></em> Recurso livre — 70% de ${brl(base)}</span>

      <span><em class="c"></em> Contrapartida em serviços — 30%</span>

      <span>Comprovado até agora: <b class="num" style="color:var(--tinta)">${brl(comprovada)}</b> de ${brl(contra)}</span>

    </div>



    ${com.map(e=>`

      <div class="contra-item">

        <div class="cab">

          <strong><span class="cod">${e.id}</span> · ${e.tipo} · ${e.portaria}</strong>

          <span class="tot">${brl(e.valor)}</span>

        </div>

        <div class="split mini">

          <i class="livre" style="width:${(1-e.pctContra)*100}%">${brl(e.valorLivre)}</i>

          <i class="contra-fatia" style="width:${e.pctContra*100}%">${brl(e.valorContrapartida)}</i>

        </div>

        <div class="det">

          <div class="liv">Livre (${((1-e.pctContra)*100).toFixed(0)}%)<b>${brl(e.valorLivre)}</b></div>

          <div class="com">Contrapartida (${(e.pctContra*100).toFixed(0)}%)<b>${brl(e.valorContrapartida)}</b></div>

          <div>Ainda a comprovar<b>${brl(e.contraPendente)}</b></div>

        </div>

        <div style="margin-top:9px"><button class="mini" data-abrir="${e.id}" type="button">abrir ficha ${e.id}</button></div>

      </div>`).join("")}

  `;

  alvo.querySelectorAll("[data-abrir]").forEach(b=>b.addEventListener("click",()=>abrir(b.dataset.abrir)));

}



/* ---------- Alertas agregados ---------- */

function pintarAlertas(){

  const ds = derivadas();

  const mapa = new Map();

  ds.forEach(e=>e.alertas.forEach(a=>{

    const chave = a.n.replace(/\d+/g,"N");

    if(!mapa.has(chave)) mapa.set(chave,{texto:a.n.replace(/há \d+ dias/,"há mais de "+PARAM.diasAlertaSemOB+" dias").replace(/em \d+ dias/,"em menos de 60 dias"),g:a.g,itens:[],valor:0});

    const m = mapa.get(chave);

    m.itens.push(e.id); m.valor += e.valor;

  }));

  const lista = [...mapa.values()].sort((a,b)=> (a.g===b.g? b.valor-a.valor : (a.g==="grave"?-1:1)));

  const alvo = document.getElementById("alertas");

  if(!lista.length){ alvo.innerHTML = `<div class="alerta info"><h4>Nenhuma providência aberta</h4><p>A carteira está em dia com os parâmetros configurados.</p></div>`; return; }

  alvo.innerHTML = lista.map(a=>`

    <div class="alerta ${a.g==="grave"?"grave":""}">

      <h4>${a.texto}</h4>

      <p>${a.itens.length} emenda${a.itens.length>1?"s":""} · ${brl(a.valor)} envolvidos</p>

      <div class="tags">${a.itens.map(i=>`<button class="mini" data-abrir="${i}" type="button">${i}</button>`).join("")}</div>

    </div>`).join("");

  alvo.querySelectorAll("[data-abrir]").forEach(b=>b.addEventListener("click",()=>abrir(b.dataset.abrir)));

}



/* ---------- Tabela ---------- */

function filtrar(){

  const q = document.getElementById("busca").value.toLowerCase().trim();

  const t = document.getElementById("fTipo").value;

  const es = document.getElementById("fEstagio").value;

  const al = document.getElementById("fAlerta").value;

  return derivadas().filter(e=>{

    if(t && e.tipo !== t) return false;

    if(es && String(e.estagio) !== es) return false;

    if(al === "1" && !e.alertas.length) return false;

    if(q){

      const alvo = [e.id,e.portaria,e.proposta,e.tipo,e.referencia_pt,e.objeto,e.situacao_fonte].join(" ").toLowerCase();

      if(!alvo.includes(q)) return false;

    }

    return true;

  });

}

function pintarTabela(){

  const lista = filtrar();

  const corpo = document.getElementById("corpo");

  if(!lista.length){

    corpo.innerHTML = `<tr><td colspan="8" style="padding:26px;text-align:center;color:var(--tinta-60)">Nenhuma emenda corresponde aos filtros. Ajuste a busca ou limpe os filtros.</td></tr>`;

    document.getElementById("totalFiltrado").textContent = brl(0);

    return;

  }

  corpo.innerHTML = lista.map(e=>{

    const d = e.diasPortaria;

    const grave = e.alertas.some(a=>a.g==="grave");

    return `<tr data-id="${e.id}" class="${selecionada===e.id?"sel":""}">

      <td>

        <span class="cod">${e.id}</span>

        ${grave?'<span class="badge b-risco" style="margin-left:6px">providência</span>':''}

        <div class="minitrilho">${DADOS.estagios.map(s=>`<i class="${e.estagio>s.id?"on":(e.estagio===s.id?"now":"")}"></i>`).join("")}</div>

      </td>

      <td>

        ${e.portaria}<br>

        <span style="font-size:11.5px;color:var(--tinta-60)">${dt(e.portaria_data)}</span>

        <span class="prop">${e.proposta}${e.conferir_proposta?' <span class="flagconf" title="Formato divergente — conferir no FNS">▲</span>':''}</span>

      </td>

      <td><span class="tipo">${e.tipo}</span><br><span style="font-size:11px;color:var(--tinta-60)">${e.referencia_pt}</span></td>

      <td class="dir valor-cel">${brl(e.valor)}

        ${e.temContra?`<span class="livre-cel">livre ${brl(e.valorLivre)}</span><span class="contra-cel">−${brl(e.valorContrapartida)} serviços</span>`:'<span class="livre-cel">integralmente livre</span>'}

      </td>

      <td><span style="font-size:12.5px">${rotuloEtapa(e.estagio)}</span><br><span style="font-size:11px;color:var(--tinta-60)">${DADOS.estagios[e.estagio-1].sistema}</span></td>

      <td><span class="badge ${classeSituacao(e)}">${e.estagio>=4?"recurso em conta":"aguarda FNS"}</span><br><span style="font-size:11px;color:var(--tinta-60)">fonte: ${e.situacao_fonte.toLowerCase()}</span></td>

      <td class="dir dias ${d>PARAM.diasAlertaSemOB && e.estagio<4?"alto":""}">${d}</td>

      <td class="dir num">${e.percentual_executado}%</td>

    </tr>`;

  }).join("");

  corpo.querySelectorAll("tr[data-id]").forEach(tr=>tr.addEventListener("click",()=>abrir(tr.dataset.id)));

  const somaV = lista.reduce((a,b)=>a+b.valor,0);

  const somaL = lista.reduce((a,b)=>a+b.valorLivre,0);

  document.getElementById("totalFiltrado").innerHTML = brl(somaV) + `<span class="livre-cel">livre ${brl(somaL)}</span>`;

}



/* ---------- Distribuições ---------- */

function pintarDistribuicoes(){

  const ds = derivadas();

  const total = ds.reduce((a,b)=>a+b.valor,0);

  const agrupar = (campo)=>{

    const m = new Map();

    ds.forEach(e=>{ const k=e[campo]; m.set(k,(m.get(k)||0)+e.valor); });

    return [...m.entries()].sort((a,b)=>b[1]-a[1]);

  };

  const render = (dados,alvo)=>{

    document.getElementById(alvo).innerHTML = dados.map(([k,v])=>`

      <div class="linha-dist">

        <div class="rot"><span>${k}</span><b>${brl(v)}</b></div>

        <div class="trilha"><i style="width:${v/total*100}%"></i></div>

      </div>`).join("");

  };

  render(agrupar("tipo"),"distTipo");

  render(agrupar("portaria"),"distPortaria");

}



/* ---------- Ficha lateral ---------- */

function abrir(id){

  const e = derivar(estado.find(x=>x.id===id));

  selecionada = id;

  document.getElementById("gavetaCod").textContent = e.id + " · " + e.tipo + " · " + e.referencia_pt;

  document.getElementById("gavetaTitulo").textContent = brl(e.valor);

  const idx = estado.findIndex(x=>x.id===id);



  document.getElementById("gavetaCorpo").innerHTML = `

    ${e.alertas.length?`<div class="aviso"><b>${e.alertas.length} providência${e.alertas.length>1?"s":""} em aberto</b>${e.alertas.map(a=>"• "+a.n).join("<br>")}</div>`:""}



    <div class="bloco" style="margin-top:18px">

      <h3>Origem do recurso</h3>

      <div class="pares">

        <div class="par"><div class="r">Portaria</div><div class="v">${e.portaria}</div></div>

        <div class="par"><div class="r">Publicação</div><div class="v num">${dt(e.portaria_data)}</div></div>

        <div class="par"><div class="r">Proposta / emenda</div><div class="v num" style="font-size:12.5px">${e.proposta}</div></div>

        <div class="par"><div class="r">Situação na fonte</div><div class="v">${e.situacao_fonte}</div></div>

        <div class="par"><div class="r">Entidade</div><div class="v">Santa Casa de Bagé</div></div>

        <div class="par"><div class="r">CNES</div><div class="v num">${e.cnes}</div></div>

      </div>

    </div>



    <div class="bloco">

      <h3>Tramitação</h3>

      <ul class="tram">

        ${DADOS.estagios.map(s=>`

          <li class="${e.estagio>s.id?"feito":(e.estagio===s.id?"feito atual":"")}">

            <button class="bola" data-etapa="${s.id}" type="button" title="Marcar como etapa atual">${s.id}</button>

            <div class="txt"><strong>${s.nome}</strong><span>${s.sistema}${e.estagio===s.id?" · etapa atual":""}</span></div>

          </li>`).join("")}

      </ul>

    </div>



    <div class="bloco">

      <h3>Controle interno</h3>

      <div class="campo"><label for="c-objeto">Objeto da emenda</label>

        <input id="c-objeto" type="text" value="${e.objeto||""}" placeholder="Ex.: equipamentos para UTI Neonatal"></div>

      <div class="campo"><label for="c-conta">Conta específica</label>

        <input id="c-conta" type="text" value="${e.conta_especifica||""}" placeholder="Banco / agência / conta"></div>

      <div class="campo"><label for="c-credito">Data do crédito (ordem bancária)</label>

        <input id="c-credito" type="date" value="${e.data_credito||""}"></div>

      <div class="campo"><label for="c-exec">Execução do objeto — <span class="num" id="rotExec">${e.percentual_executado}%</span> · ${brl(e.valorExecutado)}</label>

        <input id="c-exec" type="range" min="0" max="100" step="5" value="${e.percentual_executado}"></div>

      <div class="campo"><label for="c-obs">Observações</label>

        <textarea id="c-obs" placeholder="Registro de conferência, número de processo, pendências">${e.observacoes||""}</textarea></div>

    </div>



    ${e.temContra?`

    <div class="bloco">

      <h3>Contrapartida em serviços</h3>

      <div class="split mini" style="height:22px">

        <i class="livre" style="width:${(1-e.pctContra)*100}%">${brl(e.valorLivre)}</i>

        <i class="contra-fatia" style="width:${e.pctContra*100}%">${brl(e.valorContrapartida)}</i>

      </div>

      <div class="pares" style="margin-top:12px">

        <div class="par"><div class="r">Recurso livre (${((1-e.pctContra)*100).toFixed(0)}%)</div><div class="v num" style="color:var(--verde)">${brl(e.valorLivre)}</div></div>

        <div class="par"><div class="r">Contrapartida (${(e.pctContra*100).toFixed(0)}%)</div><div class="v num" style="color:var(--ambar)">${brl(e.valorContrapartida)}</div></div>

        <div class="par"><div class="r">Serviços comprovados</div><div class="v num">${brl(e.contraComprovada)}</div></div>

        <div class="par"><div class="r">Ainda a comprovar</div><div class="v num">${brl(e.contraPendente)}</div></div>

      </div>

      <div class="campo" style="margin-top:12px"><label for="c-cppct">Percentual da contrapartida</label>

        <input id="c-cppct" type="number" min="0" max="100" step="1" value="${(e.pctContra*100).toFixed(0)}"></div>

      <div class="campo"><label for="c-cpcomp">Serviços já comprovados — <span class="num" id="rotCP">${e.contrapartida_comprovada_pct||0}%</span></label>

        <input id="c-cpcomp" type="range" min="0" max="100" step="5" value="${e.contrapartida_comprovada_pct||0}"></div>

    </div>`:`

    <div class="bloco">

      <h3>Contrapartida em serviços</h3>

      <p style="font-size:12.5px;color:var(--tinta-60);margin:0 0 10px">Emenda ${e.tipo.toLowerCase()} — sem contrapartida pactuada. O valor é integralmente livre.</p>

      <div class="campo"><label for="c-cppct">Percentual da contrapartida</label>

        <input id="c-cppct" type="number" min="0" max="100" step="1" value="0"></div>

      <input id="c-cpcomp" type="hidden" value="0">

    </div>`}



    <div class="bloco">

      <button class="btn solido" id="btnSalvar" type="button">Salvar alterações</button>

    </div>



    <div class="bloco">

      <h3>Prazos</h3>

      <div class="pares">

        <div class="par"><div class="r">Dias desde a portaria</div><div class="v num">${e.diasPortaria}</div></div>

        <div class="par"><div class="r">Dias desde o crédito</div><div class="v num">${e.diasCredito ?? "—"}</div></div>

        <div class="par"><div class="r">Prazo de aplicação</div><div class="v num">${dt(e.prazoExecucao)}</div></div>

        <div class="par"><div class="r">Saldo em conta</div><div class="v num">${brl(e.saldoConta)}</div></div>

        <div class="par"><div class="r">Livre em conta</div><div class="v num" style="color:var(--verde)">${brl(Math.max(0, e.saldoConta - e.contraPendente))}</div></div>

        <div class="par"><div class="r">Reservado à contrapartida</div><div class="v num" style="color:var(--ambar)">${brl(e.contraPendente)}</div></div>

      </div>

    </div>



    <div class="bloco">

      <h3>Documentação da prestação de contas</h3>

      ${["Portaria de habilitação arquivada","Extrato da conta específica","Processo de compra ou contratação","Notas fiscais vinculadas à emenda","Comprovantes de pagamento","Termo de recebimento do bem ou serviço","Relatório de execução do objeto no FNS","Registro patrimonial do bem"]

        .map((t,i)=>`<label class="check"><input type="checkbox" data-doc="${i}"><span>${t}</span></label>`).join("")}

    </div>

  `;



  const corpo = document.getElementById("gavetaCorpo");

  corpo.querySelectorAll("[data-etapa]").forEach(b=>b.addEventListener("click",()=>{

    estado[idx].estagio = Number(b.dataset.etapa);

    render(); abrir(id);

  }));

  const rng = corpo.querySelector("#c-exec");

  rng.addEventListener("input",()=>{ corpo.querySelector("#rotExec").textContent = rng.value+"%"; });

  const rngCP = corpo.querySelector("#c-cpcomp");

  if(rngCP && rngCP.type === "range"){

    rngCP.addEventListener("input",()=>{ corpo.querySelector("#rotCP").textContent = rngCP.value+"%"; });

  }

  corpo.querySelector("#btnSalvar").addEventListener("click",()=>{

    estado[idx].objeto = corpo.querySelector("#c-objeto").value.trim();

    estado[idx].conta_especifica = corpo.querySelector("#c-conta").value.trim();

    estado[idx].data_credito = corpo.querySelector("#c-credito").value;

    estado[idx].percentual_executado = Number(rng.value);

    estado[idx].observacoes = corpo.querySelector("#c-obs").value.trim();

    const cp = Number(corpo.querySelector("#c-cppct").value);

    estado[idx].contrapartida_pct = isNaN(cp) ? 0 : Math.min(100,Math.max(0,cp))/100;

    estado[idx].contrapartida_comprovada_pct = Number(corpo.querySelector("#c-cpcomp").value)||0;

    render(); abrir(id);

  });



  document.getElementById("gaveta").classList.add("ativa");

  document.getElementById("veu").classList.add("ativo");

  document.getElementById("gaveta").focus();

  pintarTabela();

}

function fechar(){

  document.getElementById("gaveta").classList.remove("ativa");

  document.getElementById("veu").classList.remove("ativo");

  selecionada = null; pintarTabela();

}



/* ---------- Exportações ---------- */

function baixar(nome,conteudo,tipo){

  const a = document.createElement("a");

  a.href = URL.createObjectURL(new Blob([conteudo],{type:tipo}));

  a.download = nome; a.click(); URL.revokeObjectURL(a.href);

}

function exportarCSV(){

  const cab = ["Emenda","CNES","Portaria","Publicacao","Proposta","Valor","% contrapartida","Contrapartida (R$)","Recurso livre (R$)","% contrapartida comprovada","Tipo","Referencia","Situacao fonte","Etapa","Objeto","Conta especifica","Data credito","% executado","Observacoes"];

  const n = v => v.toFixed(2).replace(".",",");

  const linhas = derivadas().map(e=>[e.id,e.cnes,e.portaria,e.portaria_data,e.proposta,n(e.valor),(e.pctContra*100).toFixed(0),n(e.valorContrapartida),n(e.valorLivre),e.contrapartida_comprovada_pct||0,e.tipo,e.referencia_pt,e.situacao_fonte,rotuloEtapa(e.estagio),e.objeto,e.conta_especifica,e.data_credito,e.percentual_executado,e.observacoes]);

  const csv = "\uFEFF" + [cab,...linhas].map(l=>l.map(c=>`"${String(c??"").replace(/"/g,'""')}"`).join(";")).join("\r\n");

  baixar("emendas_scbage_"+DADOS.meta.data_referencia+".csv",csv,"text/csv;charset=utf-8");

}

function exportarJSON(){

  const saida = {...DADOS, meta:{...DADOS.meta, data_referencia:DADOS.meta.data_referencia, salvo_em:new Date().toISOString()}, emendas:estado};

  baixar("emendas_scbage_posicao.json",JSON.stringify(saida,null,2),"application/json");

}



/* ---------- Inicialização ---------- */

function preencherFiltros(){

  const tipos = [...new Set(DADOS.emendas.map(e=>e.tipo))].sort();

  document.getElementById("fTipo").insertAdjacentHTML("beforeend",tipos.map(t=>`<option value="${t}">${t}</option>`).join(""));

  document.getElementById("fEstagio").insertAdjacentHTML("beforeend",DADOS.estagios.map(s=>`<option value="${s.id}">${s.id}. ${s.nome}</option>`).join(""));

}

function pintarNotas(){

  document.getElementById("notas").innerHTML = DADOS.meta.observacoes_de_conferencia.map(o=>`<li style="margin-bottom:6px">${o}</li>`).join("");

}

function render(){ pintarEsteira(); pintarKPIs(); pintarContrapartida(); pintarAlertas(); pintarTabela(); pintarDistribuicoes(); }



document.getElementById("dataRef").textContent = dt(DADOS.meta.data_referencia);

preencherFiltros(); pintarNotas(); render();



["busca","fTipo","fEstagio","fAlerta"].forEach(id=>{

  document.getElementById(id).addEventListener("input",pintarTabela);

  document.getElementById(id).addEventListener("change",pintarTabela);

});

document.getElementById("btnLimpar").addEventListener("click",()=>{

  document.getElementById("busca").value="";

  ["fTipo","fEstagio","fAlerta"].forEach(id=>document.getElementById(id).value="");

  pintarTabela();

});

document.getElementById("btnCSV").addEventListener("click",exportarCSV);

document.getElementById("btnJSON").addEventListener("click",exportarJSON);

document.getElementById("btnImport").addEventListener("click",()=>document.getElementById("arqJSON").click());

document.getElementById("arqJSON").addEventListener("change",ev=>{

  const f = ev.target.files[0]; if(!f) return;

  const r = new FileReader();

  r.onload = () => {

    try{

      const j = JSON.parse(r.result);

      if(!Array.isArray(j.emendas)) throw new Error("estrutura");

      emendasEstado = j.emendas; estado = emendasEstado; render();

    }catch(err){

      alert("O arquivo não tem o formato esperado. Use um JSON salvo por este painel.");

    }

  };

  r.readAsText(f);

  ev.target.value = "";

});

document.getElementById("btnImprimir").addEventListener("click",()=>window.print());

document.getElementById("btnFechar").addEventListener("click",fechar);

document.getElementById("veu").addEventListener("click",fechar);

document.addEventListener("keydown",e=>{ if(e.key==="Escape") fechar(); });


  
  emendasInitialized = true;
}
window.initEmendasTab = initEmendasTab;



// --- SIGTAP GLOBAL STATE & LOGIC ---

const SIGTAP_GROUPS = [
  {
    cod: "01",
    nome: "Ações de Promoção e Prevenção em Saúde",
    desc: "Procedimentos voltados para ações coletivas ou individuais de prevenção de doenças e promoção da saúde na comunidade, como campanhas de vacinação, ações de educação em saúde e vigilância epidemiológica.",
    relacao: "Impacto primário em ações de saúde preventiva e campanhas de vacinação coordenadas pelo município.",
    detalhes: "Compreende procedimentos de promoção de hábitos saudáveis, imunizações do calendário oficial e triagens populacionais preventivas."
  },
  {
    cod: "02",
    nome: "Procedimentos com Finalidade Diagnóstica",
    desc: "Exames laboratoriais, de imagem, biópsias e outros métodos complementares para diagnóstico e monitoramento clínico de patologias.",
    relacao: "Relaciona-se diretamente com o faturamento de SADT e com o programa PMAE Crédito Financeiro (produção de exames de imagem valorizados).",
    detalhes: "Inclui ressonância magnética, tomografia computadorizada, radiologia, ultrassonografia, patologia clínica e endoscopia diagnóstica."
  },
  {
    cod: "03",
    nome: "Procedimentos Clínicos",
    desc: "Consultas especializadas, diárias de internação hospitalar, atendimentos de urgência/emergência e procedimentos clínicos ambulatoriais.",
    relacao: "Base para as metas físicas reguladas do SIA/AIH e contratualização dos leitos de enfermaria e UTI da Santa Casa de Bagé.",
    detalhes: "Compreende diárias de UTI Adulto/Neonatal, consultas médicas de atenção especializada e tratamentos clínicos de especialidades médicas."
  },
  {
    cod: "04",
    nome: "Procedimentos Cirúrgicos",
    desc: "Intervenções operatórias de pequeno, médio e grande porte, realizadas em caráter ambulatorial ou sob regime de internação hospitalar.",
    relacao: "Principal componente de faturamento do PMAE Componente Cirurgias (Hab. 29.02) e das cirurgias eletivas pactuadas no teto físico-financeiro.",
    detalhes: "Compreende o rol de pequenas cirurgias ambulatoriais de pele/mucosa até cirurgias de alta complexidade ortopédica, cardíaca e oncológica."
  },
  {
    cod: "05",
    nome: "Transplantes de Órgãos, Tecidos e Células",
    desc: "Procedimentos de captação de órgãos, seleção de doadores e transplantes terapêuticos de tecidos (córnea, osso, pele) e órgãos sólidos.",
    relacao: "Faturamento extra-teto financiado integralmente pelo Fundo de Ações Estratégicas e Compensação (FAEC).",
    detalhes: "Abrange transplantes de córnea, medula óssea, captação de órgãos e exames de histocompatibilidade para o receptor."
  },
  {
    cod: "06",
    nome: "Medicamentos",
    desc: "Disponibilização e infusão de fármacos especiais, incluindo quimioterapia do câncer, antirretrovirais e medicamentos de alto custo.",
    relacao: "Vinculado ao custeio de tratamentos oncológicos na UNACON da Santa Casa de Bagé e faturamento de quimioterápicos.",
    detalhes: "Compreende os esquemas terapêuticos oncológicos e medicamentos de dispensação excepcional de fornecimento obrigatório."
  },
  {
    cod: "07",
    nome: "Órteses, Próteses e Materiais Especiais",
    desc: "Materiais implantáveis ou de suporte (OPME) necessários para a realização de atos cirúrgicos ou reabilitação física do paciente.",
    relacao: "Incidência direta em cirurgias de alta complexidade (Traumatologia, Cardiologia Intervencionista) com impacto de glosas se não pré-autorizados.",
    detalhes: "Abrange próteses de quadril, joelho, marca-passos, stents coronarianos, órteses ortopédicas e insumos cirúrgicos especiais de alto valor."
  },
  {
    cod: "08",
    nome: "Ações Complementares da Atenção à Saúde",
    desc: "Ações de suporte e serviços auxiliares vinculados a internações e tratamentos, como assistência multiprofissional e serviços de apoio.",
    relacao: "Registros complementares em laudos e autorizações de faturamento de internações para caracterização de cuidados continuados.",
    detalhes: "Inclui suporte de equipe multiprofissional de reabilitação, acompanhamento domiciliar e cuidados paliativos."
  },
  {
    cod: "09",
    nome: "Procedimentos para Ofertas de Cuidados Integrados",
    desc: "Procedimentos regulados do Programa de Incentivos Assistenciais (PMAE) para a oferta de linhas de cuidado integradas por especialidade.",
    relacao: "GRUPO ESTRATÉGICO (PMAE OCIs - Hab. 38.01). Centraliza o faturamento das 36 Ofertas de Cuidados Integrados contratualizadas.",
    detalhes: "Faturamento via FAEC das linhas reguladas de Oftalmologia, Otorrinolaringologia, Cardiologia, Ortopedia e Oncologia.",
    isStrategic: true,
    subgrupos: [
      {
        cod: "01",
        nome: "Atenção em Oncologia",
        forma: "01 - Ofertas de Cuidados Integrados em Oncologia",
        desc: "Acompanhamento especializado de pacientes oncológicos de forma integrada.",
        exemplo: "03.01.01.007-2 Consulta e exames de estadiamento."
      },
      {
        cod: "02",
        nome: "Atenção em Cardiologia",
        forma: "01 - Ofertas de Cuidados Integrados em Cardiologia",
        desc: "Simulações e exames assistenciais para viabilidade do ambulatório especializado.",
        exemplo: "02.05.01.003-2 Ecocardiografia transtorácica."
      },
      {
        cod: "03",
        nome: "Atenção em Ortopedia",
        forma: "01 - Ofertas de Cuidados Integrados em Ortopedia",
        desc: "Cuidados integrados ortopédicos ambulatoriais.",
        exemplo: "03.01.01.030-7 Teleconsulta e reabilitação física."
      },
      {
        cod: "04",
        nome: "Atenção em Otorrinolaringologia",
        forma: "01 - Ofertas de Cuidados Integrados em Otorrinolaringologia",
        desc: "Investigação diagnóstica de distúrbios da audição e equilíbrio.",
        exemplo: "02.11.02.003-6 Exames de impedanciometria e audiometria."
      },
      {
        cod: "05",
        nome: "Atenção em Oftalmologia",
        forma: "01 - Ofertas de Cuidados Integrados em Oftalmologia",
        desc: "Rol de consultas e exames de apoio diagnóstico ocular.",
        exemplo: "02.11.06.002-0 Tonometria de sopro."
      }
    ]
  }
];

let sigtapSelectedGroup = "09";
let sigtapSelectedSubgroup = "02"; // Cardiologia by default

function renderSigtapGroupsList() {
  const container = document.getElementById("sigtapGroupsList");
  if (!container) return;
  
  container.innerHTML = SIGTAP_GROUPS.map(g => {
    const isSel = g.cod === sigtapSelectedGroup;
    const isStrat = g.isStrategic;
    const cls = `group-item ${isSel ? 'active' : ''} ${isStrat ? 'strategic-item' : ''}`;
    return `
      <div class="${cls}" data-code="${g.cod}">
        <span class="group-item-title">${g.nome}</span>
        <span class="group-item-code">Grupo ${g.cod}</span>
      </div>
    `;
  }).join("");
  
  container.querySelectorAll(".group-item").forEach(item => {
    item.addEventListener("click", () => {
      sigtapSelectedGroup = item.dataset.code;
      renderSigtapGroupsList();
      renderSigtapGroupDetails();
    });
  });
}

function renderSigtapGroupDetails() {
  const container = document.getElementById("sigtapGroupDetails");
  if (!container) return;
  
  const g = SIGTAP_GROUPS.find(x => x.cod === sigtapSelectedGroup);
  if (!g) return;
  
  if (g.isStrategic) {
    container.innerHTML = `
      <div class="details-header">
        <span class="badge-group strategic"><i data-lucide="shield-check" style="width:14px;height:14px;display:inline;"></i> GRUPO ESTRATÉGICO DO PMAE</span>
        <h3 style="margin-top:0.5rem;">Grupo ${g.cod} — ${g.nome}</h3>
      </div>
      <div class="details-content">
        <p><strong>Descrição:</strong> ${g.desc}</p>
        <p><strong>Relação Estratégica:</strong> ${g.relacao}</p>
        
        <div class="strategic-table-card">
          <div class="strategic-table-title" style="color: var(--warning);">
            <i data-lucide="table"></i> SUBGRUPOS & FORMAS DE ORGANIZAÇÃO (PORTARIA PMAE OCI)
          </div>
          <div style="padding: 1.25rem;">
            <div class="subgroup-tabs" id="sigtapSubgroupTabs">
              <!-- JS Populated Subgroup Tabs -->
            </div>
            <div class="card" id="sigtapSubgroupDetailCard" style="padding: 1rem; background: var(--bg-card-hover); border-color: var(--border-color);">
              <!-- JS Populated Subgroup Content -->
            </div>
          </div>
        </div>
      </div>
    `;
    
    renderSigtapSubgroups();
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  } else {
    container.innerHTML = `
      <div class="details-header">
        <span class="badge-group">GRUPO PADRÃO</span>
        <h3 style="margin-top:0.5rem;">Grupo ${g.cod} — ${g.nome}</h3>
      </div>
      <div class="details-content">
        <p><strong>Descrição:</strong> ${g.desc}</p>
        <p><strong>Relação Estratégica:</strong> ${g.relacao}</p>
        <p><strong>Componentes do Grupo:</strong> ${g.detalhes}</p>
      </div>
    `;
  }
}

function renderSigtapSubgroups() {
  const tabsContainer = document.getElementById("sigtapSubgroupTabs");
  const detailContainer = document.getElementById("sigtapSubgroupDetailCard");
  const g = SIGTAP_GROUPS.find(x => x.cod === "09");
  if (!tabsContainer || !detailContainer || !g) return;
  
  // Render tabs
  tabsContainer.innerHTML = g.subgrupos.map(s => {
    const isSel = s.cod === sigtapSelectedSubgroup;
    return `
      <button class="subgroup-tab ${isSel ? 'active strategic' : ''}" data-code="${s.cod}" type="button">
        Subgrupo ${s.cod} · ${s.nome.replace("Atenção em ", "")}
      </button>
    `;
  }).join("");
  
  // Render details for active subgroup
  const s = g.subgrupos.find(x => x.cod === sigtapSelectedSubgroup);
  if (s) {
    detailContainer.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:0.5rem;">
        <div><strong>Subgrupo:</strong> 09.${s.cod} — ${s.nome}</div>
        <div><strong>Forma de Organização:</strong> 09.${s.cod}.01 — ${s.forma}</div>
        <div style="margin-top:0.5rem; font-size:0.85rem; color:var(--text-muted);">
          <strong>Objetivo Assistencial:</strong> ${s.desc}
        </div>
        <div style="font-size:0.85rem; color:var(--text-muted); background:var(--bg-card); padding:0.5rem; border-radius:4px; border:1px solid var(--border-color); margin-top:0.5rem;">
          <span style="color: var(--warning); font-weight:700;">Exemplo de Procedimento:</span> <code>${s.exemplo}</code>
        </div>
      </div>
    `;
  }
  
  tabsContainer.querySelectorAll(".subgroup-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      sigtapSelectedSubgroup = btn.dataset.code;
      renderSigtapSubgroups();
    });
  });
}

function initSigtapTab() {
  const checkEl = document.getElementById("sigtapGroupsList");
  if (!checkEl) return;
  
  console.log("Initializing SIGTAP Tab...");
  
  renderSigtapGroupsList();
  renderSigtapGroupDetails();
}
window.initSigtapTab = initSigtapTab;



// Trigger initApp after full script evaluation to prevent TDZ
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
