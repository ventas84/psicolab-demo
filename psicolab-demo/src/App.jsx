import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const FRAMEWORKS = [
  { id: "medico", name: "Profesionales y Especialistas (Médico)", author: "Competencias Transversales + Distintivas", description: "Evaluación por competencias con niveles esperado/observado/brecha. Incluye competencias transversales (orientación al paciente, ética, trabajo en equipo, pensamiento crítico) y distintivas (aprendizaje continuo, comunicación, organización, liderazgo clínico, resiliencia emocional).", color: "#2563eb", dimensions: ["Orientación al Paciente", "Ética Profesional", "Trabajo en Equipo Interdisciplinario", "Pensamiento Crítico", "Aprendizaje Continuo", "Comunicación Efectiva", "Organización y Tolerancia a la Presión", "Liderazgo Clínico", "Resiliencia Emocional"] },
  { id: "industrial", name: "Operativos e Industriales", author: "Competencias Conductuales + Matriz de Ajuste", description: "Evaluación con escala Se Ajusta / Se Ajusta con Observaciones / No se Ajusta. Incluye motivación por el cargo, experiencia relevante y matriz de competencias conductuales evaluadas cualitativamente.", color: "#059669", dimensions: ["Trabajo en Equipo", "Conducta Segura y Autocuidado", "Tolerancia a la Presión", "Manejo de la Adversidad", "Orientación al Cliente", "Iniciativa y Proactividad"] },
  { id: "comercial", name: "Comercial y Servicios", author: "Competencias Organizacionales + Conductuales", description: "Evaluación con competencias corporativas adaptadas al cargo. Incluye motivación, experiencia relevante y competencias como trabajo colaborativo, apertura al cambio, logro de objetivos y conexión con el cliente.", color: "#7c3aed", dimensions: ["Trabajo Colaborativo", "Apertura al Cambio", "Logra los Objetivos", "Haz lo Mejor Siempre", "Conecta con el Cliente", "Orientación Comercial"] },
  { id: "custom", name: "Marco Personalizado", author: "Definido por el usuario", description: "Configura tus propias competencias, escalas y criterios de evaluación adaptados a tu organización.", color: "#d97706", dimensions: [] },
];

const POSITIONS = [
  { id: 1, title: "Medicina Urgencias", area: "Salud", level: "Especialista", framework: "medico", status: "active" },
  { id: 2, title: "Neurocirugía", area: "Salud", level: "Especialista", framework: "medico", status: "active" },
  { id: 3, title: "Mantenedor Eléctrico", area: "Operaciones", level: "Técnico", framework: "industrial", status: "active" },
  { id: 4, title: "Ejecutivo Comercial", area: "Ventas", level: "Profesional", framework: "comercial", status: "active" },
];

const INTERVIEWS = [
  { id: 1, candidate: "Agustín Águila", position: "Medicina Urgencias", framework: "medico", date: "2026-02-15", status: "completed", result: "obs" },
  { id: 2, candidate: "Felipe Lavín", position: "Neurocirugía", framework: "medico", date: "2026-01-20", status: "completed", result: "rec" },
  { id: 3, candidate: "Italia Espinoza", position: "Ejecutivo Comercial", framework: "comercial", date: "2025-12-29", status: "completed", result: "rec" },
  { id: 4, candidate: "Yosimar Mora", position: "Mantenedor Eléctrico", framework: "industrial", date: "2026-03-05", status: "completed", result: "rec" },
  { id: 5, candidate: "Gustavo San Martín", position: "Mantenedor Eléctrico", framework: "industrial", date: "2026-03-18", status: "completed", result: "obs" },
  { id: 6, candidate: "Cristóbal Cruz", position: "Neurocirugía", framework: "medico", date: "2025-11-10", status: "completed", result: "rec" },
  { id: 7, candidate: "Alejandra Huerta", position: "Medicina Urgencias", framework: "medico", date: "2026-02-22", status: "completed", result: "obs" },
];

const TRANSCRIPT = `[00:00:15] Entrevistador: Buenos días, gracias por acompañarnos hoy. ¿Cómo estás?

[00:00:22] Candidato: Buenos días, muy bien gracias. Contenta de estar aquí.

[00:00:30] Entrevistador: Perfecto. Como te comenté, esta entrevista es para el cargo que postulaste. Me gustaría que comenzaras contándome sobre tu experiencia en el área.

[00:00:45] Candidato: Claro. En mi último cargo estuve a cargo de un equipo durante 3 años. Implementamos nuevas metodologías y logramos mejorar los indicadores significativamente. Fue un proceso desafiante porque había resistencia al cambio, pero trabajé mucho en la comunicación y en generar espacios de confianza.

[00:01:20] Entrevistador: Interesante. ¿Podrías darme un ejemplo concreto de una situación difícil que hayas enfrentado?

[00:01:30] Candidato: Sí, hubo un momento donde tuvimos un proyecto con deadline muy ajustado y dos miembros clave del equipo presentaron su renuncia simultáneamente. Tuve que reorganizar completamente los roles, negociar con el cliente una extensión parcial del plazo, y al mismo tiempo mantener la moral del equipo. Finalmente entregamos con solo una semana de retraso y el cliente quedó satisfecho con la calidad.

[00:02:15] Entrevistador: ¿Cómo manejas los conflictos interpersonales?

[00:02:22] Candidato: Creo mucho en la conversación directa. Cuando detecto un conflicto, primero hablo con cada parte por separado para entender las perspectivas, y luego facilito un espacio de diálogo conjunto. He aprendido que la mayoría de los conflictos vienen de malentendidos o expectativas no alineadas.

[00:03:00] Entrevistador: ¿Qué te motiva a postular a este cargo?

[00:03:08] Candidato: Me motiva la oportunidad de desarrollo profesional y la posibilidad de aportar con mi experiencia. He investigado sobre la organización y me identifico mucho con los valores y la forma de trabajo. Además, el cargo representa un desafío que se alinea con mis metas de carrera.

[00:03:45] Entrevistador: ¿Cómo te describes trabajando bajo presión?

[00:03:52] Candidato: Funciono bien bajo presión. Tiendo a ordenar las prioridades, identificar lo urgente de lo importante, y mantener la calma. En mi experiencia en urgencias, donde cada minuto cuenta, aprendí que la organización mental es clave. Sin embargo, reconozco que a veces puedo ser demasiado autoexigente y me cuesta delegar cuando siento que el resultado puede verse comprometido.`;

const REPORT_MEDICO = {
  candidate: { name: "Agustín Antonio Águila Nahuelpán", rut: "20.473.122-7", age: "25 años" },
  position: "Medicina Urgencias",
  framework: "medico",
  evaluator: "María José Hidalgo — Psicóloga Clínica Laboral",
  company: "One Talent Consultores",
  result: "obs",
  competencias_transversales: [
    { name: "Orientación al Paciente y Trato Humanizado", def: "Capacidad para establecer una relación empática, respetuosa y contenedora con pacientes y familias, mostrando sensibilidad frente al sufrimiento y una actitud centrada en la persona.", expected: 4, observed: 3, gap: -1 },
    { name: "Ética Profesional y Responsabilidad Social", def: "Compromiso con los principios bioéticos de la medicina, respeto por la confidencialidad, la autonomía del paciente y el uso responsable del conocimiento clínico.", expected: 3, observed: 3, gap: 0 },
    { name: "Trabajo en Equipo Interdisciplinario", def: "Disposición para colaborar con distintos profesionales de la salud, integrando miradas y conocimientos en favor del diagnóstico y tratamiento del paciente.", expected: 3, observed: 3, gap: 0 },
    { name: "Pensamiento Crítico y Razonamiento Clínico", def: "Capacidad de analizar síntomas y antecedentes, integrando información clínica y exámenes complementarios para arribar a diagnósticos certeros y fundamentados.", expected: 3, observed: 2, gap: -1 },
  ],
  competencias_distintivas: [
    { name: "Aprendizaje Continuo e Investigación", expected: 3, observed: 3, gap: 0 },
    { name: "Comunicación Efectiva y Educación al Paciente", expected: 3, observed: 3, gap: 0 },
    { name: "Organización, Gestión del Tiempo y Tolerancia a la Presión", expected: 3, observed: 3, gap: 0 },
    { name: "Liderazgo Clínico y Gestión de Recursos", expected: 3, observed: 3, gap: 0 },
    { name: "Resiliencia Emocional y Manejo del Sufrimiento", expected: 3, observed: 3, gap: 0 },
  ],
  fortalezas: [
    "Demuestra habilidad para abordar problemas clínicos de manera estructurada y orientada a la resolución, priorizando diagnósticos y conductas en función de la urgencia y el riesgo vital. Se observa rapidez para integrar información clínica y ejecutar decisiones oportunas, especialmente en contextos de alta demanda asistencial.",
    "Presenta una adecuada capacidad para organizar tareas, jerarquizar demandas simultáneas y mantener continuidad asistencial en escenarios de urgencia. Logra sostener el ritmo de trabajo sin desorganización operativa.",
    "Evidencia disposición sostenida hacia la formación permanente, búsqueda de conocimiento y adquisición de nuevas herramientas clínicas, incluyendo entrenamiento específico en ecografía de urgencia.",
    "Se observa disposición para integrarse a equipos multidisciplinarios, colaborar en contextos clínicos diversos y participar en actividades de docencia y formación."
  ],
  aspectos_mejora: [
    "Se identifica una priorización sostenida de la rapidez y la eficacia clínica por sobre una mirada integral del paciente. En contextos de urgencia, esta orientación podría generar dificultades para detectar necesidades psicosociales relevantes. Se sugiere incorporar micro-pausas clínicas breves (30-60 segundos) antes del cierre de casos relevantes, orientadas a verificar aspectos no técnicos del paciente.",
    "Se observa una limitada autocrítica clínica, evidenciada en la dificultad para identificar con agilidad errores o decisiones subóptimas en su quehacer profesional. Se sugiere implementar espacios formales y recurrentes de revisión de casos clínicos, orientados a analizar decisiones adoptadas y resultados obtenidos."
  ],
};

const REPORT_INDUSTRIAL = {
  candidate: { name: "Yosimar Anderson Mora Dovales", rut: "25.927.582", age: "38 años", formacion: "Ingeniero Electricista", phone: "+56999434262", mail: "yosimarmora@hotmail.com" },
  position: "Mantenedor Eléctrico",
  framework: "industrial",
  evaluator: "María José Hidalgo — Psicóloga Laboral",
  company: "One Talent Consultores",
  date: "5 de marzo de 2026",
  result: "rec",
  motivacion: { ajuste: "se_ajusta", texto: "Evidencia interés por integrarse de manera directa a la organización, destacando principalmente las oportunidades de aprendizaje y capacitación que ha observado en la empresa. Valora positivamente el enfoque organizacional hacia la seguridad de las personas y el clima laboral, lo cual constituye un elemento relevante en su decisión de postular." },
  experiencia: { ajuste: "se_ajusta", texto: "Cuenta con experiencia en mantenimiento industrial y supervisión de equipos en contextos operacionales de alta exigencia, particularmente en el sector minero y en proyectos eléctricos. Ha participado en la gestión de mantenimiento preventivo, correctivo y predictivo de equipos electromecánicos." },
  competencias: [
    { name: "Trabajo en Equipo", indicators: [{ text: "Es respetuoso con las personas, contribuyendo a un clima cooperativo e inclusivo", ajuste: "se_ajusta" }, { text: "Comparte información y conocimientos relevantes para el logro de objetivos", ajuste: "se_ajusta" }] },
    { name: "Conducta Segura y Autocuidado", indicators: [{ text: "Cumple las normativas y procedimientos de la compañía", ajuste: "se_ajusta" }, { text: "Se preocupa por su seguridad y bienestar, como también la de sus pares", ajuste: "se_ajusta" }] },
    { name: "Tolerancia a la Presión", indicators: [{ text: "Clasifica adecuadamente las tareas prioritarias bajo condiciones de presión", ajuste: "se_ajusta" }, { text: "Busca mantener la calma y actuar de forma equilibrada frente a tareas complejas", ajuste: "con_obs" }] },
    { name: "Manejo de la Adversidad", indicators: [{ text: "Resiste el impulso a actuar en forma inmediata, se toma el tiempo para pensar", ajuste: "se_ajusta" }, { text: "Es capaz de continuar realizando sus tareas pese a la frustración", ajuste: "se_ajusta" }] },
    { name: "Orientación al Cliente", indicators: [{ text: "Escucha y entiende las necesidades del cliente interno/externo", ajuste: "se_ajusta" }, { text: "Solicita retroalimentación respecto a la calidad de servicio entregado", ajuste: "se_ajusta" }] },
    { name: "Iniciativa y Proactividad", indicators: [{ text: "Responde con prontitud ante problemas que surgen en el día a día", ajuste: "se_ajusta" }, { text: "Se anticipa a las situaciones con una visión a largo plazo", ajuste: "se_ajusta" }] },
  ],
  analisis_cualitativo: [
    { comp: "Trabajo en Equipo", texto: "Manifiesta disposición a coordinarse con distintas especialidades dentro de los procesos de mantenimiento, reconociendo la importancia de la comunicación y la planificación conjunta para evitar interferencias operativas." },
    { comp: "Conducta Segura", texto: "Presenta una orientación preventiva frente a los riesgos propios del entorno industrial, destacando la relevancia de los procedimientos de seguridad y del uso adecuado de los elementos de protección personal." },
    { comp: "Tolerancia a la Presión", texto: "Se observa capacidad para priorizar tareas y buscar soluciones frente a contingencias operacionales. No obstante, presenta una tendencia a la impaciencia en determinadas situaciones, lo que podría llevarlo a intentar acelerar procesos que requieren tiempos de verificación." },
    { comp: "Iniciativa y Proactividad", texto: "Evidencia una actitud activa frente a la resolución de problemas propios del entorno de mantenimiento industrial, mostrando disposición a intervenir oportunamente ante desviaciones o fallas en los equipos." },
  ],
  fortalezas: [
    "Evidencia una orientación hacia la prevención de riesgos, mostrando comprensión respecto a la importancia de los protocolos de seguridad y elementos de protección personal.",
    "Se observa una adecuada disposición para coordinarse con distintas especialidades dentro del proceso de mantenimiento, reconociendo la importancia de la comunicación y la planificación.",
    "Muestra una actitud activa frente a la resolución de problemas operativos, evidenciando disposición para actuar oportunamente cuando se presentan desviaciones o fallas.",
    "Frente a situaciones imprevistas o errores operativos, demuestra disposición a asumir responsabilidades y analizar las causas que originaron la situación."
  ],
  aspectos_mejora: [
    "En determinadas situaciones presenta una tendencia a querer avanzar con rapidez en la ejecución de las tareas, lo que podría generar dificultades para respetar completamente los tiempos asociados a ciertos protocolos o verificaciones previas. Se recomienda reforzar la importancia de los procesos de planificación y chequeo previo antes de ejecutar intervenciones técnicas."
  ],
};

/* ═══════════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function ResultBadge({ result, size = "md" }) {
  const c = { rec: { l: "Recomendable", bg: "#dcfce7", c: "#166534" }, obs: { l: "Recomendable con Obs.", bg: "#fef3c7", c: "#92400e" }, no: { l: "No Recomendable", bg: "#fee2e2", c: "#991b1b" } }[result] || { l: "—", bg: "#f3f4f6", c: "#374151" };
  return <span style={{ padding: size === "sm" ? "3px 10px" : "6px 14px", borderRadius: 8, background: c.bg, color: c.c, fontSize: size === "sm" ? 11 : 13, fontWeight: 700, whiteSpace: "nowrap" }}>{c.l}</span>;
}

function AjusteBadge({ ajuste }) {
  const c = { se_ajusta: { l: "Se Ajusta", bg: "#dcfce7", c: "#166534" }, con_obs: { l: "Con Obs.", bg: "#fef3c7", c: "#92400e" }, no_ajusta: { l: "No se Ajusta", bg: "#fee2e2", c: "#991b1b" } }[ajuste] || { l: "—", bg: "#f3f4f6", c: "#374151" };
  return <span style={{ padding: "3px 10px", borderRadius: 6, background: c.bg, color: c.c, fontSize: 11, fontWeight: 600 }}>{c.l}</span>;
}

function GapBadge({ gap }) {
  const color = gap === 0 ? "#059669" : gap === -1 ? "#d97706" : "#dc2626";
  return <span style={{ padding: "2px 8px", borderRadius: 6, background: gap === 0 ? "#dcfce7" : gap === -1 ? "#fef3c7" : "#fee2e2", color, fontSize: 11, fontWeight: 700 }}>{gap === 0 ? "Sin brecha" : gap}</span>;
}

function Card({ children, style }) {
  return <div style={{ background: "white", borderRadius: 14, border: "1px solid rgba(0,0,0,0.06)", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)", ...style }}>{children}</div>;
}

function Section({ children }) {
  return <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "2px solid #2563eb", paddingBottom: 8, display: "inline-block" }}>{children}</h3>;
}

/* ═══════════════════════════════════════════════════════════════
   PAGES
   ═══════════════════════════════════════════════════════════════ */

function DashboardPage({ onNav }) {
  const stats = [
    { label: "Entrevistas realizadas", value: "7", icon: "🎙️", color: "#2563eb" },
    { label: "Informes generados", value: "7", icon: "📋", color: "#059669" },
    { label: "Cargos activos", value: "4", icon: "💼", color: "#7c3aed" },
    { label: "Marcos configurados", value: "3", icon: "🧠", color: "#d97706" },
  ];
  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 4px", letterSpacing: -0.5 }}>Panel de Control</h1>
      <p style={{ color: "#64748b", margin: "0 0 28px", fontSize: 14 }}>One Talent Consultores — Resumen de actividad</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", letterSpacing: -1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.label}</div>
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18 }}>
        <Card>
          <Section>Últimas evaluaciones</Section>
          {INTERVIEWS.map((int, i) => (
            <div key={i} onClick={() => onNav("report")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < INTERVIEWS.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none", cursor: "pointer", transition: "background 0.15s", borderRadius: 6 }} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ marginLeft: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{int.candidate}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>{int.position} · {int.date}</div>
              </div>
              <ResultBadge result={int.result} size="sm" />
            </div>
          ))}
        </Card>
        <Card>
          <Section>Accesos rápidos</Section>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { icon: "🎥", label: "Nueva Entrevista", desc: "Videollamada + transcripción + IA", page: "interview" },
              { icon: "💼", label: "Gestionar Cargos", desc: "Perfiles y competencias", page: "positions" },
              { icon: "🧠", label: "Marcos Teóricos", desc: "Frameworks de evaluación", page: "frameworks" },
              { icon: "📊", label: "Ver Informes", desc: "Evaluaciones completadas", page: "report" },
            ].map((a, i) => (
              <div key={i} onClick={() => onNav(a.page)} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: 10, background: "#f8fafc", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "#eef2ff"; e.currentTarget.style.transform = "translateX(4px)"; }} onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.transform = "none"; }}>
                <span style={{ fontSize: 22, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", flexShrink: 0 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{a.desc}</div>
                </div>
                <span style={{ color: "#c0c8d4", flexShrink: 0 }}>→</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function InterviewPage() {
  const [step, setStep] = useState(0);
  const [recording, setRecording] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [form, setForm] = useState({ name: "", rut: "", age: "", position: "", framework: "" });
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => { let t; if (recording) t = setInterval(() => setElapsed(e => e + 1), 1000); return () => clearInterval(t); }, [recording]);
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (step === 0) return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Nueva Entrevista</h1>
      <p style={{ color: "#64748b", margin: "0 0 28px", fontSize: 14 }}>Configura los datos del postulante y el marco de evaluación</p>
      <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
          {[["Nombre completo", "name", "Ej: María González"], ["RUT", "rut", "20.473.122-7"], ["Edad", "age", "25 años"]].map(([l, k, p]) => (
            <div key={k}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>{l}</label>
              <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={p} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 13, boxSizing: "border-box", fontFamily: "inherit", outline: "none" }} onFocus={e => e.target.style.borderColor = "#2563eb"} onBlur={e => e.target.style.borderColor = "#d1d5db"} />
            </div>
          ))}
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Cargo al que postula</label>
          <select value={form.position} onChange={e => { const p = POSITIONS.find(x => x.title === e.target.value); setForm({ ...form, position: e.target.value, framework: p ? p.framework : "" }); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 13, background: "white", fontFamily: "inherit" }}>
            <option value="">Seleccionar cargo...</option>
            {POSITIONS.map(p => <option key={p.id} value={p.title}>{p.title} — {p.area} ({p.level})</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Marco teórico de evaluación</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {FRAMEWORKS.map(fw => (
              <div key={fw.id} onClick={() => setForm({ ...form, framework: fw.id })} style={{ padding: 14, borderRadius: 10, border: `2px solid ${form.framework === fw.id ? fw.color : "rgba(0,0,0,0.06)"}`, background: form.framework === fw.id ? fw.color + "08" : "white", cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: form.framework === fw.id ? fw.color : "#1e293b" }}>{fw.name}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{fw.author}</div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => form.name && form.position && form.framework && setStep(1)} disabled={!form.name || !form.position || !form.framework} style={{ marginTop: 8, padding: "14px 28px", borderRadius: 10, border: "none", background: form.name && form.position && form.framework ? "linear-gradient(135deg, #1e40af, #7c3aed)" : "#e2e8f0", color: form.name && form.position && form.framework ? "white" : "#94a3b8", fontSize: 14, fontWeight: 700, cursor: form.name && form.position && form.framework ? "pointer" : "default", transition: "all 0.3s" }}>
          🎥 Iniciar Videollamada con Transcripción
        </button>
      </div>
    </div>
  );

  if (step === 1) return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Entrevista en Curso</h1>
      <p style={{ color: "#64748b", margin: "0 0 20px", fontSize: 14 }}>{form.name} · {form.position}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ background: "#0f172a", borderRadius: 14, aspectRatio: "16/10", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 40%, rgba(37,99,235,0.15), transparent 60%)" }} />
          <div style={{ display: "flex", gap: 32, marginBottom: 20, position: "relative" }}>
            <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg, #1e40af, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "white", fontWeight: 700 }}>MJ</div>
            <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg, #059669, #34d399)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "white", fontWeight: 700 }}>{form.name[0]}</div>
          </div>
          <div style={{ color: "white", fontSize: 12, opacity: 0.5, position: "relative" }}>Google Meet — Transcripción activa</div>
          {recording && <div style={{ position: "absolute", top: 14, left: 14, display: "flex", alignItems: "center", gap: 8, background: "rgba(220,38,38,0.9)", padding: "5px 12px", borderRadius: 16, color: "white", fontSize: 12, fontWeight: 600 }}><span className="pulse-dot" />REC {fmt(elapsed)}</div>}
          <div style={{ position: "absolute", bottom: 14, display: "flex", gap: 8 }}>
            <button onClick={() => { setRecording(!recording); if (!recording) setTimeout(() => setShowTranscript(true), 1200); }} style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: recording ? "#dc2626" : "#22c55e", color: "white", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>{recording ? "⏹ Detener" : "⏺ Grabar"}</button>
            <button onClick={() => setStep(2)} style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "white", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Finalizar Entrevista →</button>
          </div>
        </div>
        <Card style={{ maxHeight: 380, display: "flex", flexDirection: "column", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "#0f172a" }}>Transcripción en Tiempo Real</h3>
            {showTranscript && <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>● Activa</span>}
          </div>
          <div style={{ flex: 1, overflowY: "auto", fontSize: 12, lineHeight: 1.7, color: "#334155", fontFamily: "'SF Mono', 'JetBrains Mono', monospace" }}>
            {showTranscript ? <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{TRANSCRIPT}</pre> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8", fontSize: 13 }}>{recording ? "Iniciando transcripción..." : "Presiona Grabar para iniciar"}</div>}
          </div>
        </Card>
      </div>
    </div>
  );

  return <ProcessingStep name={form.name} position={form.position} framework={form.framework} />;
}

function ProcessingStep({ name, position, framework }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const steps = ["Procesando audio y transcripción...", `Aplicando marco: ${FRAMEWORKS.find(f => f.id === framework)?.name || ""}...`, "Evaluando competencias por dimensión...", "Identificando fortalezas y brechas...", "Generando informe psicolaboral..."];

  useEffect(() => { const t = setInterval(() => setProgress(p => { if (p >= 100) { clearInterval(t); setTimeout(() => setDone(true), 500); return 100; } return p + 1.5; }), 60); return () => clearInterval(t); }, []);

  if (done) return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36 }}>✓</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Informe Generado Exitosamente</h2>
      <p style={{ color: "#64748b", fontSize: 14 }}>{name} — {position}</p>
      <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 20 }}>Navega a <strong>"Informes"</strong> en el menú lateral para ver el resultado completo.</p>
    </div>
  );

  const cur = Math.min(Math.floor(progress / 20), 4);
  return (
    <div style={{ maxWidth: 480, margin: "50px auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 24, textAlign: "center" }}>Generando evaluación con IA...</h2>
      <div style={{ height: 6, borderRadius: 3, background: "#e2e8f0", marginBottom: 32, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, borderRadius: 3, background: "linear-gradient(90deg, #2563eb, #7c3aed)", transition: "width 0.3s" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: i <= cur ? 1 : 0.25, transition: "opacity 0.5s" }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: i < cur ? "#22c55e" : i === cur ? "#2563eb" : "#e2e8f0", color: "white", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0, transition: "background 0.3s" }}>{i < cur ? "✓" : i + 1}</span>
            <span style={{ fontSize: 14, color: "#334155", fontWeight: i === cur ? 600 : 400 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PositionsPage() {
  const [showForm, setShowForm] = useState(false);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0 }}>Gestión de Cargos</h1>
          <p style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>Perfiles con competencias vinculadas a marcos teóricos</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #1e40af, #7c3aed)", color: "white", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>+ Nuevo Cargo</button>
      </div>
      {showForm && (
        <Card style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px", color: "#0f172a" }}>Crear nuevo cargo</h3>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            {[["Título del cargo", "Ej: Product Manager"], ["Área", "Ej: Producto"], ["Nivel", ""]].map(([l, p], i) => (
              <div key={i}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>{l}</label>
                {i < 2 ? <input placeholder={p} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" }} /> : <select style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 13, background: "white", fontFamily: "inherit" }}><option>Junior</option><option>Semi-Senior</option><option>Senior</option><option>Gerencial</option></select>}
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>Marco teórico vinculado</label>
            <select style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 13, background: "white", fontFamily: "inherit" }}>{FRAMEWORKS.map(f => <option key={f.id}>{f.name}</option>)}</select>
          </div>
          <button onClick={() => setShowForm(false)} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "#2563eb", color: "white", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Guardar Cargo</button>
        </Card>
      )}
      <div style={{ display: "grid", gap: 10 }}>
        {POSITIONS.map(p => {
          const fw = FRAMEWORKS.find(f => f.id === p.framework);
          return (
            <Card key={p.id} style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{p.area} · {p.level}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ padding: "4px 12px", borderRadius: 6, background: fw?.color + "12", color: fw?.color, fontSize: 11, fontWeight: 600 }}>{fw?.name?.split("(")[0]?.trim()}</span>
                <span style={{ padding: "4px 12px", borderRadius: 16, background: "#dcfce7", color: "#166534", fontSize: 11, fontWeight: 600 }}>● Activo</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function FrameworksPage() {
  const [exp, setExp] = useState(null);
  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Marcos Teóricos</h1>
      <p style={{ color: "#64748b", margin: "0 0 28px", fontSize: 14 }}>Frameworks de evaluación psicolaboral configurados</p>
      <div style={{ display: "grid", gap: 14 }}>
        {FRAMEWORKS.map(fw => (
          <Card key={fw.id} style={{ padding: 0, overflow: "hidden", borderColor: exp === fw.id ? fw.color + "40" : undefined, transition: "border-color 0.3s" }}>
            <div onClick={() => setExp(exp === fw.id ? null : fw.id)} style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: fw.color }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{fw.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{fw.author}</div>
                </div>
              </div>
              <span style={{ color: "#94a3b8", transform: exp === fw.id ? "rotate(180deg)" : "", transition: "0.3s", fontSize: 12 }}>▼</span>
            </div>
            {exp === fw.id && (
              <div style={{ padding: "0 24px 20px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginTop: 14 }}>{fw.description}</p>
                {fw.dimensions.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 8 }}>Dimensiones evaluadas:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {fw.dimensions.map((d, i) => <span key={i} style={{ padding: "5px 12px", borderRadius: 16, background: fw.color + "10", color: fw.color, fontSize: 12, fontWeight: 500 }}>{d}</span>)}
                    </div>
                  </div>
                )}
                {fw.id === "custom" && (
                  <div style={{ marginTop: 14, padding: 14, borderRadius: 10, background: "#fffbeb", border: "1px solid #fcd34d" }}>
                    <div style={{ fontSize: 12, color: "#92400e", fontWeight: 600 }}>💡 Podrás definir tus propias dimensiones, criterios y escalas adaptadas a tu organización.</div>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function ReportPage() {
  const [view, setView] = useState("medico");
  const r = view === "medico" ? REPORT_MEDICO : REPORT_INDUSTRIAL;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0 }}>Informe de Evaluación Psicolaboral</h1>
          <p style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>{r.company}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setView("medico")} style={{ padding: "8px 14px", borderRadius: 8, border: view === "medico" ? "2px solid #2563eb" : "1px solid #d1d5db", background: view === "medico" ? "#eef2ff" : "white", color: view === "medico" ? "#2563eb" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Médico</button>
          <button onClick={() => setView("industrial")} style={{ padding: "8px 14px", borderRadius: 8, border: view === "industrial" ? "2px solid #059669" : "1px solid #d1d5db", background: view === "industrial" ? "#ecfdf5" : "white", color: view === "industrial" ? "#059669" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Industrial</button>
          <button style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: "#1e40af", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>📄 Exportar DOCX</button>
        </div>
      </div>
      <Card style={{ marginBottom: 16 }}>
        <Section>Identificación del postulante</Section>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {Object.entries(r.candidate).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
              <span style={{ fontSize: 13, color: "#64748b", textTransform: "capitalize" }}>{k.replace(/_/g, " ")}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>Cargo</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{r.position}</span>
          </div>
        </div>
      </Card>
      {view === "medico" ? <MedicoBody r={r} /> : <IndustrialBody r={r} />}
      <Card style={{ marginTop: 16 }}>
        <Section>Resultado de la evaluación</Section>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[{ id: "rec", l: "Recomendable", sub: "Se ajusta al perfil" }, { id: "obs", l: "Recomendable con Observaciones", sub: "Se ajusta con observaciones" }, { id: "no", l: "No Recomendable", sub: "No se ajusta al perfil" }].map(o => (
            <div key={o.id} style={{ padding: 16, borderRadius: 10, border: `2px solid ${r.result === o.id ? (o.id === "rec" ? "#059669" : o.id === "obs" ? "#d97706" : "#dc2626") : "rgba(0,0,0,0.06)"}`, background: r.result === o.id ? (o.id === "rec" ? "#ecfdf5" : o.id === "obs" ? "#fffbeb" : "#fef2f2") : "white", textAlign: "center", transition: "all 0.3s" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: r.result === o.id ? (o.id === "rec" ? "#059669" : o.id === "obs" ? "#d97706" : "#dc2626") : "#94a3b8" }}>{r.result === o.id ? "✓ " : ""}{o.l}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{o.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "right", fontSize: 13, color: "#64748b", fontStyle: "italic" }}>{r.evaluator}</div>
      </Card>
    </div>
  );
}

function MedicoBody({ r }) {
  return (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Section>I. Competencias transversales</Section>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 600 }}>
            <thead><tr style={{ background: "#f1f5f9" }}>{["Competencia", "Definición", "Esp.", "Obs.", "Brecha"].map(h => <th key={h} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 700, color: "#334155", fontSize: 11, borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
            <tbody>{r.competencias_transversales.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                <td style={{ padding: "10px", fontWeight: 600, color: "#1e293b", width: "20%" }}>{c.name}</td>
                <td style={{ padding: "10px", color: "#475569", fontSize: 12, lineHeight: 1.5 }}>{c.def}</td>
                <td style={{ padding: "10px", textAlign: "center", fontWeight: 700, color: "#2563eb" }}>{c.expected}</td>
                <td style={{ padding: "10px", textAlign: "center", fontWeight: 700, color: c.observed < c.expected ? "#d97706" : "#059669" }}>{c.observed}</td>
                <td style={{ padding: "10px", textAlign: "center" }}><GapBadge gap={c.gap} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <Section>II. Competencias distintivas</Section>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: "#f1f5f9" }}>{["Competencia", "Esperado", "Observado", "Brecha"].map(h => <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#334155", fontSize: 11, borderBottom: "2px solid #e2e8f0" }}>{h}</th>)}</tr></thead>
            <tbody>{r.competencias_distintivas.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                <td style={{ padding: "10px 12px", fontWeight: 600, color: "#1e293b" }}>{c.name}</td>
                <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700, color: "#2563eb" }}>{c.expected}</td>
                <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700, color: c.observed < c.expected ? "#d97706" : "#059669" }}>{c.observed}</td>
                <td style={{ padding: "10px 12px", textAlign: "center" }}><GapBadge gap={c.gap} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
      <StrengthsCard fortalezas={r.fortalezas} mejoras={r.aspectos_mejora} />
    </>
  );
}

function IndustrialBody({ r }) {
  return (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Section>Motivación por el cargo</Section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, margin: 0, flex: 1 }}>{r.motivacion.texto}</p>
          <AjusteBadge ajuste={r.motivacion.ajuste} />
        </div>
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <Section>Experiencia relevante</Section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, margin: 0, flex: 1 }}>{r.experiencia.texto}</p>
          <AjusteBadge ajuste={r.experiencia.ajuste} />
        </div>
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <Section>Matriz de competencias evaluadas</Section>
        {r.competencias.map((comp, ci) => (
          <div key={ci} style={{ marginBottom: ci < r.competencias.length - 1 ? 16 : 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", padding: "8px 12px", background: "#f1f5f9", borderRadius: "8px 8px 0 0" }}>{comp.name}</div>
            {comp.indicators.map((ind, ii) => (
              <div key={ii} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid rgba(0,0,0,0.04)", fontSize: 12, color: "#475569" }}>
                <span style={{ flex: 1, paddingRight: 12 }}>{ind.text}</span>
                <AjusteBadge ajuste={ind.ajuste} />
              </div>
            ))}
          </div>
        ))}
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <Section>Análisis cualitativo</Section>
        {r.analisis_cualitativo.map((a, i) => (
          <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < r.analisis_cualitativo.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#059669", marginBottom: 4 }}>{a.comp}</div>
            <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6, margin: 0 }}>{a.texto}</p>
          </div>
        ))}
      </Card>
      <StrengthsCard fortalezas={r.fortalezas} mejoras={r.aspectos_mejora} />
    </>
  );
}

function StrengthsCard({ fortalezas, mejoras }) {
  return (
    <Card>
      <Section>Fortalezas y aspectos de mejora</Section>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#059669", margin: "0 0 10px" }}>Fortalezas</h4>
          {fortalezas.map((f, i) => <div key={i} style={{ fontSize: 12, color: "#334155", lineHeight: 1.6, marginBottom: 10, paddingLeft: 14, borderLeft: "3px solid #dcfce7" }}>{f}</div>)}
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#d97706", margin: "0 0 10px" }}>Aspectos a trabajar</h4>
          {mejoras.map((a, i) => <div key={i} style={{ fontSize: 12, color: "#334155", lineHeight: 1.6, marginBottom: 10, paddingLeft: 14, borderLeft: "3px solid #fef3c7" }}>{a}</div>)}
        </div>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════ */

const NAV = [
  { id: "dashboard", label: "Panel", icon: "📊" },
  { id: "interview", label: "Entrevistas", icon: "🎙️" },
  { id: "positions", label: "Cargos", icon: "💼" },
  { id: "frameworks", label: "Marcos Teóricos", icon: "🧠" },
  { id: "report", label: "Informes", icon: "📋" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [hover, setHover] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pages = {
    dashboard: <DashboardPage onNav={p => { setPage(p); setMobileOpen(false); }} />,
    interview: <InterviewPage />,
    positions: <PositionsPage />,
    frameworks: <FrameworksPage />,
    report: <ReportPage />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif", background: "#f1f5f9" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        .pulse-dot{width:7px;height:7px;border-radius:50%;background:white;animation:pulse 1.5s infinite;display:inline-block}
        *{box-sizing:border-box;margin:0}
        body{margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:rgba(0,0,0,.12);border-radius:3px}
        @media(max-width:768px){.sidebar{display:none}.sidebar.open{display:flex;position:fixed;z-index:50;inset:0;width:220px}.main-content{padding:16px!important}}
        .mobile-toggle{display:none}
        @media(max-width:768px){.mobile-toggle{display:flex}}
      `}</style>

      {/* Mobile overlay */}
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }} />}

      {/* Sidebar */}
      <div className={`sidebar${mobileOpen ? " open" : ""}`} style={{ width: 220, background: "#0f172a", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "22px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "white", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: "white" }}>ψ</span>
            PsicoLab
          </div>
          <div style={{ fontSize: 10, color: "#64748b", marginTop: 5, letterSpacing: 0.5, textTransform: "uppercase" }}>Evaluación Psicolaboral IA</div>
        </div>
        <nav style={{ padding: "14px 10px", flex: 1 }}>
          {NAV.map(n => (
            <div key={n.id} onClick={() => { setPage(n.id); setMobileOpen(false); }} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, marginBottom: 3, cursor: "pointer", background: page === n.id ? "rgba(37,99,235,0.15)" : hover === n.id ? "rgba(255,255,255,0.05)" : "transparent", transition: "all 0.15s" }}>
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              <span style={{ fontSize: 13, fontWeight: page === n.id ? 700 : 500, color: page === n.id ? "#60a5fa" : "#94a3b8", transition: "color 0.15s" }}>{n.label}</span>
            </div>
          ))}
        </nav>
        <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #7c3aed, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 12 }}>MJ</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>María José Hidalgo</div>
              <div style={{ fontSize: 10, color: "#64748b" }}>Psicóloga Clínica Laboral</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="main-content" style={{ flex: 1, padding: 28, overflowY: "auto", minWidth: 0 }}>
        {/* Mobile hamburger */}
        <button className="mobile-toggle" onClick={() => setMobileOpen(true)} style={{ alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 8, border: "1px solid #d1d5db", background: "white", marginBottom: 16, cursor: "pointer", fontSize: 18 }}>☰</button>
        {pages[page] || pages.dashboard}
      </div>
    </div>
  );
}
