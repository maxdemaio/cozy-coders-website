import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

export const RESOURCE_TYPES = {
  guide: "Guide",
  checklist: "Checklist",
  "case-study": "Case study",
  article: "Article",
  template: "Template",
} as const;

export type ResourceType = keyof typeof RESOURCE_TYPES;

const resources = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/resources" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(220),
    date: z.coerce.date(),
    type: z.enum(
      Object.keys(RESOURCE_TYPES) as [ResourceType, ...ResourceType[]],
    ),
    /** Optional cover, ideally 1200x630. Falls back to a typed placeholder. */
    image: z.string().optional(),
    /** External resource (download, external doc). Card links out instead of to a detail page. */
    href: z.string().url().optional(),
    /** Overrides the card's action label ("Read", "Download", "Open"). */
    cta: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { resources };
