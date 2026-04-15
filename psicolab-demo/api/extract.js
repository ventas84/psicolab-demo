export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { file, filename } = req.body;

    if (!file || !filename) {
      return res.status(400).json({ error: "Faltan campos: file, filename" });
    }

    const ext = filename.toLowerCase().split(".").pop();
    const buffer = Buffer.from(file, "base64");

    let text = "";

    if (ext === "txt") {
      text = buffer.toString("utf-8");
    } else if (ext === "pdf") {
      // Use pdf-parse for PDF text extraction
      const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (ext === "docx") {
      // Use mammoth for DOCX
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (ext === "doc") {
      // For legacy .doc, try to extract what we can
      // Convert buffer to string and clean up binary artifacts
      const raw = buffer.toString("latin1");
      // Extract readable text using a simple heuristic
      text = raw.replace(/[\x00-\x1F\x80-\xFF]/g, " ").replace(/\s{2,}/g, " ").trim();
      if (text.length < 50) {
        return res.status(400).json({
          error: "No se pudo extraer texto del archivo .doc. Por favor conviértelo a .docx o .pdf primero.",
        });
      }
    } else {
      return res.status(400).json({
        error: `Formato no soportado: .${ext}. Usa PDF, DOCX o TXT.`,
      });
    }

    return res.status(200).json({ success: true, text: text.trim(), chars: text.trim().length });
  } catch (error) {
    console.error("Extract error:", error);
    return res.status(500).json({
      error: "Error al procesar el archivo",
      details: error.message,
    });
  }
}
