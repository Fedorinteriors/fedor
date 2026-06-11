import type { RoomData } from './types'

export const SKETCH_ANALYSIS_PROMPT = `Ti si arhitektonski AI asistent koji analizira rukom nacrtane osnove prostorija.

Na slici je nacrtana skica osnove prostorije sa dimenzijama.

Analiziraj skicu i izvuci:
1. Oblik prostorije i ukupne dimenzije
2. Dužine svih vidljivih zidova sa dimenzijama
3. Visina zidova (ako je navedena, inače pretpostavi 260cm)
4. Lokacija i veličina prozora i vrata
5. Ostali arhitektonski elementi (stubovi, grede, niše)

Vrati SAMO JSON objekat ovog formata (bez ikakvog teksta ispred ili iza):
{
  "shape": "rectangular" | "L-shape" | "irregular",
  "dimensions": {
    "width": <broj u cm>,
    "length": <broj u cm>,
    "height": <broj u cm>
  },
  "area": <broj u m²>,
  "walls": [
    {
      "id": "A",
      "length": <broj u cm>,
      "height": <broj u cm>,
      "features": [
        {
          "type": "window" | "door" | "column",
          "position": <udaljenost od početka u cm>,
          "width": <broj u cm>,
          "height": <broj u cm>
        }
      ]
    }
  ],
  "confidence": <broj 0-1>,
  "notes": "<važne napomene>"
}

Važno:
- Sve mjere u centimetrima
- Standardna visina prostorije je 260cm ako nije navedena
- confidence treba reflektovati čitljivost skice (0.9+ = jasno, 0.6-0.9 = čitljivo, ispod 0.6 = teško čitljivo)
- Ako dimenzija nije jasna, napravi procjenu na osnovu proporcija`

export function buildVariantPrompt(roomData: RoomData): string {
  return `Ti si ekspertni dizajner kuhinja. Na osnovu podataka o prostoriji, generiši 5 različitih varijanti dizajna kuhinje.

Podaci o prostoriji:
- Dimenzije: ${roomData.dimensions.width}cm × ${roomData.dimensions.length}cm × ${roomData.dimensions.height}cm
- Površina: ${roomData.area.toFixed(1)} m²
- Oblik: ${roomData.shape}
- Napomene: ${roomData.notes}

Generiši 5 varijanti u ovim stilovima:
1. Moderna Minimalistica
2. Skandinavska Toplina
3. Industrijski Loft
4. Klasična Elegancija
5. Zen Prirodnost

Za svaku varijantu biraj raspored kuhinje koji OPTIMALNO iskorištava dimenzije prostorije (${roomData.dimensions.width}cm × ${roomData.dimensions.length}cm).

Vrati SAMO JSON niz od 5 objekata (bez teksta ispred/iza):
[
  {
    "id": "variant-1",
    "name": "<kreativni naziv>",
    "style": "modern" | "scandinavian" | "industrial" | "classic" | "zen",
    "layout": "L-shape" | "U-shape" | "island" | "galley" | "single-wall" | "peninsula",
    "shortDescription": "<2-3 rečenice>",
    "description": "<pun paragraf opisa>",
    "renderPrompt": "<detaljan prompt za DALL-E generisanje fotorealističnog rendera kuhinje, na engleskom>",
    "cabinets": {
      "color": "<boja>",
      "material": "<materijal>",
      "style": "<stil>",
      "hasIsland": <boolean>,
      "hasUpperCabinets": <boolean>
    },
    "countertop": {
      "material": "<materijal>",
      "color": "<boja>"
    },
    "appliances": [
      {"name": "<naziv>", "notes": "<napomena>"}
    ],
    "lighting": {
      "ambient": "<opis>",
      "task": "<opis>",
      "accent": "<opis>",
      "fixtures": ["<svjetiljka1>", "<svjetiljka2>"]
    },
    "flooring": {
      "material": "<materijal>",
      "color": "<boja>"
    },
    "colors": ["<hex1>", "<hex2>", "<hex3>"],
    "features": ["<feature1>", "<feature2>", "<feature3>", "<feature4>", "<feature5>"],
    "estimatedCost": {
      "min": <broj u BAM>,
      "max": <broj u BAM>,
      "currency": "BAM",
      "breakdown": [
        {
          "category": "<kategorija>",
          "description": "<opis>",
          "estimatedCost": <broj>,
          "unit": "kom" | "m²" | "m" | "set",
          "quantity": <broj>
        }
      ]
    },
    "timeline": [
      {
        "name": "<naziv faze>",
        "duration": "<trajanje>",
        "description": "<opis>",
        "order": <1-6>
      }
    ]
  }
]

Smjernice:
- Sve nazive, opise i tekstove piši na bosanskom/srpskom jeziku
- renderPrompt pišu na ENGLESKOM za DALL-E
- Cijene realne za bosansko/regionalno tržište (BAM)
- Breakdown kalkulacije mora uključiti: korpusi, frontovi, radna ploča, ugradbeni uređaji, slavina+sudopera, rasvjeta, ugradnja, transport
- Timeline mora imati 5-6 faza: mjerenje/projektovanje, narudžba materijala, izrada u radionici, isporuka i montaža, završni radovi, primopredaja
- Prilagodi raspored dimenzijama prostorije`
}
