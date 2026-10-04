# LoadMatch Web Application — Plan del Sprint 2

Equipo **CargoLink Labs** · Curso 1ASI0729 Desarrollo de Aplicaciones Open Source · Angular 22

Este documento explica cómo ejecutar la Web Application, qué archivo cumple cada criterio de aceptación y cómo se
reparte el código en **15 paquetes**, uno por rama `feature/*` (GitFlow), en el mismo orden que el Sprint 2 en Jira
y con el integrante asignado a cada historia.

---

## 0. Alcance del Sprint 2

El sprint tiene **18 historias de usuario y 49 story points**. La US28 (videos) es del repositorio
`Loadmatch-landing-page`; las otras 17 están en esta aplicación.

| Orden | Historia | Jira (subtarea) | Responsable | Paquete / rama |
| --: | --- | --- | --- | --- |
| 1 | US44 Estructura del proyecto Angular por bounded context | US-64 (T12 US-77) | Harold | 01 `feature/project-setup` |
| 2 | US45 API simulada para el desarrollo del frontend | US-65 (T13 US-78) | Harold | 01 `feature/project-setup` |
| 3 | US48 Internacionalización de la Web Application | US-68 (T25 US-90) | Harold | 01 `feature/project-setup` |
| 4 | US49 Tema visual con los tokens del Design System | US-69 (T14 US-79) | Jean Fabio | 02 `feature/design-system-theme` |
| 5 | US04 Creación de solicitud de carga | US-7 (T20 US-85) | Jean Fabio | 03 `feature/publish-load-request` |
| 6 | US37 Listado de mis cargas | US-57 (T21 US-86) | Jean Fabio | 04 `feature/my-load-requests` |
| 7 | US05 Cancelación de solicitud | US-8 (T23 US-88) | Christoper | 05 `feature/cancel-and-edit-load-request` |
| 8 | US38 Edición de solicitud de carga | US-58 (T24 US-89) | Christoper | 05 `feature/cancel-and-edit-load-request` |
| 9 | US06 Búsqueda de fletes disponibles | US-10 (T22 US-87) | Harold | 06 `feature/search-available-loads` |
| 10 | US40 Detalle de un flete | US-60 (T27 US-92) | Ismael | 07 `feature/available-load-detail` |
| 11 | US42 Datos del transportista asignado | US-62 (T26 US-91) | Ismael | 08 `feature/load-request-detail` |
| — | Base de la ampliación (semilla, rutas, Trip Execution y Documents) | US44 y US45 | Harold | 09 `feature/trips-and-documents-setup` |
| 12 | US36 Dashboard de la empresa | US-56 (T28 US-93) | Marco | 10 `feature/shipper-dashboard` |
| 13 | US39 Filtros avanzados de búsqueda de fletes | US-59 (T29 US-94) | Marco | 11 `feature/advanced-load-filters` |
| 14 | US41 Mis viajes del transportista | US-61 (T30 US-95) | Christoper | 12 `feature/carrier-trips` |
| 15 | US09 Seguimiento de carga | US-14 (T32 US-97) | Ismael | 13 `feature/load-tracking` |
| 16 | US11 Historial de servicios | US-16 (T31 US-96) | Marco | 14 `feature/service-history` |
| 17 | US35 Consulta del estado de validación | US-55 (T33 US-98) | Jean Fabio | 15 `feature/document-validation-status` |
| 18 | US28 Visualización de videos del producto y del equipo | US-32 (T11 US-40) | Ismael | repositorio `Loadmatch-landing-page` |

Notas del reparto:

- **US05 y US38 (Christoper)** se separaron del formulario y de la lista: el paquete 03 publica solicitudes sin modo
  edición y el paquete 04 lista las solicitudes sin las acciones *Edit* y *Cancel*. El paquete 05 agrega el diálogo de
  cancelación, las acciones *Edit* y *Cancel* (US37 escenario 2 queda completo) y el modo edición del formulario.
- **US38 escenario 2:** el paquete 05 bloquea la edición de una solicitud que ya no está publicada; el paquete 08
  (US42) mejora ese aviso con el enlace al transportista asignado, porque la vista de detalle nace ahí.
- **Paquete 09 (Harold):** base técnica de la ampliación. Amplía la API simulada (US45: viajes con historial,
  documentos, empresa sin cargas) y la estructura por bounded context (US44: dominio, infraestructura y stores de Trip
  Execution y Document Validation, rutas con vistas placeholder, navegación y *View tracking*). Las historias 12 a 17
  solo agregan su vista.

---

## 1. Cómo ejecutar

Requisitos: Node.js ≥ 22.22.

```bash
npm install
npm run api        # API simulada (json-server 0.17.4) en http://localhost:3000/api/v1
cd server && sh start.sh   # lo mismo desde Git Bash (siempre dentro de server/)
npm start          # ng serve en http://localhost:4200
npm run build      # build de producción (sin errores ni warnings)
```

Flujo de demostración (v3):

1. En la home elige **Enter as Shipper** → *Distribuidora Andina S.A.C.*: se abre el **Dashboard** (3 publicadas,
   1 en tránsito con 1 asignada por recoger, 3 completadas y las últimas cinco operaciones; **View all** lleva a
   *My Loads*).
2. **View details** de `LR-0005` (*Assigned*) → **View tracking**: estado, ruta, recojo, transportista, placa y la
   línea de tiempo con los pasos pendientes. Desde *My Loads* abre también el seguimiento de `LR-0003`
   (*In transit*) y de `LR-0001` (*Delivered*, con *Confirm receipt* deshabilitado hasta el Sprint 3).
3. Escenario 2 de US09: abre `/shipper/tracking/7` (*Searching for vehicle*), `/shipper/tracking/6` (de otra empresa)
   o `/shipper/tracking/99` (no existe): "Tracking is not available yet for this load".
4. *My Loads*, *Publish Load* y el detalle siguen como en v2.
5. **Switch profile** → *Textiles Andinos del Sur S.A.C.*: dashboard vacío con **Publish your first load** (US36 escenario 2).
6. **Enter as Carrier** → *Jorge Luis Ramírez Huamán* → *Find Loads* → **Advanced filters**: distancia máxima del
   viaje, tipo de vehículo (fijo en *Medium truck* mientras *Only loads compatible with my vehicle* está activo),
   peso mínimo y tarifa mínima, con el contador "N loads found" → **Clear filters** (se ven los 7 fletes publicados).
   En el celular el panel se pliega con *Show filters*.
7. **My Trips**: *Upcoming* 1, *In progress* 1 (*Delayed*) y *Completed* 3 → **History**: 3 servicios, S/ 6,380.00 →
   **Documents**: 3 de 3 aprobados y el aviso "Expires on 14/10/2026 — renew it soon" del SOAT.
8. *María Elena Torres Vílchez* → **Documents**: licencia *In review*, SOAT *Expired* y tarjeta de propiedad
   *Rejected* con su motivo y *Upload file* deshabilitado. En *My Trips* ve *Delivered* e *In transit*.
9. *Pedro Quispe Mamani* (pendiente de validación) → *My Trips* e *History* vacíos con **Find loads**, y en
   **Documents** la tarjeta de propiedad como **Not uploaded**.
10. Cambia a **ES** y repite algunas pantallas: "Resumen de operaciones", "Mis viajes", "Seguimiento de LR-0003",
    "Pendiente de subir".

Flujo de v2 que sigue vigente: detalle de una solicitud *Assigned*, *In transit* o *Delivered* (transportista,
teléfono, calificación, placa, tipo y capacidad del vehículo) o *Searching for vehicle* ("No carrier has been
assigned yet", Edit y Cancel) → *Publish Load* → *Find Loads* → **View details** de un flete (calificación de la
empresa, *Accept trip* deshabilitado hasta el Sprint 3).

Para demostrar US40 escenario 2 (otro transportista tomó el flete), con la búsqueda abierta ejecuta:

```bash
curl -X PATCH -H "Content-Type: application/json" -d '{"status":"ASSIGNED"}' http://localhost:3000/api/v1/load-requests/10
```

y luego abre **View details** de `LR-0010`: la vista informa que ya no está disponible y, al volver, el flete ya
no aparece. Para deshacerlo usa `-d '{"status":"PUBLISHED"}'` o `git checkout server/db.json`. El PATCH no crea un
viaje, así que el seguimiento de `LR-0010` sigue informando que no está disponible.

- El idioma por defecto es inglés; el selector **EN | ES** de la barra superior cambia a español sin recargar.
- `json-server --watch` guarda en `server/db.json` todo lo que publiques, edites o canceles.
  Para volver a la semilla original: `git checkout server/db.json`.
- Datos semilla (**fecha de referencia: sábado 3 de octubre de 2026**). En tiempo de ejecución "hoy" es `new Date()`;
  los métodos de dominio que dependen de la fecha (`isExpired(today)`, `expiresWithinDays(days, today)`,
  `displayStatus(today)`) reciben `today` como parámetro.
  - **4 empresas**: las 3 de v2 y *Textiles Andinos del Sur S.A.C.* (id 4), sin solicitudes ni calificaciones (US36
    escenario 2). 3 transportistas (uno *Pending validation*), los 5 tipos de vehículo y 5 vehículos (Jorge Luis y
    María Elena tienen dos).
  - **21 solicitudes**: las 15 de v2 (todos los estados, recojos en octubre de 2026) y 6 históricas *Delivered*
    (`LR-0016` a `LR-0021`, recojos en agosto y septiembre de 2026, de las tres empresas).
  - **12 viajes (`trips`)**, uno por cada solicitud *Assigned*, *In transit* o *Delivered*, con `status`, fechas
    (`assignedAt`, `pickupAt`, `deliveredAt`, `confirmedAt`, `completedAt`) y su historial `history`
    (`previousStatus`, `newStatus`, `registeredAt`, del más antiguo al más reciente). Siempre con un transportista
    habilitado y un vehículo de su flota del tipo requerido y con capacidad suficiente; Pedro (pendiente) no tiene viajes.

    | Viaje | Solicitud | Empresa | Transportista (placa) | Estado del viaje |
    | --- | --- | --- | --- | --- |
    | 1 | `LR-0001` | Distribuidora Andina | María Elena (B9M-207) | `DELIVERED` (espera la confirmación) |
    | 2 | `LR-0002` | Ferretería Industrial Sur | María Elena (B9M-207) | `COMPLETED` |
    | 3 | `LR-0003` | Distribuidora Andina | María Elena (B7K-482) | `IN_TRANSIT` |
    | 4 | `LR-0005` | Distribuidora Andina | María Elena (B7K-482) | `ASSIGNED` |
    | 5 | `LR-0006` | Agroexportadora Costa Norte | Jorge Luis (A5F-631) | `DELAYED` |
    | 6 | `LR-0009` | Agroexportadora Costa Norte | Jorge Luis (ABC-123) | `ASSIGNED` |
    | 7 a 12 | `LR-0016` a `LR-0021` | las tres empresas | Jorge Luis (7, 8, 11) y María Elena (9, 10, 12) | `COMPLETED` |

  - **3 tipos de documento** (`document-types`, todos obligatorios: licencia de conducir, SOAT y tarjeta de propiedad)
    y **9 documentos** (`documents`): Jorge Luis tiene los tres aprobados y el SOAT vence el 14/10/2026 (US35
    escenario 2); María Elena tiene una licencia aprobada que venció el 01/10/2026 y fue reemplazada por una renovada
    *In review*, el SOAT *Expired* y la tarjeta *Rejected* (`ILLEGIBLE_FILE`); Pedro tiene la licencia *In review*,
    el SOAT *Pending* y ninguna tarjeta de propiedad (**Not uploaded**).
- Si ya tienes abierta otra copia del proyecto con `npm run api` o `npm start`, deténla antes: ambas usan los
  puertos 3000 y 4200.
- **Windows:** clona el repositorio en una ruta corta (p. ej. `C:\dev\Loadmatch-frontend-application`). Con rutas
  muy largas la caché de build de Angular supera el límite de 260 caracteres y `ng build` puede cortarse con
  *Segmentation fault*. Se soluciona con una ruta más corta o con `npx ng cache clean`.
- npm 11 muestra avisos `install-scripts` (esbuild, lmdb, msgpackr-extract, @parcel/watcher): son informativos;
  el build funciona sin aprobarlos.

---

## 2. Mapa de trazabilidad

| User story / escenario | Archivos que lo cumplen |
| --- | --- |
| **US44 · Sc. 1** Estructura por bounded context y compila | `src/app/{iam, profiles, fleet, documents, freight-publishing, matching, trip-execution, payment, rating, shared}/` con las capas `domain/model`, `application`, `infrastructure`, `presentation` (`.gitkeep` en las capas vacías) · `app.routes.ts` (un `loadChildren` por contexto) · `ng build` sin errores |
| **US44 · Sc. 2** Un componente solo importa de su contexto o de `shared` | `matching/infrastructure/*` (endpoints propios para `/load-requests`, `/vehicles`, `/vehicle-types`, `/shippers`) · `freight-publishing/infrastructure/vehicle-type-options-*`, `trip-assignments-*`, `carrier-contacts-*`, `assigned-vehicles-*` · `trip-execution/infrastructure/trip-load-requests-*`, `trip-shippers-*`, `trip-carriers-*`, `trip-vehicles-*`, `trip-vehicle-types-*` (proyecciones `trip-load-request.ts`, `trip-shipper.ts`, `trip-carrier.ts`, `trip-vehicle.ts`, `trip-vehicle-type.ts`)· cada contexto exporta sus propias rutas y `app.routes.ts` las combina |
| **US45 · Sc. 1** `GET /api/v1/load-requests` → JSON con HTTP 200 | `server/db.json` (también `/trips`, `/documents` y `/document-types`) · `server/routes.json` (`/api/v1/*` → `/$1`) · `server/start.sh` · script `api` en `package.json` |
| **US45 · Sc. 2** Cambio de entorno sin modificar servicios | `src/environments/environment.ts` (producción, con `TODO` para la URL desplegada) · `environment.development.ts` · `fileReplacements` en `angular.json` · todos los `*-api-endpoint.ts` leen la URL del environment (incluidos `platformProviderTripsEndpointPath`, `platformProviderDocumentsEndpointPath` y `platformProviderDocumentTypesEndpointPath`) |
| **US49 · Sc. 1** Tema con la paleta y tipografía del Capítulo IV | `src/_theme-colors.scss` (paletas M3 generadas desde `#FE6B00`) · `src/material-theme.scss` · `src/styles.css` (tokens `--lm-*`) · `src/index.html` (Inter) |
| **US49 · Sc. 2** Botón naranja con texto navy ≥ 4.5:1 | `mat.button-overrides` en `src/material-theme.scss` · `shared/presentation/theme/design-tokens.ts` (5.98:1 y todos los pares de texto usados) |
| **US48 · Sc. 1** Cambio de idioma sin recargar | `app.config.ts` (`provideTranslateService` + `provideTranslateHttpLoader`) · `public/i18n/en.json` y `es.json` (las mismas 379 claves) · `shared/presentation/components/language-switcher/*` · pipes `localized-date`, `localized-number` y `money` (formato según el idioma) |
| **US48 · Sc. 2** Clave faltante → **el texto en inglés** como respaldo (criterio actualizado: el inglés es el idioma por defecto) | `fallbackLang: 'en'` en `app.config.ts` |
| **US04 · Sc. 1** Publicación exitosa | `freight-publishing/presentation/views/load-request-form/*` · `LoadRequest.publish()` en `load-request.entity.ts` · `Route.between()` (Haversine) · `FreightPublishingStore.publishLoadRequest()` · `components/load-request-published-dialog/*` |
| **US04 · Sc. 2** Información incompleta | `load-request-validators.ts` · `mat-error` en línea y resumen en `load-request-form.html` |
| **US37 · Sc. 1** Filtrado por estado | `freight-publishing/application/load-request-status-filter.ts` · `views/load-request-list/*` · `components/load-request-status-chip/*` (etiquetas de la tabla 4.2.2) |
| **US37 · Sc. 2** Acciones según estado | plantilla `#actions` en `load-request-list.html` (**View details** en todas las filas; Edit y Cancel solo en *Searching for vehicle*; **View tracking** habilitado como enlace a `/shipper/tracking/:id` en *Assigned*, *In transit* y *Delivered* desde la ampliación, US09) · `LoadRequest.isEditable()/isCancellable()/isTrackable()` (`isTrackable()` ahora es verdadero para `ASSIGNED`, `IN_TRANSIT` y `DELIVERED`) · `FreightPublishingStore.updateLoadRequest()/cancelLoadRequest()` |
| **US05 · Sc. 1** Cancelación antes de la asignación | `LoadRequest.cancel()/isCancellable()` · `FreightPublishingStore.cancelLoadRequest()` (PUT con `status: CANCELLED` y `cancellationReason`) · `components/cancel-load-request-dialog/*` (motivo obligatorio) · acción Cancel en `load-request-list.html` y en `load-request-detail.html` |
| **US38 · Sc. 1** Edición antes de la asignación | modo edición de `load-request-form` (ruta `load-requests/:id/edit`) · `LoadRequest.edit()` (la solicitud sigue `PUBLISHED`) · `FreightPublishingStore.updateLoadRequest()` |
| **US38 · Sc. 2** Solicitud ya asignada: no se edita y se sugiere contactar al transportista | `editBlockedLoadRequest()` en `load-request-form.ts` + bloque `load-request-form__blocked` en `load-request-form.html` (no muestra el formulario, explica el motivo y enlaza a **View assigned carrier**) · aviso "To change this request, contact the assigned carrier" en `load-request-detail.html` |
| **US42 · Sc. 1** Datos del transportista y del vehículo asignados | `freight-publishing/domain/model/assigned-carrier.ts` (+ proyecciones `trip-assignment.ts`, `carrier-contact.ts`, `assigned-vehicle.ts`) · endpoints de solo lectura `trip-assignments-*`, `carrier-contacts-*`, `assigned-vehicles-*` · `FreightPublishingApi.getAssignedCarrier()` (viaje → transportista + vehículo → nombre del tipo) · `FreightPublishingStore.assignedCarrier` y `loadAssignedCarrier()` · `views/load-request-detail/*` (ruta `/shipper/load-requests/:id`: nombre, teléfono como enlace `tel:`, calificación, placa, tipo y capacidad) · recurso `trips` en `server/db.json` |
| **US42 · Sc. 2** Solicitud aún publicada: sin transportista | `LoadRequest.hasAssignedCarrier()` · `loadAssignedCarrier()` deja `assignedCarrier` en `null` sin llamar a la API · mensaje "No carrier has been assigned yet" con Edit y Cancel en `load-request-detail.html` |
| **US06 · Sc. 1** Fletes disponibles ordenados según los criterios | `matching/domain/services/matching-service.ts` · `domain/model/{search-criteria, sort-criteria, available-load, carrier-vehicle}.ts` · `application/matching.store.ts` · `presentation/views/available-load-search/*` · `components/available-load-card/*` |
| **US06 · Sc. 2** Sin resultados | estado vacío "No available loads found" en `available-load-search.html` |
| **US40 · Sc. 1** Detalle del flete con la calificación de la empresa | `matching/domain/model/load-detail.ts` (`LoadDetail.from()`) y `shipper-reference.ts` · `AvailableLoad` ampliado con `shipperId`, `status`, coordenadas de destino y dimensiones · `infrastructure/shipper-references-*` · `MatchingApi.getLoadById()/getLoadDetail()` · `MatchingStore.loadDetail` y `openLoadDetail()` · `views/available-load-detail/*` (ruta `/carrier/available-loads/:id`: origen, destino, fecha, tipo y peso de la carga, tarifa, empresa con estrellas y número; *Accept trip* deshabilitado) · **View details** de `available-load-card` como enlace |
| **US40 · Sc. 2** Flete ya tomado por otro transportista | `openLoadDetail()` siempre consulta `GET /load-requests/:id`; si ya no está `PUBLISHED` (o no existe) activa `detailUnavailable` y lo quita de `availableLoads` · mensaje "This load is no longer available" con **Back to Find Loads** |
| **US36 · Sc. 1** Resumen con operaciones | `freight-publishing/presentation/views/shipper-dashboard/*` (ruta `/shipper/dashboard`, **nueva página de inicio de la empresa**: figuras *Published* = `PUBLISHED`, *In transit* = `IN_TRANSIT` con las *Assigned* como dato menor, y *Completed* = `DELIVERED`, el estado final de la solicitud; las **últimas cinco operaciones** por `createdAt` con ID, ruta, recojo, `load-request-status-chip` y enlace a `/shipper/load-requests/:id`; **View all** a *My Loads*) · `FreightPublishingStore.countByStatus` y `latestLoadRequests(count)` · `freight-publishing.routes.ts` (`/shipper` redirige a `dashboard`) · `profile-chooser.ts` (*Enter as Shipper* abre el dashboard) · `layout.ts` (*Dashboard* en el menú) |
| **US36 · Sc. 2** Empresa sin operaciones | bloque vacío "You don't have any loads yet" con **Publish your first load** (a `/shipper/load-requests/new`) y sin figuras vacías en `shipper-dashboard.html` · empresa 4 *Textiles Andinos del Sur S.A.C.* en `server/db.json` · `profile-chooser.html` (empresa sin calificaciones: "No ratings yet") |
| **US39 · Sc. 1** Aplicación de filtros | `matching/domain/model/search-criteria.ts` (`maxTripDistanceKm`, `vehicleTypeId`, `minWeightKg`, `minRateAmount`, inmutables con `with()`; la distancia de US39 es la **del viaje** porque el radio ya limita la distancia al transportista) · `MatchingService.findNearbyLoads()` (todos los criterios a la vez; con *Only loads compatible with my vehicle* activo el tipo es el de la unidad y el filtro de tipo se ignora) · `MatchingStore.vehicleTypeFixed` · panel **Advanced filters** en `available-load-search.*` (en línea en escritorio, plegable con *Show filters* en el celular; selector de tipo deshabilitado con una pista mientras la compatibilidad está activa) y el contador "N loads found" |
| **US39 · Sc. 2** Limpieza de filtros | `SearchCriteria.clearFilters()` (limpia los cuatro filtros, radio "Any distance" y compatibilidad apagada; conserva ubicación y orden) y `showsAllLoads()` · `MatchingStore.clearFilters()` · botón **Clear filters** siempre visible y deshabilitado cuando ya se ven todos los fletes publicados |
| **US41 · Sc. 1** Listado de viajes | `trip-execution/domain/model/trip.entity.ts` (`Trip` con `history`, `isUpcoming()`, `isInProgress()`, `isCompleted()`, `lastStatusChange()`), `trip-status.ts` (`TripStatus`, `TripGroup`, `tripGroupOf()`), `trip-status-change.ts` (proyección de `TripStatusHistory`), proyecciones `trip-load-request.ts`, `trip-shipper.ts`, `trip-vehicle.ts`, read model `trip-overview.ts` · `TripExecutionApi.getCarrierTrips()` · `TripExecutionStore.trips`, `tripsByGroup`, `listedTripCount`, `loadCarrierTrips()` · `views/carrier-trips/*` (ruta `/carrier/trips`: pestañas *Upcoming* = `ASSIGNED`, *In progress* = `EN_ROUTE_TO_PICKUP` … `DISPUTED` y *Completed* = `COMPLETED` con su conteo; código `LR-0000`, fecha de recojo o de finalización, ruta, empresa, `trip-status-chip` y placa; los `CANCELLED` no se listan) · `components/trip-status-chip/*` (etiquetas agrupadas de la tabla 4.2.2) |
| **US41 · Sc. 2** Sin viajes aceptados | `listedTripCount` en 0 → "You don't have any trips yet" con **Find loads** (a `/carrier/available-loads`) en `carrier-trips.html`, y un mensaje vacío por pestaña · Pedro (transportista 3) sin viajes en la semilla |
| **US11 · Sc. 1** Visualización de historial | `TripExecutionStore.completedTrips` (viajes `COMPLETED` del más reciente al más antiguo por `completedAt`) y `completedTripsTotal` · `views/service-history/*` (ruta `/carrier/trips/history`: fecha de finalización, ruta, empresa, distancia, tarifa con el pipe `money` y *Completed*; resumen "N services · S/ total"; estado vacío para Pedro) · viajes 2 y 7 a 12 de la semilla |
| **US09 · Sc. 1** Consulta de seguimiento | `Trip.pendingStatuses()` y `NORMAL_TRIP_FLOW` · `TripExecutionApi.getLoadRequest()` y `getActiveTripOfLoadRequest()` (proyecciones `trip-carrier.ts`, `trip-vehicle.ts`, `trip-vehicle-type.ts`) · `TripExecutionStore.loadTrackingByLoadRequest()`, `trackedTrip`, `trackedLoadRequest` · `views/load-tracking/*` (ruta `/shipper/tracking/:loadRequestId`: chip de estado, ruta con distritos, direcciones y distancia, recojo, carga, transportista, placa y tipo, y una **línea de tiempo vertical** con una clave por estado exacto `trip-status-step.*`, fecha y hora, y los pasos pendientes del flujo normal; sin mapa, GPS ni acciones del transportista; *Confirm receipt* deshabilitado para *Delivered*) · **View tracking** como enlace en `load-request-list.html` y `load-request-detail.html` · `LoadRequest.isTrackable()` = `ASSIGNED`, `IN_TRANSIT`, `DELIVERED` |
| **US09 · Sc. 2** Viaje no disponible para seguimiento | el store informa "no disponible" (sin error) cuando la solicitud no existe, es de otra empresa o no tiene viaje (`trackedTrip` en `null`; un viaje `CANCELLED` no cuenta) · mensaje "Tracking is not available yet for this load" con botón al detalle de la solicitud (si es de la empresa) o a *My Loads* en `load-tracking.html` |
| **US35 · Sc. 1** Documentos en distintos estados | `documents/domain/model/document.entity.ts` (`isExpired(today)`, `expiresWithinDays(days, today)`, `displayStatus(today)`: un documento aprobado y vencido se muestra *Expired*), `document-type.entity.ts`, `validation-status.ts`, `rejection-reason.ts`, read model `required-document.ts` (una fila por tipo obligatorio con el último documento; sin registro = **Not uploaded**) · `infrastructure/*` (fechas de calendario sin desfase de zona horaria) · `DocumentsStore.requiredDocuments`, `loadCarrierDocuments()` · `views/document-validation-status/*` (ruta `/carrier/documents`: tipo traducido por código, estado, vencimiento, subida, motivo del rechazo traducido por código con respaldo a la descripción, "What to do" como texto y *Upload file* deshabilitado hasta el Sprint 3; resumen "N of 3 documents approved") · `components/validation-status-chip/*` · `shared/presentation/pipes/catalog-label.pipe.ts` |
| **US35 · Sc. 2** Documento próximo a vencer | `Document.expiresSoon(today)` y `EXPIRATION_WARNING_DAYS = 15` · aviso "Expires on 14/10/2026 — renew it soon" con el pipe `localized-date` en `document-validation-status.html` · SOAT de Jorge Luis en la semilla |

**Rutas y navegación de la ampliación:** `app.routes.ts` monta `/shipper` con las rutas de Freight Publishing y las
rutas de empresa de Trip Execution (`tripExecutionShipperRoutes`), y `/carrier` con las de Matching, las de
transportista de Trip Execution (`tripExecutionCarrierRoutes`) y las de Document Validation (`documentsRoutes`), como
hijos con ruta vacía. El menú (`layout.ts`, etiquetas de la sección 4.2.5) muestra
*Dashboard*, *My Loads* y *Publish Load* a la empresa, y *Find Loads*, *My Trips*, *History* y *Documents* al
transportista: la 4.2.5 llama "Mi Perfil" a esa sección, pero el perfil (US32) es del Sprint 3.

**Regla de idioma de los datos (acordada para el Sprint 3, ya aplicada a los datos nuevos):** los catálogos y
códigos se traducen con claves i18n (`trip-status.*`, `trip-status-step.*`, `validation-status.*`, `document-type.*`,
`document-rejection.*`); `catalogLabel` usa la descripción guardada si falta la clave. El texto libre que escriben los
usuarios (direcciones, tipo de carga, nombres de archivo) se muestra tal cual. La semilla de v2 no se cambió.

Decisión temporal (sin login en el Sprint 2): `shared/application/active-profile.store.ts` +
`profiles/presentation/components/profile-chooser/*` + botón **Switch profile** del `layout`.
Se reemplazan por el store de IAM en el Sprint 3.

---

## 3. Reparto por paquetes (GitFlow)

Cada paquete es un zip `NN-INICIALES-rama.zip` con dos cosas:

- `archivos/`: los archivos de esa rama tal como deben quedar, en sus rutas del proyecto.
- `GUIA.md`: los comandos exactos (Git Bash) para crear la rama, copiar los archivos, hacer cada commit,
  compilar, subir la rama y abrir el Pull Request.

**Regla de orden:** los paquetes se aplican **en orden (01 → 15)**. Cada uno empieza desde `develop` actualizado
**después** de fusionar el Pull Request del anterior. Así ningún paquete pisa el trabajo de otro y no hay conflictos
(varios paquetes actualizan `en.json`, `es.json`, `app.routes.ts` o `server/db.json`).

| Paquete | Responsable | Rama | Historias |
| --- | --- | --- | --- |
| 01 | Harold | `feature/project-setup` | US44, US45, US48 |
| 02 | Jean Fabio | `feature/design-system-theme` | US49 |
| 03 | Jean Fabio | `feature/publish-load-request` | US04 |
| 04 | Jean Fabio | `feature/my-load-requests` | US37 |
| 05 | Christoper | `feature/cancel-and-edit-load-request` | US05, US38 |
| 06 | Harold | `feature/search-available-loads` | US06 |
| 07 | Ismael | `feature/available-load-detail` | US40 |
| 08 | Ismael | `feature/load-request-detail` | US42 |
| 09 | Harold | `feature/trips-and-documents-setup` | base de US36, US39, US41, US09, US11, US35 |
| 10 | Marco | `feature/shipper-dashboard` | US36 |
| 11 | Marco | `feature/advanced-load-filters` | US39 |
| 12 | Christoper | `feature/carrier-trips` | US41 |
| 13 | Ismael | `feature/load-tracking` | US09 |
| 14 | Marco | `feature/service-history` | US11 |
| 15 | Jean Fabio | `feature/document-validation-status` | US35 |

**Pull Requests:** en GitHub, **Compare & pull request** → base `develop`, compare la rama del paquete → título con
la subtarea (por ejemplo `T20 (US-85) Publish load request`) → revisión de un compañero → **Create a merge commit**
(nunca *Squash and merge*). Al fusionarlo, avisa al responsable del paquete siguiente. La subtarea de Jira se cierra
enlazando el PR.

**Pruebas:** cada componente se sube con su `.spec.ts`, el archivo que Angular genera con `ng g c` (un test
*should create*), como en el proyecto del profesor. Antes de cada `git push` se ejecuta `npm run build`.

**Verificación:** los 15 paquetes se aplicaron en orden sobre un repositorio de prueba siguiendo su `GUIA.md`,
con la fusión de cada rama en `develop`. Cada rama compila con `ng build`, termina con `git status` limpio y el
resultado final es idéntico al proyecto completo.

---

## 4. Limitaciones conocidas y pendientes para el Sprint 3

- **Sin login:** la elección de perfil demo (`ActiveProfileStore`, `ProfileChooser`, *Switch profile*) es temporal.
  En el Sprint 3 llegan IAM (US01–US03, US29), guards por rol (US46) e interceptor JWT (US47); entonces las vistas
  dejan de mostrar el aviso `ProfileRequired` y los guards redirigen.
- **API desplegada:** `src/environments/environment.ts` aún apunta a json-server (`TODO(sprint-3)`); debe apuntar
  a la URL pública del backend para GitHub Pages.
- **Viajes y documentos solo de lectura (escrituras en el Sprint 3):** `trips`, `documents` y `document-types` son
  semilla y las seis historias de la ampliación solo los leen. Aceptar un flete y crear su viaje (US07), actualizar el
  estado del viaje (US08), reportar incidentes (US52), cancelar un viaje aceptado (US55), confirmar u observar la
  entrega (US56; *Confirm receipt* deshabilitado en el seguimiento), subir documentos (US34; *Upload file*
  deshabilitado), calificar (US10), pagar (US20) y notificar (US43) llegan en el Sprint 3. Hasta entonces, cambiar el
  estado de una solicitud a mano (PATCH) no crea ni actualiza su viaje.
- **Reglas que son del backend:** la finalización automática 24 horas después de la entrega (US56), las suspensiones
  por documentos vencidos o rechazados y la detección de duplicados no se implementan en el frontend. Por eso el viaje
  de `LR-0001` sigue *Delivered* esperando la confirmación aunque se entregó el 22/09/2026, y el SOAT vencido de María
  Elena no la suspende. El frontend solo **lee** el estado (`isExpired(today)`, `expiresWithinDays(days, today)`,
  `displayStatus(today)`, agrupar viajes por estado).
- **Composición en el frontend:** el transportista asignado (US42) se arma con cuatro consultas (`/trips`,
  `/carriers/:id`, `/vehicles/:id`, `/vehicle-types`), el detalle del flete (US40) con tres (`/load-requests/:id`,
  `/shippers/:id`, `/vehicle-types/:id`), *My Trips* e *History* (US41, US11) con cinco (`/trips?carrierId=`,
  `/load-requests?id=…`, `/shippers?id=…`, `/vehicles?carrierId=`, `/vehicle-types`) y el seguimiento (US09) con cinco
  (`/load-requests/:id`, `/trips?loadRequestId=`, `/carriers/:id`, `/vehicles/:id`, `/vehicle-types`). El backend
  expondrá cada una como una sola consulta; solo cambiarán los métodos de `FreightPublishingApi`, `MatchingApi` y
  `TripExecutionApi`.
- **Seguimiento sin mapa ni GPS (US09):** muestra el estado, la ruta y la línea de tiempo del historial; no hay mapa,
  ubicación en vivo, velocidad ni hora estimada de llegada. Una vista abierta no se actualiza sola (sin WebSocket).
- **US40 escenario 2:** el flete tomado se detecta al abrir su detalle (siempre se consulta de nuevo) y al volver a la
  búsqueda, que recarga la lista. Sin WebSocket ni notificaciones, una lista abierta no se actualiza sola.
- **Sin mapa ni geocodificación:** origen, destino y ubicación del transportista salen del catálogo
  `shared/domain/model/peru-locations.ts`; las distancias son en línea recta (Haversine). El backend calculará la
  distancia por carretera con Mapbox (`GeospatialService`) y el radio en `GET /api/v1/load-requests/nearby`.
- **Fuera de alcance (Sprint 3 o posterior):** aceptar viaje (US07, botón *Accept trip* deshabilitado en el detalle
  del flete), contacto con la empresa desde el detalle del flete, pagos y liquidaciones, calificaciones,
  notificaciones, descarga de reportes del historial, perfil del transportista y registro de vehículos (US32/US33).
  Mientras no exista el perfil, el menú muestra *Documents* en lugar de *Mi Perfil* (sección 4.2.5).
- **Pruebas unitarias al nivel del curso:** cada componente tiene solo el `.spec.ts` que genera Angular con `ng g c`
  (un test *should create*), sin cambios, igual que el proyecto del profesor. No se configuraron sus dependencias
  (traducciones, router, API), así que `npm test` los muestra en rojo; la aplicación no se ve afectada (los tests no
  forman parte de `ng build` ni de `ng serve`). Las pruebas completas y la automatización con GitHub Actions (US50)
  quedan para cuando se vean en el curso.
- **Fleet** no tiene vistas en este sprint (registro de vehículos: US32/US33); por eso su capa `application`
  y `presentation` solo tienen `.gitkeep`. IAM, Payment y Rating también siguen solo con `.gitkeep`.
- **Idioma de los datos (corrección planificada para el Sprint 3):** los catálogos y códigos se traducen con claves
  i18n y el texto libre se muestra tal cual. Los recursos nuevos ya cumplen la regla (estado del viaje, tipo de
  documento y motivo de rechazo se guardan como códigos y se traducen, con respaldo a la descripción guardada), pero la
  semilla de v2 todavía guarda en inglés los nombres de tipos de vehículo y los tipos de carga; se corrige en el Sprint 3.
- El idioma elegido no se guarda al recargar la página; los títulos de pestaña son estáticos (como el profesor).
- El datepicker usa `NativeDateAdapter`: elegir la fecha en el calendario funciona en ambos idiomas; escribirla
  a mano asume el formato `MM/DD/YYYY`.
- Las fechas se muestran en la hora local del navegador (en Perú, UTC−5). Las fechas de emisión y vencimiento de los
  documentos son fechas de calendario y se muestran igual en cualquier zona horaria.
