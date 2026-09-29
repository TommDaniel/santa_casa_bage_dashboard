/**
 * Módulo DENASUS - Departamento Nacional de Auditoria do SUS
 * Santa Casa de Caridade de Bagé (SCB)
 * Gestão e Acompanhamento do Comunicado de Auditoria nº 06 / Auditoria nº 20.307/2026
 */

(function () {
  'use strict';

  // Chave do LocalStorage para persistência do checklist
  const STORAGE_KEY = 'scb_denasus_checklist_v2026';

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

  // Itens Oficiais do Ofício DENASUS (Itens "a" até "p")
  const defaultItems = [
    {
      id: 'item_a',
      letra: 'a',
      tituloResumo: 'Listagem de Presidência e Direção com documentos comprobatórios e Cadastro (Anexo I)',
      textoIntegral: 'Listagem nominal dos ocupantes dos cargos de Presidência e Direção da Santa Casa de Caridade de Bagé que exerceram suas funções no período de maio de 2025 a junho de 2026, contendo: nome completo, CPF, cargo, período de gestão, endereço comercial, endereço residencial e telefone. Deverá ser acompanhada de cópia dos documentos comprobatórios dos atos de nomeação e/ou exoneração, bem como do preenchimento do Cadastro de Responsável (Anexo I);',
      setor: 'Presidência / Diretoria / RH',
      status: 'pendente', // pendente, em_analise, concluido
      observacoes: '',
      dataConclusao: ''
    },
    {
      id: 'item_b',
      letra: 'b',
      tituloResumo: 'Processos de pagamento na íntegra de serviços contratualizados (mai/25 a jun/26)',
      textoIntegral: 'Processos de pagamento, na íntegra, referentes à prestação dos serviços contratualizados, relativos ao período auditado;',
      setor: 'Financeiro / Contabilidade',
      status: 'pendente',
      observacoes: '',
      dataConclusao: ''
    },
    {
      id: 'item_c',
      letra: 'c',
      tituloResumo: 'Contrato formal SES/RS e SCCB, anexos, aditivos, DOE e ato de designação do fiscal',
      textoIntegral: 'Instrumento formal de contratualização celebrado entre a Secretaria Estadual da Saúde do Rio Grande do Sul (SES/RS) e a Santa Casa de Caridade de Bagé, referente ao período de maio de 2025 a junho de 2026, acompanhado de seus respectivos anexos, termos aditivos, documentos descritivos e publicações no Diário Oficial do Estado, incluindo o ato de designação do responsável pela fiscalização do contrato;',
      setor: 'Contratualização / Jurídico',
      status: 'pendente',
      observacoes: '',
      dataConclusao: ''
    },
    {
      id: 'item_d',
      letra: 'd',
      tituloResumo: 'Quantitativo da produção ambulatorial e hospitalar informada (mai/25 a jun/26)',
      textoIntegral: 'Quantitativo da produção ambulatorial e hospitalar informada pela Santa Casa de Caridade de Bagé, referente ao período de maio de 2025 a junho de 2026;',
      setor: 'Faturamento SUS (SIA / SIH)',
      status: 'pendente',
      observacoes: '',
      dataConclusao: ''
    },
    {
      id: 'item_e',
      letra: 'e',
      tituloResumo: 'Relação do número de leitos hospitalares disponibilizados ao SUS no período',
      textoIntegral: 'Relação do número de leitos disponibilizados ao SUS durante o período auditado;',
      setor: 'Diretoria Técnica / NIR / CNES',
      status: 'pendente',
      observacoes: '',
      dataConclusao: ''
    },
    {
      id: 'item_f',
      letra: 'f',
      tituloResumo: 'Relação do número de equipamentos disponibilizados ao SUS durante o período auditado',
      textoIntegral: 'Relação do número de equipamentos disponibilizados ao SUS durante o período auditado;',
      setor: 'Engenharia Clínica / Patrimônio',
      status: 'pendente',
      observacoes: '',
      dataConclusao: ''
    },
    {
      id: 'item_g',
      letra: 'g',
      tituloResumo: 'Relação nominal de profissionais vinculados ao Contrato nº 2025/1147.0.00/2025 e aditivos',
      textoIntegral: 'Relação nominal dos profissionais que atuam ou atuaram na Santa Casa de Caridade de Bagé durante o período auditado, contendo cargo, vínculo, regime de trabalho e período de atuação, relativamente ao Contrato nº 2025/1147.0.00/2025 e respectivos termos aditivos;',
      setor: 'Recursos Humanos / DP',
      status: 'pendente',
      observacoes: '',
      dataConclusao: ''
    },
    {
      id: 'item_h',
      letra: 'h',
      tituloResumo: 'Escalas de trabalho dos profissionais (com identificação, cargo e regime)',
      textoIntegral: 'Escalas de trabalho dos profissionais que atuam ou atuaram durante o período auditado, contendo a identificação do profissional, cargo e regime de trabalho;',
      setor: 'RH / Coordenação de Enfermagem / Médica',
      status: 'pendente',
      observacoes: '',
      dataConclusao: ''
    },
    {
      id: 'item_i',
      letra: 'i',
      tituloResumo: 'Registros de controle de frequência / ponto dos profissionais atuantes no período',
      textoIntegral: 'Registros de controle de frequência dos profissionais que atuam ou atuaram durante o período auditado;',
      setor: 'Recursos Humanos / Ponto',
      status: 'pendente',
      observacoes: '',
      dataConclusao: ''
    },
    {
      id: 'item_j',
      letra: 'j',
      tituloResumo: 'Processos de contratação, acompanhamento e pagamento dos profissionais terceirizados/PJ',
      textoIntegral: 'Processos de contratação, acompanhamento e pagamento dos profissionais contratados, relativos ao período auditado;',
      setor: 'RH / Compras / Financeiro',
      status: 'pendente',
      observacoes: '',
      dataConclusao: ''
    },
    {
      id: 'item_k',
      letra: 'k',
      tituloResumo: 'Relatórios da Ouvidoria contendo denúncias e reclamações recebidas no período auditado',
      textoIntegral: 'Relatórios da Ouvidoria, contendo os registros de denúncias e reclamações recebidos no período auditado;',
      setor: 'Ouvidoria / SAC',
      status: 'pendente',
      observacoes: '',
      dataConclusao: ''
    },
    {
      id: 'item_l',
      letra: 'l',
      tituloResumo: 'Relação nominal dos médicos obstetras com CRM, especialidade, vínculo e atuação',
      textoIntegral: 'Relação nominal dos médicos da especialidade de obstetrícia, contendo especialidade, vínculo, regime de trabalho, registro no respectivo conselho profissional e período de atuação;',
      setor: 'Corpo Clínico / Maternidade / RH',
      status: 'pendente',
      observacoes: '',
      dataConclusao: ''
    },
    {
      id: 'item_m',
      letra: 'm',
      tituloResumo: 'Dados de produção e demanda assistencial da obstetrícia (incluindo urgência/emergência)',
      textoIntegral: 'Dados de produção e demanda assistencial da obstetrícia, incluindo os atendimentos de urgência e emergência realizados durante o período auditado;',
      setor: 'Faturamento / Centro Obstétrico / NIR',
      status: 'pendente',
      observacoes: '',
      dataConclusao: ''
    },
    {
      id: 'item_n',
      letra: 'n',
      tituloResumo: 'Registros de atrasos/parcelamentos de pagamentos a profissionais e paralisações c/ providências',
      textoIntegral: 'Registros de atrasos ou parcelamentos de pagamentos aos profissionais, bem como de eventuais paralisações, suspensões ou reduções de atendimentos e procedimentos, acompanhados das respectivas providências adotadas pela instituição;',
      setor: 'Diretoria Executiva / Financeiro / Jurídico',
      status: 'pendente',
      observacoes: '',
      dataConclusao: ''
    },
    {
      id: 'item_o',
      letra: 'o',
      tituloResumo: 'Comprovantes e certidões de obrigações sociais, trabalhistas, previdenciárias e fiscais',
      textoIntegral: 'Documentos comprobatórios do cumprimento das obrigações sociais, trabalhistas, previdenciárias, tributárias e fiscais, incluindo certidões e comprovantes de regularidade, bem como documentos relativos a eventuais pendências e às respectivas providências de regularização, referentes ao período auditado;',
      setor: 'Fiscal / Contabilidade / Jurídico',
      status: 'pendente',
      observacoes: '',
      dataConclusao: ''
    },
    {
      id: 'item_p',
      letra: 'p',
      tituloResumo: 'Plano de Ação formalizado de saneamento de irregularidades apontadas por órgãos fiscalizadores',
      textoIntegral: 'Plano de Ação formalizado pela Santa Casa de Caridade de Bagé, contendo as medidas adotadas e/ou previstas para o saneamento de irregularidades, não conformidades ou fragilidades identificadas por órgãos de fiscalização, controle ou supervisão, incluindo ações, prazos, responsáveis, situação de implementação e respectivos documentos comprobatórios de acompanhamento e execução.',
      setor: 'Governança / Qualidade / Contratualização',
      status: 'pendente',
      observacoes: '',
      dataConclusao: ''
    }
  ];

  // Carrega itens salvos ou cria padrão
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
                status: found.status || 'pendente',
                observacoes: found.observacoes || '',
                dataConclusao: found.dataConclusao || ''
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

  // Renderiza as linhas do checklist
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
        return inLetter || inResumo || inFull || inSetor || inObs;
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

      let statusBadge = '';
      let rowBorderColor = 'var(--border-color)';
      let rowBg = 'var(--bg-card)';

      if (isConcluido) {
        statusBadge = `<span class="badge-sus" style="background: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); font-weight: 700; font-size: 0.72rem; padding: 0.2rem 0.6rem; border-radius: 99px;"><i data-lucide="check" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i> Concluído</span>`;
        rowBorderColor = 'rgba(16, 185, 129, 0.3)';
        rowBg = 'rgba(16, 185, 129, 0.02)';
      } else if (isAnalise) {
        statusBadge = `<span class="badge-sus" style="background: rgba(245, 158, 11, 0.12); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); font-weight: 700; font-size: 0.72rem; padding: 0.2rem 0.6rem; border-radius: 99px;"><i data-lucide="loader" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i> Em Preparação</span>`;
        rowBorderColor = 'rgba(245, 158, 11, 0.3)';
        rowBg = 'rgba(245, 158, 11, 0.02)';
      } else {
        statusBadge = `<span class="badge-sus" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.25); font-weight: 700; font-size: 0.72rem; padding: 0.2rem 0.6rem; border-radius: 99px;"><i data-lucide="alert-circle" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i> Pendente</span>`;
      }

      // Escape quotes for html attributes
      const safeFullText = item.textoIntegral.replace(/"/g, '&quot;');

      html += `
        <div class="card denasus-item-card" id="card-${item.id}" style="margin-bottom: 0.85rem; padding: 1.1rem 1.35rem; border: 1px solid ${rowBorderColor}; background: ${rowBg}; border-radius: 10px; transition: all 0.2s ease;">
          <div style="display: flex; gap: 1rem; align-items: flex-start; justify-content: space-between; flex-wrap: wrap;">
            
            <!-- Checkbox & Título Resumo -->
            <div style="display: flex; gap: 0.85rem; align-items: flex-start; flex: 1 1 500px;">
              <div style="margin-top: 2px;">
                <input type="checkbox" id="chk-${item.id}" ${isConcluido ? 'checked' : ''} onchange="window.denasusToggleItem('${item.id}')" style="width: 20px; height: 20px; cursor: pointer; accent-color: #10b981; border-radius: 4px;">
              </div>
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.35rem;">
                  <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background: rgba(2, 132, 199, 0.12); color: #0284c7; font-weight: 800; font-size: 0.85rem;">
                    ${item.letra.toUpperCase()}
                  </span>
                  <span style="font-weight: 800; font-size: 0.95rem; color: var(--text-title); ${isConcluido ? 'text-decoration: line-through; opacity: 0.85;' : ''}">
                    ${item.tituloResumo}
                  </span>
                  ${statusBadge}
                </div>

                <!-- SINALIZADOR DE OBSERVAÇÃO / TOOLTIP DE TEXTO INTEGRAL (Exigência do Usuário) -->
                <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.4rem;">
                  <div class="denasus-tooltip-wrap" style="position: relative; display: inline-block;">
                    <button type="button" class="denasus-btn-hover-obs" onclick="window.denasusOpenFullTextModal('${item.id}')" title="Passe o mouse ou clique para ver o texto literal e completo deste item do ofício">
                      <i data-lucide="info" style="width: 14px; height: 14px; color: #0284c7;"></i>
                      <span>Texto Integral do Ofício DENASUS</span>
                    </button>
                    <!-- Tooltip Hover Flutuante -->
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
                </div>
              </div>
            </div>

            <!-- Controles de Status Rápido & Ações -->
            <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
              <select onchange="window.denasusChangeStatus('${item.id}', this.value)" style="padding: 0.35rem 0.65rem; font-size: 0.78rem; font-weight: 700; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-title); cursor: pointer;">
                <option value="pendente" ${item.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                <option value="em_analise" ${item.status === 'em_analise' ? 'selected' : ''}>Em Preparação / Análise</option>
                <option value="concluido" ${item.status === 'concluido' ? 'selected' : ''}>Concluído / Atendido</option>
              </select>

              <button type="button" onclick="window.denasusToggleNotes('${item.id}')" class="btn-icon" style="width: auto; padding: 0.35rem 0.65rem; font-size: 0.75rem; display: flex; align-items: center; gap: 4px;" title="Adicionar anotação ou link de comprovante interno">
                <i data-lucide="edit-3" style="width: 13px; height: 13px;"></i>
                <span>${item.observacoes ? 'Editar Nota' : 'Adicionar Nota'}</span>
              </button>
            </div>
          </div>

          <!-- Gaveta de Observações Internas (Editável) -->
          <div id="notes-container-${item.id}" style="display: ${item.observacoes ? 'block' : 'none'}; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-color);">
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.35rem;">
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 4px;">
                <i data-lucide="message-square" style="width: 12px; height: 12px;"></i> Anotações Internas / Status do Documento:
              </span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" id="input-note-${item.id}" value="${(item.observacoes || '').replace(/"/g, '&quot;')}" placeholder="Ex: Arquivos salvos na pasta da Contratualização / Aguardando certidão do FGTS..." style="flex: 1; padding: 0.4rem 0.65rem; font-size: 0.82rem; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-title);" onkeydown="if(event.key === 'Enter') window.denasusSaveNote('${item.id}')">
              <button type="button" class="btn-primary" style="padding: 0.4rem 0.85rem; font-size: 0.78rem;" onclick="window.denasusSaveNote('${item.id}')">
                Salvar
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // Ações globais exportadas no objeto window
  window.denasusToggleItem = function (id) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (item.status === 'concluido') {
      item.status = 'pendente';
      item.dataConclusao = '';
    } else {
      item.status = 'concluido';
      item.dataConclusao = new Date().toLocaleDateString('pt-BR');
    }
    saveChecklistData();
    updateUI();
  };

  window.denasusChangeStatus = function (id, newStatus) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.status = newStatus;
    if (newStatus === 'concluido') {
      item.dataConclusao = new Date().toLocaleDateString('pt-BR');
    } else {
      item.dataConclusao = '';
    }
    saveChecklistData();
    updateUI();
  };

  window.denasusToggleNotes = function (id) {
    const el = document.getElementById(`notes-container-${id}`);
    if (!el) return;
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
    if (el.style.display === 'block') {
      const input = document.getElementById(`input-note-${id}`);
      if (input) input.focus();
    }
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

    items.forEach(i => {
      i.status = status;
      i.dataConclusao = status === 'concluido' ? new Date().toLocaleDateString('pt-BR') : '';
    });
    saveChecklistData();
    updateUI();
  };

  window.denasusResetChecklist = function () {
    if (!confirm('Deseja restaurar o checklist oficial para o estado original? Todas as marcações e anotações serão reiniciadas.')) return;
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
  // ----------------------------------------------------------------------------
  window.exportDenasusRelatorioPDF = function () {
    const stats = getStats();
    const dataHoraEmissao = new Date().toLocaleString('pt-BR');

    // Monta linhas da tabela do relatório em PDF
    const rowsHtml = items.map(item => {
      let statusHtml = '';
      if (item.status === 'concluido') {
        statusHtml = `<span style="display:inline-block; padding:3px 8px; border-radius:4px; font-size:10px; font-weight:800; background:#dcfce7; color:#15803d; border:1px solid #86efac;">ATENDIDO / CONCLUÍDO</span>`;
      } else if (item.status === 'em_analise') {
        statusHtml = `<span style="display:inline-block; padding:3px 8px; border-radius:4px; font-size:10px; font-weight:800; background:#fef3c7; color:#b45309; border:1px solid #fde68a;">EM PREPARAÇÃO</span>`;
      } else {
        statusHtml = `<span style="display:inline-block; padding:3px 8px; border-radius:4px; font-size:10px; font-weight:800; background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;">PENDENTE</span>`;
      }

      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 7px 8px; font-weight: 800; text-align: center; vertical-align: top; background: #f8fafc; font-size: 11px;">
            ${item.letra.toUpperCase()}
          </td>
          <td style="padding: 7px 8px; vertical-align: top;">
            <div style="font-weight: 700; color: #0f172a; font-size: 11px; margin-bottom: 3px;">
              ${item.tituloResumo}
            </div>
            <div style="font-size: 10px; color: #475569; line-height: 1.35; background: #f8fafc; padding: 5px 7px; border-left: 3px solid #0284c7; border-radius: 3px;">
              ${item.textoIntegral}
            </div>
            ${item.observacoes ? `<div style="margin-top: 4px; font-size: 9.5px; color: #1e40af; font-weight: 600;"><strong>Nota Interna:</strong> ${item.observacoes}</div>` : ''}
          </td>
          <td style="padding: 7px 8px; text-align: center; vertical-align: top; font-size: 10px; font-weight: 600; color: #334155;">
            ${item.setor}
          </td>
          <td style="padding: 7px 8px; text-align: center; vertical-align: top;">
            ${statusHtml}
          </td>
        </tr>
      `;
    }).join('');

    const printDoc = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Relatório Executivo DENASUS - Santa Casa de Caridade de Bagé</title>
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
      padding: 18px 22px;
      color: #0f172a;
      background: #ffffff;
      font-size: 11px;
      line-height: 1.35;
    }
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    .header-doc {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 12px;
      margin-bottom: 14px;
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
      margin: 3px 0 0 0;
      font-size: 12px;
      font-weight: 700;
      color: #0284c7;
    }
    .header-titles p {
      margin: 2px 0 0 0;
      font-size: 10px;
      color: #64748b;
    }
    .badge-meta {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      border-radius: 6px;
      text-align: right;
      font-size: 10px;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 10px;
    }
    .meta-table td {
      padding: 5px 8px;
      border-bottom: 1px solid #e2e8f0;
    }
    .meta-table tr:last-child td {
      border-bottom: none;
    }
    .progress-box {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 1px solid #bae6fd;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .progress-bar-bg {
      width: 220px;
      height: 12px;
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
    .items-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-bottom: 16px;
    }
    .items-table th {
      background: #0284c7;
      color: #ffffff;
      padding: 6px 8px;
      text-align: left;
      font-weight: 800;
      font-size: 10px;
    }
    .footer-doc {
      margin-top: 18px;
      border-top: 1px solid #cbd5e1;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 9.5px;
      color: #64748b;
    }
    .sig-box {
      text-align: center;
      width: 240px;
      border-top: 1px solid #0f172a;
      padding-top: 4px;
      font-size: 10px;
      color: #0f172a;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header-doc">
    <div class="header-titles">
      <h1>Santa Casa de Caridade de Bagé</h1>
      <h2>Acompanhamento de Diligência Oficial — DENASUS / Ministério da Saúde</h2>
      <p>Sistema Nacional de Auditoria (SNA) • Serviço Nacional de Auditoria do SUS no RS (SEAUD/RS)</p>
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
      <span style="font-size: 13px; font-weight: 800; color: #0369a1;">Status Geral da Instrução Documental:</span>
      <span style="font-size: 12px; font-weight: 700; color: #0f172a; margin-left: 6px;">
        ${stats.concluidos} de ${stats.total} itens concluídos (${stats.percentual}%)
      </span>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${stats.percentual}%;"></div>
      </div>
    </div>
    <div style="font-size: 10px; font-weight: 700;">
      <span style="color: #15803d; margin-right: 8px;">● ${stats.concluidos} Concluídos</span>
      <span style="color: #b45309; margin-right: 8px;">● ${stats.emAnalise} Em Preparação</span>
      <span style="color: #b91c1c;">● ${stats.pendentes} Pendentes</span>
    </div>
  </div>

  <!-- Tabela de Itens (Checklist Integral) -->
  <table class="items-table">
    <thead>
      <tr>
        <th style="width: 5%; text-align: center;">Item</th>
        <th style="width: 65%;">Descrição & Exigência Oficial do Ofício DENASUS</th>
        <th style="width: 15%; text-align: center;">Setor Responsável</th>
        <th style="width: 15%; text-align: center;">Situação Atual</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <!-- Rodapé com Assinaturas -->
  <div class="footer-doc">
    <div>
      <div>Documento gerado eletronicamente pela Sala de Situação - Santa Casa de Caridade de Bagé.</div>
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
