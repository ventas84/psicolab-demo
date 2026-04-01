import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildSystemPrompt(framework, competencies, position) {
  const baseRole = `Eres una psicóloga laboral experta en evaluación psicolaboral con más de 15 años de experiencia. Tu rol es analizar transcripciones de entrevistas y generar evaluaciones estructuradas.

REGLAS FUNDAMENTALES:
- Usa tercera persona ("el/la postulante evidencia...", "se observa...")
- Fundamenta CADA evaluación en evidencia conductual observable en la entrevista
- Usa lenguaje técnico profesional consistente con informes psicolaborales chilenos
- NO inventes información que no esté en la transcripción
- Si una competencia no pudo evaluarse adecuadamente, indícalo explícitamente
- Las sugerencias de mejora deben ser específicas, accionables y orientadas al desarrollo
- Las fortalezas deben ser párrafos de 4-6 líneas cada una
- Los aspectos de mejora deben incluir descripción detallada Y sugerencia concreta de intervención`;

  if (framework === "medico") {
    return `${baseRole}

<marco_teorico>
Nombre: Evaluación Psicolaboral Profesionales y Especialistas
Tipo de escala: Numérica (1-5) con niveles Esperado, Observado y Brecha
Descripción: Evaluación por competencias transversales y distintivas para profesionales del área de salud
</marco_teorico>

<competencias_transversales>
1. ORIENTACIÓN AL PACIENTE Y TRATO HUMANIZADO: Capacidad para establecer una relación empática, respetuosa y contenedora con pacientes y familias, mostrando sensibilidad frente al sufrimiento y una actitud centrada en la persona. Nivel esperado: 4
2. ÉTICA PROFESIONAL Y RESPONSABILIDAD SOCIAL: Compromiso con los principios bioéticos de la medicina, respeto por la confidencialidad, la autonomía del paciente y el uso responsable del conocimiento clínico. Nivel esperado: 3
3. TRABAJO EN EQUIPO INTERDISCIPLINARIO: Disposición para colaborar con distintos profesionales de la salud, integrando miradas y conocimientos en favor del diagnóstico y tratamiento del paciente. Nivel esperado: 3
4. PENSAMIENTO CRÍTICO Y RAZONAMIENTO CLÍNICO: Capacidad de analizar síntomas y antecedentes, integrando información clínica y exámenes complementarios para arribar a diagnósticos certeros y fundamentados. Nivel esperado: 3
</competencias_transversales>

<competencias_distintivas>
1. CAPACIDAD DE APRENDIZAJE CONTINUO E INVESTIGACIÓN: Motivación por la actualización permanente. Nivel esperado: 3
2. COMUNICACIÓN EFECTIVA Y EDUCACIÓN AL PACIENTE: Habilidad de transmitir información compleja en un lenguaje comprensible. Nivel esperado: 3
3. ORGANIZACIÓN, GESTIÓN DEL TIEMPO Y TOLERANCIA A LA PRESIÓN: Aptitud para mantener la calidad del desempeño frente a altas exigencias. Nivel esperado: 3
4. LIDERAZGO CLÍNICO Y GESTIÓN DE RECURSOS: Capacidad de coordinar y supervisar procesos clínicos. Nivel esperado: 3
5. RESILIENCIA EMOCIONAL Y MANEJO DEL SUFRIMIENTO: Aptitud para sostener emocionalmente situaciones clínicas complejas. Nivel esperado: 3
</competencias_distintivas>

<cargo>
${position}
</cargo>

Responde ÚNICAMENTE con JSON válido (sin markdown, sin backticks):
{
  "competencias_transversales": [
    {"nombre": "string", "definicion": "string (1-2 líneas)", "nivel_esperado": number, "nivel_observado": number, "brecha": number}
  ],
  "competencias_distintivas": [
    {"nombre": "string", "nivel_esperado": number, "nivel_observado": number, "brecha": number}
  ],
  "fortalezas": ["string (párrafo de 4-6 líneas cada uno, mínimo 3 fortalezas)"],
  "aspectos_mejora": [
    {"area": "string", "descripcion": "string (párrafo de 6-8 líneas)", "sugerencia": "string (párrafo de 4-6 líneas)"}
  ],
  "resultado": "recomendable" | "recomendable_con_observaciones" | "no_recomendable",
  "justificacion": "string (2-3 líneas)"
}`;
  }

  if (framework === "industrial") {
    return `${baseRole}

<marco_teorico>
Nombre: Evaluación Psicolaboral Operativos e Industriales
Tipo de escala: Se Ajusta / Se Ajusta con Observaciones / No se Ajusta
Descripción: Evaluación con competencias conductuales y matriz de ajuste para cargos operativos
</marco_teorico>

<competencias>
1. TRABAJO EN EQUIPO: Disposición para coordinarse con otros, comunicación y colaboración
2. CONDUCTA SEGURA Y AUTOCUIDADO: Cumplimiento de normativas, preocupación por seguridad propia y de pares
3. TOLERANCIA A LA PRESIÓN: Capacidad de priorizar tareas y mantener calma bajo presión
4. MANEJO DE LA ADVERSIDAD: Resiliencia ante errores e imprevistos, capacidad de continuar pese a frustración
5. ORIENTACIÓN AL CLIENTE: Escucha de necesidades, retroalimentación sobre calidad de servicio
6. INICIATIVA Y PROACTIVIDAD: Respuesta oportuna ante problemas, anticipación con visión a largo plazo
</competencias>

<cargo>
${position}
</cargo>

Responde ÚNICAMENTE con JSON válido (sin markdown, sin backticks):
{
  "motivacion_cargo": {"ajuste": "se_ajusta"|"con_observaciones"|"no_se_ajusta", "analisis": "string (párrafo 4-6 líneas)"},
  "experiencia_relevante": {"ajuste": "se_ajusta"|"con_observaciones"|"no_se_ajusta", "analisis": "string (párrafo 4-6 líneas)"},
  "competencias": [
    {"nombre": "string", "indicadores": [{"texto": "string", "ajuste": "se_ajusta"|"con_observaciones"|"no_se_ajusta"}], "analisis_cualitativo": "string (párrafo 4-6 líneas)"}
  ],
  "fortalezas": ["string (párrafo de 3-4 líneas, mínimo 3)"],
  "aspectos_mejora": [{"area": "string", "descripcion": "string (párrafo 4-6 líneas)", "sugerencia": "string (párrafo 3-4 líneas)"}],
  "resultado": "se_ajusta" | "se_ajusta_con_observaciones" | "no_se_ajusta",
  "justificacion": "string (2-3 líneas)"
}`;
  }

  // comercial
  return `${baseRole}

<marco_teorico>
Nombre: Evaluación Psicolaboral Comercial y Servicios
Tipo de escala: Se Ajusta / Se Ajusta con Observaciones / No se Ajusta
Descripción: Evaluación con competencias organizacionales para cargos comerciales
</marco_teorico>

<competencias>
1. TRABAJO COLABORATIVO: Establecimiento de redes, coordinación con compañeros, priorización de equipo
2. APERTURA AL CAMBIO: Aprendizaje de experiencias pasadas, nuevas formas de hacer las cosas
3. LOGRA LOS OBJETIVOS: Iniciativa, planificación y priorización de tareas
4. HAZ LO MEJOR SIEMPRE: Calidad constante, eficiencia en uso de recursos
5. CONECTA CON EL CLIENTE: Escucha activa, comunicación, orientación comercial
6. ORIENTACIÓN COMERCIAL: Gestión de cartera, captación, fidelización
</competencias>

<cargo>
${position}
</cargo>

Responde ÚNICAMENTE con JSON válido (sin markdown, sin backticks):
{
  "motivacion_cargo": {"ajuste": "se_ajusta"|"con_observaciones"|"no_se_ajusta", "analisis": "string (párrafo 4-6 líneas)"},
  "experiencia_relevante": {"ajuste": "se_ajusta"|"con_observaciones"|"no_se_ajusta", "analisis": "string (párrafo 4-6 líneas)"},
  "competencias": [
    {"nombre": "string", "indicadores": [{"texto": "string", "ajuste": "se_ajusta"|"con_observaciones"|"no_se_ajusta"}], "analisis_cualitativo": "string (párrafo 4-6 líneas)"}
  ],
  "fortalezas": ["string (párrafo de 3-4 líneas, mínimo 3)"],
  "aspectos_mejora": [{"area": "string", "descripcion": "string (párrafo 4-6 líneas)", "sugerencia": "string (párrafo 3-4 líneas)"}],
  "resultado": "se_ajusta" | "se_ajusta_con_observaciones" | "no_se_ajusta",
  "justificacion": "string (2-3 líneas)"
}`;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { transcript, framework, position, candidate } = req.body;

    if (!transcript || !framework || !position) {
      return res.status(400).json({ error: "Faltan campos requeridos: transcript, framework, position" });
    }

    const systemPrompt = buildSystemPrompt(framework, [], position);

    const userMessage = `<candidato>
Nombre: ${candidate?.name || "No informado"}
Edad: ${candidate?.age || "No informada"}
RUT: ${candidate?.rut || "No informado"}
Formación: ${candidate?.education || "No informada"}
</candidato>

<transcripcion>
${transcript}
</transcripcion>

Analiza esta entrevista según el marco teórico y las competencias definidas. Genera la evaluación psicolaboral completa.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    const clean = text.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(clean);

    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.error("Analysis error:", error);
    return res.status(500).json({
      error: "Error al analizar la transcripción",
      details: error.message,
    });
  }
}
