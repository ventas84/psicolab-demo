import { useState, useRef } from "react";

const font = "'DM Sans', -apple-system, sans-serif";

const Card = ({ children, s }) => (
  <div style={{ background: "white", borderRadius: 14, border: "1px solid rgba(0,0,0,0.06)", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)", ...s }}>{children}</div>
);

const Section = ({ children }) => (
  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "2px solid #2563eb", paddingBottom: 8, display: "inline-block" }}>{children}</h3>
);

const Btn = ({ children, onClick, disabled, primary, s }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding: "12px 24px", borderRadius: 10, border: primary ? "none" : "1px solid #d1d5db", background: disabled ? "#e2e8f0" : primary ? "linear-gradient(135deg, #1e40af, #7c3aed)" : "white", color: disabled ? "#94a3b8" : primary ? "white" : "#334155", fontSize: 14, fontWeight: 700, cursor: disabled ? "default" : "pointer", fontFamily: font, ...s }}>{children}</button>
);

function GapBadge({ gap }) {
  const c = gap === 0 ? "#059669" : gap >= -1 ? "#d97706" : "#dc2626";
  return <span style={{ padding: "2px 8px", borderRadius: 6, background: gap === 0 ? "#dcfce7" : gap >= -1 ? "#fef3c7" : "#fee2e2", color: c, fontSize: 11, fontWeight: 700 }}>{gap === 0 ? "Sin brecha" : gap}</span>;
}

function AjusteBadge({ ajuste }) {
  const m = { se_ajusta: ["Se Ajusta", "#dcfce7", "#166534"], con_observaciones: ["Con Obs.", "#fef3c7", "#92400e"], no_se_ajusta: ["No se Ajusta", "#fee2e2", "#991b1b"] };
  const [l, bg, c] = m[ajuste] || m.se_ajusta;
  return <span style={{ padding: "3px 10px", borderRadius: 6, background: bg, color: c, fontSize: 11, fontWeight: 600 }}>{l}</span>;
}

function ResultBadge({ result }) {
  const m = {
    recomendable: ["RECOMENDABLE", "#dcfce7", "#166534"],
    se_ajusta: ["SE AJUSTA", "#dcfce7", "#166534"],
    recomendable_con_observaciones: ["RECOMENDABLE CON OBSERVACIONES", "#fef3c7", "#92400e"],
    se_ajusta_con_observaciones: ["SE AJUSTA CON OBSERVACIONES", "#fef3c7", "#92400e"],
    no_recomendable: ["NO RECOMENDABLE", "#fee2e2", "#991b1b"],
    no_se_ajusta: ["NO SE AJUSTA", "#fee2e2", "#991b1b"],
  };
  const [l, bg, c] = m[result] || ["--", "#f3f4f6", "#374151"];
  return <span style={{ padding: "10px 24px", borderRadius: 10, background: bg, color: c, fontSize: 16, fontWeight: 800 }}>{l}</span>;
}

function FileUpload({ label, hint, value, onChange, fileName, onFileNameChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr("");
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "txt") {
      const text = await file.text();
      onChange(text);
      onFileNameChange(file.name);
      setUploading(false);
      return;
    }
    try {
      const base64 = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result.split(",")[1]);
        reader.onerror = () => rej(new Error("Error leyendo archivo"));
        reader.readAsDataURL(file);
      });
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64, filename: file.name }),
      });
      const data = await response.json();
      if (!response.ok) { setErr(data.error || "Error"); setUploading(false); return; }
      onChange(data.text);
      onFileNameChange(file.name);
    } catch (error) {
      setErr(error.message);
    }
    setUploading(false);
  }

  return (
    <div>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>{label}</label>}
      <div onClick={() => !uploading && inputRef.current?.click()} style={{ border: `2px dashed ${value ? "#059669" : "#d1d5db"}`, borderRadius: 10, padding: value ? "12px 16px" : "24px 16px", textAlign: "center", cursor: uploading ? "wait" : "pointer", background: value ? "#f0fdf4" : "#fafafa" }}
        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#2563eb"; }}
        onDragLeave={e => { e.currentTarget.style.borderColor = value ? "#059669" : "#d1d5db"; }}
        onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = value ? "#059669" : "#d1d5db"; const f = e.dataTransfer.files?.[0]; if (f) handleFile({ target: { files: [f] } }); }}>
        <input ref={inputRef} type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleFile} style={{ display: "none" }} />
        {uploading ? (
          <div style={{ fontSize: 13, color: "#2563eb", fontWeight: 600 }}>Procesando archivo...</div>
        ) : value ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>&#128196;</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#166534" }}>{fileName}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{value.length} caracteres</div>
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); onChange(""); onFileNameChange(""); }} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #d1d5db", background: "white", fontSize: 11, color: "#64748b", cursor: "pointer", fontFamily: font }}>Cambiar</button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>&#128193;</div>
            <div style={{ fontSize: 13, color: "#334155", fontWeight: 600 }}>Arrastra o haz clic para subir</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{hint || "PDF, DOCX o TXT"}</div>
          </div>
        )}
      </div>
      {err && <div style={{ fontSize: 12, color: "#dc2626", marginTop: 6 }}>{err}</div>}
    </div>
  );
}

const FRAMEWORKS = [
  { id: "mutual_jefatura", name: "Jefatura — Mutual de Seguridad", desc: "Competencias corporativas + familia de cargo + específicas", color: "#dc2626" },
  { id: "medico", name: "Profesionales y Especialistas (Médico)", desc: "Competencias transversales + distintivas", color: "#2563eb" },
  { id: "industrial", name: "Operativos e Industriales", desc: "Matriz de ajuste conductual", color: "#059669" },
  { id: "comercial", name: "Comercial y Servicios", desc: "Competencias organizacionales", color: "#7c3aed" },
];

function CompetencyTable({ title, data }) {
  if (!data || !data.length) return null;
  return (
    <Card s={{ marginBottom: 16 }}>
      <Section>{title}</Section>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ background: "#f1f5f9" }}>{["Competencia", "Definición", "Esp.", "Obs.", "Brecha"].map(h => <th key={h} style={{ padding: 10, textAlign: "left", fontWeight: 700, color: "#334155", fontSize: 11, borderBottom: "2px solid #e2e8f0" }}>{h}</th>)}</tr></thead>
          <tbody>{data.map((c, i) => (
            <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
              <td style={{ padding: 10, fontWeight: 600, color: "#1e293b", width: "20%", verticalAlign: "top" }}>{c.nombre}</td>
              <td style={{ padding: 10, color: "#475569", fontSize: 12, lineHeight: 1.5 }}>{c.definicion}</td>
              <td style={{ padding: 10, textAlign: "center", fontWeight: 700, color: "#2563eb", verticalAlign: "top" }}>{c.nivel_esperado}</td>
              <td style={{ padding: 10, textAlign: "center", fontWeight: 700, color: c.nivel_observado < c.nivel_esperado ? "#d97706" : "#059669", verticalAlign: "top" }}>{c.nivel_observado}</td>
              <td style={{ padding: 10, textAlign: "center", verticalAlign: "top" }}><GapBadge gap={c.brecha} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Card>
  );
}

function StrengthsSection({ data }) {
  return (
    <Card s={{ marginBottom: 16 }}>
      <Section>Observaciones del evaluador</Section>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#059669", margin: "0 0 12px" }}>Fortalezas</h4>
          {(data.fortalezas || []).map((f, i) => <div key={i} style={{ fontSize: 12, color: "#334155", lineHeight: 1.7, marginBottom: 14, paddingLeft: 14, borderLeft: "3px solid #dcfce7" }}>{f}</div>)}
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#d97706", margin: "0 0 12px" }}>Aspectos a trabajar</h4>
          {(data.aspectos_mejora || []).map((a, i) => (
            <div key={i} style={{ fontSize: 12, color: "#334155", lineHeight: 1.7, marginBottom: 14, paddingLeft: 14, borderLeft: "3px solid #fef3c7" }}>
              {typeof a === "string" ? a : <><strong>{a.area}:</strong> {a.descripcion}{a.sugerencia && <><br /><br /><em style={{ color: "#64748b" }}>Sugerencia: {a.sugerencia}</em></>}</>}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function App() {
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({ name: "", rut: "", age: "", education: "", position: "", framework: "", lastJob: "", lastCompany: "", lastDates: "" });
  const [transcript, setTranscript] = useState("");
  const [transcriptFile, setTranscriptFile] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobDescFile, setJobDescFile] = useState("");
  const [cvText, setCvText] = useState("");
  const [cvFile, setCvFile] = useState("");
  const [result, setResult] = useState(null);
  const [usedFw, setUsedFw] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const canSubmit = form.name && form.position && form.framework && transcript.length > 100;

  async function handleAnalyze() {
    setStep("loading"); setProgress(0);
    const timer = setInterval(() => setProgress(p => Math.min(p + 1.5, 90)), 300);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, framework: form.framework, position: form.position, candidate: { name: form.name, rut: form.rut, age: form.age, education: form.education }, jobDescription: jobDesc, cvContext: cvText }),
      });
      clearInterval(timer); setProgress(100);
      if (!res.ok) { const e = await res.json(); throw new Error(e.details || e.error); }
      const data = await res.json();
      setResult(data.analysis); setUsedFw(data.framework || form.framework);
      setTimeout(() => setStep("report"), 500);
    } catch (e) { clearInterval(timer); setError(e.message); setStep("error"); }
  }

  function handleReset() { setStep("form"); setResult(null); setError(""); setProgress(0); }

  const Input = ({ label, k, placeholder, gridSpan }) => (
    <div style={gridSpan ? { gridColumn: gridSpan } : {}}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>{label}</label>
      <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={placeholder} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 13, fontFamily: font, boxSizing: "border-box" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", fontFamily: font, background: "#f1f5f9" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`*{box-sizing:border-box;margin:0}body{margin:0}textarea:focus,input:focus,select:focus{outline:none;border-color:#2563eb!important}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(0,0,0,.12);border-radius:3px}`}</style>

      <div style={{ background: "#0f172a", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "white" }}>&#968;</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "white" }}>PsicoLab</div>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 0.5, textTransform: "uppercase" }}>Evaluación Psicolaboral con IA</div>
          </div>
        </div>
        {step === "report" && <Btn onClick={handleReset} s={{ padding: "8px 16px", fontSize: 12 }}>&#8592; Nueva Evaluación</Btn>}
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px" }}>

        {step === "form" && <>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Nueva Evaluación Psicolaboral</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Completa los datos, sube los documentos y genera el informe con IA</p>

          <Card s={{ marginBottom: 20 }}>
            <Section>Datos del postulante</Section>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
              <Input label="Nombre completo *" k="name" placeholder="Roxana Buscaglione" />
              <Input label="RUT" k="rut" placeholder="13.645.412-9" />
              <Input label="Edad" k="age" placeholder="46 años" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <Input label="Formación / Título" k="education" placeholder="Médico Cirujano, U. San Sebastián, 2004" gridSpan="1 / -1" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Input label="Último cargo" k="lastJob" placeholder="Directora Académica" />
              <Input label="Empresa" k="lastCompany" placeholder="Universidad Mayor" />
              <Input label="Fechas" k="lastDates" placeholder="Jul 2024 - Mar 2025" />
            </div>
          </Card>

          <Card s={{ marginBottom: 20 }}>
            <Section>Cargo y formato de informe</Section>
            <div style={{ marginBottom: 16 }}>
              <Input label="Cargo al que postula *" k="position" placeholder="Médico Director" />
            </div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 8 }}>Formato de informe *</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {FRAMEWORKS.map(fw => (
                <div key={fw.id} onClick={() => setForm({ ...form, framework: fw.id })} style={{ padding: 14, borderRadius: 10, border: `2px solid ${form.framework === fw.id ? fw.color : "rgba(0,0,0,0.06)"}`, background: form.framework === fw.id ? fw.color + "08" : "white", cursor: "pointer" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: form.framework === fw.id ? fw.color : "#1e293b" }}>{fw.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{fw.desc}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card s={{ marginBottom: 20 }}>
            <Section>Documentos de contexto</Section>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Sube el descriptor de cargo y CV para que la IA tenga contexto completo</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <FileUpload label="Descriptor de cargo (DCV)" hint="PDF, DOCX o TXT" value={jobDesc} onChange={setJobDesc} fileName={jobDescFile} onFileNameChange={setJobDescFile} />
              <FileUpload label="CV del candidato" hint="PDF, DOCX o TXT" value={cvText} onChange={setCvText} fileName={cvFile} onFileNameChange={setCvFile} />
            </div>
          </Card>

          <Card s={{ marginBottom: 24 }}>
            <Section>Transcripción de la entrevista *</Section>
            <FileUpload label="" hint="Sube la transcripción (TXT, PDF o DOCX)" value={transcript} onChange={t => { setTranscript(t); }} fileName={transcriptFile} onFileNameChange={setTranscriptFile} />
            <div style={{ marginTop: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>O pega directamente:</label>
              <textarea value={transcript} onChange={e => { setTranscript(e.target.value); setTranscriptFile(""); }} placeholder="[00:00:15] Entrevistador: Buenos días..." style={{ width: "100%", minHeight: 160, padding: 14, borderRadius: 10, border: "1px solid #d1d5db", fontSize: 12, fontFamily: "'SF Mono', monospace", lineHeight: 1.7, resize: "vertical", boxSizing: "border-box" }} />
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{transcript.length} caracteres · ~{Math.round(transcript.split(/\s+/).filter(Boolean).length)} palabras</span>
            </div>
          </Card>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Btn onClick={handleAnalyze} disabled={!canSubmit} primary>&#129504; Generar Evaluación Psicolaboral</Btn>
          </div>
        </>}

        {step === "loading" && (
          <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Analizando entrevista con IA...</h2>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 28 }}>{form.name} · {form.position}</p>
            <div style={{ height: 6, borderRadius: 3, background: "#e2e8f0", marginBottom: 32, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, borderRadius: 3, background: "linear-gradient(90deg, #2563eb, #7c3aed)", transition: "width 0.3s" }} />
            </div>
            {["Procesando documentos...", "Analizando CV y descriptor...", `Aplicando: ${FRAMEWORKS.find(f => f.id === form.framework)?.name}...`, "Evaluando competencias...", "Generando informe..."].map((s, i) => {
              const cur = Math.min(Math.floor(progress / 20), 4);
              return <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, opacity: i <= cur ? 1 : 0.25 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: i < cur ? "#22c55e" : i === cur ? "#2563eb" : "#e2e8f0", color: "white", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>{i < cur ? "\u2713" : i + 1}</span>
                <span style={{ fontSize: 14, color: "#334155", fontWeight: i === cur ? 600 : 400 }}>{s}</span>
              </div>;
            })}
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 20 }}>30-90 segundos</p>
          </div>
        )}

        {step === "error" && (
          <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>&#10005;</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Error</h2>
            <p style={{ fontSize: 14, color: "#dc2626", marginBottom: 24 }}>{error}</p>
            <Btn onClick={handleReset} primary>&#8592; Volver</Btn>
          </div>
        )}

        {step === "report" && result && <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>Informe de Evaluación Psicolaboral {usedFw === "mutual_jefatura" ? "Jefatura" : ""}</h1>
              <p style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>{FRAMEWORKS.find(f => f.id === usedFw)?.name}</p>
            </div>
            <Btn onClick={handleReset} s={{ fontSize: 12, padding: "8px 16px" }}>&#8592; Nueva</Btn>
          </div>

          <Card s={{ marginBottom: 16 }}>
            <Section>Identificación del postulante</Section>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["Nombre", form.name], ["RUT", form.rut || "—"], ["Edad", form.age || "—"], ["Formación", form.education || "—"], ["Último cargo", form.lastJob || "—"], ["Empresa", form.lastCompany || "—"], ["Fechas", form.lastDates || "—"], ["Cargo postulado", form.position]].map(([k, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
                  <span style={{ fontSize: 13, color: "#64748b" }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", textAlign: "right", maxWidth: "60%" }}>{v}</span>
                </div>
              ))}
            </div>
            {result.datos_postulante?.adecuacion_entrevista && (
              <div style={{ marginTop: 12, padding: 12, background: "#f8fafc", borderRadius: 8, fontSize: 12, color: "#475569", lineHeight: 1.6 }}>
                <strong>Adecuación en entrevista:</strong> {result.datos_postulante.adecuacion_entrevista}
              </div>
            )}
          </Card>

          {usedFw === "mutual_jefatura" && <>
            <CompetencyTable title="I. Competencias transversales" data={result.competencias_transversales} />
            <CompetencyTable title="II. Competencias por familia de cargo" data={result.competencias_familia_cargo} />
            <CompetencyTable title="III. Competencias específicas del cargo" data={result.competencias_especificas} />
          </>}

          {usedFw === "medico" && <>
            <CompetencyTable title="I. Competencias transversales" data={result.competencias_transversales} />
            <CompetencyTable title="II. Competencias distintivas" data={result.competencias_distintivas} />
          </>}

          {(usedFw === "industrial" || usedFw === "comercial") && <>
            {result.motivacion_cargo && <Card s={{ marginBottom: 16 }}><Section>Motivación por el cargo</Section><div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}><p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, margin: 0, flex: 1 }}>{result.motivacion_cargo.analisis}</p><AjusteBadge ajuste={result.motivacion_cargo.ajuste} /></div></Card>}
            {result.experiencia_relevante && <Card s={{ marginBottom: 16 }}><Section>Experiencia relevante</Section><div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}><p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, margin: 0, flex: 1 }}>{result.experiencia_relevante.analisis}</p><AjusteBadge ajuste={result.experiencia_relevante.ajuste} /></div></Card>}
            {result.competencias && <Card s={{ marginBottom: 16 }}><Section>Competencias</Section>{result.competencias.map((comp, ci) => (
              <div key={ci} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, padding: "8px 12px", background: "#f1f5f9", borderRadius: "8px 8px 0 0" }}>{comp.nombre}</div>
                {comp.indicadores?.map((ind, ii) => <div key={ii} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid rgba(0,0,0,0.04)", fontSize: 12, color: "#475569" }}><span style={{ flex: 1, paddingRight: 12 }}>{ind.texto}</span><AjusteBadge ajuste={ind.ajuste} /></div>)}
                {comp.analisis_cualitativo && <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6, margin: 0, padding: "10px 12px", background: "#fafafa" }}>{comp.analisis_cualitativo}</p>}
              </div>
            ))}</Card>}
          </>}

          <StrengthsSection data={result} />

          <Card>
            <Section>Resultado de la evaluación</Section>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <ResultBadge result={result.resultado} />
              {result.justificacion && <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginTop: 16, maxWidth: 700, margin: "16px auto 0" }}>{result.justificacion}</p>}
            </div>
          </Card>
        </>}
      </div>
    </div>
  );
}
