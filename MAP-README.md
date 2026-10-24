# Station finder demo
Upload index.html, find-a-station, and assets from this folder to the root of the existing repository. Commit to main. The page will be at https://paytonjkelley.github.io/power-moves/find-a-station/ after publication.

All locations and counts are demo data, labeled as such. Directions are disabled for demo pins. Search matches listed station names, neighborhoods, cities and ZIP codes; it does not geocode arbitrary addresses. Use my location requests browser permission and sorts by straight-line distance. No location is stored.

Edit assets/data/stations.json to maintain station records. Live inventory is not connected. Do not change demo to false until the records are confirmed. For production also replace the demo page description, remove noindex, and connect inventory before representing counts as live. No API key is required for this demo. Street tiles use OpenStreetMap with visible attribution; this best-effort public service is not a production SLA. Do not remove the referrer policy or preload/download tiles.

Preview using HTTP or HTTPS, not by double-clicking the HTML. Local-file previews are blocked with an explanatory message. Browser privacy tools or network restrictions can still prevent map tiles; use the searchable station list when imagery is unavailable.
