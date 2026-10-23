// Featured work shown in the home hero. Order = display order.
// `image` is the file name under src/assets/work/ (Astro optimizes it at build).
export type WorkTag = "Website" | "App" | "Brand" | "Tool";

export interface WorkItem {
  slug: string;
  name: string;
  tags: WorkTag[];
  image: string;
  alt: string;
  href?: string;   // live site, shown as "Visit site" in the sheet
  blurb?: string;  // one or two lines for the sheet
}

export const work: WorkItem[] = [
  { slug: "resto", name: "Resto", tags: ["Website", "Brand"], image: "resto.webp", alt: "Resto restaurant homepage" },
  { slug: "splist", name: "Splist", tags: ["App"], image: "splist-app.webp", alt: "Splist app" },
  { slug: "chessheat", name: "Chess Heat", tags: ["Website", "Tool"], image: "chessheat.webp", alt: "Chess Heat homepage" },
  { slug: "typehero", name: "TypeHero", tags: ["Website"], image: "typehero.webp", alt: "TypeHero homepage" },
  { slug: "wikihop", name: "WikiHop", tags: ["Website", "Tool"], image: "WikiHop.webp", alt: "WikiHop homepage" },
  { slug: "overlayed", name: "Overlayed", tags: ["Website", "App"], image: "overlayed.webp", alt: "Overlayed homepage" },
  { slug: "music", name: "Music", tags: ["Website"], image: "music.webp", alt: "Music homepage" },
  { slug: "maxdemaio", name: "Max DeMaio", tags: ["Website"], image: "maxdemaio-home.webp", alt: "Max DeMaio personal site" },
  { slug: "cozy", name: "Cozy Coders", tags: ["Website", "Brand"], image: "cozy.webp", alt: "Cozy Coders homepage" },
];
