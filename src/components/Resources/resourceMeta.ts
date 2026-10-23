import type { CollectionEntry } from "astro:content";
import { RESOURCE_TYPES, type ResourceType } from "@/content.config";

export { RESOURCE_TYPES };
export type { ResourceType };

export type Resource = CollectionEntry<"resources">;

/** Solar icon per type, used for placeholder art and type labels. */
export const TYPE_ICONS: Record<ResourceType, string> = {
  guide: "solar:book-bookmark-bold-duotone",
  checklist: "solar:checklist-minimalistic-bold-duotone",
  "case-study": "solar:case-round-bold-duotone",
  article: "solar:document-text-bold-duotone",
  template: "solar:layers-minimalistic-bold-duotone",
};

export function typeLabel(type: ResourceType): string {
  return RESOURCE_TYPES[type];
}

export function resourceHref(resource: Resource): string {
  return resource.data.href ?? `/resources/${resource.id}`;
}

export function isExternal(resource: Resource): boolean {
  return Boolean(resource.data.href);
}

export function ctaLabel(resource: Resource): string {
  if (resource.data.cta) return resource.data.cta;
  return isExternal(resource) ? "Open" : "Read";
}

const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const fullDate = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export function formatMonthYear(date: Date): string {
  return monthYear.format(date);
}

export function formatFullDate(date: Date): string {
  return fullDate.format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Published resources, newest first. */
export function publishedSorted(all: Resource[]): Resource[] {
  return all
    .filter((r) => !r.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Featured first, then newest, capped. Used for the "Latest" row. */
export function pickLatest(sorted: Resource[], count: number): Resource[] {
  const featured = sorted.filter((r) => r.data.featured);
  const rest = sorted.filter((r) => !r.data.featured);
  return [...featured, ...rest].slice(0, count);
}
