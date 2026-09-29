/**
 * Módulo DENASUS - Departamento Nacional de Auditoria do SUS
 * Santa Casa de Caridade de Bagé (SCB)
 * Gestão e Acompanhamento do Comunicado de Auditoria nº 06 / Auditoria nº 20.307/2026
 * Versão com Checklist Retrátil, Anexos, Tabelas Estruturadas (Item D AIHs) e Relatório PDF Expandido
 */

(function () {
  'use strict';

  // Chave do LocalStorage para persistência do checklist
  const STORAGE_KEY = 'scb_denasus_checklist_v2026_r3';

  // Metadados Oficiais do Comunicado DENASUS
  const denasusMeta = {
    comunicadoNumero: 'Comunicado de Auditoria nº 6',
    auditoriaNumero: 'Auditoria n.º 20.307/2026',
    processoSei: '25000.104532/2026-93',
    seiNumero: '0057570172',
    crc: 'FD8751A9',
    dataEmissao: '21 de agosto de 2026',
    dataAssinaturaSei: '25/08/2026 às 14:56',
    orgaoAuditor: 'Serviço Nacional de Auditoria do SUS no Rio Grande do Sul – SEAUD/RS/DENASUS/MS',
    unidadeAuditada: 'Secretaria da Saúde do Estado do Rio Grande do Sul – SES/RS',
    unidadeVisitada: 'Santa Casa de Caridade de Bagé/RS (Rua Gomes Carneiro, 1350 – Bagé/RS • Fone: (53) 3240-3200)',
    periodoAuditado: 'Maio de 2025 a Junho de 2026 (14 meses)',
    prazoAtendimento: '10 (dez) dias úteis a contar da ciência/recebimento',
    formaEnvio: 'Preferencialmente eletrônico via sistema institucional ou pasta compartilhada SEAUD-RS-TRANF',
    emailInstitucional1: 'auditoria.semsrs@saude.gov.br',
    emailInstitucional2: 'matilde.nascimento@saude.gov.br',
    coordenadoraEquipe: 'Matilde Moreira do Nascimento (Coordenadora de Equipe)',
    contatoTelefone: '(51) 99890-1165',
    chefeSeaudRs: 'Leidiane Bello Ferreira de Jesus (Chefe do SEAUD/RS - DENASUS/MS)',
    responsavelAtendimento: 'Henry Ritta (Contratualização – Santa Casa de Caridade de Bagé)',
    emailResponsavel: 'id-henry.ritta@outlook.com.br',
    destinatarios: 'Lindonor Peruzzo (Provedor) e Ricardo Martins (Diretor Executivo)'
  };

  // Dados da Tabela de AIHs do Item D (conforme documento oficial anexo)
  const tabelaAihItemD = {
    titulo: 'Demonstrativo Consolidado de Produção Hospitalar (AIHs) — SIH/SUS',
    periodo: 'Competências de Maio de 2025 a Junho de 2026',
    colunas: [
      'Competência',
      'AIHs Apresentadas',
      'AIHs Aprovadas',
      'AIHs Rejeitadas',
      '% Rejeição',
      'Produção Apresentada (R$)',
      'Produção Aprovada (R$)',
      'Diferença Apresentada x Aprovada (R$)'
    ],
    linhas: [
      { comp: 'mai./2025', apresentadas: 730, aprovadas: 671, rejeitadas: 59, pctRej: '8,08%', vlrApresentado: '922.280,55', vlrAprovado: '795.677,65', dif: '126.602,90' },
      { comp: 'jun./2025', apresentadas: 682, aprovadas: 589, rejeitadas: 93, pctRej: '13,64%', vlrApresentado: '776.671,21', vlrAprovado: '650.817,78', dif: '125.853,43' },
      { comp: 'jul./2025', apresentadas: 581, aprovadas: 548, rejeitadas: 33, pctRej: '5,68%', vlrApresentado: '696.268,81', vlrAprovado: '670.838,07', dif: '25.430,74' },
      { comp: 'ago./2025', apresentadas: 735, aprovadas: 693, rejeitadas: 42, pctRej: '5,71%', vlrApresentado: '906.479,36', vlrAprovado: '905.530,74', dif: '948,62' },
      { comp: 'set./2025', apresentadas: 903, aprovadas: 812, rejeitadas: 91, pctRej: '10,08%', vlrApresentado: '1.474.147,05', vlrAprovado: '1.297.906,41', dif: '176.240,64' },
      { comp: 'out./2025', apresentadas: 791, aprovadas: 684, rejeitadas: 107, pctRej: '13,53%', vlrApresentado: '987.217,12', vlrAprovado: '737.347,36', dif: '249.869,76' },
      { comp: 'nov./2025', apresentadas: 637, aprovadas: 552, rejeitadas: 85, pctRej: '13,34%', vlrApresentado: '819.135,15', vlrAprovado: '688.084,98', dif: '131.050,17' },
      { comp: 'dez./2025', apresentadas: 701, aprovadas: 597, rejeitadas: 104, pctRej: '14,84%', vlrApresentado: '1.167.510,73', vlrAprovado: '914.469,03', dif: '253.041,70' },
      { comp: 'jan./2026', apresentadas: 634, aprovadas: 539, rejeitadas: 95, pctRej: '14,98%', vlrApresentado: '1.436.178,52', vlrAprovado: '823.487,25', dif: '612.691,27' },
      { comp: 'fev./2026', apresentadas: 506, aprovadas: 437, rejeitadas: 69, pctRej: '13,64%', vlrApresentado: '1.241.077,45', vlrAprovado: '710.505,92', dif: '530.571,53' },
      { comp: 'mar./2026', apresentadas: 790, aprovadas: 670, rejeitadas: 120, pctRej: '15,19%', vlrApresentado: '1.253.168,21', vlrAprovado: '1.042.019,81', dif: '211.148,40' },
      { comp: 'abr./2026', apresentadas: 672, aprovadas: 580, rejeitadas: 92, pctRej: '13,69%', vlrApresentado: '898.116,51', vlrAprovado: '710.970,45', dif: '187.146,06' },
      { comp: 'mai./2026', apresentadas: 725, aprovadas: 628, rejeitadas: 97, pctRej: '13,38%', vlrApresentado: '1.049.595,54', vlrAprovado: '859.086,08', dif: '190.509,46' },
      { comp: 'jun./2026', apresentadas: 654, aprovadas: 521, rejeitadas: 133, pctRej: '20,34%', vlrApresentado: '926.248,88', vlrAprovado: '715.290,52', dif: '210.958,36' }
    ],
    totais: {
      comp: 'TOTAL CONSOLIDADO',
      apresentadas: '9.741',
      aprovadas: '8.521',
      rejeitadas: '1.220',
      pctRej: '12,52%',
      vlrApresentado: '14.554.095,09',
      vlrAprovado: '11.522.032,05',
      dif: '3.032.063,04'
    },
    observacao: 'Os dados acima representam a produção hospitalar informada no Sistema de Informações Hospitalares do SUS – SIH/SUS, referente às competências de maio de 2025 a junho de 2026. A coluna "Diferença entre Apresentado e Aprovado" corresponde exclusivamente à diferença matemática entre os valores apresentados e aprovados, não sendo utilizada, neste demonstrativo, como sinônimo de glosa definitiva.'
  };

  // Itens Oficiais do Ofício DENASUS (Itens "a" até "p")
  const defaultItems = [
    {
      id: 'item_a',
      letra: 'a',
      tituloResumo: 'Listagem de Presidência e Direção com documentos comprobatórios e Cadastro (Anexo I)',
      textoIntegral: 'Listagem nominal dos ocupantes dos cargos de Presidência e Direção da Santa Casa de Caridade de Bagé que exerceram suas funções no período de maio de 2025 a junho de 2026, contendo: nome completo, CPF, cargo, período de gestão, endereço comercial, endereço residencial e telefone. Deverá ser acompanhada de cópia dos documentos comprobatórios dos atos de nomeação e/ou exoneração, bem como do preenchimento do Cadastro de Responsável (Anexo I);',
      setor: 'Presidência / Diretoria / RH',
      status: 'pendente',
      observacoes: '',
      respostaTexto: '',
      anexos: [],
      tabela: null
    },
    {
      id: 'item_b',
      letra: 'b',
      tituloResumo: 'Processos de pagamento na íntegra de serviços contratualizados (mai/25 a jun/26)',
      textoIntegral: 'Processos de pagamento, na íntegra, referentes à prestação dos serviços contratualizados, relativos ao período auditado;',
      setor: 'Financeiro / Contabilidade',
      status: 'pendente',
      observacoes: '',
      respostaTexto: '',
      anexos: [],
      tabela: null
    },
    {
      id: 'item_c',
      letra: 'c',
      tituloResumo: 'Contrato formal SES/RS e SCCB, anexos, aditivos, DOE e ato de designação do fiscal',
      textoIntegral: 'Instrumento formal de contratualização celebrado entre a Secretaria Estadual da Saúde do Rio Grande do Sul (SES/RS) e a Santa Casa de Caridade de Bagé, referente ao período de maio de 2025 a junho de 2026, acompanhado de seus respectivos anexos, termos aditivos, documentos descritivos e publicações no Diário Oficial do Estado, incluindo o ato de designação do responsável pela fiscalização do contrato;',
      setor: 'Contratualização / Jurídico',
      status: 'pendente',
      observacoes: '',
      respostaTexto: '',
      anexos: [],
      tabela: null
    },
    {
      id: 'item_d',
      letra: 'd',
      tituloResumo: 'Quantitativo da produção ambulatorial e hospitalar informada (mai/25 a jun/26)',
      textoIntegral: 'Quantitativo da produção ambulatorial e hospitalar informada pela Santa Casa de Caridade de Bagé, referente ao período de maio de 2025 a junho de 2026;',
      setor: 'Faturamento SUS (SIA / SIH)',
      status: 'concluido',
      observacoes: 'Tabela de AIHs SIH/SUS gerada e anexada com 14 meses (mai/25 a jun/26). Média de 695 apresentadas/mês.',
      respostaTexto: 'Em cumprimento à solicitação do item "d" do Comunicado de Auditoria nº 6 (Auditoria n.º 20.307/2026), apresentamos o demonstrativo consolidado da produção hospitalar informada pela Santa Casa de Caridade de Bagé no Sistema de Informações Hospitalares do SUS (SIH/SUS), abrangendo integralmente o período de maio de 2025 a junho de 2026. O demonstrativo discrimina mês a mês o quantitativo de AIHs apresentadas, aprovadas e rejeitadas, assim como os montantes financeiros apresentados e aprovados, totalizando 9.741 AIHs apresentadas e R$ 11.522.032,05 em produção aprovada.',
      anexos: [
        { nome: 'Demonstrativo_Producao_Hospitalar_AIH_SIH_mai25_jun26.pdf', tipo: 'PDF', tamanho: '348 KB', data: '29/09/2026', url: 'docs/tabela_aih_denasus_mai25_jun26.jpg' },
        { nome: 'Relatorio_Auditoria_AIH_Rejeitadas_Divergencias.xlsx', tipo: 'XLSX', tamanho: '512 KB', data: '29/09/2026', url: '#' }
      ],
      tabela: tabelaAihItemD
    },
    {
      id: 'item_e',
      letra: 'e',
      tituloResumo: 'Relação do número de leitos hospitalares disponibilizados ao SUS no período',
      textoIntegral: 'Relação do número de leitos disponibilizados ao SUS durante o período auditado;',
      setor: 'Diretoria Técnica / NIR / CNES',
      status: 'pendente',
      observacoes: '',
      respostaTexto: '',
      anexos: [],
      tabela: null
    },
    {
      id: 'item_f',
      letra: 'f',
      tituloResumo: 'Relação do número de equipamentos disponibilizados ao SUS durante o período auditado',
      textoIntegral: 'Relação do número de equipamentos disponibilizados ao SUS durante o período auditado;',
      setor: 'Engenharia Clínica / Patrimônio',
      status: 'pendente',
      observacoes: '',
      respostaTexto: '',
      anexos: [],
      tabela: null
    },
    {
      id: 'item_g',
      letra: 'g',
      tituloResumo: 'Relação nominal de profissionais vinculados ao Contrato nº 2025/1147.0.00/2025 e aditivos',
      textoIntegral: 'Relação nominal dos profissionais que atuam ou atuaram na Santa Casa de Caridade de Bagé durante o período auditado, contendo cargo, vínculo, regime de trabalho e período de atuação, relativamente ao Contrato nº 2025/1147.0.00/2025 e respectivos termos aditivos;',
      setor: 'Recursos Humanos / DP',
      status: 'pendente',
      observacoes: '',
      respostaTexto: '',
      anexos: [],
      tabela: null
    },
    {
      id: 'item_h',
      letra: 'h',
      tituloResumo: 'Escalas de trabalho dos profissionais (com identificação, cargo e regime)',
      textoIntegral: 'Escalas de trabalho dos profissionais que atuam ou atuaram durante o período auditado, contendo a identificação do profissional, cargo e regime de trabalho;',
      setor: 'RH / Coordenação de Enfermagem / Médica',
      status: 'pendente',
      observacoes: '',
      respostaTexto: '',
      anexos: [],
      tabela: null
    },
    {
      id: 'item_i',
      letra: 'i',
      tituloResumo: 'Registros de controle de frequência / ponto dos profissionais atuantes no período',
      textoIntegral: 'Registros de controle de frequência dos profissionais que atuam ou atuaram durante o período auditado;',
      setor: 'Recursos Humanos / Ponto',
      status: 'pendente',
      observacoes: '',
      respostaTexto: '',
      anexos: [],
      tabela: null
    },
    {
      id: 'item_j',
      letra: 'j',
      tituloResumo: 'Processos de contratação, acompanhamento e pagamento dos profissionais terceirizados/PJ',
      textoIntegral: 'Processos de contratação, acompanhamento e pagamento dos profissionais contratados, relativos ao período auditado;',
      setor: 'RH / Compras / Financeiro',
      status: 'pendente',
      observacoes: '',
      respostaTexto: '',
      anexos: [],
      tabela: null
    },
    {
      id: 'item_k',
      letra: 'k',
      tituloResumo: 'Relatórios da Ouvidoria contendo denúncias e reclamações recebidas no período auditado',
      textoIntegral: 'Relatórios da Ouvidoria, contendo os registros de denúncias e reclamações recebidos no período auditado;',
      setor: 'Ouvidoria / SAC',
      status: 'pendente',
      observacoes: '',
      respostaTexto: '',
      anexos: [],
      tabela: null
    },
    {
      id: 'item_l',
      letra: 'l',
      tituloResumo: 'Relação nominal dos médicos obstetras com CRM, especialidade, vínculo e atuação',
      textoIntegral: 'Relação nominal dos médicos da especialidade de obstetrícia, contendo especialidade, vínculo, regime de trabalho, registro no respectivo conselho profissional e período de atuação;',
      setor: 'Corpo Clínico / Maternidade / RH',
      status: 'pendente',
      observacoes: '',
      respostaTexto: '',
      anexos: [],
      tabela: null
    },
    {
      id: 'item_m',
      letra: 'm',
      tituloResumo: 'Dados de produção e demanda assistencial da obstetrícia (incluindo urgência/emergência)',
      textoIntegral: 'Dados de produção e demanda assistencial da obstetrícia, incluindo os atendimentos de urgência e emergência realizados durante o período auditado;',
      setor: 'Faturamento / Centro Obstétrico / NIR',
      status: 'pendente',
      observacoes: '',
      respostaTexto: '',
      anexos: [],
      tabela: null
    },
    {
      id: 'item_n',
      letra: 'n',
      tituloResumo: 'Registros de atrasos/parcelamentos de pagamentos a profissionais e paralisações c/ providências',
      textoIntegral: 'Registros de atrasos ou parcelamentos de pagamentos aos profissionais, bem como de eventuais paralisações, suspensões ou reduções de atendimentos e procedimentos, acompanhados das respectivas providências adotadas pela instituição;',
      setor: 'Diretoria Executiva / Financeiro / Jurídico',
      status: 'pendente',
      observacoes: '',
      respostaTexto: '',
      anexos: [],
      tabela: null
    },
    {
      id: 'item_o',
      letra: 'o',
      tituloResumo: 'Comprovantes e certidões de obrigações sociais, trabalhistas, previdenciárias e fiscais',
      textoIntegral: 'Documentos comprobatórios do cumprimento das obrigações sociais, trabalhistas, previdenciárias, tributárias e fiscais, incluindo certidões e comprovantes de regularidade, bem como documentos relativos a eventuais pendências e às respectivas providências de regularização, referentes ao período auditado;',
      setor: 'Fiscal / Contabilidade / Jurídico',
      status: 'pendente',
      observacoes: '',
      respostaTexto: '',
      anexos: [],
      tabela: null
    },
    {
      id: 'item_p',
      letra: 'p',
      tituloResumo: 'Plano de Ação formalizado de saneamento de irregularidades apontadas por órgãos fiscalizadores',
      textoIntegral: 'Plano de Ação formalizado pela Santa Casa de Caridade de Bagé, contendo as medidas adotadas e/ou previstas para o saneamento de irregularidades, não conformidades ou fragilidades identificadas por órgãos de fiscalização, controle ou supervisão, incluindo ações, prazos, responsáveis, situação de implementação e respectivos documentos comprobatórios de acompanhamento e execução.',
      setor: 'Governança / Qualidade / Contratualização',
      status: 'pendente',
      observacoes: '',
      respostaTexto: '',
      anexos: [],
      tabela: null
    }
  ];

  // Carrega itens com migração inteligente preservando novos campos
  function loadChecklistData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === defaultItems.length) {
          return defaultItems.map(item => {
            const found = parsed.find(p => p.id === item.id);
            if (found) {
              return {
                ...item,
                status: found.status || item.status,
                observacoes: found.observacoes || item.observacoes,
                respostaTexto: (found.respostaTexto !== undefined && found.respostaTexto !== '') ? found.respostaTexto : item.respostaTexto,
                anexos: (found.anexos && found.anexos.length > 0) ? found.anexos : (item.anexos || []),
                tabela: item.tabela || found.tabela || null,
                isExpanded: !!found.isExpanded
              };
            }
            return item;
          });
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar dados do checklist DENASUS do localStorage:', e);
    }
    return JSON.parse(JSON.stringify(defaultItems));
  }

  // Estado global do módulo
  let items = loadChecklistData();
  let currentFilter = 'todos'; // 'todos', 'pendente', 'em_analise', 'concluido'
  let searchQuery = '';

  function saveChecklistData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Erro ao salvar checklist no localStorage:', e);
    }
  }

  // Calcula estatísticas
  function getStats() {
    const total = items.length;
    const concluidos = items.filter(i => i.status === 'concluido').length;
    const emAnalise = items.filter(i => i.status === 'em_analise').length;
    const pendentes = items.filter(i => i.status === 'pendente').length;
    const percentual = total > 0 ? Math.round((concluidos / total) * 100) : 0;
    return { total, concluidos, emAnalise, pendentes, percentual };
  }

  // Renderiza tabela HTML estilizada
  function renderTabelaHtml(tab) {
    if (!tab || !tab.linhas) return '';

    let headerHtml = tab.colunas.map((col, idx) => {
      const align = idx === 0 ? 'left' : (idx === 4 ? 'center' : 'right');
      return `<th style="padding: 7px 9px; font-size: 0.76rem; font-weight: 800; background: #0284c7; color: #ffffff; text-align: ${align}; border-right: 1px solid rgba(255,255,255,0.15);">${col}</th>`;
    }).join('');

    let rowsHtml = tab.linhas.map((row, rIdx) => {
      const bg = rIdx % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-body)';
      return `
        <tr style="background: ${bg}; border-bottom: 1px solid var(--border-color);">
          <td style="padding: 6px 9px; font-weight: 700; color: var(--text-title); font-size: 0.78rem;">${row.comp}</td>
          <td style="padding: 6px 9px; text-align: right; font-size: 0.78rem;">${row.apresentadas.toLocaleString('pt-BR')}</td>
          <td style="padding: 6px 9px; text-align: right; font-weight: 700; color: #10b981; font-size: 0.78rem;">${row.aprovadas.toLocaleString('pt-BR')}</td>
          <td style="padding: 6px 9px; text-align: right; color: #ef4444; font-weight: 600; font-size: 0.78rem;">${row.rejeitadas.toLocaleString('pt-BR')}</td>
          <td style="padding: 6px 9px; text-align: center; font-weight: 700; font-size: 0.78rem;">
            <span style="background: rgba(239, 68, 68, 0.1); color: #dc2626; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem;">${row.pctRej}</span>
          </td>
          <td style="padding: 6px 9px; text-align: right; font-size: 0.78rem;">${row.vlrApresentado}</td>
          <td style="padding: 6px 9px; text-align: right; font-weight: 700; color: var(--text-title); font-size: 0.78rem;">${row.vlrAprovado}</td>
          <td style="padding: 6px 9px; text-align: right; font-weight: 700; color: #dc2626; font-size: 0.78rem;">${row.dif}</td>
        </tr>
      `;
    }).join('');

    let totalHtml = '';
    if (tab.totais) {
      totalHtml = `
        <tr style="background: #0f172a; color: #ffffff; font-weight: 900; border-top: 2px solid #0284c7;">
          <td style="padding: 8px 9px; font-size: 0.8rem; text-transform: uppercase;">${tab.totais.comp}</td>
          <td style="padding: 8px 9px; text-align: right; font-size: 0.8rem;">${tab.totais.apresentadas}</td>
          <td style="padding: 8px 9px; text-align: right; color: #4ade80; font-size: 0.8rem;">${tab.totais.aprovadas}</td>
          <td style="padding: 8px 9px; text-align: right; color: #f87171; font-size: 0.8rem;">${tab.totais.rejeitadas}</td>
          <td style="padding: 8px 9px; text-align: center; color: #fde047; font-size: 0.8rem;">${tab.totais.pctRej}</td>
          <td style="padding: 8px 9px; text-align: right; font-size: 0.8rem;">${tab.totais.vlrApresentado}</td>
          <td style="padding: 8px 9px; text-align: right; color: #4ade80; font-size: 0.8rem;">${tab.totais.vlrAprovado}</td>
          <td style="padding: 8px 9px; text-align: right; color: #f87171; font-size: 0.8rem;">${tab.totais.dif}</td>
        </tr>
      `;
    }

    return `
      <div style="margin: 0.85rem 0; border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; background: var(--bg-card); box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
        <div style="background: linear-gradient(135deg, rgba(2, 132, 199, 0.1) 0%, rgba(2, 132, 199, 0.03) 100%); padding: 0.65rem 1rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <strong style="font-size: 0.85rem; color: var(--text-title); display: flex; align-items: center; gap: 6px;">
              <i data-lucide="table" style="width: 15px; height: 15px; color: #0284c7;"></i>
              ${tab.titulo}
            </strong>
            <span style="font-size: 0.74rem; color: var(--text-muted);">${tab.periodo}</span>
          </div>
          <span class="badge-sus" style="background: rgba(2, 132, 199, 0.15); color: #0284c7; font-weight: 800; font-size: 0.72rem; padding: 0.2rem 0.55rem; border-radius: 6px;">
            14 Competências Processadas
          </span>
        </div>
        <div class="table-responsive" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-family: inherit;">
            <thead><tr>${headerHtml}</tr></thead>
            <tbody>
              ${rowsHtml}
              ${totalHtml}
            </tbody>
          </table>
        </div>
        ${tab.observacao ? `
          <div style="padding: 0.65rem 1rem; background: var(--bg-body); border-top: 1px dashed var(--border-color); font-size: 0.76rem; color: var(--text-muted); line-height: 1.45;">
            <strong style="color: var(--text-title);">Observação Oficial:</strong> ${tab.observacao}
          </div>
        ` : ''}
      </div>
    `;
  }

  // Atualiza a interface
  function updateUI() {
    const stats = getStats();

    // 1. Atualizar Barra de Progresso e Percentual
    const barEl = document.getElementById('denasusProgressBar');
    const pctEl = document.getElementById('denasusProgressPct');
    const countEl = document.getElementById('denasusProgressCount');
    const badgeStatusEl = document.getElementById('denasusGlobalStatusBadge');

    if (barEl) {
      barEl.style.width = `${stats.percentual}%`;
      if (stats.percentual === 100) {
        barEl.style.background = 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
      } else if (stats.percentual >= 50) {
        barEl.style.background = 'linear-gradient(90deg, #0284c7 0%, #10b981 100%)';
      } else {
        barEl.style.background = 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)';
      }
    }

    if (pctEl) pctEl.innerText = `${stats.percentual}%`;
    if (countEl) countEl.innerText = `${stats.concluidos} de ${stats.total} itens concluídos`;

    if (badgeStatusEl) {
      if (stats.percentual === 100) {
        badgeStatusEl.innerHTML = '<i data-lucide="check-check" style="width: 14px; height: 14px;"></i> Auditoria 100% Instruída';
        badgeStatusEl.style.background = 'rgba(16, 185, 129, 0.15)';
        badgeStatusEl.style.color = '#10b981';
      } else if (stats.percentual > 0) {
        badgeStatusEl.innerHTML = '<i data-lucide="clock" style="width: 14px; height: 14px;"></i> Atendimento em Andamento';
        badgeStatusEl.style.background = 'rgba(2, 132, 199, 0.15)';
        badgeStatusEl.style.color = '#0284c7';
      } else {
        badgeStatusEl.innerHTML = '<i data-lucide="alert-circle" style="width: 14px; height: 14px;"></i> Diligência Recebida - Prazo Aberto';
        badgeStatusEl.style.background = 'rgba(245, 158, 11, 0.15)';
        badgeStatusEl.style.color = '#f59e0b';
      }
    }

    // 2. Atualizar KPI Cards
    const kpiConcluidos = document.getElementById('denasusKpiConcluidos');
    const kpiAnalise = document.getElementById('denasusKpiAnalise');
    const kpiPendentes = document.getElementById('denasusKpiPendentes');
    if (kpiConcluidos) kpiConcluidos.innerText = stats.concluidos;
    if (kpiAnalise) kpiAnalise.innerText = stats.emAnalise;
    if (kpiPendentes) kpiPendentes.innerText = stats.pendentes;

    // 3. Renderizar Lista de Itens do Checklist
    renderChecklistRows();

    // Re-renderiza ícones lucide
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  // Renderiza as linhas do checklist com funcionalidade retrátil
  function renderChecklistRows() {
    const container = document.getElementById('denasusChecklistContainer');
    if (!container) return;

    let filtered = items.filter(item => {
      if (currentFilter !== 'todos' && item.status !== currentFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const inLetter = item.letra.toLowerCase().includes(q);
        const inResumo = item.tituloResumo.toLowerCase().includes(q);
        const inFull = item.textoIntegral.toLowerCase().includes(q);
        const inSetor = item.setor.toLowerCase().includes(q);
        const inObs = (item.observacoes || '').toLowerCase().includes(q);
        const inResp = (item.respostaTexto || '').toLowerCase().includes(q);
        return inLetter || inResumo || inFull || inSetor || inObs || inResp;
      }
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="padding: 2.5rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <i data-lucide="search-x" style="width: 38px; height: 38px; margin-bottom: 0.5rem; opacity: 0.6;"></i>
          <p style="margin: 0; font-size: 0.95rem; font-weight: 600;">Nenhum item encontrado com os filtros aplicados.</p>
          <button onclick="window.denasusSetFilter('todos')" class="btn-icon" style="margin-top: 0.75rem; width: auto; padding: 0.4rem 0.9rem; font-size: 0.8rem;">Limpar Filtros</button>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(item => {
      const isConcluido = item.status === 'concluido';
      const isAnalise = item.status === 'em_analise';
      const isPendente = item.status === 'pendente';
      const isExpanded = !!item.isExpanded;

      let statusBadge = '';
      let rowBorderColor = 'var(--border-color)';
      let rowBg = 'var(--bg-card)';

      if (isConcluido) {
        statusBadge = `<span class="badge-sus" style="background: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); font-weight: 700; font-size: 0.72rem; padding: 0.2rem 0.6rem; border-radius: 99px;"><i data-lucide="check" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i> Concluído</span>`;
        rowBorderColor = 'rgba(16, 185, 129, 0.35)';
        rowBg = 'rgba(16, 185, 129, 0.02)';
      } else if (isAnalise) {
        statusBadge = `<span class="badge-sus" style="background: rgba(245, 158, 11, 0.12); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); font-weight: 700; font-size: 0.72rem; padding: 0.2rem 0.6rem; border-radius: 99px;"><i data-lucide="loader" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i> Em Preparação</span>`;
        rowBorderColor = 'rgba(245, 158, 11, 0.35)';
        rowBg = 'rgba(245, 158, 11, 0.02)';
      } else {
        statusBadge = `<span class="badge-sus" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.25); font-weight: 700; font-size: 0.72rem; padding: 0.2rem 0.6rem; border-radius: 99px;"><i data-lucide="alert-circle" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i> Pendente</span>`;
      }

      // Contagem de anexos / tabelas
      const numAnexos = (item.anexos ? item.anexos.length : 0) + (item.tabela ? 1 : 0);
      const temResposta = !!(item.respostaTexto && item.respostaTexto.trim());

      // Render anexos list
      let anexosHtml = '';
      if (item.anexos && item.anexos.length > 0) {
        anexosHtml = item.anexos.map((anexo, aIdx) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 0.4rem; font-size: 0.78rem;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <i data-lucide="file-check" style="width: 15px; height: 15px; color: #0284c7;"></i>
              <strong style="color: var(--text-title);">${anexo.nome}</strong>
              <span style="font-size: 0.72rem; color: var(--text-muted); background: var(--bg-body); padding: 1px 6px; border-radius: 4px;">${anexo.tipo} · ${anexo.tamanho}</span>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span style="font-size: 0.72rem; color: var(--text-muted);">${anexo.data}</span>
              ${anexo.url && anexo.url !== '#' ? `
                <a href="${anexo.url}" target="_blank" class="btn-icon" style="width: auto; padding: 2px 8px; font-size: 0.72rem; text-decoration: none;" title="Abrir anexo">
                  <i data-lucide="external-link" style="width: 12px; height: 12px;"></i> Visualizar
                </a>
              ` : ''}
              <button type="button" onclick="window.denasusRemoveAnexo('${item.id}', ${aIdx})" style="border: none; background: transparent; color: #ef4444; cursor: pointer; padding: 2px;" title="Remover anexo">
                <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
              </button>
            </div>
          </div>
        `).join('');
      }

      // Render tabela vinculada se houver (Item D)
      let tabelaComponentHtml = '';
      if (item.tabela) {
        tabelaComponentHtml = renderTabelaHtml(item.tabela);
      }

      html += `
        <div class="card denasus-item-card" id="card-${item.id}" style="margin-bottom: 0.95rem; border: 1px solid ${rowBorderColor}; background: ${rowBg}; border-radius: 10px; transition: all 0.2s ease; overflow: visible !important;">
          
          <!-- Cabeçalho Principal do Item -->
          <div style="padding: 1.1rem 1.35rem; display: flex; gap: 1rem; align-items: flex-start; justify-content: space-between; flex-wrap: wrap;">
            
            <!-- Checkbox & Título Resumo -->
            <div style="display: flex; gap: 0.85rem; align-items: flex-start; flex: 1 1 500px;">
              <div style="margin-top: 2px;">
                <input type="checkbox" id="chk-${item.id}" ${isConcluido ? 'checked' : ''} onchange="window.denasusToggleItem('${item.id}')" style="width: 20px; height: 20px; cursor: pointer; accent-color: #10b981; border-radius: 4px;">
              </div>
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.35rem;">
                  <span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px; background: rgba(2, 132, 199, 0.12); color: #0284c7; font-weight: 800; font-size: 0.85rem;">
                    ${item.letra.toUpperCase()}
                  </span>
                  <span style="font-weight: 800; font-size: 0.95rem; color: var(--text-title); ${isConcluido ? 'text-decoration: line-through; opacity: 0.85;' : ''}">
                    ${item.tituloResumo}
                  </span>
                  ${statusBadge}
                </div>

                <!-- SINALIZADOR DE OBSERVAÇÃO / TOOLTIP DE TEXTO INTEGRAL (Exigência do Usuário) -->
                <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.4rem;">
                  <div class="denasus-tooltip-wrap" style="position: relative; display: inline-block; z-index: 90;">
                    <button type="button" class="denasus-btn-hover-obs" onclick="window.denasusOpenFullTextModal('${item.id}')" title="Passe o mouse ou clique para ver o texto literal e completo deste item do ofício">
                      <i data-lucide="info" style="width: 14px; height: 14px; color: #0284c7;"></i>
                      <span>Texto Integral do Ofício DENASUS</span>
                    </button>
                    <!-- Tooltip Hover Flutuante posicionado abaixo com arrow up -->
                    <div class="denasus-hover-tooltip">
                      <div class="tooltip-header">
                        <i data-lucide="file-text" style="width: 14px; height: 14px;"></i>
                        <strong>Item ${item.letra.toUpperCase()} — Texto Literal do Ofício DENASUS:</strong>
                      </div>
                      <div class="tooltip-body">
                        ${item.textoIntegral}
                      </div>
                      <div class="tooltip-footer">
                        <span>Auditoria n.º 20.307/2026 • SEI nº 0057570172</span>
                      </div>
                    </div>
                  </div>

                  <!-- Badge do Setor Responsável Interno -->
                  <span style="font-size: 0.75rem; color: var(--text-muted); background: var(--bg-card-hover); padding: 0.2rem 0.6rem; border-radius: 6px; border: 1px solid var(--border-color); display: inline-flex; align-items: center; gap: 4px;">
                    <i data-lucide="building" style="width: 12px; height: 12px; opacity: 0.7;"></i>
                    Setor: <strong>${item.setor}</strong>
                  </span>

                  ${numAnexos > 0 ? `
                    <span style="font-size: 0.73rem; color: #0284c7; background: rgba(2, 132, 199, 0.08); padding: 0.2rem 0.55rem; border-radius: 6px; border: 1px solid rgba(2, 132, 199, 0.25); display: inline-flex; align-items: center; gap: 4px;">
                      <i data-lucide="paperclip" style="width: 12px; height: 12px;"></i> ${numAnexos} anexo(s)/tabela(s)
                    </span>
                  ` : ''}
                </div>
              </div>
            </div>

            <!-- Controles: Status & Botão de Abrir Resposta Retrátil -->
            <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
              <select onchange="window.denasusChangeStatus('${item.id}', this.value)" style="padding: 0.35rem 0.65rem; font-size: 0.78rem; font-weight: 700; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-title); cursor: pointer;">
                <option value="pendente" ${item.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                <option value="em_analise" ${item.status === 'em_analise' ? 'selected' : ''}>Em Preparação / Análise</option>
                <option value="concluido" ${item.status === 'concluido' ? 'selected' : ''}>Concluído / Atendido</option>
              </select>

              <!-- Botão Accordion Retrátil: Expandir / Ocultar Resposta e Anexos -->
              <button type="button" onclick="window.denasusToggleAccordion('${item.id}')" class="btn-primary" style="padding: 0.35rem 0.85rem; font-size: 0.78rem; background: ${isExpanded ? '#0f172a' : '#0284c7'}; border-color: ${isExpanded ? '#334155' : '#0369a1'}; display: flex; align-items: center; gap: 6px;" title="Expandir ou recolher a resposta formal e anexos deste item">
                <i data-lucide="${isExpanded ? 'chevron-up' : 'folder-open'}" style="width: 14px; height: 14px;"></i>
                <span>${isExpanded ? 'Ocultar Resposta' : (temResposta || numAnexos > 0 ? 'Ver Resposta & Anexos' : 'Adicionar Resposta')}</span>
              </button>
            </div>
          </div>

          <!-- GAVETA RETRÁTIL: RESPOSTA FORMAL, TABELAS E ARQUIVOS ANEXADOS -->
          <div id="drawer-${item.id}" style="display: ${isExpanded ? 'block' : 'none'}; padding: 1.1rem 1.35rem 1.35rem 1.35rem; background: var(--bg-body); border-top: 1px solid var(--border-color); border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; animation: fadeIn 0.2s ease;">
            
            <!-- 1. Campo de Resposta Formal / Justificativa Institucional -->
            <div style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.5rem;">
                <label style="font-size: 0.78rem; font-weight: 800; color: var(--text-title); display: flex; align-items: center; gap: 5px;">
                  <i data-lucide="file-edit" style="width: 14px; height: 14px; color: #0284c7;"></i>
                  Resposta Institucional Formal (Santa Casa de Bagé):
                </label>
                <span style="font-size: 0.72rem; color: var(--text-muted);">Esta resposta será impressa integralmente no relatório em PDF</span>
              </div>
              <textarea id="textarea-resposta-${item.id}" rows="3" placeholder="Redija aqui o texto da resposta institucional, esclarecimentos, metodologia ou dados apresentados ao DENASUS..." style="width: 100%; padding: 0.65rem 0.85rem; font-size: 0.84rem; line-height: 1.5; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-title); font-family: inherit; resize: vertical;">${item.respostaTexto || ''}</textarea>
              <div style="display: flex; justify-content: flex-end; margin-top: 0.4rem;">
                <button type="button" class="btn-primary" style="padding: 0.35rem 0.85rem; font-size: 0.76rem;" onclick="window.denasusSaveResposta('${item.id}')">
                  <i data-lucide="save" style="width: 13px; height: 13px;"></i> Salvar Resposta
                </button>
              </div>
            </div>

            <!-- 2. Tabela de Dados Estruturada (Ex: Item D - AIHs) -->
            ${tabelaComponentHtml}

            <!-- 3. Arquivos e Documentos Anexados -->
            <div style="margin-top: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                <span style="font-size: 0.78rem; font-weight: 800; color: var(--text-title); display: flex; align-items: center; gap: 5px;">
                  <i data-lucide="paperclip" style="width: 14px; height: 14px; color: #0284c7;"></i>
                  Documentos & Arquivos Anexos Comprobatórios:
                </span>
                <button type="button" onclick="window.denasusPromptAddAnexo('${item.id}')" class="btn-icon" style="width: auto; padding: 0.3rem 0.7rem; font-size: 0.74rem; display: flex; align-items: center; gap: 4px;">
                  <i data-lucide="plus-circle" style="width: 13px; height: 13px; color: #0284c7;"></i> Anexar Arquivo / Tabela
                </button>
              </div>
              <div id="anexos-list-${item.id}">
                ${anexosHtml || '<div style="font-size: 0.78rem; color: var(--text-muted); font-style: italic; padding: 0.4rem 0;">Nenhum arquivo avulso anexado a este item.</div>'}
              </div>
            </div>

            <!-- 4. Notas Internas Rápidas -->
            <div style="margin-top: 0.85rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-color);">
              <label style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">
                Anotações Internas da Equipe / Lembretes:
              </label>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="input-note-${item.id}" value="${(item.observacoes || '').replace(/"/g, '&quot;')}" placeholder="Ex: Arquivo salvo na pasta da Contratualização / Aguardando conferência do Faturamento..." style="flex: 1; padding: 0.4rem 0.65rem; font-size: 0.8rem; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-title);" onkeydown="if(event.key === 'Enter') window.denasusSaveNote('${item.id}')">
                <button type="button" class="btn-icon" style="width: auto; padding: 0.4rem 0.85rem; font-size: 0.76rem;" onclick="window.denasusSaveNote('${item.id}')">
                  Salvar Nota
                </button>
              </div>
            </div>

            <!-- Botão de Recolher no Rodapé do Card -->
            <div style="display: flex; justify-content: center; margin-top: 1rem;">
              <button type="button" onclick="window.denasusToggleAccordion('${item.id}')" style="background: transparent; border: none; color: var(--text-muted); font-size: 0.74rem; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 4px 8px;">
                <i data-lucide="chevron-up" style="width: 14px; height: 14px;"></i> Recolher Resposta
              </button>
            </div>

          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // Ações globais exportadas no objeto window
  window.denasusToggleAccordion = function (id) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.isExpanded = !item.isExpanded;
    saveChecklistData();
    renderChecklistRows();
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  };

  window.denasusExpandAll = function (expand) {
    items.forEach(i => i.isExpanded = expand);
    saveChecklistData();
    renderChecklistRows();
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  };

  window.denasusSaveResposta = function (id) {
    const textarea = document.getElementById(`textarea-resposta-${id}`);
    if (!textarea) return;
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.respostaTexto = textarea.value.trim();
    saveChecklistData();
    alert('Resposta oficial salva com sucesso para este item!');
  };

  window.denasusPromptAddAnexo = function (id) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const nome = prompt('Nome do arquivo ou documento anexo (ex: Planilha_Producao_Consolidada.xlsx):');
    if (!nome || !nome.trim()) return;
    const tipo = prompt('Tipo / Formato do documento (ex: PDF, XLSX, DOCX, ZIP):', 'PDF') || 'DOC';
    const tamanho = prompt('Tamanho aproximado (ex: 450 KB, 2.1 MB):', '1.0 MB') || '';

    if (!item.anexos) item.anexos = [];
    item.anexos.push({
      nome: nome.trim(),
      tipo: tipo.trim().toUpperCase(),
      tamanho: tamanho.trim(),
      data: new Date().toLocaleDateString('pt-BR'),
      url: '#'
    });

    saveChecklistData();
    renderChecklistRows();
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  };

  window.denasusRemoveAnexo = function (itemId, anexoIndex) {
    const item = items.find(i => i.id === itemId);
    if (!item || !item.anexos) return;
    if (confirm('Deseja realmente remover este arquivo anexo?')) {
      item.anexos.splice(anexoIndex, 1);
      saveChecklistData();
      renderChecklistRows();
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    }
  };

  window.denasusToggleItem = function (id) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (item.status === 'concluido') {
      item.status = 'pendente';
    } else {
      item.status = 'concluido';
    }
    saveChecklistData();
    updateUI();
  };

  window.denasusChangeStatus = function (id, newStatus) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.status = newStatus;
    saveChecklistData();
    updateUI();
  };

  window.denasusSaveNote = function (id) {
    const input = document.getElementById(`input-note-${id}`);
    if (!input) return;
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.observacoes = input.value.trim();
    saveChecklistData();
    updateUI();
  };

  window.denasusSetFilter = function (filter) {
    currentFilter = filter;
    document.querySelectorAll('.denasus-filter-btn').forEach(btn => {
      if (btn.getAttribute('data-filter') === filter) {
        btn.classList.add('active');
        btn.style.background = '#0284c7';
        btn.style.color = '#ffffff';
      } else {
        btn.classList.remove('active');
        btn.style.background = 'var(--bg-card)';
        btn.style.color = 'var(--text-muted)';
      }
    });
    renderChecklistRows();
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  };

  window.denasusSearch = function (q) {
    searchQuery = q || '';
    renderChecklistRows();
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  };

  window.denasusMarkAll = function (status) {
    const msg = status === 'concluido' 
      ? 'Deseja marcar todos os 16 itens do Comunicado DENASUS como CONCLUÍDOS?' 
      : 'Deseja marcar todos os 16 itens como PENDENTES?';
    if (!confirm(msg)) return;

    items.forEach(i => i.status = status);
    saveChecklistData();
    updateUI();
  };

  window.denasusResetChecklist = function () {
    if (!confirm('Deseja restaurar o checklist oficial para o estado original? Todas as respostas, tabelas e anotações serão reiniciadas para os padrões oficiais.')) return;
    items = JSON.parse(JSON.stringify(defaultItems));
    saveChecklistData();
    updateUI();
  };

  // Modal para leitura do texto integral
  window.denasusOpenFullTextModal = function (id) {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const modal = document.getElementById('modalDenasusFullText');
    const titleEl = document.getElementById('denasusModalTitle');
    const contentEl = document.getElementById('denasusModalContent');
    const sectorEl = document.getElementById('denasusModalSector');

    if (modal && titleEl && contentEl && sectorEl) {
      titleEl.innerText = `Item ${item.letra.toUpperCase()} — Texto Literal do Ofício DENASUS`;
      contentEl.innerText = item.textoIntegral;
      sectorEl.innerText = item.setor;
      modal.style.display = 'flex';
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    }
  };

  window.denasusCloseFullTextModal = function () {
    const modal = document.getElementById('modalDenasusFullText');
    if (modal) modal.style.display = 'none';
  };

  // ----------------------------------------------------------------------------
  // EXPORTAÇÃO OFICIAL EM PDF: RELATÓRIO EXECUTIVO DE ANDAMENTO DENASUS
  // Imprime todas as respostas, tabelas (Item D) e anexos EXPANDIDOS sem ocultar nada!
  // ----------------------------------------------------------------------------
  window.exportDenasusRelatorioPDF = function () {
    const stats = getStats();
    const dataHoraEmissao = new Date().toLocaleString('pt-BR');

    // Monta linhas da tabela do relatório em PDF
    const itemsDocHtml = items.map(item => {
      let statusHtml = '';
      if (item.status === 'concluido') {
        statusHtml = `<span style="display:inline-block; padding:3px 8px; border-radius:4px; font-size:10px; font-weight:800; background:#dcfce7; color:#15803d; border:1px solid #86efac;">ATENDIDO / CONCLUÍDO</span>`;
      } else if (item.status === 'em_analise') {
        statusHtml = `<span style="display:inline-block; padding:3px 8px; border-radius:4px; font-size:10px; font-weight:800; background:#fef3c7; color:#b45309; border:1px solid #fde68a;">EM PREPARAÇÃO</span>`;
      } else {
        statusHtml = `<span style="display:inline-block; padding:3px 8px; border-radius:4px; font-size:10px; font-weight:800; background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;">PENDENTE</span>`;
      }

      // Se tiver tabela vinculada (como no item D)
      let tabelaPdfHtml = '';
      if (item.tabela && item.tabela.linhas) {
        const tHeaders = item.tabela.colunas.map((col, cIdx) => {
          const align = cIdx === 0 ? 'left' : (cIdx === 4 ? 'center' : 'right');
          return `<th style="padding: 4px 6px; font-size: 8.5px; background: #0284c7; color: #fff; text-align: ${align}; border: 1px solid #0369a1;">${col}</th>`;
        }).join('');

        const tRows = item.tabela.linhas.map((r, rIdx) => {
          const bg = rIdx % 2 === 0 ? '#ffffff' : '#f8fafc';
          return `
            <tr style="background: ${bg}; border-bottom: 1px solid #e2e8f0; font-size: 8.5px;">
              <td style="padding: 3px 6px; font-weight: 700; border: 1px solid #cbd5e1;">${r.comp}</td>
              <td style="padding: 3px 6px; text-align: right; border: 1px solid #cbd5e1;">${r.apresentadas.toLocaleString('pt-BR')}</td>
              <td style="padding: 3px 6px; text-align: right; font-weight: 700; color: #15803d; border: 1px solid #cbd5e1;">${r.aprovadas.toLocaleString('pt-BR')}</td>
              <td style="padding: 3px 6px; text-align: right; color: #b91c1c; border: 1px solid #cbd5e1;">${r.rejeitadas.toLocaleString('pt-BR')}</td>
              <td style="padding: 3px 6px; text-align: center; font-weight: 700; border: 1px solid #cbd5e1;">${r.pctRej}</td>
              <td style="padding: 3px 6px; text-align: right; border: 1px solid #cbd5e1;">${r.vlrApresentado}</td>
              <td style="padding: 3px 6px; text-align: right; font-weight: 700; border: 1px solid #cbd5e1;">${r.vlrAprovado}</td>
              <td style="padding: 3px 6px; text-align: right; font-weight: 700; color: #b91c1c; border: 1px solid #cbd5e1;">${r.dif}</td>
            </tr>
          `;
        }).join('');

        let tTotais = '';
        if (item.tabela.totais) {
          tTotais = `
            <tr style="background: #0f172a; color: #ffffff; font-weight: 900; font-size: 9px; border: 1px solid #0f172a;">
              <td style="padding: 5px 6px;">${item.tabela.totais.comp}</td>
              <td style="padding: 5px 6px; text-align: right;">${item.tabela.totais.apresentadas}</td>
              <td style="padding: 5px 6px; text-align: right; color: #4ade80;">${item.tabela.totais.aprovadas}</td>
              <td style="padding: 5px 6px; text-align: right; color: #f87171;">${item.tabela.totais.rejeitadas}</td>
              <td style="padding: 5px 6px; text-align: center; color: #fde047;">${item.tabela.totais.pctRej}</td>
              <td style="padding: 5px 6px; text-align: right;">${item.tabela.totais.vlrApresentado}</td>
              <td style="padding: 5px 6px; text-align: right; color: #4ade80;">${item.tabela.totais.vlrAprovado}</td>
              <td style="padding: 5px 6px; text-align: right; color: #f87171;">${item.tabela.totais.dif}</td>
            </tr>
          `;
        }

        tabelaPdfHtml = `
          <div style="margin-top: 8px; border: 1px solid #cbd5e1; border-radius: 4px; overflow: hidden; page-break-inside: avoid;">
            <div style="background: #f1f5f9; padding: 4px 8px; border-bottom: 1px solid #cbd5e1; font-weight: 800; font-size: 9.5px; color: #0f172a;">
              Tabela Anexa: ${item.tabela.titulo} (${item.tabela.periodo})
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 8.5px;">
              <thead><tr>${tHeaders}</tr></thead>
              <tbody>
                ${tRows}
                ${tTotais}
              </tbody>
            </table>
            ${item.tabela.observacao ? `
              <div style="padding: 4px 8px; background: #f8fafc; border-top: 1px dashed #cbd5e1; font-size: 8px; color: #475569;">
                <strong>Nota:</strong> ${item.tabela.observacao}
              </div>
            ` : ''}
          </div>
        `;
      }

      // Anexos lista para PDF
      let anexosPdfHtml = '';
      if (item.anexos && item.anexos.length > 0) {
        anexosPdfHtml = `
          <div style="margin-top: 6px; font-size: 9px; color: #334155; background: #f8fafc; padding: 4px 8px; border-radius: 4px; border: 1px solid #e2e8f0;">
            <strong>Documentos / Arquivos Comprobatórios Anexados:</strong>
            ${item.anexos.map(a => `
              <div style="margin-top: 2px;">• <strong>${a.nome}</strong> (${a.tipo} - ${a.tamanho}) - Anexado em ${a.data}</div>
            `).join('')}
          </div>
        `;
      }

      return `
        <div style="border: 1px solid #cbd5e1; border-radius: 6px; margin-bottom: 12px; page-break-inside: avoid; background: #ffffff; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
          <!-- Cabeçalho do Item -->
          <div style="background: #f8fafc; padding: 8px 10px; border-bottom: 1px solid #cbd5e1; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; background: #0284c7; color: #ffffff; font-weight: 800; border-radius: 4px; font-size: 11px;">
                ${item.letra.toUpperCase()}
              </span>
              <strong style="font-size: 11px; color: #0f172a;">${item.tituloResumo}</strong>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 9.5px; color: #64748b; font-weight: 600;">Setor: ${item.setor}</span>
              ${statusHtml}
            </div>
          </div>

          <!-- Exigência Oficial do Ofício DENASUS -->
          <div style="padding: 6px 10px; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-size: 9.5px; color: #334155; line-height: 1.35;">
            <strong>Exigência Oficial DENASUS:</strong> ${item.textoIntegral}
          </div>

          <!-- Resposta Institucional Completa (Sem Ocultar Nada) -->
          <div style="padding: 8px 10px;">
            ${item.respostaTexto ? `
              <div style="font-size: 10px; color: #0f172a; line-height: 1.4; background: #f0fdf4; border-left: 3px solid #16a34a; padding: 6px 8px; border-radius: 3px; margin-bottom: 6px;">
                <strong style="color: #15803d; font-size: 9.5px; display: block; margin-bottom: 2px;">Resposta Institucional da Santa Casa de Bagé:</strong>
                ${item.respostaTexto}
              </div>
            ` : `
              <div style="font-size: 9.5px; color: #94a3b8; font-style: italic;">
                [Resposta formal em elaboração pelo setor responsável: ${item.setor}]
              </div>
            `}

            <!-- Tabela anexada se houver -->
            ${tabelaPdfHtml}

            <!-- Anexos se houver -->
            ${anexosPdfHtml}

            <!-- Nota interna se houver -->
            ${item.observacoes ? `
              <div style="margin-top: 5px; font-size: 9px; color: #1e40af; font-weight: 600;">
                <strong>Nota Interna / Despacho:</strong> ${item.observacoes}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    const printDoc = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Dossiê Executivo de Auditoria DENASUS - Santa Casa de Caridade de Bagé</title>
  <style>
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 16px 20px;
      color: #0f172a;
      background: #ffffff;
      font-size: 10px;
      line-height: 1.35;
    }
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }
    .header-doc {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }
    .header-titles h1 {
      margin: 0;
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .header-titles h2 {
      margin: 2px 0 0 0;
      font-size: 11.5px;
      font-weight: 700;
      color: #0284c7;
    }
    .header-titles p {
      margin: 1px 0 0 0;
      font-size: 9.5px;
      color: #64748b;
    }
    .badge-meta {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 5px 9px;
      border-radius: 6px;
      text-align: right;
      font-size: 9.5px;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 9.5px;
    }
    .meta-table td {
      padding: 4px 7px;
      border-bottom: 1px solid #e2e8f0;
    }
    .meta-table tr:last-child td {
      border-bottom: none;
    }
    .progress-box {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 1px solid #bae6fd;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .progress-bar-bg {
      width: 180px;
      height: 10px;
      background: #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
      display: inline-block;
      vertical-align: middle;
      margin-left: 8px;
    }
    .progress-bar-fill {
      height: 100%;
      background: #0284c7;
      border-radius: 6px;
    }
    .footer-doc {
      margin-top: 16px;
      border-top: 1px solid #cbd5e1;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 9px;
      color: #64748b;
      page-break-inside: avoid;
    }
    .sig-box {
      text-align: center;
      width: 240px;
      border-top: 1px solid #0f172a;
      padding-top: 4px;
      font-size: 9.5px;
      color: #0f172a;
    }
  </style>
</head>
<body>

  <!-- Header Institucional -->
  <div class="header-doc">
    <div class="header-titles">
      <h1>Santa Casa de Caridade de Bagé</h1>
      <h2>Dossiê Oficial de Atendimento — DENASUS / Ministério da Saúde</h2>
      <p>Sistema Nacional de Auditoria (SNA) • Serviço Nacional de Auditoria do SUS no RS (SEAUD/RS/MS)</p>
    </div>
    <div class="badge-meta">
      <div><strong>Emissão:</strong> ${dataHoraEmissao}</div>
      <div><strong>Auditoria:</strong> nº 20.307/2026</div>
      <div><strong>SEI nº:</strong> 0057570172</div>
    </div>
  </div>

  <!-- Tabela de Metadados Oficiais -->
  <table class="meta-table">
    <tr>
      <td style="width: 25%;"><strong>Documento / Número:</strong> Comunicado de Auditoria nº 6</td>
      <td style="width: 25%;"><strong>Processo SEI:</strong> 25000.104532/2026-93</td>
      <td style="width: 25%;"><strong>Data do Ofício:</strong> 21/08/2026</td>
      <td style="width: 25%;"><strong>Prazo de Resposta:</strong> 10 dias úteis</td>
    </tr>
    <tr>
      <td colspan="2"><strong>Órgão Auditor:</strong> SEAUD/RS/DENASUS/MS (Coordenação: Matilde Nascimento - Cel: 51 99890-1165)</td>
      <td colspan="2"><strong>E-mails Oficiais:</strong> auditoria.semsrs@saude.gov.br / matilde.nascimento@saude.gov.br</td>
    </tr>
    <tr>
      <td colspan="2"><strong>Unidade Visitada:</strong> Santa Casa de Caridade de Bagé/RS (Rua Gomes Carneiro, 1350)</td>
      <td colspan="2"><strong>Período de Abrangência:</strong> Maio de 2025 a Junho de 2026 (14 meses)</td>
    </tr>
    <tr>
      <td colspan="2"><strong>Responsável pelo Atendimento:</strong> Henry Ritta (Contratualização - SCCB)</td>
      <td colspan="2"><strong>Destinatários:</strong> Lindonor Peruzzo (Provedor) e Ricardo Martins (Diretor Executivo)</td>
    </tr>
  </table>

  <!-- Painel de Progresso Consolidado -->
  <div class="progress-box">
    <div>
      <span style="font-size: 11.5px; font-weight: 800; color: #0369a1;">Status Consolidado da Instrução Documental:</span>
      <span style="font-size: 11px; font-weight: 700; color: #0f172a; margin-left: 6px;">
        ${stats.concluidos} de ${stats.total} itens concluídos (${stats.percentual}%)
      </span>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${stats.percentual}%;"></div>
      </div>
    </div>
    <div style="font-size: 9.5px; font-weight: 700;">
      <span style="color: #15803d; margin-right: 8px;">● ${stats.concluidos} Concluídos</span>
      <span style="color: #b45309; margin-right: 8px;">● ${stats.emAnalise} Em Preparação</span>
      <span style="color: #b91c1c;">● ${stats.pendentes} Pendentes</span>
    </div>
  </div>

  <div style="margin-bottom: 10px; font-size: 10.5px; font-weight: 800; color: #0f172a; text-transform: uppercase; border-bottom: 1.5px solid #0284c7; padding-bottom: 4px;">
    Detalhamento Completo dos 16 Itens com Respostas Oficiais, Tabelas & Anexos
  </div>

  <!-- Lista de Itens do Dossiê Expandidos sem ocultar nada -->
  ${itemsDocHtml}

  <!-- Rodapé com Assinaturas -->
  <div class="footer-doc">
    <div>
      <div>Dossiê gerado eletronicamente pela Sala de Situação - Santa Casa de Caridade de Bagé.</div>
      <div>Canal de envio: Pasta compartilhada SEAUD-RS-TRANF / Protocolo SEI nº 0057570172.</div>
    </div>
    <div class="sig-box">
      <strong>Henry Ritta</strong><br>
      Contratualização SUS — Santa Casa de Bagé<br>
      Responsável pelo Atendimento da Auditoria
    </div>
  </div>

</body>
</html>
    `;

    // Utiliza iframe invisível para impressão limpa sem popup blockers
    let printFrame = document.getElementById('denasusPrintFrame');
    if (!printFrame) {
      printFrame = document.createElement('iframe');
      printFrame.id = 'denasusPrintFrame';
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

  // Inicialização do módulo
  window.initDenasusModule = function () {
    updateUI();
  };

  // Inicializa quando a página estiver carregada
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateUI);
  } else {
    updateUI();
  }

})();
