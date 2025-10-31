# 📝 Ejemplos de Uso - Sistema de Roles

## Ejemplo Completo: API de Profesores

Este ejemplo muestra cómo implementar un CRUD completo con protección por roles.

### 1. Controller con Diferentes Niveles de Acceso

```typescript
import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { controller, route, requireRole } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import {
  Listable,
  Readable,
  Creatable,
  Updatable,
  Deletable,
} from "../../types";
import { teacherService } from "./service";
import { USER_ROLES } from "../../constants/roles";

@controller("docente")
export class TeacherController
  implements Listable, Readable, Creatable, Updatable, Deletable
{
  /**
   * GET /api/docente
   * Lista todos los profesores
   * Solo ADMIN y COORDINADOR pueden ver la lista completa
   */
  @route("/", "GET")
  @requireRole("ADMIN", "COORDINADOR")
  async list(req: HttpRequest): Promise<HttpResponseInit> {
    const data = await teacherService.listTeachers();
    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        success: true,
        message: "Lista de profesores obtenida correctamente",
        data: data.items,
        total: data.total,
      },
    };
  }

  /**
   * GET /api/docente/{docenteId}
   * Obtiene el perfil de un profesor
   * Todos los roles autenticados pueden ver perfiles
   */
  @route("/{docenteId}", "GET")
  @requireRole("ADMIN", "COORDINADOR", "DOCENTE")
  async getOne(req: HttpRequest): Promise<HttpResponseInit> {
    const { docenteId } = req.params as { docenteId: string };
    const id = Number(docenteId);

    if (!Number.isFinite(id) || id <= 0) {
      throw new AppError(
        "BadRequest",
        "BAD_REQUEST",
        "Debe especificar un docenteId válido en la ruta.",
      );
    }

    const data = await teacherService.getProfile(id);
    return {
      status: STATUS_CODES.OK,
      jsonBody: { success: true, data },
    };
  }

  /**
   * POST /api/docente
   * Crea un nuevo profesor
   * Solo ADMIN puede crear profesores
   */
  @route("/", "POST")
  @requireRole("ADMIN")
  async create(req: HttpRequest): Promise<HttpResponseInit> {
    const currentUser = (req as any).user;
    const body = await req.json();

    // Registrar quién creó el profesor
    const data = await teacherService.createProfile({
      ...body,
      creadoPor: currentUser.id,
    });

    return {
      status: STATUS_CODES.CREATED,
      jsonBody: {
        success: true,
        message: "Profesor creado correctamente",
        data,
      },
    };
  }

  /**
   * PUT /api/docente/{docenteId}
   * Actualiza el perfil de un profesor
   * ADMIN y COORDINADOR pueden editar cualquier perfil
   * DOCENTE solo puede editar su propio perfil
   */
  @route("/{docenteId}", "PUT")
  @requireRole("ADMIN", "COORDINADOR", "DOCENTE")
  async update(req: HttpRequest): Promise<HttpResponseInit> {
    const currentUser = (req as any).user;
    const { docenteId } = req.params as { docenteId: string };
    const id = Number(docenteId);

    if (!Number.isFinite(id) || id <= 0) {
      throw new AppError(
        "BadRequest",
        "BAD_REQUEST",
        "Debe especificar un docenteId válido en la ruta.",
      );
    }

    // Los docentes solo pueden editar su propio perfil
    if (currentUser.role === USER_ROLES.DOCENTE && currentUser.id !== id) {
      throw new AppError(
        "Forbidden",
        "FORBIDDEN",
        "Solo puedes editar tu propio perfil",
      );
    }

    const body = await req.json();
    const data = await teacherService.updateProfile(id, body);

    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        success: true,
        message: "Perfil actualizado correctamente",
        data,
      },
    };
  }

  /**
   * DELETE /api/docente/{docenteId}
   * Elimina (desactiva) un profesor
   * Solo ADMIN puede eliminar profesores
   */
  @route("/{docenteId}", "DELETE")
  @requireRole("ADMIN")
  async delete(req: HttpRequest): Promise<HttpResponseInit> {
    const currentUser = (req as any).user;
    const { docenteId } = req.params as { docenteId: string };
    const id = Number(docenteId);

    if (!Number.isFinite(id) || id <= 0) {
      throw new AppError(
        "BadRequest",
        "BAD_REQUEST",
        "Debe especificar un docenteId válido en la ruta.",
      );
    }

    // No permitir auto-eliminación
    if (currentUser.id === id) {
      throw new AppError(
        "BadRequest",
        "BAD_REQUEST",
        "No puedes eliminar tu propio usuario",
      );
    }

    await teacherService.deleteProfile(id);

    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        success: true,
        message: "Profesor eliminado correctamente",
      },
    };
  }
}
```

## Ejemplo 2: Endpoint con Lógica Condicional por Rol

```typescript
@controller("syllabus")
export class SyllabusController {
  /**
   * GET /api/syllabus
   * Lista sílabos según el rol del usuario
   */
  @route("/", "GET")
  @requireRole("ADMIN", "COORDINADOR", "DOCENTE")
  async list(req: HttpRequest): Promise<HttpResponseInit> {
    const currentUser = (req as any).user;
    let syllabi;

    switch (currentUser.role) {
      case USER_ROLES.ADMIN:
      case USER_ROLES.COORDINADOR:
        // Admin y Coordinador ven todos los sílabos
        syllabi = await syllabusService.listAll();
        break;

      case USER_ROLES.DOCENTE:
        // Docentes solo ven sus propios sílabos
        syllabi = await syllabusService.listByTeacher(currentUser.id);
        break;

      default:
        throw new AppError("Forbidden", "FORBIDDEN", "Rol no autorizado");
    }

    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        success: true,
        data: syllabi,
      },
    };
  }
}
```

## Ejemplo 3: Middleware Personalizado Adicional

```typescript
/**
 * Helper para verificar si el usuario es el propietario del recurso
 */
function requireOwnership(
  resourceUserId: number,
  currentUserId: number,
  currentUserRole: number,
) {
  // Admin siempre tiene acceso
  if (currentUserRole === USER_ROLES.ADMIN) {
    return;
  }

  // Verificar propiedad
  if (resourceUserId !== currentUserId) {
    throw new AppError(
      "Forbidden",
      "FORBIDDEN",
      "No tienes permisos para acceder a este recurso",
    );
  }
}

@controller("assignments")
export class AssignmentsController {
  @route("/{assignmentId}", "PUT")
  @requireRole("ADMIN", "DOCENTE")
  async update(req: HttpRequest): Promise<HttpResponseInit> {
    const currentUser = (req as any).user;
    const { assignmentId } = req.params as { assignmentId: string };

    // Obtener la asignación
    const assignment = await assignmentService.getById(Number(assignmentId));

    // Verificar propiedad (excepto para admin)
    requireOwnership(assignment.docenteId, currentUser.id, currentUser.role);

    const body = await req.json();
    const updated = await assignmentService.update(Number(assignmentId), body);

    return {
      status: STATUS_CODES.OK,
      jsonBody: { success: true, data: updated },
    };
  }
}
```

## Ejemplo 4: Testing con Diferentes Roles

```typescript
// __tests__/teacher.test.ts
import { teacherService } from "../src/functions/teacher/service";
import { USER_ROLES } from "../src/constants/roles";

describe("Teacher API", () => {
  describe("GET /api/docente", () => {
    it("should allow ADMIN to list all teachers", async () => {
      const mockRequest = createMockRequest({
        user: {
          id: 1,
          role: USER_ROLES.ADMIN,
          email: "admin@test.com",
          name: "Admin",
        },
      });

      const response = await controller.list(mockRequest);
      expect(response.status).toBe(200);
    });

    it("should allow COORDINADOR to list all teachers", async () => {
      const mockRequest = createMockRequest({
        user: {
          id: 2,
          role: USER_ROLES.COORDINADOR,
          email: "coord@test.com",
          name: "Coord",
        },
      });

      const response = await controller.list(mockRequest);
      expect(response.status).toBe(200);
    });

    it("should deny DOCENTE from listing all teachers", async () => {
      const mockRequest = createMockRequest({
        user: {
          id: 3,
          role: USER_ROLES.DOCENTE,
          email: "teacher@test.com",
          name: "Teacher",
        },
      });

      await expect(controller.list(mockRequest)).rejects.toThrow("Forbidden");
    });
  });
});
```

## Resumen de Patrones

### Patrón 1: Acceso Completo por Rol

```typescript
@requireRole("ADMIN")
async adminOnlyEndpoint() { ... }
```

### Patrón 2: Múltiples Roles con Mismos Permisos

```typescript
@requireRole("ADMIN", "COORDINADOR")
async managerEndpoint() { ... }
```

### Patrón 3: Todos los Roles Autenticados

```typescript
@requireRole("ADMIN", "COORDINADOR", "DOCENTE")
async authenticatedEndpoint() { ... }
```

### Patrón 4: Rol + Verificación de Propiedad

```typescript
@requireRole("ADMIN", "DOCENTE")
async update(req: HttpRequest) {
  const user = (req as any).user;
  if (user.role !== USER_ROLES.ADMIN && user.id !== resourceOwnerId) {
    throw new AppError("Forbidden", "FORBIDDEN", "...");
  }
  // ...
}
```

### Patrón 5: Lógica Diferente por Rol

```typescript
@requireRole("ADMIN", "DOCENTE")
async getData(req: HttpRequest) {
  const user = (req as any).user;

  if (user.role === USER_ROLES.ADMIN) {
    return getAllData();
  } else {
    return getUserData(user.id);
  }
}
```
