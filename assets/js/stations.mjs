import { findStations, validateData } from './station-utils.mjs';

const $ = selector => document.querySelector(selector);
const results = $('#station-results'), detail = $('#station-detail');
let data = { demo: true, stations: [] }, purpose = 'all', origin = null, selected = null;
let map, layer, positionMarker, positionCircle, visible = [], locationRequest = 0;
const markers = new Map();
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const announceMap = message => { $('#map-message').textContent = message; $('#map-message').hidden = false; };
const status = s => s.status === 'offline' ? 'Station offline' : data.demo ? 'Sample availability' : 'Reported availability';
const inventory = s => s.status === 'offline' ? 'Availability unavailable' : `${s.banks ?? 'Unknown'} power banks · ${s.slots ?? 'Unknown'} return slots`;
const number = s => data.stations.findIndex(item => item.id === s.id) + 1;
function icon(s) {
  return L.divIcon({ className: `map-pin${s.status === 'offline' ? ' offline' : ''}${selected === s.id ? ' selected' : ''}`, html: '<span><svg width="29" height="20" viewBox="0 0 34 22" fill="none" aria-hidden="true"><rect x="2" y="3" width="27" height="16" rx="3" stroke="currentColor" stroke-width="2"/><path d="M31 8v6" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="m18 5-9 8h6l-2 5 10-9h-7l2-4Z" fill="currentColor"/></svg></span>', iconSize: [44,44], iconAnchor: [22,22] });
}
function fit() {
  if (!map || !visible.length) return;
  map.fitBounds(visible.map(s => [s.lat,s.lng]), { padding: [42,42], maxZoom: 14, animate: false });
}
function showDetail(s) {
  detail.replaceChildren();
  if (!s) {
    detail.append(el('p','eyebrow','MAKE YOUR NEXT MOVE'), el('h2','',visible.length ? 'Choose a station to explore.' : 'No matching stations.'), el('p','',visible.length ? 'Select a pin or a station card to see its details.' : 'Try a different city, ZIP or filter.'));
    return;
  }
  detail.append(el('p','eyebrow',data.demo ? 'DEMO LOCATION · NOT AN OPERATING STATION' : status(s)),el('h2','',s.name),el('p','',`${s.area}, ${s.city} ${s.zip}`),el('p','',s.address));
  const stats = el('div','detail-stats');
  for (const [key,label] of [['banks','Power banks'],['slots','Return slots']]) {
    const stat = el('div','detail-stat');
    stat.append(el('strong','',s.status === 'offline' ? '—' : String(s[key] ?? '—')),document.createTextNode(label)); stats.append(stat);
  }
  detail.append(stats,el('p','',s.status === 'offline' ? 'This station is offline. Choose another location.' : data.demo ? 'Sample counts only. No real rentals or returns are available at this demo pin.' : 'Counts are provided station data, not a live feed. Confirm availability before traveling.'));
  if (data.demo) detail.append(el('p','','Directions will be available for confirmed station locations.'));
  else if (s.status === 'online') {
    const directions = el('a','btn btn-primary directions','Get directions ↗');
    directions.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${s.lat},${s.lng}`)}`;
    directions.target = '_blank'; directions.rel = 'noopener noreferrer'; detail.append(directions);
  }
}
function select(id, fromMap = false) {
  selected = id;
  for (const card of results.querySelectorAll('.station-card')) card.setAttribute('aria-pressed',String(card.dataset.id === id));
  for (const s of visible) markers.get(s.id)?.setIcon(icon(s));
  const s = visible.find(item => item.id === id);
  showDetail(s);
  if (s && map) map.setView([s.lat,s.lng],Math.max(map.getZoom(),13),{ animate: false });
  if (fromMap) {
    const card = Array.from(results.children).find(c => c.dataset.id === id);
    if (card) results.scrollTop = card.offsetTop - results.offsetTop;
  }
}
function render() {
  visible = findStations(data.stations,$('#station-search').value,purpose,origin);
  if (!visible.some(s => s.id === selected)) selected = null;
  $('#result-count').textContent = `${visible.length} ${data.demo ? 'demo ' : ''}station${visible.length === 1 ? '' : 's'}${origin ? ' · nearest first' : ''}`;
  results.replaceChildren(); markers.clear(); layer?.clearLayers();
  if (!visible.length) {
    const empty = el('div','empty-state'); empty.append(el('strong','','No stations match.'),document.createTextNode('Try Dallas, Fort Worth, or a different pickup/return filter.')); results.append(empty);
  }
  for (const s of visible) {
    const card = el('button','station-card'); card.type = 'button'; card.dataset.id = s.id;
    card.setAttribute('aria-pressed',String(selected === s.id)); card.setAttribute('aria-controls','station-detail');
    card.append(el('span',`station-status${s.status === 'offline' ? ' offline' : ''}`,`${String(number(s)).padStart(2,'0')} · ${status(s)}`));
    if (s.distance !== null) card.append(el('span','distance',`${s.distance.toFixed(1)} mi`));
    card.append(el('strong','',s.name),el('span','card-area',`${s.area} · ${s.city} ${s.zip}`),el('span','card-inventory',inventory(s)));
    card.addEventListener('click',() => select(s.id)); results.append(card);
    if (map) {
      const marker = L.marker([s.lat,s.lng],{ icon: icon(s), title: s.name, alt: s.name, keyboard: true }).addTo(layer);
      marker.bindTooltip(el('span','',s.name)); marker.on('click',() => select(s.id,true)); markers.set(s.id,marker);
    }
  }
  showDetail(visible.find(s => s.id === selected)); fit();
}
function initMap() {
  if (!/^https?:$/.test(location.protocol)) { announceMap('Open this page through an http:// or https:// web address to load the map.'); return; }
  if (!window.L) { announceMap('The map could not load. You can still search and explore the station list. Check your connection and reload to try the map again.'); return; }
  map = L.map('map',{ scrollWheelZoom:false }).setView([32.85,-97.02],10);
  layer = L.layerGroup().addTo(map);
  const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{ maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
  tiles.once('tileerror',() => {
    map.removeLayer(tiles);
    announceMap('The map provider could not load the street map. Station pins and the searchable list are still available. Try viewing the published page in Safari.');
  });
  $('#show-all').disabled = false;
}
$('#show-all').disabled = true;
$('#show-all').addEventListener('click',fit);
$('#station-search').addEventListener('input',render);
document.querySelectorAll('[data-purpose]').forEach(button => button.addEventListener('click',() => {
  purpose = button.dataset.purpose;
  document.querySelectorAll('[data-purpose]').forEach(b => b.setAttribute('aria-pressed',String(b === button)));
  render();
}));
$('#reset').addEventListener('click',() => {
  $('#station-search').value = ''; purpose = 'all'; selected = null;
  document.querySelectorAll('[data-purpose]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.purpose === 'all')));
  render(); $('#station-search').focus();
});
$('#locate').addEventListener('click',() => {
  const message = $('#location-message');
  if (!navigator.geolocation) { message.textContent = 'This browser does not support location. Search by city or ZIP instead.'; return; }
  const request = ++locationRequest; $('#locate').disabled = true; message.textContent = 'Waiting for your location permission…';
  navigator.geolocation.getCurrentPosition(position => {
    if (request !== locationRequest) return;
    origin = {lat:position.coords.latitude,lng:position.coords.longitude};
    $('#locate').disabled = false; $('#clear-location').hidden = false;
    message.textContent = 'Sorted by distance from your location. Your location is not saved.';
    if (map) {
      if (positionMarker) map.removeLayer(positionMarker);
      if (positionCircle) map.removeLayer(positionCircle);
      positionMarker = L.circleMarker([origin.lat,origin.lng],{radius:7,color:'#fff',fillColor:'#2866b9',fillOpacity:1}).bindTooltip('Your approximate location').addTo(map);
      positionCircle = L.circle([origin.lat,origin.lng],{radius:position.coords.accuracy,color:'#2866b9',weight:1,fillOpacity:.08}).addTo(map);
    }
    render();
  },error => {
    if (request !== locationRequest) return;
    $('#locate').disabled = false;
    message.textContent = error.code === 1 ? 'Location permission was declined. You can still search by city or ZIP.' : 'Your location could not be found. Try again or search by city or ZIP.';
  },{enableHighAccuracy:false,timeout:12000,maximumAge:60000});
});
$('#clear-location').addEventListener('click',() => {
  locationRequest++; origin = null;
  if (positionMarker) { map.removeLayer(positionMarker); positionMarker = null; }
  if (positionCircle) { map.removeLayer(positionCircle); positionCircle = null; }
  $('#clear-location').hidden = true; $('#locate').disabled = false;
  $('#location-message').textContent = 'Location cleared. Search by city, neighborhood or ZIP.'; render();
});
async function start() {
  initMap();
  const controller = new AbortController(), timeout = setTimeout(() => controller.abort(),10000);
  try {
    const response = await fetch('../assets/data/stations.json',{signal:controller.signal});
    if (!response.ok) throw new Error('Station data unavailable');
    data = validateData(await response.json());
    if (!data.demo) {
      $('#data-notice').replaceChildren(el('strong','','STATION DIRECTORY'),el('span','','Availability is provided station data and may change. Live inventory is not connected.'));
      $('#map-label').textContent = 'DALLAS–FORT WORTH';
      $('.locator-footnote').textContent = 'Distance is straight-line distance, not driving distance. Confirm station availability before traveling.';
    }
    render();
  } catch (error) {
    $('#result-count').textContent = 'Stations unavailable';
    results.replaceChildren(el('p','empty-state','Station information could not load. Please refresh the page to try again.'));
    $('#station-search').disabled = true;
    document.querySelectorAll('[data-purpose], #reset, #locate').forEach(b => b.disabled = true);
  } finally { clearTimeout(timeout); }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
