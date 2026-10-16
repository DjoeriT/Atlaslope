# Release 4 fact sheets: ReviewBot review

Verdict: **fix first**. 0 blockers, 9 should-fix, 6 notes. Stopped at the turn limit, so coverage is partial (see "Not checked").
Evidence tags: [V] checked against the source text, [R] read only, [I] inferred.

Note: `content/facts/` holds 10 region files, 79 sheets; 30 have `main: []`.

## Sample (check 1)
Seed 4, `random.sample(sorted ids, 12)`: leon, montsant, carinena, rioja, tierra-del-vino-de-zamora, el-hierro, campo-de-calatrava, bullas, alicante, rioja-alavesa, montilla-moriles, binissalem.
Sheets for rioja-alavesa were not checked: no per-zone extract file, only `rioja.md`.
- [V] Text rows (why/climate/soil/altitude/styles) of the other 11 sheets trace to the extracts. Numbers matched: Rioja 400 mm, Montsant 500-600 mm and llicorella, Calatrava 400 mm / 52% / 2,800 h / 700-900 m / 630-650 m, León 500 mm, Zamora 350-400 mm, El Hierro 50-1,000 m, Bullas 80%.
- [V] Wording is English and paraphrased, not pasted Spanish.
- Note (binissalem climate, bullas climate, carinena soil): the text states the gap itself ("The document gives no figures", "names no main type"). That is meta-commentary in quiz-facing text. It should be `""` with `cite: []` per the template.
- Note: the claim "which speed up ripening" in montilla-moriles climate is supported ([V] A1479 p5 link text).

## Findings

### Should fix: main grapes not supported by the cited source
1. **pla-i-llevant** main `Moll`, `Manto Negro`, cite `pla-i-llevant-wiki` only. [V] The Wikipedia note has no "Moll". "Manto negro" appears only in an equal list of "variedades autóctonas" beside Callet. Nothing singles them out. The extract only lists "MOLL, PENSAL BLANCO" (p. unspecified). It looks copied from Binissalem. Fix: `main: []`.
2. **montsant** main Garnacha Blanca, Macabeo, cite `montsant-doc:p7`. [V] The doc says «el predominio de variedades como la garnacha o la cariñena» (p7). That supports Garnacha Tinta and Cariñena only (and it says "garnacha" generically). The two whites have no singling-out. Fix: drop them.
3. **priorat** main Garnacha Blanca, Macabeo, cite wiki. [V] The wiki sentence covers red only: «predomina el vino tinto elaborado con uva cariñena… se usa también garnacha tinta y peluda». The whites are unsupported.
4. **pla-de-bages** main Picapoll Blanco, Sumoll Tinto. [V] The wiki says «Destaca… tempranillo, merlot, sumoll, mandó y cabernet sauvignon» (equal list) and picapolla for white «sobre todo». Picapoll is supported. Sumoll is singled out over Tempranillo/Merlot with no basis. Fix: Picapoll Blanco only.
5. **tarragona** main cite `tarragona-doc:p6`. [V] That page is the form list (Tempranillo, Macabeo only), not a ranking. The wiki names white parellada, macabeo, charelo and garnacha blanca, and red cariñena, tempranillo, sumoll and garnacha. The sheet takes Cariñena and Garnacha Tinta but drops Tempranillo and Sumoll. The rule is inconsistent. Cariñena and Garnacha are also supported by doc p6 link text («tintos de cariñena y garnacha»), so keep the cite but add that page. Decide on Tempranillo/Sumoll.
6. **toro** main Malvasía Castellana. [V] The wiki lists Tinta de Toro, Garnacha, Verdejo and Malvasía with equal "utilizada para…"; only «fundamentalmente con uva tinta de Toro» is singled out. Malvasía is no more main than Verdejo. Fix: Tinta de Toro only.
7. **emporda** main Garnacha Roja, Moscatel de Alejandría. [V] The doc says «las Garnachas y los Moscateles del Empordà… la Garnacha… producto más representativo» (p7). It does not say which Moscatel (plural), nor Garnacha Roja specifically. Moscatel type is a guess. Soften to what the text supports.
8. **navarra** main Moscatel Grano Menudo. [V] Doc p8 line: «Vinos elaborados fundamentalmente a partir de la variedad Moscatel» is about the sweet/licor wine only. Wiki supports Garnacha and Tempranillo («la garnacha o el tempranillo»). Keep Moscatel only if the sheet scopes it to sweet wines; otherwise drop.
9. **Incomplete `others` (check 4)**. [V] The cited document is an EU amendment form whose «PRINCIPALES UVAS» list is cut. Full lists are in the national pliego (see the extract's "Link to the pliego"; not fetched) and in the wiki notes.
   - alella: others = Syrah, Garnacha Tinta; main = Pansa Blanca. Wiki adds Garnacha Blanca, Chardonnay, Sauvignon Blanc, Pansa Rosada, Merlot. Wiki also says «la variedad más típica es la charelo o pansa blanca y la garnacha blanca», so Garnacha Blanca is a missed second main, if the pliego allows it.
   - conca-de-barbera: others = Ull de Llebre only. Wiki says «más usadas… macabeo y parellada y… trepat». Parellada is missing from both lists. [V] A1422 p8 shows only Macabeo / Ull de llebre / Trepat.
   - pla-de-bages: others = Ull de Llebre. Wiki lists tempranillo, merlot, mandó, cabernet, garnacha, pinot noir, syrah.
   - valtiendas: others = []. Wiki: Tempranillo principal; Garnacha, Cabernet Sauvignon, Albillo authorised.
   - bullas: others = Macabeo only. Wiki: Cabernet Sauvignon, Merlot, Syrah, Tempranillo, Garnacha.
   - valdeorras: others = Mouratón. Wiki: tintas Mencía, Tempranillo, Brancellao, Merenzao, Sousón, Caíño tinto, Espadeiro, Ferrón, Grao negro, Garnacha tintorera, Negreda. Blancas: Godello, Dona Branca, Loureira, Treixadura, Albariño, Torrontés, Lado.
   - ribera-del-duero: others = 3 (Albillo Mayor missing).
   - toro: Garnacha is in the wiki and sheet; fine.
   - bierzo: others lack the wiki's Estaladiña, Merenzao and Malvasía (6 of 8).
   - cebreros: others lack the list the wiki gives («Variedades autorizadas por el Pliego… tintas:»), which the template's own example says is cut.
   - txakoli-alava: only 3.
   - montilla-moriles: complete (A1479 lists 3 grapes); fine.

### Should fix: main grapes missed (check 3)
Quotes are the support the template allows.
- **binissalem**: Moll and Manto Negro. [V] Wiki «En los vinos blancos predominan las características de la uva de la variedad Moll… Los vinos tintos… impresas en gran medida por la variedad autóctona Manto Negro». Both are in the extract list (lines 70-71). The sheet has `[]`.
- **gran-canaria**: Moscatel de Alejandría. [V] Wiki line «Moscatel de Alejandría, variedad preferente»; it is in the allowed list. The sheet has `[]`.
- **vinos-de-madrid**: [R] The wiki says white wines need 60% «Malvar y/o Albillo» and reds 85% of five grapes. The «preferentes por subzona» table is empty in the note. This is not a clear singling-out, so left as is; a note only.
- **la-palma**: wiki has Malvasía wine types (Malvasía Seco/Clásico, "se elabora con uva malvasía"). [R] That is a wine type, not a ranking; weak. Not recommended.
- **Not missed** (checked, no singling-out): granada, lebrija, manzanilla, tacoronte-acentejo, valle-de-la-orotava, abona, el-hierro, sierra-de-salamanca, costers-del-segre, penedes, somontano, campo-de-borja, urbezo, cangas ("recomendadas" vs "autorizadas" in wiki only, not a template word), ribeiro, valencia, yecla, ucles, ribera-del-jucar, la-mancha, almansa, ribera-del-guadiana, valdepenas, campo-de-calatrava [V by rg for cue words in extract, full document and wiki].
- **txakoli-getaria / txakoli-alava**: `main: []` while txakoli-bizkaia has Hondarrabi Zuri/Beltza from wiki. In getaria the extract's grape section lists only Hondarrabi Zuri/Beltza. [V] The docs speak only of «variedades recomendadas». Treat consistently with Bizkaia, or leave as is. Judgement call for LeadBot.

### Note
- **txakoli-bizkaia**: wiki says three main varieties including Hondarrabi Zuri Zerratia. The sheet lists two and omits Zerratia from others. [V]
- **txakoli-alava** uses «Ondarrabi» (source spelling) while others use «Hondarrabi». Pick one.
- Same grape under two names: Toro «Malvasía Castellana», Bierzo/Monterrei «Doña Blanca». Arribes uses local Malvasía Castellana with grape Doña Blanca. Check consistency for the quiz.
- **sierras-de-malaga** main (10 grapes) is supported by the wiki «Preferentes:» list. [V] The wiki says only «moscatel»; the sheet splits it into Alejandría and Grano Menudo.
- **rueda** main (7 grapes) is supported. [V] The pliego says «Tienen la condición de principales… Verdejo, Sauvignon Blanc, Viura, Chardonnay y Viognier… Tempranillo y Cenicienta». The cite `rueda-doc:p13` is the extract's cut page; the real page for that sentence is not in the extract. [I] Acceptable.
- Also [V] supported: arribes (Juan García «mayoritaria», Malvasía «más importante»), cebreros («base de los vinos»), ribeira-sacra and valdeorras («principales/preferentes»), monterrei, leon, lanzarote (Malvasía Volcánica in the full doc line 418), zamora (wiki «principales»), terra-alta (Garnacha Blanca monovarietal), bullas, jumilla, utiel-requena, calatayud, carinena, mentrida, condado, rioja zones, cigales, jerez (wiki: «tres tipos de uva»).

## Not checked
- Rows of the remaining 67 sheets other than main/others.
- rioja-alavesa sheet text.
- Allowed-list completeness for `others` beyond the names above, and the pliego links (not fetched).
- Page numbers in cites beyond sample items.
- Main grapes on the wiki-cited sheets for rioja, alicante, cigales and leon, beyond a single wiki sentence each.
