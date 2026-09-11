# Histórico de Atualizações & Roadmap do Projeto

Este arquivo registra cronologicamente todas as edições, implementações, refatorações de código e próximos passos para continuidade do projeto por qualquer agente de inteligência artificial ou desenvolvedor.

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
