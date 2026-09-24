# Histórico de Atualizações & Roadmap do Projeto

Este arquivo registra cronologicamente todas as edições, implementações, refatorações de código e próximos passos para continuidade do projeto por qualquer agente de inteligência artificial ou desenvolvedor.

## [2026-09-24] - Prestação de Contas: Destaque Visual com Cor Vibrante no Mês Selecionado da Barra de Competências

### 🎯 O que foi feito:
1. **Destaque Visual do Mês Selecionado**:
   - Aplicada estilização proeminente e imediata ao botão do mês ativo na barra de competências de 12 meses (`.pc-month-pill.active`);
   - Mês ativo renderizado com preenchimento em azul royal vibrante (`#2563eb`), tipografia em branco puro (`#ffffff`), borda sólida e sombra sutil (`box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35)`);
   - Transição dinâmica e instantânea ao alternar entre os meses (ao clicar em qualquer mês, o mês anterior volta ao tom neutro e o novo mês é destacado);
   - Subvalores monetários de cada mês sincronizados com alto contraste na pílula ativa;
   - Suporte a tema consolidado com realce verde esmeralda (`#059669`) quando aplicável.
2. **Cache-Busting**:
   - Cache-buster atualizado em `index.html` para `prestacao_contas.js?v=20260924_14`.

---

## [2026-09-24] - Prestação de Contas: Reorganização Visual das Despesas, População do Rateio Operacional e Relatório Oficial Completo em PDF

### 🎯 O que foi feito:
1. **Padronização Visual da Tabela de Despesas**:
   - Removido o logotipo redundante do hospital do cabeçalho da tabela de rateio de despesas (`cardPcCustosRateio`);
   - Inserido ícone padronizado de calculadora (`calculator`) em tons vermelhos (`#dc2626` / `rgba(220, 38, 38, 0.12)`) mantendo a simetria com o ícone azul de receitas;
   - Inseridos badges padronizados: `DEMONSTRATIVO DE DESPESAS` e `Rateio Operacional Ambulatorial`.
2. **Correção e População Automática dos Custos Rateados (`TOTAL/MÊS`)**:
   - Corrigida a inicialização de custos na função `getPrestacaoMonthlyStore()` para carregar as quantidades (`qtd`) e percentuais de rateio (`rateio`) padrão de todas as equipes e recursos operacionais;
   - As linhas da tabela de custos agora exibem seus valores devidamente calculados e formatados em moeda (ex: Enfermeiro R$ 3.413,10, Técnicos R$ 2.244,57, Encargos R$ 2.693,32, Subtotal R$ 13.044,55), eliminando os valores zerados em branco.
3. **Migração do Botão de PDF para o Cabeçalho da Página**:
   - O botão `Baixar Comprovante PDF` foi movido para a barra de ações rápidas no cabeçalho superior da página de Prestação de Contas, ao lado de `Novo Lançamento`;
4. **Relatório Oficial em PDF Completo e Integrado**:
   - A função `exportPrestacaoCustosPDF()` foi completamente reestruturada para gerar a **Prestação de Contas Completa**:
     - **Cabeçalho Oficial**: Logotipo do Hospital Bom Pastor, título oficial, dados da competência ativa e carimbo de versão para aprovação;
     - **Quadro 1 (Receitas)**: Tabela de receitas faturadas (SUS Gaúcho e Consórcio CISA), com rubricas, portarias, destinações orçamentárias, badges de status do repasse e Total Geral;
     - **Quadro 2 (Despesas)**: Tabela detalhada de custos operacionais com centros de custo, rateios percentuais, quantidades, valores unitários, encargos da folha (30,91%) e Subtotal de custos rateados;
     - **Quadro 3 (Demonstrativo Financeiro e Rateio 80/20)**: Memória de cálculo com apuração do saldo líquido, rateio de 80% aos prestadores, retenção hospitalar de 20% e total geral de despesas;
     - **Homologação e Assinaturas**: Termo de aprovação e campos de assinatura formal (Direção Executiva, Coordenação Médica da Oftalmologia e Faturamento SUS).
5. **Persistência e Cache-Busting**:
   - Storage versionado para `prestacao_monthly_store_2026_v12`;
   - Cache-buster atualizado em `index.html` para `prestacao_contas.js?v=20260924_13`.

---

## [2026-09-24] - Prestação de Contas: Novo Status em Escala de Cinza "Não se aplica" na Tabela de Receitas e Faturamento

### 🎯 O que foi feito:
1. **Criação do Status "Não se aplica" em Escala de Cinza (Grayscale)**:
   - Adicionada a nova opção **`Não se aplica`** no seletor de status de repasse das receitas da tabela de faturamento;
   - Estilização elegante em escala de cinza suave (`background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1`), garantindo distinção imediata para rubricas que não possuem repasse/execução na respectiva competência sem poluição visual;
   - O seletor dropdown permite alternar dinamicamente entre os 4 estados:
     - **`Recebido FES`** (Verde suave: `#eafaf1` / `#167b45`);
     - **`Aguardando Recurso`** (Âmbar suave: `#fef6ea` / `#b86a04`);
     - **`Pago ao Prestadores`** (Azul suave: `#eff6ff` / `#1d4ed8`);
     - **`Não se aplica`** (Cinza neutro: `#f1f5f9` / `#475569`).
2. **Definição Inteligente de Status Padrão por Competência**:
   - **Junho (06) e Julho (07)**:
     - `SUS Gaúcho - Ambulatório Estratégico`: Status **`Recebido FES`** (R$ 81.276,00);
     - `Produção CISA - Oftalmologia`: Status **`Não se aplica`** (R$ 0,00).
   - **Agosto (08)**:
     - `SUS Gaúcho - Ambulatório Estratégico`: Status **`Não se aplica`** (R$ 0,00);
     - `Produção CISA - Oftalmologia`: Status **`Recebido FES`** (R$ 17.536,44).
   - **Demais meses sem produção**:
     - Ambas as rubricas iniciam com status **`Não se aplica`** (R$ 0,00).
3. **Limpeza Visual do Cabeçalho de Receitas**:
   - Removida a badge redundante `SUS GAÚCHO & CISA` do cabeçalho da tabela de receitas, mantendo o visual limpo e focado com `DEMONSTRATIVO DE RECEITAS`.
4. **Persistência e Cache-Busting**:
   - Storage versionado para `prestacao_monthly_store_2026_v9`;
   - Cache-buster atualizado em `index.html` para `prestacao_contas.js?v=20260924_11`.

---

## [2026-09-24] - Prestação de Contas: Atualização do Cabeçalho Institucional para "Prestação de Contas e Controle de Faturamento" (Hospital Bom Pastor)

### 🎯 O que foi feito:
1. **Substituição da Identidade Visual e Logotipo**:
   - Substituído o logo do Consórcio CISA pelo logotipo oficial do **Hospital Bom Pastor — Santo Augusto** (`logo_hbp.jpg`) em todos os cabeçalhos institucionais do módulo de Prestação de Contas;
   - Inseridos novos badges de identificação: `HOSPITAL BOM PASTOR`, `CONTROLE DE FATURAMENTO`, `TODOS OS PROGRAMAS` e `GESTÃO INTEGRADA`.
2. **Atualização da Nomenclatura e Propósito da Página**:
   - Nome atualizado de *Prestação de Contas — Ambulatório de Oftalmologia (CISA)* para **Prestação de Contas e Controle de Faturamento — Ambulatório de Oftalmologia**;
   - Descrição redefinida para posicionar o módulo como a central unificada de controle de recebimentos, faturamento de programas integrados (SUS Gaúcho e CISA) e apuração de pagamentos e custos dos prestadores;
   - Barra de navegação lateral renomeada de *Consórcio CISA* para **Especialidades (Ambulatórios)**;
   - Botão de ação rápida ajustado para **`Novo Lançamento`**.
3. **Cache-Busting e Sincronização**:
   - Cache buster atualizado em `index.html` para `prestacao_contas.js?v=20260924_9`.

---

## [2026-09-24] - Prestação de Contas / Oftalmologia: Remoção da Tabela Detalhada CISA e Inclusão da Linha "Produção CISA - Oftalmologia" nas Receitas

### 🎯 O que foi feito:
1. **Remoção da Tabela de Procedimentos e Valores Pactuados (Contrato CISA)**:
   - Removido o card detalhado de procedimentos individuais (`#tbPcProcs`) da aba de Prestação de Contas, centralizando essa visualização na aba original Consórcio CISA;
   - O painel agora foca diretamente nas receitas consolidadas e no rateio de custos operacionais ambulatoriais.
2. **Inclusão da Linha "Produção CISA - Oftalmologia" na Tabela de Receitas**:
   - A tabela superior passa a demonstrar de forma consolidada e limpa as duas fontes de faturamento:
     - **Linha 1**: `SUS Gaúcho - Ambulatório Estratégico Oftalmologia` (`Portaria SES/RS nº 611/2026`);
     - **Linha 2**: `Produção CISA - Oftalmologia` (`Procedimentos Ambulatoriais e Diagnósticos Especializados`).
   - Cada linha possui seu seletor dinâmico de status (`Recebido FES`, `Aguardando Recurso`, `Pago ao Prestadores`) e valor formatado sem bordas com edição ao clicar;
   - Em Junho e Julho, a linha CISA possui valor inicial de `R$ 0,00` e o SUS Gaúcho `R$ 81.276,00`;
   - Em Agosto, a linha CISA reflete a produção realizada de `R$ 17.536,44` e o SUS Gaúcho `R$ 0,00`;
   - O rodapé calcula o **Total Geral das Receitas Faturadas** somando dinamicamente ambas as rubricas.
3. **Sincronização com o Estudo de Viabilidade e Rateio 80/20**:
   - As colunas de receitas no card de Viabilidade e no Comprovante PDF detalham automaticamente a rubrica do SUS Gaúcho e a Receita do Consórcio CISA;
   - Sincronização automática dos pills dos 12 meses (`JUN: R$ 81.276,00`, `JUL: R$ 81.276,00`, `AGO: R$ 17.536,44`).
4. **Persistência**:
   - Storage versionado como `prestacao_monthly_store_2026_v8` e cache buster `prestacao_contas.js?v=20260924_8`.

---

## [2026-09-24] - Prestação de Contas / Oftalmologia: Seletor Interativo de Status e Formatação Sem Bordas da Receita

### 🎯 O que foi feito:
1. **Seletor Dinâmico de Status de Repasse com Cores Semânticas**:
   - Status inicial padrão definido como **`Recebido FES`** (badge verde suave: `#eafaf1` / `#167b45`);
   - Disponibilizado seletor dropdown elegante integrado à tabela com as opções:
     - **`Recebido FES`** (Repasse estadual creditado);
     - **`Aguardando Recurso`** (badge âmbar suave: `#fef6ea` / `#b86a04`);
     - **`Pago aos Prestadores`** (badge azul suave: `#eff6ff` / `#1d4ed8`);
   - O status selecionado atualiza instantaneamente o estilo visual do pill e é persistido no armazenamento local (`localStorage`) da competência.
2. **Formatação Limpa e Sem Bordas para o Valor Financeiro**:
   - Removido o layout retangular de campo de formulário com bordas azuis;
   - Aplicado layout idêntico ao da coluna financeira da tabela inferior (`TOTAL/MÊS`), exibindo o valor em tipografia limpa, sem bordas (`color: #2563eb; font-weight: 800; font-size: 0.95rem;`);
   - Preservada a capacidade de edição inline ao clicar no valor, permitindo ajustes pontuais e recálculo automático mantendo a estética visual perfeita.
3. **Persistência e Cache-Busting**:
   - Chave de armazenamento atualizada para `prestacao_monthly_store_2026_v7` garantindo inicialização correta com status padrão "Recebido FES";
   - Cache-buster atualizado em `index.html` para `prestacao_contas.js?v=20260924_7`.

---

## [2026-09-24] - Prestação de Contas / Oftalmologia: Formatação em Linha Única da Receita "SUS Gaúcho - Ambulatório Estratégico Oftalmologia"

### 🎯 O que foi feito:
1. **Redesenho para Tabela de Linha Única de Receita do Programa (sem scroll horizontal)**:
   - Removida a composição dividida entre consultas e médicos individuais na tabela de receitas superiores, atendendo à diretriz de que a divisão médica será apurada posteriormente na prestação de contas dos profissionais;
   - Criada a nova tabela estritamente focada em receita de programa com 4 colunas limpas de largura 100% responsiva (sem barra de rolagem horizontal):
     - **Rubrica / Programa Estadual**: `SUS Gaúcho - Ambulatório Estratégico Oftalmologia` acompanhado da menção legal `Portaria SES/RS nº 611/2026 (Mutirão de Especialidades)`;
     - **Origem / Destinação Orçamentária**: `Custeio Ambulatorial Especializado (FES/RS)`;
     - **Status do Repasse**: `Homologado` (badge de conformidade);
     - **Receita Faturada (R$)**: Campo interativo pré-preenchido com **`R$ 81.276,00`**.
2. **Pactuação e Quantitativos de Junho (`06`) e Julho (`07`)**:
   - Faturamento global do programa lançado em linha única de **`R$ 81.276,00 / mês`**;
   - Nos meses de junho e julho, a receita do Consórcio CISA permanece em zero (`R$ 0,00`), mantendo o SUS Gaúcho como receita exclusiva desses meses;
   - Os pills de navegação dos 12 meses sincronizam perfeitamente `JUN: R$ 81.276,00`, `JUL: R$ 81.276,00` e `AGO: R$ 17.536,44`.
3. **Consolidação Financeira & Estudo de Viabilidade (Rateio 80/20)**:
   - Receita SUS Gaúcho (Mutirão): **R$ 81.276,00**;
   - Receita Consórcio CISA: **R$ 0,00**;
   - Total de Receitas Faturadas: **R$ 81.276,00**;
   - Rateio 80% Médico: **R$ 65.020,80**;
   - Retenção 20% Hospitalar: **R$ 16.255,20**;
4. **Tira de 12 Meses (Pills Competência)**:
   - Junho (`JUN`): **R$ 81.276,00**;
   - Julho (`JUL`): **R$ 81.276,00**;
   - Agosto (`AGO`): **R$ 17.536,44** (produção CISA com 147 procedimentos);
5. **Comprovante Documental em PDF (`exportPrestacaoCustosPDF`)**:
   - Atualizado para discriminar no Demonstrativo de Receitas a rubrica `SUS Gaúcho - Ambulatório Estratégico Oftalmologia`.
6. **Independência dos Módulos**:
   - A aba original **Consórcio CISA** (`#tab-cisa`) permaneceu rigorosamente intacta e inalterada, mantendo sua produção e relatórios originais.

---

## [2026-09-24] - Novo Módulo: Prestação de Contas (Clonagem Completa do Módulo CISA)

### 🎯 O que foi feito:
1. **Novo Botão no Menu Principal de Navegação**:
   - Adicionado no cabeçalho global o botão **`Prestação de Contas`** (`data-tab="tab-prestacao-contas"`), posicionado estrategicamente ao lado do botão **`Consórcio CISA`**, com o ícone `file-check` do Lucide Icons.
2. **Nova Seção de Painel Independente (`#tab-prestacao-contas`)**:
   - Criada a seção `<section id="tab-prestacao-contas" class="tab-pane">` em `index.html` com layout master (sidebar esquerda + painel central dinâmico).
   - Identidade com cabeçalho documental, badges oficiais, dados do Consórcio CISA e botões de alternância (`Viabilidade & Prestação` vs `Ficha Técnica`).
3. **Criação do Script Dedicado e Modular `prestacao_contas.js`**:
   - Todo o ecossistema e funcionalidades do Consórcio CISA foram clonados com escopo e IDs próprios (`pcSidebarNav`, `pcMainContent`, `pcNativeDashboard`, `tbPcProcs`, `tbPcCustos`, etc.);
   - Preservadas e ativas todas as 15 regras contratuais de procedimentos (com divisão médica por Dr. Christian Pretto e Dr. Heron Gomes Correia), a tabela de 11 despesas rateadas com centros de custo, encargos de 30,91% (CEBAS Ativos + Equipe Substitutiva), subtotal de R$ 13.044,55, saldo de R$ 4.491,89 e rateio 80/20 (Repasse R$ 3.593,51 e Retenção R$ 898,38);
   - Exportação em PDF própria (`exportPrestacaoCustosPDF`) gerando o comprovante oficial com o título de Prestação de Contas e todas as assinaturas;
   - Gerenciamento de estado e armazenamento mensal próprio (`prestacao_monthly_store_2026_v1`), permitindo ao usuário evoluir, alterar colunas e criar relatórios futuros no módulo de Prestação de Contas com total independência, sem alterar nem afetar o módulo Consórcio CISA.
4. **Integração e Sincronização**:
   - Função `switchTab` em `app.js` atualizada para gerenciar a ativação da aba `tab-prestacao-contas`;
   - Inicialização nativa dos seletores e scripts ao final de `index.html`.

---

## [2026-09-24] - Módulo CISA: Atualização dos Encargos da Folha para 30,91% (CEBAS Ativos + Equipe Substitutiva)

### 🎯 O que foi feito:
1. **Atualização da Alíquota de Encargos para 30,91%**:
   - Atualizado o percentual aplicado sobre a folha rateada de pessoal de 35% para **`30,91%`** (tanto no texto da tabela quanto nos cálculos dinâmicos da competência ativa e no acumulado dos 12 meses);
   - Linha renomeada para **`Encargos da Folha (Provisão 30,91%)`**;
   - Subtítulo atualizado conforme determinação técnica: **`INSS patronal, FGTS, férias e 13º c/ CEBAS Ativos + Equipe Substituitiva (Base: R$ 8.713,42)`**;
   - Valor mensal recalculado: \(8.713,42 \times 30,91\% =\) **`R$ 2.693,32/mês`** (redução de R$ 356,38 em relação aos 35% anteriores).
2. **Impacto e Recálculo Global das Despesas e Rateio 80/20**:
   - **Subtotal de Custos Operacionais Rateados**: atualizado de R$ 13.400,93 para **`R$ 13.044,55/mês`**;
   - **Saldo Líquido a Ratear**: \(17.536,44 - 13.044,55 =\) **`R$ 4.491,89`**;
   - **Rateio 80% Médico**: \(4.491,89 \times 80\% =\) **`R$ 3.593,51`** (aumento de R$ 285,10 no repasse médico);
   - **Retenção Hospitalar Líquida (20%)**: \(4.491,89 \times 20\% =\) **`R$ 898,38`** (aumento de R$ 71,28 na retenção hospitalar);
   - **TOTAL DA DESPESA DO PROGRAMA**: \(13.044,55 + 3.593,51 =\) **`R$ 16.638,06`**.
3. **Comprovante Documental em PDF**:
   - Sincronização automática de todos os novos valores e descrição da alíquota de 30,91% com CEBAS Ativos no comprovante para impressão e deliberação.
4. **Versionamento**:
   - Cache busters: `style.css?v=20260924_1` e `app.js?v=20260924_1`.

---

## [2026-09-23] - Módulo CISA: Logo Hospital Bom Pastor, Botão de Exportação em PDF e Área "Versão para Aprovação"

### 🎯 O que foi feito:
1. **Identidade Visual Institucional - Hospital Bom Pastor (Santo Augusto)**:
   - Inserido no canto superior esquerdo do card de custos o logo oficial do **Hospital Bom Pastor de Santo Augusto** (`logo_hbp.jpg`), com moldura e badges institucionais (`Hospital Bom Pastor • Santo Augusto` e `CISA / Oftalmologia`).
2. **Botão Superior Direito: Baixar Comprovante em PDF**:
   - Adicionado no canto superior direito o botão estilizado **`Baixar Comprovante PDF`** (`#btnExportCisaCustosPDF`), com ícone `file-down` e estilização verde esmeralda executiva (`btn-cisa-pdf-export`).
   - Implementada a função global `window.exportCisaCustosPDF()`, que gera dinamicamente um documento oficial formatado para impressão A4 / PDF, contendo:
     - Cabeçalho timbrado com logo HBP e identificação de competência e data de emissão;
     - Tabela completa de custos e despesas rateadas (12 linhas com centros de custo, percentuais de rateio, quantitativos e valores unitários/totais);
     - Linha de Encargos Sociais da Folha (35% s/ R$ 8.713,42 = R$ 3.049,70);
     - Subtotal de Custos Operacionais Rateados (R$ 13.400,93);
     - Demonstrativo de Receitas CISA e Consolidação de Despesas & Rateio 80/20 (Repasse Médico R$ 3.308,41 e Retenção Hospitalar R$ 827,10);
     - Tarja destacada de homologação técnica;
     - Três campos formais para assinatura da Direção Executiva/Provedoria, Coordenação Médica e Contratualização/Faturamento.
3. **Área de Destaque "Versão para Aprovação"**:
   - Inserido callout destacado abaixo da tabela de custos (`cisa-aprovacao-box`) com badge âmbar **`Versão para Aprovação`**, texto de memória preliminar para deliberação das partes e status dinâmico "Aguardando Aprovação Formal".
4. **Versionamento**:
   - Cache busters atualizados: `style.css?v=20260923_4` e `app.js?v=20260923_5`.

---

## [2026-09-23] - Módulo CISA: Ajuste de Centro de Custo, Paleta das Pills e Título de Subtotal

### 🎯 O que foi feito:
1. **Renomeação de Coluna na Tabela de Custos**:
   - Alterado o cabeçalho de `Classificação` para **`Centro de Custo`**.
2. **Harmonização Visual das Pills de Centro de Custo**:
   - Pill **`Prestador`**: Atualizada para elegante paleta rosa/roxo (`color: #be185d`, `background: rgba(219, 39, 119, 0.10)`, dark mode `color: #f472b6`).
   - Pills **`Sistemas TI`** e **`Taxa de Sala`**: Unificadas com a mesma paleta âmbar/laranja da pill **`Material`** (`color: #b45309`, `background: rgba(245, 158, 11, 0.12)`, dark mode `color: #fcd34d`).
3. **Novo Título de Subtotal no Rodapé da Tabela de Custos**:
   - Atualizado para **`SUBTOTAL DE CUSTOS OPERACIONAIS RATEADOS PELA OFTALMOLOGIA`**.
4. **Versionamento de Cache**:
   - `style.css?v=20260923_3` e `app.js?v=20260923_4`.

---

## [2026-09-23] - Módulo CISA: Linha Destacada de Encargos da Folha (35% sobre Pessoal Rateado)

### 🎯 O que foi feito:
1. **Linha Especial Diferenciada de Encargos**:
   - Inserida imediatamente após a última linha do grupo de pessoal (`Equipe de Higienização`) e antes de `Material de Almoxarifado` a linha **`Encargos da Folha (Provisão 35%)`**:
     - Estilização visual destacada com borda tracejada superior, borda sólida inferior e fundo azul suave (`cisa-row-encargos`);
     - Pill de classificação dedicada **`Encargos`** (`cat-encargos`, ícone `shield-check`);
     - Base de cálculo automática informada: soma da folha de pessoal rateada (**`R$ 8.713,42`**);
     - Percentual aplicado: **`35%`**;
     - Custo rateado mensal calculado dinamicamente: \(8.713,42 \times 35\% =\) **`R$ 3.049,70/mês`**;
     - Pill de ação indicando cálculo automatizado (`Auto`).
2. **Atualização do Custo Total Operacional**:
   - Subtotal das despesas operacionais atualizado de R$ 10.351,23 para **`R$ 13.400,93/mês`**.
3. **Recálculo da Tabela de Negociação (Rateio 80/20)**:
   - **Receita Mensal do Programa**: **`R$ 17.536,44`**;
   - **Despesas de Pessoal Consolidada**: R$ 12.290,93 (pessoal + encargos + almoxarifado);
   - **Sistema Hospitalar TASY**: R$ 510,00;
   - **Manutenção e Infra Predial (tx de sala)**: R$ 600,00;
   - **Subtotal das Despesas Operacionais**: **`R$ 13.400,93`**;
   - **Saldo a Ratear**: \(17.536,44 - 13.400,93 =\) **`R$ 4.135,51`**;
   - **Rateio 80% Médico**: \(4.135,51 \times 80\% =\) **`R$ 3.308,41`**;
   - **Retenção Líquida Hospital (20%)**: \(4.135,51 \times 20\% =\) **`R$ 827,10`**;
   - **TOTAL DA DESPESA**: \(13.400,93 + 3.308,41 =\) **`R$ 16.709,34`**.
4. **Versionamento**:
   - Cache busters atualizados: `style.css?v=20260923_2` e `app.js?v=20260923_3`.

---

## [2026-09-23] - Módulo CISA: Inclusão da Equipe Administrativa e Atualização Dinâmica do Rateio 80/20

### 🎯 O que foi feito:
1. **Nova Linha de Custo Operacional**:
   - Inserida após a `Equipe de Faturamento` a linha **`Equipe Administrativa (Adm, Financeiro, RH,...)`**:
     - Classificação: **`Pessoal`** (pill azul com ícone `users`);
     - Qtd: `1` | Rateio: `5%` | Custo Mensal: **`R$ 20.000,00`**;
     - Custo Rateado Mensal: \(20.000,00 \times 5\% =\) **`R$ 1.000,00/mês`**.
2. **Atualização da Tabela de Custos (11 Linhas)**:
   - Subtotal das despesas operacionais atualizado de R$ 9.351,23 para **`R$ 10.351,23/mês`**.
3. **Recálculo da Tabela de Negociação (Regra Rateio 80% / 20%)**:
   - **Receita Mensal do Programa**: **`R$ 17.536,44`**;
   - **Despesas de Pessoal**: R$ 9.241,23;
   - **Sistema Hospitalar TASY**: R$ 510,00;
   - **Manutenção e Infra Predial (tx de sala)**: R$ 600,00;
   - **Subtotal das Despesas Operacionais**: **`R$ 10.351,23`**;
   - **Saldo a Ratear**: \(17.536,44 - 10.351,23 =\) **`R$ 7.185,21`**;
   - **Rateio 80% Médico**: \(7.185,21 \times 80\% =\) **`R$ 5.748,17`**;
   - **Retenção Líquida Hospital (20%)**: \(7.185,21 \times 20\% =\) **`R$ 1.437,04`**;
   - **TOTAL DA DESPESA**: \(10.351,23 + 5.748,17 =\) **`R$ 16.099,40`**.
4. **Versionamento e Integridade**:
   - Chave de armazenamento atualizada para `cisa_monthly_store_2026_v16`.
   - Script cache buster atualizado para `app.js?v=20260923_2`.

---

## [2026-09-23] - Módulo CISA: Padronização de Nomenclaturas, Agrupamento de Pessoal e Pills de Classificação de Despesas

### 🎯 O que foi feito:
1. **Padronização das Nomenclaturas de Custos Operacionais**:
   - `Apoio de Faturamento` renomeado para **`Equipe de Faturamento`**.
   - `Supervisão de Regulação de Agendas GERCON/CISA` renomeado para **`Equipe de Supervisão/Regulação Agendas GERCON/CISA`**.
   - `Recepção` renomeado para **`Equipe de Recepção`**.
   - `Higienização e Limpeza` renomeado para **`Equipe de Higienização`**.
2. **Reordenação para Agrupamento Contíguo de Pessoal**:
   - A linha **`Equipe de Higienização`** foi reposicionada acima de **`Material de Almoxarifado`**, consolidando todas as 6 funções de despesa de pessoal de forma sequencial (Enfermeiro, Técnicos, Recepção, Regulação, Faturamento e Higienização).
3. **Nova Coluna e Pills Visuais de Classificação de Despesas**:
   - Adicionada a coluna dedicada **"Classificação"** na tabela de rateio de custos operacionais:
     - **Prestador**: Médico Oftalmologista (`cat-prestador`, ícone `user-check`).
     - **Pessoal**: Enfermeiro, Técnico, Recepção, Regulação, Faturamento e Higienização (`cat-pessoal`, ícone `users`).
     - **Material**: Material de Almoxarifado (`cat-material`, ícone `package`).
     - **Sistemas TI**: Manutenção Sistema Hospitalar - TASY (`cat-sistemas-ti`, ícone `monitor`).
     - **Taxa de Sala**: Manutenção e Infra Predial (`cat-taxa-de-sala`, ícone `building`).
   - Suporte completo no modo de edição inline via seletor `<select>` e persistência de dados.
4. **Versionamento e Integridade**:
   - Chave de armazenamento atualizada para `cisa_monthly_store_2026_v15`.
   - Cache busters atualizados: `style.css?v=20260923_1` e `app.js?v=20260923_1`.

---

## [2026-09-22] - Módulo CISA: Inclusão de Almoxarifado, Higienização e Atualização do Rateio 80/20

### 🎯 O que foi feito:
1. **Novas Linhas na Tabela de Custos Operacionais**:
   - Inserida linha **"Material de Almoxarifado"** com os parâmetros base da recepção:
     - Qtd: `1` | Rateio: `20%` | R$ Unitário: **`R$ 2.639,07`** | R$ Rateado: **`R$ 527,81/mês`**.
   - Inserida linha **"Higienização e Limpeza"** com os parâmetros base da recepção:
     - Qtd: `1` | Rateio: `20%` | R$ Unitário: **`R$ 2.639,07`** | R$ Rateado: **`R$ 527,81/mês`**.
   - Atualizado rateio de **Enfermeiro(a)** e **Técnicos de Enfermagem** para **30%** conforme parametrização:
     - Enfermeiro(a) (2 prof, 30%): **`R$ 3.413,10/mês`**;
     - Técnico de Enfermagem (2 prof, 30%): **`R$ 2.244,57/mês`**.
2. **Subtotalização e Consolidação das Despesas Operacionais**:
   - Subtotal das despesas operacionais atualizado de R$ 8.295,60 para **`R$ 9.351,23/mês`** (consolidando Pessoal R$ 8.241,23 + TASY R$ 510,00 + Infra R$ 600,00).
3. **Recálculo do Modelo de Negócio 80/20 (Rateio Médico)**:
   - **Receita Mensal do Programa**: **`R$ 17.536,44`**;
   - **Subtotal das Despesas Operacionais**: **`R$ 9.351,23`**;
   - **Saldo a Ratear**: \(17.536,44 - 9.351,23 =\) **`R$ 8.185,21`**;
   - **Rateio 80% Médico**: \(8.185,21 \times 80\% =\) **`R$ 6.548,17`**;
   - **Margem Líquida Hospital (20%)**: \(8.185,21 \times 20\% =\) **`R$ 1.637,04`**;
   - **TOTAL DA DESPESA**: \(9.351,23 + 6.548,17 =\) **`R$ 15.899,40`**.
4. **Parametrização e Versionamento**:
   - Store key migrada para `cisa_monthly_store_2026_v14`.
   - Script cache buster atualizado para `app.js?v=20260922_16`.

---

## [2026-09-22] - Módulo CISA: Implementação do Rateio 80% Médico e Subtotal das Despesas na Regra 80/20

### 🎯 O que foi feito:
1. **Subtotalização e Nova Linha de Despesa de Repasse Médico**:
   - No modelo de negócio **Rateio 80% / 20%**, o valor anterior de R$ 5.466,77 passa a figurar como **"Subtotal das Despesas"** (custos operacionais de estrutura, pessoal e sistemas).
   - Inserida logo após o subtotal a nova linha de despesa **"Rateio 80% Médico"**, calculada dinamicamente como **80% do saldo total que sobrou**:
     - Saldo a Ratear: \(\text{Receita Total (R\$\,17.536,44)} - \text{Subtotal Despesas (R\$\,5.466,77)} = \text{R\$\,12.069,67}\);
     - **Rateio 80% Médico**: \(12.069,67 \times 80\% =\) **`R$ 9.655,74`**.
2. **Atualização do Total Geral da Despesa**:
   - O totalizador de rodapé **"TOTAL DA DESPESA"** passa a consolidar o subtotal operacional mais o repasse médico:
     - \(\text{R\$\,5.466,77} + \text{R\$\,9.655,74} =\) **`R$ 15.122,51`**.
   - O saldo remanescente retido pelo hospital corresponde com exatidão aos 20% do resultado líquido (\(17.536,44 - 15.122,51 = \text{R\$\,2.413,93}\)).
3. **Parametrização e Versionamento**:
   - Modelo **Rateio 80% / 20%** configurado como regra ativa padrão na inicialização do serviço.
   - Storage versionado para `cisa_monthly_store_2026_v13`.
   - Script cache buster atualizado para `app.js?v=20260922_15`.

---

## [2026-09-22] - Módulo CISA: Consolidação das Despesas em 3 Linhas na Tabela de Regra de Negociação

### 🎯 O que foi feito:
1. **Reestruturação da Coluna "■ DESPESAS"**:
   - As despesas foram consolidadas dinamicamente em 3 linhas operacionais principais:
     1. **Despesas de Pessoal**: Consolida médicos, enfermagem, técnicos, recepção, supervisão de regulação e apoio de faturamento (\(1.706,55 + 1.122,29 + 527,81 + 680,85 + 319,27 =\) **`R$ 4.356,77/mês`**).
     2. **Sistema Hospitalar TASY**: Linha dedicada à manutenção do software de gestão hospitalar (\(5.100,00 \times 10\% =\) **`R$ 510,00/mês`**).
     3. **Manutenção e infra predial (tx de sala)**: Linha dedicada a utilidades e infraestrutura física (\(20.000,00 \times 3\% =\) **`R$ 600,00/mês`**).
2. **Atualização do Rodapé / Total da Despesa**:
   - Totalizador atualizado para **"TOTAL DA DESPESA"** exibindo com destaque em vermelho o valor total rateado de **`R$ 5.466,77`**.
   - Integração com a faixa superior (Dark Pool):
     - Receita Total: **`R$ 17.536,44`**
     - Despesa Total: **`R$ 5.466,77`**
     - Resultado a Ratear: **`+ R$ 12.069,67`**
3. **Ajustes de Layout e Responsividade**:
   - Configurado `minmax(0, 1fr)` no grid de layout do painel CISA e `.cisa-split` para evitar expansão indevida e garantir que todos os valores permaneçam 100% visíveis dentro da viewport sem cortes.
4. **Versionamento**:
   - Cache buster atualizado para `style.css?v=20260922_14` e `app.js?v=20260922_14`.

---

## [2026-09-22] - Módulo CISA: Atualização dos Custos Operacionais com Valores Reais (Médias de Enfermagem, Apoio, Regulação e TASY)

### 🎯 O que foi feito:
1. **Atualização dos Valores Unitários e Médias Salariais**:
   - **Enfermeiro(a) / Ambulatório Especializado**:
     - Média calculada entre Enf 1 (R$ 6.246,65) e Enf 2 (R$ 5.130,34): **`R$ 5.688,50`**;
     - Quantidade: `2` | Rateio: `15%` | Custo Total Rateado: **`R$ 1.706,55/mês`**.
   - **Técnicos de Enfermagem (Triagem/Suporte Ambulatorial)**:
     - Média calculada entre Tec Enf 1 (R$ 3.784,91) e Tec Enf 2 (R$ 3.696,99): **`R$ 3.740,95`**;
     - Quantidade: `2` | Rateio: `15%` | Custo Total Rateado: **`R$ 1.122,29/mês`**.
   - **Recepção**:
     - Custo Unitário real: **`R$ 2.639,07`**;
     - Quantidade: `1` | Rateio: `20%` | Custo Total Rateado: **`R$ 527,81/mês`**.
   - **Supervisão de Regulação de Agendas GERCON/CISA**:
     - Custo Unitário real: **`R$ 3.404,23`**;
     - Quantidade: `1` | Rateio: `20%` | Custo Total Rateado: **`R$ 680,85/mês`**.
   - **Apoio de Faturamento**:
     - Custo Unitário real: **`R$ 3.192,73`**;
     - Quantidade: `1` | Rateio: `10%` | Custo Total Rateado: **`R$ 319,27/mês`**.
   - **Manutenção Sistema Hospitalar - TASY**:
     - Retificado o Custo Unitário para: **`R$ 5.100,00`**;
     - Quantidade: `1` | Rateio: `10%` | Custo Total Rateado: **`R$ 510,00/mês`**.
   - **Manutenção e Infra Predial (Luz/Agua/Net)**:
     - Mantido Custo Unitário em **`R$ 20.000,00`** | Quantidade: `1` | Rateio: `3%` | Custo Total Rateado: **`R$ 600,00/mês`**.
   - **Médicos Oftalmologistas Cirurgiões com RQE (por produção)**:
     - Mantido com remuneração por resultado/produção (Custo direto: `R$ 0,00`).
2. **Consolidação Geral dos Indicadores Operacionais**:
   - **Novo Custo Operacional Rateado**: **`R$ 5.466,77/mês`**;
   - **Receita Mensal Média**: **`R$ 17.536,44/mês`**;
   - **Resultado Operacional Médio Líquido**: **`+ R$ 12.069,67/mês`**;
   - **Margem Líquida**: **`68,8%`**;
   - **Ponto de Equilíbrio (Break-Even)**: **`31,2%`**.
3. **Versionamento e Persistência**:
   - Storage versionado para `cisa_monthly_store_2026_v12`.
   - Script cache buster atualizado para `app.js?v=20260922_13`.

---

## [2026-09-22] - Módulo CISA: Atualização do Badge de Status da Produção para "Realizado"

### 🎯 O que foi feito:
1. **Atualização da Pill de Status de Produção**:
   - Alterado o texto do badge de status na tabela de acompanhamento de produção mensal CISA de *"Cotado"* para **"Realizado"** (`.status-cotado` exibindo ícone de confirmação e texto `Realizado`).
   - Reflete adequadamente a natureza da tabela executiva de competência mensal, na qual figuram apenas procedimentos oftalmológicos efetivamente realizados e faturados.
2. **Versionamento**:
   - Cache buster atualizado para `app.js?v=20260922_12`.

---

## [2026-09-22] - Módulo CISA: Detalhamento e Desmembramento das Linhas de Apoio, Faturamento e Manutenção

### 🎯 O que foi feito:
1. **Desmembramento e Reestruturação das Despesas de Apoio e Regulação**:
   - **Recepção**: Criada como linha exclusiva com 1 profissional, custo unitário de R$ 2.500,00 e **20% de rateio** (\(\text{Total} = \text{R\$\,500,00}\)).
   - **Supervisão de Regulação de Agendas GERCON/CISA**: Nova linha específica para regulação de agendas com 1 profissional, custo unitário de R$ 2.500,00 e **20% de rateio** (\(\text{Total} = \text{R\$\,500,00}\)).
   - **Apoio de Faturamento**: Renomeada a linha de faturamento, configurada com 1 profissional, custo unitário de R$ 2.500,00 e **10% de rateio** (\(\text{Total} = \text{R\$\,250,00}\)).
2. **Desmembramento da Manutenção Hospitalar e Infraestrutura Predial**:
   - **Manutenção Sistema Hospitalar - TASY**: Criada linha própria do ERP Hospitalar TASY com custo de R$ 5.800,00 e **10% de rateio** (\(\text{Total} = \text{R\$\,580,00}\)).
   - **Manutenção e Infra Predial (Luz/Agua/Net)**: Criada linha para utilidades e infraestrutura física com valor total de R$ 20.000,00 e **3% de rateio** (\(\text{Total} = \text{R\$\,600,00}\)).
3. **Consolidação Geral do Custo Rateado CISA**:
   - **Novo Custo Operacional Rateado**: **`R$ 5.430,00/mês`**;
   - **Resultado Operacional Líquido**: **`+ R$ 12.106,44/mês`**;
   - **Indicadores**: Margem Líquida em **`69,0%`** e Break-Even em **`31,0%`**.
4. **Versionamento e Armazenamento**:
   - Store atualizado para `cisa_monthly_store_2026_v11` e cache buster para `app.js?v=20260922_11`.

---

## [2026-09-22] - Módulo CISA: Ajuste de Custos e Rateio para Enfermeiro e Técnico de Enfermagem

### 🎯 O que foi feito:
1. **Atualização da Equipe de Enfermagem no Rateio de Custos**:
   - **Enfermeiro(a) / Ambulatório Especializado**:
     - Quantidade: atualizada de `0` para **`2`** profissionais;
     - Rateio Ambulatorial: ajustado para **`15%`**;
     - Custo Unitário: **`R$ 5.000,00`**;
     - Total Rateado da Linha: \(2 \times \text{R\$\,5.000,00} \times 15\% =\) **`R$ 1.500,00/mês`**.
   - **Técnicos de Enfermagem (Triagem/Suporte Ambulatorial)**:
     - Quantidade: atualizada de `1` para **`2`** profissionais;
     - Rateio Ambulatorial: ajustado de 50% para **`15%`**;
     - Custo Unitário: ajustado de R$ 4.200,00 para **`R$ 5.000,00`**;
     - Total Rateado da Linha: \(2 \times \text{R\$\,5.000,00} \times 15\% =\) **`R$ 1.500,00/mês`**.
2. **Impacto no Custo Operacional e Resultados do Serviço CISA**:
   - **Custo Operacional Fixo Rateado**: Ajustado para **`R$ 4.800,00/mês`** (antes R$ 3.900,00);
   - **Resultado Operacional Mensal do Programa**: **`+ R$ 12.736,44/mês`**;
   - **Indicadores de Desempenho**: Margem Líquida em **`72,6%`** e Ponto de Equilíbrio (Break-Even) em **`27,4%`**;
   - Cards executivos e faixas de rateio sincronizados automaticamente com os novos valores.
3. **Versionamento e Armazenamento**:
   - Store atualizado para `cisa_monthly_store_2026_v10` e cache buster para `app.js?v=20260922_10`.

---

## [2026-09-22] - Módulo CISA: Reformulação da Coluna "RECEITAS" no Estudo de Viabilidade / Regra de Negociação

### 🎯 O que foi feito:
1. **Atualização dos Cabeçalhos das Colunas de Split**:
   - Coluna da esquerda renomeada de "■ HOSPITAL" para **"■ RECEITAS"**.
   - Coluna da direita renomeada de "■ PRESTADOR" para **"■ DESPESAS"** (preparada para os detalhamentos da próxima etapa).
2. **Reestruturação das Linhas de Receita do Programa CISA**:
   - **Incentivo ASSISTIR**: Definido como `R$ 0,00` (não aplicável ao consórcio CISA).
   - **Produção Tabela CISA**: Renomeado de "Produção SIGTAP" para **"Produção Tabela CISA"**, vinculado dinamicamente à soma total faturada na tabela de produção mensal acima (`totRec`, atualmente **R$ 17.536,44** na competência de Agosto/2026).
   - **Remoção de Linhas Inaplicáveis**: Removidas da coluna de Receitas as linhas de *"Exames Linha de Cuidado"* e *"Custos de Produção/Fixos"*.
3. **Resultado Mensal da Coluna de Receitas**:
   - O rodapé **"RESULTADO MENSAL"** da coluna soma as receitas apuradas acima (`R$ 0,00 + R$ 17.536,44 = + R$ 17.536,44`), representando a receita bruta total do programa.
   - Os valores da coluna de Receitas permanecem estáveis e independentes de qualquer alternância entre as opções de regras de negociação (50% Margem ou Rateio 80/20).
4. **Versionamento**:
   - Cache buster atualizado para `app.js?v=20260922_09`.

---

## [2026-09-22] - Módulo CISA: Remoção do Botão e Função "Replicar Mês"

### 🎯 O que foi feito:
1. **Remoção Visual do Botão**:
   - Retirado o botão `#btnCisaReplicateMonth` ("Replicar Mês") da barra de controle mensal da produção CISA (`cisa-month-bar`), mantendo o foco exclusivo na seleção pontual de competências.
2. **Remoção da Função JavaScript**:
   - Eliminado o listener e lógica de replicação em lote de dados entre meses em `app.js`, prevenindo sobrescrita acidental de competências com dados reais.
3. **Versionamento**:
   - Cache buster atualizado para `app.js?v=20260922_08`.

---

## [2026-09-22] - Módulo CISA: Atualização dos Cards Executivos com Valores Mensais Médios e Limpeza Visual

### 🎯 O que foi feito:
1. **Atualização dos Títulos e Textos dos 3 Cards Executivos de Topo**:
   - **Card 1**: Renomeado para **"Receita Mensal Média"**; removido o subtítulo redundante (*"Produção: 17 procedimentos com produção • Custeio: Produção apurada"*).
   - **Card 2**: Renomeado para **"Custo Operacional Médio"**; removido o texto redundante (*"Equipe Mínima RQE + Enfermagem + Apoio"*).
   - **Card 3**: Renomeado para **"Resultado Operacional Médio"**; mantidos os indicadores de *Margem Líquida* e *Break-Even*.
2. **Cálculo Dinâmico de Valores Mensais Médios**:
   - O cálculo do motor analítico (`recalc`) agora afere a quantidade de meses com produção/custos lançados (`countMonthsActive`).
   - Os valores de destaque nos 3 cards passam a refletir a **Média Mensal** (\(\text{Total Acumulado} \div \text{Meses Ativos}\)). Como atualmente apenas a competência de Agosto/2026 está lançada, a média calculada reflete:
     - **Receita Mensal Média**: **R$ 17.536,44**
     - **Custo Operacional Médio**: **R$ 3.900,00**
     - **Resultado Operacional Médio**: **+ R$ 13.636,44** (Margem: **77,8%** | Break-Even: **22,2%**)
3. **Preservação dos Resultados Anuais no Rodapé dos Cards**:
   - Mantidas no rodapé inferior de cada um dos 3 cards as linhas de controle anual acumulado:
     - Card 1: *Projeção Anual*: **R$ 17.536,44**
     - Card 2: *Custo Anual Total*: **R$ 3.900,00**
     - Card 3: *Resultado Anual Líquido*: **+ R$ 13.636,44** (em verde institucional `#059669`)
4. **Versionamento**:
   - Cache buster atualizado para `app.js?v=20260922_07`.

---

## [2026-09-22] - Módulo CISA: Implementação do Rateio de Custos Operacionais Ambulatoriais

### 🎯 O que foi feito:
1. **Reformulação da Tabela de Despesas ("Rateio de Custos Operacionais Ambulatoriais")**:
   - Título atualizado para **"Rateio de Custos Operacionais Ambulatoriais"** e subtítulo explicitando que os custos operacionais e de apoio são rateados proporcionalmente entre os ambulatórios de especialidades que compartilham a estrutura física e operacional.
   - **Nova Coluna de "Rateio (%)"**: Inserida à esquerda da coluna de Quantidade, permitindo ajustar interativamente o percentual de apropriação do recurso para o ambulatório de Oftalmologia (\(\text{Total} = \text{Qtd} \times \text{Valor Unitário} \times \frac{\text{Rateio \%}}{100}\)).
2. **Atualização dos Itens e Recursos Operacionais (Competência Agosto/2026)**:
   - *Médicos Oftalmologistas Cirurgiões com RQE (por produção)*: Qtd = 2, Valor = R$ 0,00 (Total = R$ 0,00), visto que a remuneração médica se dá pela divisão do resultado financeiro apurado da produção.
   - *Enfermeiro(a) / Ambulatório Especializado*: Qtd = 0, Valor = R$ 0,00 (Total = R$ 0,00).
   - *Técnicos de Enfermagem (Triagem/Suporte Ambulatorial)*: Qtd = 1, Valor = R$ 4.200,00, Rateio = 50% (Total = R$ 2.100,00).
   - *Recepcionista / Apoio Central de Regulação CISA*: Qtd = 1, Valor = R$ 2.500,00, Rateio = 30% (Total = R$ 750,00).
   - *Faturamento / Central de Regulação (GERCON)*: Qtd = 1, Valor = R$ 2.500,00, Rateio = 30% (Total = R$ 750,00).
   - *Manutenção Sistemas Hospitalares e Infra Predial*: Qtd = 1, Valor = R$ 3.000,00, Rateio = 10% (Total = R$ 300,00).
3. **Consolidação dos Resultados Econômico-Financeiros do Ambulatório**:
   - **Custo Operacional Fixo Rateado**: Reduzido de R$ 39.072,86 para **R$ 3.900,00/mês**.
   - **Receita Mensal Faturada CISA**: **R$ 17.536,44**.
   - **Superávit Operacional Líquido**: **+ R$ 13.636,44/mês** (Margem Líquida altamente superavitária de **77,8%** e Break-Even de **22,2%**).
   - Atualizados os cards de topo com os novos valores para Agosto/2026, mantendo os demais meses em branco.
4. **Versionamento e Armazenamento**:
   - Store atualizado para `cisa_monthly_store_2026_v9` e cache buster para `app.js?v=20260922_06`.

---

## [2026-09-22] - Módulo CISA: Remoção dos Procedimentos Não Realizados (Qtd = 0) na Competência de Agosto/26

### 🎯 O que foi feito:
1. **Otimização da Tabela de Produção de Agosto/2026 (Viabilidade CISA)**:
   - Conforme solicitação da gestão, foram removidos da visualização e do store de **Agosto/2026** todos os procedimentos que não tiveram realização e constavam com quantitativo zerado (`0`):
     - `00483` - Consulta especializada em oftalmologia (c/ mapeam. + tonome)
     - `00256` - Campimetria computadorizada (linha zerada do Dr. Christian Pretto; preservada a linha produtiva do Dr. Heron com 2 exames)
     - `00261` - Mapeamento de retina (01 olho)
     - `00269` - Fundoscopia
     - `00543` - Potencial de acuidade visual
     - `00593` - Retirada de corpo estranho do olho (hon/sala/mat)
2. **Exibição Focada Exclusivamente na Produção Real Apurada**:
   - A tabela de produção do mês de agosto agora exibe com exclusividade as **17 linhas de exames efetivamente realizados**, totalizando **170 exames** e faturamento de **R$ 17.536,44**:
     - **Dr. Christian Pretto**: 9 exames diagnósticos, 145 realizações, R$ 15.147,55
     - **Dr. Heron Gomes Correia**: 8 exames diagnósticos, 25 realizações, R$ 2.388,89
3. **Preservação Integral do Catálogo Contratual na Ficha Técnica**:
   - A relação contratual completa dos **15 procedimentos oficiais pactuados** com o CISA foi separada em `window.cisaContratoOficialProcs`, garantindo que a página de **Ficha Técnica** continue exibindo todos os itens do convênio e seu catálogo de diretrizes clínicas (10 procedimentos cotados com valor médio de R$ 89,92 e 5 a definir).
4. **Versionamento e Cache**:
   - Store atualizado para `cisa_monthly_store_2026_v8` e cache buster para `app.js?v=20260922_05`.

---

## [2026-09-22] - Módulo CISA: Lançamento da Produção Real do Dr. Christian Pretto & Consolidação Oftalmo Agosto/26

### 🎯 O que foi feito:
1. **Lançamento da Produção Real do Dr. Christian Pretto (Agosto/26)**:
   - Inseridos os 9 exames diagnósticos realizados pelo **Dr. Christian Pretto** com quantidades e valores reais informados:
     - *Tonometria (01 olho)*: 8 exames (R$ 113,68)
     - *Paquimetria Ultrassônica (01 olho)*: 6 exames (R$ 242,40)
     - *Retinografia Colorida Binocular (02 olhos)*: 19 exames (R$ 1.367,05)
     - *Tomografia de Coerência Óptica (ambos os olhos)*: 8 exames (R$ 2.507,76)
     - *Biometria Ultrassônica (01 olho)*: 40 exames (R$ 2.569,60)
     - *Microscopia Especular de Córnea (01 olho)*: 50 exames (R$ 7.454,50)
     - *Ultra-sonografia de Globo Ocular / Órbita (01 olho)*: 4 exames (R$ 287,80)
     - *Topografia Computadorizada de Córnea (01 olho)*: 8 exames (R$ 513,92)
     - *Gonioscopia*: 2 exames (R$ 90,84)
   - **Total Produzido pelo Dr. Christian Pretto**: 145 exames, somando **R$ 15.147,55**.
2. **Novos Procedimentos Cotados Identificados na Produção Real**:
   - `00258` Ultra-sonografia de globo ocular / órbita: valor unitário pactuado de **R$ 71,95** (status atualizado para Cotado).
   - `00260` Gonioscopia: valor unitário pactuado de **R$ 45,42** (status atualizado para Cotado).
   - O contrato agora possui 10 procedimentos com valores unitários cotados definidos.
3. **Consolidação Total Oftalmologia - Agosto/2026**:
   - **Exames Totais Realizados**: 170 exames (145 Dr. Christian + 25 Dr. Heron).
   - **Faturamento Bruto Consolidado CISA**: **R$ 17.536,44** (R$ 15.147,55 + R$ 2.388,89).
   - Subtotais por prestador destacados de forma transparente no rodapé da tabela e cards do painel sincronizados.
4. **Atualização de Cache e Store**:
   - Store atualizado para `cisa_monthly_store_2026_v7` e cache buster para `app.js?v=20260922_04`.

---

## [2026-09-22] - Módulo CISA: Lançamento da Produção Real do Dr. Heron Gomes Correia & Linhas Consecutivas por Médico

### 🎯 O que foi feito:
1. **Lançamento da Produção Real do Dr. Heron Gomes Correia (Agosto/26)**:
   - Inseridos os 8 exames diagnósticos realizados pelo **Dr. Heron Gomes Correia** com as quantidades e valores reais informados:
     - *Biometria Ultrassônica (01 olho)*: 4 exames (R$ 256,96)
     - *Tonometria (01 olho)*: 4 exames (R$ 56,84)
     - *Microscopia Especular de Córnea (01 olho)*: 6 exames (R$ 894,54)
     - *Retinografia Colorida Binocular (02 olhos)*: 3 exames (R$ 215,85)
     - *Tomografia de Coerência Óptica (ambos os olhos)*: 2 exames (R$ 626,94)
     - *Campimetria Computadorizada (01 olho)*: 2 exames (R$ 128,48)
     - *Topografia Computadorizada de Córnea (01 olho)*: 2 exames (R$ 128,48)
     - *Paquimetria Ultrassônica (01 olho)*: 2 exames (R$ 80,80)
   - **Total Produzido pelo Dr. Heron**: 25 exames, somando **R$ 2.388,89**.
2. **Disposição Consecutiva por Procedimento (Médico Abaixo do Outro)**:
   - Ordenação inteligente no método `getFilteredProcs()` para que, quando um procedimento for realizado por médicos diferentes, as linhas apareçam imediatamente uma abaixo da outra (ex: linha do Dr. Christian Pretto seguida da linha do Dr. Heron Gomes Correia), facilitando a conferência e o lançamento.
   - Cores e bordas distintas nos seletores de prestador (azul para Dr. Christian Pretto e verde esmeralda para Dr. Heron Gomes Correia).
3. **Subtotais Automatizados por Prestador no Rodapé da Tabela**:
   - Inserida faixa de consolidação (`#cisaDoctorBreakdownRow`) no `<tfoot>` da tabela, exibindo em tempo real:
     - **Dr. Christian Pretto**: R$ 781,84 (8 procedimentos com valor)
     - **Dr. Heron Gomes Correia**: R$ 2.388,89 (25 exames realizados)
     - **Receita Total Consolidada da Competência**: R$ 3.170,73 (33 exames faturados)
4. **Desduplicação Contratual na Ficha Técnica**:
   - A página de Ficha Técnica (`renderCisaPortaria`) preserva a relação oficial única dos 15 itens contratuais e o valor médio unitário (\(R\$\ 97,73\)), sem duplicar linhas da produção física.
5. **Atualização de Cache e Build**:
   - Cache buster atualizado para `app.js?v=20260922_03` em `index.html` e store atualizado para `cisa_monthly_store_2026_v6`.

---

### 🎯 O que foi feito:
1. **Substituição da Coluna "Ações" por "Prestador"**:
   - Na tabela de procedimentos pactuados e controle de produção (`tbCisaProcs`), a última coluna foi renomeada de **"Ações"** para **"Prestador"**.
   - Cada linha de procedimento agora conta com um seletor interativo estilizado exibindo o médico responsável pela realização do procedimento.
2. **Corpo Clínico Oftalmológico Vinculado**:
   - Opções configuradas para os dois profissionais atuantes no serviço: **Dr. Christian Pretto** e **Dr. Heron Correia**.
   - Definido inicialmente **Dr. Christian Pretto** como prestador padrão dos 15 procedimentos da competência de Agosto/26.
   - Suporte a seleção e salvamento reativo tanto no modo de visualização direta quanto no modal de edição/criação de procedimento.
3. **Persistência do Prestador no Store Mensal**:
   - Chave do `localStorage` atualizada para `cisa_monthly_store_2026_v5`.
   - Campo `prestador` mapeado em cada item de procedimento, persistindo as escolhas por competência mensal.
4. **Atualização de Cache e Build**:
   - Cache buster de `app.js` atualizado para `app.js?v=20260922_02` em `index.html`.

---

### 🎯 O que foi feito:
1. **Produção Física e Financeira Inicial Exclusiva em Agosto/26**:
   - Ajustada a inicialização do store mensal (`cisa_monthly_store_2026_v4`) para que **somente Agosto/26** (`AGO` / `'08'`) inicie com a produção física e financeira cadastrada (`R$ 781,84` de receita e custos base).
   - Todos os demais meses (`JAN` a `JUL` e `SET` a `DEZ`) iniciam com quantidades e valores estritamente zerados (`qtd: 0`, financeiro `R$ 0,00`), permitindo lançamentos mensais manuais sob demanda.
   - O mês padrão selecionado na abertura da aba CISA passa a ser **Agosto** (`window.cisaSelectedMonth = '08'`).
   - Motor de recálculo atualizado para manter exibição limpa de `R$ 0,00` nos pills dos meses sem produção e somar na projeção anual apenas as competências efetivamente lançadas.

2. **Transferência do Catálogo de Descrição Técnica para a Ficha Técnica**:
   - Removida a seção 3.4 (*"Descrição Técnica e Diretrizes dos Procedimentos CISA"*) da visualização de **Viabilidade Financeira**, mantendo esta página focada exclusivamente na modelagem econômico-financeira, faturamento e rateio.
   - O catálogo descritivo com os 15 cards de procedimentos (código CISA, grupo, badge SIGTAP, descrição detalhada e finalidade clínica) foi transferido para o final da página de **Ficha Técnica** (`renderCisaPortaria`), posicionado imediatamente abaixo da tabela oficial e da nota de governança CISA.
   - O campo de busca rápida (`#cisaProcCatalogSearch`) foi reativado e integrado ao escopo da Ficha Técnica, filtrando em tempo real os cards por nome do procedimento, código CISA ou código SIGTAP.

3. **Atualização de Cache e Build**:
   - Cache buster de `app.js` atualizado para `app.js?v=20260922_01` em `index.html`.

---

### 🎯 O que foi feito:
1. **Barra de Controle Mensal da Produção (Tira de 12 Meses 2026)**:
   - Inserida a linha/barra de competências mensais (`.cisa-month-bar`) exatamente entre os 3 KPI cards de topo e as tabelas analíticas na página da especialidade CISA (e também em Todas Especialidades).
   - Contém 12 pills interativas (de `JAN` a `DEZ`), exibindo a sigla do mês e um subvalor dinâmico atualizado com o faturamento apurado de cada competência.
   - Badge dinâmico de competência ativa (`COMPETÊNCIA: [MÊS] / 2026`) com botão de atalho **"Replicar Mês"**, permitindo clonar as quantidades e cotações de um mês de referência para todo o exercício de 2026.
2. **Lançamento Físico e Financeiro Mensal com Edição Rápida Inline**:
   - Na tabela de procedimentos pactuados, a coluna `QTD` agora conta com um `<input type="number">` estilizado e responsivo no modo visual, permitindo lançar a produção física do mês ativo diretamente na tabela.
   - Modificações recalculam em tempo real a receita da linha, o total da tabela, os KPIs mensais, o acumulado anual da projeção e o rateio financeiro.
3. **Persistência Mensal Independente & Consolidação Automática**:
   - Criado modelo de dados em memória e `localStorage` (`cisa_monthly_store_2026_v2`) que armazena a produção e custos de cada mês de forma isolada e persistente.
   - Ao alternar entre meses, os dados da competência são carregados instantaneamente, sem perda dos lançamentos dos meses anteriores.
   - A visão "Todas Especialidades" consolida em tempo real a soma de todas as especialidades para a competência selecionada.
4. **Cálculo Dinâmico da Divisão de Valores / Rateio (Hospital vs. Prestador)**:
   - Integrado o quadro de **Regra de Negociação | Divisão de Valores** (`#cisaPoolBox` e `#cisaSplitBox`) ao motor interativo:
     - Apuração da Receita Total, Despesa Fixa Total e Resultado a Ratear.
     - **Modelo 50% Margem Hospitalar**: 50% da produção SIGTAP para o Hospital (que deduz os custos operacionais fixos) e 50% para a equipe médica/prestador.
     - **Modelo Rateio 80% / 20%**: 80% da produção para o prestador e 20% para o hospital deduzidos custos fixos.
     - Atualização instantânea ao alternar o mês, alterar quantidades de procedimentos/custos ou trocar o modelo de negociação.
5. **Atualização de Cache e Build**:
   - Cache buster de `app.js` atualizado para `app.js?v=20260921_05` em `index.html`.

---

## [2026-09-21] - Módulo CISA: Valor Médio dos Procedimentos no Rodapé da Ficha Técnica

### 🎯 O que foi feito:
1. **Substituição da Soma pelo Valor Médio dos Procedimentos**:
   - No rodapé (`<tfoot>`) da tabela de procedimentos da **Ficha Técnica** (`renderCisaPortaria`), a linha de totalizador foi renomeada de *"Soma dos Valores Unitários Pactuados"* para **"VALOR MÉDIO DOS PROCEDIMENTOS"**, mantendo a contagem dinâmica de procedimentos cotados.
2. **Cálculo da Média dos Procedimentos Oftalmológicos Cotados**:
   - O valor total anterior de R$ 781,84 (soma dos 8 itens já cotados) foi substituído pelo cálculo automatizado do **ticket médio unitário dos procedimentos pactuados** da linha de cuidado: `R$ 97,73` (\(781,84 \div 8\)).
   - O cálculo é reativo e recalcula a média aritmética sempre que itens forem atualizados ou filtrados por especialidade.
3. **Atualização de Cache e Build**:
   - Cache buster de `app.js` atualizado para `app.js?v=20260921_04` em `index.html`.

---

## [2026-09-21] - Módulo CISA: Coluna com Pill de Especialidade na Tabela da Ficha Técnica

### 🎯 O que foi feito:
1. **Nova Coluna de Especialidade na Tabela Oficial de Procedimentos CISA**:
   - Inserida uma coluna específica para a **Especialidade** posicionada imediatamente à esquerda da coluna de *Valor Unitário (R$)* na tabela da **Ficha Técnica** (`renderCisaPortaria`).
   - Ordem das colunas padronizada: `Código`, `Procedimento`, `Especialidade`, `Valor Unitário (R$)`, `Status`.
2. **Pill / Badge Visual de Especialidade**:
   - Cada procedimento exibe uma pill estilizada (`badge`) com cantos arredondados, fundo translúcido azul (`rgba(37, 99, 235, 0.08)`), borda sutil e ícone contextual Lucide (`eye` para Oftalmologia ou `stethoscope` para clínicas gerais).
   - Ajustados os cabeçalhos de grupo (Grupo 01 e Grupo 11) com `colspan="5"` e o rodapé de totalização com `colspan="3"` para alinhamento geométrico perfeito da tabela.
3. **Atualização de Cache e Build**:
   - Cache buster de `app.js` atualizado para `app.js?v=20260921_03` em `index.html`.

---

## [2026-09-21] - Módulo CISA: Opção 'Todas Especialidades' com Consolidação Geral do Programa Regional

### 🎯 O que foi feito:
1. **Menu Lateral CISA com Opção "Todas Especialidades" no Topo**:
   - Inserida a opção **"Todas Especialidades"** em primeiro lugar no menu lateral esquerdo do módulo CISA (`todas`), seguida por **"Oftalmologia"** (`oftalmologia`).
   - Ícone dinâmico `layers` em verde esmeralda com badge `TOTAL` para a visão consolidada, e ícone `eye` em azul com badge `CISA` para Oftalmologia.
   - Definida como opção ativa por padrão na abertura da aba CISA.
2. **Resultados Consolidados nos KPI Cards (Programa Completo)**:
   - Os 3 cards executivos de topo passam a consolidar a soma global de todas as especialidades CISA ativas:
     - **Receita Total Contratada (Consolidada)**: soma da produção cotada de todas as linhas de cuidado e projeção anual global.
     - **Custos Operacionais Totais (Consolidados)**: soma do custeio fixo de equipes clínicas multidisciplinares com RQE, enfermagem e apoio.
     - **Superávit Operacional Líquido do Programa**: saldo líquido global consolidado, margem e break-even do programa intermunicipal.
3. **Novo "Quadro de Consolidação das Especialidades CISA"**:
   - Tabela executiva comparativa inserida na visão consolidada que decompõe indicadores por especialidade (procedimentos, status de cotação, receita mensal, custos operacionais e resultado líquido) com botão direto de atalho ("Detalhar") para cada especialidade.
4. **Filtros e Detalhamento por Especialidade**:
   - Ao clicar em qualquer especialidade individual (ex.: "Oftalmologia"), a interface isola automaticamente os procedimentos e custos específicos daquela linha de cuidado.
   - Suporte a agrupamento dinâmico de procedimentos e exportação de CSV contendo a identificação da especialidade de cada item.
5. **Navegação Direta por Hash/URL**:
   - Implementado listener `checkUrlHashTab` em `index.html` para abrir diretamente abas via hash (ex.: `#tab-cisa`) ou parâmetro de consulta (`?tab=cisa`).
6. **Atualização de Cache e Build**:
   - Cache buster de `app.js` atualizado para `app.js?v=20260921_02`.

---

## [2026-09-21] - Ajuste de Interface CISA: Renomeação do Botão de Alternância

### 🎯 O que foi feito:
1. **Renomeação do Botão Executivo do CISA**:
   - O botão principal de visualização no cabeçalho do Consórcio CISA foi simplificado de *"Estudo de Viabilidade Financeira"* para apenas **"Viabilidade Financeira"**, tornando a barra de navegação superior mais concisa e equilibrada com o botão *"Ficha Técnica"*.
2. **Atualização de Cache e Build**:
   - Incrementado o parâmetro de cache em `index.html` para `app.js?v=20260921_01`.

---

## [2026-09-11] - Emissão do Estudo Executivo: 10 Funcionalidades Disruptivas (PDF)

### 🎯 O que foi feito:
1. **Elaboração do Plano de Inovação Disruptiva & Regulação SUS**:
   - Definição técnica e estratégica de 10 novas funcionalidades de alto valor agregado para a Santa Casa de Bagé:
     1. *Sentinela Pré-Faturamento & Gêmeo Digital de Glosas SUS*
     2. *Cross-Matching Inteligente de Emendas Parlamentares*
     3. *Balança de Arbitragem de Capacidade Instalada*
     4. *Gerador Automatizado de Defesa de Metas do Programa ASSISTIR*
     5. *Geointeligência de Evasão e Atração Regional (CISA / 7ª CRS)*
     6. *Grafo de Dependência Regulatória e Médicos com RQE*
     7. *Atas Executivas Inteligentes de Negociação (CIR / CIB / CISA)*
     8. *Custeio Direto por Procedimento (TDABC Hospitalar)*
     9. *Radar de Habilitações com Dossiê SAIPS Automatizado*
     10. *Simulador de Estresse de Caixa SUS (Cenários de Choque)*
2. **Compilação e Diagramação em PDF de Alta Resolução**:
   - Geração do documento oficial de 3 páginas via Chrome Headless: [`10_Funcionalidades_Disruptivas_Santa_Casa_Bage.pdf`](file:///C:/Users/henry/OneDrive/_Meus%20Projetos/_Sala%20de%20Situação/10_Funcionalidades_Disruptivas_Santa_Casa_Bage.pdf).
   - Inclui resumo executivo, detalhamento funcional por camadas, impactos econômicos para a Santa Casa e Matriz de Priorização (Impacto vs. Complexidade).

---

## [2026-09-11] - Auditoria Geral do Sistema e Criação do `docs/AUDIT.md`

### 🎯 O que foi feito:
1. **Auditoria Geral Automatizada (Chrome Headless & DOM)**:
   - Execução de suíte de testes dinâmicos via Google Chrome Headless com inspeção profunda do DOM gerado.
   - Validação de 100% de aprovação (zero erros, tabelas paritárias CISA, catálogo técnico de 15 procedimentos com SIGTAP, diagramação justificada e modelos de rateio simplificados).
2. **Criação do Documento Oficial de Auditoria (`docs/AUDIT.md`)**:
   - Centralização dos critérios de aceitação, matriz de testes e evidências de renderização para referência futura.
3. **Reforço do Protocolo de Documentação Obrigatória para IAs**:
   - Registro de que toda e qualquer intervenção ou auditoria deve ser registrada em `/docs`.

---

## [2026-09-11] - Instituição da Matriz Tecnológica Padrão ("A IA Acerta na Primeira Tentativa") e Auditoria do Código

### 🎯 O que foi feito:
1. **Documentação da Matriz de Escolhas Tecnológicas**:
   - Inclusão em `docs/README.md` e `docs/ARCHITECTURE.md` da matriz de 12 tecnologias oficiais para guiar todas as IAs em desenvolvimentos presentes e futuros:
     - **Backend**: Python + Flask
     - **Banco**: SQLite
     - **Frontend**: HTML + Jinja2 + Bootstrap (Zero build step, CDN)
     - **Mapas**: Leaflet.js + OpenStreetMap
     - **Grafos**: Cytoscape.js (proibição de D3)
     - **Gráficos**: Chart.js (CDN)
     - **Dados**: Pandas + openpyxl
     - **Áudio**: Whisper (local)
     - **PDF**: pdfplumber + Tesseract
     - **IA local**: Ollama
     - **IA cloud**: Gemini Free / Groq Free
     - **Segurança**: python-dotenv
2. **Auditoria Geral do Código Fonte**:
   - Verificação completa de dependências em `index.html`, `app.js` e `style.css`.
   - Constatada **conformidade total**:
     - O sistema já utiliza **Chart.js v4.4.1** via CDN (alinhado à diretriz).
     - Utiliza **Lucide Icons** via CDN (alinhado à diretriz de zero build).
     - Não há dependências obsoletas ou conflitantes (zero D3.js, zero build tools pesadas).
     - O frontend atual opera com arquitetura limpa sem build step.

---

## [2026-09-11] - Padronização CISA, Simplificação de Rateio e Catálogo Técnico

### 🎯 O que foi feito:
1. **Padronização das Tabelas Financeiras CISA**:
   - Inclusão das colunas **QTD** e **TOTAL/MÊS** na tabela de procedimentos pactuados, garantindo paridade total com a tabela de custos operacionais fixos.
   - Remoção de botões isolados de adicionar procedimentos/custos que poluíam o cabeçalho das tabelas.
2. **Catálogo de Procedimentos Oftalmológicos com SIGTAP**:
   - Criação de uma base estruturada com todos os 15 procedimentos oftalmológicos do Contrato CISA (`window.cisaProcedimentosDescricoes`).
   - Mapeamento de cada procedimento para o código oficial correspondente da **Tabela SIGTAP / SUS**.
   - Redação de descrições clínicas técnicas e de **Finalidades Clínicas** específicas para cada exame.
   - Inclusão de campo de busca dinâmico em tempo real (`#cisaProcCatalogSearch`) para filtrar por nome, código CISA ou código SIGTAP.
3. **Limpeza da Seção Antiga de Termos**:
   - Remoção completa do bloco obsoleto com os 6 cards genéricos de termos e conformidade que constava acima do catálogo.
   - O catálogo passou a ser o cabeçalho e corpo principal do card.
4. **Simplificação das Regras de Negociação / Modelos de Rateio CISA**:
   - Removidos os cards **Mínimo Garantido**, **Rateio 70% / 30%** e **Construção Livre**.
   - Mantidos como modelos operacionais: **50% Margem Hospitalar** (ativo por padrão) e **Rateio 80% / 20%**.
   - Removida a caixa amarela de parâmetros manuais intermediários (`#cisaRuleParams`) a pedido do usuário.
5. **Tipografia e Diagramação dos Cards de Procedimentos**:
   - Aplicação de alinhamento justificado (`text-align: justify; text-justify: inter-word; hyphens: auto;`) na descrição e finalidade clínica.
   - Redução dos tamanhos de fonte (`0.74rem` no texto, `0.70rem` na finalidade e `0.84rem` no título) e redução do padding do card para deixá-lo menor, mais compacto e harmonioso.
6. **Criação da Pasta `/docs`**:
   - Instituído o padrão de documentação para continuidade entre IAs com `README.md`, `ARCHITECTURE.md`, `MODULES.md` e `CHANGELOG.md`.

---

## 🔮 Backlog de Próximas Tarefas:
- [ ] Conectar os modelos de rateio (50% Margem e 80/20) para calcular e atualizar dinamicamente a apuração nos painéis Hospital vs. Prestador.
- [ ] Expandir o cálculo automático do superávit operacional com base na quantidade e custos informados.
- [ ] Exportação consolidada de relatórios de viabilidade CISA em PDF formatado.
