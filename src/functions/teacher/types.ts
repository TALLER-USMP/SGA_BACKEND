import { z } from "zod";

export const TeacherProfileOutSchema = z.object({
  nombre: z.string().nullable(),
  grado: z.string().nullable(),
  correo: z.string().email().nullable(),
  apellido: z.string().nullable().optional(),
  bachiller: z.string().nullable().optional(),
});
export type TeacherProfileOut = z.infer<typeof TeacherProfileOutSchema>;

export const TeacherProfileUpdateSchema = z.object({
  nombre: z.string().min(1).max(100).optional(), // docente.nombre_docente
  gradoAcademicoId: z.number().int().positive().optional(), // FK al catálogo
  grado: z.string().min(1).max(100).optional(), //  docente.grado_academico
  correo: z.string().email().optional(), // docente.correo
});
export type TeacherProfileUpdate = z.infer<typeof TeacherProfileUpdateSchema>;

// Schema para el listado de profesores
export const TeacherListItemSchema = z.object({
  id: z.number().int().positive(),
  nombre: z.string().nullable(),
  correo: z.string().email(),
  grado: z.string().nullable(),
  categoria: z.string().nullable(),
  categoriaId: z.number().int().positive(),
  activo: z.boolean(),
  ultimoAcceso: z.string().nullable(),
});
export type TeacherListItem = z.infer<typeof TeacherListItemSchema>;

export const TeacherListResponseSchema = z.object({
  items: z.array(TeacherListItemSchema),
  total: z.number().int().nonnegative(),
});
export type TeacherListResponse = z.infer<typeof TeacherListResponseSchema>;
