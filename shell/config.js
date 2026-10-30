/* ===== config.js ===== */
/* SAMMAN settings.
   Change numbers here, not in the other files. Everything shown in
   "How we score routes" is read from this file, so the screen always
   matches the maths. */

const CONFIG = {
  weightsNote:
    "Demo weights adapted from NightWise's scoring. They will be replaced " +
    "with SAMMAN's own survey results.",

  // Each factor earns up to `max` points. The caps add up to 80;
  // the total is then converted to a score out of 100.
  factors: [
    { id: "openPlaces", label: "Open shops and food places", max: 20 },
    { id: "helpPoints", label: "Help nearby (police, hospital, petrol pump)", max: 15 },
    { id: "mainRoads",  label: "Walking on main roads", max: 15 },
    { id: "lighting",   label: "Street lighting", max: 15 },
    { id: "transit",    label: "Bus stops and stations nearby", max: 15 },
  ],

  // An "empty stretch" has no open place or help point within reach.
  gap: { minMetres: 800, basePenalty: 3, penaltyPer100m: 1, maxPenalty: 15 },

  grades: [["A", 80], ["B", 65], ["C", 50], ["D", 35], ["E", 0]],
  closeCall: 5,              // routes this many points apart count as a close call

  unknownWeight: 0.5,        // missing data counts as half, never as full
  alwaysOpen: ["police", "hospital"], // assumed open when hours aren't mapped
  openPlacesPerKmForFullMarks: 6,

  radius: { place: 60, help: 300, mainRoad: 25, light: 30, transit: 250, gapCover: 150 },
  sampleStep: 40,            // check the route every 40 m
  walkingSpeed: 1.25,        // m/s, used only when a route has no time
  timeoutMs: 20000,

  // Street-map pictures. CARTO's free key removes their "API KEY REQUIRED" watermark
  // (free up to 5 million tiles a month). Keys sit in the page's code by design.
  // Leave it empty ("") to skip CARTO and use OpenStreetMap's own pictures instead.
  cartoKey: "cb1_4y63_1_213b72feba2d72e850ea2ce9",

  // Public servers for "what's near the route", tried in this order.
  // The second one's map copy has been months old at times, so the app says when it is used.
  overpassServers: [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
  ],

  exampleTrip: { from: "Thane railway station", to: "Viviana Mall, Thane" },
  educationLink: "https://samman-ten.vercel.app/",
};

/* Only entries confirmed from an official or operator source.
   Cybercrime portal (1930) is left out until confirmed on the official site. */
const HELP_DIRECTORY = [
  {
    name: "Emergency Response Support System",
    group: "In immediate danger",
    purpose: "One number for police, fire and ambulance.",
    contacts: [{ label: "Call 112", dial: "112" }],
    source: "Ministry of Home Affairs ERSS (state ERSS sites, official 112 India app)",
  },
  {
    name: "Women Helpline",
    group: "In immediate danger",
    purpose: "Emergency and non-emergency help for women, linked to police, One Stop Centres, hospitals and legal aid.",
    contacts: [{ label: "Call 181", dial: "181" }],
    source: "Mission Shakti, Ministry of Women and Child Development",
  },
  {
    name: "Child Helpline",
    group: "For children",
    purpose: "Help for any child in distress, or anyone calling on a child's behalf. Emergency calls are passed on to 112.",
    contacts: [{ label: "Call 1098", dial: "1098" }],
    source: "Ministry of Women and Child Development, reply in Lok Sabha, 29 November 2024; Mission Vatsalya child helpline SOP",
  },
  {
    name: "National Commission for Women helpline",
    group: "Talk to someone",
    purpose: "For any woman or girl above 18.",
    contacts: [
      { label: "Call 7827170170", dial: "7827170170" },
      { label: "Short code 14490", dial: "14490" },
    ],
    source: "Press Information Bureau factsheet, 3 July 2026",
  },
  {
    name: "One Stop Centre, Thane (Kalwa)",
    group: "Support centres",
    purpose: "Sakhi centre for women affected by violence: support and referral in one place.",
    contacts: [{ label: "Call 9834245430", dial: "9834245430" }],
    source: "Ministry of Women and Child Development list of One Stop Centres",
    note: "The official list is undated, so numbers may have changed.",
  },
  {
    name: "One Stop Centre, Mumbai (KEM Hospital, Parel)",
    group: "Support centres",
    purpose: "Sakhi centre for women affected by violence: support and referral in one place.",
    contacts: [{ label: "Call 8108740800", dial: "8108740800" }],
    source: "Ministry of Women and Child Development list of One Stop Centres",
    note: "The official list is undated, so numbers may have changed.",
  },
  {
    name: "StopNCII.org",
    group: "Online",
    purpose: "Helps adults stop intimate images being shared on partner platforms.",
    contacts: [{ label: "Open stopncii.org", url: "https://stopncii.org" }],
    source: "StopNCII's own FAQ. Not a government service.",
  },
];

