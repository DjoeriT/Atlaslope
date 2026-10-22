#!/usr/bin/env python3
"""Add the stop photos of the Rioja and Priorat story (five, then two for Priorat weather and rules, 22 Oct 2026) to the app's photo set.

Same steps as Tools/data/photo_ship.py (Commons' 1200 px rendition, WebP quality 72, entry in data/photos.json), for photos that are
not a place's Guides photo. Then run Tools/data/photo_sizes.py for the 160/480/800 copies and blur previews.
Needs Pillow (.venv/bin/python3). Focus points (checked on the 3:2 frame) go in src/pages/pageCrops.json with
Tools/guides/crop_sheet.mjs --page, not in src/home/photoCrops.json (square Guides cards only).
"""
import importlib.util, io, json, sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("photo_ship", ROOT / "Tools/data/photo_ship.py")
ship = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ship)

PHOTOS = {  # id -> (title, page, artist, licence, licenceUrl, alt, focus)
    "rioja-sierra-1": ("File:Sierra de Cantabria.jpg", "https://commons.wikimedia.org/wiki/File:Sierra_de_Cantabria.jpg", "Deivid",
                       "Public domain", None, "The limestone crests of the Sierra de Cantabria seen across the vineyard terraces", "50% 40%"),
    "rioja-haro-1": ("File:Estación de Ferrocarril de Haro - La Rioja.jpg", "https://commons.wikimedia.org/wiki/File:Estaci%C3%B3n_de_Ferrocarril_de_Haro_-_La_Rioja.jpg",
                     "BigSus", "CC BY 2.5", "https://creativecommons.org/licenses/by/2.5", "Haro railway station, a red-brick building beside the tracks", "50% 45%"),
    "priorat-siurana-1": ("File:Siurana - Pantà i església.JPG", "https://commons.wikimedia.org/wiki/File:Siurana_-_Pant%C3%A0_i_esgl%C3%A9sia.JPG",
                          "Lohen11 - Josep Renalias", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0", "The church of Siurana on its cliff above the Siurana reservoir", "50% 45%"),
    "priorat-porrera-1": ("File:Vinyes del Priorat, Porrera.jpg", "https://commons.wikimedia.org/wiki/File:Vinyes_del_Priorat,_Porrera.jpg",
                          "Àngela Llop", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "Vines on steep terraced slopes at Porrera, Priorat", "50% 50%"),
    "priorat-scala-dei-1": ("File:Cartoixa d'Escaladei - Vista.jpg", "https://commons.wikimedia.org/wiki/File:Cartoixa_d%27Escaladei_-_Vista.jpg",
                            "joan ggk", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "The village at Scala Dei below the cliffs of the Montsant", "50% 40%"),
    "priorat-weather-1": ("File:Serra del Montsant - 14.jpg", "https://commons.wikimedia.org/wiki/File:Serra_del_Montsant_-_14.jpg",
                          "Angela Llop", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0", "Vines on bare reddish soil in the foreground, wooded hills beyond and the limestone crests of the Serra del Montsant under a blue sky", "50% 50%"),
    "priorat-rules-1": ("File:Bodegas, vinos del Priorat, Scala Dei, La Morera de Montsant.jpg", "https://commons.wikimedia.org/wiki/File:Bodegas,_vinos_del_Priorat,_Scala_Dei,_La_Morera_de_Montsant.jpg",
                        "Juan Emilio Prades Bel", "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0", "The stone front of the Cellers de Scala Dei winery, with two wooden doors under its name board", "50% 50%"),
    "ribeira-sacra-canon-1": ("File:Cañón del Sil, Ribeira Sacra.jpg", "https://commons.wikimedia.org/wiki/File:Ca%C3%B1%C3%B3n_del_Sil,_Ribeira_Sacra.jpg",
                              "Jl FilpoC", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "The Sil flowing between steep rocky walls in the Sil canyon on an overcast day", "50% 50%"),
    "ribeira-sacra-peares-1": ("File:Os Peares - Viaducto - 01.jpg", "https://commons.wikimedia.org/wiki/File:Os_Peares_-_Viaducto_-_01.jpg",
                               "Xosema", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "A road viaduct and an iron railway bridge crossing the valley at Os Peares, with wooded hills and the village roofs below", "50% 50%"),
    "ribeira-sacra-amandi-1": ("File:Doade, Sober. Ribeira Sacra, Lugo. Galiza.jpg", "https://commons.wikimedia.org/wiki/File:Doade,_Sober._Ribeira_Sacra,_Lugo._Galiza.jpg",
                               "Ramon Piñeiro", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0", "Terraced vineyards on a steep slope above the Sil at Doade, with the river below", "50% 50%"),
    "ribeira-sacra-weather-1": ("File:Viñedos cerca del Canón del Sil en la Ribeira Sacra.jpg", "https://commons.wikimedia.org/wiki/File:Vi%C3%B1edos_cerca_del_Can%C3%B3n_del_Sil_en_la_Ribeira_Sacra.jpg",
                                "Tanja Freibott", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "Old vines in autumn colour behind a dry-stone wall, with villages on the hills under a grey sky near the Sil canyon", "50% 50%"),
    "ribera-belt-1": ("File:Viñedos Bodega Viña Sastre - Hermanos Sastre Ribera del Duero.JPG", "https://commons.wikimedia.org/wiki/File:Vi%C3%B1edos_Bodega_Vi%C3%B1a_Sastre_-_Hermanos_Sastre_Ribera_del_Duero.JPG",
                      "Pravdaverita", "CC BY 3.0", "https://creativecommons.org/licenses/by/3.0", "Bare winter vines in front of a winery in the Ribera del Duero", "50% 50%"),
    "ribera-pintia-1": ("File:Necrópolis de Las Ruedas.jpg", "https://commons.wikimedia.org/wiki/File:Necr%C3%B3polis_de_Las_Ruedas.jpg",
                        "Miguel Alan Córdova Silva", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "Standing stones of the Las Ruedas necropolis at Pintia, with the Duero hills behind", "50% 40%"),
    "ribera-soils-1": ("File:Clear cultivation in Viñedos en la Ribera del Duero.jpg", "https://commons.wikimedia.org/wiki/File:Clear_cultivation_in_Vi%C3%B1edos_en_la_Ribera_del_Duero.jpg",
                       "Raúl Hernández González", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "Vine rows on ochre sandy clay in the Ribera del Duero", "50% 60%"),
}


def main():
    path = ROOT / "data/photos.json"
    doc = json.loads(path.read_text())
    for key, (title, page, artist, licence, lurl, alt, _) in PHOTOS.items():
        out = ship.OUT / f"{key}.webp"
        if not out.exists():
            img = Image.open(io.BytesIO(ship.fetch(ship.rendition(title)))).convert("RGB")
            img.thumbnail((1200, 1200))
            img.save(out, "WEBP", quality=72, method=6)
        doc["photos"][key] = {"alt": alt, "artist": artist, "licence": licence, "licenceUrl": lurl, "page": page, "title": title}
        print(key, out.stat().st_size // 1024, "KB")
    path.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n")


if __name__ == "__main__":
    sys.exit(main())
