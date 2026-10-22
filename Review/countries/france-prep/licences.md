# France pilot: licence checks

Checked 22 Oct 2026. Tags: [V] checked today, [R] read in a secondary page, [A] assumed. Not legal advice; the owner decides.

## Verdicts

1. **INAO parcel delimitation dataset (data.gouv.fr, 5aaf6b7ec751df67b0d7a87f).** Licence Ouverte / Open Licence (Etalab), id `fr-lo`, per the API [V]. Terms: https://www.etalab.gouv.fr/wp-content/uploads/2014/05/Licence_Ouverte.pdf [V]. Dataset page: https://www.data.gouv.fr/datasets/delimitation-parcellaire-des-aoc-viticoles-de-linao [V]. Verdict: clear, re-use incl. commercial allowed with source and date. Caveat in the description: the data is "for information only"; the official limits are the plans at the mairie and INAO, and not every AOC is digitised yet [V]. Show with that wording.
2. **INAO cahiers des charges / Legifrance texts.** INAO site: all content under etalab-2.0 unless stated (footer of https://www.inao.gouv.fr/mentions-legales) [V]. Legifrance: footer says the same; DILA open-data sheets say Licence Ouverte 2.0, credit DILA, date [R]. Verdict: facts and text may be reused with citation (arrete number, JORF date, BO). Only the JORF text has legal force [V]. Our practice (facts plus cite, no copied prose) is safe. Legifrance terms page itself returned 403 to my fetch [V], so the Legifrance-specific wording is [R].
3. **IGN Geoplateforme BD ORTHO WMTS** (https://data.geopf.fr/wmts, layer ORTHOIMAGERY.ORTHOPHOTOS). Dataset record (CSW, IGNF_BD-ORTHO): "Licence Ouverte / Open License", no public-access restriction [V]; page https://cartes.gouv.fr/rechercher-une-donnee/dataset/IGNF_BD-ORTHO . WMTS capabilities: Fees "none", access constraint points to the CGU [V]. CGU (version 15 Oct 2024): https://cartes.gouv.fr/cgu ; art. 3.2 fair use: the public WMTS image-tile API is listed as "not subject to a usage limit"; other APIs have per-IP req/s limits, 429 block for 5 seconds [V]. Attribution wording: no exact string found in the record; the Etalab licence needs source and date, so use "Source: IGN, BD ORTHO, Licence Ouverte" plus the survey date range [A]. The layer mixes capture years; the dates PDF is linked in the capabilities abstract [V]. Verdict: clear, free to use as a map layer with attribution. Note: IGN limits WMS/WFS to two layers per URL since 15 Jun 2026 [R]; irrelevant for WMTS tiles.
4. **BRGM BD Charm-50 and geology WMS.** Not clear. data.gouv has two records: the older "Cartes geologiques departementales a 1/50 000 (BD Charm-50)" (2019) says Licence Ouverte (id `lov2`) [V]; the newer "Cartes geologiques vectorisees et harmonisees a 1/50 000 du BRGM" (updated 1 Aug 2026, BRGM as publisher) has licence "not specified" [V]. The WMS (https://geoservices.brgm.fr/geologie) capabilities say fees "no conditions apply" and access constraints "None" [V]. No attribution or reuse terms are stated for the service. Verdict: probably open, but the two records disagree and the WMS says nothing about licence; ask BRGM in writing before showing it. Contact address in the WMS capabilities: contact-brgm@brgm.fr [V].

## Email draft to BRGM (not sent)

**To:** contact-brgm@brgm.fr (the contact address given in the BRGM geology WMS capabilities [V])
**Subject:** Reutilisation de la carte geologique harmonisee 1/50 000 (BD Charm-50 / WMS) sur un site gratuit

Bonjour,

Je developpe AtlaSlope, un site web public, gratuit et non commercial, qui presente les regions viticoles d'Europe sur une carte interactive. Je souhaite afficher la geologie harmonisee a 1/50 000 (BD Charm-50, ou le service WMS geoservices.brgm.fr/geologie) comme couche de la carte, avec mention claire de la source.

Les notices de data.gouv.fr ne sont pas concordantes : l'ancienne fiche indique la Licence Ouverte, la fiche plus recente indique « licence non specifiee », et le service WMS ne precise pas de conditions de reutilisation.

Pouvez-vous me confirmer :
1. si cet usage (affichage en couche cartographique, sans modification des donnees) est autorise ;
2. sous quelle licence, et quelle mention de source vous souhaitez ;
3. s'il existe des limites d'usage pour le WMS (nombre de requetes), ou s'il vaut mieux telecharger les donnees.

Je vous remercie d'avance pour votre reponse.

Cordialement,
[NAME]
[EMAIL]

---

**To:** contact-brgm@brgm.fr
**Subject:** Re-use of the harmonised 1:50,000 geological map (BD Charm-50 / WMS) on a free website

Hello,

I am building AtlaSlope, a free, non-commercial public website that shows European wine regions on an interactive map. I would like to display the harmonised 1:50,000 geology (BD Charm-50, or the WMS at geoservices.brgm.fr/geologie) as a map layer, with clear credit to the source.

The data.gouv.fr records disagree: the older one states the Licence Ouverte, the newer one says "licence not specified", and the WMS gives no re-use terms.

Could you confirm:
1. whether this use (a map layer, data unmodified) is permitted;
2. under which licence, and which credit line you want;
3. whether the WMS has usage limits (request rate), or whether we should download the data instead.

Thank you in advance for your reply.

Kind regards,
[NAME]
[EMAIL]
