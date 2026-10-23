---
title: "The landing page launch checklist"
description: "Everything we check before a page goes live: copy, performance, metadata, forms, analytics, and the boring stuff that bites you a week later."
date: 2026-09-24
type: checklist
featured: true
---

We run through this list on every page before it ships. It takes about twenty minutes and catches most of the problems that otherwise turn into a "hey, did you notice..." message three days after launch.

## Copy

- The headline says what you do and who it's for, in one read.
- Every call to action is a verb. "Book a call", not "Learn more".
- No placeholder text left anywhere. Search the build output for "lorem" and "TODO".
- Someone outside the project has read it start to finish.

## Performance

- Lighthouse performance score of 90 or better on mobile.
- Hero image is sized for its container and set to load eagerly. Everything below the fold is lazy.
- Fonts are self-hosted and subset. No third-party font requests.
- No layout shift when fonts or images load.

## Metadata and sharing

- Unique title and description per page.
- A 1200x630 social card that shows the page title, not just the hero art.
- Canonical URL set, especially on pages reachable at more than one path.
- Favicon works in light and dark browser chrome.

## Forms

- Submit the form yourself and confirm the notification lands where the client expects.
- Error states are visible and say what to fix.
- Success state tells the visitor what happens next and when.
- Spam protection is on. A honeypot field is usually enough.

## Analytics and tracking

- Analytics fires on the production domain and not on preview URLs.
- Conversion events are wired to the actual submit, not the button click.
- Cookie consent is in place if the audience requires it.

## The boring stuff

- 404 page exists and has a way back.
- Links in the footer go somewhere.
- The domain redirects from `www` to the apex, or the other way, but not both.
- Someone other than the developer has the hosting login.
