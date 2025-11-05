# API de Unidades - Ejemplos de Uso

## Resumen

Los endpoints de unidades ahora incluyen la relación completa con la tabla `silabo_unidad_semana`. Cada unidad puede tener múltiples semanas asociadas (de 1 a 16).

## Endpoints Disponibles

### 1. GET /api/syllabus/{id}/unidades

Obtener todas las unidades de un sílabo con sus semanas

**Request:**

```http
GET /api/syllabus/123/unidades
```

**Response:**

```json
{
  "success": true,
  "message": "Unidades obtenidas correctamente",
  "data": [
    {
      "id": 1,
      "silaboId": 123,
      "numero": 1,
      "titulo": "Introducción a la Programación",
      "capacidadesText": "Capacidad para analizar problemas",
      "semanaInicio": 1,
      "semanaFin": 4,
      "contenidosConceptuales": "Variables, tipos de datos",
      "contenidosProcedimentales": "Ejercicios de lógica",
      "actividadesAprendizaje": "Resolución de problemas",
      "horasLectivasTeoria": 20,
      "horasLectivasPractica": 10,
      "horasNoLectivasTeoria": 15,
      "horasNoLectivasPractica": 5,
      "creadoEn": "2025-01-01T10:00:00Z",
      "actualizadoEn": "2025-01-01T10:00:00Z",
      "semanas": [
        {
          "id": 1,
          "silaboUnidadId": 1,
          "semana": 1,
          "contenidosConceptuales": "Introducción a variables",
          "contenidosProcedimentales": "Ejercicios básicos de variables",
          "actividadesAprendizaje": "Práctica guiada en laboratorio",
          "horasLectivasTeoria": 2,
          "horasLectivasPractica": 2,
          "horasNoLectivasTeoria": 1,
          "horasNoLectivasPractica": 1,
          "creadoEn": "2025-01-01T10:00:00Z",
          "actualizadoEn": "2025-01-01T10:00:00Z"
        },
        {
          "id": 2,
          "silaboUnidadId": 1,
          "semana": 2,
          "contenidosConceptuales": "Tipos de datos primitivos",
          "contenidosProcedimentales": "Conversión de tipos",
          "actividadesAprendizaje": "Ejercicios prácticos",
          "horasLectivasTeoria": 2,
          "horasLectivasPractica": 2,
          "horasNoLectivasTeoria": 1,
          "horasNoLectivasPractica": 1,
          "creadoEn": "2025-01-02T10:00:00Z",
          "actualizadoEn": "2025-01-02T10:00:00Z"
        }
      ]
    }
  ]
}
```

---

### 2. GET /api/syllabus/{id}/unidades/{unidadId}

Obtener una unidad específica con todas sus semanas

**Request:**

```http
GET /api/syllabus/123/unidades/1
```

**Response:**

```json
{
  "success": true,
  "message": "Unidad obtenida correctamente",
  "data": {
    "id": 1,
    "silaboId": 123,
    "numero": 1,
    "titulo": "Introducción a la Programación",
    "capacidadesText": "Capacidad para analizar problemas",
    "semanaInicio": 1,
    "semanaFin": 4,
    "contenidosConceptuales": "Variables, tipos de datos",
    "contenidosProcedimentales": "Ejercicios de lógica",
    "actividadesAprendizaje": "Resolución de problemas",
    "horasLectivasTeoria": 20,
    "horasLectivasPractica": 10,
    "horasNoLectivasTeoria": 15,
    "horasNoLectivasPractica": 5,
    "creadoEn": "2025-01-01T10:00:00Z",
    "actualizadoEn": "2025-01-01T10:00:00Z",
    "semanas": [
      {
        "id": 1,
        "silaboUnidadId": 1,
        "semana": 1,
        "contenidosConceptuales": "Introducción a variables",
        "contenidosProcedimentales": "Ejercicios básicos de variables",
        "actividadesAprendizaje": "Práctica guiada en laboratorio",
        "horasLectivasTeoria": 2,
        "horasLectivasPractica": 2,
        "horasNoLectivasTeoria": 1,
        "horasNoLectivasPractica": 1
      }
    ]
  }
}
```

---

### 3. POST /api/syllabus/{id}/unidades

Crear una nueva unidad con sus semanas

**Request:**

```http
POST /api/syllabus/123/unidades
Content-Type: application/json

{
  "numero": 2,
  "titulo": "Estructuras de Control",
  "capacidadesText": "Dominar las estructuras de control de flujo",
  "semanaInicio": 5,
  "semanaFin": 8,
  "contenidosConceptuales": "If, switch, bucles",
  "contenidosProcedimentales": "Implementación de algoritmos",
  "actividadesAprendizaje": "Proyectos prácticos",
  "horasLectivasTeoria": 16,
  "horasLectivasPractica": 12,
  "horasNoLectivasTeoria": 10,
  "horasNoLectivasPractica": 8,
  "semanas": [
    {
      "semana": 5,
      "contenidosConceptuales": "Estructuras condicionales simples",
      "contenidosProcedimentales": "Ejercicios con if-else",
      "actividadesAprendizaje": "Resolución de casos",
      "horasLectivasTeoria": 2,
      "horasLectivasPractica": 2,
      "horasNoLectivasTeoria": 1,
      "horasNoLectivasPractica": 1
    },
    {
      "semana": 6,
      "contenidosConceptuales": "Estructuras switch-case",
      "contenidosProcedimentales": "Menús de opciones",
      "actividadesAprendizaje": "Proyecto de menú",
      "horasLectivasTeoria": 2,
      "horasLectivasPractica": 2,
      "horasNoLectivasTeoria": 1,
      "horasNoLectivasPractica": 1
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Unidad creada correctamente",
  "data": {
    "id": 2,
    "silaboId": 123,
    "numero": 2,
    "titulo": "Estructuras de Control",
    "capacidadesText": "Dominar las estructuras de control de flujo",
    "semanaInicio": 5,
    "semanaFin": 8,
    "contenidosConceptuales": "If, switch, bucles",
    "contenidosProcedimentales": "Implementación de algoritmos",
    "actividadesAprendizaje": "Proyectos prácticos",
    "horasLectivasTeoria": 16,
    "horasLectivasPractica": 12,
    "horasNoLectivasTeoria": 10,
    "horasNoLectivasPractica": 8,
    "semanas": [
      {
        "id": 5,
        "silaboUnidadId": 2,
        "semana": 5,
        "contenidosConceptuales": "Estructuras condicionales simples",
        "contenidosProcedimentales": "Ejercicios con if-else",
        "actividadesAprendizaje": "Resolución de casos",
        "horasLectivasTeoria": 2,
        "horasLectivasPractica": 2,
        "horasNoLectivasTeoria": 1,
        "horasNoLectivasPractica": 1,
        "creadoEn": "2025-01-05T10:00:00Z",
        "actualizadoEn": "2025-01-05T10:00:00Z"
      },
      {
        "id": 6,
        "silaboUnidadId": 2,
        "semana": 6,
        "contenidosConceptuales": "Estructuras switch-case",
        "contenidosProcedimentales": "Menús de opciones",
        "actividadesAprendizaje": "Proyecto de menú",
        "horasLectivasTeoria": 2,
        "horasLectivasPractica": 2,
        "horasNoLectivasTeoria": 1,
        "horasNoLectivasPractica": 1,
        "creadoEn": "2025-01-05T10:00:00Z",
        "actualizadoEn": "2025-01-05T10:00:00Z"
      }
    ]
  }
}
```

---

### 4. PUT /api/syllabus/{id}/unidades/{unidadId}

Actualizar una unidad y sus semanas

**Nota:** Al actualizar, todas las semanas existentes se eliminan y se crean las nuevas que envíes. Esto garantiza que la información esté sincronizada.

**Request:**

```http
PUT /api/syllabus/123/unidades/2
Content-Type: application/json

{
  "titulo": "Estructuras de Control Avanzadas",
  "capacidadesText": "Dominar estructuras de control avanzadas",
  "semanas": [
    {
      "semana": 5,
      "contenidosConceptuales": "Estructuras condicionales avanzadas",
      "contenidosProcedimentales": "Ejercicios complejos con if-else",
      "actividadesAprendizaje": "Casos de estudio",
      "horasLectivasTeoria": 3,
      "horasLectivasPractica": 3,
      "horasNoLectivasTeoria": 2,
      "horasNoLectivasPractica": 2
    },
    {
      "semana": 6,
      "contenidosConceptuales": "Bucles while y do-while",
      "contenidosProcedimentales": "Implementación de iteraciones",
      "actividadesAprendizaje": "Ejercicios con bucles",
      "horasLectivasTeoria": 2,
      "horasLectivasPractica": 2,
      "horasNoLectivasTeoria": 1,
      "horasNoLectivasPractica": 1
    },
    {
      "semana": 7,
      "contenidosConceptuales": "Bucles for",
      "contenidosProcedimentales": "Recorrido de arreglos",
      "actividadesAprendizaje": "Proyecto con for",
      "horasLectivasTeoria": 2,
      "horasLectivasPractica": 2,
      "horasNoLectivasTeoria": 1,
      "horasNoLectivasPractica": 1
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Unidad actualizada correctamente",
  "data": {
    "id": 2,
    "silaboId": 123,
    "numero": 2,
    "titulo": "Estructuras de Control Avanzadas",
    "capacidadesText": "Dominar estructuras de control avanzadas",
    "semanaInicio": 5,
    "semanaFin": 8,
    "actualizadoEn": "2025-01-10T15:30:00Z",
    "semanas": [
      {
        "id": 10,
        "silaboUnidadId": 2,
        "semana": 5,
        "contenidosConceptuales": "Estructuras condicionales avanzadas",
        "contenidosProcedimentales": "Ejercicios complejos con if-else",
        "actividadesAprendizaje": "Casos de estudio",
        "horasLectivasTeoria": 3,
        "horasLectivasPractica": 3,
        "horasNoLectivasTeoria": 2,
        "horasNoLectivasPractica": 2
      },
      {
        "id": 11,
        "silaboUnidadId": 2,
        "semana": 6,
        "contenidosConceptuales": "Bucles while y do-while",
        "contenidosProcedimentales": "Implementación de iteraciones",
        "actividadesAprendizaje": "Ejercicios con bucles",
        "horasLectivasTeoria": 2,
        "horasLectivasPractica": 2,
        "horasNoLectivasTeoria": 1,
        "horasNoLectivasPractica": 1
      },
      {
        "id": 12,
        "silaboUnidadId": 2,
        "semana": 7,
        "contenidosConceptuales": "Bucles for",
        "contenidosProcedimentales": "Recorrido de arreglos",
        "actividadesAprendizaje": "Proyecto con for",
        "horasLectivasTeoria": 2,
        "horasLectivasPractica": 2,
        "horasNoLectivasTeoria": 1,
        "horasNoLectivasPractica": 1
      }
    ]
  }
}
```

---

### 5. DELETE /api/syllabus/{id}/unidades/{unidadId}

Eliminar una unidad (también elimina todas sus semanas por CASCADE)

**Request:**

```http
DELETE /api/syllabus/123/unidades/2
```

**Response:**

```json
{
  "success": true,
  "message": "Unidad eliminada correctamente",
  "data": null
}
```

---

## Validaciones

### Validación de Semana

- El campo `semana` debe estar entre 1 y 16
- No puede haber semanas duplicadas para la misma unidad (constraint único en BD)

### Campos Opcionales en Semana

Todos estos campos son opcionales o tienen valores por defecto:

- `contenidosConceptuales`: texto opcional
- `contenidosProcedimentales`: texto opcional
- `actividadesAprendizaje`: texto opcional
- `horasLectivasTeoria`: número, default 0
- `horasLectivasPractica`: número, default 0
- `horasNoLectivasTeoria`: número, default 0
- `horasNoLectivasPractica`: número, default 0

### Campos Requeridos

En la creación de unidad:

- `numero`: número entero positivo
- `titulo`: texto no vacío

En la creación de semana:

- `semana`: número entre 1 y 16

---

## Ejemplo de Frontend (React/TypeScript)

```typescript
import { useState, useEffect } from 'react';

interface UnidadSemana {
  id?: number;
  semana: number;
  contenidosConceptuales?: string;
  contenidosProcedimentales?: string;
  actividadesAprendizaje?: string;
  horasLectivasTeoria?: number;
  horasLectivasPractica?: number;
  horasNoLectivasTeoria?: number;
  horasNoLectivasPractica?: number;
}

interface Unidad {
  id?: number;
  numero: number;
  titulo: string;
  capacidadesText?: string;
  semanaInicio?: number;
  semanaFin?: number;
  semanas?: UnidadSemana[];
}

// Obtener todas las unidades
const fetchUnidades = async (silaboId: number): Promise<Unidad[]> => {
  const response = await fetch(`/api/syllabus/${silaboId}/unidades`);
  const result = await response.json();
  return result.data;
};

// Obtener una unidad específica
const fetchUnidad = async (silaboId: number, unidadId: number): Promise<Unidad> => {
  const response = await fetch(`/api/syllabus/${silaboId}/unidades/${unidadId}`);
  const result = await response.json();
  return result.data;
};

// Crear nueva unidad
const createUnidad = async (silaboId: number, unidad: Unidad): Promise<Unidad> => {
  const response = await fetch(`/api/syllabus/${silaboId}/unidades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(unidad),
  });
  const result = await response.json();
  return result.data;
};

// Actualizar unidad
const updateUnidad = async (
  silaboId: number,
  unidadId: number,
  unidad: Partial<Unidad>
): Promise<Unidad> => {
  const response = await fetch(`/api/syllabus/${silaboId}/unidades/${unidadId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(unidad),
  });
  const result = await response.json();
  return result.data;
};

// Eliminar unidad
const deleteUnidad = async (silaboId: number, unidadId: number): Promise<void> => {
  await fetch(`/api/syllabus/${silaboId}/unidades/${unidadId}`, {
    method: 'DELETE',
  });
};

// Componente de ejemplo
function UnidadesManager({ silaboId }: { silaboId: number }) {
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnidades();
  }, [silaboId]);

  const loadUnidades = async () => {
    setLoading(true);
    try {
      const data = await fetchUnidades(silaboId);
      setUnidades(data);
    } catch (error) {
      console.error('Error al cargar unidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUnidad = async () => {
    const nuevaUnidad: Unidad = {
      numero: unidades.length + 1,
      titulo: "Nueva Unidad",
      capacidadesText: "Capacidades de la unidad",
      semanas: [
        {
          semana: 1,
          contenidosConceptuales: "Contenidos conceptuales semana 1",
          horasLectivasTeoria: 2,
          horasLectivasPractica: 2,
        },
      ],
    };

    try {
      const created = await createUnidad(silaboId, nuevaUnidad);
      setUnidades([...unidades, created]);
    } catch (error) {
      console.error('Error al crear unidad:', error);
    }
  };

  const handleUpdateUnidad = async (unidadId: number) => {
    try {
      const updated = await updateUnidad(silaboId, unidadId, {
        titulo: "Título Actualizado",
        semanas: [
          {
            semana: 1,
            contenidosConceptuales: "Contenidos actualizados",
          },
        ],
      });
      setUnidades(unidades.map(u => u.id === unidadId ? updated : u));
    } catch (error) {
      console.error('Error al actualizar unidad:', error);
    }
  };

  const handleDeleteUnidad = async (unidadId: number) => {
    try {
      await deleteUnidad(silaboId, unidadId);
      setUnidades(unidades.filter(u => u.id !== unidadId));
    } catch (error) {
      console.error('Error al eliminar unidad:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Unidades del Sílabo</h2>
      <button onClick={handleCreateUnidad}>Crear Nueva Unidad</button>

      {unidades.map(unidad => (
        <div key={unidad.id}>
          <h3>Unidad {unidad.numero}: {unidad.titulo}</h3>
          <p>Semanas: {unidad.semanaInicio} - {unidad.semanaFin}</p>

          <h4>Detalle por Semana:</h4>
          {unidad.semanas?.map(semana => (
            <div key={semana.id}>
              <strong>Semana {semana.semana}</strong>
              <p>{semana.contenidosConceptuales}</p>
              <p>Horas: T={semana.horasLectivasTeoria} P={semana.horasLectivasPractica}</p>
            </div>
          ))}

          <button onClick={() => handleUpdateUnidad(unidad.id!)}>Editar</button>
          <button onClick={() => handleDeleteUnidad(unidad.id!)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
```

---

## Consideraciones Importantes

1. **Constraint Único**: No puedes tener dos registros con la misma `silaboUnidadId` y `semana`. La base de datos retornará un error si intentas crear semanas duplicadas.

2. **Cascade Delete**: Al eliminar una unidad, todas sus semanas se eliminan automáticamente gracias al `ON DELETE CASCADE` en la foreign key.

3. **Actualización de Semanas**: El método PUT elimina todas las semanas existentes y crea las nuevas. Si necesitas actualizar solo algunas semanas sin tocar las demás, necesitarías endpoints específicos para CRUD de semanas individuales.

4. **Validación de Semanas**: El rango de semanas está validado en la base de datos (1-16). Intentar crear una semana fuera de este rango resultará en un error.

5. **Valores por Defecto**: Los campos de horas tienen valor por defecto 0, por lo que puedes omitirlos en el request si no tienes el dato.
