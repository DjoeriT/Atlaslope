# Castilla y León fact sheets: fixes against the current pliegos (19 Oct 2026)

Source of the disagreements: `Review/guides-check/<id>.md`, section "Fact sheet". Every change was checked against the pliego page
(PDF page, `Tools/guides/pages.py`). File: `content/facts/castilla-y-leon.json`. Format: field: old -> new (pliego page).


## bierzo
- why.text: Bierzo is an Atlantic-continental basin with mild temperatures and plenty of sun. Fair rainfall and acid soils give fresh, mineral wines. -> Bierzo is an Atlantic-continental basin with mild temperatures and plenty of sun. Fair rainfall and acid soils give fresh, fruity wines. (p14)
- grapes.main: Mencía, Doña Blanca, Godello -> Mencía, Godello (p14)
- grapes.others: Alarije, Garnacha Tintorera, Palomino -> Doña Blanca, Alarije, Garnacha Tintorera, Merenzao, Estaladiña, Palomino (p9-p10)
- grapes.othersPartial: True -> (removed) (p9-p10)
- styles.text: Fruity or floral whites and rosados; silky, fresh reds with mineral notes and oak when aged. -> Fresh whites, rosados and claretes; fresh, structured reds with red or black fruit, and oak when aged. (p4-p5)
- tastes.text: Whites: greenish yellow; fruity or floral, very fresh. Rosés: red-pink; red fruit, fresh. Reds: red-violet to ruby; fruity, floral, mineral, with oak when aged; silky, very fresh. -> Whites: steely to golden yellow; fruity or floral, fresh. Rosés: light pink to ruby red; red or black fruit, fresh. Reds: violet to red; red or black fruit, violets; fresh, structured. Aged reds add vanilla, toast or spice. (p4-p5)

## leon
- why.text: Winters are long and summers short, with strong sun and about 500 mm of rain. Prieto Picudo on poor soils gives aromatic wines. -> Winters are long and harsh, with strong summer sun and about 500 mm of rain. Hot summer days give Prieto Picudo its intense aroma. (p15, p22)
- grapes.main: Prieto Picudo, Mencía -> Prieto Picudo, Mencía, Negro Saurí (p14)
- grapes.others: Albarín Blanco, Verdejo, Godello, Doña Blanca, Garnacha Tinta, Palomino, Tempranillo -> Albarín Blanco, Verdejo, Godello, Garnacha Tinta, Tempranillo (p14)
- styles.kinds: white, rose, red -> white, rose, red, sweet (p5)
- styles.text: Whites of Albarín Blanco, Verdejo and Godello; Prieto Picudo rosados; fleshy, aromatic reds, also aged. -> Whites of Albarín Blanco, Verdejo and Godello; Prieto Picudo rosados; fleshy, aromatic reds, also aged. Semi-sweet and sweet wines are also made. (p5)
- climate.text: Continental: long, harsh winter, short summer alternating very hot dry days with cold ones, about 500 mm rain, much sun. -> Continental: long, harsh winter, irregular summer alternating very hot dry spells with cold ones, about 500 mm rain, much sun. (p15)
- tastes.text: Whites: balanced, fresh, complex. Rosés (Prieto Picudo): very aromatic, fresh. Reds: strong colour; red and black fruit; fleshy, full, lightly astringent, persistent. Aged reds: more complex, less astringent. -> Whites: balanced, fresh, complex. Rosés (Prieto Picudo): very aromatic, fresh. Reds: strong colour; red and black fruit; fleshy, full, lightly astringent, persistent. Aged reds: more complex; the astringency disappears in oak. (p21)
- famous.styles[0].text: Prieto Picudo with more complexity, less astringency, tannic, great mouthfeel. -> Prieto Picudo with more complexity, no astringency left, tannic, great mouthfeel. (p21)

## arlanza
- grapes.main: Tempranillo -> Tinta del País (Tempranillo) (p12)
- grapes.others: Albillo Mayor, Cabernet Sauvignon, Garnacha Tinta, Macabeo, Mencía, Merlot, Petit Verdot -> Albillo Mayor, Cabernet Sauvignon, Garnacha Tinta, Mencía, Merlot, Petit Verdot, Viura (p12)
- styles.kinds: white, rose, red -> white, rose, red, sweet (p3, p8)
- styles.text: Whites, rosados and reds; the reds stand up well to long ageing in oak barrels. -> Whites, rosados and reds; the reds stand up well to long ageing in oak barrels. Sweet reds and ice wine (Vino de Hielo) are also made. (p3, p8, p15)
- soil.text: (empty) -> Sandy loam, low in organic matter. Soils in the middle of the area are basic and rich in calcium. The Campiña plains have more clay in the north and more carbonates in the south-west. The Páramos del Cerrato have active limestone and marly clays. (p13-p14)
- tastes.text: Whites: straw yellow; fruity, tasty, balanced. Rosés: strawberry red; wild berries. Reds: intense red; wild fruit, very good structure. Aged wines: wood and fruit aromas; reds are dry. -> Whites: steely to golden yellow; fruity, balanced, fresh. Rosés: onion skin to strawberry red; red or black fruit. Reds: violet-red to purple; red or black fruit; balanced, fresh. Aged wines: wood and fruit aromas; reds are dry. (p5-p6)
- famous.styles[0].text: Cherry red softened by ageing; fruit-and-wood aromas; bears long oak ageing well. -> Garnet to brick red; wood-and-fruit aromas; bears long oak ageing well. (p6, p15)
- famous.styles[1].text: Red with ageing tones; clean, balanced wood and fruit aromas. -> Onion skin to raspberry pink with ageing tones; red fruit and wood aromas. (p6)

## valles-de-benavente
- why.text: A dry Mediterranean-continental climate and deep, well-drained poor soils let Prieto Picudo ripen. The wines are red-fruited with a slight spritz. -> An extreme, arid continental climate and poor, well-drained soils let Prieto Picudo ripen. The wines are red-fruited with a slight spritz. (p9)
- grapes.main: Prieto Picudo -> Prieto Picudo, Tempranillo, Mencía, Verdejo, Malvasía Castellana (Doña Blanca) (p8)
- grapes.others: Verdejo, Tempranillo, Mencía, Doña Blanca, Cabernet Sauvignon, Garnacha Tinta -> Garnacha Tinta, Cabernet Sauvignon (p8)
- climate.text: Extreme, arid Mediterranean-continental climate with low rainfall. -> Extreme, arid continental climate with low rainfall (350 to 550 mm a year). (p9)
- soil.text: Poor, infertile but deep, well drained and aerated. -> Mostly brown limy soils of sandy loam, 50 to 60 cm deep. They are low in fertility but well drained and aerated. (p9)

## cigales
- why.text: Vines line the Pisuerga, and 30 % are over 60 years old. They ripen intensely, with balanced acidity and sugar that suit aged wines. -> Vines line the Pisuerga, and 30 % are over 60 years old. Grapes ripen with balanced acidity and sugar, giving wines with a local stamp. (p17, p19)
- grapes.main: Tempranillo -> Tempranillo, Garnacha Tinta, Verdejo, Albillo Mayor, Sauvignon Blanc (p19)
- grapes.others: Verdejo, Garnacha Tinta, Garnacha Roja, Albillo Mayor, Cabernet Sauvignon, Macabeo, Merlot, Sauvignon Blanco, Syrah -> Viura, Garnacha Blanca, Garnacha Gris, Garnacha Tintorera, Syrah, Merlot, Cabernet Sauvignon (p13)
- soil.text: (empty) -> Tertiary and Quaternary sediments rest on clays and marls. The soil is sandy with plenty of gravel, and poor in organic matter. Lime ranges from 1% to 35%. The pH is about 8.1. (p14, p17)

## ribera-del-duero
- grapes.main: Tinto Fino (Tempranillo) -> Tinto Fino (Tempranillo), Albillo Mayor (p17)
- grapes.others: Cabernet Sauvignon, Merlot, Malbec -> Cabernet Sauvignon, Garnacha Tinta, Malbec, Merlot (p17)
- grapes.othersPartial: True -> (removed) (p17)
- styles.kinds: red, rose -> red, rose, white (p13, p22)
- styles.text: Rosados with lively colour and fruit; young reds fruity and intense, aged reds complex and elegant. -> Very aromatic Albillo Mayor whites; rosados with lively colour and fruit; young reds fruity and intense, aged reds complex and elegant. (p13, p22)
- climate.text: Strongly continental: big yearly and daily temperature swings, especially at ripening, low rainfall and high average altitude. -> Strongly continental: big yearly and daily temperature swings, especially at ripening, moderate to low rainfall and high average altitude. (p19)
- soil.text: (empty) -> Ochre and reddish sandy clays lie beside the Duero’s middle and low terraces. The pH is basic. Organic matter is scarce. (p21)
- tastes.text: Reds: vivid colour, deep; fruity and intense when young, well structured. Aged reds: blue tones that last; very complex, fruit and wood; powerful yet elegant. Rosés: vivid colours, fruity nose; refreshing, light. -> Whites: very aromatic, fruity or herbal; fresh acidity. Rosés: vivid colours, fruity nose; refreshing, light. Reds: vivid colour, deep; fruity and intense when young. Aged reds: lasting blue tones; complex fruit and wood; powerful yet elegant. (p22)

## valtiendas
- grapes.others: (none) -> Garnacha Tinta, Cabernet Sauvignon, Merlot, Syrah, Albillo Mayor (p7)
- grapes.othersPartial: True -> (removed) (p7)
- climate.text: Mediterranean with continental influence, average altitude above 800 m: long cold winters, warm dry summers, little rain, large daily swings. -> Mediterranean with continental influence, average altitude above 800 m: long harsh winters, mild summers, little rain, large daily swings. (p8)
- tastes.text: Rosés: cherry pink; fruity with floral touches; medium structure. Young reds: intense red; frank, intense aromas; tasty, good structure. Aged reds: wood well integrated; mineral tones in all reds. -> Rosés: cherry pink; fruity with floral touches; medium structure. Young reds: intense red; frank, intense aromas; tasty, good structure. Aged reds: intense red with ageing tones; tasty, balanced. Mineral tones stand out most in the reds. (p4, p10)
- famous.styles[0].text: Intense red with ageing tones; well-integrated wood. -> Intense red with ageing tones; frank, intense aromas; tasty, good structure. (p4)

## toro
- why.text: Old bush vines face harsh winters and hot sun on iron-rich sandy-loam soils. The wines are very deeply coloured and high in alcohol. -> Old vines face harsh winters and long hours of sun on iron-rich sandy-loam soils. The wines are very deeply coloured and high in alcohol. (p12, p19)
- grapes.main: Tinta de Toro (Tempranillo), Malvasía Castellana (Doña Blanca) -> Tinta de Toro (Tempranillo), Malvasía Castellana (Doña Blanca), Verdejo (p16)
- grapes.others: Verdejo, Garnacha Tinta -> Garnacha Tinta, Moscatel de Grano Menudo, Albillo Real (p16)
- styles.kinds: white, rose, red -> white, rose, red, sparkling, sweet (p12, p18)
- styles.text: Whites (some barrel-fermented) and rosados; structured, tannic reds with ripe fruit and lower acidity than elsewhere. -> Whites (some barrel-fermented) and rosados; structured, tannic reds with ripe fruit and lower acidity than elsewhere. Quality sparkling wines and semi-dry to sweet wines are also made. (p18-p19)
- soil.text: Sandy loam, neutral pH, little organic matter and rich in iron. -> Sandy loam with little organic matter. The pH is slightly acid to neutral (6-7), about 8 in the south-west. Poor in trace elements except iron. (p17)
- tastes.text: Whites: straw yellow; fruity, tasty, balanced. Rosés: strawberry to raspberry red; wild berries. Reds: cherry-picota; red and wild fruit; structured, tannic, ripe fruit, lower acidity; barrel tones when aged. -> Whites: pale to golden yellow; fruity, floral or herbal. Rosés: pale pink to salmon; fresh red or black fruit. Reds: picota to ruby red; red or black fruit; structured, tannic, lower acidity; barrel tones when aged. (p7-p8, p18)

## tierra-del-vino-de-zamora
- why.text: Old vines on alluvial soils face harsh winters and spring frost. The grapes get very ripe, giving deeply coloured, structured reds. -> Old vines on alluvial soils get little rain and much sun. The grapes ripen evenly and gain sugar, giving deeply coloured, structured reds. (p14)
- grapes.main: Doña Blanca, Moscatel de Grano Menudo, Verdejo, Tempranillo -> Tempranillo, Malvasía Castellana (Doña Blanca), Moscatel de Grano Menudo, Verdejo, Godello (p12)
- grapes.others: Godello, Albillo Mayor, Cabernet Sauvignon, Garnacha Tinta, Palomino -> Albillo Real, Palomino, Garnacha Tinta, Cabernet Sauvignon (p10, p12)

## uruena
- tastes.text: Rosés: onion-skin to raspberry pink; fresh fruit and floral notes; fresh. Reds: purple to tile red; red and black fruit, with spice when oak-aged; medium to full body and length. -> Rosés: onion-skin to raspberry pink; fresh fruit with floral or caramel notes; fresh. Reds: purple to tile red; red and black fruit, with spice when oak-aged; medium to full body and length. (p3)

## dehesa-penalba
- styles.kinds: red -> red, rose (p2-p7)
- styles.text: Reds only: young reds, and reds aged 6 to 24 months in wood. -> Young and oak-aged reds and rosados. Ageing is in oak barrels of 225 to 600 l or wooden vats up to 5,500 l. (p2-p7)
- tastes.text: Deep, steady colour with blue-red tones; ripe red and black fruit; sweet, long-lived tannin; medium-to-full body; long finish. -> Reds: deep, steady colour with blue-red tones; ripe red and black fruit; sweet, long-lived tannin; medium-to-full body; long finish. Rosés: onion skin to redcurrant; red or black fruit; fresh, balanced. (p3-p4)
- famous.styles[1].text: Single-grape red aged 12 to 24 months in 225 l oak barrels. -> Single-grape red aged in 225 to 600 l oak barrels or wooden vats. (p6)
- famous.styles[2].text: Blended red aged 6 to 24 months in oak barrels or wooden vats. -> Blended red aged in 225 to 600 l oak barrels or wooden vats. (p6)

## abadia-retuerta
- grapes.others: Albillo Mayor, Cabernet Franc, Cabernet Sauvignon, Garnacha Tinta, Gewürztraminer, Godello, Graciano, Malbec, Merlot, Petit Verdot, Pinot Noir, Riesling, Sauvignon Blanc, Syrah, Tempranillo, Verdejo -> Albillo Mayor, Cabernet Franc, Cabernet Sauvignon, Garnacha, Gewürztraminer, Godello, Graciano, Hondarrabi Beltza, Malbec, Mencía, Merlot, Petit Verdot, Pinot Noir, Prieto Picudo, Riesling, Sauvignon Blanc, Syrah, Tempranillo, Touriga Nacional, Verdejo (p6-p7)
- styles.text: Reds: single-grape (at least 12 months in oak) or blended (at least 6). Whites: blends, steel tank or oak. -> Reds: single-grape (at least 12 months in oak) or blended (at least 6). Whites: single-grape or blended, steel tank or at least 3 months in oak. (p4-p5)

## sierra-de-salamanca
- grapes.others: Rufete, Garnacha Tinta, Macabeo, Moscatel de Grano Menudo, Palomino, Tempranillo -> Rufete, Garnacha Tinta, Tempranillo, Viura, Moscatel de Grano Menudo, Palomino, Rufete Serrano Blanco (p9)
- soil.text: Acid pH; slate soils. -> Acid soils, mostly sandy loam. Slate lies to the west and granite to the east. (p9, p11)
- styles.text: Fruity whites with medium-high body; medium-structure rosados; long-lived reds suited to keeping. -> Whites and rosados of medium structure; young reds and reds aged in barrel. All are long-lived. (p5, p11)
- tastes.text: Whites: straw yellow, greenish; green apple; medium-high body, tasty, lively. Rosés: strawberry to raspberry; blackberry, redcurrant. Reds: picota, violet tints; wild fruit, undergrowth herbs, mineral; long-lived. -> Whites: yellow; fruity, floral or herbal; medium structure. Rosés: onion-skin to cherry pink; fruity, floral or herbal. Reds: red; fruity, floral or herbal; medium-high acidity, medium-low structure. All show mineral and scrub-herb notes. (p5, p11)

## cebreros
- grapes.othersPartial: True -> (removed) (p7)

## rueda
- tastes.text: Whites: pale yellow to amber, gold or green tones; fruit, floral, herbal; fresh, medium to full body. Rosés: strawberry to onion-skin; red fruit. Reds: ruby to picota; black and red fruit; oak-aged add yeast and bakery notes. -> Whites: pale yellow to amber, gold or green tones; fruit, floral, herbal; fresh, medium to full body. Rosés: strawberry to onion-skin; red fruit. Reds: ruby to picota; black and red fruit; oak-aged ones add yeast or bakery notes and oak. (p5)

## arribes
- famous.styles[1].text: White fermented in barrel; smoky, toasty notes with fruit; well-integrated oak. -> Fermented and lees-aged in oak barrels; smoky, toasty notes mixed with fruit. (p5, p8)

Cites: each changed field now cites `<id>-pliego:p<n>` (Rueda: `rueda-doc:p<n>`) for the pages above; older `-doc` cites stay only where the
field keeps text the pliego does not contradict.

## Not changed (log line checked, no contradiction or wording only)
- abadia-retuerta altitude, why; arribes grape synonyms and cite numbering; cebreros climate "short mild winters", soil, famous name;
  cigales climate; rueda "fortified" (owner default: liqueur wine counts as fortified); tierra-del-vino-de-zamora and valles-de-benavente
  famous "Crianza, Reserva, Gran Reserva" (the text describes the wine, not an ageing rule); uruena styles "young or oak-aged" (p3 says
  spice "when oak-aged", so unaged reds exist) and others synonym Tinta de Toro (omission only); bierzo climate, soil.

## Calls made, for the owner
- uruena grapes.main stays Syrah: p10 says Syrah has the largest area, p11 calls Tempranillo "variedad predominante en la zona". Ambiguous; left as is.
- cigales grapes.main: p19 singles out Tempranillo and Garnacha (red) and Verdejo, Albillo and Sauvignon Blanc (white), so all five are main.
  The p13 variety list also differs from the old sheet: Garnacha Gris (not Garnacha Roja), Viura (not Macabeo), plus Garnacha Blanca and Garnacha Tintorera.
- tierra-del-vino-de-zamora grapes.main: p12 singles out Tempranillo, and among whites Malvasía Castellana, Moscatel de Grano Menudo, Verdejo and Godello.
- leon styles.kinds adds sweet (p5 defines semi-sweet and sweet wines); not in the guides log, found while checking.
- bierzo, toro, valles-de-benavente, tierra-del-vino-de-zamora: Doña Blanca follows each pliego (Malvasía Castellana with Doña Blanca as synonym where the pliego says so; Bierzo p10 lists "Doña Blanca (o Malvasía Castellana)", kept as Doña Blanca).
