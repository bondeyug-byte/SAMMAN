/* ===== sample-data.js ===== */
/* Backup trip, used only when live map data doesn't respond.
   Everything here is made up. It uses the same format as the live
   OpenStreetMap data, so the scoring code treats both the same way. */

const SAMPLE = (() => {
  const node = (lat, lon, tags) => ({ type: "node", lat, lon, tags });
  const way = (pts, tags) => ({
    type: "way",
    geometry: pts.map(([lat, lon]) => ({ lat, lon })),
    tags,
  });

  return {
    from: { name: "Thāne Station (sample)", lat: 19.1863, lon: 72.9753 },
    to: { name: "Sample destination", lat: 19.2055, lon: 72.9722 },
    routes: [
      { coords: [[19.1863, 72.9753], [19.1895, 72.9745], [19.194, 72.9735], [19.199, 72.973], [19.2055, 72.9722]] },
      { coords: [[19.1863, 72.9753], [19.189, 72.979], [19.195, 72.98], [19.201, 72.977], [19.2055, 72.9722]] },
      { coords: [[19.1863, 72.9753], [19.188, 72.9715], [19.196, 72.97], [19.203, 72.9705], [19.2055, 72.9722]] },
    ],
    elements: [
      // Shops and food
      node(19.189, 72.9789, { shop: "convenience", name: "General store (sample)", opening_hours: "Mo-Su 07:00-23:30" }),
      node(19.192, 72.9796, { amenity: "fast_food", name: "Snack centre (sample)", opening_hours: "Mo-Su 11:00-23:59" }),
      node(19.1985, 72.9786, { shop: "bakery", name: "Bakery (sample)", opening_hours: "Mo-Su 06:00-22:00" }),
      node(19.203, 72.975, { amenity: "cafe", name: "Café (sample)" }),
      node(19.1895, 72.9744, { shop: "clothes", name: "Clothes shop (sample)", opening_hours: "Mo-Sa 10:00-21:00" }),
      node(19.199, 72.9731, { shop: "hardware", name: "Hardware shop (sample)", opening_hours: "Mo-Sa 09:00-19:00" }),
      node(19.188, 72.9716, { shop: "kiosk", name: "Kiosk (sample)" }),
      // Help points
      node(19.1952, 72.9803, { amenity: "police", name: "Police chowki (sample)" }),
      node(19.195, 72.9799, { amenity: "pharmacy", name: "Chemist (sample)", opening_hours: "24/7" }),
      node(19.2015, 72.9772, { amenity: "fuel", name: "Petrol pump (sample)", opening_hours: "24/7" }),
      node(19.1942, 72.9738, { amenity: "hospital", name: "Hospital (sample)" }),
      // Transit
      node(19.1866, 72.975, { railway: "station", name: "Station (sample)" }),
      node(19.1891, 72.9791, { highway: "bus_stop", name: "Bus stop (sample)" }),
      node(19.2011, 72.9771, { highway: "bus_stop", name: "Bus stop (sample)" }),
      node(19.1941, 72.9736, { highway: "bus_stop", name: "Bus stop (sample)" }),
      // Cameras and lamps
      node(19.1951, 72.9801, { man_made: "surveillance" }),
      node(19.1866, 72.9752, { man_made: "surveillance" }),
      node(19.1915, 72.9741, { highway: "street_lamp" }),
      // Roads
      way([[19.189, 72.979], [19.195, 72.98], [19.201, 72.977], [19.2055, 72.9722]], { highway: "primary", lit: "yes" }),
      way([[19.188, 72.9715], [19.196, 72.97], [19.203, 72.9705]], { highway: "residential", lit: "no" }),
    ],
  };
})();

// Illustrative walking directions for the sample routes (made up, like the routes).
SAMPLE.routes[0].steps = [
  { dir: "up", text: "Start on Station Road (sample)", dist: "450 m" },
  { dir: "up", text: "Continue on Market Lane (sample)", dist: "1.1 km" },
  { dir: "left", text: "Turn left onto Lake Street (sample)", dist: "650 m" },
  { dir: "flag", text: "Arrive at your destination", dist: "" },
];
SAMPLE.routes[1].steps = [
  { dir: "up", text: "Start on Station Road (sample)", dist: "400 m" },
  { dir: "left", text: "Turn left onto Park Road (sample)", dist: "1.4 km" },
  { dir: "left", text: "Bear left onto Lake Street (sample)", dist: "800 m" },
  { dir: "flag", text: "Arrive at your destination", dist: "" },
];
SAMPLE.routes[2].steps = [
  { dir: "up", text: "Start on Gully Lane (sample)", dist: "500 m" },
  { dir: "right", text: "Turn right onto Riverside Lane (sample)", dist: "1.6 km" },
  { dir: "right", text: "Turn right onto Lake Street (sample)", dist: "400 m" },
  { dir: "flag", text: "Arrive at your destination", dist: "" },
];

