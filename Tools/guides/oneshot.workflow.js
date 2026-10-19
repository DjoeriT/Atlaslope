export const meta = {
  name: 'guides-oneshot',
  description: 'Write and sentence-check Terroir guides with one-shot helpers that return JSON; oneshot.py writes the files',
  whenToUse: 'A region whose extracts and manifest.json sit in Review/guides-pipeline/<region>/ (cheaper route than region.workflow.js)',
  phases: [
    { title: 'Write', detail: 'one Sonnet writer per place: one pack read, guide returned as JSON', model: 'sonnet' },
    { title: 'Check', detail: 'one Opus checker per guide: the guide in its prompt, one pack read, corrected guide and sheet edits returned', model: 'opus' },
  ],
}

// Baleares pilot, 19 Oct 2026 (owner: "Use a workflow for Baleares"). Cataluña cost 3.1M tokens a guide all-in, mostly helpers re-reading
// their context on every tool step (write, test, fix, check, test, fix, then a sheet helper). Here each helper takes two steps: one
// command prints its whole pack, one StructuredOutput returns the result. Helpers write no files and run no tests; after the run the
// thread runs `python3 Tools/guides/oneshot.py apply <region> <transcript dir>`, which writes the guides, check logs and sheet edits,
// runs check_guide.py and checks the flights against OpenStreetMap. One check pass, no re-check, no sheet helper.
// args: { region: 'baleares', places: [{ id, source }], placeIds: ['binissalem', ...] }
// Budget: 0.2M a guide targeted; the output guard stops starting helpers past 1.5x 25K output tokens a place.

const outCap = 1.5 * 25000 * args.places.length
const start = budget.spent()
const guarded = (prompt, opts) => {
  if (budget.spent() - start > outCap) {
    log(`Budget guard: ${budget.spent() - start} output tokens is past ${outCap}; ${opts.label} not started`)
    return Promise.resolve(null)
  }
  return agent(prompt, opts)
}
const oneshot = 'Take exactly two steps: (1) run the one command below with Bash, (2) call StructuredOutput with your result. ' +
  'No other tool calls: do not open files, grep, write or edit anything, or run tests. Everything you need is in the pack and this prompt. ' +
  'Where the brief says to run check_guide.py, edit a file or write a log, ignore it: return the content instead. ' +
  'Never put a name, email address or personal detail in any request. Do not call any mcp__hearthbot__ tool.'

const WRITE = {
  type: 'object',
  properties: {
    guide: { type: 'string', description: 'the whole guide as JSON text, the shape of the example in the pack' },
    note: { type: 'string', description: 'at most 6 lines: words, beats written and left out, flights, label terms' },
  },
  required: ['guide', 'note'],
}
const CHECK = {
  type: 'object',
  properties: {
    guide: { type: 'string', description: 'the corrected guide as JSON text, every FIX and CUT applied' },
    log: { type: 'string', description: 'Markdown for Review/guides-check/<id>.md: header line, then per beat one line per sentence KEEP|FIX|CUT p<n> "<Spanish words>" and what changed, then "## Fact sheet"' },
    keep: { type: 'number' }, fix: { type: 'number' }, cut: { type: 'number' },
    serious: { type: 'string', description: 'the most serious problem found, one line' },
    sheet: {
      type: 'array',
      description: 'fact sheet fields the pliego contradicts or leaves out, each as a ready edit',
      items: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'dot path in the sheet entry, e.g. "climate.text" or "grapes.others"' },
          value: { type: 'string', description: 'the new value as JSON text (a string in quotes, an array, an object), in the sheet\'s style' },
          cite: { type: 'string', description: 'JSON array of cites for the sibling "cite" field, e.g. ["<source>:p6"], or "" to leave it' },
          why: { type: 'string', description: 'sheet says X, pliego says Y, page' },
          sure: { type: 'boolean', description: 'false when the page does not plainly settle it' },
        },
        required: ['path', 'value', 'cite', 'why', 'sure'],
      },
    },
  },
  required: ['guide', 'log', 'keep', 'fix', 'cut', 'serious', 'sheet'],
}

const flights = `Flights: a "place" id must be one of ${JSON.stringify(args.placeIds)}; any other named place is a point [lng, lat] you are sure of.`

const results = await pipeline(
  args.places,
  p => guarded(`Write the Terroir guide for "${p.id}" (region ${args.region}, source id "${p.source}").
${oneshot}
Command: python3 Tools/guides/pack.py write ${args.region} ${p.id} ${p.source}
It prints your brief, the format rules, the example, the fact sheet and the pliego. ${flights}
Return the guide as JSON text in "guide" (it becomes content/guides/${p.id}.json).`,
    { label: `write ${p.id}`, phase: 'Write', model: 'sonnet', schema: WRITE }),
  (w, p) => {
    if (!w) return null
    try { JSON.parse(w.guide) } catch (e) { log(`${p.id}: writer returned invalid JSON (${e.message})`); return null }
    return guarded(`Check the Terroir guide for "${p.id}" sentence by sentence against its source "${p.source}", then return it corrected.
${oneshot}
Command: python3 Tools/guides/pack.py check ${args.region} ${p.id} ${p.source}
It prints your brief, the fact sheet and every pliego page. The guide is below, not on disk. Flight points are checked against
OpenStreetMap after you; still FIX a point you know is wrong. ${flights}
Return the corrected guide as JSON text in "guide", the check log in "log", and the fact sheet disagreements in "sheet" as ready edits
(cite the new source as "${p.source}:p<n>"; a famous-style text stays at 15 words or fewer; sure=false when the page does not settle it).

The guide (writer's draft):
${w.guide}`,
      { label: `check ${p.id}`, phase: 'Check', model: 'opus', schema: CHECK })
      .then(c => c && ({ id: p.id, note: w.note, keep: c.keep, fix: c.fix, cut: c.cut, serious: c.serious, sheet: c.sheet.length }))
  },
)

const done = results.filter(Boolean)
const missing = args.places.map(p => p.id).filter(id => !done.some(r => r.id === id))
if (missing.length) log(`Not finished, rerun these: ${missing.join(', ')}`)
return { region: args.region, guides: done, missing }
