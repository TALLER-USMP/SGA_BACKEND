# 🔐 Sistema de Autenticación y Roles

## Descripción General

El sistema utiliza JWT (JSON Web Tokens) para autenticación y un sistema de roles basado en constantes para autorización.

## Roles del Sistema

Los roles están definidos en `src/constants/roles.ts`:

```typescript
export const USER_ROLES = {
  ADMIN: 1,
  COORDINADOR: 2,
  DOCENTE: 3,
} as const;
```

### Configuración de Roles

**IMPORTANTE**: Los IDs de roles deben coincidir con los valores en la tabla `categoria_usuario` de tu base de datos.

Para agregar nuevos roles:

1. Actualiza `src/constants/roles.ts`:

   ```typescript
   export const USER_ROLES = {
     ADMIN: 1,
     COORDINADOR: 2,
     DOCENTE: 3,
     ESTUDIANTE: 4, // Nuevo rol
   } as const;
   ```

2. Asegúrate de que el ID coincida con la base de datos:
   ```sql
   SELECT id, nombre_categoria FROM categoria_usuario;
   ```

## Decorador @requireRole

### Uso Básico

```typescript
import { controller, route, requireRole } from "../../lib/decorators";

@controller("docente")
export class TeacherController {
  // Solo ADMIN y COORDINADOR pueden acceder
  @route("/", "GET")
  @requireRole("ADMIN", "COORDINADOR")
  async list(req: HttpRequest): Promise<HttpResponseInit> {
    // Tu código aquí
  }

  // Solo ADMIN puede acceder
  @route("/", "DELETE")
  @requireRole("ADMIN")
  async delete(req: HttpRequest): Promise<HttpResponseInit> {
    // Tu código aquí
  }

  // Todos los roles autenticados pueden acceder
  @route("/profile", "GET")
  @requireRole("ADMIN", "COORDINADOR", "DOCENTE")
  async getProfile(req: HttpRequest): Promise<HttpResponseInit> {
    // Tu código aquí
  }
}
```

### Cómo Funciona

1. **Extracción del Token**: El decorador busca el JWT en orden de prioridad:
   - Cookie `sessionSGA`
   - Query parameter `?token=...`
   - Body del request `{ "token": "..." }`

2. **Verificación del Token**: Valida el JWT usando la variable de entorno `JWT_SECRET`

3. **Conversión de Roles**: Convierte los nombres de roles a IDs en tiempo de decoración

4. **Validación de Rol**: Comprueba si el rol del usuario está en la lista de roles permitidos

5. **Inyección de Usuario**: Si la validación es exitosa, inyecta el objeto `user` en el request

### Acceso al Usuario Autenticado

Después de pasar la validación del decorador, puedes acceder a la información del usuario:

```typescript
@route("/", "GET")
@requireRole("ADMIN", "COORDINADOR")
async list(req: HttpRequest): Promise<HttpResponseInit> {
  // Acceder al usuario autenticado
  const currentUser = (req as any).user;

  console.log(`Usuario: ${currentUser.name}`);
  console.log(`Email: ${currentUser.email}`);
  console.log(`Role ID: ${currentUser.role}`);
  console.log(`User ID: ${currentUser.id}`);

  // Tu lógica aquí
}
```

### Estructura del Usuario en el Request

```typescript
interface UserSession {
  id: number; // ID del usuario en la base de datos
  email: string; // Email del usuario
  role: number; // ID del rol (1, 2, 3, etc.)
  name: string | null; // Nombre completo del usuario
}
```

## Respuestas de Error

### 401 Unauthorized

Se retorna cuando:

- No se proporciona un token
- El token es inválido
- El token ha expirado

```json
{
  "name": "Unauthorized",
  "code": "UNAUTHORIZED",
  "message": "Token de autenticación requerido"
}
```

### 403 Forbidden

Se retorna cuando:

- El usuario está autenticado pero no tiene el rol necesario

```json
{
  "name": "Forbidden",
  "code": "FORBIDDEN",
  "message": "No tienes permisos para acceder a este recurso. Roles permitidos: ADMIN, COORDINADOR"
}
```

## Ejemplos de Uso

### Ejemplo 1: Endpoint Solo para Administradores

```typescript
@controller("users")
export class UserController {
  @route("/", "DELETE")
  @requireRole("ADMIN")
  async deleteUser(req: HttpRequest): Promise<HttpResponseInit> {
    const userId = req.params.userId;
    await userService.delete(userId);

    return {
      status: STATUS_CODES.OK,
      jsonBody: { success: true, message: "Usuario eliminado" },
    };
  }
}
```

### Ejemplo 2: Endpoint para Múltiples Roles

```typescript
@controller("syllabus")
export class SyllabusController {
  @route("/", "POST")
  @requireRole("ADMIN", "COORDINADOR", "DOCENTE")
  async create(req: HttpRequest): Promise<HttpResponseInit> {
    const currentUser = (req as any).user;
    const body = await req.json();

    // Lógica específica por rol
    if (currentUser.role === USER_ROLES.DOCENTE) {
      // Los docentes solo pueden crear sus propios sílabos
      body.docenteId = currentUser.id;
    }

    const syllabus = await syllabusService.create(body);
    return {
      status: STATUS_CODES.CREATED,
      jsonBody: { success: true, data: syllabus },
    };
  }
}
```

### Ejemplo 3: Verificación Adicional de Permisos

```typescript
@controller("docente")
export class TeacherController {
  @route("/{docenteId}", "PUT")
  @requireRole("ADMIN", "COORDINADOR", "DOCENTE")
  async update(req: HttpRequest): Promise<HttpResponseInit> {
    const currentUser = (req as any).user;
    const docenteId = Number(req.params.docenteId);

    // Los docentes solo pueden editar su propio perfil
    if (
      currentUser.role === USER_ROLES.DOCENTE &&
      currentUser.id !== docenteId
    ) {
      throw new AppError(
        "Forbidden",
        "FORBIDDEN",
        "Solo puedes editar tu propio perfil",
      );
    }

    const body = await req.json();
    const updated = await teacherService.updateProfile(docenteId, body);

    return {
      status: STATUS_CODES.OK,
      jsonBody: { success: true, data: updated },
    };
  }
}
```

## Testing

### Obtener un Token de Prueba

```bash
# 1. Login con Microsoft
POST /api/auth/login
{
  "microsoftToken": "..."
}

# Respuesta:
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": 1,
    "name": "Usuario Test"
  },
  "url": "http://dashboard.com?token=eyJhbGc..."
}
```

### Usar el Token en Requests

```bash
# Opción 1: Cookie
curl -X GET http://localhost:7071/api/docente \
  -H "Cookie: sessionSGA=eyJhbGc..."

# Opción 2: Query Parameter
curl -X GET "http://localhost:7071/api/docente?token=eyJhbGc..."

# Opción 3: Body
curl -X POST http://localhost:7071/api/docente \
  -H "Content-Type: application/json" \
  -d '{"token": "eyJhbGc..."}'
```

## Utilidades

### Funciones Helper

```typescript
import {
  USER_ROLES,
  getRoleName,
  isValidRoleId,
  roleNamesToIds,
} from "../constants/roles";

// Convertir nombres a IDs
const roleIds = roleNamesToIds(["ADMIN", "COORDINADOR"]); // [1, 2]

// Obtener nombre de un rol
const roleName = getRoleName(1); // "ADMIN"

// Verificar si un ID es válido
const isValid = isValidRoleId(999); // false
```

## Mejores Prácticas

1. **Siempre usa nombres de roles**, no números mágicos:

   ```typescript
   // ✅ Correcto
   @requireRole("ADMIN", "COORDINADOR")

   // ❌ Incorrecto
   @requireRole(1, 2)
   ```

2. **Valida permisos adicionales en el handler** cuando sea necesario:

   ```typescript
   @requireRole("DOCENTE")
   async update(req: HttpRequest) {
     const user = (req as any).user;
     // Verificación adicional de permisos
     if (user.id !== resourceOwnerId) {
       throw new AppError("Forbidden", "FORBIDDEN", "...");
     }
   }
   ```

3. **Documenta los roles requeridos** en los comentarios:

   ```typescript
   /**
    * Lista todos los profesores
    * @requires ADMIN, COORDINADOR
    */
   @route("/", "GET")
   @requireRole("ADMIN", "COORDINADOR")
   async list(req: HttpRequest) { ... }
   ```

4. **Mantén sincronizados** los roles en código con la base de datos

## Troubleshooting

### Error: "Token inválido o expirado"

- Verifica que `JWT_SECRET` esté configurado en `.env`
- Verifica que el token no haya expirado (duración: 1 día)
- Obtén un nuevo token con `/api/auth/login`

### Error: "No tienes permisos para acceder a este recurso"

- Verifica que el usuario tenga el rol correcto en la base de datos
- Verifica que los IDs en `USER_ROLES` coincidan con la tabla `categoria_usuario`

### El decorador no funciona

- Asegúrate de que el decorador esté **antes** del decorador `@route`
- Verifica que estés importando desde `../../lib/decorators`
