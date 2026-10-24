# Renacer · publicación de restauración jugable

Publicación autorizada por Jose («Publica», seguida de la aprobación de las mejoras y «Sigue»).

- Dirección habitual: https://sugarclash-web.vercel.app/
- Despliegue inmutable: https://sugarclash-90nx1azna-pulsarproyects.vercel.app
- Proyecto existente: `sugarclash-web`, ámbito `pulsarproyects`.
- Commit publicado: `fb9388f914714a3d448b5bd2258ae3feed71f932`. El runtime y las pruebas proceden de `fb21f33`; los commits siguientes preparan documentación y excluyen ajustes locales del paquete.
- Despliegue: `dpl_HKw68HMWzSTGKsC4gN7aeB3UjzLJ`, estado **READY**, destino **production**.
- Caché PWA: `sugarclash-renacer-v5`.

Se publicó directamente desde el checkout mediante la CLI del proyecto existente. No se hizo un push a GitHub para afirmar publicación. El resultado de Vercel confirmó el alias; después se comprobó la respuesta pública.

## Comprobación del destino

La raíz y `index.html` coinciden con el archivo local. Otros siete archivos críticos coinciden byte por byte: worker, manifest, atlas SVG nuevo, logo, paisaje, guardianesT1 y atlas de mundos. Los40 recursos de precaché devolvieronHTTP200. Los ajustes locales de agentes y `.git/config` devuelven404 y quedan fuera del paquete mediante `.vercelignore`.

[Comprobación estructurada y hashes](DEPLOYMENT_RESTORATION.json).

Se recargó la dirección habitual en el navegador y se confirmó la portada nueva. Conservó el estado existente de producción:0 guardianes,36 de miel,25 gemas y5 vidas. No se jugó campaña ni se importó guardado en producción. [Captura pública](qa/restoration-production.jpg).

## Qué contiene

Diez encuentros iniciales con seis reglas de suelo restaurable, variantes a lo largo de los80 niveles, brotes que limpian piezas y encadenan poderes, meta doble de campaña, atlas de confitería original mate y resultados con lugares concretos. Las ilustraciones Antes/Recuperado cambian de geometría: puente roto/unido, raíces secas/florecidas, cauce obstruido/libre y casa tapiada/habitable.

**97/97 pruebas**, recorrido real del motor **80/80 en92 intentos y12 derrotas**, revisión en320×640/390×844 y recarga sin servidor con una combinación real de60 puntos. [Evidencia y límites](RESTORATION_QA.md).

La validación con personas sigue pendiente: [protocolo](RESTORATION_PLAYTEST.md). Las pruebas del motor no miden diversión, retención ni resultados comerciales.
