# CHISPA · relevo para Claude o Codex

**3 de noviembre de 2026.** Jose cambió el rumbo: quiere sustituir la experiencia de Renacer y dejó solicitado un plan completo. [CHISPA_PLAN.md](CHISPA_PLAN.md) es la fuente de verdad del próximo desarrollo. Esta entrega es documental; CHISPA aún no tiene runtime, niveles validados, usuarios ni monetización.

## Punto para retomar al cambiar de modelo

El plan y sus cinco anexos están guardados en esta carpeta. El siguiente encargo es **P01–P02: motor y una escena**, en `prototypes/chispa/index.html` cuando se inicie la implementación. P03–P09 siguen pendientes. Leer los documentos antes de actuar; el cambio de modelo no inicia el desarrollo automáticamente.

**Recomendación para esta etapa:** GPT-6.1 Sol, con razonamiento Alto para el motor, la física y sus pruebas. Es una elección de trabajo para este proyecto, no un resultado de comparar modelos sobre CHISPA. Terra puede apoyar revisiones visuales y cambios acotados; Luna, tareas pequeñas y bien delimitadas. La [guía oficial de OpenAI](https://developers.openai.com/api/docs/guides/model-selection) orienta Sol a proyectos complejos, Terra a trabajo visual y correcciones acotadas, y Luna a tareas enfocadas. Consulta: 3 de noviembre de 2026.

Para arrancar después del cambio, Jose puede decir: **«Lee docs/CHISPA_HANDOFF.md y ejecuta P01–P02 del plan»**. El prompt detallado está al final de este archivo. La recomendación no cambia ajustes de modelos ni asigna modelos a otros agentes.

## Leer antes de implementar

1. `AGENTS.md`, `CONCEPT.md` y `VISUAL_STYLE.md` en la raíz: nuevas decisiones y alcance histórico.
2. [CHISPA_PLAN.md](CHISPA_PLAN.md): contrato, fases, arquitectura y transición.
3. [CHISPA_BACKLOG.md](CHISPA_BACKLOG.md): empezar por P01–P02, sin saltar puertas de validación.
4. [CHISPA_LEVELS.md](CHISPA_LEVELS.md) y [CHISPA_VISUAL.md](CHISPA_VISUAL.md): geometría/encuentros propuestos y lectura de la escena.
5. [CHISPA_VALIDATION_BUSINESS.md](CHISPA_VALIDATION_BUSINESS.md): cuando toque reclutar, medir o elegir canal.

No cargar todos los informes de Renacer por defecto. `docs/CLAUDE_HANDOFF.md` describe su motor histórico y sólo es pertinente si hay que mantenerlo o empaquetarlo como archivo.

## Arranque y protección de datos

Abrir `/Users/jose/Downloads/sugarclash-web` y revisar `git status --short`. Conservar cambios ajenos; coordinar un solo editor del HTML. No resetear ni limpiar el repositorio para comenzar de cero.

El próximo archivo propuesto es `prototypes/chispa/index.html`. No existe por el solo hecho de estar en el plan. Crear esa carpeta al iniciar la implementación y servirla como raíz en un puerto aislado. Ejemplo **para después de crearla**:

```sh
python3 -m http.server 4211 --bind 127.0.0.1 --directory prototypes/chispa
```

Comprobar antes que el puerto esté libre. No usar4177 ni producción para partidas/fixtures de QA. No registrar service worker durante el prototipo. Las claves `sugarclash_save_v1` y `sugarclash_renacer_v1` no se escriben, borran ni convierten. El guardado nuevo previsto es `chispa_save_v1`.

Todo el nuevo runtime seguirá dentro de su HTML vanilla, sin dependencias, frameworks o bundler. Los archivos externos de contenido/arte sirven como fuentes de integración; el runtime no debe depender de descargarlos durante la partida.

## Primer encargo implementable

Construir una máquina provisional donde el primer disparo encienda un actuador, termine y gire un espejo; el segundo aproveche la nueva orientación para encender una lámpara. Mismo cálculo para preview y disparo, geometría congelada durante el tiro y resolución única. Actuador ya activo deja pasar. Deshacer/reintentar son gratuitos.

Entregar motor probado y escena real antes de producir doce niveles o arte final. Registrar limitaciones y solución exacta. Después completar P03–P05 y comprobar con personas que quieran seguir; los bots no sustituyen esa evidencia.

## Comprobar cada entrega de código

- Sintaxis del script del HTML afectado, pruebas pertinentes y `git diff --check`.
- Física/reglas: regresiones significativas y recorrido con el motor real y guardado aislado. Ninguna victoria forzada.
- Controles/vistas: navegador a320×640,390×844 y escritorio; teclado, movimiento reducido, silencio, salida y pausa. Distinguir emulación de teléfono físico.
- Guardado/PWA/publicación sólo cuando se implementen: esquemas, no escritura de claves históricas, offline/actualización, destino y versión servida.
- Si se cambia `index.html` de la raíz, aplicar además la validación obligatoria de Renacer de `AGENTS.md`. No modificarlo por comodidad durante el prototipo.

No citar las125 pruebas o el recorrido80/80 de Renacer como evidencia del motor nuevo. No anunciar una ruta, SDK, compra, jugador o despliegue que no exista.

## Prompt listo para Jose

Este texto sirve **cuando Jose decida iniciar la implementación**, no activa trabajo por sí mismo:

```text
Implementa la primera etapa del plan CHISPA de este proyecto. Lee CLAUDE.md, AGENTS.md, CONCEPT.md y VISUAL_STYLE.md; después docs/CHISPA_PLAN.md, CHISPA_BACKLOG.md, CHISPA_LEVELS.md y CHISPA_VISUAL.md.

Empieza por P01–P02 en prototypes/chispa/index.html. Construye el motor determinista y una escena donde un disparo active un mecanismo y cambie la geometría para el siguiente. Preview y resolución comparten cálculo. Reintentar y deshacer son gratis; no añadas vidas, monedas, anuncios ni compras.

Conserva oscuridad/descolorido frente a color recuperado, tono sobrio y Confite. CHISPA es nombre provisional. No alteres el runtime publicado de Renacer ni mis guardados. Usa un origen de QA aislado, conserva cambios existentes y coordina quién edita el HTML.

Ejecuta las verificaciones apropiadas, registra solución real y evidencia. Entrega esta etapa comprobada y sigue el orden y las puertas del plan. No produzcas la campaña completa antes de validar la mecánica con jugadores. No publiques ni gastes dinero como parte de este encargo.
```

No hay dependencia de memoria privada de Codex ni de credenciales compartidas. Cada herramienta conserva su autenticación habitual. Jose puede asignar tareas del backlog a cualquiera de los dos asistentes sin reexplicar el cambio de rumbo.
