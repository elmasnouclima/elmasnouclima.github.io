
// WU integración con mensajes de depuración en pantalla
const WU = {
  stationId: "IELMAS44",
  apiKey: "fa484bd110b24b3b884bd110b2fb3bef",
  units: "m"
};

function setMsg(txt) {
  const s = document.getElementById("wu-status");
  if (s) s.textContent = txt;
}

async function wuFetchCurrent() {
  const url = `https://api.weather.com/v2/pws/observations/current?stationId=${WU.stationId}&format=json&units=${WU.units}&apiKey=${WU.apiKey}&_=${Date.now()}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`WU HTTP ${r.status}`);
  const data = await r.json();
  if (!data || !data.observations || !data.observations[0]) {
    throw new Error("Respuesta sin observaciones");
  }
  return data.observations[0];
}

function renderCurrent(obs) {
  const el = document.getElementById("wu-current");
  if (!el) { setMsg("No existe el contenedor #wu-current"); return; }

  const t  = obs.metric?.temp ?? "–";
  const h  = obs.humidity ?? "–";
  const ws = obs.metric?.windSpeed ?? "–";
  const wg = obs.metric?.windGust ?? "–";
  const pr = obs.metric?.precipRate ?? "–";
  const p  = obs.metric?.pressure ?? "–";
  const ts = obs.obsTimeUtc ? new Date(obs.obsTimeUtc + "Z").toLocaleString() : "—";

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">
      <div><strong>Temperatura:</strong> ${t} °C</div>
      <div><strong>Humedad:</strong> ${h} %</div>
      <div><strong>Viento:</strong> ${ws} km/h (racha ${wg})</div>
      <div><strong>Lluvia (inst.):</strong> ${pr} mm/h</div>
      <div><strong>Presión:</strong> ${p} hPa</div>
      <div><strong>Hora obs.:</strong> ${ts}</div>
    </div>
  `;
}

async function loadWU() {
  setMsg("Script WU cargado. Pidiendo datos…");
  try {
    const obs = await wuFetchCurrent();
    renderCurrent(obs);
    setMsg("WU OK");
  } catch (e) {
    setMsg("WU error: " + (e?.message || e));
    console.error(e);
  }
}

// Arranque
window.addEventListener("load", () => {
  // Señal visual inmediata en cuanto el script se ejecuta:
  setMsg("Script WU cargado. Preparando fetch…");
  const el = document.getElementById("wu-current");
  if (el) loadWU();
});
