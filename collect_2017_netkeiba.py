#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Carrot Club 2017 foals: netkeiba collector
- Mapping: dam name + birth year 2017 + sire (legacy racehorse name is only a hint)
- Recruitment price: horse TOP "募集情報 1口:X万円/Y口"; fallback Owners link if available
- Performance: netkeiba result table, races dated <= 2022-08-23
- Outputs CSV + QC JSON.
This script intentionally throttles requests and does not parallelize.
"""

from __future__ import annotations
import argparse
import csv
import json
import math
import random
import re
import sys
import time
import unicodedata
from datetime import datetime, date
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

BASE = "https://db.netkeiba.com"
SEARCH_URL = BASE + "/"
CUTOFF = date(2022, 8, 23)
OUTDIR = Path("data_2017_netkeiba")
SEED = Path("carrot2017_seed.csv")

UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)

MALE_FR = dict(intercept=-64.58263767063193, height=2.348569601127133,
               chest=0.046059128086827945, cannon=0.9545481443130708,
               weight=0.6446162692670325, bdate=-0.255320567312284)
FEMALE_FR = dict(intercept=91.25603170363792, height=1.4996296831516212,
                 chest=-0.5291931787123764, cannon=0.7667058136060534,
                 weight=0.7349729268598437, bdate=-0.2227147724047725)

def norm(s):
    s = "" if s is None else str(s)
    s = unicodedata.normalize("NFKC", s)
    s = re.sub(r"\s+", "", s)
    return s.lower()

def float_or_none(s):
    if s is None:
        return None
    s = str(s).replace(",", "").strip()
    m = re.search(r"-?\d+(?:\.\d+)?", s)
    return float(m.group()) if m else None

def pred_fr(row):
    sex = row["sex"]
    c = FEMALE_FR if sex == "牝" else MALE_FR
    return (
        c["intercept"]
        + c["height"] * float(row["height_cm"])
        + c["chest"] * float(row["chest_cm"])
        + c["cannon"] * float(row["cannon_cm"])
        + c["weight"] * float(row["weight_kg"])
        + c["bdate"] * float(row["bdate"])
    )

class Fetcher:
    def __init__(self, delay=1.25):
        self.s = requests.Session()
        self.s.headers.update({"User-Agent": UA, "Accept-Language": "ja,en;q=0.7"})
        self.delay = delay

    def get(self, url, params=None):
        last = None
        for attempt in range(4):
            try:
                r = self.s.get(url, params=params, timeout=30)
                last = r
                if r.status_code == 200 and len(r.content) > 1000:
                    # netkeiba DB pages are commonly EUC-JP; BS receives raw bytes below.
                    time.sleep(self.delay + random.random() * 0.35)
                    return r
                if r.status_code in (403, 429, 500, 502, 503):
                    time.sleep((attempt + 1) * 5)
                    continue
                r.raise_for_status()
            except requests.RequestException:
                time.sleep((attempt + 1) * 4)
        if last is not None:
            raise RuntimeError(f"HTTP {last.status_code}: {last.url}")
        raise RuntimeError(f"fetch failed: {url}")

def soup_bytes(resp):
    return BeautifulSoup(resp.content, "lxml", from_encoding="EUC-JP")

def find_horse_by_dam(fetcher, row):
    # Query by dam; this avoids legacy-name duplication/mis-mapping.
    params = {"pid": "horse_list", "mare": row["dam"], "range": "all"}
    r = fetcher.get(SEARCH_URL, params=params)
    soup = soup_bytes(r)

    candidates = []
    horse_re = re.compile(r"/horse/(\d{10})/?$")
    for tr in soup.find_all("tr"):
        a = None
        for link in tr.find_all("a", href=True):
            if horse_re.search(link["href"]):
                a = link
                break
        if not a:
            continue
        text = tr.get_text(" ", strip=True)
        href = urljoin(BASE, a["href"])
        m = horse_re.search(a["href"])
        if not m:
            continue
        hid = m.group(1)
        # Strong filters: birth year + dam. Sire is a tie-breaker.
        if "2017" not in text:
            continue
        if norm(row["dam"]) not in norm(text):
            continue
        score = 0
        if norm(row["sire"]) in norm(text):
            score += 4
        if norm(row["legacy_racehorse_name"]) == norm(a.get_text(" ", strip=True)):
            score += 2
        if "キャロットファーム" in text:
            score += 1
        candidates.append((score, a.get_text(" ", strip=True), hid, href, text))

    candidates.sort(reverse=True, key=lambda x: x[0])
    if not candidates:
        return None, "no_candidate", []
    best = candidates[0]
    if len(candidates) > 1 and candidates[0][0] == candidates[1][0]:
        return best, "ambiguous", candidates[:5]
    return best, "ok", candidates[:5]

def parse_detail(fetcher, horse_url, seed_birthday):
    r = fetcher.get(horse_url)
    soup = soup_bytes(r)
    text = soup.get_text(" ", strip=True)

    # horse name
    h1 = soup.find("h1")
    name = h1.get_text(" ", strip=True) if h1 else ""
    name = re.sub(r"\s+\([^)]*\).*$", "", name).strip()

    # birthday
    bd = None
    m = re.search(r"生年月日\s*\|?\s*(20\d{2})年(\d{1,2})月(\d{1,2})日", text)
    if not m:
        m = re.search(r"生年月日\s*(20\d{2})年(\d{1,2})月(\d{1,2})日", text)
    if m:
        bd = f"{int(m.group(1)):04d}-{int(m.group(2)):02d}-{int(m.group(3)):02d}"

    # Recruitment info on horse TOP
    share_man = None
    mouths = None
    price_man = None
    m = re.search(r"募集情報\s*\|?\s*1口[:：]\s*([\d,.]+)\s*万円\s*/\s*(\d+)\s*口", text)
    if not m:
        m = re.search(r"1口[:：]\s*([\d,.]+)\s*万円\s*/\s*(\d+)\s*口", text)
    if m:
        share_man = float(m.group(1).replace(",", ""))
        mouths = int(m.group(2))
        price_man = share_man * mouths

    # current headline totals; useful as QC only, not the cutoff outcome.
    central_current = None
    local_current = None
    m = re.search(r"獲得賞金\s*\(中央\)\s*\|?\s*([\d億,.\s万]+)円", text)
    if m:
        central_current = parse_jp_money_to_man(m.group(1))
    m = re.search(r"獲得賞金\s*\(地方\)\s*\|?\s*([\d億,.\s万]+)円", text)
    if m:
        local_current = parse_jp_money_to_man(m.group(1))

    owners_links = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        label = a.get_text(" ", strip=True)
        if "own.netkeiba.com" in href or "オーナーズ" in label:
            owners_links.append(urljoin(horse_url, href))

    birthday_status = "ok" if (not bd or bd == seed_birthday) else "mismatch"
    return {
        "mapped_racehorse_name": name,
        "detail_birthday": bd,
        "birthday_status": birthday_status,
        "share_man_yen": share_man,
        "mouths": mouths,
        "price_man_yen": price_man,
        "price_source": "netkeiba_horse_top" if price_man is not None else "",
        "current_central_earnings_man_yen": central_current,
        "current_local_earnings_man_yen": local_current,
        "owners_links": owners_links,
    }

def parse_jp_money_to_man(s):
    s = s.replace(",", "").replace(" ", "")
    oku = 0.0
    man = 0.0
    m = re.search(r"([\d.]+)億", s)
    if m:
        oku = float(m.group(1)) * 10000
    m = re.search(r"([\d.]+)万", s)
    if m:
        man = float(m.group(1))
    # "3,007万" after commas stripped
    if oku == 0 and man == 0:
        v = float_or_none(s)
        return v
    return oku + man

def owners_price_fallback(fetcher, urls):
    seen = set()
    for url in urls:
        if not url or url in seen:
            continue
        seen.add(url)
        try:
            r = fetcher.get(url)
        except Exception:
            continue
        soup = soup_bytes(r)
        text = soup.get_text(" ", strip=True)

        m = re.search(r"募集価格\s*[:：]?\s*([\d,.]+)\s*万", text)
        if m:
            return float(m.group(1).replace(",", "")), url
        m = re.search(r"総額\s*[:：]?\s*([\d,.]+)\s*万", text)
        if m:
            return float(m.group(1).replace(",", "")), url
        m = re.search(r"1口\s*[:：]\s*([\d,.]+)\s*万.*?\(?\s*(\d+)\s*口", text)
        if m:
            return float(m.group(1).replace(",", "")) * int(m.group(2)), url
    return None, None

def find_result_table(soup):
    for table in soup.find_all("table"):
        headers = [re.sub(r"\s+", "", th.get_text("", strip=True)) for th in table.find_all("th")]
        joined = "|".join(headers)
        if "日付" in joined and "着順" in joined and "レース名" in joined:
            return table
    return None

def parse_performance(fetcher, horse_id):
    result_url = f"{BASE}/horse/result/{horse_id}/"
    r = fetcher.get(result_url)
    soup = soup_bytes(r)
    table = find_result_table(soup)
    if table is None:
        return {
            "result_url": result_url, "starts_cutoff": None, "wins_cutoff": None,
            "earnings_cutoff_man_yen": None, "performance_status": "result_table_missing",
            "missing_prize_rows": []
        }

    # Build header indices from the first row containing th cells.
    header_row = None
    headers = None
    for tr in table.find_all("tr"):
        ths = tr.find_all("th")
        if ths:
            cand = [re.sub(r"\s+", "", x.get_text("", strip=True)) for x in ths]
            if any("日付" in x for x in cand) and any("着順" in x for x in cand):
                header_row, headers = tr, cand
                break
    if not headers:
        return {
            "result_url": result_url, "starts_cutoff": None, "wins_cutoff": None,
            "earnings_cutoff_man_yen": None, "performance_status": "header_missing",
            "missing_prize_rows": []
        }

    def idx_contains(token):
        for i, h in enumerate(headers):
            if token in h:
                return i
        return None

    i_date = idx_contains("日付")
    i_meet = idx_contains("開催")
    i_race = idx_contains("レース名")
    i_rank = idx_contains("着順")
    i_prize = idx_contains("賞金")
    if i_prize is None:
        i_prize = len(headers) - 1

    starts = wins = 0
    earnings = 0.0
    rows_used = []
    missing_prize = []

    for tr in table.find_all("tr"):
        tds = tr.find_all("td")
        if not tds:
            continue
        vals = [x.get_text(" ", strip=True) for x in tds]
        if i_date is None or i_date >= len(vals):
            continue
        dm = re.match(r"(\d{4})/(\d{2})/(\d{2})", vals[i_date])
        if not dm:
            continue
        d = date(int(dm.group(1)), int(dm.group(2)), int(dm.group(3)))
        if d > CUTOFF:
            continue

        starts += 1
        rank = None
        if i_rank is not None and i_rank < len(vals):
            rm = re.match(r"^\s*(\d+)\s*$", vals[i_rank])
            rank = int(rm.group(1)) if rm else None
        if rank == 1:
            wins += 1

        prize_text = vals[i_prize] if i_prize < len(vals) else ""
        prize = float_or_none(prize_text)
        if prize is not None:
            earnings += prize

        meet = vals[i_meet] if i_meet is not None and i_meet < len(vals) else ""
        race = vals[i_race] if i_race is not None and i_race < len(vals) else ""
        rows_used.append({
            "date": d.isoformat(), "meet": meet, "race": race, "rank": rank,
            "prize_man_yen": prize
        })
        if rank is not None and rank <= 5 and prize is None:
            missing_prize.append({
                "date": d.isoformat(), "meet": meet, "race": race, "rank": rank
            })

    return {
        "result_url": result_url,
        "starts_cutoff": starts,
        "wins_cutoff": wins,
        "earnings_cutoff_man_yen": round(earnings, 1),
        "performance_status": "ok" if starts >= 0 else "error",
        "missing_prize_rows": missing_prize,
        "race_rows_cutoff": rows_used,
    }

def add_price_percentiles(rows):
    vals = [(i, r["price_man_yen"]) for i, r in enumerate(rows) if r["price_man_yen"] is not None]
    if not vals:
        return
    # Average ranks for ties; v3 convention: (rank-1)/(N-1), ascending.
    sorted_prices = sorted(set(v for _, v in vals))
    positions = {}
    sorted_all = sorted(v for _, v in vals)
    for p in sorted_prices:
        idxs = [j + 1 for j, x in enumerate(sorted_all) if x == p]
        positions[p] = sum(idxs) / len(idxs)
    n = len(vals)
    for i, p in vals:
        rank = positions[p]
        pct = 0.5 if n == 1 else (rank - 1) / (n - 1)
        rows[i]["price_pct_provisional"] = pct
    if n == len(rows):
        for r in rows:
            r["price_pct"] = r["price_pct_provisional"]
            r["price_pct_status"] = "final_80"
    else:
        for r in rows:
            r["price_pct"] = None
            r["price_pct_status"] = f"provisional_{n}_of_{len(rows)}"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="0=all; e.g. 10 for pilot")
    ap.add_argument("--delay", type=float, default=1.25)
    args = ap.parse_args()

    OUTDIR.mkdir(exist_ok=True)
    with SEED.open(encoding="utf-8-sig", newline="") as f:
        seeds = list(csv.DictReader(f))
    if args.limit:
        seeds = seeds[:args.limit]

    fetcher = Fetcher(delay=args.delay)
    out = []

    for n, seed in enumerate(seeds, 1):
        print(f"[{n}/{len(seeds)}] {seed['recruitment_name']} / legacy={seed['legacy_racehorse_name']}", flush=True)
        row = dict(seed)
        row.update({
            "cutoff": CUTOFF.isoformat(),
            "pred_frweight": round(pred_fr(seed), 1),
            "mapping_status": "",
            "horse_id": "",
            "horse_url": "",
            "price_man_yen": None,
            "price_source": "",
            "price_pct": None,
            "price_pct_provisional": None,
            "price_pct_status": "",
            "starts_cutoff": None,
            "wins_cutoff": None,
            "earnings_cutoff_man_yen": None,
            "win2plus": None,
            "performance_status": "",
            "qc_notes": [],
        })
        try:
            best, map_status, candidates = find_horse_by_dam(fetcher, seed)
            row["mapping_status"] = map_status
            if best is None:
                row["qc_notes"].append("netkeiba mapping candidate not found")
                out.append(row)
                continue

            _, mapped_name, hid, horse_url, match_text = best
            row["horse_id"] = hid
            row["horse_url"] = horse_url
            row["mapping_candidates"] = [
                {"score": x[0], "name": x[1], "id": x[2], "text": x[4]} for x in candidates
            ]

            detail = parse_detail(fetcher, horse_url, seed["birthday"])
            row.update({k:v for k,v in detail.items() if k != "owners_links"})
            if detail["birthday_status"] == "mismatch":
                row["qc_notes"].append(
                    f"birthday mismatch seed={seed['birthday']} detail={detail['detail_birthday']}"
                )
            if norm(mapped_name) != norm(seed["legacy_racehorse_name"]):
                row["qc_notes"].append(
                    f"legacy name corrected: {seed['legacy_racehorse_name']} -> {mapped_name}"
                )

            if row["price_man_yen"] is None:
                p, purl = owners_price_fallback(fetcher, detail.get("owners_links", []))
                if p is not None:
                    row["price_man_yen"] = p
                    row["price_source"] = purl
                else:
                    row["qc_notes"].append("recruitment price unresolved")

            perf = parse_performance(fetcher, hid)
            row.update({k:v for k,v in perf.items() if k not in ("race_rows_cutoff", "missing_prize_rows")})
            row["race_rows_cutoff"] = perf.get("race_rows_cutoff", [])
            row["missing_prize_rows"] = perf.get("missing_prize_rows", [])
            if perf.get("missing_prize_rows"):
                row["qc_notes"].append(
                    f"placing rows with blank prize: {len(perf['missing_prize_rows'])}"
                )
            if row["wins_cutoff"] is not None:
                row["win2plus"] = 1 if row["wins_cutoff"] >= 2 else 0

        except Exception as e:
            row["qc_notes"].append(f"exception: {type(e).__name__}: {e}")
            row["performance_status"] = row["performance_status"] or "error"

        out.append(row)

    add_price_percentiles(out)

    # Flat CSV
    fields = [
        "source_no","recruitment_name","legacy_racehorse_name","mapped_racehorse_name",
        "mapping_status","horse_id","birthday","detail_birthday","birthday_status",
        "dam","sire","bms","sex","height_cm","chest_cm","cannon_cm","weight_kg","bdate",
        "pred_frweight","price_man_yen","price_source","price_pct","price_pct_provisional",
        "price_pct_status","cutoff","starts_cutoff","wins_cutoff","earnings_cutoff_man_yen",
        "win2plus","performance_status","current_central_earnings_man_yen",
        "current_local_earnings_man_yen","horse_url","result_url","qc_notes"
    ]
    csv_path = OUTDIR / "2017_netkeiba_collected.csv"
    with csv_path.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        w.writeheader()
        for r in out:
            rr = dict(r)
            rr["qc_notes"] = " | ".join(rr.get("qc_notes", []))
            w.writerow(rr)

    # QC-only CSV
    qc_path = OUTDIR / "2017_netkeiba_qc.csv"
    with qc_path.open("w", encoding="utf-8-sig", newline="") as f:
        qfields = ["source_no","recruitment_name","legacy_racehorse_name",
                   "mapped_racehorse_name","mapping_status","horse_id",
                   "price_man_yen","performance_status","qc_notes"]
        w = csv.DictWriter(f, fieldnames=qfields, extrasaction="ignore")
        w.writeheader()
        for r in out:
            if r.get("qc_notes") or r.get("mapping_status") != "ok" or r.get("price_man_yen") is None:
                rr = dict(r)
                rr["qc_notes"] = " | ".join(rr.get("qc_notes", []))
                w.writerow(rr)

    json_path = OUTDIR / "2017_netkeiba_details.json"
    with json_path.open("w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    mapped = sum(bool(r.get("horse_id")) for r in out)
    priced = sum(r.get("price_man_yen") is not None for r in out)
    perfok = sum(r.get("performance_status") == "ok" for r in out)
    summary = {
        "rows": len(out), "mapped": mapped, "priced": priced, "performance_ok": perfok,
        "cutoff": CUTOFF.isoformat(),
        "all_prices_resolved": priced == len(out),
        "qc_rows": sum(bool(r.get("qc_notes")) for r in out),
    }
    with (OUTDIR/"2017_netkeiba_summary.json").open("w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print(json.dumps(summary, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
