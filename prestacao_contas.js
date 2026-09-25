// ============================================================================
// MÓDULO: PRESTAÇÃO DE CONTAS (BASEADO NO CONSÓRCIO CISA)
// Sala de Situação - Santa Casa de Caridade de Bagé
// ============================================================================

window.currentPrestacaoKey = 'oftalmologia';
window.prestacaoViewMode = 'viabilidade';
window.prestacaoSelectedMonth = '06';

function setPcViewMode(mode) {
  window.prestacaoViewMode = mode;
  const btnViab = document.getElementById('btn-pc-view-viabilidade');
  const btnPort = document.getElementById('btn-pc-view-portaria');

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
    renderPrestacaoViabilidade(window.currentPrestacaoKey || 'todas');
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
    renderPrestacaoPortaria(window.currentPrestacaoKey || 'todas');
  }
}
window.setPcViewMode = setPcViewMode;

function renderPrestacaoSidebar() {
  const container = document.getElementById('pcSidebarNav');
  if (!container) return;

  let html = '';
  for (const [key, item] of Object.entries(SERVICOS_CISA)) {
    const isActive = (key === (window.currentPrestacaoKey || 'todas')) ? 'active' : '';
    const iconName = item.icon || (key === 'todas' ? 'layers' : 'stethoscope');
    const badgeText = item.badge || (key === 'todas' ? 'TOTAL' : 'CISA');
    const badgeBg = key === 'todas' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(37, 99, 235, 0.12)';
    const badgeColor = key === 'todas' ? '#059669' : '#2563eb';
    const iconColor = key === 'todas' ? '#10b981' : '#2563eb';

    html += `
      <button class="pill-btn ${isActive}" data-key="${key}" style="width: 100%; text-align: left; padding: 0.55rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.8rem; display: flex; align-items: center; justify-content: space-between;" onclick="switchPrestacaoServico('${key}', this)">
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
window.renderPrestacaoSidebar = renderPrestacaoSidebar;

function switchPrestacaoServico(key, btnEl) {
  window.currentPrestacaoKey = key;
  document.querySelectorAll('#pcSidebarNav .pill-btn').forEach(btn => {
    if (btn.getAttribute('data-key') === key) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderPrestacaoServico(key);
}
window.switchPrestacaoServico = switchPrestacaoServico;

function renderPrestacaoServico(key) {
  if (!key) key = window.currentPrestacaoKey || 'todas';
  window.currentPrestacaoKey = key;
  if (window.prestacaoViewMode === 'portaria') {
    renderPrestacaoPortaria(key);
  } else {
    renderPrestacaoViabilidade(key);
  }
}
window.renderPrestacaoServico = renderPrestacaoServico;

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

var PC_MESES = (typeof PC_MESES !== 'undefined') ? PC_MESES : [
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

window.prestacaoSelectedMonth = window.prestacaoSelectedMonth || '06';

function getPrestacaoMonthlyStore(monthId) {
  if (!window.prestacaoMonthlyStore) {
    try {
      const saved = localStorage.getItem('prestacao_monthly_store_2026_v12');
      if (saved) window.prestacaoMonthlyStore = JSON.parse(saved);
    } catch (e) {}
    if (!window.prestacaoMonthlyStore || typeof window.prestacaoMonthlyStore !== 'object') {
      window.prestacaoMonthlyStore = {};
    }
  }

  if (!monthId) monthId = window.prestacaoSelectedMonth || '06';

  if (!window.prestacaoMonthlyStore[monthId] || !Array.isArray(window.prestacaoMonthlyStore[monthId].procsSusGaucho)) {
    const isAgosto = (monthId === '08');
    const isJunhoOrJulho = (monthId === '06' || monthId === '07');
    const cisaStore = (typeof getCisaMonthlyStore === 'function') ? getCisaMonthlyStore(monthId) : (window.cisaMonthlyStore && window.cisaMonthlyStore[monthId]);
    const srcRegra = (cisaStore && cisaStore.regraAtiva) ? cisaStore.regraAtiva : 'rateio8020';

    // Receitas da Prestação de Contas:
    // 1. SUS Gaúcho - Ambulatório Estratégico Oftalmologia (Portaria SES/RS nº 611/2026) -> R$ 81.276,00 em Junho e Julho
    // 2. Produção CISA - Oftalmologia (Procedimentos Pactuados) -> R$ 0,00 em Junho e Julho; R$ 17.536,44 em Agosto
    const baseReceitas = [
      {
        id: 'sus_gaucho',
        rubrica: 'SUS Gaúcho - Ambulatório Estratégico Oftalmologia',
        portaria: 'Portaria SES/RS nº 611/2026 (Mutirão de Especialidades)',
        natureza: 'Custeio Ambulatorial Especializado',
        origemSub: 'Fundo Estadual de Saúde (FES/RS)',
        icon: 'sparkles',
        status: isJunhoOrJulho ? 'Recebido FES' : 'Não se aplica',
        qtd: 1,
        val: isJunhoOrJulho ? 81276.00 : 0.00
      },
      {
        id: 'cisa',
        rubrica: 'Produção CISA - Oftalmologia',
        portaria: 'Procedimentos Ambulatoriais e Diagnósticos Especializados',
        natureza: 'Consórcio Intermunicipal de Saúde (CISA)',
        origemSub: 'Receita Própria Pactuada Consórcio',
        icon: 'building-2',
        status: isAgosto ? 'Recebido FES' : 'Não se aplica',
        qtd: 1,
        val: isAgosto ? 17536.44 : 0.00
      }
    ];

    // Custos operacionais do ambulatório rateados proporcionalmente (padrão com quantidades e rateios ativos)
    const baseCustos = window.cisaSimState.custos.map(c => ({
      especialidade: c.especialidade || 'Oftalmologia',
      item: c.item,
      rateio: (c.rateio !== undefined && c.rateio !== null) ? c.rateio : 100,
      qtd: (c.qtd !== undefined && c.qtd !== null) ? c.qtd : 1,
      val: (c.val !== undefined && c.val !== null) ? c.val : 0,
      classificacao: c.classificacao || 'Pessoal'
    }));

    window.prestacaoMonthlyStore[monthId] = {
      procs: [],
      procsSusGaucho: JSON.parse(JSON.stringify(baseReceitas)),
      custos: JSON.parse(JSON.stringify(baseCustos)),
      regraAtiva: srcRegra
    };
  }

  // Garantir existência e integridade de procsSusGaucho se faltar alguma das 2 linhas
  const mData = window.prestacaoMonthlyStore[monthId];
  if (!Array.isArray(mData.procsSusGaucho) || mData.procsSusGaucho.length < 2) {
    const isAgosto = (monthId === '08');
    const isJunhoOrJulho = (monthId === '06' || monthId === '07');
    mData.procsSusGaucho = [
      {
        id: 'sus_gaucho',
        rubrica: 'SUS Gaúcho - Ambulatório Estratégico Oftalmologia',
        portaria: 'Portaria SES/RS nº 611/2026 (Mutirão de Especialidades)',
        natureza: 'Custeio Ambulatorial Especializado',
        origemSub: 'Fundo Estadual de Saúde (FES/RS)',
        icon: 'sparkles',
        status: isJunhoOrJulho ? 'Recebido FES' : 'Não se aplica',
        qtd: 1,
        val: isJunhoOrJulho ? 81276.00 : 0.00
      },
      {
        id: 'cisa',
        rubrica: 'Produção CISA - Oftalmologia',
        portaria: 'Procedimentos Ambulatoriais e Diagnósticos Especializados',
        natureza: 'Consórcio Intermunicipal de Saúde (CISA)',
        origemSub: 'Receita Própria Pactuada Consórcio',
        icon: 'building-2',
        status: isAgosto ? 'Recebido FES' : 'Não se aplica',
        qtd: 1,
        val: isAgosto ? 17536.44 : 0.00
      }
    ];
  }

  // Garantir integridade de custos se todas as quantidades estiverem zeradas
  const totalQtdCustos = (mData.custos || []).reduce((acc, cur) => acc + (parseFloat(cur.qtd) || 0), 0);
  if (!Array.isArray(mData.custos) || mData.custos.length === 0 || totalQtdCustos === 0) {
    mData.custos = window.cisaSimState.custos.map(c => ({
      especialidade: c.especialidade || 'Oftalmologia',
      item: c.item,
      rateio: (c.rateio !== undefined && c.rateio !== null) ? c.rateio : 100,
      qtd: (c.qtd !== undefined && c.qtd !== null) ? c.qtd : 1,
      val: (c.val !== undefined && c.val !== null) ? c.val : 0,
      classificacao: c.classificacao || 'Pessoal'
    }));
  }

  return window.prestacaoMonthlyStore[monthId];
}

function savePrestacaoMonthlyStore() {
  try {
    if (window.prestacaoMonthlyStore) {
      localStorage.setItem('prestacao_monthly_store_2026_v12', JSON.stringify(window.prestacaoMonthlyStore));
    }
  } catch (e) {}
}
function getPrestacaoDefaultState() {
  return JSON.parse(JSON.stringify(window.cisaSimState));
}

// ----------------------------------------------------------------------------
// 1. ESTUDO DE VIABILIDADE FINANCEIRA NATIVO (ANTIGRAVITY DASHBOARD)
// ----------------------------------------------------------------------------
function renderPrestacaoViabilidade(key) {
  if (!key) key = window.currentPrestacaoKey || 'todas';
  window.currentPrestacaoKey = key;
  const container = document.getElementById('pcMainContent');
  if (!container) return;

  const curMonth = window.prestacaoSelectedMonth || '08';
  const curMonthObj = PC_MESES.find(m => m.id === curMonth) || PC_MESES[7];
  const monthData = getPrestacaoMonthlyStore(curMonth);

  if (!window.activePrestacaoSim) {
    window.activePrestacaoSim = getPrestacaoDefaultState();
  }
  const state = window.activePrestacaoSim;
  state.procs = monthData.procs;
  state.procsSusGaucho = monthData.procsSusGaucho || [];
  state.custos = monthData.custos;
  state.regraAtiva = monthData.regraAtiva || 'rateio8020';
  const isTodas = (key === 'todas');

  container.innerHTML = `
    <div id="pcNativeDashboard" style="display: flex; flex-direction: column; gap: 1.5rem;">
      
      <!-- 1. CABEÇALHO EXECUTIVO DO SERVIÇO CISA -->
      <div class="card" style="padding: 1.5rem 1.75rem; border-left: 5px solid ${isTodas ? '#10b981' : '#2563eb'}; background: linear-gradient(135deg, var(--bg-card) 0%, ${isTodas ? 'rgba(16, 185, 129, 0.04)' : 'rgba(37, 99, 235, 0.04)'} 100%);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div style="width: 58px; height: 58px; border-radius: 12px; overflow: hidden; border: 1.5px solid rgba(16, 185, 129, 0.35); background: #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06); flex-shrink: 0; padding: 2px;">
              <img src="logo_hbp.jpg" alt="Hospital Bom Pastor - Santo Augusto" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <div style="margin-left: 0.25rem;">
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.35rem;">
                <span class="badge-sus" style="background: rgba(16, 185, 129, 0.12); color: #059669; font-size: 0.68rem; font-weight: 800; padding: 0.25rem 0.6rem; border-radius: 99px; display: inline-flex; align-items: center; gap: 4px;">
                  <i data-lucide="building-2" style="width: 11px; height: 11px;"></i> HOSPITAL BOM PASTOR
                </span>
                <span class="badge-sus" style="background: rgba(37, 99, 235, 0.12); color: #2563eb; font-size: 0.68rem; font-weight: 800; padding: 0.25rem 0.6rem; border-radius: 99px;">
                  CONTROLE DE FATURAMENTO
                </span>
                <span class="badge-sus" style="background: rgba(245, 158, 11, 0.12); color: #b45309; font-size: 0.68rem; font-weight: 800; padding: 0.25rem 0.6rem; border-radius: 99px;">
                  TODOS OS PROGRAMAS
                </span>
              </div>
              <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--text-title); margin: 0; line-height: 1.2;">
                ${isTodas ? 'Prestação de Contas e Controle de Faturamento Consolidado' : 'Prestação de Contas e Controle de Faturamento — Ambulatório de Oftalmologia'}
              </h2>
              <div style="font-size: 0.84rem; color: var(--text-muted); margin-top: 0.3rem;">
                ${isTodas ? 'Painel Geral de Controle de Recebimentos e Pagamentos de Todas as Especialidades · Hospital Bom Pastor' : 'Controle Geral de Recebimentos, Faturamento e Pagamentos da Oftalmologia · Integração de Programas (SUS Gaúcho & CISA)'}
              </div>
            </div>
          </div>

          <!-- Ações Rápidas -->
          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center;">
            <button class="btn-primary" id="btnPcAddProcTop" style="background: ${isTodas ? '#10b981' : '#2563eb'}; border-color: ${isTodas ? '#10b981' : '#2563eb'}; font-size: 0.82rem; padding: 0.48rem 0.95rem; border-radius: 6px; box-shadow: 0 2px 6px ${isTodas ? 'rgba(16,185,129,0.25)' : 'rgba(37,99,235,0.25)'}; display: inline-flex; align-items: center; gap: 6px; font-weight: 700; cursor: pointer;">
              <i data-lucide="plus-circle" style="width: 15px; height: 15px;"></i> Novo Lançamento
            </button>
            <button type="button" id="btnExportPcCustosPDF" onclick="exportPrestacaoCustosPDF()" class="btn-cisa-pdf-export" style="background: #dc2626; border: 1px solid #b91c1c; color: #ffffff; font-weight: 700; font-size: 0.82rem; padding: 0.48rem 1rem; border-radius: 6px; display: inline-flex; align-items: center; gap: 7px; box-shadow: 0 2px 6px rgba(220, 38, 38, 0.25); cursor: pointer; transition: all 0.2s;" title="Gerar e imprimir Relatório Oficial Completo de Prestação de Contas em PDF">
              <i data-lucide="file-text" style="width: 16px; height: 16px;"></i>
              <span>Relatório em PDF</span>
            </button>
            <button class="btn-icon" id="btnPcExportCsvTop" title="Exportar CSV" style="border-radius: 6px;">
              <i data-lucide="download" style="width: 16px; height: 16px;"></i>
            </button>
            <button class="btn-icon" id="btnPcResetTop" title="Restaurar Padrões" style="border-radius: 6px; color: var(--danger);">
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
            <div class="kpi-value" id="kpiPcReceita" style="color: #2563eb; font-size: 1.85rem; margin: 0.65rem 0 0.25rem 0;">
              Aguardando valores
            </div>
          </div>
          <div style="margin-top: 1.25rem; padding-top: 0.5rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.75rem;">
            <span style="color: var(--text-muted);">${isTodas ? 'Projeção Anual Consolidada:' : 'Projeção Anual:'}</span>
            <strong id="kpiPcReceitaAno" style="color: var(--text-title); font-weight: 800;">Conforme demanda mensal</strong>
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
            <div class="kpi-value" id="kpiPcDespesa" style="color: #dc2626; font-size: 1.85rem; margin: 0.65rem 0 0.25rem 0;">
              R$ 0,00
            </div>
          </div>
          <div style="margin-top: 1.25rem; padding-top: 0.5rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.75rem;">
            <span style="color: var(--text-muted);">${isTodas ? 'Custo Anual Consolidado:' : 'Custo Anual Total:'}</span>
            <strong id="kpiPcDespesaAno" style="color: var(--text-title); font-weight: 800;">R$ 0,00</strong>
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
            <div class="kpi-value" id="kpiPcResultado" style="color: #059669; font-size: 1.85rem; margin: 0.65rem 0 0.25rem 0;">
              Aguardando valores
            </div>
            <div class="kpi-subtext" style="color: var(--text-muted); font-size: 0.78rem;">
              <span>Margem Líquida: <strong id="kpiPcMargemTxt" style="color: #059669; font-weight: 800;">77,8%</strong></span>
              <span style="margin: 0 4px;">•</span>
              <span>Break-Even: <strong id="kpiPcBreakeven" style="color: var(--text-title); font-weight: 800;">22,2%</strong></span>
            </div>
          </div>
          <div style="margin-top: 0.75rem; padding-top: 0.5rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.75rem;">
            <span style="color: var(--text-muted);">${isTodas ? 'Resultado Anual do Programa:' : 'Resultado Anual Líquido:'}</span>
            <strong id="kpiPcResultadoAno" style="color: #059669; font-weight: 800;">Aguardando valores</strong>
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
                Controle Mensal de Faturamento & Repasses · Exercício 2026
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">
                Selecione o mês de competência para acompanhar receitas, custos operacionais e apurar a prestação de contas dos prestadores
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span class="badge" id="pcMonthKpiBadge" style="background: ${isTodas ? 'rgba(16,185,129,0.12)' : 'rgba(37,99,235,0.1)'}; color: ${isTodas ? '#059669' : '#2563eb'}; font-weight: 800; font-size: 0.78rem; padding: 0.35rem 0.75rem; border-radius: 99px; border: 1px solid ${isTodas ? 'rgba(16,185,129,0.25)' : 'rgba(37,99,235,0.2)'}; display: inline-flex; align-items: center; gap: 6px;">
              <i data-lucide="calendar-check" style="width: 13px; height: 13px;"></i>
              <span id="pcMonthSelectedLabel">COMPETÊNCIA: ${curMonthObj.nome.toUpperCase()} / 2026</span>
            </span>
          </div>
        </div>

        <!-- Tira de 12 Meses (Pills) -->
        <div style="display: flex; gap: 0.45rem; flex-wrap: wrap; align-items: center;">
          ${PC_MESES.map(m => {
            const isActive = (m.id === curMonth);
            const activeBg = isTodas ? '#059669' : '#2563eb';
            const bg = isActive ? activeBg : 'var(--bg-card)';
            const color = isActive ? '#ffffff' : 'var(--text-title)';
            const border = isActive ? activeBg : 'var(--border-color)';
            const shadow = isActive ? `0 4px 12px ${isTodas ? 'rgba(5, 150, 105, 0.35)' : 'rgba(37, 99, 235, 0.35)'}` : 'none';
            const subColor = isActive ? 'rgba(255, 255, 255, 0.92)' : 'var(--text-muted)';
            return `
            <button type="button" class="pc-month-pill cisa-month-pill ${isActive ? 'active' : ''}" data-month="${m.id}" style="flex: 1 1 calc(8.33% - 0.45rem); min-width: 68px; text-align: center; padding: 7px 6px; border-radius: 8px; font-size: 0.78rem; font-weight: 800; border: 1.5px solid ${border}; background: ${bg}; color: ${color}; box-shadow: ${shadow}; cursor: pointer; transition: all 0.15s ease;">
              <div style="font-size: 0.82rem; font-weight: 800; color: inherit;">${m.sigla}</div>
              <div class="cisa-month-subval" id="pcMonthSub_${m.id}" style="font-size: 0.65rem; font-weight: 600; color: ${subColor}; margin-top: 2px;">—</div>
            </button>
          `;}).join('')}
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
              <tbody id="tbPcConsolidacaoBody"></tbody>
              <tfoot>
                <tr style="background: rgba(16, 185, 129, 0.06); font-weight: 800; border-top: 2px solid rgba(16, 185, 129, 0.25);">
                  <td style="padding: 14px 18px; color: #059669; font-size: 0.88rem;">TOTAL DO PROGRAMA CISA</td>
                  <td id="totPcConsolQtdProcs" style="padding: 14px 18px; text-align: center; color: var(--text-title); font-size: 0.88rem;">—</td>
                  <td id="totPcConsolStatus" style="padding: 14px 18px; text-align: center; color: var(--text-title); font-size: 0.82rem;">—</td>
                  <td id="totPcConsolReceita" style="padding: 14px 18px; text-align: right; color: #2563eb; font-size: 1rem; font-weight: 800;">—</td>
                  <td id="totPcConsolCusto" style="padding: 14px 18px; text-align: right; color: #dc2626; font-size: 1rem; font-weight: 800;">—</td>
                  <td id="totPcConsolSaldo" style="padding: 14px 18px; text-align: right; color: #059669; font-size: 1.05rem; font-weight: 800;">—</td>
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
        
        <!-- 3.1 TABELA AZUL: RECEITAS E FATURAMENTO DO PROGRAMA OFTALMOLÓGICO -->
        <div class="card" id="cardPcSusGaucho" style="padding: 1.5rem; width: 100%; box-sizing: border-box; border-left: 5px solid #2563eb; background: var(--bg-card);">
          <div class="card-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.15rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div class="card-title-group" style="display: flex; align-items: center; gap: 0.85rem;">
              <div class="card-icon" style="background: rgba(37, 99, 235, 0.12); color: #2563eb; width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="landmark" style="width: 22px; height: 22px;"></i>
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.25rem;">
                  <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: var(--text-title);">
                    Receitas e Faturamento — Ambulatório de Oftalmologia
                  </h3>
                  <span class="badge-sus" style="background: rgba(37, 99, 235, 0.12); color: #2563eb; font-weight: 800; font-size: 0.68rem; padding: 0.25rem 0.6rem; border-radius: 99px;">
                    DEMONSTRATIVO DE RECEITAS
                  </span>
                </div>
                <span style="font-size: 0.82rem; color: var(--text-muted);">
                  Demonstrativo consolidado das fontes de faturamento e receitas pactuadas do ambulatório
                </span>
              </div>
            </div>

            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span class="badge" style="background: rgba(37, 99, 235, 0.08); color: #2563eb; font-weight: 700; font-size: 0.78rem; padding: 0.4rem 0.85rem; border-radius: 8px; border: 1px solid rgba(37, 99, 235, 0.2); display: inline-flex; align-items: center; gap: 6px;">
                <i data-lucide="receipt" style="width: 14px; height: 14px;"></i> Receita Global Pactuada
              </span>
            </div>
          </div>

          <div class="table-responsive" style="overflow-x: auto;">
            <table class="cisa-table-modern" style="width: 100%; border-collapse: separate; border-spacing: 0;">
              <thead>
                <tr>
                  <th style="min-width: 320px; text-align: left; padding: 12px 18px;">Rubrica / Programa</th>
                  <th style="width: 250px; text-align: left; padding: 12px 18px;">Origem / Destinação Orçamentária</th>
                  <th style="width: 170px; text-align: center; padding: 12px 18px;">Status do Repasse</th>
                  <th style="width: 220px; text-align: right; padding: 12px 18px;">Receita Faturada (R$)</th>
                </tr>
              </thead>
              <tbody id="tbPcSusGaucho"></tbody>
              <tfoot>
                <tr style="background: rgba(37, 99, 235, 0.05); font-weight: 800; border-top: 2px solid rgba(37, 99, 235, 0.25);">
                  <td colspan="3" style="padding: 14px 18px; color: #2563eb; font-size: 0.88rem; text-transform: uppercase; letter-spacing: 0.5px;">
                    TOTAL GERAL DAS RECEITAS FATURADAS
                  </td>
                  <td id="totPcRecSusGaucho" style="padding: 14px 18px; text-align: right; color: #2563eb; font-size: 1.15rem; font-weight: 900;">
                    R$ 0,00
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Nota Técnica Informativa -->
          <div style="margin-top: 1.15rem; background: rgba(37, 99, 235, 0.04); border-left: 3px solid #2563eb; padding: 0.9rem 1.2rem; border-radius: 0 8px 8px 0; font-size: 0.82rem; color: var(--text-main); line-height: 1.6;">
            <strong>Demonstrativo de Receitas e Faturamento:</strong> Demonstração dos recursos recebidos via <em>SUS Gaúcho (Portaria SES/RS nº 611/2026 - Ambulatório Estratégico de Oftalmologia)</em> e <em>Produção CISA - Oftalmologia</em>. A apuração médica individualizada e o rateio proporcional aos profissionais prestadores serão detalhados nas etapas da prestação de contas dos serviços executados.
          </div>
        </div>

        <!-- 3.2 TABELA VERMELHA: RATEIO DE CUSTOS OPERACIONAIS AMBULATORIAIS -->
        <div class="card" id="cardPcCustosRateio" style="padding: 1.5rem; width: 100%; box-sizing: border-box; border-left: 5px solid #dc2626; background: var(--bg-card);">
          <div class="card-header cisa-custos-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.15rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
            <!-- Canto Superior Esquerdo: Ícone Padrão + Título Oficial + Pill -->
            <div class="card-title-group" style="display: flex; align-items: center; gap: 0.85rem; flex: 1; min-width: 0;">
              <div class="card-icon" style="background: rgba(220, 38, 38, 0.12); color: #dc2626; width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i data-lucide="calculator" style="width: 22px; height: 22px;"></i>
              </div>
              <div style="min-width: 0;">
                <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.25rem;">
                  <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: var(--text-title);">
                    ${isTodas ? 'Rateio de Custos Operacionais Ambulatoriais (Todas as Especialidades)' : 'Rateio de Custos Operacionais Ambulatoriais'}
                  </h3>
                  <span class="badge-sus" style="background: rgba(220, 38, 38, 0.12); color: #dc2626; font-weight: 800; font-size: 0.68rem; padding: 0.25rem 0.65rem; border-radius: 99px; letter-spacing: 0.5px; display: inline-block;">
                    DEMONSTRATIVO DE DESPESAS
                  </span>
                </div>
                <span style="font-size: 0.82rem; color: var(--text-muted); display: block;">
                  ${isTodas ? 'Custos operacionais compartilhados e rateados proporcionalmente entre os diversos ambulatórios que dividem a mesma estrutura' : 'Custos operacionais e de apoio rateados proporcionalmente entre os ambulatórios especializados que dividem a mesma estrutura física e operacional'}
                </span>
              </div>
            </div>

            <!-- Canto Superior Direito: Badge Informativo de Rateio Operacional -->
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-shrink: 0;">
              <span class="badge" style="background: rgba(220, 38, 38, 0.08); color: #dc2626; font-weight: 700; font-size: 0.78rem; padding: 0.4rem 0.85rem; border-radius: 8px; border: 1px solid rgba(220, 38, 38, 0.2); display: inline-flex; align-items: center; gap: 6px;">
                <i data-lucide="calculator" style="width: 14px; height: 14px;"></i> Rateio Operacional Ambulatorial
              </span>
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
              <tbody id="tbPcCustos"></tbody>
              <tfoot>
                <tr style="background: rgba(239, 68, 68, 0.05); font-weight: 800; border-top: 2px solid rgba(239, 68, 68, 0.2);">
                  <td colspan="5" style="padding: 14px 18px; color: #dc2626; font-size: 0.88rem;">
                    SUBTOTAL DE CUSTOS OPERACIONAIS RATEADOS PELA OFTALMOLOGIA
                  </td>
                  <td id="totPcFixo" style="padding: 14px 18px; text-align: right; color: #dc2626; font-size: 1.05rem; font-weight: 800;">
                    R$ 0,00
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- 3.3 REGRA DE NEGOCIAÇÃO | ESTUDO DE VIABILIDADE CISA -->
        <div class="card cisa-neg-card" id="pcRegraNegCard" style="padding: 0; overflow: hidden; width: 100%; box-sizing: border-box; border: 1px solid var(--border-color);">
          <div class="cisa-neg-header" style="padding: 14px 20px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: var(--bg-card);">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <h3 style="margin: 0; font-size: 0.95rem; font-weight: 800; letter-spacing: 0.6px; color: var(--text-title); text-transform: uppercase;">
                REGRA DE NEGOCIAÇÃO <span style="color: var(--text-muted); font-weight: 400; margin: 0 4px;">|</span> ESTUDO DE VIABILIDADE
              </h3>
            </div>
            <span class="cisa-neg-badge" id="pcRuleBadge">ATIVA</span>
          </div>

          <div style="padding: 16px 20px 0 20px;">
            <!-- Grade de Regras -->
            <div class="cisa-rule-grid" role="group" aria-label="Regra de negociação">
              <!-- 1. 50% Margem Hospitalar -->
              <button type="button" class="cisa-rule-card pc-rule-card" data-rule="margem50" aria-pressed="false">
                <div class="cisa-rule-head">
                  <span class="cisa-rule-dot"></span>
                  <span class="cisa-rule-name">50% Margem Hospitalar</span>
                </div>
                <div class="cisa-rule-desc">O hospital retém metade do valor de cada procedimento; a outra metade remunera a equipe executora.</div>
                <div class="cisa-rule-formula">custo = Receita × 50%</div>
              </button>

              <!-- 2. Rateio 80% / 20% -->
              <button type="button" class="cisa-rule-card pc-rule-card" data-rule="rateio8020" aria-pressed="true">
                <div class="cisa-rule-head">
                  <span class="cisa-rule-dot"></span>
                  <span class="cisa-rule-name">Rateio 80% / 20%</span>
                </div>
                <div class="cisa-rule-desc">Após a retirada das despesas operacionais, o resultado líquido é dividido entre 80% para os prestadores e 20% para o hospital.</div>
                <div class="cisa-rule-formula">repasse médico = saldo líquido × 80%</div>
              </button>

              <!-- 3. Nova Regra Personalizada -->
              <button type="button" class="cisa-rule-card pc-rule-card cisa-rule-add" id="pcAddRule" title="Disponível em versão futura">
                <span class="cisa-plus">+</span>
                <span class="cisa-rule-name" style="font-size: 11.5px;">Nova regra</span>
                <span class="cisa-rule-desc" style="font-size: 10.5px;">Personalizada</span>
              </button>
            </div>


            <!-- Nota Explicativa da Regra -->
            <div class="cisa-rule-note" id="pcRuleNote">
              <strong>Rateio 80% / 20%.</strong> Após a retirada de todas as despesas operacionais, o resultado líquido apurado é dividido na proporção de 80% para os prestadores médicos e 20% para o hospital.
            </div>
          </div>

          <!-- Pool / Faixa de Resultado (Dark Bar) -->
          <div class="cisa-pool" id="pcPoolBox">
            <div class="cisa-pool-item">
              <span class="cisa-pl">RECEITA TOTAL</span>
              <span class="cisa-pv" id="pcPoolRec">—</span>
            </div>
            <span class="cisa-pool-op">−</span>
            <div class="cisa-pool-item">
              <span class="cisa-pl">DESPESA TOTAL</span>
              <span class="cisa-pv" id="pcPoolDes">—</span>
            </div>
            <span class="cisa-pool-op">=</span>
            <div class="cisa-pool-item cisa-forte">
              <span class="cisa-pl">RESULTADO A RATEAR</span>
              <span class="cisa-pv" id="pcPoolLiq">—</span>
            </div>
          </div>

          <!-- Split: 2 Colunas (Hospital vs Prestador) -->
          <!-- Split: 2 Colunas (Receitas vs Despesas) -->
          <div class="cisa-split" id="pcSplitBox">
            <!-- Coluna RECEITAS -->
            <div class="cisa-side cisa-hosp" style="display: flex; flex-direction: column;">
              <h3><span class="cisa-sq" style="background: #2563eb;"></span>■ RECEITAS</h3>
              <div class="cisa-kv" id="pcHStream">
                <span class="cisa-k">Receita SUS Gaúcho (Mutirão)</span><span class="cisa-v" id="pcHMutirao" style="color: #2563eb; font-weight: 700;">R$&nbsp;0,00</span>
                <span class="cisa-k">Receita Consórcio CISA</span><span class="cisa-v" id="pcHCisa" style="color: #2563eb; font-weight: 700;">R$&nbsp;0,00</span>
                <span class="cisa-k" style="font-weight: 800; color: var(--text-title); border-top: 1px dashed #cbd5e1; padding-top: 4px;">Total de Receitas Faturadas</span><span class="cisa-v" id="pcHProd" style="color: #10b981; font-weight: 800; border-top: 1px dashed #cbd5e1; padding-top: 4px;">—</span>
              </div>
              <div class="cisa-res" style="margin-top: auto;">
                <span class="cisa-lb">RECEITA TOTAL FATURADA</span>
                <span class="cisa-vl" id="pcHRes" style="color: #2563eb;">—</span>
              </div>
            </div>

            <!-- Coluna DESPESAS -->
            <div class="cisa-side cisa-pres" style="display: flex; flex-direction: column;">
              <h3><span class="cisa-sq" style="background: #dc2626;"></span>■ DESPESAS</h3>
              <div class="cisa-kv" id="pcPStream">
                <span class="cisa-k">Despesas de Pessoal (+) encargos</span><span class="cisa-v" id="pcDPessoal" style="color: #dc2626; font-weight: 700;">—</span>
                <span class="cisa-k">Material</span><span class="cisa-v" id="pcDMaterial" style="color: #dc2626; font-weight: 700;">—</span>
                <span class="cisa-k">Sistemas de TI</span><span class="cisa-v" id="pcDTasy" style="color: #dc2626; font-weight: 700;">—</span>
                <span class="cisa-k">Taxa de Sala</span><span class="cisa-v" id="pcDInfra" style="color: #dc2626; font-weight: 700;">—</span>
                <div id="pcBlockRateio80" style="display: contents;">
                  <span class="cisa-sep" style="grid-column: 1 / -1; margin: 4px 0; border-top: 1px dashed #cbd5e1;"></span>
                  <span class="cisa-k" style="font-weight: 700; color: var(--text-title);">Subtotal das Despesas</span><span class="cisa-v" id="pcDSubtotal" style="color: #dc2626; font-weight: 700;">—</span>
                  <span class="cisa-k" style="font-weight: 800; color: #059669; border-top: 1px dashed #cbd5e1; padding-top: 4px;">Saldo Bruto (Receita − Despesas)</span><span class="cisa-v" id="pcDSaldoBruto" style="color: #059669; font-weight: 800; border-top: 1px dashed #cbd5e1; padding-top: 4px;">—</span>
                  <span class="cisa-k" style="font-weight: 700; color: #b91c1c;">Rateio 80% Médico(s) Prestador(es)</span><span class="cisa-v" id="pcDRateioMed" style="color: #dc2626; font-weight: 700;">—</span>
                  <span class="cisa-k" style="font-size: 0.74rem; padding-left: 10px; color: #475569;">↳ Dr. Christian Pretto (40% · 150 cons.)</span><span class="cisa-v" id="pcDRateioChristian" style="font-size: 0.74rem; color: #b91c1c; font-weight: 600;">—</span>
                  <span class="cisa-k" style="font-size: 0.74rem; padding-left: 10px; color: #475569;">↳ Dr. Heron Gomes Correia (40% · 150 cons.)</span><span class="cisa-v" id="pcDRateioHeron" style="font-size: 0.74rem; color: #b91c1c; font-weight: 600;">—</span>
                  <span class="cisa-k" style="font-weight: 700; color: var(--text-muted); border-top: 1px dashed #cbd5e1; padding-top: 4px;">Total das Despesas</span><span class="cisa-v" id="pcDTotalDesp" style="color: #dc2626; font-weight: 700; border-top: 1px dashed #cbd5e1; padding-top: 4px;">—</span>
                </div>
              </div>
              <div class="cisa-res" style="margin-top: auto; padding-top: 10px; border-top: 1px solid #e2e8f0;">
                <span class="cisa-lb" id="pcPResLabel" style="color: #047857; font-weight: 800;">RESULTADO 20% HOSPITALAR</span>
                <span class="cisa-vl" id="pcPRes2" style="color: #059669; font-weight: 800;">—</span>
              </div>
            </div>
          </div>

          <!-- Detalhamento Individualizado dos Prestadores Médicos (80% Rateio) -->
          <div id="pcBoxSubdivisaoMedicos" style="margin: 0 1.25rem 1.25rem 1.25rem; padding: 1rem 1.25rem; background: rgba(37, 99, 235, 0.03); border: 1px solid rgba(37, 99, 235, 0.15); border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="users" style="width: 18px; height: 18px; color: #2563eb;"></i>
                <strong style="font-size: 0.88rem; color: var(--text-title); text-transform: uppercase; letter-spacing: 0.5px;">
                  Rateio Clínico Individualizado dos Médicos Prestadores (80% do Saldo Bruto)
                </strong>
              </div>
              <span class="badge" style="background: rgba(37, 99, 235, 0.1); color: #2563eb; font-weight: 700; font-size: 0.74rem; padding: 3px 8px; border-radius: 6px;">
                Meta Ambulatorial: 300 Consultas/Mês (150 por Prestador)
              </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem;">
              <!-- Card Dr. Christian Pretto -->
              <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-left: 4px solid #2563eb; border-radius: 8px; padding: 0.9rem 1.1rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                  <div>
                    <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: var(--text-title);">Dr. Christian Pretto</h4>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Corpo Clínico · Oftalmologia Ambulatorial</span>
                  </div>
                  <span style="background: rgba(37, 99, 235, 0.1); color: #2563eb; font-weight: 800; font-size: 0.72rem; padding: 2px 7px; border-radius: 4px;">40% do Saldo</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: baseline; border-top: 1px dashed var(--border-color); padding-top: 0.6rem; margin-top: 0.4rem;">
                  <div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">150 Consultas / Mês</div>
                    <div style="font-size: 1.12rem; font-weight: 800; color: #dc2626;" id="pcValChristian">R$ 27.292,58</div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Valor por Consulta</div>
                    <div style="font-size: 1.05rem; font-weight: 800; color: #059669;" id="pcUnitChristian">R$ 181,95 <span style="font-size: 0.7rem; font-weight: 600; color: var(--text-muted);">/ cons.</span></div>
                  </div>
                </div>
              </div>

              <!-- Card Dr. Heron Gomes Correia -->
              <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-left: 4px solid #10b981; border-radius: 8px; padding: 0.9rem 1.1rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                  <div>
                    <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: var(--text-title);">Dr. Heron Gomes Correia</h4>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Corpo Clínico · Oftalmologia Ambulatorial</span>
                  </div>
                  <span style="background: rgba(16, 185, 129, 0.1); color: #059669; font-weight: 800; font-size: 0.72rem; padding: 2px 7px; border-radius: 4px;">40% do Saldo</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: baseline; border-top: 1px dashed var(--border-color); padding-top: 0.6rem; margin-top: 0.4rem;">
                  <div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">150 Consultas / Mês</div>
                    <div style="font-size: 1.12rem; font-weight: 800; color: #dc2626;" id="pcValHeron">R$ 27.292,58</div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Valor por Consulta</div>
                    <div style="font-size: 1.05rem; font-weight: 800; color: #059669;" id="pcUnitHeron">R$ 181,95 <span style="font-size: 0.7rem; font-weight: 600; color: var(--text-muted);">/ cons.</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div style="margin-top: 0.75rem; font-size: 0.74rem; color: var(--text-muted); line-height: 1.5; border-top: 1px solid rgba(37, 99, 235, 0.1); padding-top: 0.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <span><strong>Fórmula de Apuração:</strong> (Saldo Bruto a Ratear × 40%) ÷ 150 consultas realizadas no mês por médico prestador.</span>
              <span style="color: #2563eb; font-weight: 700;">Subtotal Rateio Médico (80%): <strong id="pcValSubtotalMed" style="color: #dc2626;">R$ 54.585,16</strong></span>
            </div>
          </div>
        </div>

      </div>

      <!-- 4. FOOTER INSTITUCIONAL -->
      <div class="card" style="padding: 1.25rem 1.5rem; background: var(--bg-card-hover); font-size: 0.78rem; color: var(--text-muted); line-height: 1.6; border-top: 1px solid var(--border-color, #e2e8f0);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
          <div style="flex: 1; min-width: 280px;">
            <div style="margin-bottom: 0.25rem;">
              <strong>Base Normativa:</strong> Controle Integrado de Faturamento Ambulatorial · Programas SUS Gaúcho (Portaria SES/RS nº 611/2026) & Consórcio Intermunicipal CISA · Hospital Bom Pastor de Santo Augusto.
            </div>
            <div style="font-size: 0.73rem; color: var(--text-muted); opacity: 0.85;">
              FluxSUS® é uma marca registrada especializada em processos em saúde.
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; justify-content: flex-end;">
            <div style="text-align: right;">
              <div style="font-weight: 700; color: var(--blue-vibrant, #2563eb); font-size: 0.82rem;">
                FluxSUS - Sala de Situação / Módulo de Controle e Prestação de contas SUS © 2026
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">
                Inteligência & Gestão Estratégica em Processos SUS
              </div>
            </div>
            <div style="background: #ffffff; padding: 4px 10px; border-radius: 8px; border: 1px solid #e2e8f0; display: inline-flex; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <img src="logo_fluxsus.png" alt="FluxSUS - Processos em Saúde" style="height: 44px; width: auto; object-fit: contain; display: block;">
            </div>
          </div>
        </div>
      </div>

    </div>
  `;

  initPrestacaoInteractiveSimulation(key);
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

// ----------------------------------------------------------------------------
// 2. MOTOR INTERATIVO DE CÁLCULO E CONTROLES CISA
// ----------------------------------------------------------------------------
function initPrestacaoInteractiveSimulation(currentKey) {
  if (!currentKey) currentKey = window.currentPrestacaoKey || 'todas';
  const isTodas = (currentKey === 'todas');
  const root = document.getElementById('pcNativeDashboard');
  if (!root) return;

  const state = window.activePrestacaoSim;
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
    if (window.prestacaoSelectedMonth === '08') {
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

  function renderSusGauchoTable() {
    const cardSG = root.querySelector('#cardPcSusGaucho');
    const tbSG = root.querySelector('#tbPcSusGaucho');
    if (!tbSG) return;
    tbSG.innerHTML = '';

    const listSG = state.procsSusGaucho || [];

    if (listSG.length === 0) {
      const trEmpty = document.createElement('tr');
      trEmpty.innerHTML = `
        <td colspan="4" style="text-align: center; padding: 24px 18px; color: var(--text-muted); font-size: 0.88rem;">
          <i data-lucide="info" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 6px;"></i>
          Nenhuma receita cadastrada para esta competência.
        </td>
      `;
      tbSG.appendChild(trEmpty);
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
      return;
    }

    listSG.forEach((p, idx) => {
      const tr = document.createElement('tr');
      tr.className = 'cisa-row';

      const v = (p.val !== undefined && p.val !== null && p.val !== '') ? parseFloat(p.val) : 0;
      const curStatus = p.status || 'Recebido FES';

      let stBg = '#eafaf1';
      let stColor = '#167b45';
      let stBorder = '#d2f4df';

      if (curStatus === 'Aguardando Recurso') {
        stBg = '#fef6ea';
        stColor = '#b86a04';
        stBorder = '#faecd4';
      } else if (curStatus === 'Pago aos Prestadores' || curStatus === 'Pago ao Prestadores') {
        stBg = '#eff6ff';
        stColor = '#1d4ed8';
        stBorder = '#bfdbfe';
      } else if (curStatus === 'Não se aplica' || curStatus === 'Nao se aplica') {
        stBg = '#f1f5f9';
        stColor = '#475569';
        stBorder = '#cbd5e1';
      }

      const isCisa = (p.id === 'cisa' || (p.rubrica && p.rubrica.toLowerCase().includes('cisa')));
      const iconName = isCisa ? 'building-2' : 'sparkles';
      const iconColor = isCisa ? '#059669' : '#2563eb';
      const subIcon = isCisa ? 'file-text' : 'file-badge-2';
      const defaultRubrica = isCisa ? 'Produção CISA - Oftalmologia' : 'SUS Gaúcho - Ambulatório Estratégico Oftalmologia';
      const defaultPortaria = isCisa ? 'Procedimentos Ambulatoriais e Diagnósticos Especializados' : 'Portaria SES/RS nº 611/2026 (Mutirão de Especialidades)';
      const defaultNatureza = isCisa ? 'Consórcio Intermunicipal de Saúde (CISA)' : 'Custeio Ambulatorial Especializado';
      const defaultOrigemSub = isCisa ? 'Receita Própria Pactuada Consórcio' : 'Fundo Estadual de Saúde (FES/RS)';

      tr.innerHTML = `
        <td class="cisa-cell" style="padding: 14px 18px;">
          <div style="font-weight: 800; color: var(--text-title); font-size: 0.95rem; margin-bottom: 3px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="${iconName}" style="width: 16px; height: 16px; color: ${iconColor}; flex-shrink: 0;"></i>
            <span>${p.rubrica || defaultRubrica}</span>
          </div>
          <div style="font-size: 0.78rem; color: ${iconColor}; font-weight: 600; margin-left: 24px;">
            <i data-lucide="${subIcon}" style="width: 13px; height: 13px; vertical-align: middle; margin-right: 3px;"></i>
            ${p.portaria || defaultPortaria}
          </div>
        </td>
        <td class="cisa-cell" style="padding: 14px 18px; vertical-align: middle;">
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.86rem;">
            ${p.natureza || defaultNatureza}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
            ${p.origemSub || defaultOrigemSub}
          </div>
        </td>
        <td class="cisa-cell" style="padding: 14px 18px; text-align: center; vertical-align: middle;">
          <div style="display: inline-flex; align-items: center; justify-content: center;">
            <select class="sg-select-status" style="font-size: 0.8rem; font-weight: 700; padding: 5px 12px; border-radius: 9999px; cursor: pointer; border: 1px solid ${stBorder}; background: ${stBg}; color: ${stColor}; outline: none; font-family: inherit; transition: all 0.2s ease;">
              <option value="Recebido FES" ${curStatus === 'Recebido FES' ? 'selected' : ''} style="background: #ffffff; color: #167b45;">Recebido FES</option>
              <option value="Aguardando Recurso" ${curStatus === 'Aguardando Recurso' ? 'selected' : ''} style="background: #ffffff; color: #b86a04;">Aguardando Recurso</option>
              <option value="Pago ao Prestadores" ${(curStatus === 'Pago aos Prestadores' || curStatus === 'Pago ao Prestadores') ? 'selected' : ''} style="background: #ffffff; color: #1d4ed8;">Pago ao Prestadores</option>
              <option value="Não se aplica" ${(curStatus === 'Não se aplica' || curStatus === 'Nao se aplica') ? 'selected' : ''} style="background: #ffffff; color: #475569;">Não se aplica</option>
            </select>
          </div>
        </td>
        <td class="cisa-cell" style="padding: 14px 18px; text-align: right; vertical-align: middle;">
          <span class="sg-val-wrapper" style="display: inline-flex; align-items: center; justify-content: flex-end;">
            <strong class="sg-cell-tot" style="color: #2563eb; font-size: 0.95rem; font-weight: 800; cursor: pointer;" title="Clique para editar valor">${BRL.format(v)}</strong>
          </span>
        </td>
      `;

      // Handler para mudança de status
      const selStatus = tr.querySelector('.sg-select-status');
      if (selStatus) {
        selStatus.onchange = (e) => {
          p.status = e.target.value;
          savePrestacaoMonthlyStore();
          renderSusGauchoTable();
        };
      }

      // Handler para edição rápida sem bordas ao clicar
      const valWrapper = tr.querySelector('.sg-val-wrapper');
      const valText = tr.querySelector('.sg-cell-tot');
      if (valText && valWrapper) {
        valText.onclick = () => {
          const currentVal = (p.val !== undefined && p.val !== null) ? p.val : 0;
          valWrapper.innerHTML = `
            <span style="font-size: 0.88rem; font-weight: 800; color: #2563eb; margin-right: 4px;">R$</span>
            <input type="number" step="0.01" min="0" class="sg-temp-input" value="${currentVal.toFixed(2)}" style="width: 120px; text-align: right; padding: 2px 6px; border: 1px solid #2563eb; border-radius: 4px; font-weight: 800; font-size: 0.95rem; color: #2563eb; background: #fff;">
          `;
          const tempIn = valWrapper.querySelector('.sg-temp-input');
          tempIn.focus();
          tempIn.select();

          const commitEdit = () => {
            const parsed = parseFloat(tempIn.value);
            p.val = (!isNaN(parsed) && parsed >= 0) ? parsed : 0;
            savePrestacaoMonthlyStore();
            renderSusGauchoTable();
            recalc();
          };

          tempIn.onblur = commitEdit;
          tempIn.onkeydown = (ev) => {
            if (ev.key === 'Enter') commitEdit();
            if (ev.key === 'Escape') renderSusGauchoTable();
          };
        };
      }

      tbSG.appendChild(tr);
    });

    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  }

  function renderProcsTable() {
    const tb = root.querySelector('#tbPcProcs');
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
          savePrestacaoMonthlyStore();
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
          savePrestacaoMonthlyStore();
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
          savePrestacaoMonthlyStore();
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
          savePrestacaoMonthlyStore();
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
    const tb = root.querySelector('#tbPcCustos');
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
    const valEncargos = Math.round(folhaPessoalRateada * 0.3091 * 100) / 100;

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
          savePrestacaoMonthlyStore();
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
          savePrestacaoMonthlyStore();
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
          savePrestacaoMonthlyStore();
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
          savePrestacaoMonthlyStore();
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

    // 1. CÁLCULO DAS RECEITAS DA PRESTAÇÃO DE CONTAS (SUS GAÚCHO E PRODUÇÃO CISA)
    let totRecSusGaucho = 0;
    let totRecCisa = 0;
    const listSG = state.procsSusGaucho || [];
    listSG.forEach((p) => {
      const v = (p.val !== undefined && p.val !== null && p.val !== '') ? parseFloat(p.val) : 0;
      if (p.id === 'cisa' || (p.rubrica && p.rubrica.toLowerCase().includes('cisa'))) {
        totRecCisa += v;
      } else {
        totRecSusGaucho += v;
      }
    });

    // RECEITA TOTAL CONSOLIDADA DO MÊS (CISA + SUS GAÚCHO)
    const totRec = totRecCisa + totRecSusGaucho;

    let totFix = 0;
    let despPessoalSemEncargos = 0;
    let folhaPessoal = 0;
    let despMaterial = 0;
    let despTasy = 0;
    let despInfra = 0;

    listCustos.forEach((c) => {
      const q = (c.qtd !== undefined && c.qtd !== null && c.qtd !== '') ? parseFloat(c.qtd) : 0;
      const rateioPct = (c.rateio !== undefined && c.rateio !== null && c.rateio !== '') ? parseFloat(c.rateio) : 100;
      const totLinha = q * (c.val || 0) * (rateioPct / 100);
      totFix += totLinha;

      const cls = c.classificacao || '';
      const itemLower = (c.item || '').toLowerCase();
      if (cls === 'Material' || itemLower.includes('material') || itemLower.includes('almoxarifado')) {
        despMaterial += totLinha;
      } else if (cls === 'Sistemas TI' || itemLower.includes('tasy') || itemLower.includes('sistema')) {
        despTasy += totLinha;
      } else if (cls === 'Taxa de Sala' || itemLower.includes('infra') || itemLower.includes('predial') || itemLower.includes('luz') || itemLower.includes('sala')) {
        despInfra += totLinha;
      } else if (cls === 'Prestador') {
        // Médicos cirurgiões com RQE (remunerados na despesa médica do rateio 80%)
      } else {
        despPessoalSemEncargos += totLinha;
        if (cls === 'Pessoal') {
          folhaPessoal += totLinha;
        }
      }
    });

    // 30,91% de Encargos da Folha sobre o total rateado de Pessoal
    const valEncargos = Math.round(folhaPessoal * 0.3091 * 100) / 100;
    totFix += valEncargos;
    const despPessoalTotal = despPessoalSemEncargos + valEncargos;

    const despesaTotal = totFix;
    const resultadoMensal = totRec - despesaTotal;

    // Atualiza Totais das Tabelas da Competência Ativa
    const elTotRecCisa = root.querySelector('#totPcRec');
    if (elTotRecCisa) elTotRecCisa.textContent = BRL.format(totRecCisa);

    // Totais específicos da Tabela de Receitas (Total Consolidado da Competência)
    const elTotRecSG = root.querySelector('#totPcRecSusGaucho');
    if (elTotRecSG) elTotRecSG.textContent = BRL.format(totRec);

    const elTotFix = root.querySelector('#totPcFixo');
    if (elTotFix) elTotFix.textContent = BRL.format(totFix);

    // LOOP DOS 12 MESES: Atualiza subvalores de cada pill e calcula acumulado anual e médias mensais
    let annualRec = 0;
    let annualDesp = 0;
    let countMonthsActive = 0;

    PC_MESES.forEach(m => {
      let mCustos;
      if (m.id === window.prestacaoSelectedMonth) {
        mCustos = listCustos;
      } else {
        const mStore = getPrestacaoMonthlyStore(m.id);
        mCustos = isTodas ? mStore.custos : mStore.custos.filter(c => !c.especialidade || matchSpec(c.especialidade, currentKey));
      }

      let mRec = 0;
      const mSG = (m.id === window.prestacaoSelectedMonth)
        ? (state.procsSusGaucho || [])
        : (getPrestacaoMonthlyStore(m.id).procsSusGaucho || []);

      mSG.forEach(p => {
        const v = (p.val !== undefined && p.val !== null && p.val !== '') ? parseFloat(p.val) : 0;
        mRec += v;
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

      const elPillSub = root.querySelector(`#pcMonthSub_${m.id}`);
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
    const elKpiRec = root.querySelector('#kpiPcReceita');
    if (elKpiRec) elKpiRec.textContent = mediaRec > 0 ? BRL.format(mediaRec) : 'R$ 0,00';

    const elKpiDesp = root.querySelector('#kpiPcDespesa');
    if (elKpiDesp) elKpiDesp.textContent = BRL.format(mediaDesp);

    const elKpiRes = root.querySelector('#kpiPcResultado');
    if (elKpiRes) {
      if (mediaRec > 0 || mediaDesp > 0) {
        elKpiRes.textContent = (mediaRes > 0 ? '+ ' : '') + BRL.format(mediaRes);
        elKpiRes.style.color = mediaRes >= 0 ? '#059669' : '#dc2626';
      } else {
        elKpiRes.textContent = 'R$ 0,00';
        elKpiRes.style.color = 'var(--text-title)';
      }
    }

    const elKpiMargem = root.querySelector('#kpiPcMargemTxt');
    if (elKpiMargem) elKpiMargem.textContent = mediaRec > 0 ? margemMedia.toFixed(1).replace('.', ',') + '%' : '0,0%';

    const elKpiBk = root.querySelector('#kpiPcBreakeven');
    if (elKpiBk) elKpiBk.textContent = mediaRec > 0 ? bkMedia.toFixed(1).replace('.', ',') + '%' : '0,0%';

    const annualRes = annualRec - annualDesp;

    // Atualiza KPIs Anuais (rodapé dos cards)
    const elKpiRecAno = root.querySelector('#kpiPcReceitaAno');
    if (elKpiRecAno) elKpiRecAno.textContent = BRL.format(annualRec);

    const elKpiDespAno = root.querySelector('#kpiPcDespesaAno');
    if (elKpiDespAno) elKpiDespAno.textContent = BRL.format(annualDesp);

    const elKpiResAno = root.querySelector('#kpiPcResultadoAno');
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
    const elPoolRec = root.querySelector('#pcPoolRec');
    if (elPoolRec) elPoolRec.textContent = BRL.format(totRec);
    const elPoolDes = root.querySelector('#pcPoolDes');
    if (elPoolDes) elPoolDes.textContent = BRL.format(totFix);
    const elPoolLiq = root.querySelector('#pcPoolLiq');
    if (elPoolLiq) {
      elPoolLiq.textContent = (resultadoMensal > 0 ? '+ ' : '') + BRL.format(resultadoMensal);
      elPoolLiq.style.color = resultadoMensal >= 0 ? '#10b981' : '#dc2626';
    }

    const activeRule = state.regraAtiva || 'rateio8020';
    let hospProd = 0;
    let presProd = 0;

    if (activeRule === 'margem50') {
      hospProd = totRec * 0.50;
      presProd = totRec * 0.50;
    } else if (activeRule === 'rateio8020') {
      hospProd = totRec * 0.20;
      presProd = totRec * 0.80;
    } else {
      hospProd = totRec * 0.20;
      presProd = totRec * 0.80;
    }

    const hospRes = hospProd - totFix;
    const presRes = presProd;

    // Coluna RECEITAS (Detalhamento por Origem: SUS Gaúcho vs CISA)
    const elHMutirao = root.querySelector('#pcHMutirao');
    if (elHMutirao) elHMutirao.textContent = BRL.format(totRecSusGaucho);
    const elHCisa = root.querySelector('#pcHCisa');
    if (elHCisa) elHCisa.textContent = BRL.format(totRecCisa);
    const elHProd = root.querySelector('#pcHProd');
    if (elHProd) elHProd.textContent = BRL.format(totRec);
    const elHRes = root.querySelector('#pcHRes');
    if (elHRes) {
      elHRes.textContent = BRL.format(totRec);
      elHRes.style.color = '#2563eb';
    }

    // Coluna DESPESAS (Consolidação em 4 Centros de Custo + Rateio 80/20)
    const elDPessoal = root.querySelector('#pcDPessoal');
    if (elDPessoal) elDPessoal.textContent = BRL.format(despPessoalTotal);

    const elDMaterial = root.querySelector('#pcDMaterial');
    if (elDMaterial) elDMaterial.textContent = BRL.format(despMaterial);

    const elDTasy = root.querySelector('#pcDTasy');
    if (elDTasy) elDTasy.textContent = BRL.format(despTasy);

    const elDInfra = root.querySelector('#pcDInfra');
    if (elDInfra) elDInfra.textContent = BRL.format(despInfra);

    // Rateio 80/20 do saldo total que sobrou (Receita Total - Subtotal de Despesas Operacionais)
    const saldoTotalSobrou = Math.max(0, totRec - totFix);
    const rateioMed80 = saldoTotalSobrou * 0.80;
    const resultadoHosp20 = saldoTotalSobrou * 0.20;

    // Subdivisão dos 80% entre os dois prestadores médicos (40% cada · 150 consultas cada)
    const rateioMed40 = rateioMed80 / 2;
    const qtdConsultasChristian = 150;
    const qtdConsultasHeron = 150;
    const unitarioChristian = qtdConsultasChristian > 0 ? (rateioMed40 / qtdConsultasChristian) : 0;
    const unitarioHeron = qtdConsultasHeron > 0 ? (rateioMed40 / qtdConsultasHeron) : 0;

    const elBlockRateio = root.querySelector('#pcBlockRateio80');
    const elDSubtotal = root.querySelector('#pcDSubtotal');
    const elDSaldoBruto = root.querySelector('#pcDSaldoBruto');
    const elDRateioMed = root.querySelector('#pcDRateioMed');
    const elDRateioChristian = root.querySelector('#pcDRateioChristian');
    const elDRateioHeron = root.querySelector('#pcDRateioHeron');
    const elDTotalDesp = root.querySelector('#pcDTotalDesp');
    const elPRes = root.querySelector('#pcPRes2');
    const elPResLabel = root.querySelector('#pcPResLabel');

    const elBoxSubdivisao = root.querySelector('#pcBoxSubdivisaoMedicos');
    const elValChristian = root.querySelector('#pcValChristian');
    const elUnitChristian = root.querySelector('#pcUnitChristian');
    const elValHeron = root.querySelector('#pcValHeron');
    const elUnitHeron = root.querySelector('#pcUnitHeron');
    const elValSubtotalMed = root.querySelector('#pcValSubtotalMed');

    if (activeRule === 'rateio8020') {
      if (elBlockRateio) elBlockRateio.style.display = 'contents';
      if (elBoxSubdivisao) elBoxSubdivisao.style.display = 'block';
      if (elDSubtotal) elDSubtotal.textContent = BRL.format(totFix);
      if (elDSaldoBruto) elDSaldoBruto.textContent = BRL.format(saldoTotalSobrou);
      if (elDRateioMed) elDRateioMed.textContent = BRL.format(rateioMed80);
      if (elDRateioChristian) elDRateioChristian.textContent = BRL.format(rateioMed40);
      if (elDRateioHeron) elDRateioHeron.textContent = BRL.format(rateioMed40);

      if (elValChristian) elValChristian.textContent = BRL.format(rateioMed40);
      if (elUnitChristian) elUnitChristian.innerHTML = `${BRL.format(unitarioChristian)} <span style="font-size: 0.7rem; font-weight: 600; color: var(--text-muted);">/ cons.</span>`;
      if (elValHeron) elValHeron.textContent = BRL.format(rateioMed40);
      if (elUnitHeron) elUnitHeron.innerHTML = `${BRL.format(unitarioHeron)} <span style="font-size: 0.7rem; font-weight: 600; color: var(--text-muted);">/ cons.</span>`;
      if (elValSubtotalMed) elValSubtotalMed.textContent = BRL.format(rateioMed80);

      const totalDespesa8020 = totFix + rateioMed80;
      if (elDTotalDesp) elDTotalDesp.textContent = BRL.format(totalDespesa8020);

      if (elPResLabel) elPResLabel.textContent = 'RESULTADO 20% HOSPITALAR';
      if (elPRes) {
        if (totRec > 0) {
          elPRes.textContent = '+ ' + BRL.format(resultadoHosp20);
          elPRes.style.color = '#059669';
        } else {
          elPRes.textContent = 'R$ 0,00';
          elPRes.style.color = '#64748b';
        }
      }
    } else {
      if (elBlockRateio) elBlockRateio.style.display = 'none';
      if (elBoxSubdivisao) elBoxSubdivisao.style.display = 'none';
      if (elPResLabel) elPResLabel.textContent = 'RESULTADO HOSPITALAR';
      if (elPRes) {
        const res50 = hospRes;
        elPRes.textContent = (res50 > 0 ? '+ ' : '') + BRL.format(res50);
        elPRes.style.color = res50 >= 0 ? '#059669' : '#dc2626';
      }
    }

    // Se for TODAS ESPECIALIDADES, preenche também o Quadro de Consolidação por Especialidade
    if (isTodas) {
      const tbConsol = root.querySelector('#tbPcConsolidacaoBody');
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
              <button class="pill-btn active" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;" onclick="switchPrestacaoServico('${sKey}')">
                <span>Detalhar</span>
                <i data-lucide="arrow-right" style="width: 12px; height: 12px;"></i>
              </button>
            </td>
          `;
          tbConsol.appendChild(tr);
        });

        // Atualiza footer da tabela de consolidação
        const elTotProcs = root.querySelector('#totPcConsolQtdProcs');
        if (elTotProcs) elTotProcs.textContent = `${totalGeralProcs} procedimentos`;

        const elTotStatus = root.querySelector('#totPcConsolStatus');
        if (elTotStatus) elTotStatus.textContent = `${totalGeralCotados} de ${totalGeralProcs} cotados`;

        const elTotRecConsol = root.querySelector('#totPcConsolReceita');
        if (elTotRecConsol) elTotRecConsol.textContent = totalGeralRec > 0 ? BRL.format(totalGeralRec) : 'Aguardando valores';

        const elTotCusConsol = root.querySelector('#totPcConsolCusto');
        if (elTotCusConsol) elTotCusConsol.textContent = BRL.format(totalGeralCusto);

        const elTotSalConsol = root.querySelector('#totPcConsolSaldo');
        if (elTotSalConsol) {
          const saldoGeral = totalGeralRec > 0 ? (totalGeralRec - totalGeralCusto) : -totalGeralCusto;
          elTotSalConsol.textContent = totalGeralRec > 0 ? ((saldoGeral >= 0 ? '+ ' : '') + BRL.format(saldoGeral)) : 'Em apuração';
        }
      }
    }
  }

  // Sincronização dos 12 Meses (Pills de Navegação e Competência)
  const monthPills = root.querySelectorAll('.pc-month-pill[data-month]');
  monthPills.forEach(pill => {
    pill.onclick = () => {
      const mId = pill.dataset.month;
      if (mId === window.prestacaoSelectedMonth) return;

      savePrestacaoMonthlyStore();
      window.prestacaoSelectedMonth = mId;

      const newStore = getPrestacaoMonthlyStore(mId);
      state.procs = newStore.procs;
      state.procsSusGaucho = newStore.procsSusGaucho || [];
      state.custos = newStore.custos;
      state.regraAtiva = newStore.regraAtiva || 'rateio8020';

      const curMObj = PC_MESES.find(m => m.id === mId) || PC_MESES[0];
      const lbl = root.querySelector('#pcMonthSelectedLabel');
      if (lbl) lbl.textContent = `COMPETÊNCIA: ${curMObj.nome.toUpperCase()} / 2026`;

      monthPills.forEach(p => {
        const isPActive = (p.dataset.month === mId);
        p.classList.toggle('active', isPActive);
        const activeBg = isTodas ? '#059669' : '#2563eb';
        p.style.background = isPActive ? activeBg : 'var(--bg-card)';
        p.style.color = isPActive ? '#ffffff' : 'var(--text-title)';
        p.style.borderColor = isPActive ? activeBg : 'var(--border-color)';
        p.style.boxShadow = isPActive ? `0 4px 12px ${isTodas ? 'rgba(5, 150, 105, 0.35)' : 'rgba(37, 99, 235, 0.35)'}` : 'none';
        const sub = p.querySelector('.cisa-month-subval');
        if (sub) {
          sub.style.color = isPActive ? 'rgba(255, 255, 255, 0.92)' : 'var(--text-muted)';
        }
      });

      ruleCards.forEach(c => {
        c.setAttribute('aria-pressed', c.dataset.rule === state.regraAtiva ? 'true' : 'false');
      });
      if (cisaRegras[state.regraAtiva] && ruleNote) {
        const r = cisaRegras[state.regraAtiva];
        ruleNote.innerHTML = `<strong>${r.nome}.</strong> ${r.nota}`;
      }

      renderSusGauchoTable();
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
    savePrestacaoMonthlyStore();
    renderProcsTable();
    recalc();
  };
  const btnAddPTop = root.querySelector('#btnPcAddProcTop');
  if (btnAddPTop) btnAddPTop.onclick = handleAddProc;

  // Handler para Adicionar Consulta SUS Gaúcho
  const handleAddProcSusGaucho = () => {
    if (!state.procsSusGaucho) state.procsSusGaucho = [];
    state.procsSusGaucho.push({
      cod: '03.01.01.007-2',
      desc: 'Consulta médica em atenção especializada — Oftalmologia (Ambulatório Especial / Mutirão)',
      origem: 'SUS GAÚCHO',
      qtd: 50,
      val: 270.92,
      prestador: 'Dr. Christian Pretto',
      status: 'Realizado'
    });
    savePrestacaoMonthlyStore();
    renderSusGauchoTable();
    recalc();
  };
  const btnAddSG = root.querySelector('#btnPcAddProcSusGaucho');
  if (btnAddSG) btnAddSG.onclick = handleAddProcSusGaucho;

  const handleAddCusto = () => {
    const spec = (currentKey && currentKey !== 'todas') ? (SERVICOS_CISA[currentKey]?.nome || 'Oftalmologia') : 'Oftalmologia';
    const newCusto = { especialidade: spec, item: '', rateio: 100, qtd: 1, val: 0, classificacao: 'Pessoal' };
    state.custos.unshift(newCusto);
    editingCusto = newCusto;
    savePrestacaoMonthlyStore();
    renderCustosTable();
    recalc();
  };

  // Reset
  const handleReset = () => {
    if (confirm('Deseja restaurar os procedimentos e valores originais do Anexo 3 do CISA para o mês atual?')) {
      const defState = getPrestacaoDefaultState();
      state.procs = defState.procs;
      state.custos = defState.custos;
      state.regraAtiva = 'margem50';
      const curStore = getPrestacaoMonthlyStore(window.prestacaoSelectedMonth);
      curStore.procs = JSON.parse(JSON.stringify(defState.procs));
      curStore.custos = JSON.parse(JSON.stringify(defState.custos));
      curStore.regraAtiva = 'margem50';
      savePrestacaoMonthlyStore();
      renderProcsTable();
      renderCustosTable();
      recalc();
    }
  };
  const btnResetTop = root.querySelector('#btnPcResetTop');
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
  const btnCsvTop = root.querySelector('#btnPcExportCsvTop');
  if (btnCsvTop) btnCsvTop.onclick = handleCsv;

  // Imprimir
  const handlePrint = () => window.print();
  const btnPrintTop = root.querySelector('#btnPcPrintTop');
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

  const ruleCards = root.querySelectorAll('.pc-rule-card[data-rule]');
  const ruleNote = root.querySelector('#pcRuleNote');

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
      const curStore = getPrestacaoMonthlyStore(window.prestacaoSelectedMonth);
      curStore.regraAtiva = ruleKey;
      savePrestacaoMonthlyStore();
      recalc();
    };
  });

  // Primeira renderização
  renderSusGauchoTable();
  renderProcsTable();
  renderCustosTable();
  recalc();
}

window.renderPrestacaoViabilidade = renderPrestacaoViabilidade;

// ----------------------------------------------------------------------------
// EXPORTAÇÃO OFICIAL EM PDF: COMPROVANTE DOCUMENTAL DE CUSTOS & RATEIO CISA
// ----------------------------------------------------------------------------
window.exportPrestacaoCustosPDF = function() {
  const currentMonth = window.prestacaoSelectedMonth || '06';
  const monthNames = {
    '01': 'Janeiro/2026', '02': 'Fevereiro/2026', '03': 'Março/2026',
    '04': 'Abril/2026', '05': 'Maio/2026', '06': 'Junho/2026',
    '07': 'Julho/2026', '08': 'Agosto/2026', '09': 'Setembro/2026',
    '10': 'Outubro/2026', '11': 'Novembro/2026', '12': 'Dezembro/2026',
    '2026-01': 'Janeiro/2026', '2026-02': 'Fevereiro/2026', '2026-03': 'Março/2026',
    '2026-04': 'Abril/2026', '2026-05': 'Maio/2026', '2026-06': 'Junho/2026',
    '2026-07': 'Julho/2026', '2026-08': 'Agosto/2026', '2026-09': 'Setembro/2026',
    '2026-10': 'Outubro/2026', '2026-11': 'Novembro/2026', '2026-12': 'Dezembro/2026'
  };
  const compLabel = monthNames[currentMonth] || currentMonth;
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Pega as linhas renderizadas na tabela atual de custos
  const tb = document.getElementById('tbPcCustos');
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

  // Pega as linhas renderizadas na tabela atual de receitas (SUS Gaúcho & CISA)
  const tbReceitas = document.getElementById('tbPcSusGaucho');
  let receitasRowsHtml = '';
  if (tbReceitas) {
    const rRows = tbReceitas.querySelectorAll('tr');
    rRows.forEach(tr => {
      const cells = tr.querySelectorAll('td');
      if (cells.length < 4) return;
      const rubricaDiv = cells[0].querySelector('div:first-child span');
      const portariaDiv = cells[0].querySelector('div:last-child');
      const rubricaText = rubricaDiv ? rubricaDiv.innerText.trim() : cells[0].innerText.trim();
      const portariaText = portariaDiv ? portariaDiv.innerText.trim() : '';

      const dest = cells[1].innerText.trim().replace(/\n+/g, ' — ');
      const selStatus = cells[2].querySelector('.sg-select-status');
      const statusText = selStatus ? selStatus.value : cells[2].innerText.trim();
      
      let stBg = '#f1f5f9';
      let stColor = '#475569';
      if (statusText === 'Recebido FES') {
        stBg = '#eafaf1'; stColor = '#167b45';
      } else if (statusText === 'Aguardando Recurso') {
        stBg = '#fef6ea'; stColor = '#b86a04';
      } else if (statusText.toLowerCase().includes('pago')) {
        stBg = '#eff6ff'; stColor = '#1d4ed8';
      }

      const valTot = cells[3].innerText.trim();

      receitasRowsHtml += `
        <tr>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">
            <strong style="color: #0f172a; font-size: 9.5px; display: block;">${rubricaText}</strong>
            <span style="color: #2563eb; font-size: 8px; font-weight: 600;">${portariaText}</span>
          </td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 8.5px; color: #334155;">${dest}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; text-align: center;">
            <span style="display: inline-block; padding: 2px 7px; border-radius: 99px; font-size: 8px; font-weight: 800; background: ${stBg}; color: ${stColor}; border: 1px solid ${stColor}44;">
              ${statusText}
            </span>
          </td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: 800; color: #2563eb; font-size: 9.5px;">${valTot}</td>
        </tr>
      `;
    });
  }

  const totRecVal = document.getElementById('totPcRecSusGaucho') ? document.getElementById('totPcRecSusGaucho').innerText.trim() : (document.getElementById('pcHProd') ? document.getElementById('pcHProd').innerText.trim() : 'R$ 0,00');
  const subtotalVal = document.getElementById('totPcFixo') ? document.getElementById('totPcFixo').innerText.trim() : 'R$ 13.044,55';
  const recVal = totRecVal;
  const rateio80Val = document.getElementById('pcDRateioMed') ? document.getElementById('pcDRateioMed').innerText.trim() : 'R$ 0,00';
  const totalDespVal = document.getElementById('pcDTotalDesp') ? document.getElementById('pcDTotalDesp').innerText.trim() : 'R$ 0,00';

  const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const parseMoney = (txt) => parseFloat((txt || '0').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  const recNum = parseMoney(recVal);
  const subtotalNum = parseMoney(subtotalVal);
  const saldoNum = Math.max(0, recNum - subtotalNum);
  const saldoVal = BRL.format(saldoNum);
  const hosp20Val = BRL.format(saldoNum * 0.20);
  const rateio80Num = saldoNum * 0.80;
  const rateio40Num = rateio80Num / 2;
  const rateio40Val = BRL.format(rateio40Num);
  const unitChristianVal = BRL.format(rateio40Num / 150);
  const unitHeronVal = BRL.format(rateio40Num / 150);

  const printDoc = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório Oficial de Prestação de Contas e Faturamento - Hospital Bom Pastor</title>
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
      <img src="${(window.location.origin && window.location.origin !== 'null') ? window.location.origin + '/logo_hbp.jpg' : 'logo_hbp.jpg'}" alt="Logo Hospital Bom Pastor" class="logo-img">
      <div class="header-title">
        <h1>Hospital Bom Pastor • Santo Augusto / RS</h1>
        <h2>Relatório de Prestação de Contas e Controle de Faturamento</h2>
        <p>Demonstrativo Consolidado de Receitas, Custos Operacionais e Rateio Financeiro • Ambulatório de Oftalmologia</p>
      </div>
    </div>
    <div class="header-right">
      <div><strong>Competência:</strong> ${compLabel}</div>
      <div><strong>Emissão:</strong> ${dateFormatted}</div>
    </div>
  </div>

  <div class="meta-strip">
    <div><strong>Documento:</strong> PRESTAÇÃO DE CONTAS & CONTROLE DE FATURAMENTO</div>
    <div><strong>Modelo de Apuração:</strong> Rateio 80% Médico / 20% Hospital</div>
    <div><strong>Programas:</strong> SUS Gaúcho (Portaria SES/RS 611/26) & CISA</div>
  </div>

  <!-- SEÇÃO 1: RECEITAS E FATURAMENTO -->
  <div style="font-weight: 800; color: #1e3a8a; font-size: 9.5px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; justify-content: space-between;">
    <span>1. Demonstrativo de Receitas e Faturamento Pactuado</span>
    <span style="font-size: 8.5px; color: #2563eb;">Ambulatório de Oftalmologia</span>
  </div>
  <table class="table-custos" style="margin-bottom: 12px;">
    <thead>
      <tr>
        <th style="text-align: left; width: 42%;">Rubrica / Programa</th>
        <th style="text-align: left; width: 28%;">Origem / Destinação Orçamentária</th>
        <th style="text-align: center; width: 14%;">Status do Repasse</th>
        <th style="text-align: right; width: 16%;">Receita Faturada (R$)</th>
      </tr>
    </thead>
    <tbody>
      ${receitasRowsHtml}
      <tr style="background: #eff6ff; font-weight: 900; color: #1d4ed8; border-top: 2px solid #3b82f6;">
        <td colspan="3" style="padding: 6px 8px; border: 1px solid #cbd5e1; text-transform: uppercase;">
          TOTAL GERAL DAS RECEITAS FATURADAS
        </td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: right; font-size: 10px;">
          ${totRecVal}
        </td>
      </tr>
    </tbody>
  </table>

  <!-- SEÇÃO 2: CUSTOS OPERACIONAIS E RATEIO -->
  <div style="font-weight: 800; color: #991b1b; font-size: 9.5px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; justify-content: space-between;">
    <span>2. Demonstrativo de Rateio de Custos Operacionais Ambulatoriais</span>
    <span style="font-size: 8.5px; color: #dc2626;">Estrutura Compartilhada</span>
  </div>
  <table class="table-custos">
    <thead>
      <tr>
        <th style="text-align: left; width: 38%;">Função / Recurso Operacional</th>
        <th style="text-align: center; width: 14%;">Centro de Custo</th>
        <th style="text-align: center; width: 10%;">Rateio</th>
        <th style="text-align: center; width: 8%;">Qtd</th>
        <th style="text-align: right; width: 14%;">R$ Unitário</th>
        <th style="text-align: right; width: 16%;">Total/mês</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
      <tr class="subtotal-box">
        <td colspan="5" style="padding: 6px 8px; border: 1px solid #cbd5e1; text-transform: uppercase;">
          SUBTOTAL DE CUSTOS OPERACIONAIS RATEADOS PELA OFTALMOLOGIA
        </td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: right; font-size: 10px;">
          ${subtotalVal}
        </td>
      </tr>
    </tbody>
  </table>

  <!-- SEÇÃO 3: DEMONSTRATIVO FINANCEIRO E APURAÇÃO DE RATEIO -->
  <div class="neg-grid">
    <div class="neg-card">
      <h4>Demonstrativo de Receitas Faturadas</h4>
      <div class="neg-line"><span>SUS Gaúcho - Ambulatório Estratégico Oftalmologia:</span> <strong>${document.getElementById('pcHMutirao') ? document.getElementById('pcHMutirao').innerText.trim() : 'R$ 0,00'}</strong></div>
      <div class="neg-line"><span>Receita Consórcio CISA:</span> <strong>${document.getElementById('pcHCisa') ? document.getElementById('pcHCisa').innerText.trim() : 'R$ 0,00'}</strong></div>
      <div class="neg-line bold" style="color: #059669;"><span>Total de Receitas Faturadas:</span> <strong>${recVal}</strong></div>
    </div>
    <div class="neg-card">
      <h4>Consolidação de Despesas & Rateio (80% / 20%)</h4>
      <div class="neg-line"><span>Subtotal Custos Operacionais Rateados:</span> <strong>${subtotalVal}</strong></div>
      <div class="neg-line"><span>Saldo Bruto a Ratear (Receita − Despesas):</span> <strong style="color: #059669;">${saldoVal}</strong></div>
      <div class="neg-line"><span>Rateio 80% Médico(s) Prestador(es):</span> <strong style="color: #dc2626;">${rateio80Val}</strong></div>
      <div class="neg-line" style="padding-left: 10px; font-size: 7.5pt; color: #475569;">
        <span>↳ Dr. Christian Pretto (40% · 150 consultas):</span> <strong style="white-space: nowrap;">${rateio40Val}</strong>
      </div>
      <div class="neg-line" style="padding-left: 10px; font-size: 7.5pt; color: #475569;">
        <span>↳ Dr. Heron Gomes Correia (40% · 150 consultas):</span> <strong style="white-space: nowrap;">${rateio40Val}</strong>
      </div>
      <div class="neg-line"><span>Total Geral das Despesas:</span> <strong style="color: #dc2626;">${totalDespVal}</strong></div>
      <div class="neg-line bold" style="color: #059669; border-top: 1px dashed #cbd5e1; padding-top: 3px; margin-top: 3px;"><span>RESULTADO 20% HOSPITALAR:</span> <strong>${hosp20Val}</strong></div>
    </div>
  </div>

  <div class="signatures">
    <div class="sig-col">
      <strong>Hospital Bom Pastor de Santo Augusto</strong>
      Direção Hospitalar / Presidência
    </div>
    <div class="sig-col">
      <strong>Prestador Médico</strong>
      Responsável Técnico - Oftalmologia
    </div>
    <div class="sig-col">
      <strong>Contratualização SUS & Faturamento</strong>
      Auditoria e Controles Internos
    </div>
  </div>

  <div style="margin-top: 22px; padding-top: 10px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; align-items: center; font-size: 7.5pt; color: #64748b;">
    <div>
      <strong style="color: #1e3a8a;">FluxSUS - Sala de Situação / Módulo de Controle e Prestação de contas SUS © 2026</strong><br>
      FluxSUS® é uma marca registrada especializada em processos em saúde.
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 7pt; color: #94a3b8;">Tecnologia & Gestão em Saúde</span>
      <img src="logo_fluxsus.png" alt="FluxSUS" style="height: 24px; object-fit: contain;">
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

  return printDoc;
};

// ----------------------------------------------------------------------------
// 3. FICHA TÉCNICA OFICIAL DO SERVIÇO CISA (ANEXO 3 NATIVO)
// ----------------------------------------------------------------------------
function renderPrestacaoPortaria(key) {
  if (!key) key = window.currentPrestacaoKey || 'todas';
  window.currentPrestacaoKey = key;
  const isTodas = (key === 'todas');
  const container = document.getElementById('pcMainContent');
  if (!container) return;

  const allProcs = window.cisaContratoOficialProcs || (window.activePrestacaoSim && window.activePrestacaoSim.procs) || window.cisaSimState.procs;
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
    <div id="pcNativePortaria" style="display: flex; flex-direction: column; gap: 1.5rem;">
      
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

window.renderPrestacaoPortaria = renderPrestacaoPortaria;