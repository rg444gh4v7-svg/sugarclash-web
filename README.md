# Sugar Clash: Dulcelandia — Build Web v1

## Qué es esto

El Modo Puzzle completo, jugable de verdad, corriendo en un solo archivo HTML.
No necesita instalación, internet (excepto las fuentes la primera vez), ni configuración.

## Cómo probarlo AHORA

1. Haz doble clic en `index.html`
2. Se abre en tu navegador
3. Juega los 10 niveles de Las Tierras Carmesí

Tu progreso se guarda automáticamente en el navegador (localStorage).
Si cierras y vuelves a abrir, sigues donde lo dejaste.

## Qué incluye esta versión

- Pantalla de título con Confite animado
- Mapa de 10 niveles con sistema de estrellas y bloqueo progresivo
- Tablero match-3 completo: combos, cascadas, gravedad, caramelo especial dorado
- Confite reacciona con frases distintas según lo que hagas (combos grandes, pocos movimientos)
- Sonido "pop" sintetizado (sin archivos de audio externos)
- Progreso guardado entre sesiones

## Qué NO incluye todavía (próximos pasos)

- Arte real (usa formas de colores como placeholder — los prompts de Midjourney ya están escritos)
- Música de fondo
- Los otros 7 territorios
- Aldea, MOBA, Battle Royale, Cooperativo
- Multijugador / Firebase

## Cómo convertirlo en app real para tu teléfono (cuando esté listo)

Esto se hace con **Capacitor** (gratis, de Ionic). El proceso resumido:

```bash
npm install -g @capacitor/cli
npx cap init "Sugar Clash" "com.tunombre.sugarclash"
npx cap add android
npx cap copy
npx cap open android
```

Eso abre Android Studio con tu juego ya empaquetado como proyecto Android,
listo para generar el .apk e instalarlo en tu teléfono o subirlo a Google Play.

(Cuando lleguemos a esa fase, te doy la guía completa paso a paso.)

## Estructura

```
sugarclash-web/
├── index.html      ← todo el juego (HTML + CSS + JS en un solo archivo)
└── README.md        ← este archivo
```

Mantenerlo en un solo archivo es intencional: así es más fácil de probar,
compartir, y empaquetar con Capacitor más adelante.
