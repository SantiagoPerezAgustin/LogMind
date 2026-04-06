import { useCallback, useEffect, useState } from "react";
import * as api from "./api";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadOk, setUploadOk] = useState(null);

  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const loadList = useCallback(async () => {
    setListError(null);
    setListLoading(true);
    try {
      const data = await api.listAnalyses();
      setItems(data.items || []);
    } catch (e) {
      const msg =
        e.message === "Failed to fetch"
          ? "Failed to fetch — ¿está la API en marcha? (puerto 3000)"
          : e.message || "No se pudo cargar la lista";
      setListError(msg);
      setItems([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadError(null);
    setUploadOk(null);
    setUploading(true);
    try {
      const data = await api.uploadLog(file);
      setUploadOk(`Subido: ${data.originalName}`);
      await loadList();
      setSelectedId(data.id);
      setDetail(data);
      setDetailError(null);
    } catch (err) {
      setUploadError(err.message || "Error al subir");
    } finally {
      setUploading(false);
    }
  }

  async function selectRow(id) {
    setSelectedId(id);
    setDetail(null);
    setDetailError(null);
    setDetailLoading(true);
    try {
      const data = await api.getAnalysis(id);
      setDetail(data);
    } catch (e) {
      setDetailError(e.message || "Error al cargar detalle");
    } finally {
      setDetailLoading(false);
    }
  }

  const showApiHint =
    (listError && /failed|fetch|network|refused/i.test(listError)) ||
    (uploadError && /failed|fetch|network|refused/i.test(uploadError));

  return (
    <div className="app">
      <div className="bg-blob" aria-hidden />
      <header className="header">
        <div className="logo-mark">LM</div>
        <div>
          <h1>LogMind</h1>
          <p className="subtitle">
            Análisis de logs con insights ·{" "}
            <code className="inline">{api.getApiBase()}</code>
          </p>
        </div>
      </header>

      {showApiHint && (
        <div className="banner-offline" role="alert">
          <strong>No se pudo conectar al backend.</strong> Levantá la API en otra
          terminal:{" "}
          <code className="inline">cd logmind-api</code> →{" "}
          <code className="inline">npm run dev</code> (puerto 3000).
        </div>
      )}

      <section className="card upload-card">
        <h2>Subir archivo</h2>
        <p className="hint">Solo <strong>.log</strong> o <strong>.txt</strong></p>
        <label className="file-btn">
          {uploading ? "Subiendo…" : "Elegir archivo"}
          <input
            type="file"
            accept=".log,.txt,text/plain"
            disabled={uploading}
            onChange={handleFileChange}
          />
        </label>
        {uploadError && <p className="msg err">{uploadError}</p>}
        {uploadOk && <p className="msg ok">{uploadOk}</p>}
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Análisis recientes</h2>
          <button type="button" className="btn-ghost" onClick={loadList}>
            Actualizar
          </button>
        </div>
        {listLoading && <p className="muted">Cargando…</p>}
        {listError && <p className="msg err">{listError}</p>}
        {!listLoading && !listError && items.length === 0 && (
          <p className="muted">No hay análisis todavía.</p>
        )}
        {!listLoading && items.length > 0 && (
          <ul className="table">
            <li className="table-row head">
              <span>Archivo</span>
              <span>Fecha</span>
              <span>Líneas</span>
              <span>Errores</span>
            </li>
            {items.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  className={`table-row ${selectedId === row.id ? "active" : ""}`}
                  onClick={() => selectRow(row.id)}
                >
                  <span className="cell-name">{row.originalName}</span>
                  <span className="muted">
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleString()
                      : "—"}
                  </span>
                  <span>{row.summary?.lineCount ?? "—"}</span>
                  <span>{row.summary?.errorLineCount ?? "—"}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card detail-card">
        <h2>Detalle</h2>
        {!selectedId && (
          <p className="muted">Seleccioná un análisis de la lista.</p>
        )}
        {selectedId && detailLoading && <p className="muted">Cargando…</p>}
        {selectedId && detailError && (
          <p className="msg err">{detailError}</p>
        )}
        {selectedId && detail && !detailLoading && (
          <div className="detail-body">
            <dl className="meta">
              <dt>ID</dt>
              <dd>{detail.id}</dd>
              <dt>Archivo</dt>
              <dd>{detail.originalName}</dd>
              <dt>Tamaño</dt>
              <dd>{detail.size} bytes</dd>
            </dl>
            <h3>Resumen (parser)</h3>
            <pre className="json">{JSON.stringify(detail.summary, null, 2)}</pre>
            <h3>Insight (Mistral)</h3>
            {detail.aiInsight ? (
              <blockquote className="insight">{detail.aiInsight}</blockquote>
            ) : (
              <p className="muted">Sin insight (revisá clave Mistral en la API).</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
