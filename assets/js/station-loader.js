(function () {
  if (location.protocol === 'file:') {
    document.getElementById('result-count').textContent = 'Web preview needed';
    document.getElementById('station-results').textContent = 'Open this page through your website or local preview address. Double-clicking the HTML file cannot reliably load the map or station data.';
    const message = document.getElementById('map-message');
    message.textContent = 'To preview this map, use an http:// or https:// address instead of opening the downloaded HTML file.';
    message.hidden = false;
    document.querySelectorAll('main button, main input').forEach(control => { control.disabled = true; });
    return;
  }
  const script = document.createElement('script');
  script.type = 'module';
  script.src = new URL('stations.mjs', document.currentScript.src).href;
  script.onerror = function () {
    document.getElementById('result-count').textContent = 'Station finder could not load';
    document.getElementById('station-results').textContent = 'Please check your connection and refresh the page.';
  };
  document.head.appendChild(script);
})();
