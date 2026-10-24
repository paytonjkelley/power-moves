export function milesBetween(a, b) {
  const rad = n => n * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}
export function findStations(stations, query, purpose, origin) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return stations.filter(s => terms.every(term => [s.name, s.area, s.city, s.zip, s.address].join(' ').toLowerCase().includes(term)))
    .filter(s => purpose === 'all' || (s.status === 'online' && (purpose === 'rent' ? s.banks > 0 : s.slots > 0)))
    .map(s => ({ ...s, distance: origin ? milesBetween(origin, s) : null }))
    .sort((a, b) => origin ? a.distance - b.distance : a.name.localeCompare(b.name));
}
export function validateData(data) {
  if (!data || typeof data.demo !== 'boolean' || !Array.isArray(data.stations)) throw new Error('Invalid station data');
  const ids = new Set();
  for (const s of data.stations) {
    if (!s.id || ids.has(s.id) || !s.name || !Number.isFinite(s.lat) || !Number.isFinite(s.lng) || Math.abs(s.lat) > 90 || Math.abs(s.lng) > 180 || !['online', 'offline'].includes(s.status)) throw new Error('Invalid station');
    for (const k of ['banks', 'slots']) if (s[k] !== null && (!Number.isInteger(s[k]) || s[k] < 0)) throw new Error('Invalid availability');
    ids.add(s.id);
  }
  return data;
}
