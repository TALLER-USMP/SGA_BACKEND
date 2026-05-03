# SGA Backend - Informe Operativo, Nube y Desarrollo

Este documento deja resumido que contiene el backend, que archivos deben revisar los equipos y que se debe configurar para trabajar localmente, en GitHub y en Azure.

## Resumen Ejecutivo

El backend es una API serverless construida con Azure Functions v4, TypeScript, PostgreSQL y Drizzle ORM. Expone autenticacion con Microsoft Entra ID, gestion de usuarios/docentes, permisos, asignaciones, silabos y carga de silabos firmados a Azure Blob Storage.

Estado actual validado:

- Compila correctamente con TypeScript.
- Las pruebas de Jest pasan localmente.
- Los conflictos de rutas HTTP en Azure Functions fueron corregidos.
- La autenticacion local entre login, dashboard y backend funciona con JWT.
- CORS local queda configurado para login `5173` y dashboard `5174`.
- Existe seed de desarrollo para roles, usuarios demo y un silabo base.
- El workflow de GitHub Actions esta preparado para build, test y despliegue a Azure Functions.

## Stack Tecnico

- Runtime cloud: Azure Functions v4.
- Lenguaje: TypeScript.
- Node.js esperado: 22.
- Base de datos: PostgreSQL.
- ORM/migraciones: Drizzle ORM y Drizzle Kit.
- Autenticacion: Microsoft Entra ID + JWT propio del backend.
- Storage: Azure Blob Storage para silabos firmados.
- Tests: Jest.
- Deploy CI/CD: GitHub Actions + Azure Functions Action.

Archivos principales:

- `package.json`: scripts, dependencias y versionado.
- `tsconfig.json`: configuracion TypeScript.
- `host.json`: configuracion del runtime de Azure Functions.
- `drizzle.config.ts`: configuracion de migraciones.
- `src/db/schema.ts`: modelo de base de datos.
- `src/db/index.ts`: conexion PostgreSQL y manejo SSL.
- `src/lib/bootstrap.ts`: registro de controladores/rutas.
- `src/lib/decorators.ts`: decoradores HTTP, auth y CORS por respuesta.
- `src/functions/*`: modulos funcionales expuestos como Functions.
- `.github/workflows/azure-functions.yml`: pipeline de build, test y deploy.
- `.funcignore`: archivos excluidos del paquete de Azure Functions.
- `scripts/seed-dev.ts`: seed de desarrollo.
- `docs/DEV_SEED.md`: guia del seed.

## Modulos Funcionales

### Auth

Ubicacion:

- `src/functions/auth/controller.ts`
- `src/functions/auth/service.ts`
- `src/functions/auth/utils.ts`

Responsabilidad:

- Recibe token Microsoft desde frontend.
- Valida contra Microsoft Entra ID usando JWKS.
- Busca/crea sesion interna.
- Emite JWT propio del sistema.
- Redirige al dashboard con `token` y, cuando existe, `mailToken`.
- Valida sesion en `/api/auth/me`.

Variables relevantes:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `JWT_SECRET`
- `DASHBOARD_URL`
- `SESSION_COOKIE_NAME`
- `COOKIE_SECURE`

### Teacher

Ubicacion:

- `src/functions/teacher/controller.ts`

Responsabilidad:

- Lista docentes.
- Consulta docente por id.
- Actualiza docente.

### Permisos

Ubicacion:

- `src/functions/permisos/controller.ts`

Responsabilidad:

- Asigna permisos.
- Consulta permisos por docente.
- Actualiza permisos.

### Assignments

Ubicacion:

- `src/functions/assignments/controller.ts`

Responsabilidad:

- Lista asignaciones.
- Crea asignaciones.
- Lista cursos disponibles.

### Syllabus

Ubicacion:

- `src/functions/syllabus/controller.ts`
- `src/functions/syllabus/*`

Responsabilidad:

- Crea y actualiza silabos.
- Maneja datos generales, sumilla, competencias, componentes, actitudes, unidades, fuentes, formula de evaluacion, revision y estados.
- Expone endpoints usados por el dashboard para flujo docente, coordinador y director.

Nota tecnica:

- Las rutas dinamicas numericas usan restricciones como `{id:int}` para evitar conflictos con rutas literales como `/draft` y `/revision`.

### Director

Ubicacion:

- `src/functions/director/controller.ts`

Responsabilidad:

- Carga de silabos firmados a Azure Blob Storage.

Variables relevantes:

- `AZURE_STORAGE_CONNECTION_STRING`
- `AZURE_SIGNED_SYLLABI_CONTAINER`

## Ejecucion Local para Desarrolladores

### Requisitos

Instalar:

- Node.js 22 recomendado.
- npm.
- Azure Functions Core Tools v4.
- PostgreSQL local o acceso a base PostgreSQL de desarrollo.

Desde el repo:

```powershell
cd C:\TallerProyectos\SGA_BACKEND
npm install
```

### Configuracion Local

Crear o revisar:

- `.env`
- `local.settings.json`

Variables minimas:

```text
DATABASE_URL=postgres://usuario:password@host:puerto/database
DATABASE_SSL=false
JWT_SECRET=valor-largo-secreto
AZURE_CLIENT_ID=client-id-de-entra
AZURE_TENANT_ID=tenant-id-de-entra
DASHBOARD_URL=http://localhost:5174
LOGIN_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
SESSION_COOKIE_NAME=sessionSGA
COOKIE_SECURE=false
```

Para Azure Blob Storage local o cloud:

```text
AZURE_STORAGE_CONNECTION_STRING=...
AZURE_SIGNED_SYLLABI_CONTAINER=signed-syllabi
```

Si la funcionalidad de carga firmada no se prueba, Storage no bloquea el resto del sistema, pero en nube debe estar configurado.

### Base de Datos

Generar migraciones si se cambia schema:

```powershell
npm run db:generate
```

Aplicar migraciones:

```powershell
npm run db:migrate
```

Cargar datos de prueba:

```powershell
npm run db:seed:dev
```

El seed crea:

- Roles base: docente, indeterminado, coordinadora academica, director escuela.
- Usuarios demo.
- Silabo demo de Taller de Proyectos.
- Tokens JWT locales para validar `/api/auth/me`.

Mas detalle en:

- `docs/DEV_SEED.md`

### Levantar Backend

```powershell
npm run start
```

Puerto por defecto:

```text
http://localhost:7071/api
```

Si el puerto esta ocupado:

```powershell
npm run start -- --port 7073
```

Endpoints de prueba rapida:

```powershell
Invoke-RestMethod http://localhost:7071/api/health
Invoke-RestMethod http://localhost:7071/api/teacher
Invoke-RestMethod http://localhost:7071/api/syllabus/revision
```

### Validacion Local

Comandos recomendados antes de subir cambios:

```powershell
npm run build
npm test -- --runInBand
```

Opcional:

```powershell
npm audit --audit-level=high
```

## GitHub y CI/CD

Workflow principal:

- `.github/workflows/azure-functions.yml`

Que hace:

- Corre en `push` y `pull_request` hacia `main` y `dev`.
- Usa Node.js 22.
- Ejecuta `npm ci`.
- Ejecuta `npm run build`.
- Ejecuta `npm test -- --runInBand`.
- En `main` o `workflow_dispatch`, poda dependencias dev, empaqueta y despliega a Azure Functions.

Secrets/vars esperados:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `AZURE_FUNCTIONAPP_NAME` como variable de repo u org, si no se usa el valor por defecto.

El workflow tambien conserva compatibilidad con nombres antiguos de secretos generados por Azure:

- `AZUREAPPSERVICE_CLIENTID_*`
- `AZUREAPPSERVICE_TENANTID_*`
- `AZUREAPPSERVICE_SUBSCRIPTIONID_*`

## Consideraciones para Nube y DevSecOps

### Azure Function App

Configurar:

- Runtime: Node.js 22.
- Functions runtime: v4.
- Sistema operativo recomendado: Linux.
- App Settings con todas las variables de entorno.

App Settings minimas:

```text
DATABASE_URL
DATABASE_SSL
JWT_SECRET
AZURE_CLIENT_ID
AZURE_TENANT_ID
DASHBOARD_URL
LOGIN_URL
FRONTEND_URL
CORS_ALLOWED_ORIGINS
SESSION_COOKIE_NAME
COOKIE_SECURE
AZURE_STORAGE_CONNECTION_STRING
AZURE_SIGNED_SYLLABI_CONTAINER
```

Valores esperados en produccion:

```text
DATABASE_SSL=true
COOKIE_SECURE=true
SESSION_COOKIE_NAME=sessionSGA
```

`CORS_ALLOWED_ORIGINS` debe incluir las URLs publicas reales del login y dashboard.

### Base de Datos Azure

Configurar PostgreSQL administrado o equivalente.

Revisar:

- Acceso de red desde Azure Functions.
- SSL requerido por el servidor.
- Firewall/VNet/private endpoint, segun politica.
- Usuario con permisos suficientes para migraciones.
- Backups y retencion.

La aplicacion ya tiene logica para usar SSL cuando:

- `DATABASE_SSL=true`
- o el `DATABASE_URL` incluye parametros SSL.

### Microsoft Entra ID

Configurar App Registration:

- Application/Client ID usado por backend y frontend.
- Tenant ID.
- Redirect URIs del login y dashboard.
- Scopes requeridos por MSAL.

El backend valida tokens usando:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`

### Azure Blob Storage

Necesario para:

- `POST /api/director/syllabi/upload-signed`

Configurar:

- Storage Account.
- Container `signed-syllabi` o el indicado por `AZURE_SIGNED_SYLLABI_CONTAINER`.
- Connection string como secreto/App Setting.

### Seguridad

Recomendaciones:

- No subir `.env` ni `local.settings.json`.
- Rotar `JWT_SECRET` si fue compartido fuera de entorno seguro.
- Usar secrets de GitHub y App Settings de Azure.
- Revisar CORS con dominios exactos, no comodines.
- Separar bases de datos local, staging y produccion.
- No ejecutar `db:seed:dev` automaticamente en produccion.

## Archivos que Deben Revisar por Rol

### Nube/DevSecOps

- `.github/workflows/azure-functions.yml`
- `.funcignore`
- `host.json`
- `package.json`
- `src/db/index.ts`
- `src/functions/auth/service.ts`
- `src/functions/director/controller.ts`
- App Settings de Azure Function App.
- Secrets y variables de GitHub.

### Desarrolladores Backend

- `src/db/schema.ts`
- `drizzle.config.ts`
- `src/functions/*`
- `src/lib/bootstrap.ts`
- `src/lib/decorators.ts`
- `scripts/seed-dev.ts`
- `docs/DEV_SEED.md`

## Riesgos y Pendientes Conocidos

- Hay dependencias dev con vulnerabilidades moderadas reportadas por `npm audit`, asociadas principalmente a tooling. No se detectaron vulnerabilidades high/critical con `npm audit --audit-level=high`.
- El seed de desarrollo es funcional, pero no debe asumirse como dato oficial de produccion.
- Los roles existentes se mantienen segun el estado actual del proyecto. No se cambio la inconsistencia de rol indicada previamente por decision funcional del usuario.

## Checklist de Entrega Backend

Para desarrolladores:

- Ejecutar `npm install`.
- Configurar `.env` o `local.settings.json`.
- Ejecutar migraciones.
- Ejecutar `npm run db:seed:dev`.
- Ejecutar `npm run start`.
- Validar `health`, login y endpoints principales.

Para DevSecOps/Nube:

- Configurar Azure Function App Node 22 / Functions v4.
- Configurar App Settings.
- Configurar secrets de GitHub.
- Configurar PostgreSQL y conectividad.
- Configurar Storage para silabos firmados.
- Ejecutar workflow en rama correspondiente.
- Validar logs de Azure Functions despues del deploy.
