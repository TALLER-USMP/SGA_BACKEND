import {
  pgTable,
  index,
  foreignKey,
  serial,
  integer,
  varchar,
  text,
  numeric,
  boolean,
  unique,
  timestamp,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const aporteEnum = pgEnum("aporte_enum", ["K", "R"]);

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
    index("idx_contenido_unidad").using(
      "btree",
      table.silaboUnidadId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.silaboUnidadId],
      foreignColumns: [silaboUnidad.id],
      name: "silabo_unidad_contenido_silabo_unidad_id_fkey",
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
    index("idx_semana_unidad").using(
      "btree",
      table.silaboUnidadId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.silaboUnidadId],
      foreignColumns: [silaboUnidad.id],
      name: "silabo_unidad_semana_silabo_unidad_id_fkey",
    }),
  ],
);

export const silaboEvaluacion = pgTable(
  "silabo_evaluacion",
  {
    id: serial().primaryKey().notNull(),
    silaboId: integer("silabo_id").notNull(),
    componenteNombre: varchar("componente_nombre"),
    descripcion: text(),
    instrumentoNombre: varchar("instrumento_nombre"),
    criterios: text(),
    ponderacion: numeric({ precision: 5, scale: 2 }),
    semana: integer(),
    minimoAprobatorio: boolean("minimo_aprobatorio"),
  },
  (table) => [
    index("idx_eval_silabo").using(
      "btree",
      table.silaboId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "silabo_evaluacion_silabo_id_fkey",
    }),
  ],
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
    index("idx_fuente_silabo").using(
      "btree",
      table.silaboId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "silabo_fuente_silabo_id_fkey",
    }),
  ],
);

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
    docentesText: text("docentes_text"),
    sumilla: text(),
    estrategiasMetodologicas: text("estrategias_metodologicas"),
    recursosDidacticos: text("recursos_didacticos"),
    politicas: text(),
    observaciones: text(),
    asignadoAUsuarioAutorizadoId: integer("asignado_a_usuario_autorizado_id"),
    creadoPorUsuarioAutorizadoId: integer("creado_por_usuario_autorizado_id"),
    actualizadoPorUsuarioAutorizadoId: integer(
      "actualizado_por_usuario_autorizado_id",
    ),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    index("idx_silabo_actualizado").using(
      "btree",
      table.actualizadoPorUsuarioAutorizadoId.asc().nullsLast().op("int4_ops"),
    ),
    index("idx_silabo_asignado").using(
      "btree",
      table.asignadoAUsuarioAutorizadoId.asc().nullsLast().op("int4_ops"),
    ),
    index("idx_silabo_creado_por").using(
      "btree",
      table.creadoPorUsuarioAutorizadoId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.actualizadoPorUsuarioAutorizadoId],
      foreignColumns: [usuarioAutorizado.id],
      name: "silabo_actualizado_por_usuario_autorizado_id_fkey",
    }),
    foreignKey({
      columns: [table.asignadoAUsuarioAutorizadoId],
      foreignColumns: [usuarioAutorizado.id],
      name: "silabo_asignado_a_usuario_autorizado_id_fkey",
    }),
    foreignKey({
      columns: [table.creadoPorUsuarioAutorizadoId],
      foreignColumns: [usuarioAutorizado.id],
      name: "silabo_creado_por_usuario_autorizado_id_fkey",
    }),
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
    index("idx_ra_curso_silabo").using(
      "btree",
      table.silaboId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "silabo_resultado_aprendizaje_curso_silabo_id_fkey",
    }),
  ],
);

export const usuarioAutorizado = pgTable(
  "usuario_autorizado",
  {
    id: serial().primaryKey().notNull(),
    correo: varchar().notNull(),
    categoriaUsuarioId: integer("categoria_usuario_id").notNull(),
    activo: boolean().default(true),
    azureAdObjectId: varchar("azure_ad_object_id"),
    tenantId: varchar("tenant_id"),
    ultimoAccesoEn: timestamp("ultimo_acceso_en", { mode: "string" }),
    creadoEn: timestamp("creado_en", { mode: "string" }).defaultNow(),
    actualizadoEn: timestamp("actualizado_en", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.categoriaUsuarioId],
      foreignColumns: [categoriaUsuario.id],
      name: "usuario_autorizado_categoria_usuario_id_fkey",
    }),
    unique("usuario_autorizado_correo_key").on(table.correo),
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
    index("idx_unidad_silabo").using(
      "btree",
      table.silaboId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "silabo_unidad_silabo_id_fkey",
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
      name: "categoria_funcion_acceso_pkey",
    }),
  ],
);

export const silaboAporteResultadoPrograma = pgTable(
  "silabo_aporte_resultado_programa",
  {
    silaboId: integer("silabo_id").notNull(),
    resultadoProgramaCodigo: varchar("resultado_programa_codigo").notNull(),
    resultadoProgramaDescripcion: text("resultado_programa_descripcion"),
    aporteValor: aporteEnum("aporte_valor"),
  },
  (table) => [
    foreignKey({
      columns: [table.silaboId],
      foreignColumns: [silabo.id],
      name: "silabo_aporte_resultado_programa_silabo_id_fkey",
    }),
    primaryKey({
      columns: [table.silaboId, table.resultadoProgramaCodigo],
      name: "silabo_aporte_resultado_programa_pkey",
    }),
  ],
);
