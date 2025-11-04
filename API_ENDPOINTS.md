# 📚 API Endpoints - SGA Backend

Documentación completa de todos los endpoints disponibles en el Sistema de Gestión Académica (SGA).

**Base URL (Development):** `http://localhost:7071/api`
**Base URL (Production):** `https://your-function-app.azurewebsites.net/api`

---

## 📑 Tabla de Contenidos

1. [🏥 Health Check](#-health-check)
2. [🔐 Autenticación (Auth)](#-autenticación-auth)
3. [📋 Asignaciones (Assignments)](#-asignaciones-assignments)
4. [👨‍🏫 Profesores (Teacher)](#-profesores-teacher)
5. [📝 Sílabos (Syllabus)](#-sílabos-syllabus)
   - [Datos Generales](#sección-i-datos-generales)
   - [Sumilla](#sección-ii-sumilla)
   - [Competencias y Componentes](#sección-iii-competencias-y-componentes)
   - [Unidades](#sección-iv-programación-de-contenidos-unidades)
   - [Estrategias Metodológicas](#sección-v-estrategias-metodológicas)
   - [Recursos Didácticos](#sección-vi-recursos-didácticos)
   - [Evaluación](#sección-vii-evaluación)
   - [Fuentes Bibliográficas](#sección-viii-fuentes-bibliográficas)
   - [Aportes a Resultados](#sección-ix-aportes-a-resultados-del-programa)
   - [Revisión y Aprobación](#revisión-y-aprobación)
6. [📚 Programación de Contenidos](#-programación-de-contenidos)
7. [🔒 Permisos](#-permisos)

---

## 🏥 Health Check

### GET `/health`

**Descripción:** Verifica el estado del servicio y la conexión a la base de datos.

**Response:**

```json
{
  "message": "Api healthy",
  "response": [{ "version": "PostgreSQL 14.5..." }]
}
```

**Uso:** Endpoint público para monitoreo y health checks. No requiere autenticación.

---

## 🔐 Autenticación (Auth)

### POST `/auth/login`

**Descripción:** Inicia sesión con token de Microsoft Azure AD.

**Request Body:**

```json
{
  "microsoftToken": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "mailToken": "optional_mail_token"
}
```

**Response:**

```json
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": 1,
    "email": "usuario@usmp.pe",
    "role": 2,
    "name": "Juan Pérez"
  },
  "url": "https://dashboard.url/?token=...&mailToken=..."
}
```

**Uso:** Valida el token de Microsoft, crea o actualiza el usuario en la base de datos y retorna un JWT propio del sistema con URL de redirección al dashboard.

---

### POST `/auth/me`

**Descripción:** Obtiene información de la sesión actual del usuario autenticado.

**Headers/Query/Body (cualquiera):**

```
Authorization: Bearer {token}
// O
?token={token}
// O
{ "token": "{token}" }
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

**Uso:** Valida el token JWT actual, verifica que el usuario siga activo y retorna un token renovado con la información del usuario. Acepta el token por header, query param o body.

---

### POST `/auth/logout`

**Descripción:** Cierra la sesión del usuario.

**Response:**

```json
{
  "message": "Sesión cerrada"
}
```

**Uso:** Invalida la cookie de sesión del lado del servidor. El cliente debe eliminar el token almacenado localmente.

---

## 📋 Asignaciones (Assignments)

### GET `/assignments/`

**Descripción:** Lista los sílabos disponibles con filtros opcionales.

**Query Parameters:**

- `codigo` (string, opcional): Código del curso (búsqueda parcial, case-insensitive)
- `nombre` (string, opcional): Nombre del curso (búsqueda parcial, case-insensitive)
- `idDocente` (number, opcional): ID del docente asignado
- `idSilabo` (number, opcional): ID específico del sílabo
- `areaCurricular` (string, opcional): Área curricular del curso

**Ejemplos:**

```
GET /api/assignments/?codigo=TEST101
GET /api/assignments/?nombre=Taller de Proyectos
GET /api/assignments/?idDocente=3
GET /api/assignments/?areaCurricular=Ingeniería
```

**Response:**

```json
{
  "message": "Listado de sílabos obtenido correctamente.",
  "data": [
    {
      "cursoCodigo": "TEST101",
      "cursoNombre": "Taller de Proyectos I",
      "estadoRevision": "PENDIENTE",
      "syllabusId": 15,
      "docenteId": 3
    }
  ]
}
```

**Uso:** Retorna una lista de sílabos aplicando los filtros especificados. Los filtros se pueden combinar para búsquedas más específicas.

---

### GET `/assignments/courses`

**Descripción:** Obtiene la lista completa de cursos con su estado de revisión.

**Response:**

```json
{
  "success": true,
  "message": "Lista de cursos obtenida correctamente.",
  "data": [
    {
      "id": 1,
      "codigo": "CS101",
      "nombre": "Programación I",
      "estadoRevision": "APROBADO"
    }
  ]
}
```

**Uso:** Endpoint para obtener todos los cursos disponibles en el sistema con su estado de revisión actual.

---

### POST `/assignments/`

**Descripción:** Crea una nueva asignación de sílabo a un docente.

**Request Body:**

```json
{
  "docenteId": 5,
  "cursoId": 10,
  "semestreAcademico": "2025-I"
}
```

**Response:**

```json
{
  "message": "Asignación creada correctamente."
}
```

**Uso:** Asigna un curso a un docente para un semestre académico específico.

---

## �‍🏫 Profesores (Teacher)

### GET `/teacher/`

**Descripción:** Lista todos los profesores registrados en el sistema.

**Response:**

```json
{
  "success": true,
  "message": "Lista de profesores obtenida correctamente",
  "data": [
    {
      "id": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "correo": "jperez@usmp.pe",
      "grado": "Doctor",
      "telefono": "987654321"
    }
  ],
  "total": 15
}
```

**Uso:** Obtiene la lista completa de profesores. Requiere rol de administrador o coordinador.

---

### GET `/teacher/{teacherId}`

**Descripción:** Obtiene el perfil completo de un profesor específico.

**Path Parameters:**

- `teacherId` (number): ID del profesor

**Response:**

```json
{
  "success": true,
  "data": {
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "jperez@usmp.pe",
    "grado": "Doctor",
    "telefono": "987654321",
    "bachiller": "Universidad Nacional"
  }
}
```

**Uso:** Retorna información detallada del perfil de un profesor incluyendo grado académico, contacto y formación.

---

### PUT `/teacher/{teacherId}`

**Descripción:** Actualiza el perfil de un profesor.

**Path Parameters:**

- `teacherId` (number): ID del profesor

**Request Body:**

```json
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez García",
  "correo": "jcperez@usmp.pe",
  "telefono": "998765432",
  "grado": "Doctor en Ciencias",
  "gradoAcademicoId": 5
}
```

**Response:**

```json
{
  "message": "Perfil actualizado correctamente",
  "data": {
    "nombre": "Juan Carlos",
    "apellido": "Pérez García",
    "correo": "jcperez@usmp.pe",
    "telefono": "998765432",
    "grado": "Doctor en Ciencias"
  }
}
```

**Uso:** Actualiza los datos del perfil del profesor. El teléfono debe tener 9 dígitos y empezar con 9 (formato peruano).

---

## 📝 Sílabos (Syllabus)

### POST `/syllabus/`

**Descripción:** Crea un nuevo sílabo con sus datos generales.

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

**Uso:** Crea un nuevo registro de sílabo en el sistema con todos los datos generales de la asignatura.

---

### PUT `/syllabus/`

**Descripción:** Actualización genérica de sílabo (no implementado).

**Response:**

```json
{
  "status": 501,
  "message": "Not implemented"
}
```

**Uso:** Endpoint reservado para futuras implementaciones.

---

### GET `/syllabus/{id}/complete`

**Descripción:** Obtiene el sílabo completo con todas sus secciones.

**Path Parameters:**

- `id` (number): ID del sílabo

**Response:**

```json
{
  "message": "Sílabo completo obtenido correctamente",
  "data": {
    "datosGenerales": { ... },
    "sumilla": { ... },
    "competencias": [ ... ],
    "unidades": [ ... ],
    "fuentes": [ ... ]
  }
}
```

**Uso:** Retorna toda la información del sílabo en una sola respuesta, útil para generar PDFs o vistas completas.

---

### PUT `/syllabus/{syllabusId}/state`

**Descripción:** Actualiza el estado de revisión del sílabo.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo

**Request Body:**

```json
{
  "estadoRevision": "REVISION"
}
```

**Response:**

```json
{
  "message": "Estado actualizado correctamente"
}
```

**Uso:** Cambia el estado de revisión del sílabo (PENDIENTE, REVISION, APROBADO, RECHAZADO).

---

### Sección I: Datos Generales

#### GET `/syllabus/{syllabusId}/datos-generales`

**Descripción:** Obtiene todos los datos generales de un sílabo específico.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo

**Response:**

```json
{
  "nombreAsignatura": "Taller de Proyectos I",
  "departamentoAcademico": "Ingeniería",
  "escuelaProfesional": "Computación y Sistemas",
  "semestreAcademico": "2025-I",
  "ciclo": "VI",
  "horasTeoria": 2,
  "horasPractica": 4,
  "creditosTotales": 4,
  "docentes": "Juan Pérez, María García"
}
```

**Uso:** Retorna todos los datos generales del sílabo incluyendo horas detalladas, créditos y los nombres de los docentes asignados.

---

#### PUT `/syllabus/{id}/datos-generales`

**Descripción:** Actualiza los datos generales de un sílabo.

**Path Parameters:**

- `id` (number): ID del sílabo

**Request Body:**

```json
{
  "nombreAsignatura": "Programación Avanzada I",
  "horasTeoria": 5,
  "horasPractica": 3,
  "creditosTotales": 5
}
```

**Response:**

```json
{
  "message": "Datos generales actualizados correctamente"
}
```

**Uso:** Actualiza campos específicos de los datos generales del sílabo.

---

### Sección II: Sumilla

#### GET `/syllabus/{silaboId}/sumilla`

**Descripción:** Obtiene la sumilla (resumen) de un sílabo.

**Path Parameters:**

- `silaboId` (number): ID del sílabo

**Response:**

```json
{
  "message": "Sumilla obtenida correctamente",
  "data": {
    "sumilla": "Este curso introduce los fundamentos de la programación..."
  }
}
```

**Uso:** Retorna el texto descriptivo del curso que resume su propósito y contenido.

---

#### POST `/syllabus/{id}/sumilla`

**Descripción:** Crea la sumilla de un sílabo.

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
  "message": "Sumilla creada correctamente"
}
```

**Uso:** Crea el campo de sumilla del sílabo con el texto descriptivo del curso.

---

#### PUT `/syllabus/{id}/sumilla`

**Descripción:** Actualiza la sumilla de un sílabo.

**Path Parameters:**

- `id` (number): ID del sílabo

**Request Body:**

```json
{
  "sumilla": "Este curso introduce los fundamentos avanzados de la programación..."
}
```

**Response:**

```json
{
  "message": "Sumilla actualizada correctamente"
}
```

**Uso:** Actualiza el texto descriptivo del curso.

---

### Sección III: Competencias y Componentes

#### GET `/syllabus/{syllabusId}/competencies`

**Descripción:** Lista todas las competencias del curso.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo

**Response:**

```json
{
  "items": [
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

**Uso:** Retorna la lista de competencias definidas para el curso.

---

#### POST `/syllabus/{syllabusId}/competencies`

**Descripción:** Crea nuevas competencias para un sílabo.

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

**Uso:** Agrega una o más competencias al sílabo especificado.

---

#### DELETE `/syllabus/{syllabusId}/competencies/{id}`

**Descripción:** Elimina una competencia específica.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo
- `id` (number): ID de la competencia

**Response:**

```json
{
  "message": "Competencia eliminada correctamente"
}
```

**Uso:** Elimina una competencia del sílabo.

---

#### GET `/syllabus/{syllabusId}/components`

**Descripción:** Lista todos los componentes/capacidades de competencias.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo

**Response:**

```json
{
  "items": [
    {
      "id": 5,
      "silaboId": 25,
      "descripcion": "Conocimiento de estructuras de datos",
      "codigo": "C-01"
    }
  ]
}
```

**Uso:** Retorna los componentes conceptuales y procedimentales de las competencias.

---

#### POST `/syllabus/{syllabusId}/components`

**Descripción:** Crea nuevos componentes de competencias.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo

**Request Body:**

```json
{
  "items": [
    {
      "text": "Aplicación de patrones de diseño",
      "code": "C-02"
    }
  ]
}
```

**Response:**

```json
{
  "message": "Componentes creados correctamente"
}
```

**Uso:** Agrega componentes de competencias al sílabo.

---

#### DELETE `/syllabus/{syllabusId}/components/{id}`

**Descripción:** Elimina un componente de competencia.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo
- `id` (number): ID del componente

**Uso:** Elimina un componente de competencia del sílabo.

---

#### GET `/syllabus/{syllabusId}/attitudes`

**Descripción:** Lista todas las actitudes definidas para un sílabo.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo

**Response:**

```json
{
  "items": [
    {
      "id": 8,
      "silaboId": 25,
      "descripcion": "Trabajo en equipo y colaboración",
      "codigo": "ACT-01"
    }
  ]
}
```

**Uso:** Retorna las actitudes que se desarrollarán en el curso.

---

#### POST `/syllabus/{syllabusId}/attitudes`

**Descripción:** Crea nuevas actitudes para un sílabo.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo

**Request Body:**

```json
{
  "items": [
    {
      "text": "Responsabilidad y compromiso académico",
      "code": "ACT-02"
    }
  ]
}
```

**Response:**

```json
{
  "message": "Actitudes creadas correctamente"
}
```

**Uso:** Agrega actitudes al sílabo especificado.

---

#### DELETE `/syllabus/{syllabusId}/attitudes/{id}`

**Descripción:** Elimina una actitud específica.

**Path Parameters:**

- `syllabusId` (number): ID del sílabo
- `id` (number): ID de la actitud

**Uso:** Elimina una actitud del sílabo.

---

### Sección IV: Programación de Contenidos (Unidades)

#### GET `/syllabus/{id}/unidades`

**Descripción:** Lista todas las unidades del sílabo.

**Path Parameters:**

- `id` (number): ID del sílabo

**Response:**

```json
{
  "message": "Unidades obtenidas correctamente",
  "data": [
    {
      "id": 1,
      "silaboId": 25,
      "numero": 1,
      "nombre": "Introducción a la Programación",
      "semanaInicio": 1,
      "semanaFin": 4,
      "contenidosConceptuales": "Variables, tipos de datos, operadores",
      "horasLectivasTeoria": 8,
      "horasLectivasPractica": 16
    }
  ]
}
```

**Uso:** Retorna la lista de unidades didácticas del curso con su contenido y distribución temporal.

---

#### POST `/syllabus/{id}/unidades`

**Descripción:** Crea una nueva unidad en el sílabo.

**Path Parameters:**

- `id` (number): ID del sílabo

**Request Body:**

```json
{
  "numero": 2,
  "nombre": "Estructuras de Control",
  "semanaInicio": 5,
  "semanaFin": 8,
  "contenidosConceptuales": "If, while, for, switch",
  "horasLectivasTeoria": 8,
  "horasLectivasPractica": 16
}
```

**Response:**

```json
{
  "message": "Unidad creada correctamente",
  "data": { "id": 2 }
}
```

**Uso:** Agrega una nueva unidad didáctica al sílabo.

---

#### PUT `/syllabus/{id}/unidades/{unidadId}`

**Descripción:** Actualiza una unidad existente.

**Path Parameters:**

- `id` (number): ID del sílabo
- `unidadId` (number): ID de la unidad

**Request Body:**

```json
{
  "nombre": "Estructuras de Control Avanzadas",
  "contenidosConceptuales": "If, while, for, switch, recursión"
}
```

**Response:**

```json
{
  "message": "Unidad actualizada correctamente"
}
```

**Uso:** Modifica los datos de una unidad existente.

---

#### DELETE `/syllabus/{id}/unidades/{unidadId}`

**Descripción:** Elimina una unidad del sílabo.

**Path Parameters:**

- `id` (number): ID del sílabo
- `unidadId` (number): ID de la unidad

**Response:**

```json
{
  "message": "Unidad eliminada correctamente"
}
```

**Uso:** Elimina una unidad didáctica del sílabo.

---

### Sección V: Estrategias Metodológicas

#### GET `/syllabus/{id}/estrategias_metodologicas`

**Descripción:** Obtiene las estrategias metodológicas del curso.

**Path Parameters:**

- `id` (number): ID del sílabo

**Response:**

```json
{
  "message": "Estrategias metodológicas obtenidas correctamente",
  "data": {
    "items": [
      {
        "titulo": "Método Expositivo – Interactivo",
        "descripcion": "Comprende la exposición del docente y la interacción con el estudiante..."
      },
      {
        "titulo": "Método de Discusión Guiada",
        "descripcion": "Conducción del grupo para abordar situaciones..."
      }
    ]
  }
}
```

**Uso:** Retorna las estrategias metodológicas como array de objetos con título y descripción. El texto se almacena en BD con formato `\t` y `\b` como separadores.

---

#### PUT `/syllabus/{id}/estrategias_metodologicas`

**Descripción:** Actualiza las estrategias metodológicas.

**Path Parameters:**

- `id` (number): ID del sílabo

**Request Body (acepta string o array):**

```json
{
  "estrategias_metodologicas": [
    {
      "titulo": "Método Expositivo",
      "descripcion": "Exposición del docente..."
    }
  ]
}
```

**Response:**

```json
{
  "message": "Estrategias metodológicas actualizadas correctamente"
}
```

**Uso:** Actualiza las estrategias metodológicas. Acepta tanto string (formato legacy) como array de objetos.

---

#### POST `/syllabus/estrategias_metodologicas`

**Descripción:** Crea estrategias metodológicas (endpoint legacy).

**Request Body:**

```json
{
  "estrategias_metodologicas": "Método Expositivo\bDescripción..."
}
```

**Uso:** Endpoint legacy para crear estrategias metodológicas.
