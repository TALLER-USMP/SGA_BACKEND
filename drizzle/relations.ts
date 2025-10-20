import { relations } from "drizzle-orm/relations";
import {
  categoriaUsuario,
  docente,
  silabo,
  silaboDocente,
  docenteRolCatalogo,
  silaboSumilla,
  silaboResultadoAprendizajeCurso,
  silaboUnidad,
  silaboUnidadSemana,
  silaboUnidadContenido,
  recursoDidacticoCatalogo,
  silaboRecursoDidactico,
  silaboFuente,
  silaboCompetenciaCurso,
  silaboCompetenciaComponente,
  planEvaluacionOferta,
  formulaEvaluacionRegla,
  formulaEvaluacionVariable,
  formulaEvaluacionSubformula,
  formulaEvaluacionVariablePlan,
  formulaEvaluacionBase,
  evaluacionAprendizaje,
  auditEvent,
  auditEventDetalle,
  categoriaFuncionAcceso,
  funcionAplicacion,
  silaboAporteResultadoPrograma,
  gradoAcademicoDocente,
  gradoAcademicoCatalogo,
} from "./schema";

export const docenteRelations = relations(docente, ({ one, many }) => ({
  categoriaUsuario: one(categoriaUsuario, {
    fields: [docente.categoriaUsuarioId],
    references: [categoriaUsuario.id],
  }),
  silabos_actualizadoPorDocenteId: many(silabo, {
    relationName: "silabo_actualizadoPorDocenteId_docente_id",
  }),
  silabos_asignadoADocenteId: many(silabo, {
    relationName: "silabo_asignadoADocenteId_docente_id",
  }),
  silabos_creadoPorDocenteId: many(silabo, {
    relationName: "silabo_creadoPorDocenteId_docente_id",
  }),
  silaboDocentes: many(silaboDocente),
  auditEvents: many(auditEvent),
  gradoAcademicoDocentes: many(gradoAcademicoDocente),
}));

export const categoriaUsuarioRelations = relations(
  categoriaUsuario,
  ({ many }) => ({
    docentes: many(docente),
    categoriaFuncionAccesos: many(categoriaFuncionAcceso),
  }),
);

export const silaboRelations = relations(silabo, ({ one, many }) => ({
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
  silaboDocentes: many(silaboDocente),
  silaboSumillas: many(silaboSumilla),
  silaboResultadoAprendizajeCursos: many(silaboResultadoAprendizajeCurso),
  silaboUnidads: many(silaboUnidad),
  silaboRecursoDidacticos: many(silaboRecursoDidactico),
  silaboFuentes: many(silaboFuente),
  silaboCompetenciaCursos: many(silaboCompetenciaCurso),
  silaboCompetenciaComponentes: many(silaboCompetenciaComponente),
  planEvaluacionOfertas: many(planEvaluacionOferta),
  formulaEvaluacionReglas: many(formulaEvaluacionRegla),
  evaluacionAprendizajes: many(evaluacionAprendizaje),
  auditEvents: many(auditEvent),
  silaboAporteResultadoProgramas: many(silaboAporteResultadoPrograma),
}));

export const silaboDocenteRelations = relations(silaboDocente, ({ one }) => ({
  docente: one(docente, {
    fields: [silaboDocente.docenteId],
    references: [docente.id],
  }),
  docenteRolCatalogo: one(docenteRolCatalogo, {
    fields: [silaboDocente.docenteRolId],
    references: [docenteRolCatalogo.id],
  }),
  silabo: one(silabo, {
    fields: [silaboDocente.silaboId],
    references: [silabo.id],
  }),
}));

export const docenteRolCatalogoRelations = relations(
  docenteRolCatalogo,
  ({ many }) => ({
    silaboDocentes: many(silaboDocente),
  }),
);

export const silaboSumillaRelations = relations(silaboSumilla, ({ one }) => ({
  silabo: one(silabo, {
    fields: [silaboSumilla.silaboId],
    references: [silabo.id],
  }),
}));

export const silaboResultadoAprendizajeCursoRelations = relations(
  silaboResultadoAprendizajeCurso,
  ({ one }) => ({
    silabo: one(silabo, {
      fields: [silaboResultadoAprendizajeCurso.silaboId],
      references: [silabo.id],
    }),
  }),
);

export const silaboUnidadRelations = relations(
  silaboUnidad,
  ({ one, many }) => ({
    silabo: one(silabo, {
      fields: [silaboUnidad.silaboId],
      references: [silabo.id],
    }),
    silaboUnidadSemanas: many(silaboUnidadSemana),
    silaboUnidadContenidos: many(silaboUnidadContenido),
    silaboRecursoDidacticos: many(silaboRecursoDidactico),
  }),
);

export const silaboUnidadSemanaRelations = relations(
  silaboUnidadSemana,
  ({ one, many }) => ({
    silaboUnidad: one(silaboUnidad, {
      fields: [silaboUnidadSemana.silaboUnidadId],
      references: [silaboUnidad.id],
    }),
    silaboRecursoDidacticos: many(silaboRecursoDidactico),
  }),
);

export const silaboUnidadContenidoRelations = relations(
  silaboUnidadContenido,
  ({ one }) => ({
    silaboUnidad: one(silaboUnidad, {
      fields: [silaboUnidadContenido.silaboUnidadId],
      references: [silaboUnidad.id],
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
    silaboUnidadSemana: one(silaboUnidadSemana, {
      fields: [silaboRecursoDidactico.silaboUnidadSemanaId],
      references: [silaboUnidadSemana.id],
    }),
  }),
);

export const recursoDidacticoCatalogoRelations = relations(
  recursoDidacticoCatalogo,
  ({ many }) => ({
    silaboRecursoDidacticos: many(silaboRecursoDidactico),
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

export const auditEventRelations = relations(auditEvent, ({ one, many }) => ({
  docente: one(docente, {
    fields: [auditEvent.docenteId],
    references: [docente.id],
  }),
  silabo: one(silabo, {
    fields: [auditEvent.silaboId],
    references: [silabo.id],
  }),
  auditEventDetalles: many(auditEventDetalle),
}));

export const auditEventDetalleRelations = relations(
  auditEventDetalle,
  ({ one }) => ({
    auditEvent: one(auditEvent, {
      fields: [auditEventDetalle.auditEventId],
      references: [auditEvent.id],
    }),
  }),
);

export const categoriaFuncionAccesoRelations = relations(
  categoriaFuncionAcceso,
  ({ one }) => ({
    categoriaUsuario: one(categoriaUsuario, {
      fields: [categoriaFuncionAcceso.categoriaUsuarioId],
      references: [categoriaUsuario.id],
    }),
    funcionAplicacion: one(funcionAplicacion, {
      fields: [categoriaFuncionAcceso.funcionAplicacionId],
      references: [funcionAplicacion.id],
    }),
  }),
);

export const funcionAplicacionRelations = relations(
  funcionAplicacion,
  ({ many }) => ({
    categoriaFuncionAccesos: many(categoriaFuncionAcceso),
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

export const gradoAcademicoDocenteRelations = relations(
  gradoAcademicoDocente,
  ({ one }) => ({
    docente: one(docente, {
      fields: [gradoAcademicoDocente.docenteId],
      references: [docente.id],
    }),
    gradoAcademicoCatalogo: one(gradoAcademicoCatalogo, {
      fields: [gradoAcademicoDocente.gradoAcademicoId],
      references: [gradoAcademicoCatalogo.id],
    }),
  }),
);

export const gradoAcademicoCatalogoRelations = relations(
  gradoAcademicoCatalogo,
  ({ many }) => ({
    gradoAcademicoDocentes: many(gradoAcademicoDocente),
  }),
);
