#!/usr/bin/env python3
"""Tokens per helper from workflow transcripts, re-read vs new, with a total per stage.

Usage: usage.py [--budget M --places N] <workflow transcript dir>...
--budget: measured tokens per place (all stages, re-read + new, in millions). Exits 1 when the run is past 1.5x budget x places,
so a pilot of one or two places stops a route before it scales (Cataluña, 19 Oct 2026: about 20M against a 5-8M estimate).
"""
import json,glob,os,sys,collections
args=sys.argv[1:]; budget=places=None
if args[:1]==['--budget']: budget=float(args[1]); places=int(args[3]); args=args[4:]
stage=collections.Counter()
def usage(f):
    t=collections.Counter(); model=None; seen={}
    for l in open(f):
        try: d=json.loads(l)
        except: continue
        m=d.get('message') or {}
        u=m.get('usage') if isinstance(m,dict) else None
        if not u: continue
        mid=m.get('id')
        model=m.get('model',model)
        cur=seen.setdefault(mid,{})
        for k in ['input_tokens','cache_read_input_tokens','cache_creation_input_tokens','output_tokens']: cur[k]=max(cur.get(k,0),u.get(k,0) or 0)
    for v in seen.values(): t.update(v)
    return model,t
for wf in args:
    labels={}
    for l in open(os.path.join(wf,'journal.jsonl')):
        d=json.loads(l)
        if d.get('type')=='started': labels[d['agentId']]=d['label']
    for f in sorted(glob.glob(os.path.join(wf,'agent-*.jsonl'))):
        a=os.path.basename(f)[6:-6]; m,t=usage(f)
        P={'claude-opus-5-5':(4,20,0.2,5),'claude-sonnet-5-5':(2,10,0.2,2.5)}[m]
        c=(t['input_tokens']*P[0]+t['output_tokens']*P[1]+t['cache_read_input_tokens']*P[2]+t['cache_creation_input_tokens']*P[3])/1e6
        lab=labels.get(a,a); new=t['input_tokens']+t['cache_creation_input_tokens']+t['output_tokens']
        stage[lab.split(' ')[0]+' reread']+=t['cache_read_input_tokens']; stage[lab.split(' ')[0]+' new']+=new
        print(f"{labels.get(a,a)}\t{m[7:]}\tout {t['output_tokens']}\tread {t['cache_read_input_tokens']}\twrite {t['cache_creation_input_tokens']}\t${c:.2f}")
total=sum(stage.values())
for k in sorted(stage): print(f"{k}\t{stage[k]/1e6:.2f}M")
print(f"total\t{total/1e6:.2f}M" + (f"\tper place {total/1e6/places:.2f}M, budget {budget:.2f}M" if places else ''))
if budget and total > 1.5 * budget * places * 1e6:
    print(f"OVER BUDGET: {total/1e6:.1f}M is past 1.5x the {budget*places:.1f}M budget. Stop and report before the next stage or region.")
    sys.exit(1)
