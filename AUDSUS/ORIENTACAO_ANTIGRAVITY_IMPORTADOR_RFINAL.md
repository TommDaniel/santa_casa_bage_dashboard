# Orientação ao Antigravity — Importador do arquivo RFINAL (produção ambulatorial MAC/SUS)

**Destino:** tema **MAC** / subtabelas de produção ambulatorial
**Objetivo:** substituir o preenchimento manual mensal por um campo de arrastar-e-soltar que lê o relatório `.txt` do SIA/SUS e preenche as subtabelas. A entrada manual **continua existindo** como alternativa e como mecanismo de correção.

---

## 1. O que o usuário quer poder fazer

1. Arrastar (ou selecionar) **um arquivo `.txt`** para uma área de upload no topo do tema MAC.
2. Ver um **preview** do que foi lido, com as validações já rodadas e o comparativo contra o que já está gravado.
3. Confirmar e ter as subtabelas preenchidas, sem digitar nada.
4. Poder, a qualquer momento, **digitar manualmente** (competência sem arquivo, correção pontual, ajuste pós-glosa).

O arquivo vem **sempre no mesmo formato** (relatório de caractere, layout fixo, gerado pelo DATASUS). O parser deve ser escrito contra esse layout, não contra heurística de IA.

---

## 2. Identificação e formato do arquivo

| Item | Valor |
|---|---|
| Nome | `RFINAL_AMB_<SUFIXO>.<MMM>` — ex.: `RFINAL_AMB_E_NEFRO.JUL` |
| Extensão | abreviação do mês em português (JAN…DEZ). **Não usar para definir a competência** |
| Emissor | `SAS/DATASUS/0202` |
| Relatório | `SIA/SUS — ACOMPANHAMENTO DA PROGRAMAÇÃO FÍSICO ORÇAMENTÁRIA` |
| Encoding | **latin-1 / ISO-8859-1** (não UTF-8; acentos vêm como byte único) |
| Fim de linha | **CRLF** (`\r\n`) |
| Caracteres de controle | `\x0c` (form feed, quebra de página) e sequências ESC de impressora (`\x1b(s17,27H`, `\x12`) — **remover antes de parsear** |
| Tamanho típico | ~7.600 linhas / ~900 kB |

O upload deve aceitar qualquer extensão (`.JUL`, `.txt`, sem extensão) e validar pelo **conteúdo**: precisa conter `SAS/DATASUS` e `ACOMPANHAMENTO DA PROGRAMACAO FISICO`. Se não contiver, recusar com mensagem clara.

---

## 3. Estrutura lógica do arquivo

### 3.1 Metadados (cabeçalho de página, repetido a cada página)

```
   SAS/DATASUS/0202                     SANTANA DO LIVRAMENTO                     PAGINA :0001
     SIA/SUS      ACOMPANHAMENTO DA PROGRAMACAO FISICO  ORCAMENTARIA        EMISSAO : 20/08/2026

                                        COMPETENCIA : JUL/2026

     CNES.  : 2248220  SANTA CASA DE MISERICORDIA
```

Extrair uma vez e **descartar as repetições**:

- `municipio` → campo central da linha `SAS/DATASUS`
- `emissao` → `EMISSAO : dd/mm/aaaa`
- `competencia_referencia` → `COMPETENCIA : MMM/AAAA` (**esta é a competência de referência do relatório; é ela que manda, nunca o nome do arquivo**)
- `cnes` e `estabelecimento` → linha `CNES. :`

### 3.2 Seções

O corpo é dividido por marcadores entre asteriscos, nesta ordem:

```
***** TIPO DE FINANCIAMENTO : M A C  *****     <- resumo por SUBGRUPO (a PPI)
***** COMPLEXIDADE : MEDIA *****               <- detalhe por PROCEDIMENTO
***** COMPLEXIDADE : ALTA *****                <- detalhe por PROCEDIMENTO
***** TIPO DE FINANCIAMENTO : F A E C  *****
***** COMPLEXIDADE : NAO SE APLICA *****
***** COMPLEXIDADE : MEDIA *****
***** COMPLEXIDADE : ALTA *****
     Total                                     <- total geral do estabelecimento
```

Regra de estado: ao encontrar `TIPO DE FINANCIAMENTO`, zera financiamento **e** complexidade. Ao encontrar `COMPLEXIDADE`, troca só a complexidade. **O primeiro bloco MAC não tem complexidade** — é o resumo da programação por subgrupo.

### 3.3 Linha de item

```
     020200000 - Diagnostico em laboratorio clinico          - MAC N.APURACAO : 2 SUB.GRUPO
     041801006 - IMPLANTE DE CATETER DUPLO LUMEN P/HEMODIALISE - EST N.APURACAO : 4 PROCED.
```

Regex sugerido:

```
^\s{2,}(\d{9})\s-\s(.*?)\s+-\s+(MAC|FAEC|EST|IAC)\s+N\.APURACAO\s*:\s*(\d+)\s+(.+?)\s*$
```

Campos: `codigo` (9 dígitos), `descricao`, `financiamento_item`, `nivel_apuracao` (código), `nivel_apuracao_txt`.

**Atenção a três armadilhas:**

- A descrição é **truncada em largura fixa** (~56 caracteres). `"Pequenas cirurgias e cirurgias de pele, tecido subcutaneo e"` vem cortada. Guardar como veio e, se quiser nome completo, buscar no SIGTAP pelo código — **nunca** completar por adivinhação.
- `financiamento_item` é o financiamento **do procedimento**, e pode divergir da seção. Neste arquivo, todos os itens das seções MAC são `MAC` e todos os da seção FAEC são `EST` (estratégico, nefrologia). **Agrupar sempre por `financiamento_item`, não pela seção.**
- `N.APURACAO` é o **nível em que o teto é apurado** (2 = subgrupo, 4 = procedimento). Não é o tipo da linha.

### 3.4 Tipo da linha (subgrupo x procedimento) — pelo código

```
codigo[4:] == '00000'  ->  linha de SUBGRUPO (agregado)
senão                  ->  linha de PROCEDIMENTO
```

Exemplo: `020200000` = subgrupo 0202. `020201047` = procedimento. O agregado de subgrupo **reaparece** dentro das seções de complexidade com `programado = 0` — **essas repetições devem ser descartadas** para não duplicar.

### 3.5 Linhas de competência (6 por item)

Cada item é seguido de **6 linhas**, uma por competência, formando uma **janela móvel dos últimos 6 meses** (no arquivo de jul/2026: FEV/26 a JUL/26).

```
     JUL/26    2050        2590 126,34       2590                9.840,00        9.793,07   99,52        9.793,07            0,00
```

Ordem das colunas:

| # | Campo | Tipo |
|---|---|---|
| 1 | competência (`MMM/AA`) | texto |
| 2 | físico programado | inteiro |
| 3 | físico aprovado | inteiro |
| 4 | % físico | decimal **ou `--`** |
| 5 | físico apresentado | inteiro |
| 6 | orçamentário programado | decimal |
| 7 | orçamentário aprovado | decimal |
| 8 | % orçamentário | decimal **ou `--`** |
| 9 | orçamentário apresentado | decimal |
| 10 | diferença de pagamento | decimal |

Regex sugerido:

```
^\s{2,}([A-Z]{3})/(\d{2})\s+(-?[\d.]+)\s+(-?[\d.]+)\s+([\d,]+|--)\s+(-?[\d.]+)\s+(-?[\d.,]+)\s+(-?[\d.,]+)\s+([\d,]+|--)\s+(-?[\d.,]+)\s+(-?[\d.,]+)\s*$
```

**Números em padrão brasileiro:** `.` é separador de milhar e `,` é decimal. `9.793,07` → `9793.07`. O `--` no percentual significa divisão por zero (sem programação) → gravar `null`, nunca `0`.

Alguns itens têm **menos de 6 linhas** (9 itens com 5 e 1 item com 3, neste arquivo). Não assumir 6; ler até a próxima linha de item ou de seção.

### 3.6 Total geral

Após a última seção:

```
     Total

     MAR/26   22138       21638  97,74      23755      484.259,43      451.785,11   93,29      481.243,00       0,00
     ...
```

Mesmo layout das linhas de competência. Neste arquivo o Total traz **5 competências** (falta FEV/26), enquanto os itens trazem 6. Tratar como normal.

---

## 4. Modelo de dados

Gravar **três camadas**, sem derivar uma da outra:

```
importacao_rfinal
  id, cnes, competencia_referencia, municipio, emissao, arquivo_nome,
  arquivo_hash_sha256, importado_em, importado_por, status

rfinal_ppi_subgrupo          -- resumo MAC por subgrupo (a programação)
  importacao_id, competencia, subgrupo (4 díg.), codigo (9 díg.), descricao,
  fisico_programado, fisico_aprovado, fisico_pct, fisico_apresentado,
  orc_programado, orc_aprovado, orc_pct, orc_apresentado, diferenca_pagto

rfinal_producao_procedimento -- detalhe por procedimento (o realizado)
  importacao_id, competencia, codigo (9 díg.), descricao,
  financiamento (MAC|EST|FAEC), complexidade (MEDIA|ALTA|NAO SE APLICA),
  + os mesmos 9 campos numéricos

rfinal_total_geral
  importacao_id, competencia, + os mesmos 9 campos numéricos
```

Índices por (`cnes`, `competencia`) e (`cnes`, `competencia`, `codigo`).

---

## 5. Regra de negócio crítica: as duas camadas NÃO se somam nem se conferem

Isto foi verificado no arquivo de jul/2026 e precisa estar no código, não na cabeça de quem usa:

- O **resumo MAC por subgrupo** (primeiro bloco) traz a **PPI** e o aprovado **limitado ao teto do subgrupo**. Lista apenas os **11 subgrupos com programação**.
- O **detalhe por procedimento** traz a produção efetiva, em **17 subgrupos** — inclui subgrupos sem PPI (0209 endoscopia, 0301 consultas, 0303, 0407, 0417).
- Para 4 dos 11 subgrupos (0204, 0205, 0211, 0401) o aprovado do resumo é **menor** que a soma dos seus procedimentos, por efeito do teto. Ex.: subgrupo 0401 em jul/26 → resumo 12 proc / R$ 176,04; soma dos procedimentos 69 proc / R$ 2.022,84.

**Portanto:** nunca validar "subgrupo = soma dos procedimentos" e nunca recalcular um a partir do outro. Exibir as duas colunas lado a lado (PPI e realizado) e deixar a diferença visível — ela é justamente o indicador de produção acima do teto.

---

## 6. Validações obrigatórias (rodar antes de gravar)

Estas identidades **fecham exatamente** e servem de teste de integridade do parse:

1. **Σ (todas as linhas de PROCEDIMENTO) = Total geral**, para `fisico_aprovado`, `orc_aprovado` e `orc_apresentado`, em todas as competências que tenham linha de Total.
2. **Total `fisico_programado` = Σ (resumo MAC subgrupo) + Σ (todos os procedimentos)**. Idem para `orc_programado`. (A programação MAC mora no subgrupo; a FAEC/EST mora no procedimento.)
3. Cada item tem entre 1 e 6 linhas de competência, todas dentro da janela de 6 meses que termina na competência de referência.
4. Nenhum código de procedimento repetido entre seções (no arquivo de referência: zero repetições).

Se (1) ou (2) falhar → **bloquear a gravação** e mostrar a divergência por competência. É sinal de parse errado ou de layout alterado pelo DATASUS.

### Teste de aceite — `RFINAL_AMB_E_NEFRO.JUL` (competência JUL/2026)

| Verificação | Valor esperado |
|---|---|
| CNES / estabelecimento | 2248220 — SANTA CASA DE MISERICORDIA |
| Município / emissão | SANTANA DO LIVRAMENTO / 20/08/2026 |
| Competências na janela | FEV/26, MAR/26, ABR/26, MAI/26, JUN/26, JUL/26 |
| Itens lidos | 873 (11 subgrupos no resumo MAC + 18 agregados repetidos + 844 procedimentos) |
| Procedimentos | 844 (815 MAC + 29 EST) |
| Total geral JUL/26 | 7.227 prog / 7.436 aprov / R$ 377.918,15 prog / R$ 353.495,62 aprov / R$ 365.813,63 apres |
| MAC aprovado JUL/26 (procedimentos) | 6.306 proc / **R$ 68.096,83** |
| FAEC-EST aprovado JUL/26 | 1.130 proc / **R$ 285.398,79** |
| Soma MAC + EST | 7.436 / R$ 353.495,62 → **igual ao Total** |
| PPI MAC JUL/26 (resumo) | 3.081 proc / R$ 31.884,46 |
| Total geral MAR/26 | 21.638 aprov / R$ 451.785,11 |

---

## 7. Comportamento da tela

### 7.1 Área de upload

- No topo do tema MAC: *"Arraste aqui o relatório RFINAL do mês (.txt do SIA/SUS)"*, com botão de seleção de arquivo como alternativa.
- Ao soltar: parse **no cliente ou no servidor**, sem gravar nada ainda.
- Mostrar um resumo do reconhecimento: CNES, estabelecimento, competência de referência, data de emissão, nº de itens, competências encontradas, e o resultado das validações da seção 6 (verde/vermelho).

### 7.2 Preview e confirmação

- Tabela de preview já no formato das subtabelas.
- Coluna **"gravado hoje"** x **"vindo do arquivo"** x **"Δ"**, para o usuário ver o que muda antes de confirmar.
- Se a competência já foi importada, avisar: *"JUL/2026 já importada em dd/mm às hh:mm. Reimportar substitui os dados."*
- Botões: **Confirmar importação** / **Cancelar**.

### 7.3 Entrada manual (mantida)

- Todo campo permanece editável.
- Campo preenchido por importação recebe marca visual (ícone/cor) e tooltip com arquivo e data de origem.
- Editar um campo importado exige **motivo** (texto curto) e o registro passa a `origem = manual_ajustado`, guardando o valor original. Isso é o que permite lançar glosa e retificação sem perder a rastreabilidade.
- Competência sem arquivo pode ser digitada do zero (`origem = manual`).

---

## 8. Idempotência, histórico e reimportação

- Chave natural: **(cnes, competencia, codigo, financiamento, complexidade)**.
- Reimportar a mesma competência faz **upsert**, não insere duplicado.
- Guardar `arquivo_hash_sha256`. Se o hash já existe, avisar que é o mesmo arquivo e perguntar se quer reprocessar.
- Manter todas as importações no histórico (`importacao_rfinal`), nunca apagar. As subtabelas apontam para a importação vigente.
- **Cada arquivo traz 6 competências.** Regra: gravar as 6, mas a competência de referência (a mais recente) é a "fechada" pelo arquivo; as 5 anteriores vêm como **retificação** e só substituem o que está gravado se o arquivo for mais novo (comparar `emissao`). Isso é importante porque o SIA reprocessa meses anteriores — é assim que glosa e reapresentação aparecem.

---

## 9. Casos de borda a tratar

| Caso | Tratamento |
|---|---|
| `--` no percentual | `null`, nunca zero |
| Valores zerados em massa | normal — a maioria dos ~840 procedimentos tem tudo zero. Guardar ou filtrar, mas contar no total lido |
| Descrição truncada | preservar como veio |
| Item com menos de 6 competências | aceitar |
| Total geral com menos competências que os itens | aceitar |
| Form feed no meio da linha | limpar antes de aplicar regex |
| Cabeçalho de página repetido (145 páginas) | descartar por padrão de linha |
| Arquivo de outro CNES | comparar com o CNES do contexto e **recusar** se divergir |
| Arquivo de competência antiga | permitir, avisando que é retroativo |
| Arquivo truncado / sem linha `Total` | avisar e permitir importar só o que fecha, marcando `status = parcial` |

---

## 10. Entregáveis esperados do Antigravity

1. Parser isolado e testável (função pura: bytes → objeto), sem dependência de UI.
2. Suite de testes usando o arquivo de referência e os números da seção 6.
3. Migrações das quatro tabelas da seção 4.
4. Componente de upload + preview + confirmação.
5. Marcação de origem (`importado` / `manual` / `manual_ajustado`) em todos os campos das subtabelas.
6. Log de importação visível ao usuário (quem, quando, qual arquivo, quais competências afetadas).

**Não fazer:** inferir valores por IA, completar descrições, recalcular subgrupo a partir de procedimento, ou remover a entrada manual.

---

## Anexos

- `parse_rfinal.py` — parser de referência em Python, já validado contra o arquivo de jul/2026. Serve como especificação executável; pode ser reimplementado na linguagem do projeto desde que passe nos mesmos testes.
- `fixture_rfinal_jul2026.json` — saída esperada (metadados, total geral, resumo MAC por subgrupo e contagens) para uso direto nos testes.
