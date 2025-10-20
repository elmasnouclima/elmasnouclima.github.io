// Weather Underground PWS integration (client-side)
// ⚠️ Seguridad: esta versión expone la API key en el navegador. Úsalo para pruebas.
// Recomendado: luego migrar a un proxy (Netlify Functions o Cloudflare Workers) y ROTAR la clave.

const WU = {
  stationId: "IELMAS44",
  apiKey: "fa484bd110b24b3b884bd110b2fb3bef",
  units: "m" // m=métrico, e=imperial
};

async function wuFetchCurrent() {
  const url = `https://api.weather.com/v2/pws/observations/current?stationId=${WU.stationId}&format=json&units=${WU.units}&apiKey=${WU.apiKey}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`WU error ${r.status}`);
  const data = await r.json();
  return (data.observations && data.observations[0]) ? data.observations[0] : null;
}

function renderCurrent(obs) {
  if (!obs) return;
  const t  = obs.metric?.temp;
  const h  = obs.humidity;
  const ws = obs.metric?.windSpeed;
  const wg = obs.metric?.windGust;
  const pr = obs.metric?.precipRate;
  const p  = obs.metric?.pressure;
  const ts = obs.obsTimeUtc ? new Date(obs.obsTimeUtc + "Z").toLocaleString() : "—";

  const el = document.getElementById("wu-current");
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">
      <div><strong>Temperatura:</strong> ${t ?? "–"} °C</div>
      <div><strong>Humedad:</strong> ${h ?? "–"} %</div>
      <div><strong>Viento:</strong> ${ws ?? "–"} km/h (racha ${wg ?? "–"})</div>
      <div><strong>Lluvia (inst.):</strong> ${pr ?? "–"} mm/h</div>
      <div><strong>Presión:</strong> ${p ?? "–"} hPa</div>
      <div><strong>Hora obs.:</strong> ${ts}</div>
    </div>
  `;
}

async function loadWU() {
  const status = document.getElementById("wu-status");
  try {
    if (status) status.textContent = "Cargando datos…";
    const obs = await wuFetchCurrent();
    renderCurrent(obs);
    if (status) status.textContent = "Actualizado";
  } catch (e) {
    if (status) status.textContent = "No se pudo cargar WU (¿clave/ID? ¿CORS?)";
    console.error(e);
  }
}

window.addEventListener("load", () => {
  const el = document.getElementById("wu-current");
  if (el) loadWU();
});
