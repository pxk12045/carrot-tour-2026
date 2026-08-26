#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Collect same-dam sibling data for Carrot Club 2026 recruitment horses.

Public source: sunzeus.net (へっぽこ軍団), recruitment pages.
Output: family-data.js, consumed read-only by the PWA.

The script is intentionally polite: one request at a time, a delay between
requests, retry/backoff, and a finite 94-page run.
"""
from __future__ import annotations
import json, re, time, sys
from pathlib import Path
import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
BASE_DATA = json.loads((ROOT / "family-base.json").read_text(encoding="utf-8"))
OUT = ROOT / "family-data.js"
UA = "Mozilla/5.0 (compatible; CarrotTour2026FamilyCollector/1.0; personal-use)"

SKIP_NAMES = {"不受胎", "流産", "死産", "死亡", "不詳", "空胎"}

def source_url(no: int) -> str:
    if 1 <= no <= 44:
        block, seq = "05", no
    elif 45 <= no <= 88:
        block, seq = "06", no - 44
    elif 89 <= no <= 94:
        block, seq = "07", no - 88
    else:
        raise ValueError(no)
    return f"https://sunzeus.net/ABK/02/01/2026/11/ABK0201002_{block}_{seq:03d}.php"

def extract_segment(text: str, tag: str) -> str:
    m = re.search(rf"\[{re.escape(tag)}\](.*?)(?=\[(?:JRA|NAR|海外)\]|$)", text)
    return m.group(1).strip() if m else ""

def parse_domestic(seg: str):
    if not seg:
        return {"starts": None, "wins": None, "earningsYen": None}
    sm = re.search(r"(\d+)戦", seg)
    wm = re.search(r"(\d+)勝", seg)
    em = re.search(r"〖([\d,]+)円〗", seg)
    return {
        "starts": int(sm.group(1)) if sm else None,
        "wins": int(wm.group(1)) if wm else (0 if "未勝利" in seg else None),
        "earningsYen": int(em.group(1).replace(",", "")) if em else None,
    }

def parse_foreign(text: str):
    # Examples vary; keep a compact fallback for non-JRA/NAR records.
    m = re.search(r"(?:USA|IRE|GB|FR|ARG|AUS|UAE|KOR|GER|ITY|CAN)?\s*(\d+)戦\s*(\d+)勝", text)
    if not m:
        m = re.search(r"(?:USA|IRE|GB|FR|ARG|AUS|UAE|KOR|GER|ITY|CAN)\s*(\d+)勝", text)
        if m:
            return {"starts": None, "wins": int(m.group(1))}
        return {"starts": None, "wins": None}
    return {"starts": int(m.group(1)), "wins": int(m.group(2))}

def find_offspring_table(soup: BeautifulSoup):
    for table in soup.find_all("table"):
        headers = [x.get_text(" ", strip=True) for x in table.find_all("th")]
        joined = "|".join(headers)
        if all(k in joined for k in ("齢", "生年", "馬名", "父名", "成績")):
            return table
        # Some pages use the first row as td header cells.
        first = table.find("tr")
        if first:
            joined = "|".join(x.get_text(" ", strip=True) for x in first.find_all(["th","td"]))
            if all(k in joined for k in ("齢", "生年", "馬名", "父名", "成績")):
                return table
    return None

def parse_page(html: str, no: int, url: str):
    soup = BeautifulSoup(html, "html.parser")
    table = find_offspring_table(soup)
    if table is None:
        return {"status": "no_table", "source": url, "siblings": []}
    sibs = []
    for tr in table.find_all("tr"):
        cells = [c.get_text(" ", strip=True) for c in tr.find_all(["th","td"])]
        if len(cells) < 6:
            continue
        age, year, name, sex, sire = cells[:5]
        perf = " ".join(cells[5:]).strip()
        if name in ("馬名", "") or "本馬" in name or name in SKIP_NAMES:
            continue
        # Ignore rows that are clearly reproductive outcomes rather than a foal.
        if any(x in name for x in SKIP_NAMES):
            continue
        if not re.fullmatch(r"\d{4}", year):
            continue
        jra = parse_domestic(extract_segment(perf, "JRA"))
        nar = parse_domestic(extract_segment(perf, "NAR"))
        foreign = parse_foreign(perf) if not (extract_segment(perf,"JRA") or extract_segment(perf,"NAR")) else {"starts":None,"wins":None}
        sibs.append({
            "year": int(year),
            "name": name,
            "sex": sex or None,
            "sire": sire or None,
            "jraStarts": jra["starts"], "jraWins": jra["wins"], "jraEarningsYen": jra["earningsYen"],
            "narStarts": nar["starts"], "narWins": nar["wins"], "narEarningsYen": nar["earningsYen"],
            "foreignStarts": foreign["starts"], "foreignWins": foreign["wins"],
            "unraced": "未出走" in perf,
            "performanceRaw": perf,
        })
    # newest first is quicker to scan on a phone
    sibs.sort(key=lambda x: x["year"], reverse=True)
    return {"status":"ok", "source":url, "siblings":sibs}

def fetch(session, url):
    last = None
    for attempt in range(4):
        try:
            r = session.get(url, headers={"User-Agent":UA}, timeout=25)
            if r.status_code == 200:
                r.encoding = r.apparent_encoding or r.encoding
                return r.text
            last = RuntimeError(f"HTTP {r.status_code}")
        except Exception as e:
            last = e
        time.sleep(1.5 * (attempt + 1))
    raise last

def main():
    session = requests.Session()
    data = {}
    errors = []
    problems = []
    for no in range(1,95):
        url = source_url(no)
        base = BASE_DATA.get(str(no), {})
        try:
            html = fetch(session, url)
            fam = parse_page(html, no, url)
        except Exception as e:
            fam = {"status":"error", "source":url, "siblings":[], "error":str(e)[:180]}
            errors.append(no)
        if fam.get("status") != "ok":
            problems.append(no)
        fam.update({
            "damBirthYear": base.get("damBirthYear"),
            "damFoalingAge": base.get("damFoalingAge"),
            "foalOrder": base.get("foalOrder"),
        })
        data[str(no)] = fam
        print(f"{no:02d}/94 {fam['status']} siblings={len(fam['siblings'])}", flush=True)
        time.sleep(0.35)
    text = "// Generated by scrape_families.py. Read-only family information.\nwindow.FAMILY_DATA=" + json.dumps(data, ensure_ascii=False, separators=(",",":")) + ";\n"
    OUT.write_text(text, encoding="utf-8")
    print(f"wrote {OUT} ({len(text):,} chars); errors={errors}; problems={problems}")
    # A few transient gaps can be committed, but a broad parser/site failure must not overwrite good data.
    if len(problems) > 10:
        print("Too many family pages failed or had no offspring table; refusing broad bad update.", file=sys.stderr)
        return 2
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
