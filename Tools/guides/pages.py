#!/usr/bin/env python3
"""Print given pages of a form-feed-split text. Usage: pages.py <file.txt> <n> [<n> ...]"""
import re
import sys

parts = open(sys.argv[1], encoding='utf-8').read().split('\f')
for n in map(int, sys.argv[2:]):
    if 1 <= n <= len(parts):
        print(f'=== PAGE {n} ===\n' + re.sub(r'[ \t]{2,}', '  ', parts[n - 1]).strip() + '\n')
    else:
        print(f'=== PAGE {n} === (no such page; the file has {len(parts)})')
