# Photography

Place real photographs here; the site picks them up automatically by file name (`.jpg`, `.jpeg`, `.webp`, `.png`, `.avif`).
Use only images the company owns or is licensed to use, and people who have consented. Illustrative images are listed in `src/lib/photos.ts` and get an "Illustrative image" caption; remove the name from that list when swapping in a real photograph. Until a file exists, a neutral
placeholder plate is shown (in `npm run dev` it also prints the brief).

| File name | Used on | Brief |
|---|---|---|
| `home-hero` | Home (portrait 4:5) | **Supplied** (company commercial profile, marked "illustrative image" on the site). Replace with a real photograph when available |
| `about` | About (3:2) | Real team members in PPE reviewing a plan on site |
| `facility-management` | Facility Management (3:2) | **Supplied** (illustrative image, captioned). Replace with a real photograph when available |
| `property-management` | Property Management (3:2) | Office or accommodation building at a base |
| `waste-management` | Waste Management (3:2) | Segregated, labelled waste storage area |
| `supplies-procurement` | Supplies & Procurement (3:2) | Warehouse / laydown, goods-in check |
| `sectors` | Sectors (16:9) | Tanks, pipework, cranes at a respectful distance |
| `hse` | HSE & Quality (16:9) | Worker in full PPE at a permit-controlled location |
| `mobilisation` | Mobilisation (16:9) | Vehicles and crew arriving at a site gate |

Export at ~2000 px on the long edge, compressed (< 400 KB each). Also update the `alt` text in the page if the image differs.
