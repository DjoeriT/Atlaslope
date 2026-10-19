export const meta = {
  name: 'guides-region',
  description: 'Write, machine-check and sentence-check the Terroir guides of one Spanish region, then fix its fact sheets',
  whenToUse: 'After the sources step has put each place extract in Review/guides-pipeline/<region>/ and a manifest.json beside it',
  phases: [
    { title: 'Write', detail: 'one fresh Sonnet writer per place (Tools/guides/WRITER.md)', model: 'sonnet' },
    { title: 'Check', detail: 'one fresh Opus checker per guide, every sentence (Tools/guides/CHECKER.md)', model: 'opus' },
    { title: 'Sheets', detail: 'one Opus run applies the pliego disagreements to the region fact sheets', model: 'opus' },
  ],
}

// args: { region: 'andalucia', facts: 'content/facts/andalucia.json', places: [{ id, source }] }
// source is the content/sources.json id the guide cites, e.g. 'jerez-pliego'.
// Run from the repo root. Each helper starts empty, writes only its own files and returns a short summary,
// so no long context sits between helper runs (lesson of the Castilla y León run, Review/guide-pipeline-plan.md).

const dir = `Review/guides-pipeline/${args.region}`
const manifest = `${dir}/manifest.json`
const safety = 'Never put a name, email address or any personal detail in a request header, User-Agent or URL. ' +
  'Do not commit, push, or call any mcp__hearthbot__ tool. Touch only the files this prompt names.'

const WRITE = {
  type: 'object',
  properties: {
    ok: { type: 'boolean', description: 'check_guide.py passes with no ERROR' },
    words: { type: 'number' },
    warnings: { type: 'number', description: 'check_guide.py warnings left for the checker' },
    note: { type: 'string', description: 'one line: anything the checker or thread should know' },
  },
  required: ['ok', 'words', 'warnings', 'note'],
}

const CHECK = {
  type: 'object',
  properties: {
    keep: { type: 'number' },
    fix: { type: 'number' },
    cut: { type: 'number' },
    ok: { type: 'boolean', description: 'check_guide.py passes after your edits' },
    serious: { type: 'string', description: 'the most serious problem found, one line' },
    sheet: {
      type: 'array',
      description: 'fact sheet fields that disagree with the pliego',
      items: {
        type: 'object',
        properties: { field: { type: 'string' }, sheet: { type: 'string' }, pliego: { type: 'string' }, page: { type: 'string' } },
        required: ['field', 'sheet', 'pliego', 'page'],
      },
    },
  },
  required: ['keep', 'fix', 'cut', 'ok', 'serious', 'sheet'],
}

const SHEETS = {
  type: 'object',
  properties: {
    applied: { type: 'number' },
    skipped: { type: 'number' },
    note: { type: 'string' },
  },
  required: ['applied', 'skipped', 'note'],
}

const writePrompt = p => `Follow Tools/guides/WRITER.md exactly for the place "${p.id}" (region ${args.region}).
Pliego extract: ${dir}/${p.id}.extract.txt. Cite it as "${p.source}:p<n>".
Fact sheet: the "${p.id}" entry of ${args.facts} (read it with grep or python, not the whole file).
Manifest for the machine check: ${manifest}.
Write content/guides/${p.id}.json and nothing else. ${safety}`

const checkPrompt = p => `Follow Tools/guides/CHECKER.md exactly for content/guides/${p.id}.json (source id "${p.source}").
Pliego text: the file ${manifest} maps "${p.source}" to; read only cited pages with Tools/guides/pages.py.
Fact sheet: the "${p.id}" entry of ${args.facts}.
Edit only content/guides/${p.id}.json and write Review/guides-check/${p.id}.md. Do not edit the fact sheet; report its disagreements.
${safety}`

const results = await pipeline(
  args.places,
  p => agent(writePrompt(p), { label: `write ${p.id}`, phase: 'Write', model: 'sonnet', schema: WRITE }),
  (w, p) => w && agent(checkPrompt(p), { label: `check ${p.id}`, phase: 'Check', model: 'opus', schema: CHECK })
    .then(c => ({ id: p.id, write: w, check: c })),
)

const done = results.filter(r => r && r.check)
const missing = args.places.map(p => p.id).filter(id => !done.some(r => r.id === id))
if (missing.length) log(`Not finished, rerun these: ${missing.join(', ')}`)

// One writer for the region's fact sheet file, so this step waits for every check.
const disagreements = done.flatMap(r => r.check.sheet.map(s => ({ id: r.id, ...s })))
let sheets = null
if (disagreements.length) {
  sheets = await agent(`Apply these fact sheet corrections to ${args.facts}. Each says what the sheet says, what the pliego says, and the page.
${JSON.stringify(disagreements, null, 1)}
For each: open the cited page with Tools/guides/pages.py (the pliego file for a place is in ${manifest}) and confirm it.
Apply only what the page plainly says, in the sheet's existing style, citing "<source id>:p<n>". Skip a correction that is a matter
of wording or that the page does not settle, and say why. Keep the sheet's schema; run \`npm test -- tests/unit\` once at the end.
Also write ${dir}/fact-sheet-fixes.md: one line per correction, applied or skipped, with the reason. ${safety}`,
  { label: 'fact sheets', phase: 'Sheets', model: 'opus', schema: SHEETS })
}

return { region: args.region, guides: done.map(r => ({ id: r.id, words: r.write.words, ...r.check, sheet: r.check.sheet.length })), missing, sheets }
