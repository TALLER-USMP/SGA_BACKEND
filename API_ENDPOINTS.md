# 📚 API Endpoints - SGA Backend

Documentación de los endpoints disponibles en el Sistema de Gestión Académica.

**Base URL (Development):** `http://localhost:7071/api`

---

## 🧭 Mapa rápido de Azure Functions

- `assignments_list` — GET `/assignments/`
- `auth_login` — POST `/auth/login`
- `auth_getOne` — POST `/auth/me`
- `auth_logout` — POST `/auth/logout`
- `health` — GET `/health`
- `syllabus_create` — POST `/syllabus/`
- `syllabus_update` — PUT `/syllabus/`
- `syllabus_getGeneralData` — GET `/syllabus/{syllabusId}/datos-generales`
- `syllabus_registerSumilla` — PUT `/syllabus/{id}/sumilla`
- `syllabus_listCompetencies` — GET `/syllabus/{syllabusId}/competencies`
- `syllabus_createCompetencies` — POST `/syllabus/{syllabusId}/competencies`
- `syllabus_deleteCompetency` — DELETE `/syllabus/{syllabusId}/competencies/{id}`
- `syllabus_listComponents` — GET `/syllabus/{syllabusId}/components`
- `syllabus_createComponents` — POST `/syllabus/{syllabusId}/components`
- `syllabus_deleteComponent` — DELETE `/syllabus/{syllabusId}/components/{id}`
- `syllabus_listAttitudes` — GET `/syllabus/{syllabusId}/attitudes`
- `syllabus_createAttitudes` — POST `/syllabus/{syllabusId}/attitudes`
- `syllabus_deleteAttitude` — DELETE `/syllabus/{syllabusId}/attitudes/{id}`

## 🔐 Autenticación (Auth)

### POST `/auth/login`

**Azure Function:** `auth_login`

Inicia sesión con token de Microsoft Azure AD.

**Request Body:**

```json
{
  "microsoftToken": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@usmp.pe",
    "role": 2,
    "name": "Juan Pérez"
  }
}
```

**Descripción:** Valida el token de Microsoft, crea o actualiza el usuario en la base de datos y retorna un JWT propio del sistema.

---

### POST `/auth/me`

**Azure Function:** `auth_getOne`

Obtiene información de la sesión actual del usuario autenticado.

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@usmp.pe",
    "role": 2,
    "name": "Juan Pérez"
  }
}
```

**Descripción:** Valida el token JWT actual, verifica que el usuario siga activo y retorna un token renovado con la información del usuario.

---

### POST `/auth/logout`

**Azure Function:** `auth_logout`

Cierra la sesión del usuario (invalidación del token del lado del cliente).

**Descripción:** Endpoint para cerrar sesión. La invalidación del token se maneja en el cliente.

---

## 📋 Asignaciones (Assignments)

### GET `/assignments/`

**Azure Function:** `assignments_list`

Lista los sílabos disponibles con filtros opcionales.

**Query Parameters:**

- `codigo` (string, opcional): Código del curso (búsqueda parcial, case-insensitive)
- `nombre` (string, opcional): Nombre del curso (búsqueda parcial, case-insensitive)
- `idDocente` (number, opcional): ID del docente asignado
- `idSilabo` (number, opcional): ID específico del sílabo

**Ejemplos:**

```
GET /assignments/?codigo=TEST101
GET /assignments/?nombre=Taller de Proyectos
GET /assignments/?idDocente=3
GET /assignments/?idSilabo=15
GET /assignments/?codigo=COMP&idDocente=5
```

**Response:**

```json
{
  "message": "Listado de sílabos obtenido correctamente.",
  "data": [
    {
      "cursoCodigo": "TEST101",
      "cursoNombre": "Taller de Proyectos I",
      "estadoRevision": "En revisión",
      "syllabusId": 15,
      "docenteId": 3
    }
  ]
}
```

**Descripción:** Retorna una lista de sílabos aplicando los filtros especificados. Los filtros se pueden combinar para búsquedas más específicas.

---

## 📝 Sílabos (Syllabus)

### POST `/syllabus/`

**Azure Function:** `syllabus_create`

Crea un nuevo sílabo con sus datos generales.

**Request Body:**

```json
{
  "departamentoAcademico": "Ingeniería",
  "escuelaProfesional": "Computación y Sistemas",
  "programaAcademico": "Ingeniería de Software",
  "codigoAsignatura": "CS101",
  "nombreAsignatura": "Programación I",
  "semestreAcademico": "2025-I",
  "tipoAsignatura": "Obligatorio",
  "tipoEstudios": "Pregrado",
  "modalidad": "Presencial",
  "ciclo": "I",
  "requisitos": "Ninguno",
  "horasTeoria": 4,
  "horasPractica": 2,
  "horasLaboratorio": 0,
  "horasTotales": 6,
  "creditosTeoria": 3,
  "creditosPractica": 1,
  "creditosTotales": 4
}
```

**Response:**

```json
{
  "message": "Sílabo creado exitosamente",
  "syllabusId": 25
}
```

**Descripción:** Crea un nuevo registro de sílabo en el sistema con todos los datos generales de la asignatura.

---

### PUT `/syllabus/`

**Azure Function:** `syllabus_update`

Actualiza los datos generales de un sílabo existente.

**Request Body:**

```json
{
  "id": 25,
  "nombreAsignatura": "Programación Avanzada I",
  "horasTeoria": 5,
  "creditosTotales": 5
}
```

**Descripción:** Actualiza campos específicos de un sílabo existente.

---

### GET `/syllabus/{syllabusId}/datos-generales`

**Azure Function:** `syllabus_getGeneralData`

Obtiene todos los datos generales de un sílabo específico.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo

**Response:**

```json
{
  "nombreAsignatura": "Taller de Proyectos I",
  "departamentoAcademico": "Ingeniería",
  "escuelaProfesional": "Computación y Sistemas",
  "programaAcademico": "Ingeniería de Software",
  "semestreAcademico": "2025-I",
  "tipoAsignatura": "Obligatorio",
  "tipoEstudios": "Pregrado",
  "modalidad": "Presencial",
  "codigoAsignatura": "CS301",
  "ciclo": "VI",
  "requisitos": "Taller de Proyectos 0",
  "horasTeoria": 2,
  "horasPractica": 4,
  "horasLaboratorio": 0,
  "horasTotales": 6,
  "horasTeoriaLectivaPresencial": 2,
  "horasTeoriaLectivaDistancia": 0,
  "horasTeoriaNoLectivaPresencial": 0,
  "horasTeoriaNoLectivaDistancia": 0,
  "horasPracticaLectivaPresencial": 4,
  "horasPracticaLectivaDistancia": 0,
  "horasPracticaNoLectivaPresencial": 0,
  "horasPracticaNoLectivaDistancia": 0,
  "creditosTeoria": 2,
  "creditosPractica": 2,
  "creditosTotales": 4,
  "docentes": "Juan Pérez, María García"
}
```

**Descripción:** Retorna todos los datos generales del sílabo incluyendo horas detalladas, créditos y los nombres de los docentes asignados.

---

### PUT `/syllabus/{id}/sumilla`

**Azure Function:** `syllabus_registerSumilla`

Actualiza o registra la sumilla (resumen) de un sílabo.

**Path Parameters:**

- `id` (number): ID del sílabo

**Request Body:**

```json
{
  "sumilla": "Este curso introduce los fundamentos de la programación..."
}
```

**Response:**

```json
{
  "message": "Sumilla actualizada correctamente"
}
```

**Descripción:** Actualiza el campo de sumilla del sílabo con el texto descriptivo del curso.

---

## 🎯 Competencias del Curso

### GET `/syllabus/{syllabusId}/competencies`

**Azure Function:** `syllabus_listCompetencies`

Lista todas las competencias de un sílabo.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "silaboId": 25,
      "text": "Desarrollar soluciones de software aplicando metodologías ágiles",
      "code": "COMP-01",
      "order": 1
    }
  ]
}
```

**Descripción:** Retorna la lista de competencias definidas para el curso.

---

### POST `/syllabus/{syllabusId}/competencies`

**Azure Function:** `syllabus_createCompetencies`

Crea nuevas competencias para un sílabo.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo

**Request Body:**

```json
{
  "items": [
    {
      "text": "Aplicar principios de diseño de software",
      "code": "COMP-02",
      "order": 2
    }
  ]
}
```

**Response:**

```json
{
  "message": "Competencias creadas correctamente",
  "inserted": 1
}
```

**Descripción:** Agrega una o más competencias al sílabo especificado.

---

### DELETE `/syllabus/{syllabusId}/competencies/{id}`

**Azure Function:** `syllabus_deleteCompetency`

Elimina una competencia específica.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo
- `id` (number): ID de la competencia

**Response:**

```json
{
  "message": "Competencia eliminada correctamente",
  "deleted": 1
}
```

**Descripción:** Elimina una competencia del sílabo.

---

## 🧩 Componentes de Competencias

### GET `/syllabus/{syllabusId}/components`

**Azure Function:** `syllabus_listComponents`

Lista todos los componentes de competencias de un sílabo.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo

**Response:**

```json
{
  "data": [
    {
      "id": 5,
      "silaboId": 25,
      "grupo": "COMP",
      "descripcion": "Conocimiento de estructuras de datos",
      "codigo": "C-01",
      "orden": 1
    }
  ]
}
```

**Descripción:** Retorna los componentes conceptuales, procedimentales y actitudinales de las competencias.

---

### POST `/syllabus/{syllabusId}/components`

**Azure Function:** `syllabus_createComponents`

Crea nuevos componentes de competencias.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo

**Request Body:**

```json
{
  "items": [
    {
      "text": "Aplicación de patrones de diseño",
      "code": "C-02",
      "order": 2
    }
  ]
}
```

**Descripción:** Agrega componentes de competencias al sílabo.

---

### DELETE `/syllabus/{syllabusId}/components/{id}`

**Azure Function:** `syllabus_deleteComponent`

Elimina un componente de competencia específico.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo
- `id` (number): ID del componente

**Descripción:** Elimina un componente de competencia del sílabo.

---

## 💡 Actitudes

### GET `/syllabus/{syllabusId}/attitudes`

**Azure Function:** `syllabus_listAttitudes`

Lista todas las actitudes definidas para un sílabo.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo

**Response:**

```json
{
  "data": [
    {
      "id": 8,
      "silaboId": 25,
      "grupo": "ACT",
      "descripcion": "Trabajo en equipo y colaboración",
      "codigo": "ACT-01",
      "orden": 1
    }
  ]
}
```

**Descripción:** Retorna las actitudes que se desarrollarán en el curso.

---

### POST `/syllabus/{syllabusId}/attitudes`

**Azure Function:** `syllabus_createAttitudes`

Crea nuevas actitudes para un sílabo.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo

**Request Body:**

```json
{
  "items": [
    {
      "text": "Responsabilidad y compromiso académico",
      "code": "ACT-02",
      "order": 2
    }
  ]
}
```

**Descripción:** Agrega actitudes al sílabo especificado.

---

### DELETE `/syllabus/{syllabusId}/attitudes/{id}`

**Azure Function:** `syllabus_deleteAttitude`

Elimina una actitud específica.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo
- `id` (number): ID de la actitud

**Descripción:** Elimina una actitud del sílabo.

---

## 🏥 Health Check

### GET `/health`

**Azure Function:** `health`

Verifica el estado del servicio.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2025-10-26T10:30:00Z"
}
```

**Descripción:** Endpoint para verificar que el servicio está en funcionamiento.

---

## 🔒 Autenticación y Autorización

La mayoría de los endpoints (excepto `/health` y `/auth/login`) requieren autenticación mediante JWT.

**Header requerido:**

```
Authorization: Bearer {token}
```

**Roles de usuario:**

- `1`: Administrador
- `2`: Docente
- `3`: Coordinador

---

## 📊 Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: Token inválido o no proporcionado
- `403 Forbidden`: Sin permisos suficientes
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error interno del servidor

---

## 🛠️ Tecnologías

- **Runtime**: Azure Functions (Node.js)
- **Framework**: TypeScript
- **ORM**: Drizzle ORM
- **Base de datos**: PostgreSQL
- **Validación**: Zod
- **Autenticación**: JWT + Azure AD

---

## 📝 Notas

1. Todos los endpoints que aceptan `syllabusId` validan que el sílabo exista antes de procesar la solicitud.
2. Los filtros de búsqueda en `/assignments/` son case-insensitive y soportan búsqueda parcial.
3. Los campos `code` y `order` son opcionales al crear competencias, componentes o actitudes.
4. El campo `docentes` en `/datos-generales` retorna nombres concatenados con comas si hay múltiples docentes.

---

**Última actualización**: Octubre 28, 2025
