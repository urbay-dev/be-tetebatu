# Explore page verification

Implemented in C:/wega/frontend, route `/explore`.

## Passed

- Production build and lint.
- Landing Explore/Jelajahi links and direct route loading.
- Search, accommodation-type/location filters, price sorting, persistent favorites.
- Date validation and a two-night villa estimate of Rp 1.224.000 including the illustrative 2% fee.
- Contact preview dialog, ID/EN switching and mobile navigation back to home.
- Image loading and no horizontal overflow at 1440, 1024, 768, 390 and 320px.
- Desktop/mobile screenshot review. Mobile search subsequently compacted into two columns; functional checks repeated successfully.

## Visual checker limitations

GATE: FAIL 23 (round 2 of 3). No waivers were added and the checker was not modified.

The generic landing-page checker expects full-screen sections, a full-screen hero, no repeated card layouts/actions, special animation sections, `.wrap` classes, and a particular static HTML hierarchy. Those rules conflict with the requested compact accommodation directory, overlapping search panel, repeating listing cards, booking sidebar, existing shared footer and React/Tailwind structure. The checker also interprets the two-line brand mark as a wrapped nav link, and checks the Indonesian headline against an English category keyword.

Remaining reported IDs: nav, spill, card-layout, copy-headline, copy-actions, heading-order, action-repeat, moment-none, hero-screen, section-height, one-section, one-heading, container-edges, split-pair, container. Heading order was fixed after that run by adding an accessible listings h2. Genuine 320px navbar overflow and low-contrast labels were fixed before the second run. Generic design-gate approval is not claimed.

## Data and assets

Names, rates and review figures are illustrative examples adapted from the user's reference, not verified providers. Images reuse existing generated landscape/stay/village assets and the original project's room preview image. Some card images repeat; dedicated property photography is still needed. The public UI identifies the data as a preview. No availability lookup, real booking, payment or outgoing WhatsApp message is performed. Contact actions explain this limitation instead of using invented phone numbers.

The existing forest-green/cream palette, Libre Franklin / Source Serif 4 fonts and shared navbar/footer are preserved. No new animation kit or custom CSS was introduced, following the requested Tailwind-only structure and reference layout.
