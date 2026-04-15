import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildSystemPrompt(framework, position, jobDescription, cvContext) {
  const baseRole = `Eres una psicóloga laboral experta en evaluación psicolaboral con más de 15 años de experiencia en Chile. Tu rol es analizar transcripciones de entrevistas y generar evaluaciones estructuradas.

REGLAS FUNDAMENTALES:
- Usa tercera persona ("la postulante evidencia...", "se observa...")
- Fundamenta CADA evaluación en evidencia conductual observable en la entrevista
- Usa lenguaje técnico profesional consistente con informes psicolaborales chilenos
- NO inventes información que no esté en la transcripción
- Si una competencia no pudo evaluarse adecuadamente, indícalo
- Las fortalezas deben ser párrafos de 4-6 líneas cada uno, mínimo 3 fortalezas
- Los aspectos de mejora deben incluir descripción detallada Y sugerencia concreta de intervención, párrafos de 6-10 líneas
- El nivel observado debe basarse en la evidencia conductual de la entrevista
- Considera el CV y descriptor de cargo como contexto para evaluar el ajuste`;

  if (framework === "mutual_jefatura") {
    return `${baseRole}

<marco_teorico>
Nombre: Evaluación Psicolaboral Jefatura - Mutual de Seguridad
Tipo de escala: Numérica (1-5) donde:
  Nivel 1: Mínimo (Presenta dificultad para ejecutar la conducta. Requiere apoyo y supervisión permanente)
  Nivel 2: En desarrollo (En ocasiones requiere apoyo para la ejecución de la conducta)
  Nivel 3: Desarrollado (Realiza la conducta como una práctica habitual y de manera autónoma)
  Nivel 4: Superior (Se destaca dentro de sus pares en la ejecución de la conducta y agrega valor a su propia gestión)
  Nivel 5: Excepcional (Es un referente en la conducta, agrega valor a su entorno y moviliza a otros en esta dirección)
</marco_teorico>

<competencias_transversales>
1. ORIENTACIÓN AL SERVICIO (Nivel esperado: 5): Es la capacidad de mantener una actitud de respeto y preocupación por las necesidades de los clientes, esforzándose permanentemente por conocer y resolver los problemas de los clientes e incorporar este conocimiento a la forma de planificar las actividades dentro de su trabajo en la compañía.
   Comportamientos esperados: a) Realiza esfuerzos para satisfacer las necesidades de los clientes internos o externos. b) Realiza seguimiento a las necesidades de cada cliente, para cumplir con sus requerimientos.

2. BÚSQUEDA DE LA EXCELENCIA (Nivel esperado: 5): Es la capacidad de fijarse metas y dirigir todos los actos al logro de los objetivos establecidos, actuando con eficacia y eficiencia, buscando en forma constante la excelencia y mejoramiento continuo de los procesos y servicio entregado.
   Comportamientos esperados: a) Elabora e implementa métodos prácticos y operables en pos del cumplimiento eficaz y eficiente de los objetivos. b) Trabaja con objetivos claramente establecidos, realistas y desafiantes.

3. ORIENTACIÓN A LOS RESULTADOS (Nivel esperado: 5): Es la capacidad de orientar y adaptar su comportamiento en pos del cumplimiento de los objetivos encomendados administrando los procesos establecidos para que no interfieran con la consecución de los resultados esperados.
   Comportamientos esperados: a) Fija para sí y/o para los otros los parámetros a alcanzar, y orienta su accionar para lograr y superar los estándares. b) Se preocupa por los tiempos empleados y los inconvenientes que pueden dificultar el cumplimiento de las metas.
</competencias_transversales>

<competencias_familia_cargo>
1. CAPACIDAD DE NEGOCIACIÓN (Nivel esperado: 4): Habilidad para crear un ambiente propicio para la colaboración y lograr compromisos duraderos que fortalezcan la relación. Capacidad para dirigir o controlar una discusión utilizando técnicas ganar-ganar, planificando alternativas para negociar los mejores acuerdos, centrándose en el problema y no en la persona.
   Comportamientos esperados: a) Busca ventajas que beneficien a la contraparte para propiciar el acuerdo. b) Logra persuadir a la contraparte y hacer convincentes sus ideas en beneficio de los intereses de la compañía.

2. COLABORACIÓN Y COORDINACIÓN (Nivel esperado: 4): Es la capacidad de colaborar con el resto del equipo y el de otras áreas, orientando sus acciones a la obtención de objetivos comunes.
   Comportamientos esperados: a) Apoya las tareas de su equipo y las de otras áreas, fomentando el intercambio oportuno de información. b) Presta ayuda a los demás contribuyendo al cumplimiento de los objetivos.

3. DESARROLLO DE LAS PERSONAS / DESARROLLO DE EQUIPOS (Nivel esperado: 4): Es la capacidad de formar y desarrollar las habilidades de las personas, a partir de un apropiado análisis previo de sus necesidades y de la organización. Incluye la capacidad de generar adhesión, compromiso y fidelidad.
   Comportamientos esperados: a) Detecta las falencias de formación en las personas que lo rodean e idea estrategias de mejora. b) Está disponible para enseñar o ser consultado por quienes tienen menos experiencia.
</competencias_familia_cargo>

<competencias_especificas_cargo>
1. CAPACIDAD DE TRABAJAR EN EQUIPOS MULTIDISCIPLINARIOS (Nivel esperado: 4): Es capacidad para lograr una estrecha colaboración, con profesionales de distintas especializaciones, de tal manera de incorporar constructivamente distintas visiones.
   Comportamientos esperados: a) Se comunica claramente y en forma cooperadora con colaboradores de otras áreas. b) Muestra interés por el conocimiento y visión que pueden aportar otras especialidades.

2. ADHESIÓN A NORMAS Y POLÍTICAS (Nivel esperado: 4): Es la disposición para entender, acatar y actuar dentro de las directrices, procedimientos y normas organizacionales.
   Comportamientos esperados: a) Entiende y aplica en su trabajo diario las normas de la compañía. b) Acepta las normas y políticas aún cuando difiera con ellas.

3. CAPACIDAD DE PLANIFICACIÓN Y ORGANIZACIÓN (Nivel esperado: 4): Es la capacidad de determinar eficazmente las metas y prioridades de sus tareas, estipulando acciones, plazos y recursos requeridos, incluyendo mecanismos de seguimiento y verificación de la información.
   Comportamientos esperados: a) Desarrolla varias tareas y/o proyectos simultáneamente sin perder el control. b) Establece prioridades y plazos para el cumplimiento de los objetivos.
</competencias_especificas_cargo>

${jobDescription ? `<descriptor_cargo>\n${jobDescription}\n</descriptor_cargo>` : ""}

${cvContext ? `<cv_candidato>\n${cvContext}\n</cv_candidato>` : ""}

<cargo>
${position}
</cargo>

Responde ÚNICAMENTE con JSON válido (sin markdown, sin backticks, sin texto adicional):
{
  "datos_postulante": {
    "adecuacion_entrevista": "string (descripción breve de cómo se presentó y comportó durante la entrevista, 2-3 líneas)"
  },
  "competencias_transversales": [
    {"nombre": "string", "definicion": "string (copia la definición del marco teórico)", "nivel_esperado": number, "nivel_observado": number, "brecha": number}
  ],
  "competencias_familia_cargo": [
    {"nombre": "string", "definicion": "string", "nivel_esperado": number, "nivel_observado": number, "brecha": number}
  ],
  "competencias_especificas": [
    {"nombre": "string", "definicion": "string", "nivel_esperado": number, "nivel_observado": number, "brecha": number}
  ],
  "fortalezas": ["string (párrafo de 4-6 líneas, mínimo 3-4 fortalezas)"],
  "aspectos_mejora": [
    {"area": "string", "descripcion": "string (párrafo de 6-10 líneas)", "sugerencia": "string (párrafo de 4-6 líneas con recomendación concreta)"}
  ],
  "resultado": "recomendable" | "recomendable_con_observaciones" | "no_recomendable",
  "justificacion": "string (3-4 líneas justificando el resultado)"
}`;
  }

  if (framework === "medico") {
    return `${baseRole}

<marco_teorico>
Nombre: Evaluación Psicolaboral Profesionales y Especialistas
Tipo de escala: Numérica (1-5) con niveles Esperado, Observado y Brecha
</marco_teorico>

<competencias_transversales>
1. ORIENTACIÓN AL PACIENTE Y TRATO HUMANIZADO (Nivel esperado: 4): Capacidad para establecer una relación empática, respetuosa y contenedora con pacientes y familias.
2. ÉTICA PROFESIONAL Y RESPONSABILIDAD SOCIAL (Nivel esperado: 3): Compromiso con los principios bioéticos de la medicina.
3. TRABAJO EN EQUIPO INTERDISCIPLINARIO (Nivel esperado: 3): Disposición para colaborar con distintos profesionales de la salud.
4. PENSAMIENTO CRÍTICO Y RAZONAMIENTO CLÍNICO (Nivel esperado: 3): Capacidad de analizar síntomas y antecedentes.
</competencias_transversales>

<competencias_distintivas>
1. CAPACIDAD DE APRENDIZAJE CONTINUO E INVESTIGACIÓN (Nivel esperado: 3)
2. COMUNICACIÓN EFECTIVA Y EDUCACIÓN AL PACIENTE (Nivel esperado: 3)
3. ORGANIZACIÓN, GESTIÓN DEL TIEMPO Y TOLERANCIA A LA PRESIÓN (Nivel esperado: 3)
4. LIDERAZGO CLÍNICO Y GESTIÓN DE RECURSOS (Nivel esperado: 3)
5. RESILIENCIA EMOCIONAL Y MANEJO DEL SUFRIMIENTO (Nivel esperado: 3)
</competencias_distintivas>

${jobDescription ? `<descriptor_cargo>\n${jobDescription}\n</descriptor_cargo>` : ""}
${cvContext ? `<cv_candidato>\n${cvContext}\n</cv_candidato>` : ""}

<cargo>${position}</cargo>

Responde ÚNICAMENTE con JSON válido (sin markdown, sin backticks):
{
  "competencias_transversales": [
    {"nombre": "string", "definicion": "string", "nivel_esperado": number, "nivel_observado": number, "brecha": number}
  ],
  "competencias_distintivas": [
    {"nombre": "string", "nivel_esperado": number, "nivel_observado": number, "brecha": number}
  ],
  "fortalezas": ["string (párrafo de 4-6 líneas, mínimo 3)"],
  "aspectos_mejora": [{"area": "string", "descripcion": "string", "sugerencia": "string"}],
  "resultado": "recomendable" | "recomendable_con_observaciones" | "no_recomendable",
  "justificacion": "string"
}`;
  }

  // industrial / comercial
  return `${baseRole}

<marco_teorico>
Nombre: Evaluación Psicolaboral ${framework === "comercial" ? "Comercial y Servicios" : "Operativos e Industriales"}
Tipo de escala: Se Ajusta / Se Ajusta con Observaciones / No se Ajusta
</marco_teorico>

${jobDescription ? `<descriptor_cargo>\n${jobDescription}\n</descriptor_cargo>` : ""}
${cvContext ? `<cv_candidato>\n${cvContext}\n</cv_candidato>` : ""}

<cargo>${position}</cargo>

Responde ÚNICAMENTE con JSON válido (sin markdown, sin backticks):
{
  "motivacion_cargo": {"ajuste": "se_ajusta"|"con_observaciones"|"no_se_ajusta", "analisis": "string"},
  "experiencia_relevante": {"ajuste": "se_ajusta"|"con_observaciones"|"no_se_ajusta", "analisis": "string"},
  "competencias": [
    {"nombre": "string", "indicadores": [{"texto": "string", "ajuste": "se_ajusta"|"con_observaciones"|"no_se_ajusta"}], "analisis_cualitativo": "string"}
  ],
  "fortalezas": ["string"],
  "aspectos_mejora": [{"area": "string", "descripcion": "string", "sugerencia": "string"}],
  "resultado": "se_ajusta" | "se_ajusta_con_observaciones" | "no_se_ajusta",
  "justificacion": "string"
}`;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { transcript, framework, position, candidate, jobDescription, cvContext } = req.body;

    if (!transcript || !framework || !position) {
      return res.status(400).json({ error: "Faltan campos: transcript, framework, position" });
    }

    const systemPrompt = buildSystemPrompt(framework, position, jobDescription || "", cvContext || "");

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

    return res.status(200).json({ success: true, analysis, framework });
  } catch (error) {
    console.error("Analysis error:", error);
    return res.status(500).json({
      error: "Error al analizar la transcripción",
      details: error.message,
    });
  }
}
