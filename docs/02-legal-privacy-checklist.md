# Legal & privacy checklist

Written for **small Swiss business sites** built with this template. It reflects
how this stack actually behaves — which is most of the value. Add one embed and
several statements below stop being true.

> Not legal advice. For anything beyond a brochure site — health data, shops,
> bookings, newsletters — the client should get an actual review.

---

## What this template does by default

This matters because it is the reason the checklist is short:

| | Default | Consequence |
| --- | --- | --- |
| Cookies | none set | **no cookie banner needed** |
| Fonts | self-hosted via npm | no Google Fonts request, nothing to declare |
| Analytics | off; Cloudflare (cookieless) when on | still no banner |
| Third-party scripts | none | nothing shared with anyone |
| Forms | Netlify Forms | one processor to name, and we name it |
| Hosting | Netlify (US company) | named in the privacy policy |

A smoke test (`tests/smoke.spec.ts`) asserts the homepage makes **zero**
third-party requests. If someone adds an embed, that test fails — by design.

---

## Impressum

Expected for any commercially operated site. Template:
`apps/site/src/pages/[locale]/impressum.astro`.

- [ ] Legal company name (the registered one, not the trading name)
- [ ] Full postal address — a PO box is not enough
- [ ] Email address **and** phone number
- [ ] UID / commercial register number, if the business is registered
- [ ] Regulated professions (doctors, dentists, lawyers, vets) — supervisory
      authority and the canton of registration
- [ ] VAT number if VAT-registered

## Datenschutzerklärung

Required under the revised Swiss data protection act (nDSG, in force since
Sept 2023) whenever personal data is processed — a contact form counts.
Template: `apps/site/src/pages/[locale]/datenschutz.astro`.

- [ ] Who the controller is, with contact details
- [ ] What is collected and why (contact form: name, email, message)
- [ ] Where it goes — Netlify, US-based; say so
- [ ] How long it is kept
- [ ] Data subject rights: access, correction, deletion
- [ ] Server log files (Netlify keeps them)
- [ ] Analytics section — the page renders this **automatically** when a
      Cloudflare token is set in `site.json`, so do not forget to look at it

## Cookies and consent

- [ ] Confirm nothing has been added that sets a cookie
- [ ] If a booking widget, chat, map embed or video is added:
      **you now likely need a consent banner**, and the claims above are wrong

## Accessibility

Not a legal duty for most private Swiss businesses, but cheap here and it is
simply better work. The template covers focus states, semantic landmarks, a skip
link, contrast-checked tokens and a no-JS fallback for every component.

- [ ] Every image has a meaningful `alt` (Keystatic prompts for it — check the
      client actually filled it in, rather than typing "Bild")
- [ ] Colour contrast still passes after re-theming — **re-check, the brand
      colour changed**
- [ ] Keyboard-only pass: tab through the nav, the form and the gallery
- [ ] Zoom to 200% and confirm nothing is cut off

## Content the client supplies

Worth one explicit conversation, because it is their liability, not yours:

- [ ] Do they have the rights to every photo? (stock photos need a licence;
      photos of identifiable people need consent)
- [ ] Team photos — did everyone agree to appear?
- [ ] Any customer testimonials — are they real and permitted?
- [ ] Health or medical claims — regulated for medical professions

## Before launch

- [ ] Impressum and Datenschutz reachable from every page (they are, in the footer)
- [ ] Both read end to end, not skimmed
- [ ] Form tested: a submission actually arrives, and the client knows where
- [ ] Who reads those submissions, and is that address monitored?
