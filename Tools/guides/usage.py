#!/usr/bin/env python3
"""Cost per helper from workflow transcripts (list price, Opus 5.5 / Sonnet 5.5). Usage: usage.py <workflow transcript dir>..."""
import json,glob,os,sys,collections
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
for wf in sys.argv[1:]:
    labels={}
    for l in open(os.path.join(wf,'journal.jsonl')):
        d=json.loads(l)
        if d.get('type')=='started': labels[d['agentId']]=d['label']
    for f in sorted(glob.glob(os.path.join(wf,'agent-*.jsonl'))):
        a=os.path.basename(f)[6:-6]; m,t=usage(f)
        P={'claude-opus-5-5':(4,20,0.2,5),'claude-sonnet-5-5':(2,10,0.2,2.5)}[m]
        c=(t['input_tokens']*P[0]+t['output_tokens']*P[1]+t['cache_read_input_tokens']*P[2]+t['cache_creation_input_tokens']*P[3])/1e6
        print(f"{labels.get(a,a)}\t{m[7:]}\tout {t['output_tokens']}\tread {t['cache_read_input_tokens']}\twrite {t['cache_creation_input_tokens']}\t${c:.2f}")
