# Release 67: what to test (one short photo credit line, groundwork for Portugal)

The photo credits on the Guides page are one short line.
Everything else should look exactly as before.

Hard-reload first (Cmd+Shift+R).

1. Open Guides. Scroll to the end. One "Photos:" line.
2. It says once that the photos come from Wikimedia Commons, cropped and resized.
3. Each licence appears once, linked, with its photographers after it.
4. Click a photographer's name. Their photo's Commons page opens.
5. Open the Atlas. The Spain card looks as before.
6. Open Toro's guide. Under the title it still says "Wine Scholar · Castilla y León".
7. Open any guide with charts. The last comparison row still reads "All of Spain".

For you: PRs #196 (credits grouped by licence), #197 (Portugal, France and Italy data, not shown on the site), #198 (country model:
Portugal pages at /pt/<place>/, none built yet because no Portugal place exists). Checks: #198's CI green on 9a344ec, unit tests 528.
Not checked: real Safari, iPad, phone; a /pt/ page on the live site (none exists until the pilot).
