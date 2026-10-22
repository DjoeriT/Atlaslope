# France WSET L3: guide sources (22 Oct 2026)

Built by `Tools/countries/fr_wset.py --sources` (no tokens) from `data/countries/fr/wset-places.json`: 94 places with an EU register
number (the name table has 94 such rows [V]; earlier notes said 96). Per batch: `Review/guides-pipeline/fr-<batch>/`.

- 89 places: the current EU single document ("fiche technique", French) from eAmbrosia, text copied to
  `Review/sources/fetched/att-<fileNumber>-<attachment>.txt`; kept from "V. DOCUMENT UNIQUE" to "9. PIÈCES JUSTIFICATIVES".
- 5 places with no single document on eAmbrosia: the INAO cahier des charges (BO Agri), text in
  `Review/sources/fetched/cdc-<fileNumber>.txt`, kept from "I. - Nom de l'appellation" to "CHAPITRE II" [V, fetched today]:

| Place | File | Arrêté | URL |
|---|---|---|---|
| Crozes-Hermitage | PDO-FR-A0389 | 10 Dec 2024, JORF 12 Dec 2024 | https://info.agriculture.gouv.fr/boagri/document_administratif-7496da98-e980-4e30-8de0-2cc072fbb0fe/telechargement |
| Muscat de Beaumes-de-Venise | PDO-FR-A0716 | 11 Mar 2021, JORF 14 Mar 2021 | https://info.agriculture.gouv.fr/gedei/site/bo-agri/document_administratif-0e5fc2bb-dd75-432d-acc8-26ee8927d62a/telechargement |
| Languedoc | PDO-FR-A0922 | 11 Aug 2026, JORF 15 Aug 2026 | https://info.agriculture.gouv.fr/gedei/site/bo-agri/document_administratif-0b3e8099-c716-4fba-aa3a-bf1572cf9fab/telechargement |
| Minervois | PDO-FR-A0330 | 7 Dec 2020 | https://info.agriculture.gouv.fr/gedei/site/bo-agri/document_administratif-cc1cf391-d666-49f9-81cc-7ca4a90414cd/telechargement |
| Picpoul de Pinet | PDO-FR-N1672 | 9 Dec 2024, JORF 11 Dec 2024 | https://info.agriculture.gouv.fr/boagri/document_administratif-dc09ed16-3b99-45bc-b1f4-9a5fceebd3ec/telechargement |

Open: Champagne has no outline in INAO's wine parcel file (its delimitation is published apart); its outline comes from the
commune list in its single document. Languedoc's cahier covers several denominations (45 pages, 40 kept).
