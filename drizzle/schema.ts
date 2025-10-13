import {
  pgTable,
  unique,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  foreignKey,
  integer,
  index,
  date,
  check,
  jsonb,
  json,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const categoriaUsuario = pgTable(
  "categoria_usuario",
  {
    id: serial().primaryKey().notNull(),
    nombreCategoria: varchar("nombre_categoria").notNull(),
    descripcion: text(),
    activo: boolean().default(true),
    creadoEn: timestamp("creado_en", { mode: "string" }).defaultNow(),
    actualizadoEn: timestamp("actualizado_en", { mode: "string" }).defaultNow(),
  },
  (table) => [
    unique("categoria_usuario_nombre_categoria_key").on(table.nombreCategoria),
  ],
);

export const funcionAplicacion = pgTable(
  "funcion_aplicacion",
  {
    id: serial().primaryKey().notNull(),
    nombreFuncion: varchar("nombre_funcion").notNull(),
    tituloVisible: varchar("titulo_visible"),
    descripcion: text(),
    modulo: varchar(),
    activo: boolean().default(true),
  },
  (table) => [
    unique("funcion_aplicacion_nombre_funcion_key").on(table.nombreFuncion),
  ],
);

export const docente = pgTable(
  "docente",
  {
    id: serial().primaryKey().notNull(),
    correo: varchar().notNull(),
    categoriaUsuarioId: integer("categoria_usuario_id").notNull(),
    activo: boolean().default(true),
    azureAdObjectId: varchar("azure_ad_object_id"),
    tenantId: varchar("tenant_id"),
    ultimoAccesoEn: timestamp("ultimo_acceso_en", { mode: "string" }),
    gradoAcademico: varchar("grado_academico"),
    creadoEn: timestamp("creado_en", { mode: "string" }).defaultNow(),
    actualizadoEn: timestamp("actualizado_en", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.categoriaUsuarioId],
      foreignColumns: [categoriaUsuario.id],
      name: "docente_categoria_usuario_id_fkey",
    }),
    unique("docente_correo_key").on(table.correo),
  ],
);

export const silabo = pgTable(
  "silabo",
  {
    id: serial().primaryKey().notNull(),
    departamentoAcademico: varchar("departamento_academico"),
    escuelaProfesional: varchar("escuela_profesional"),
    programaAcademico: varchar("programa_academico"),
    areaCurricular: varchar("area_curricular"),
    cursoCodigo: varchar("curso_codigo"),
    cursoNombre: varchar("curso_nombre"),
    semestreAcademico: varchar("semestre_academico"),
    tipoAsignatura: varchar("tipo_asignatura"),
    tipoDeEstudios: varchar("tipo_de_estudios"),
    modalidadDeAsignatura: varchar("modalidad_de_asignatura"),
    formatoDeCurso: varchar("formato_de_curso"),
    ciclo: varchar(),
    requisitos: text(),
    horasTeoria: integer("horas_teoria"),
    horasPractica: integer("horas_practica"),
    horasLaboratorio: integer("horas_laboratorio"),
    horasTotales: integer("horas_totales"),
    horasTeoriaLectivaPresencial: integer("horas_teoria_lectiva_presencial"),
    horasTeoriaLectivaDistancia: integer("horas_teoria_lectiva_distancia"),
    horasTeoriaNoLectivaPresencial: integer(
      "horas_teoria_no_lectiva_presencial",
    ),
    horasTeoriaNoLectivaDistancia: integer("horas_teoria_no_lectiva_distancia"),
    horasPracticaLectivaPresencial: integer(
      "horas_practica_lectiva_presencial",
    ),
    horasPracticaLectivaDistancia: integer("horas_practica_lectiva_distancia"),
    horasPracticaNoLectivaPresencial: integer(
      "horas_practica_no_lectiva_presencial",
    ),
    horasPracticaNoLectivaDistancia: integer(
      "horas_practica_no_lectiva_distancia",
    ),
    creditosTeoria: integer("creditos_teoria"),
    creditosPractica: integer("creditos_practica"),
    creditosTotales: integer("creditos_totales"),
    sumilla: text(),
    estrategiasMetodologicas: text("estrategias_metodologicas"),
    recursosDidacticos: text("recursos_didacticos"),
    politicas: text(),
    observaciones: text(),
    estadoRevision: varchar("estado_revision").default("ASIGNADO").notNull(),
    asignadoADocenteId: integer("asignado_a_docente_id"),
    creadoPorDocenteId: integer("creado_por_docente_id"),
    actualizadoPorDocenteId: integer("actualizado_por_docente_id"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.actualizadoPorDocenteId],
      foreignColumns: [docente.id],
      name: "silabo_actualizado_por_docente_id_fkey",
    }),
    foreignKey({
      columns: [table.asignadoADocenteId],
      foreignColumns: [docente.id],
      name: "silabo_asignado_a_docente_id_fkey",
    }),
    foreignKey({
      columns: [table.creadoPorDocenteId],
      foreignColumns: [docente.id],
      name: "silabo_creado_por_docente_id_fkey",
    }),
  ],
);

export const silaboDocente = pgTable(
  "silabo_docente",
  {
    id: serial().primaryKey().notNull(),
    silaboId: integer("silabo_id").notNull(),
    docenteId: integer("docente_id").notNull(),
    docenteRolId: integer("docente_rol_id").notNull(),
    observaciones: text(),
    creadoEn: timestamp("creado_en", { mode: "string" }).defaultNow(),
    actualizadoEn: timestamp("actualizado_en", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.docenteId],
      foreignColumns: [docente.id],
      name: "silabo_docente_docente_id_fkey",
    }),
    foreignKey({
      columns: [table.docenteRolId],
      foreignColumns: [docenteRolCatalogo.id],
      name: "silabo_docente_docente_rol_id_fkey",
    }),
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "silabo_docente_silabo_id_fkey",
    }),
    unique("silabo_docente_unq").on(table.silaboId, table.docenteId),
  ],
);

export const docenteRolCatalogo = pgTable(
  "docente_rol_catalogo",
  {
    id: serial().primaryKey().notNull(),
    codigo: varchar().notNull(),
    nombre: varchar().notNull(),
    activo: boolean().default(true),
    creadoEn: timestamp("creado_en", { mode: "string" }).defaultNow(),
    actualizadoEn: timestamp("actualizado_en", { mode: "string" }).defaultNow(),
  },
  (table) => [unique("docente_rol_catalogo_codigo_key").on(table.codigo)],
);

export const gradoAcademicoCatalogo = pgTable(
  "grado_academico_catalogo",
  {
    id: serial().primaryKey().notNull(),
    codigo: varchar().notNull(),
    nombre: varchar().notNull(),
    abreviatura: varchar(),
    activo: boolean().default(true),
    creadoEn: timestamp("creado_en", { mode: "string" }).defaultNow(),
    actualizadoEn: timestamp("actualizado_en", { mode: "string" }).defaultNow(),
  },
  (table) => [unique("grado_academico_catalogo_codigo_key").on(table.codigo)],
);

export const silaboSumilla = pgTable(
  "silabo_sumilla",
  {
    id: serial().primaryKey().notNull(),
    silaboId: integer("silabo_id").notNull(),
    contenido: text().notNull(),
    palabrasClave: text("palabras_clave"),
    version: integer().default(1),
    esActual: boolean("es_actual").default(true),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "silabo_sumilla_silabo_id_fkey",
    }),
    unique("silabo_sumilla_unq").on(table.silaboId, table.version),
  ],
);

export const silaboResultadoAprendizajeCurso = pgTable(
  "silabo_resultado_aprendizaje_curso",
  {
    id: serial().primaryKey().notNull(),
    silaboId: integer("silabo_id").notNull(),
    descripcion: text().notNull(),
    orden: integer(),
  },
  (table) => [
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "silabo_resultado_aprendizaje_curso_silabo_id_fkey",
    }),
  ],
);

export const silaboUnidad = pgTable(
  "silabo_unidad",
  {
    id: serial().primaryKey().notNull(),
    silaboId: integer("silabo_id").notNull(),
    numero: integer().notNull(),
    titulo: varchar().notNull(),
    capacidadesText: text("capacidades_text"),
    semanaInicio: integer("semana_inicio"),
    semanaFin: integer("semana_fin"),
  },
  (table) => [
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "silabo_unidad_silabo_id_fkey",
    }),
  ],
);

export const silaboUnidadSemana = pgTable(
  "silabo_unidad_semana",
  {
    id: serial().primaryKey().notNull(),
    silaboUnidadId: integer("silabo_unidad_id").notNull(),
    semana: integer().notNull(),
    contenidosConceptuales: text("contenidos_conceptuales"),
    contenidosProcedimentales: text("contenidos_procedimentales"),
    actividadesAprendizaje: text("actividades_aprendizaje"),
    horasLectivasTeoria: integer("horas_lectivas_teoria"),
    horasLectivasPractica: integer("horas_lectivas_practica"),
    horasNoLectivasTeoria: integer("horas_no_lectivas_teoria"),
    horasNoLectivasPractica: integer("horas_no_lectivas_practica"),
  },
  (table) => [
    foreignKey({
      columns: [table.silaboUnidadId],
      foreignColumns: [silaboUnidad.id],
      name: "silabo_unidad_semana_silabo_unidad_id_fkey",
    }),
  ],
);

export const silaboUnidadContenido = pgTable(
  "silabo_unidad_contenido",
  {
    id: serial().primaryKey().notNull(),
    silaboUnidadId: integer("silabo_unidad_id").notNull(),
    tipo: varchar(),
    descripcion: text().notNull(),
    orden: integer(),
  },
  (table) => [
    foreignKey({
      columns: [table.silaboUnidadId],
      foreignColumns: [silaboUnidad.id],
      name: "silabo_unidad_contenido_silabo_unidad_id_fkey",
    }),
  ],
);

export const silaboRecursoDidactico = pgTable(
  "silabo_recurso_didactico",
  {
    id: serial().primaryKey().notNull(),
    silaboId: integer("silabo_id").notNull(),
    recursoId: integer("recurso_id").notNull(),
    silaboUnidadId: integer("silabo_unidad_id"),
    silaboUnidadSemanaId: integer("silabo_unidad_semana_id"),
    destino: varchar(),
    urlReferencia: varchar("url_referencia"),
    observaciones: text(),
    creadoEn: timestamp("creado_en", { mode: "string" }).defaultNow(),
    actualizadoEn: timestamp("actualizado_en", { mode: "string" }).defaultNow(),
  },
  (table) => [
    index("idx_silabo_recurso").using(
      "btree",
      table.silaboId.asc().nullsLast().op("int4_ops"),
      table.recursoId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.recursoId],
      foreignColumns: [recursoDidacticoCatalogo.id],
      name: "silabo_recurso_didactico_recurso_id_fkey",
    }),
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "silabo_recurso_didactico_silabo_id_fkey",
    }),
    foreignKey({
      columns: [table.silaboUnidadId],
      foreignColumns: [silaboUnidad.id],
      name: "silabo_recurso_didactico_silabo_unidad_id_fkey",
    }),
    foreignKey({
      columns: [table.silaboUnidadSemanaId],
      foreignColumns: [silaboUnidadSemana.id],
      name: "silabo_recurso_didactico_silabo_unidad_semana_id_fkey",
    }),
  ],
);

export const recursoDidacticoCatalogo = pgTable(
  "recurso_didactico_catalogo",
  {
    id: serial().primaryKey().notNull(),
    codigo: varchar().notNull(),
    nombre: varchar().notNull(),
    descripcion: text(),
    activo: boolean().default(true),
    creadoEn: timestamp("creado_en", { mode: "string" }).defaultNow(),
    actualizadoEn: timestamp("actualizado_en", { mode: "string" }).defaultNow(),
  },
  (table) => [unique("recurso_didactico_catalogo_codigo_key").on(table.codigo)],
);

export const silaboFuente = pgTable(
  "silabo_fuente",
  {
    id: serial().primaryKey().notNull(),
    silaboId: integer("silabo_id").notNull(),
    tipo: varchar().notNull(),
    autores: varchar(),
    año: integer("año"),
    titulo: text(),
    editorialRevista: varchar("editorial_revista"),
    ciudad: varchar(),
    isbnIssn: varchar("isbn_issn"),
    doiUrl: varchar("doi_url"),
    notas: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "silabo_fuente_silabo_id_fkey",
    }),
  ],
);

export const silaboCompetenciaCurso = pgTable(
  "silabo_competencia_curso",
  {
    id: serial().primaryKey().notNull(),
    silaboId: integer("silabo_id").notNull(),
    codigo: varchar(),
    descripcion: text().notNull(),
    referenciaProgramaCodigo: varchar("referencia_programa_codigo"),
    orden: integer(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "silabo_competencia_curso_silabo_id_fkey",
    }),
  ],
);

export const silaboCompetenciaComponente = pgTable(
  "silabo_competencia_componente",
  {
    id: serial().primaryKey().notNull(),
    silaboId: integer("silabo_id").notNull(),
    grupo: varchar().notNull(),
    codigo: varchar(),
    descripcion: text().notNull(),
    competenciaCodigoRelacionada: varchar("competencia_codigo_relacionada"),
    orden: integer(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "silabo_competencia_componente_silabo_id_fkey",
    }),
  ],
);

export const planEvaluacionOferta = pgTable(
  "plan_evaluacion_oferta",
  {
    id: serial().primaryKey().notNull(),
    silaboId: integer("silabo_id").notNull(),
    componenteNombre: varchar("componente_nombre").notNull(),
    instrumentoNombre: varchar("instrumento_nombre"),
    semana: integer(),
    fecha: date(),
    instrucciones: text(),
    rubricaUrl: varchar("rubrica_url"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "plan_evaluacion_oferta_silabo_id_fkey",
    }),
    unique("plan_evaluacion_oferta_unq").on(
      table.silaboId,
      table.componenteNombre,
      table.semana,
    ),
  ],
);

export const formulaEvaluacionRegla = pgTable(
  "formula_evaluacion_regla",
  {
    id: serial().primaryKey().notNull(),
    silaboId: integer("silabo_id").notNull(),
    nombreRegla: varchar("nombre_regla").notNull(),
    variableFinalCodigo: varchar("variable_final_codigo").notNull(),
    expresionFinal: text("expresion_final").notNull(),
    descripcion: text(),
    version: integer().default(1),
    activo: boolean().default(true),
    lenguaje: varchar().default("INFIX"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "formula_evaluacion_regla_silabo_id_fkey",
    }),
    unique("formula_evaluacion_regla_unq").on(
      table.silaboId,
      table.nombreRegla,
      table.version,
    ),
  ],
);

export const formulaEvaluacionVariable = pgTable(
  "formula_evaluacion_variable",
  {
    id: serial().primaryKey().notNull(),
    formulaEvaluacionReglaId: integer("formula_evaluacion_regla_id").notNull(),
    codigo: varchar().notNull(),
    nombre: varchar().notNull(),
    tipo: varchar().notNull(),
    descripcion: text(),
    orden: integer(),
  },
  (table) => [
    foreignKey({
      columns: [table.formulaEvaluacionReglaId],
      foreignColumns: [formulaEvaluacionRegla.id],
      name: "formula_evaluacion_variable_formula_evaluacion_regla_id_fkey",
    }),
    unique("formula_evaluacion_variable_unq").on(
      table.formulaEvaluacionReglaId,
      table.codigo,
    ),
  ],
);

export const formulaEvaluacionSubformula = pgTable(
  "formula_evaluacion_subformula",
  {
    id: serial().primaryKey().notNull(),
    formulaEvaluacionReglaId: integer("formula_evaluacion_regla_id").notNull(),
    variableCodigo: varchar("variable_codigo").notNull(),
    expresion: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.formulaEvaluacionReglaId],
      foreignColumns: [formulaEvaluacionRegla.id],
      name: "formula_evaluacion_subformula_formula_evaluacion_regla_id_fkey",
    }),
    unique("formula_evaluacion_subformula_unq").on(
      table.formulaEvaluacionReglaId,
      table.variableCodigo,
    ),
  ],
);

export const formulaEvaluacionVariablePlan = pgTable(
  "formula_evaluacion_variable_plan",
  {
    id: serial().primaryKey().notNull(),
    formulaEvaluacionReglaId: integer("formula_evaluacion_regla_id").notNull(),
    variableCodigo: varchar("variable_codigo").notNull(),
    planEvaluacionOfertaId: integer("plan_evaluacion_oferta_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.formulaEvaluacionReglaId],
      foreignColumns: [formulaEvaluacionRegla.id],
      name: "formula_evaluacion_variable_pl_formula_evaluacion_regla_id_fkey",
    }),
    foreignKey({
      columns: [table.planEvaluacionOfertaId],
      foreignColumns: [planEvaluacionOferta.id],
      name: "formula_evaluacion_variable_plan_plan_evaluacion_oferta_id_fkey",
    }),
    unique("formula_evaluacion_variable_plan_unq").on(
      table.formulaEvaluacionReglaId,
      table.variableCodigo,
      table.planEvaluacionOfertaId,
    ),
  ],
);

export const evaluacionAprendizaje = pgTable(
  "evaluacion_aprendizaje",
  {
    id: serial().primaryKey().notNull(),
    silaboId: integer("silabo_id").notNull(),
    formulaBaseId: integer("formula_base_id"),
    formulaPersonalizada: text("formula_personalizada"),
    definicionesPersonalizadas: jsonb("definiciones_personalizadas"),
    variablesMapeo: jsonb("variables_mapeo"),
    fechaCreacion: timestamp("fecha_creacion", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    index("idx_evaluacion_aprendizaje_formula_base").using(
      "btree",
      table.formulaBaseId.asc().nullsLast().op("int4_ops"),
    ),
    index("idx_evaluacion_aprendizaje_silabo").using(
      "btree",
      table.silaboId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.formulaBaseId],
      foreignColumns: [formulaEvaluacionBase.id],
      name: "evaluacion_aprendizaje_formula_base_id_fkey",
    }),
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "evaluacion_aprendizaje_silabo_id_fkey",
    }),
    check(
      "chk_eval_aprendizaje_minimo",
      sql`(formula_base_id IS NOT NULL) OR (formula_personalizada IS NOT NULL)`,
    ),
  ],
);

export const formulaEvaluacionBase = pgTable(
  "formula_evaluacion_base",
  {
    id: serial().primaryKey().notNull(),
    nombreFormula: varchar("nombre_formula").notNull(),
    descripcion: text(),
    lenguaje: varchar().default("INFIX").notNull(),
    formulaTexto: text("formula_texto").notNull(),
    variables: jsonb().notNull(),
    definiciones: jsonb().notNull(),
    version: integer().default(1),
    activa: boolean().default(true),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    unique("formula_evaluacion_base_nombre_formula_key").on(
      table.nombreFormula,
    ),
  ],
);

export const auditEvent = pgTable(
  "audit_event",
  {
    id: serial().primaryKey().notNull(),
    tabla: varchar().notNull(),
    registroPk: varchar("registro_pk").notNull(),
    accion: varchar().notNull(),
    descripcion: text(),
    docenteId: integer("docente_id"),
    ipOrigen: varchar("ip_origen"),
    userAgent: varchar("user_agent"),
    oldValues: json("old_values"),
    newValues: json("new_values"),
    silaboId: integer("silabo_id"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    index("idx_audit_event_accion").using(
      "btree",
      table.accion.asc().nullsLast().op("text_ops"),
    ),
    index("idx_audit_event_docente").using(
      "btree",
      table.docenteId.asc().nullsLast().op("int4_ops"),
    ),
    index("idx_audit_event_fecha").using(
      "btree",
      table.createdAt.asc().nullsLast().op("timestamp_ops"),
    ),
    index("idx_audit_event_silabo").using(
      "btree",
      table.silaboId.asc().nullsLast().op("int4_ops"),
    ),
    index("idx_audit_event_tabla_pk").using(
      "btree",
      table.tabla.asc().nullsLast().op("text_ops"),
      table.registroPk.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.docenteId],
      foreignColumns: [docente.id],
      name: "audit_event_docente_id_fkey",
    }),
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "audit_event_silabo_id_fkey",
    }),
  ],
);

export const auditEventDetalle = pgTable(
  "audit_event_detalle",
  {
    id: serial().primaryKey().notNull(),
    auditEventId: integer("audit_event_id").notNull(),
    campo: varchar().notNull(),
    valorAnterior: text("valor_anterior"),
    valorNuevo: text("valor_nuevo"),
  },
  (table) => [
    index("idx_audit_event_detalle_evento_campo").using(
      "btree",
      table.auditEventId.asc().nullsLast().op("int4_ops"),
      table.campo.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.auditEventId],
      foreignColumns: [auditEvent.id],
      name: "audit_event_detalle_audit_event_id_fkey",
    }),
  ],
);

export const categoriaFuncionAcceso = pgTable(
  "categoria_funcion_acceso",
  {
    categoriaUsuarioId: integer("categoria_usuario_id").notNull(),
    funcionAplicacionId: integer("funcion_aplicacion_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.categoriaUsuarioId],
      foreignColumns: [categoriaUsuario.id],
      name: "categoria_funcion_acceso_categoria_usuario_id_fkey",
    }),
    foreignKey({
      columns: [table.funcionAplicacionId],
      foreignColumns: [funcionAplicacion.id],
      name: "categoria_funcion_acceso_funcion_aplicacion_id_fkey",
    }),
    primaryKey({
      columns: [table.categoriaUsuarioId, table.funcionAplicacionId],
      name: "categoria_funcion_acceso_pk",
    }),
  ],
);

export const silaboAporteResultadoPrograma = pgTable(
  "silabo_aporte_resultado_programa",
  {
    silaboId: integer("silabo_id").notNull(),
    resultadoProgramaCodigo: varchar("resultado_programa_codigo").notNull(),
    resultadoProgramaDescripcion: text("resultado_programa_descripcion"),
    aporteValor: varchar("aporte_valor"),
  },
  (table) => [
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "silabo_aporte_resultado_programa_silabo_id_fkey",
    }),
    primaryKey({
      columns: [table.silaboId, table.resultadoProgramaCodigo],
      name: "silabo_aporte_resultado_programa_pk",
    }),
  ],
);

export const gradoAcademicoDocente = pgTable(
  "grado_academico_docente",
  {
    docenteId: integer("docente_id").notNull(),
    gradoAcademicoId: integer("grado_academico_id").notNull(),
    institucion: varchar(),
    añoObtencion: integer("año_obtencion"),
    esPrincipal: boolean("es_principal").default(false),
    creadoEn: timestamp("creado_en", { mode: "string" }).defaultNow(),
    actualizadoEn: timestamp("actualizado_en", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.docenteId],
      foreignColumns: [docente.id],
      name: "grado_academico_docente_docente_id_fkey",
    }),
    foreignKey({
      columns: [table.gradoAcademicoId],
      foreignColumns: [gradoAcademicoCatalogo.id],
      name: "grado_academico_docente_grado_academico_id_fkey",
    }),
    primaryKey({
      columns: [table.docenteId, table.gradoAcademicoId],
      name: "grado_academico_docente_pk",
    }),
  ],
);
