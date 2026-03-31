# PsicoLab — Demo de Evaluación Psicolaboral con IA

Prototipo funcional de plataforma de evaluación psicolaboral automatizada.

## 🚀 Deploy en Vercel (paso a paso)

### Paso 1: Crear cuenta en GitHub
1. Ve a **github.com** y haz clic en **Sign up**
2. Usa tu correo, crea un nombre de usuario y contraseña
3. Confirma tu correo

### Paso 2: Crear un repositorio nuevo
1. Ya logueado en GitHub, haz clic en el botón **+** arriba a la derecha → **New repository**
2. Ponle nombre: `psicolab-demo`
3. Déjalo como **Public**
4. **NO** marques "Add a README" (ya tenemos uno)
5. Haz clic en **Create repository**

### Paso 3: Subir el código
Tienes dos opciones:

#### Opción A — Subir archivos desde la web (más fácil)
1. En tu repo recién creado, haz clic en **"uploading an existing file"**
2. Arrastra TODOS los archivos de esta carpeta (incluyendo la carpeta `src/`)
3. Haz clic en **Commit changes**

#### Opción B — Usar Git desde terminal (si tienes Git instalado)
```bash
cd psicolab-demo
git init
git add .
git commit -m "PsicoLab demo inicial"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/psicolab-demo.git
git push -u origin main
```

### Paso 4: Conectar con Vercel
1. Ve a **vercel.com** y haz clic en **Sign Up**
2. Elige **Continue with GitHub** (usa tu cuenta recién creada)
3. Autoriza Vercel para acceder a tus repositorios
4. Haz clic en **Add New... → Project**
5. Busca y selecciona **psicolab-demo**
6. En la configuración:
   - **Framework Preset:** Vite (debería detectarlo automáticamente)
   - Deja todo lo demás por defecto
7. Haz clic en **Deploy**
8. ¡En ~60 segundos tendrás tu URL! → `psicolab-demo.vercel.app`

### Paso 5: Compartir con tu cliente
- Copia la URL que Vercel te da
- Envíala por correo, WhatsApp o donde quieras
- Tu cliente la abre en cualquier navegador, celular o computador

## 🔧 Desarrollo local

Si quieres modificar cosas antes de subir:

```bash
npm install
npm run dev
```

Se abre en `http://localhost:5173`

## 📁 Estructura del proyecto

```
psicolab-demo/
├── index.html          # Punto de entrada
├── package.json        # Dependencias
├── vite.config.js      # Configuración de Vite
├── src/
│   ├── main.jsx        # Bootstrap de React
│   └── App.jsx         # Toda la aplicación
└── README.md           # Este archivo
```

## ✨ Características de la demo

- **Panel de Control** — Métricas y accesos rápidos
- **Nueva Entrevista** — Flujo completo: datos → videollamada → transcripción → generación IA
- **Gestión de Cargos** — CRUD de perfiles con competencias
- **Marcos Teóricos** — 4 frameworks configurados (Médico, Industrial, Comercial, Personalizado)
- **Informes** — Dos formatos reales: médico (escala numérica) e industrial (escala de ajuste)
- **Responsive** — Funciona en celular y computador
