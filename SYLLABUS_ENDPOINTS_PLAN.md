# Plan de Endpoints del Sílabo

## Estado Actual vs Requerido

### ✅ I. DATOS GENERALES (Tabla: `silabo`)

**Estado:** ✅ COMPLETO

- ✅ GET `/api/syllabus/{id}/datos-generales` - Obtener datos generales
- ✅ POST `/api/syllabus/` - Crear sílabo (incluye datos generales)
- ⚠️ PUT `/api/syllabus/{id}/datos-generales` - **FALTA IMPLEMENTAR**

**Campos en DB:**

- departamentoAcademico, escuelaProfesional, programaAcademico
- semestreAcademico, tipoAsignatura, modalidadDeAsignatura
- cursoCodigo, cursoNombre, ciclo, requisitos
- horasTeoria, horasPractica, creditosTotales
- Docente: relación con `silabo_docente`

---

### ✅ II. SUMILLA (Tabla: `silabo_sumilla`)

**Estado:** ✅ COMPLETO

- ✅ GET `/api/syllabus/{id}/sumilla`
- ✅ POST `/api/syllabus/{id}/sumilla`
- ✅ PUT `/api/syllabus/{id}/sumilla`

**Campos en DB:**

- contenido (text)
- palabrasClave (text)
- version, esActual

---

### ✅ III. COMPETENCIAS Y COMPONENTES (Tablas: `silabo_competencia_curso`, `silabo_competencia_componente`)

**Estado:** ✅ COMPLETO

- ✅ GET `/api/syllabus/{id}/competencies` - Competencias del curso
- ✅ POST `/api/syllabus/{id}/competencies`
- ✅ DELETE `/api/syllabus/{id}/competencies/{id}`
- ✅ GET `/api/syllabus/{id}/components` - Capacidades/componentes
- ✅ POST `/api/syllabus/{id}/components`
- ✅ DELETE `/api/syllabus/{id}/components/{id}`
- ✅ GET `/api/syllabus/{id}/attitudes` - Actitudes
- ✅ POST `/api/syllabus/{id}/attitudes`
- ✅ DELETE `/api/syllabus/{id}/attitudes/{id}`

**Campos en DB:**

- `silabo_competencia_curso`: codigo, descripcion, orden
- `silabo_competencia_componente`: grupo (COMP/ACT), codigo, descripcion, orden

---

### ⚠️ IV. PROGRAMACIÓN DE CONTENIDOS (Tabla: `silabo_unidad`)

**Estado:** ⚠️ PARCIAL - **FALTA IMPLEMENTAR ENDPOINTS**

- ❌ GET `/api/syllabus/{id}/unidades` - **FALTA**
- ❌ POST `/api/syllabus/{id}/unidades` - **FALTA**
- ❌ PUT `/api/syllabus/{id}/unidades/{unidadId}` - **FALTA**
- ❌ DELETE `/api/syllabus/{id}/unidades/{unidadId}` - **FALTA**

**Nota:** Existe endpoint en `/api/programacion-contenidos` pero debería estar en syllabus

**Campos en DB:**

- numero, titulo, capacidadesText
- semanaInicio, semanaFin
- contenidosConceptuales, contenidosProcedimentales
- actividadesAprendizaje
- horasLectivasTeoria, horasLectivasPractica
- horasNoLectivasTeoria, horasNoLectivasPractica

---

### ✅ V. ESTRATEGIAS METODOLÓGICAS (Tabla: `silabo`, campo: `estrategias_metodologicas`)

**Estado:** ✅ COMPLETO

- ✅ GET `/api/syllabus/{id}/estrategias_metodologicas`
- ✅ POST `/api/syllabus/estrategias_metodologicas` - ⚠️ Debería ser `/{id}/estrategias_metodologicas`
- ✅ PUT `/api/syllabus/{id}/estrategias_metodologicas`

**Campos en DB:**

- estrategiasMetodologicas (text) - en tabla `silabo`

---

### ✅ VI. RECURSOS DIDÁCTICOS (Tabla: `silabo`, campo: `recursos_didacticos_notas`)

**Estado:** ✅ COMPLETO

- ✅ GET `/api/syllabus/{id}/recursos_didacticos_notas`
- ✅ POST `/api/syllabus/recursos_didacticos_notas` - ⚠️ Debería ser `/{id}/recursos_didacticos_notas`
- ✅ PUT `/api/syllabus/{id}/recursos_didacticos_notas`

**Nota:** También existe tabla `silabo_recurso_didactico` para recursos específicos

**Campos en DB:**

- recursosDidacticosNotas (text) - en tabla `silabo`
- Tabla `silabo_recurso_didactico`: recursoId, urlReferencia, observaciones

---

### ⚠️ VII. EVALUACIÓN DEL APRENDIZAJE (Tablas: `evaluacion_aprendizaje`, `formula_evaluacion_regla`)

**Estado:** ⚠️ PARCIAL

- ✅ GET `/api/syllabus/{id}/formula_evaluacion` - Obtener fórmula
- ❌ POST `/api/syllabus/{id}/evaluacion` - **FALTA**
- ❌ PUT `/api/syllabus/{id}/evaluacion` - **FALTA**

**Campos en DB:**

- Tabla `evaluacion_aprendizaje`: silaboId, formulaReglaId
- Tabla `formula_evaluacion_regla`: nombre, formula, leyenda
- Tabla `formula_evaluacion_subformula`: nombre, formula, variables
- Tabla `plan_evaluacion_oferta`: componenteNombre, instrumentoNombre, semana, fecha

---

### ⚠️ VIII. FUENTES DE CONSULTA (Tabla: `silabo_fuente`)

**Estado:** ❌ NO IMPLEMENTADO - **FALTA TODO**

- ❌ GET `/api/syllabus/{id}/fuentes` - **FALTA**
- ❌ POST `/api/syllabus/{id}/fuentes` - **FALTA**
- ❌ PUT `/api/syllabus/{id}/fuentes/{fuenteId}` - **FALTA**
- ❌ DELETE `/api/syllabus/{id}/fuentes/{fuenteId}` - **FALTA**

**Campos en DB:**

- tipo (varchar) - libro, artículo, recurso electrónico
- autores, anio, titulo
- editorialRevista, ciudad
- isbnIssn, doiUrl
- notas

---

### ✅ IX. APORTE AL LOGRO DE RESULTADOS (Tabla: `silabo_aporte_resultado_programa`)

**Estado:** ✅ COMPLETO

- ✅ POST `/api/syllabus/{id}/contribution` - Crear aporte

**Nota:** Falta GET y PUT

**Campos en DB:**

- silaboId, resultadoProgramaCodigo
- resultadoProgramaDescripcion
- nivelAporte (enum: 'K', 'R')
- justificacion

---

## Resumen de Endpoints Faltantes

### 🔴 ALTA PRIORIDAD

1. **PUT `/api/syllabus/{id}/datos-generales`** - Actualizar datos generales
2. **GET `/api/syllabus/{id}/unidades`** - Listar unidades
3. **POST `/api/syllabus/{id}/unidades`** - Crear unidad
4. **PUT `/api/syllabus/{id}/unidades/{unidadId}`** - Actualizar unidad
5. **GET `/api/syllabus/{id}/fuentes`** - Listar fuentes bibliográficas
6. **POST `/api/syllabus/{id}/fuentes`** - Crear fuente
7. **PUT `/api/syllabus/{id}/fuentes/{fuenteId}`** - Actualizar fuente
8. **DELETE `/api/syllabus/{id}/fuentes/{fuenteId}`** - Eliminar fuente

### 🟡 MEDIA PRIORIDAD

9. **POST `/api/syllabus/{id}/evaluacion`** - Crear plan de evaluación
10. **PUT `/api/syllabus/{id}/evaluacion`** - Actualizar plan de evaluación
11. **GET `/api/syllabus/{id}/contribution`** - Obtener aportes
12. **PUT `/api/syllabus/{id}/contribution`** - Actualizar aportes

### 🟢 BAJA PRIORIDAD (Refactoring)

13. Mover `POST /estrategias_metodologicas` a `POST /{id}/estrategias_metodologicas`
14. Mover `POST /recursos_didacticos_notas` a `POST /{id}/recursos_didacticos_notas`
15. Organizar y ordenar el controller por secciones

---

## Estructura Propuesta del Controller (Ordenado)

```typescript
@controller("syllabus")
export class SyllabusController {
  // ========================================
  // SECCIÓN 0: OPERACIONES GENERALES
  // ========================================
  @route("/", "POST") - Crear sílabo completo
  @route("/", "PUT") - Actualizar sílabo (genérico)
  @route("/{id}/complete", "GET") - Obtener sílabo completo
  @route("/{id}/state", "PUT") - Actualizar estado de revisión

  // ========================================
  // SECCIÓN I: DATOS GENERALES
  // ========================================
  @route("/{id}/datos-generales", "GET") ✅
  @route("/{id}/datos-generales", "PUT") ❌ FALTA

  // ========================================
  // SECCIÓN II: SUMILLA
  // ========================================
  @route("/{id}/sumilla", "GET") ✅
  @route("/{id}/sumilla", "POST") ✅
  @route("/{id}/sumilla", "PUT") ✅

  // ========================================
  // SECCIÓN III: COMPETENCIAS Y COMPONENTES
  // ========================================
  @route("/{id}/competencies", "GET") ✅
  @route("/{id}/competencies", "POST") ✅
  @route("/{id}/competencies/{compId}", "DELETE") ✅

  @route("/{id}/components", "GET") ✅
  @route("/{id}/components", "POST") ✅
  @route("/{id}/components/{compId}", "DELETE") ✅

  @route("/{id}/attitudes", "GET") ✅
  @route("/{id}/attitudes", "POST") ✅
  @route("/{id}/attitudes/{attId}", "DELETE") ✅

  // ========================================
  // SECCIÓN IV: PROGRAMACIÓN DE CONTENIDOS
  // ========================================
  @route("/{id}/unidades", "GET") ❌ FALTA
  @route("/{id}/unidades", "POST") ❌ FALTA
  @route("/{id}/unidades/{unidadId}", "PUT") ❌ FALTA
  @route("/{id}/unidades/{unidadId}", "DELETE") ❌ FALTA

  // ========================================
  // SECCIÓN V: ESTRATEGIAS METODOLÓGICAS
  // ========================================
  @route("/{id}/estrategias_metodologicas", "GET") ✅
  @route("/{id}/estrategias_metodologicas", "PUT") ✅

  // ========================================
  // SECCIÓN VI: RECURSOS DIDÁCTICOS
  // ========================================
  @route("/{id}/recursos_didacticos_notas", "GET") ✅
  @route("/{id}/recursos_didacticos_notas", "PUT") ✅

  // ========================================
  // SECCIÓN VII: EVALUACIÓN DEL APRENDIZAJE
  // ========================================
  @route("/{id}/formula_evaluacion", "GET") ✅
  @route("/{id}/evaluacion", "POST") ❌ FALTA
  @route("/{id}/evaluacion", "PUT") ❌ FALTA

  // ========================================
  // SECCIÓN VIII: FUENTES DE CONSULTA
  // ========================================
  @route("/{id}/fuentes", "GET") ❌ FALTA
  @route("/{id}/fuentes", "POST") ❌ FALTA
  @route("/{id}/fuentes/{fuenteId}", "PUT") ❌ FALTA
  @route("/{id}/fuentes/{fuenteId}", "DELETE") ❌ FALTA

  // ========================================
  // SECCIÓN IX: APORTE AL LOGRO DE RESULTADOS
  // ========================================
  @route("/{id}/contribution", "GET") ❌ FALTA
  @route("/{id}/contribution", "POST") ✅
  @route("/{id}/contribution", "PUT") ❌ FALTA

  // ========================================
  // REVISIÓN Y APROBACIÓN
  // ========================================
  @route("/revision", "GET") ✅
  @route("/revision/{id}", "GET") ✅
  @route("/{id}/revision", "GET") ✅
  @route("/{id}/revision", "POST") ✅
  @route("/{id}/aprobar", "POST") ✅
  @route("/{id}/desaprobar", "POST") ✅
}
```
