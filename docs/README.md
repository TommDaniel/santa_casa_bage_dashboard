# Sala de Situação: Acompanhamento Contratual SUS
## Santa Casa de Caridade de Bagé (CNES: 2261987 · CNPJ: 87.408.845/0001-07)

---

## 📌 Visão Geral do Sistema
O sistema **Sala de Situação: Acompanhamento Contratual SUS** é uma plataforma executiva e analítica web de alta performance desenvolvida para a gestão hospitalar integrada da Santa Casa de Caridade de Bagé. A ferramenta centraliza o monitoramento de metas físicas e orçamentárias do SUS, controle de incentivos federais e estaduais (RS), pactuações de consórcios intermunicipais (CISA), gestão de emendas parlamentares e estudos detalhados de viabilidade econômico-financeira de serviços de saúde.

---

## 🤖 DIRETRIZES OBRIGATÓRIAS PARA QUALQUER IA QUE ASSUMIR O PROJETO

> [!IMPORTANT]
> **REGRA DE OURO PARA AGENTES E IAs:**
> Sempre que você for realizar qualquer alteração neste repositório, você **DEVE** seguir este protocolo à risca:
> 1. **Ler esta documentação** (`docs/README.md`, `docs/ARCHITECTURE.md`, `docs/MODULES.md` e `docs/CHANGELOG.md`) para entender o contexto global, regras de negócio e não reintroduzir erros ou desfazer padrões já validados pelo usuário.
> 2. **Verificar se houve alterações manuais ou de outra IA** no código (`git status`, `git log -n 5`) antes de realizar qualquer edição.
> 3. **Preservar o Design System Antigravity**:
>    - Uso estrito das variáveis CSS de tema (`var(--bg-card)`, `var(--text-title)`, `var(--text-muted)`, `var(--border-color)`, `var(--blue-vibrant)`, etc.).
>    - Tipografia compacta, alinhamento consistente, espaçamentos padronizados e cantos arredondados suaves (`border-radius: 6px` a `8px`).
>    - Ícones Lucide (`<i data-lucide="..."></i>`) com re-renderização pós-injeção de HTML (`lucide.createIcons()`).
> 4. **A cada edição de código feita**, você deve:
>    - Atualizar a documentação correspondente na pasta `/docs` (especialmente `docs/CHANGELOG.md` e `docs/MODULES.md` caso altere regras ou interfaces).
>    - Incrementar o parâmetro de cache do script no rodapé de `index.html` (`app.js?v=YYYYMMDD_XX`).
>    - Versionar as alterações no Git (`git add`, `git commit` com mensagem semântica clara) e enviar para o repositório remoto (`git push origin main`).
>    - Fornecer os links de acesso atualizados ao usuário.

---

## 📂 Estrutura de Documentação em `/docs`

- **[`docs/README.md`](file:///C:/Users/henry/OneDrive/_Meus%20Projetos/_Sala%20de%20Situação/docs/README.md)** (este arquivo): Entrada principal, diretrizes para IAs e visão geral.
- **[`docs/ARCHITECTURE.md`](file:///C:/Users/henry/OneDrive/_Meus%20Projetos/_Sala%20de%20Situação/docs/ARCHITECTURE.md)**: Arquitetura técnica, pilha tecnológica, ciclo de vida das abas, gerenciamento de estado e motor de cálculos.
- **[`docs/MODULES.md`](file:///C:/Users/henry/OneDrive/_Meus%20Projetos/_Sala%20de%20Situação/docs/MODULES.md)**: Detalhamento funcional exaustivo de cada um dos 20 módulos do sistema.
- **[`docs/CHANGELOG.md`](file:///C:/Users/henry/OneDrive/_Meus%20Projetos/_Sala%20de%20Situação/docs/CHANGELOG.md)**: Histórico cronológico de versões, implementações, refatorações e pendências.

---

## 🌐 Ambientes e Execução

- **Repositório Git**: `https://github.com/TommDaniel/santa_casa_bage_dashboard.git` (Branch: `main`)
- **Deploy Online (GitHub Pages)**: [https://tommdaniel.github.io/santa_casa_bage_dashboard/](https://tommdaniel.github.io/santa_casa_bage_dashboard/)
- **Servidor Local de Desenvolvimento**: `http://localhost:8000` (executado via `python -m http.server 8000` na raiz do projeto).
