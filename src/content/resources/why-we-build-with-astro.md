---
title: "Why we build marketing sites with Astro"
description: "Marketing sites need to be fast, editable, and cheap to keep alive. Here's why Astro is our default and when we reach for something else."
date: 2026-10-02
type: article
featured: true
---

Most of the sites we ship are marketing sites: a home page, a handful of landing pages, a resources section, a contact form. They don't need an app framework. They need to load instantly, rank well, and still be editable a year from now when the person who commissioned them has moved on.

## Almost no JavaScript by default

Astro renders to plain HTML and only ships JavaScript for the components you mark as interactive. A page with a hero, three feature cards, and a footer sends zero JavaScript. That's the single biggest lever on load time and Core Web Vitals we have, and we get it for free.

When we do need interactivity (a carousel, a filter, a pricing toggle) we can drop in a React component with `client:load` and pay for exactly that island, nothing else.

## Content lives in files, not a database

Astro's content collections give us typed Markdown with a schema. A resources hub like this one is a folder of `.md` files with frontmatter. Adding a guide is a pull request, not a CMS login, and the schema catches a missing description or a bad date at build time.

For clients who want a visual editor we layer a Git-backed CMS on top. The content stays in the repo either way.

## Shared components with your product

If your product is React, Vue, or Svelte, Astro can render those components too. Your design system's button on the marketing site is the same button as in the app. No second implementation that drifts out of sync.

## When we don't use it

Dashboards, logged-in experiences, anything with real client-side state. For those we reach for Next.js or a plain SPA. Astro is a marketing site tool, and we like it because it stays in its lane.
