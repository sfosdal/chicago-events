# Chicago Events

Event feed and calendar for Chicago: United Center, Soldier Field, Wrigley
Field, Rate Field, Wintrust Arena, the Loop theatres (Broadway in Chicago,
Symphony Center, Chicago Shakespeare), Navy Pier, the music rooms from Pilsen
to Uptown, and Rosemont, Ravinia and Bridgeview — with the home teams' seasons
(Bears, Cubs, White Sox, Bulls, Blackhawks, Fire, Sky, Stars) in a Teams view.

Live at **https://chicago.here.events/** once the domain is wired (GitHub
Pages, built by the Actions workflow once a day at noon Central).

The third city on the lqa-events codebase, after Everett: everything that
makes this Chicago's is `site/city.js` (every team, venue, type, default,
share-code registry and string), `site/index.html`, `scripts/fetch-events.mjs`
(the sources), `site/embed.js`, `outlook.json`, `scripts/data/postseason.json`,
the manifest and icons (the city flag's star, rendered from `favicon.svg`).
Everything else is lqa-events' own, byte for byte — copy from there, never edit
here.

## Embed

```html
<div id="chicago-events"></div>
<script src="https://chicago.here.events/embed.js" data-max="8" defer></script>
```

## Sources

- **Ticketmaster Discovery API** — every room by its venue id (every page):
  33 rooms, from the stadiums to the 400-seat clubs. There is no city sweep:
  Ticketmaster lists some 6,000 Chicago events a year and the API stops a
  query at its thousandth, three weeks out. Church events are left out
  (`isChurch`).
- **Seasons** — ESPN for the Bears, Bulls, Fire, Sky and Stars; MLB's stats
  API for the Cubs and White Sox; the NHL's for the Blackhawks
  (`scripts/schedules.mjs`, shared with lqa).

Next to add: the rooms whose shows Ticketmaster never lists (Thalia Hall's
and the Empty Bottle's own box office, the Hideout, the Old Town School), the
Chicago Public Library's BiblioCommons calendar (4,000-odd events a year — a
branch filter first), and the city's festivals.

## Local run

```sh
cp .env.example .env   # TICKETMASTER_API_KEY=…
ALLOW_NO_ARCHIVE=1 node scripts/fetch-events.mjs   # ALLOW_NO_ARCHIVE only until the site has published once
node --test scripts/*.test.mjs
```
