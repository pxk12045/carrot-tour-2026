#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Update direct dam links and 2023-2025 JRA trainer aggregate stats."""
from __future__ import annotations
import json, re, time, sys
from pathlib import Path
from urllib.parse import urljoin, quote
import requests
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parent
HORSES_JS=(ROOT/'horses.js').read_text(encoding='utf-8')
FAMILY_BASE=json.loads((ROOT/'family-base.json').read_text(encoding='utf-8'))
OUT=ROOT/'reference-data.js'
UA='Mozilla/5.0 (compatible; CarrotTour2026ReferenceCollector/1.0; personal-use)'

m=re.search(r'window\.HORSES=(\[.*?\]);\s*window\.VENUES',HORSES_JS,re.S)
if not m: raise SystemExit('horses.js parse failed')
HORSES=json.loads(m.group(1))

def norm(s):
    return re.sub(r'[\s\u3000]+','',str(s or '')).replace('髙','高').replace('﨑','崎')

def fetch(session,url,tries=4):
    last=None
    for a in range(tries):
        try:
            r=session.get(url,headers={'User-Agent':UA},timeout=30)
            if r.status_code==200:
                r.encoding=r.apparent_encoding or r.encoding
                return r.text
            last=RuntimeError(f'HTTP {r.status_code} {url}')
        except Exception as e: last=e
        time.sleep(1.5*(a+1))
    raise last

def parse_trainer_leading(html):
    soup=BeautifulSoup(html,'html.parser')
    target=None
    for table in soup.find_all('table'):
        txt=table.get_text(' ',strip=True)
        if '調教師名' in txt and '1着' in txt and '順位' in txt:
            target=table;break
    if target is None:
        raise RuntimeError('trainer table not found')
    out={}
    for tr in target.find_all('tr'):
        cells=[c.get_text(' ',strip=True) for c in tr.find_all(['th','td'])]
        if len(cells)<5: continue
        rank_txt=re.sub(r'\D','',cells[0])
        name=cells[1].strip() if len(cells)>1 else ''
        if not rank_txt or not name or '調教師名' in name: continue
        # netkeiba table columns: rank, name, affiliation, DOB, wins, ...
        win_txt=re.sub(r'\D','',cells[4]) if len(cells)>4 else ''
        if not win_txt: continue
        out[norm(name)]={'name':name,'rank':int(rank_txt),'wins':int(win_txt)}
    return out

def dam_direct(session,no,dam):
    purl=FAMILY_BASE[str(no)]['pedigreeUrl']
    html=fetch(session,purl)
    soup=BeautifulSoup(html,'html.parser')
    nd=norm(dam)
    candidates=[]
    for a in soup.find_all('a',href=True):
        txt=a.get_text(' ',strip=True)
        href=a['href']
        if norm(txt)==nd and re.search(r'/horse/\d+/?$',href):
            candidates.append(urljoin(purl,href))
    if candidates: return candidates[0]
    # looser fallback but still direct horse URL
    for a in soup.find_all('a',href=True):
        if nd and nd in norm(a.get_text(' ',strip=True)) and re.search(r'/horse/\d+/?$',a['href']):
            return urljoin(purl,a['href'])
    return None

def comp_ranks(totals):
    vals=sorted(set(totals.values()),reverse=True)
    rank_by_val={}
    pos=1
    for v in vals:
        rank_by_val[v]=pos
        pos += sum(1 for x in totals.values() if x==v)
    return {k:rank_by_val[v] for k,v in totals.items()}

def main():
    sess=requests.Session()
    yearly={}
    for year in (2023,2024,2025):
        url=f'https://db.netkeiba.com/trainer/trainer_leading_jra.html?year={year}'
        print('trainer',year,flush=True)
        yearly[year]=parse_trainer_leading(fetch(sess,url))
        time.sleep(1.0)

    # Aggregate every trainer appearing in at least one year's table.
    names=set().union(*(set(x) for x in yearly.values()))
    totals={n:sum(yearly[y].get(n,{}).get('wins',0) for y in yearly) for n in names}
    agg_rank=comp_ranks(totals)

    data={}
    for i,h in enumerate(HORSES,1):
        no=int(h['no']); trainer=h.get('trainer',''); nt=norm(trainer)
        if re.search(r'門別|大井|川崎|船橋|地方',trainer):
            t={'status':'nar','period':'2023-2025','wins':None,'rank':None,'yearly':{}}
        elif nt in totals:
            t={'status':'ok','period':'2023-2025','wins':totals[nt],'rank':agg_rank[nt],
               'yearly':{str(y):yearly[y].get(nt,{'wins':0,'rank':None}) for y in (2023,2024,2025)}}
        else:
            t={'status':'not_found','period':'2023-2025','wins':0,'rank':None,
               'yearly':{str(y):{'wins':0,'rank':None} for y in (2023,2024,2025)}}

        try:
            durl=dam_direct(sess,no,h.get('dam',''))
            status='ok' if durl else 'not_found'
        except Exception as e:
            print(f'WARN dam no={no}: {e}',file=sys.stderr)
            durl=None;status='error'
        data[str(no)]={
            'damStatus':status,
            'damDirectUrl':durl,
            'damSearchUrl':'https://db.netkeiba.com/?pid=horse_list&word='+quote(h.get('dam','')),
            'trainer':t
        }
        print(f'{no:02d}/94 dam={status} trainer={t["status"]}',flush=True)
        time.sleep(0.6)

    OUT.write_text('window.REFERENCE_DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
    direct=sum(1 for d in data.values() if d['damDirectUrl'])
    tr=sum(1 for d in data.values() if d['trainer']['status']=='ok')
    print(f'DONE directDam={direct}/94 trainerMatched={tr}/94',flush=True)

if __name__=='__main__':
    main()
