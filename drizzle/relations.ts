import { relations } from "drizzle-orm/relations";
import {
  docente,
  silaboSeccionPermiso,
  silabo,
  categoriaUsuario,
  gradoAcademicoCatalogo,
  silaboDocente,
  silaboSumilla,
  silaboUnidad,
  silaboResultadoAprendizaje,
  silaboFuente,
  silaboCompetenciaCurso,
  recursoDidacticoCatalogo,
  silaboRecursoDidactico,
  silaboCompetenciaComponente,
  planEvaluacionOferta,
  formulaEvaluacionRegla,
  formulaEvaluacionVariable,
  formulaEvaluacionSubformula,
  formulaEvaluacionVariablePlan,
  auditEvent,
  silaboRevisionSeccion,
  formulaEvaluacionBase,
  evaluacionAprendizaje,
  silaboRevisionComentario,
  silaboRevisionHistorial,
  categoriaFuncion,
  funcionAplicacion,
  silaboAporteResultadoPrograma,
} from "./schema";

export const silaboSeccionPermisoRelations = relations(
  silaboSeccionPermiso,
  ({ one }) => ({
    docente: one(docente, {
      fields: [silaboSeccionPermiso.docenteId],
      references: [docente.id],
    }),
    silabo: one(silabo, {
      fields: [silaboSeccionPermiso.silaboId],
      references: [silabo.id],
    }),
  }),
);

export const docenteRelations = relations(docente, ({ one, many }) => ({
  silaboSeccionPermisos: many(silaboSeccionPermiso),
  categoriaUsuario: one(categoriaUsuario, {
    fields: [docente.categoriaUsuarioId],
    references: [categoriaUsuario.id],
  }),
  gradoAcademicoCatalogo: one(gradoAcademicoCatalogo, {
    fields: [docente.gradoAcademicoId],
    references: [gradoAcademicoCatalogo.id],
  }),
  silaboDocentes: many(silaboDocente),
  silabos_actualizadoPorDocenteId: many(silabo, {
    relationName: "silabo_actualizadoPorDocenteId_docente_id",
  }),
  silabos_asignadoADocenteId: many(silabo, {
    relationName: "silabo_asignadoADocenteId_docente_id",
  }),
  silabos_creadoPorDocenteId: many(silabo, {
    relationName: "silabo_creadoPorDocenteId_docente_id",
  }),
  auditEvents: many(auditEvent),
  silaboRevisionSeccions: many(silaboRevisionSeccion),
  silaboRevisionComentarios: many(silaboRevisionComentario),
  silaboRevisionHistorials: many(silaboRevisionHistorial),
}));

export const silaboRelations = relations(silabo, ({ one, many }) => ({
  silaboSeccionPermisos: many(silaboSeccionPermiso),
  silaboDocentes: many(silaboDocente),
  docente_actualizadoPorDocenteId: one(docente, {
    fields: [silabo.actualizadoPorDocenteId],
    references: [docente.id],
    relationName: "silabo_actualizadoPorDocenteId_docente_id",
  }),
  docente_asignadoADocenteId: one(docente, {
    fields: [silabo.asignadoADocenteId],
    references: [docente.id],
    relationName: "silabo_asignadoADocenteId_docente_id",
  }),
  docente_creadoPorDocenteId: one(docente, {
    fields: [silabo.creadoPorDocenteId],
    references: [docente.id],
    relationName: "silabo_creadoPorDocenteId_docente_id",
  }),
  silaboSumillas: many(silaboSumilla),
  silaboUnidads: many(silaboUnidad),
  silaboResultadoAprendizajes: many(silaboResultadoAprendizaje),
  silaboFuentes: many(silaboFuente),
  silaboCompetenciaCursos: many(silaboCompetenciaCurso),
  silaboRecursoDidacticos: many(silaboRecursoDidactico),
  silaboCompetenciaComponentes: many(silaboCompetenciaComponente),
  planEvaluacionOfertas: many(planEvaluacionOferta),
  formulaEvaluacionReglas: many(formulaEvaluacionRegla),
  auditEvents: many(auditEvent),
  silaboRevisionSeccions: many(silaboRevisionSeccion),
  evaluacionAprendizajes: many(evaluacionAprendizaje),
  silaboRevisionHistorials: many(silaboRevisionHistorial),
  silaboAporteResultadoProgramas: many(silaboAporteResultadoPrograma),
}));

export const categoriaUsuarioRelations = relations(
  categoriaUsuario,
  ({ many }) => ({
    docentes: many(docente),
    categoriaFuncions: many(categoriaFuncion),
  }),
);

export const gradoAcademicoCatalogoRelations = relations(
  gradoAcademicoCatalogo,
  ({ many }) => ({
    docentes: many(docente),
  }),
);

export const silaboDocenteRelations = relations(silaboDocente, ({ one }) => ({
  docente: one(docente, {
    fields: [silaboDocente.docenteId],
    references: [docente.id],
  }),
  silabo: one(silabo, {
    fields: [silaboDocente.silaboId],
    references: [silabo.id],
  }),
}));

export const silaboSumillaRelations = relations(silaboSumilla, ({ one }) => ({
  silabo: one(silabo, {
    fields: [silaboSumilla.silaboId],
    references: [silabo.id],
  }),
}));

export const silaboUnidadRelations = relations(
  silaboUnidad,
  ({ one, many }) => ({
    silabo: one(silabo, {
      fields: [silaboUnidad.silaboId],
      references: [silabo.id],
    }),
    silaboRecursoDidacticos: many(silaboRecursoDidactico),
  }),
);

export const silaboResultadoAprendizajeRelations = relations(
  silaboResultadoAprendizaje,
  ({ one }) => ({
    silabo: one(silabo, {
      fields: [silaboResultadoAprendizaje.silaboId],
      references: [silabo.id],
    }),
  }),
);

export const silaboFuenteRelations = relations(silaboFuente, ({ one }) => ({
  silabo: one(silabo, {
    fields: [silaboFuente.silaboId],
    references: [silabo.id],
  }),
}));

export const silaboCompetenciaCursoRelations = relations(
  silaboCompetenciaCurso,
  ({ one }) => ({
    silabo: one(silabo, {
      fields: [silaboCompetenciaCurso.silaboId],
      references: [silabo.id],
    }),
  }),
);

export const silaboRecursoDidacticoRelations = relations(
  silaboRecursoDidactico,
  ({ one }) => ({
    recursoDidacticoCatalogo: one(recursoDidacticoCatalogo, {
      fields: [silaboRecursoDidactico.recursoId],
      references: [recursoDidacticoCatalogo.id],
    }),
    silabo: one(silabo, {
      fields: [silaboRecursoDidactico.silaboId],
      references: [silabo.id],
    }),
    silaboUnidad: one(silaboUnidad, {
      fields: [silaboRecursoDidactico.silaboUnidadId],
      references: [silaboUnidad.id],
    }),
  }),
);

export const recursoDidacticoCatalogoRelations = relations(
  recursoDidacticoCatalogo,
  ({ many }) => ({
    silaboRecursoDidacticos: many(silaboRecursoDidactico),
  }),
);

export const silaboCompetenciaComponenteRelations = relations(
  silaboCompetenciaComponente,
  ({ one }) => ({
    silabo: one(silabo, {
      fields: [silaboCompetenciaComponente.silaboId],
      references: [silabo.id],
    }),
  }),
);

export const planEvaluacionOfertaRelations = relations(
  planEvaluacionOferta,
  ({ one, many }) => ({
    silabo: one(silabo, {
      fields: [planEvaluacionOferta.silaboId],
      references: [silabo.id],
    }),
    formulaEvaluacionVariablePlans: many(formulaEvaluacionVariablePlan),
  }),
);

export const formulaEvaluacionReglaRelations = relations(
  formulaEvaluacionRegla,
  ({ one, many }) => ({
    silabo: one(silabo, {
      fields: [formulaEvaluacionRegla.silaboId],
      references: [silabo.id],
    }),
    formulaEvaluacionVariables: many(formulaEvaluacionVariable),
    formulaEvaluacionSubformulas: many(formulaEvaluacionSubformula),
    formulaEvaluacionVariablePlans: many(formulaEvaluacionVariablePlan),
  }),
);

export const formulaEvaluacionVariableRelations = relations(
  formulaEvaluacionVariable,
  ({ one }) => ({
    formulaEvaluacionRegla: one(formulaEvaluacionRegla, {
      fields: [formulaEvaluacionVariable.formulaEvaluacionReglaId],
      references: [formulaEvaluacionRegla.id],
    }),
  }),
);

export const formulaEvaluacionSubformulaRelations = relations(
  formulaEvaluacionSubformula,
  ({ one }) => ({
    formulaEvaluacionRegla: one(formulaEvaluacionRegla, {
      fields: [formulaEvaluacionSubformula.formulaEvaluacionReglaId],
      references: [formulaEvaluacionRegla.id],
    }),
  }),
);

export const formulaEvaluacionVariablePlanRelations = relations(
  formulaEvaluacionVariablePlan,
  ({ one }) => ({
    formulaEvaluacionRegla: one(formulaEvaluacionRegla, {
      fields: [formulaEvaluacionVariablePlan.formulaEvaluacionReglaId],
      references: [formulaEvaluacionRegla.id],
    }),
    planEvaluacionOferta: one(planEvaluacionOferta, {
      fields: [formulaEvaluacionVariablePlan.planEvaluacionOfertaId],
      references: [planEvaluacionOferta.id],
    }),
  }),
);

export const auditEventRelations = relations(auditEvent, ({ one }) => ({
  docente: one(docente, {
    fields: [auditEvent.docenteId],
    references: [docente.id],
  }),
  silabo: one(silabo, {
    fields: [auditEvent.silaboId],
    references: [silabo.id],
  }),
}));

export const silaboRevisionSeccionRelations = relations(
  silaboRevisionSeccion,
  ({ one, many }) => ({
    docente: one(docente, {
      fields: [silaboRevisionSeccion.revisadoPor],
      references: [docente.id],
    }),
    silabo: one(silabo, {
      fields: [silaboRevisionSeccion.silaboId],
      references: [silabo.id],
    }),
    silaboRevisionComentarios: many(silaboRevisionComentario),
  }),
);

export const evaluacionAprendizajeRelations = relations(
  evaluacionAprendizaje,
  ({ one }) => ({
    formulaEvaluacionBase: one(formulaEvaluacionBase, {
      fields: [evaluacionAprendizaje.formulaBaseId],
      references: [formulaEvaluacionBase.id],
    }),
    silabo: one(silabo, {
      fields: [evaluacionAprendizaje.silaboId],
      references: [silabo.id],
    }),
  }),
);

export const formulaEvaluacionBaseRelations = relations(
  formulaEvaluacionBase,
  ({ many }) => ({
    evaluacionAprendizajes: many(evaluacionAprendizaje),
  }),
);

export const silaboRevisionComentarioRelations = relations(
  silaboRevisionComentario,
  ({ one }) => ({
    docente: one(docente, {
      fields: [silaboRevisionComentario.autorId],
      references: [docente.id],
    }),
    silaboRevisionSeccion: one(silaboRevisionSeccion, {
      fields: [silaboRevisionComentario.silaboRevisionSeccionId],
      references: [silaboRevisionSeccion.id],
    }),
  }),
);

export const silaboRevisionHistorialRelations = relations(
  silaboRevisionHistorial,
  ({ one }) => ({
    docente: one(docente, {
      fields: [silaboRevisionHistorial.revisorId],
      references: [docente.id],
    }),
    silabo: one(silabo, {
      fields: [silaboRevisionHistorial.silaboId],
      references: [silabo.id],
    }),
  }),
);

export const categoriaFuncionRelations = relations(
  categoriaFuncion,
  ({ one }) => ({
    categoriaUsuario: one(categoriaUsuario, {
      fields: [categoriaFuncion.categoriaUsuarioId],
      references: [categoriaUsuario.id],
    }),
    funcionAplicacion: one(funcionAplicacion, {
      fields: [categoriaFuncion.funcionAplicacionId],
      references: [funcionAplicacion.id],
    }),
  }),
);

export const funcionAplicacionRelations = relations(
  funcionAplicacion,
  ({ many }) => ({
    categoriaFuncions: many(categoriaFuncion),
  }),
);

export const silaboAporteResultadoProgramaRelations = relations(
  silaboAporteResultadoPrograma,
  ({ one }) => ({
    silabo: one(silabo, {
      fields: [silaboAporteResultadoPrograma.silaboId],
      references: [silabo.id],
    }),
  }),
);
