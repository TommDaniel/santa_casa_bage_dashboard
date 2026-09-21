"""
Parser de referencia do arquivo RFINAL_AMB_*.<MES>
SIA/SUS - ACOMPANHAMENTO DA PROGRAMACAO FISICO ORCAMENTARIA (SAS/DATASUS/0202)
"""
import re, json, sys

RE_ITEM = re.compile(
    r'^\s{2,}(\d{9})\s-\s(.*?)\s+-\s+(MAC|FAEC|EST|IAC)\s+N\.APURACAO\s*:\s*(\d+)\s+(.+?)\s*$'
)
RE_MES = re.compile(
    r'^\s{2,}([A-Z]{3})/(\d{2})\s+'
    r'(-?[\d.]+)\s+(-?[\d.]+)\s+([\d,]+|--)\s+(-?[\d.]+)\s+'
    r'(-?[\d.,]+)\s+(-?[\d.,]+)\s+([\d,]+|--)\s+(-?[\d.,]+)\s+(-?[\d.,]+)\s*$'
)
RE_SECAO_FIN = re.compile(r'\*{3,}\s*TIPO DE FINANCIAMENTO\s*:\s*(.+?)\s*\*{3,}')
RE_SECAO_CPX = re.compile(r'\*{3,}\s*COMPLEXIDADE\s*:\s*(.+?)\s*\*{3,}')
RE_COMP = re.compile(r'COMPETENCIA\s*:\s*([A-Z]{3})/(\d{4})')
RE_CNES = re.compile(r'CNES\.?\s*:\s*(\d+)\s+(.+?)\s*$')
RE_GESTOR = re.compile(r'Gestor:\s*(\S+)\s*-\s*(.+?)\s*$')
RE_MUN = re.compile(r'Municipio\s*:\s*(\d+)\s*-\s*(.+?)\s*$')
RE_EMISSAO = re.compile(r'EMISSAO\s*:\s*(\d{2}/\d{2}/\d{4})')
RE_PAGHDR  = re.compile(r'SAS/DATASUS/(\d+)\s+(.+?)\s+PAGINA\s*:\s*(\d+)')

RUIDO = ('SAS/DATASUS', 'SIA/SUS', 'MESES....', 'PROGRAMADO   APROVADO',
         'COMPETENCIA :', 'CNES.', 'PAGINA', 'Gestor:', 'Municipio :')

def num_int(s):
    return int(s.replace('.', ''))

def num_dec(s):
    return float(s.replace('.', '').replace(',', '.'))

def pct(s):
    return None if s == '--' else num_dec(s)

def parse(path):
    txt = open(path, encoding='latin-1').read()
    txt = txt.replace('\x0c', '\n')                       # form feed
    txt = re.sub(r'\x1b\([^H]*H', '', txt)                # escape de impressora
    txt = txt.replace('\x12', '')
    linhas = txt.split('\n')

    meta = {}
    itens, total = [], []
    fin = cpx = None
    atual = None

    for ln in linhas:
        s = ln.rstrip()
        if not s.strip():
            continue

        m = RE_COMP.search(s)
        if m: meta['competencia'] = f"{m.group(1)}/{m.group(2)}"
        m = RE_EMISSAO.search(s)
        if m: meta['emissao'] = m.group(1)
        m = RE_PAGHDR.search(s)
        if m and 'municipio' not in meta:
            meta['orgao_emissor'] = 'SAS/DATASUS/' + m.group(1)
            meta['municipio'] = m.group(2).strip()
        m = RE_CNES.search(s.strip())
        if m and 'cnes' not in meta:
            meta['cnes'], meta['estabelecimento'] = m.group(1), m.group(2).strip()
        m = RE_GESTOR.search(s)
        if m: meta['gestor'] = m.group(1)
        m = RE_MUN.search(s)
        if m: meta['municipio'] = f"{m.group(1)} - {m.group(2).strip()}"

        m = RE_SECAO_FIN.search(s)
        if m:
            fin = re.sub(r'\s+', '', m.group(1)); cpx = None; atual = None
            continue
        m = RE_SECAO_CPX.search(s)
        if m:
            cpx = m.group(1).strip(); atual = None
            continue

        if s.strip() == 'Total':
            atual = {'tipo': 'TOTAL_GERAL', 'meses': []}
            total = atual['meses']
            continue

        m = RE_ITEM.match(s)
        if m:
            cod, desc, fin_item, nivel_cod, nivel_txt = m.groups()
            atual = {
                'codigo': cod,
                'descricao': desc.strip(),
                'financiamento_item': fin_item,
                'nivel_apuracao': int(nivel_cod),
                'nivel_apuracao_txt': nivel_txt.strip(),
                'secao_financiamento': fin,
                'secao_complexidade': cpx,
                'meses': [],
            }
            itens.append(atual)
            continue

        m = RE_MES.match(s)
        if m and atual is not None:
            mes, ano, pf, af, perc_f, apres_f, po, ao, perc_o, apres_o, dif = m.groups()
            atual['meses'].append({
                'competencia': f"{mes}/{ano}",
                'fisico_programado': num_int(pf),
                'fisico_aprovado': num_int(af),
                'fisico_pct': pct(perc_f),
                'fisico_apresentado': num_int(apres_f),
                'orc_programado': num_dec(po),
                'orc_aprovado': num_dec(ao),
                'orc_pct': pct(perc_o),
                'orc_apresentado': num_dec(apres_o),
                'diferenca_pagto': num_dec(dif),
            })
            continue

        if any(r in s for r in RUIDO):
            continue

    return meta, itens, total

if __name__ == '__main__':
    meta, itens, total = parse(sys.argv[1] if len(sys.argv) > 1
                               else '/mnt/user-data/uploads/RFINAL_AMB_E_NEFRO.JUL')
    print(json.dumps(meta, ensure_ascii=False, indent=2))
    print("itens:", len(itens), "| linhas-mes totais:", sum(len(i['meses']) for i in itens))
    from collections import Counter
    print(Counter((i['secao_financiamento'], i['secao_complexidade'], i['nivel_apuracao_txt'])
                  for i in itens))
    print("\n--- TOTAL GERAL ---")
    for m in total:
        print(m['competencia'], m['fisico_aprovado'], m['orc_aprovado'], m['orc_apresentado'])
