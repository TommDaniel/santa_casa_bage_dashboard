# Documentação Funcional dos Módulos do Sistema

O sistema conta com **20 módulos principais** acessíveis através da barra de navegação superior:

---

## 1. Visão Geral (`#tab-overview`)
- **Objetivo**: Painel executivo consolidado com os principais indicadores de desempenho do hospital.
- **Componentes**:
  - Cards de KPIs globais: Receita SUS total, taxa de ocupação, faturamento ambulatorial e hospitalar.
  - Gráficos de evolução histórica de repasses.
  - Alertas de cumprimento de metas e saldos orçamentários.

---

## 2. Contratualização (`#tab-contratualizacao`)
- **Objetivo**: Acompanhamento formal do instrumento contratual com o gestor do SUS (Secretaria Estadual e Municipal de Saúde).
- **Componentes**:
  - Dados do contrato, aditivos e vigências.
  - Metas qualitativas e quantitativas estabelecidas em contrato.
  - Matriz de penalidades e retenções contratuais.

---

## 3. Habilitações (`#tab-habilitacoes`)
- **Objetivo**: Cadastro e monitoramento das habilitações de alta e média complexidade concedidas pelo Ministério da Saúde.
- **Componentes**:
  - Habilitações ativas: Glaucoma (0506), Traumato-Ortopedia, Cardiologia, UTI Adulto e Neonatal.
  - Número das portarias GM/MS concessoras e datas de publicação no Diário Oficial da União (DOU).

---

## 4. Incentivos (`#tab-incentivos`)
- **Objetivo**: Controle financeiro dos incentivos e parcelas fixas/variáveis recebidas pela Santa Casa.
- **Componentes**:
  - Incentivos de custeio MAC, Incentivo 100% SUS, programas estaduais e complementações federais.

---

## 5. Alta Complexidade (`#tab-alta-complexidade`)
- **Objetivo**: Acompanhamento dos serviços hospitalares de nível terciário.
- **Componentes**:
  - Indicadores de cirurgias cardíacas, neurocirurgia, ortopedia de alta complexidade e terapia intensiva.

---

## 6. FAEC (`#tab-faec`)
- **Objetivo**: Gestão dos procedimentos financiados pelo Fundo de Ações Estratégicas e Compensação (extra-teto).
- **Componentes**:
  - Rastreamento de nefrologia (diálise), oncologia, transplantes e cirurgias de urgência interestaduais/intermunicipais.

---

## 7. Emendas Parlamentares (`#tab-emendas`)
- **Objetivo**: Gestão de recursos extraordinários destinados ao hospital por deputados federais e estaduais e senadores.
- **Componentes**:
  - Tabela completa de emendas com: Tipo (Individual, Bancada, Comissão), Autor, Número da Proposta, GND (Custeio vs. Investimento), Valor Indicado, Valor Recebido, Contrapartida Executada e Status.
  - Modal interativo para **Cadastro e Edição de Emendas**.
  - Monitoramento da regra de contrapartida obrigatória de 30% em serviços.

---

## 8. Metas Físicas (SIA / AIH) (`#tab-metas`)
- **Objetivo**: Acompanhamento das séries temporais de produção física frente ao pactuado em contrato.
- **Componentes**:
  - Comparativo mês a mês: AIHs apresentadas vs. aprovadas vs. teto contratual.
  - Painel de glosas e motivos de rejeição de faturas SUS.

---

## 9. Produção Ambulatorial (`#tab-producao-ambulatorial`)
- **Objetivo**: Rastreamento dos atendimentos realizados via Boletim de Produção Ambulatorial (BPA) e APAC.
- **Componentes**:
  - Consultas médicas especializadas, exames diagnósticos externos e procedimentos de enfermagem.

---

## 10. SUS Gaúcho / ASSISTIR (`#tab-sus-gaucho` / `#tab-assistir`)
- **Objetivo**: Acompanhamento do **Programa ASSISTIR - Incentivos Hospitalares do Rio Grande do Sul** (Portaria SES/RS nº 537/2021 e Portaria SES nº 46/2026).
- **Componentes**:
  - Menu lateral dinâmico de especialidades: Cardiologia, Traumatologia, Maternidade de Alto Risco, etc.
  - Avaliação da **Matriz de Qualidade Hospitalar** (cumprimento de metas de consultas e cirurgias).
  - Verificação de impacto de retenção financeira por não cumprimento de metas.

---

## 11. Consórcio CISA (`#tab-cisa`)
- **Objetivo**: Gestão integral do **Contrato Intermunicipal de Serviços de Saúde com o Consórcio CISA** (CNPJ: 02.231.696/0001-92).
- **Componentes do Módulo**:
  1. **Cabeçalho Executivo**: Identificação formal com logos da Santa Casa de Bagé e CISA, dados do contrato regional e badges de habilitação (Habilitação 0506 Glaucoma).
  2. **Cards de KPIs Executivos**:
     - *Receita Mensal Contratada* (com indicador de procedimentos cotados vs. a definir).
     - *Custos Operacionais* (folha de equipe mínima com RQE, enfermagem e manutenção).
     - *Superávit Operacional Líquido*.
  3. **Tabela de Procedimentos e Valores Pactuados (Contrato CISA)**:
     - Formato padrão financeiro com colunas: Código, Procedimento, **QTD**, **R$ UNITÁRIO**, **TOTAL/MÊS**, Status (Cotado / A definir) e Ações (edição inline).
     - Dividida em *01 · Consultas especializadas* e *11 · Diagnóstico em oftalmologia*.
  4. **Tabela de Custos Operacionais do Serviço (Equipe e Infraestrutura)**:
     - Formato padrão financeiro com colunas: Função/Recurso, **QTD**, **R$ UNITÁRIO**, **TOTAL/MÊS** e Ações.
     - Médicos Oftalmologistas Cirurgiões RQE, Enfermeiro de Centro Cirúrgico, Técnicos de Enfermagem, Recepcionista e Manutenção preventiva.
  5. **Painel de Regra de Negociação & Viabilidade**:
     - Modelos simplificados: **50% Margem Hospitalar** e **Rateio 80% / 20%**.
     - Barra de apuração executiva (*Receita Total − Despesa Total = Resultado a Ratear*).
     - Colunas comparativas de consolidação financeira: **Hospital** vs. **Prestador**.
  6. **Catálogo Técnico e Diretrizes dos Procedimentos Oftalmológicos**:
     - 15 cards técnicos com códigos CISA e pills destacadas com os códigos oficiais **SIGTAP / SUS**.
     - Descrição técnica minuciosa de cada exame e cirurgia em linguagem clínica.
     - Destaque para a **Finalidade Clínica** (indicações diagnósticas, pré-operatórios de catarata, seguimento de glaucoma, ceratocone, retinopatia diabética).
     - Tipografia compacta com **alinhamento justificado** (`text-align: justify; text-justify: inter-word; hyphens: auto;`).
     - Barra de busca dinâmica em tempo real por nome, código CISA ou código SIGTAP.
  7. **Ficha Técnica Oficial (Anexo 3)**: Alternância dinâmica para visualização da ficha de requisitos contratuais normativos.

---

## 12. SUS Gaúcho - Avançar (`#tab-avancar`)
- **Objetivo**: Gestão de recursos de investimentos em infraestrutura e parque tecnológico repassados pelo Programa Avançar RS.

---

## 13. SUS Gaúcho - Mutirão (`#tab-mutirao`)
- **Objetivo**: Gestão de recursos extraordinários e produção de mutirões de cirurgias eletivas e consultas de especialidades.

---

## 14. PMAE OCIs (`#tab-pmae-ocis`)
- **Objetivo**: Programa de Modernização e Apoio aos Hospitais Estruturantes - Operações de Crédito Individualizadas.

---

## 15. PMAE CC (`#tab-pmae-cc`)
- **Objetivo**: Acompanhamento de despesas de custeio corrente autorizadas no PMAE.

---

## 16. PMAE Crédito Financeiro (`#tab-credito`)
- **Objetivo**: Gestão dos contratos de crédito, amortizações de dívidas, carências e garantias estaduais vinculadas aos repasses contratuais.

---

## 17. SIGTAP (`#tab-sigtap`)
- **Objetivo**: Consulta e cruzamento da Tabela de Procedimentos, Medicamentos e OPM do SUS (Sistema de Gerenciamento da Tabela de Procedimentos).

---

## 18. Inverno Gaúcho (`#tab-inverno-gaucho`)
- **Objetivo**: Recursos extraordinários sazonais e leitos de retaguarda para atendimento a infecções respiratórias agudas graves no período de frio.

---

## 19. Pró-Hospitais (PPH/RS) (`#tab-pro-hospitais`)
- **Objetivo**: Gestão do Programa de Apoio aos Hospitais do RS baseado na **Lei Complementar nº 16.163/2024** e regulamentado pela **Portaria SES nº 602/2025**.
- **Componentes**:
  - Simulador Fiscal de Compensação de ICMS (limite de 5% do saldo devedor para empresas aportadoras).
  - Transcrição oficial da legislação aplicável.

---

## 20. Rede Alyne (`#tab-rede-alyne`)
- **Objetivo**: Monitoramento da linha de cuidado materno-infantil (evolução da Rede Cegonha no âmbito federal), garantindo segurança ao parto, pré-natal de alto risco e leitos de UTI Neonatal/Pediátrica.
