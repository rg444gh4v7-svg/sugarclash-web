# Renacer · corrección de densidad visual

21 de octubre de 2026. Petición de Jose: «Sobrecargadísima visualmente».

Pase local sobre la reconstrucción existente, conservando sus cambios sin confirmar. Sin nuevos recursos, librerías, cambios de reglas, guardado o economía. No publicado.

## Cambios

- Portada móvil con arte superior y contenido sobre una superficie tranquila; menor título, sin insignia/eslogan/pie ornamental. Guerra y Royale conservan acceso directo y dejan de repetirse en tarjetas inferiores.
- Cabecera y navegación compactas, recursos sin cápsulas y superficies sin sombras adicionales.
- Ruta más compacta: los niveles bloqueados conservan nombre, criatura y candado, pero no repiten instrucciones secundarias. Próximo nivel con un solo acento.
- Aldea con escena ambiental al 13%, desaturada; edificios interactivos con color propio y selección sin resplandor.
- Tablero con marco mate y escenario secundario. Colores/formas de piezas, poderes, pistas, tutorial y controles conservados.
- Fondos de Guerra/Royale al 32%; mismas unidades, señales de ataque, zona y reglas.

## Verificación

- JavaScript: `SYNTAX OK`.
- Suite de motor/offline/arena: 60/60 pruebas aprobadas.
- Navegador local: portada, ruta, aldea, tablero y Guerra. Revisión responsive a 390×844, 320×640 y 1280×720, no un iPhone físico.
- A 320×640: ancho del documento 320px; tablero termina en y=541, herramientas en y=594 y mensaje contextual en y=625. Sin recorte del tablero ni controles fuera del alto de 640px.
- A 1280×720: documento sin desbordamiento horizontal.
- No se repite el recorrido 80/80: no hay cambios de dificultad, metas ni progresión. Las pruebas de acceso a los 80 niveles siguen aprobadas.
