# Photography

Drop images here as `<name>.jpg` (`.jpeg`, `.webp`, `.png`, `.avif` also work); the site picks them up by file name.
Use only images the company owns or is licensed to use. Until a file exists a neutral placeholder plate is shown
(in `npm run dev` it also prints the brief). Export at ~1600 px on the long edge, compressed (< 400 KB).
If an image shows people who are not real staff, keep the `alt` text neutral (see `photoAlt` in `content/en.ts` / `pt.ts`).

| File name | Page | Ratio | Status |
|---|---|---|---|
| `home-hero` | Home | portrait 4:5 (cropped from landscape) | done |
| `facility-management` | Facility Management | 3:2 | done |
| `about` | About | 3:2 | done (1264 px) |
| `property-management` | Property Management | 3:2 | done (low resolution, ~490 px source: replace with a larger original) |
| `waste-management` | Waste Management | 3:2 | done (1264 px) |
| `supplies-procurement` | Products & Supplies | 3:2 | done (1264 px) |
| `sectors` | Sectors | 16:9 | done (low resolution, ~490 px source: replace with a larger original) |
| `hse` | HSE & Quality | 16:9 | done (low resolution, ~490 px source: replace with a larger original) |
| `mobilisation` | Mobilisation | 16:9 | done (low resolution, ~490 px source: replace with a larger original) |

## Prompts (same look as the supplied images)
Common style: *photorealistic documentary photograph, natural daylight, sharp, no text, no logos, no watermarks;
workers in navy-blue coveralls with green and silver reflective bands, white hard hats, safety glasses and grey gloves
where appropriate; brand green (#007E5A) accents; modern Luanda setting (palms, tropical plants, glass-and-stone buildings).*

- **about** (3:2): two technicians, a woman and a man, reviewing building plans and a tablet on a site walkway, modern office building behind.
- **property-management** (3:2): a technician with a clipboard and tablet doing an inspection round at the entrance of a well-kept commercial building and condominium, landscaped gardens.
- **waste-management** (3:2): a technician beside neatly segregated, colour-coded and labelled waste containers in a clean, covered storage area, recording quantities on a tablet. No dirt or spills.
- **supplies-procurement** (3:2): a technician checking goods against a delivery note in a tidy warehouse, racking with boxed consumables, PPE and tools, a pallet being received.
- **sectors** (16:9): wide view of an industrial base at a respectful distance: storage tanks, pipework, a crane and a logistics yard, clear sky, no people in the foreground.
- **hse** (16:9): a worker in full PPE (helmet, glasses, gloves, high-visibility coverall) checking a permit-to-work board or a safety checklist at a controlled work area, barriers and signage (no readable text).
- **mobilisation** (16:9): a van and a crew arriving at a site gate with equipment being unloaded, a supervisor with a tablet greeting them, early morning light.
