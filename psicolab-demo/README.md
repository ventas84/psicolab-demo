# PsicoLab v2 — App Funcional con Backend Seguro

Plataforma de evaluación psicolaboral con IA. Sube una transcripción de entrevista y obtén un informe profesional generado por Claude.

## Arquitectura

```
Frontend (React/Vite)  →  Backend (Vercel Serverless)  →  Claude API
     navegador              tu servidor (seguro)          Anthropic
```

La API key NUNCA llega al navegador. El backend en Vercel maneja la comunicación con Claude de forma segura.

## Setup en Vercel

1. Sube este código a GitHub
2. Importa en Vercel
3. En **Settings → Environment Variables**, agrega:
   - `ANTHROPIC_API_KEY` = tu API key de Anthropic
4. Deploy

## Archivos

```
├── api/
│   └── analyze.js       ← Backend serverless (Claude API)
├── src/
│   ├── main.jsx
│   └── App.jsx          ← Frontend React
├── index.html
├── package.json
├── vercel.json          ← Config de Vercel
└── vite.config.js
```
