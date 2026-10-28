// The city — every fact that makes this calendar Chicago's rather than
// another town's, in one place (2026-10-11: the third city on lqa-events,
// after Everett). The browser (filter.js, app.js) and the build
// (scripts/*.mjs) both read it; nothing else names a venue or a team. The
// shared files (app.js, filter.js, styles.css bar its --v-* hues,
// scripts/*.mjs bar fetch-events.mjs and sources.mjs) are lqa-events' own,
// byte for byte — see README "Sister sites".
//
// Loaded before filter.js (a plain script, so the tests can share it): it
// sets globalThis.LQACity (the name is the shared code's, not the city's).
(function (global) {
  'use strict';

  // The home teams, matched on the event title whatever the venue. Order =
  // the Teams strip, left to right. Per team:
  //   re        the title match
  //   venue     the home building; schedule = the club's own schedule page
  //   sport     keys the strip icon (app.js SPORT_ICONS), the game clock,
  //             the leader categories
  //   colors    [primary, accent] — the season calendar's home cells and
  //             card frames
  //   espn      ESPN's sport/league/team id — every Chicago club is on ESPN,
  //             so the season, the form block, news and transactions all
  //             come from there (schedules.mjs); the baseball seasons come
  //             from MLB's stats API (first-pitch times, the standings) and
  //             the Blackhawks' from the NHL's, as lqa's Mariners and Kraken
  //   division  (baseball) the division rivals by the abbreviations the
  //             schedule carries, for the standings line
  //   club      the club's name on Ticketmaster; news the outlets' feeds;
  //             wiki the article; opens when the season usually starts
  var MLB = function (slug) { return ['https://www.mlb.com/' + slug + '/feeds/news/rss.xml', 'MLB.com']; };
  var TEAMS = [
    { slug: 'bears', label: 'Bears', re: /\bbears\b/i, sport: 'football', venue: 'Soldier Field', colors: ['#0b162a', '#c83803'],
      espn: { sport: 'football', league: 'nfl', id: '3' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png', schedule: 'https://www.chicagobears.com/schedule/',
      club: 'Chicago Bears', opens: 'September', wiki: { title: 'Chicago Bears', startYear: true },
      news: [['https://www.chicagobears.com/rss/news', 'ChicagoBears.com']] },
    { slug: 'cubs', label: 'Cubs', re: /\bcubs\b/i, sport: 'baseball', venue: 'Wrigley Field', colors: ['#0e3386', '#cc3433'],
      espn: { sport: 'baseball', league: 'mlb', id: '16' }, season: { kind: 'mlb', id: 112 }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/chc.png', schedule: 'https://www.mlb.com/cubs/schedule',
      club: 'Chicago Cubs', opens: 'late March', wiki: { title: 'Chicago Cubs' },
      division: ['MIL', 'STL', 'CIN', 'PIT'], // NL Central
      news: [MLB('cubs')] },
    { slug: 'whitesox', label: 'White Sox', re: /white sox/i, sport: 'baseball', venue: 'Rate Field', colors: ['#27251f', '#c4ced4'],
      espn: { sport: 'baseball', league: 'mlb', id: '4' }, season: { kind: 'mlb', id: 145 }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/chw.png', schedule: 'https://www.mlb.com/whitesox/schedule',
      club: 'Chicago White Sox', opens: 'late March', wiki: { title: 'Chicago White Sox' },
      division: ['CLE', 'DET', 'KC', 'MIN'], // AL Central
      news: [MLB('whitesox')] },
    { slug: 'bulls', label: 'Bulls', re: /\bbulls\b/i, sport: 'basketball', venue: 'United Center', colors: ['#ce1141', '#000000'],
      espn: { sport: 'basketball', league: 'nba', id: '4' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png', schedule: 'https://www.nba.com/bulls/schedule',
      club: 'Chicago Bulls', opens: 'late October', wiki: { title: 'Chicago Bulls' } },
    { slug: 'blackhawks', label: 'Blackhawks', re: /blackhawks/i, sport: 'hockey', venue: 'United Center', colors: ['#cf0a2c', '#000000'],
      espn: { sport: 'hockey', league: 'nhl', id: '4' }, season: { kind: 'nhl', abbrev: 'CHI' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/chi.png', schedule: 'https://www.nhl.com/blackhawks/schedule',
      club: 'Chicago Blackhawks', opens: 'early October', wiki: { title: 'Chicago Blackhawks' } },
    { slug: 'fire', label: 'Fire', re: /chicago fire/i, sport: 'soccer', venue: 'Soldier Field', colors: ['#ff0000', '#141414'],
      espn: { sport: 'soccer', league: 'usa.1', id: '182' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/182.png', schedule: 'https://www.chicagofirefc.com/schedule/',
      club: 'Chicago Fire', opens: 'late February', wiki: { title: 'Chicago Fire FC' } },
    { slug: 'sky', label: 'Sky', re: /chicago sky/i, sport: 'basketball', venue: 'Wintrust Arena', colors: ['#418fde', '#ffcd00'],
      espn: { sport: 'basketball', league: 'wnba', id: '19' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/chi.png', schedule: 'https://sky.wnba.com/schedule/',
      club: 'Chicago Sky', opens: 'May', wiki: { title: 'Chicago Sky' } },
    // NWSL; the Red Stars until the 2025 rename (the title match keeps both)
    { slug: 'stars', label: 'Stars', re: /chicago stars|red stars/i, sport: 'soccer', venue: 'SeatGeek Stadium', colors: ['#41b6e6', '#c8102e'],
      espn: { sport: 'soccer', league: 'usa.nwsl', id: '15360' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/15360.png', schedule: 'https://www.chicagostarsfc.com/schedule/',
      club: 'Chicago Stars FC', opens: 'March', wiki: { title: 'Chicago Stars FC' } },
  ];

  // The venues, one record each — downtown and the stadiums first by size,
  // then the music rooms and the suburbs. Per venue:
  //   capacity how many people the place holds
  //   area     'town' for the music rooms across the city and the suburban
  //            houses (the panel's second group); absent = downtown and
  //            the stadiums
  //   type     the event type when the title decides nothing
  //   cssVar   the hue styles.css sets for it (dark block --v-*); color
  //            the same hue as a value, for the series graph
  //   url      the venue's own events listing — not a ticket vendor
  //   icon     a mark for listings without a team crest
  //   tm       its Ticketmaster Discovery listing (fetch-events.mjs reads
  //            the venue by id — every page). There is NO city sweep here:
  //            Ticketmaster lists 6,000-odd Chicago events a year and the
  //            API stops a query at its thousandth, three weeks out
  //   alias    the other spellings the feeds use for it, folded to this name
  // No festivals yet, so the panel's Festivals group folds away (app.js).
  var VENUES = {
    // --- Downtown and the stadiums: the city's own big rooms, the Loop theatres, Navy Pier ---
    'United Center': {
      geo: [41.88124, -87.67427],
      capacity: 23500,
      type: 'concert',
      cssVar: '--v-uc',
      color: '#ea8686',
      url: 'https://www.unitedcenter.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.unitedcenter.com&sz=128',
      tm: { id: 'KovZpa2M7e', match: 'united center', fallbackUrl: 'https://www.unitedcenter.com/events/', exclude: /parking|tour/i },
      alias: /united center/i,
    },
    'Soldier Field': {
      geo: [41.86205, -87.61682],
      capacity: 61500,
      type: 'sports',
      cssVar: '--v-soldier',
      color: '#86a3ea',
      url: 'https://www.soldierfield.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.soldierfield.com&sz=128',
      tm: { id: 'KovZpZAF6tIA', match: 'soldier field', fallbackUrl: 'https://www.soldierfield.com/events', exclude: /parking|stadium tour/i },
      feed: { kind: 'cards', secondary: true, url: 'https://www.soldierfield.com/events', drop: /parking|\bvs\.?\s/i, // the stadium's own list (Carbonhouse: the first six cards; games come from the Teams schedules, parking is not an event), secondary behind Ticketmaster (2026-10-27)
        item: /<div class="eventItem entry/, title: /<h3 class="title[^"]*">\s*<a href="([^"]+)"[^>]*>([^<]+)</, when: /<span class="m-date__month">([^<]*)<\/span><span class="m-date__day">([^<]*)<\/span><span class="m-date__year">([^<]*)<\/span>/ },
      alias: /soldier field/i,
    },
    'Wrigley Field': {
      geo: [41.9473, -87.65645],
      capacity: 41649,
      type: 'sports',
      cssVar: '--v-wrigley',
      color: '#c0ea86',
      url: 'https://www.mlb.com/cubs/schedule',
      icon: 'https://www.google.com/s2/favicons?domain=www.mlb.com&sz=128',
      tm: { id: 'KovZpZAFlktA', match: 'wrigley field', fallbackUrl: 'https://www.mlb.com/cubs/schedule', exclude: /parking|rooftop/i },
      alias: /wrigley field/i,
    },
    'Rate Field': {
      geo: [41.83088, -87.63519],
      capacity: 40615,
      type: 'sports',
      cssVar: '--v-rate',
      color: '#ea86dd',
      url: 'https://www.mlb.com/whitesox/schedule',
      icon: 'https://www.google.com/s2/favicons?domain=www.mlb.com&sz=128',
      tm: { id: 'KovZpaFPJe', match: 'rate field', fallbackUrl: 'https://www.mlb.com/whitesox/schedule', exclude: /parking/i },
      alias: /rate field/i,
    },
    'Wintrust Arena': {
      geo: [41.85308, -87.62201],
      capacity: 10387,
      type: 'sports',
      cssVar: '--v-wintrust',
      color: '#86ead9',
      url: 'https://www.wintrustarena.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.wintrustarena.com&sz=128',
      tm: { id: 'KovZ917A2S0', match: 'wintrust arena', fallbackUrl: 'https://www.wintrustarena.com/events' },
      alias: /wintrust arena/i,
    },
    'Credit Union 1 Arena': {
      geo: [41.87509, -87.65682],
      capacity: 9500,
      type: 'concert',
      cssVar: '--v-cu1',
      color: '#eabc86',
      url: 'https://www.cu1arena.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.cu1arena.com&sz=128',
      tm: { id: 'KovZpa2Bpe', match: 'credit union 1', fallbackUrl: 'https://www.cu1arena.com/events' },
      alias: /credit union 1|uic pavilion/i,
    },
    'Huntington Bank Pavilion': {
      geo: [41.86426, -87.60884],
      capacity: 30000,
      type: 'concert',
      cssVar: '--v-pavilion',
      color: '#9f86ea',
      url: 'https://www.pavilionnortherlyisland.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.pavilionnortherlyisland.com&sz=128',
      tm: { id: 'KovZpZAEA7IA', match: 'huntington bank pavilion', fallbackUrl: 'https://www.pavilionnortherlyisland.com/events' },
      feed: { kind: 'cards', secondary: true, url: 'https://www.pavilionnortherlyisland.com/events/', // the pavilion's own list (next season's cards: month and day, no year, no clock), secondary behind Ticketmaster (2026-10-27)
        item: /<div class="card" data-aos/, title: /(?=[\s\S]*?<a href="([^"]+)" class="btn btn-outline")(?=[\s\S]*?<h5 class="title">([^<]*)<)/, when: /<p class="month">([^<]*)<\/p>\s*<p class="day">([^<]*)</ },
      alias: /huntington bank pavilion|northerly island/i,
    },
    'Navy Pier': {
      geo: [41.89155, -87.60883],
      capacity: 5000,
      type: 'community',
      cssVar: '--v-navypier',
      color: '#8aea86',
      url: 'https://navypier.org/events/',
      icon: 'https://www.google.com/s2/favicons?domain=navypier.org&sz=128',
      tm: { id: 'KovZpabk8e', match: 'navy pier', fallbackUrl: 'https://navypier.org/events/' },
      alias: /navy pier/i,
    },
    'The Chicago Theatre': {
      geo: [41.88537, -87.62746],
      capacity: 3600,
      type: 'concert',
      cssVar: '--v-chitheatre',
      color: '#ea86a7',
      url: 'https://www.msg.com/the-chicago-theatre',
      icon: 'https://www.google.com/s2/favicons?domain=www.msg.com&sz=128',
      tm: { id: 'KovZpZA6AJ6A', match: 'the chicago theatre', fallbackUrl: 'https://www.msg.com/the-chicago-theatre', exclude: /tour experience/i },
      feed: { kind: 'cards', secondary: true, url: 'https://www.msg.com/the-chicago-theatre', // MSG's venue page (its "Upcoming Events" strip, a handful of cards), secondary behind Ticketmaster (2026-10-27)
        item: /class="VenueEventList_venue-event-item__/, title: /<h3><a class="title-link" href="([^"]+)">([^<]*)</, when: /<h4>([A-Z][a-z]{2}, [A-Z][a-z]{2} \d{1,2}, \d{4})(?:<!-- -->)?(?: - ([^<]*))?<\/h4>/ },
      alias: /chicago theatre/i,
    },
    'Cadillac Palace': {
      geo: [41.88438, -87.63288],
      capacity: 2300,
      type: 'arts',
      cssVar: '--v-cadillac',
      color: '#86c4ea',
      url: 'https://www.broadwayinchicago.com/shows/',
      icon: 'https://www.google.com/s2/favicons?domain=www.broadwayinchicago.com&sz=128',
      tm: { id: 'KovZpZAFAJkA', match: 'cadillac palace', fallbackUrl: 'https://www.broadwayinchicago.com/shows/' },
      alias: /cadillac palace/i,
    },
    'CIBC Theatre': {
      geo: [41.88069, -87.62838],
      capacity: 1800,
      type: 'arts',
      cssVar: '--v-cibc',
      color: '#e1ea86',
      url: 'https://www.broadwayinchicago.com/shows/',
      icon: 'https://www.google.com/s2/favicons?domain=www.broadwayinchicago.com&sz=128',
      tm: { id: 'KovZpZA6AJAA', match: 'cibc theatre', fallbackUrl: 'https://www.broadwayinchicago.com/shows/' },
      alias: /cibc theat/i,
    },
    'Nederlander Theatre': {
      geo: [41.88461, -87.62875],
      capacity: 2250,
      type: 'arts',
      cssVar: '--v-nederlander',
      color: '#d586ea',
      url: 'https://www.broadwayinchicago.com/shows/',
      icon: 'https://www.google.com/s2/favicons?domain=www.broadwayinchicago.com&sz=128',
      tm: { id: 'KovZpZAFAJ7A', match: 'nederlander', fallbackUrl: 'https://www.broadwayinchicago.com/shows/' },
      alias: /nederlander/i,
    },
    'Chicago Shakespeare': {
      geo: [41.89144, -87.60575],
      capacity: 850,
      type: 'arts',
      cssVar: '--v-shakes',
      color: '#86eab7',
      url: 'https://www.chicagoshakes.com/plays-and-events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.chicagoshakes.com&sz=128',
      tm: { id: 'KovZpZAEk1lA', match: 'chicago shakespeare', fallbackUrl: 'https://www.chicagoshakes.com/plays-and-events/' },
      alias: /chicago shakespeare|the yard at/i,
    },
    'Symphony Center': {
      geo: [41.87927, -87.62519],
      capacity: 2522,
      type: 'arts',
      cssVar: '--v-cso',
      color: '#ea9a86',
      url: 'https://chicagosymphony.org/',
      icon: 'https://www.google.com/s2/favicons?domain=cso.org&sz=128',
      tm: { id: 'KovZ917AVba', match: 'symphony center', fallbackUrl: 'https://chicagosymphony.org/' },
      alias: /symphony center|chicago symphony/i,
    },
    // --- Music rooms and the suburbs (`area: 'town'`): the clubs and ballrooms from Pilsen to Uptown, then Rosemont, Ravinia and Bridgeview ---
    'The Salt Shed': {
      geo: [41.9063, -87.659],
      area: 'town',
      capacity: 3600,
      type: 'concert',
      cssVar: '--v-saltshed',
      color: '#868eea',
      url: 'https://www.saltshedchicago.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.saltshedchicago.com&sz=128',
      tm: { id: 'KovZ917AI5F', match: 'salt shed', fallbackUrl: 'https://www.saltshedchicago.com/' },
      alias: /salt shed/i,
    },
    'Aragon Ballroom': {
      geo: [41.96942, -87.65797],
      area: 'town',
      capacity: 5000,
      type: 'concert',
      cssVar: '--v-aragon',
      color: '#abea86',
      url: 'https://www.aragonballroom.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.aragonballroom.com&sz=128',
      tm: { id: 'KovZpZAFdJnA', match: 'aragon', fallbackUrl: 'https://www.aragonballroom.com/' },
      alias: /aragon/i,
    },
    'Riviera Theatre': {
      geo: [41.96886, -87.6597],
      area: 'town',
      capacity: 2500,
      type: 'concert',
      cssVar: '--v-riviera',
      color: '#ea86c8',
      url: 'https://www.rivieratheatre.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.rivieratheatre.com&sz=128',
      tm: { id: 'KovZpZAan6kA', match: 'riviera', fallbackUrl: 'https://www.rivieratheatre.com/', secondary: true }, // Ticketmaster, read behind the venue's own listing — every venue both ways (Steve, 2026-10-26)
      feed: { kind: 'cards', url: 'https://www.jamusa.com/venues/riviera-theatre', venues: /riviera/i, // Jam Productions' own listing (Carbonhouse), leading — Ticketmaster secondary (2026-10-27)
        item: /<div class="eventItem entry/, title: /<h3 class="title[^"]*">\s*<a href="([^"]+)"[^>]*>([^<]+)</, when: /aria-label="([A-Za-z]+\s+\d{1,2} \d{4})"(?:[\s\S]*?class="time">\s*(?:Doors: [^/<]*\/\s*)?(?:Show: )?([^<]*)<)?/, place: /class="location[^"]*">\s*([^<]*?)\s*</ },
      alias: /riviera theat/i,
    },
    'Metro': {
      geo: [41.94992, -87.65896],
      area: 'town',
      capacity: 1100,
      type: 'concert',
      cssVar: '--v-metro',
      color: '#86e6ea',
      url: 'https://metrochicago.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=metrochicago.com&sz=128',
      tm: { id: 'KovZpaoMXe', match: 'metro', fallbackUrl: 'https://metrochicago.com/events/', secondary: true }, // Ticketmaster, read behind the venue's own listing — every venue both ways (Steve, 2026-10-26)
      feed: { kind: 'cards', url: 'https://metrochicago.com/events/', venues: /^metro$/i, // the club's own listing (Rockhouse Partners; Smartbar and GMan cards kept out), leading — Ticketmaster secondary (2026-10-27)
        item: /class = "col-12 eventWrapper rhpSingleEvent/, title: /id = "eventTitle" class="url" href="([^"]+)"[^>]*>\s*<h2[^>]*>([\s\S]*?)<\/h2>/, when: /singleEventDate[^"]*">\s*([^<]*?)\s*<\/div>(?:[\s\S]*?rhp-event__time-text--list">\s*(?:Doors: [^/<]*\/\/\s*)?(?:Show: )?([^<]*)<)?/, place: /class="venueLink"[^>]*>([^<]*)</ },
      alias: /^metro(?: chicago)?$/i,
    },
    'House of Blues': {
      geo: [41.88812, -87.62932],
      area: 'town',
      capacity: 1300,
      type: 'concert',
      cssVar: '--v-hob',
      color: '#ead086',
      url: 'https://www.houseofblues.com/chicago',
      icon: 'https://www.google.com/s2/favicons?domain=www.houseofblues.com&sz=128',
      tm: { id: 'KovZpZAEAIlA', match: 'house of blues', fallbackUrl: 'https://www.houseofblues.com/chicago' },
      feed: { kind: 'jsonld', secondary: true, url: 'https://chicago.houseofblues.com/shows', at: /house of blues/i }, // the club's own shows page (schema.org events, restaurant sets included), secondary behind Ticketmaster (2026-10-27)
      alias: /house of blues/i,
    },
    'Thalia Hall': {
      geo: [41.85773, -87.65732],
      area: 'town',
      capacity: 800,
      type: 'concert',
      cssVar: '--v-thalia',
      color: '#b386ea',
      url: 'https://www.thaliahallchicago.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.thaliahallchicago.com&sz=128',
      tm: { id: 'KovZpZAJntvA', match: 'thalia hall', fallbackUrl: 'https://www.thaliahallchicago.com/' },
      alias: /thalia hall/i,
    },
    'Vic Theatre': {
      geo: [41.93954, -87.6538],
      area: 'town',
      capacity: 1400,
      type: 'concert',
      cssVar: '--v-vic',
      color: '#86ea96',
      url: 'https://www.victheatre.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.victheatre.com&sz=128',
      tm: { id: 'KovZpZA17AEA', match: 'vic theatre', fallbackUrl: 'https://www.victheatre.com/', secondary: true }, // Ticketmaster, read behind the venue's own listing — every venue both ways (Steve, 2026-10-26)
      feed: { kind: 'cards', url: 'https://www.jamusa.com/venues/the-vic', venues: /\bvic\b/i, // Jam Productions' own listing (Carbonhouse), leading — Ticketmaster secondary (2026-10-27)
        item: /<div class="eventItem entry/, title: /<h3 class="title[^"]*">\s*<a href="([^"]+)"[^>]*>([^<]+)</, when: /aria-label="([A-Za-z]+\s+\d{1,2} \d{4})"(?:[\s\S]*?class="time">\s*(?:Doors: [^/<]*\/\s*)?(?:Show: )?([^<]*)<)?/, place: /class="location[^"]*">\s*([^<]*?)\s*</ },
      alias: /\bvic theat/i,
    },
    'Radius': {
      geo: [41.8466, -87.626],
      area: 'town',
      capacity: 3800,
      type: 'concert',
      cssVar: '--v-radius',
      color: '#ea8692',
      url: 'https://www.radius-chicago.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.radius-chicago.com&sz=128',
      tm: { id: 'Z7r9jZa77B', match: 'radius', fallbackUrl: 'https://www.radius-chicago.com/' },
      alias: /^radius\b/i,
    },
    'Concord Music Hall': {
      geo: [41.91871, -87.68989],
      area: 'town',
      capacity: 1500,
      type: 'concert',
      cssVar: '--v-concord',
      color: '#86b0ea',
      url: 'https://www.concordmusichall.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.concordmusichall.com&sz=128',
      tm: { id: 'KovZpZAJtF7A', match: 'concord music hall', fallbackUrl: 'https://www.concordmusichall.com/', secondary: true }, // Ticketmaster, read behind the venue's own listing — every venue both ways (Steve, 2026-10-26)
      feed: { kind: 'cards', url: 'https://concordmusichall.com/', // the hall's own calendar (doors clock), leading — Ticketmaster secondary (2026-10-27)
        item: /<article class="show columns/, title: /<a href="([^"]+)">\s*<div class="inner">[\s\S]*?<h1>([^<]*)/, when: /<p class="doors">Doors @ ([^<]*)<\/p>[\s\S]*?<p class="date">([^<]*)<\/p>|<p class="date">([^<]*)<\/p>/ },
      alias: /concord music hall/i,
    },
    'Park West': {
      geo: [41.91844, -87.63739],
      area: 'town',
      capacity: 750,
      type: 'concert',
      cssVar: '--v-parkwest',
      color: '#cdea86',
      url: 'https://www.parkwestchicago.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.parkwestchicago.com&sz=128',
      tm: { id: 'KovZpZAan6AA', match: 'park west', fallbackUrl: 'https://www.parkwestchicago.com/', secondary: true }, // Ticketmaster, read behind the venue's own listing — every venue both ways (Steve, 2026-10-26)
      feed: { kind: 'cards', url: 'https://www.jamusa.com/venues/park-west', venues: /park west/i, // Jam Productions' own listing (Carbonhouse; AXS is the box office), leading — Ticketmaster secondary (2026-10-27)
        item: /<div class="eventItem entry/, title: /<h3 class="title[^"]*">\s*<a href="([^"]+)"[^>]*>([^<]+)</, when: /aria-label="([A-Za-z]+\s+\d{1,2} \d{4})"(?:[\s\S]*?class="time">\s*(?:Doors: [^/<]*\/\s*)?(?:Show: )?([^<]*)<)?/, place: /class="location[^"]*">\s*([^<]*?)\s*</ },
      alias: /^park west$/i,
    },
    'Lincoln Hall': {
      geo: [41.926, -87.64963],
      area: 'town',
      capacity: 500,
      type: 'concert',
      cssVar: '--v-lincoln',
      color: '#e986ea',
      url: 'https://lh-st.com/',
      icon: 'https://www.google.com/s2/favicons?domain=lh-st.com&sz=128',
      tm: { id: 'KovZpZAdldtA', match: 'lincoln hall', fallbackUrl: 'https://lh-st.com/', secondary: true }, // Ticketmaster, read behind the venue's own listing — every venue both ways (Steve, 2026-10-26)
      feed: { kind: 'cards', url: 'https://lh-st.com/', venues: /^lincoln hall$/i, // the club's own listing (Tessera; Schubas' cards kept out), leading — Ticketmaster secondary (2026-10-27)
        item: /<div class="card mb-3 h-100 tessera-show-card"/, title: /<a href="([^"]+)">\s*<h4 class="card-title">([^<]*)</, when: /<span class="date">([^<]*)<\/span>(?:[\s\S]*?tessera-showTime">Show <b>([^<]*)<)?/, place: /tessera-venue">[\s\S]*?<\/i>\s*([^<]*?)\s*</ },
      alias: /lincoln hall/i,
    },
    'Bottom Lounge': {
      geo: [41.88528, -87.66173],
      area: 'town',
      capacity: 700,
      type: 'concert',
      cssVar: '--v-bottom',
      color: '#86eacc',
      url: 'https://bottomlounge.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=bottomlounge.com&sz=128',
      tm: { id: 'KovZpaoyCe', match: 'bottom lounge', fallbackUrl: 'https://bottomlounge.com/events/' },
      feed: { kind: 'cards', secondary: true, url: 'https://bottomlounge.com/events/', // the club's own listing (TicketWeb links; the date and clock sit in each link's aria-label), secondary behind Ticketmaster (2026-10-27)
        item: /<li class="event-row">/, title: /<a href="([^"]+)" class="event-row-link"[\s\S]*?<h3>([^<]*)<\/h3>/, when: /aria-label="[^"]*?, [A-Z]{3} ([A-Z]{3} \d{1,2})(?:, (\d{1,2}(?::\d{2})? ?[ap]m))?/ },
      alias: /bottom lounge/i,
    },
    'Ramova Theatre': {
      geo: [41.83031, -87.64622],
      area: 'town',
      capacity: 1800,
      type: 'concert',
      cssVar: '--v-ramova',
      color: '#eaaf86',
      url: 'https://www.ramovatheatre.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.ramovatheatre.com&sz=128',
      tm: { id: 'KovZ917ARPG', match: 'ramova', fallbackUrl: 'https://www.ramovatheatre.com/', exclude: /vip upgrade|early entry/i, secondary: true }, // Ticketmaster, read behind the venue's own listing — every venue both ways (Steve, 2026-10-26)
      feed: { kind: 'cards', url: 'https://www.ramovachicago.com/', // the theatre's own Webflow calendar (Tixr box office; door clock), leading — Ticketmaster secondary (2026-10-27)
        item: /role="listitem" class="ca-info w-dyn-item"/, title: /<a href="([^"]+)"[^>]*class="cal-container-2[\s\S]*?class="b-show-2">([^<]*)</, when: /class="b-venue-2 date">([A-Z][a-z]{2} \d{1,2})<(?:[\s\S]*?DOOR time:<\/p><p class="b-venue-2 date">([^<]*)<)?/ },
      alias: /ramova/i,
    },
    'Reggies': {
      geo: [41.85399, -87.62706],
      area: 'town',
      capacity: 400,
      type: 'concert',
      cssVar: '--v-reggies',
      color: '#9286ea',
      url: 'https://www.reggieslive.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.reggieslive.com&sz=128',
      tm: { id: 'KovZpZAdEl6A', match: 'reggies', fallbackUrl: 'https://www.reggieslive.com/' },
      feed: { kind: 'cards', secondary: true, url: 'https://www.reggieslive.com/', // the club's own listing (first page; Rock Club + Music Joint), secondary behind Ticketmaster (2026-10-27)
        item: /<article id="show-/, title: /<a href="([^"]+)" class="expandshow" title="([^"]+)"/, when: /<time datetime="(\d{4}-\d{2}-\d{2})">(?:[\s\S]*?<li>([^<]*?) Show<\/li>|[\s\S]*?<ul class="details">\s*<li>(\d{1,2}:\d{2} [ap]m)<\/li>)?/ }, // the "7:00 pm Show" clock, else the doors clock when that is all a card prints
      alias: /reggies/i,
    },
    'Chop Shop': {
      geo: [41.91016, -87.67877],
      area: 'town',
      capacity: 500,
      type: 'concert',
      cssVar: '--v-chopshop',
      color: '#97ea86',
      url: 'https://chopshopchi.com/calendar/',
      icon: 'https://www.google.com/s2/favicons?domain=chopshopchi.com&sz=128',
      tm: { id: 'KovZ917AQBU', match: 'chop shop', fallbackUrl: 'https://chopshopchi.com/calendar/' },
      alias: /chop shop/i,
    },
    'Allstate Arena': {
      geo: [42.00499, -87.8875],
      area: 'town',
      capacity: 18500,
      type: 'concert',
      cssVar: '--v-allstate',
      color: '#ea86b4',
      url: 'https://www.allstatearena.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.allstatearena.com&sz=128',
      tm: { id: 'KovZpa2MCe', match: 'allstate arena', fallbackUrl: 'https://www.allstatearena.com/events', exclude: /parking/i },
      feed: { kind: 'cards', secondary: true, url: 'https://rosemont.com/allstate/', // the village's own page (Breakdance loop, first ten), secondary behind Ticketmaster (2026-10-27)
        item: /<article class="bde-loop-item ee-post">/, title: /(?=[\s\S]*?href="(https:\/\/rosemont\.com\/allstate\/event\/[^"]+)")(?=[\s\S]*?<h[2-6] class="[^"]*bde-heading[^"]*">(?!\s*\d{1,2}:\d{2} ?[AP]M\s*<)\s*([^<]*?)\s*<\/h[2-6]>)/, when: /bde-code-block[^>]*>\s*([^<]*?)\s*<\/div>(?:[\s\S]*?<h[2-6][^>]*>\s*(\d{1,2}:\d{2} ?[AP]M)\s*<)?/ }, // the date in a code block, then a heading with the clock, then one with the title (h3/h4/h5 by page)
      alias: /allstate arena/i,
    },
    'Rosemont Theatre': {
      geo: [41.97664, -87.86369],
      area: 'town',
      capacity: 4400,
      type: 'concert',
      cssVar: '--v-rosemont',
      color: '#86d1ea',
      url: 'https://rosemont.com/theatre/',
      icon: 'https://www.google.com/s2/favicons?domain=www.rosemonttheatre.com&sz=128',
      tm: { id: 'KovZpa2BOe', match: 'rosemont theatre', fallbackUrl: 'https://rosemont.com/theatre/' },
      feed: { kind: 'cards', secondary: true, url: 'https://rosemont.com/theatre/', // the village's own page (Breakdance loop, first ten), secondary behind Ticketmaster (2026-10-27)
        item: /<article class="bde-loop-item ee-post">/, title: /(?=[\s\S]*?href="(https:\/\/rosemont\.com\/theatre\/event\/[^"]+)")(?=[\s\S]*?<h[2-6] class="[^"]*bde-heading[^"]*">(?!\s*\d{1,2}:\d{2} ?[AP]M\s*<)\s*([^<]*?)\s*<\/h[2-6]>)/, when: /bde-code-block[^>]*>\s*([^<]*?)\s*<\/div>(?:[\s\S]*?<h[2-6][^>]*>\s*(\d{1,2}:\d{2} ?[AP]M)\s*<)?/ }, // the date in a code block, then a heading with the clock, then one with the title (h3/h4/h5 by page)
      alias: /rosemont theat/i,
    },
    'Ravinia': {
      geo: [42.15797, -87.77461],
      area: 'town',
      capacity: 18000,
      type: 'concert',
      cssVar: '--v-ravinia',
      color: '#eae586',
      url: 'https://www.ravinia.org/Calendar',
      icon: 'https://www.google.com/s2/favicons?domain=www.ravinia.org&sz=128',
      tm: { id: 'KovZpZAanvEA', match: 'ravinia', fallbackUrl: 'https://www.ravinia.org/Calendar', exclude: /parking/i },
      feed: { kind: 'cards', secondary: true, url: 'https://www.ravinia.org/events', // the festival's own list (Carbonhouse; the winter series, no clocks), secondary behind Ticketmaster (2026-10-27)
        item: /<div class="eventItem entry/, title: /<h3 class="title[^"]*">\s*<a href="([^"]+)"[^>]*>([^<]+)</, when: /<div class="date">\s*([^<]*?)\s*<\/div>/ },
      alias: /ravinia/i,
    },
    'SeatGeek Stadium': {
      geo: [41.76502, -87.8008],
      area: 'town',
      capacity: 20000,
      type: 'sports',
      cssVar: '--v-seatgeek',
      color: '#c886ea',
      url: 'https://www.seatgeekstadium.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.seatgeekstadium.com&sz=128',
      tm: { id: 'KovZpZA6keJA', match: 'seatgeek', fallbackUrl: 'https://www.seatgeekstadium.com/events', exclude: /parking/i },
      feed: { kind: 'tribe', secondary: true, url: 'https://www.seatgeekstadium.com/wp-json/tribe/events/v1/events' }, // the stadium's own calendar (The Events Calendar), secondary behind Ticketmaster (2026-10-27)
      alias: /seatgeek stadium|toyota park/i,
    },
  };

  // The usual view: every room on — nothing here lists nightly bar programs
  var DEFAULT_ON = ['United Center', 'Soldier Field', 'Wrigley Field', 'Rate Field', 'Wintrust Arena', 'Credit Union 1 Arena', 'Huntington Bank Pavilion', 'Navy Pier', 'The Chicago Theatre', 'Cadillac Palace', 'CIBC Theatre', 'Nederlander Theatre', 'Chicago Shakespeare', 'Symphony Center', 'The Salt Shed', 'Aragon Ballroom', 'Riviera Theatre', 'Metro', 'House of Blues', 'Thalia Hall', 'Vic Theatre', 'Radius', 'Concord Music Hall', 'Park West', 'Lincoln Hall', 'Bottom Lounge', 'Ramova Theatre', 'Reggies', 'Chop Shop', 'Allstate Arena', 'Rosemont Theatre', 'Ravinia', 'SeatGeek Stadium'];
  var DEFAULT_OFF = [];
  var PREFS_KNOWN_FROM = null; // no default-off venue yet, so nothing for saved prefs to be told about

  // Event types: every event lands in exactly one, from its flags, title,
  // then venue. The rows the panel shows, in order.
  var TYPES = [
    { key: 'concert', label: 'Concerts', title: 'Live music — stadium tours to club nights' },
    { key: 'sports', label: 'Sports', title: 'Bears, Cubs, White Sox, Bulls, Blackhawks, Fire, Sky and Stars home games' },
    { key: 'arts', label: 'Arts & Theater', title: 'Broadway in Chicago, the CSO, Chicago Shakespeare, comedy, dance' },
    { key: 'community', label: 'Community', title: 'Navy Pier, festivals, family days' },
  ];
  var MOVIE_VENUE = null; // no cinema here

  // Share codes (?f=CODE): REGISTRY is every filterable key in a fixed
  // order and a code is a bitmask over it, so the list is APPEND-ONLY —
  // adding an entry adds a bit and every existing code keeps meaning what
  // it meant; removing or reordering one changes every link out there.
  // 49 slots from the first build: ten base-36 digits.
  var CODE_LENGTH = 10;
  var REGISTRY = [
    ['venue', 'United Center'], ['venue', 'Soldier Field'], ['venue', 'Wrigley Field'], ['venue', 'Rate Field'], ['venue', 'Wintrust Arena'], ['venue', 'Credit Union 1 Arena'], ['venue', 'Huntington Bank Pavilion'], ['venue', 'Navy Pier'], ['venue', 'The Chicago Theatre'], ['venue', 'Cadillac Palace'], ['venue', 'CIBC Theatre'], ['venue', 'Nederlander Theatre'], ['venue', 'Chicago Shakespeare'], ['venue', 'Symphony Center'], ['venue', 'The Salt Shed'], ['venue', 'Aragon Ballroom'], ['venue', 'Riviera Theatre'], ['venue', 'Metro'], ['venue', 'House of Blues'], ['venue', 'Thalia Hall'], ['venue', 'Vic Theatre'], ['venue', 'Radius'], ['venue', 'Concord Music Hall'], ['venue', 'Park West'], ['venue', 'Lincoln Hall'], ['venue', 'Bottom Lounge'], ['venue', 'Ramova Theatre'], ['venue', 'Reggies'], ['venue', 'Chop Shop'], ['venue', 'Allstate Arena'], ['venue', 'Rosemont Theatre'], ['venue', 'Ravinia'], ['venue', 'SeatGeek Stadium'],
    ['badge', 'concert'], ['badge', 'sports'], ['badge', 'arts'], ['badge', 'community'],
    ['team', 'bears'], ['team', 'cubs'], ['team', 'whitesox'], ['team', 'bulls'], ['team', 'blackhawks'], ['team', 'fire'], ['team', 'sky'], ['team', 'stars'],
    ['cap', 'stadium'], ['cap', 'arena'], ['cap', 'hall'], ['cap', 'room'],
  ];

  // The words the page uses for the place
  var WORDS = {
    teamCity: 'Chicago', // the board drops it from the clubs' names ("Chicago Bears" → Bears)
    presetDefault: 'Every venue — the stadiums, the arenas, the Loop theatres, the music venues and the suburbs — every team and type',
    presetNeighborhood: 'Downtown and the stadiums only',
    presetBig: 'Only the places that hold 2,000 or more — the stadiums, the arenas and the big theatres',
    phrases: { all: 'Showing everything.', none: 'Showing nothing yet — open Filter and pick some venues.', neighborhood: 'Showing downtown and the stadiums only.', big: 'Showing the big venues only — the stadiums, the arenas and the big theatres.' },
  };

  global.LQACity = {
    key: 'chicago',
    name: 'Chicago',
    site: 'https://chicago.here.events/',
    userAgent: 'Mozilla/5.0 (compatible; chicago-events/1.0; +https://chicago.here.events/)',
    tz: 'America/Chicago', tzName: 'Central', // the city's time zone: the ICS feed's TZID, the game clocks, the poster's footer
    state: "Illinois", stateOutline: 'M5.9 9.7L6.1 9.5L6.2 8.9L6.9 8.4L7.3 7.4L7.2 7.0L6.9 6.5L7.3 5.9L8.3 5.7L9.0 5.2L9.2 4.7L9.5 4.3L9.5 3.7L9.3 3.3L8.8 2.9L8.6 2.5L8.1 2.0L10.7 2.0L13.2 2.0L15.7 2.1L18.2 2.1L18.0 3.4L17.7 4.7L16.9 4.7L16.9 6.9L16.9 9.1L16.9 11.2L16.9 13.4L16.7 13.5L16.7 13.9L16.5 14.1L16.8 14.7L16.9 15.4L16.7 15.9L16.5 16.6L16.2 16.8L15.9 17.3L15.7 17.3L15.6 17.6L15.7 17.8L15.5 18.0L15.6 18.1L15.4 18.3L15.4 18.7L15.3 18.8L15.4 19.2L15.2 19.7L15.0 20.3L14.2 20.7L14.2 21.0L14.3 21.5L13.8 21.6L12.6 21.3L12.3 21.8L12.1 21.8L12.0 21.7L11.9 21.8L12.0 21.9L11.9 21.9L11.6 21.6L11.3 20.9L11.5 20.4L11.3 19.9L11.0 19.3L10.0 18.5L9.5 18.1L8.9 17.4L9.1 16.7L9.6 15.4L9.6 15.3L9.3 15.1L8.6 14.9L8.1 14.8L7.4 13.3L6.1 12.0L5.8 11.3L5.8 10.3Z', // the masthead's small state, linking to here.events (scripts/state-outline.mjs, Natural Earth 1:50m)
    // the calendar feed's header; the UID domain never changes (changing it
    // re-creates every event in subscribers' calendars)
    ics: { name: 'Chicago Events', short: 'Chicago Events', teams: 'Chicago home teams — every season', prodid: '-//here.events//chicago-events//EN', uidDomain: 'fosdal.net', // the UID domain the whole family issues (the shared ics test pins it)
      desc: 'Upcoming events around Chicago\\, IL — United Center\\, Soldier Field\\, Wrigley Field\\, the Loop theatres and the music rooms' },
    teams: TEAMS,
    map: { // the Map view (local-map.js; the ground drawn once by scripts/build-local-map.mjs from OpenStreetMap, committed as site/local-map.json) — every city gets one, Steve, 2026-10-26
      kind: 'urban',
      bbox: [41.706, -87.93, 42.217, -87.563], // south, west, north, east — every room, with a margin
      home: [41.802, -87.691, 41.976, -87.589], // the view at first: the city's own rooms; the fit button shows the whole frame
      roads: ['motorway', 'trunk', 'primary'],
      tolerance: 0.8,
      labels: [
        { name: 'Chicago', lat: 41.881, lon: -87.632, anchor: 'middle' },
        { name: 'Rosemont', lat: 41.99413, lon: -87.87567, anchor: 'middle' },
        { name: 'Highland Park', lat: 42.18367, lon: -87.79932, anchor: 'middle' },
        { name: 'Bridgeview', lat: 41.75003, lon: -87.80422, anchor: 'middle' },
      ],
    },
    venues: VENUES,
    defaultOn: DEFAULT_ON,
    defaultOff: DEFAULT_OFF,
    prefsKnownFrom: PREFS_KNOWN_FROM,
    types: TYPES,
    movieVenue: MOVIE_VENUE,
    groundsVenue: null, // every listing is read by room, so nothing arrives under a name city.js lacks
    codeLength: CODE_LENGTH,
    registry: REGISTRY,
    words: WORDS,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
