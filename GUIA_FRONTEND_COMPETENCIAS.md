# 📘 Guía Frontend - Endpoints de Competencias, Componentes y Actitudes

## 🎯 Resumen de Endpoints Disponibles

### **Competencias del Curso** (`silabo_competencia_curso`)

- ✅ `GET /api/syllabus/{syllabusId}/competencies` - Listar
- ✅ `POST /api/syllabus/{syllabusId}/competencies` - Crear nuevos
- ✅ `PUT /api/syllabus/{syllabusId}/competencies` - **Actualizar/Sincronizar (RECOMENDADO)**
- ✅ `DELETE /api/syllabus/{syllabusId}/competencies/{id}` - Eliminar uno

### **Componentes/Capacidades** (`silabo_competencia_componente`)

- ✅ `GET /api/syllabus/{syllabusId}/components` - Listar (con clasificación automática)
- ✅ `POST /api/syllabus/{syllabusId}/components` - Crear nuevos
- ✅ `PUT /api/syllabus/{syllabusId}/components` - **Actualizar/Sincronizar (RECOMENDADO)**
- ✅ `DELETE /api/syllabus/{syllabusId}/components/{id}` - Eliminar uno

### **Actitudes** (`silabo_competencia_componente` con grupo='ACT')

- ✅ `GET /api/syllabus/{syllabusId}/attitudes` - Listar
- ✅ `POST /api/syllabus/{syllabusId}/attitudes` - Crear nuevos
- ✅ `PUT /api/syllabus/{syllabusId}/attitudes` - **Actualizar/Sincronizar (RECOMENDADO)**
- ✅ `DELETE /api/syllabus/{syllabusId}/attitudes/{id}` - Eliminar uno

---

## 🚀 Estrategia Recomendada: Usar PUT para Todo

### ✅ **Ventajas del Endpoint PUT:**

1. **Un solo request** en lugar de múltiples POST/DELETE
2. **Sincronización automática**: crea, actualiza y elimina en una sola operación
3. **Más eficiente** para el frontend
4. **Menos errores** de sincronización

### 📋 **Cómo Funciona el PUT:**

```typescript
PUT / api / syllabus / { syllabusId } / competencies;
Body: {
  items: [
    { id: 1, text: "Competencia actualizada", code: "C001", order: 1 }, // ✅ Se ACTUALIZA (tiene id)
    { text: "Nueva competencia", code: "C002", order: 2 }, // ✅ Se CREA (no tiene id)
    { id: 3, text: "Otra competencia", code: "C003", order: 3 }, // ✅ Se ACTUALIZA (tiene id)
    // ❌ El item con id=2 que estaba en la BD pero NO está aquí: se ELIMINA automáticamente
  ];
}
```

**Respuesta:**

```json
{
  "ok": true,
  "created": 1,
  "updated": 2,
  "deleted": 1,
  "message": "✅ Sincronizado: 1 creados, 2 actualizados, 1 eliminados"
}
```

---

## 💻 Ejemplos de Código Frontend

### **Ejemplo 1: Cargar Competencias (GET)**

```typescript
// React/Vue/Angular
async function loadCompetencies(syllabusId: number) {
  const response = await fetch(`/api/syllabus/${syllabusId}/competencies`);
  const data = await response.json();

  // data.items = [
  //   { id: 1, silaboId: 123, text: "...", code: "C001", order: 1 },
  //   { id: 2, silaboId: 123, text: "...", code: "C002", order: 2 }
  // ]

  return data.items;
}
```

---

### **Ejemplo 2: Guardar Cambios con PUT (RECOMENDADO)**

```typescript
// Estado del formulario en el frontend
const [competencies, setCompetencies] = useState([
  { id: 1, text: "Competencia 1", code: "C001", order: 1 },
  { id: 2, text: "Competencia 2", code: "C002", order: 2 },
  { text: "Nueva competencia", code: "C003", order: 3 }, // Sin id = nuevo
]);

// Función para guardar
async function saveCompetencies(syllabusId: number) {
  const response = await fetch(`/api/syllabus/${syllabusId}/competencies`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: competencies }),
  });

  const result = await response.json();
  console.log(result.message); // "✅ Sincronizado: 1 creados, 2 actualizados, 0 eliminados"

  // Recargar datos actualizados
  const updated = await loadCompetencies(syllabusId);
  setCompetencies(updated);
}
```

---

### **Ejemplo 3: Agregar Nueva Competencia**

```typescript
function addNewCompetency() {
  setCompetencies([
    ...competencies,
    {
      text: "",
      code: "",
      order: competencies.length + 1,
      // ⚠️ NO incluir 'id' para items nuevos
    },
  ]);
}
```

---

### **Ejemplo 4: Eliminar Competencia**

```typescript
function removeCompetency(index: number) {
  const newCompetencies = competencies.filter((_, i) => i !== index);
  setCompetencies(newCompetencies);
  // Al hacer PUT, el item eliminado del array se borrará de la BD automáticamente
}
```

---

### **Ejemplo 5: Actualizar Texto de Competencia**

```typescript
function updateCompetencyText(index: number, newText: string) {
  const updated = [...competencies];
  updated[index].text = newText;
  setCompetencies(updated);
  // El id se mantiene, así que al hacer PUT se actualizará en la BD
}
```

---

## 🎨 Ejemplo Completo: Componente React

```typescript
import { useState, useEffect } from 'react';

interface Competency {
  id?: number;
  text: string;
  code: string | null;
  order: number | null;
}

function CompetenciesEditor({ syllabusId }: { syllabusId: number }) {
  const [items, setItems] = useState<Competency[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, [syllabusId]);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/syllabus/${syllabusId}/competencies`);
      const data = await res.json();
      setItems(data.items);
    } catch (error) {
      console.error('Error loading competencies:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveChanges() {
    setLoading(true);
    try {
      const res = await fetch(`/api/syllabus/${syllabusId}/competencies`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      const result = await res.json();
      alert(result.message);
      await loadData(); // Recargar para obtener IDs de items nuevos
    } catch (error) {
      console.error('Error saving competencies:', error);
      alert('Error al guardar');
    } finally {
      setLoading(false);
    }
  }

  function addItem() {
    setItems([...items, { text: '', code: '', order: items.length + 1 }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof Competency, value: any) {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  }

  return (
    <div>
      <h2>Competencias del Curso</h2>

      {items.map((item, index) => (
        <div key={item.id || `new-${index}`} style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Código"
            value={item.code || ''}
            onChange={(e) => updateItem(index, 'code', e.target.value)}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={item.text}
            onChange={(e) => updateItem(index, 'text', e.target.value)}
          />
          <button onClick={() => removeItem(index)}>🗑️</button>
        </div>
      ))}

      <button onClick={addItem}>➕ Agregar Competencia</button>
      <button onClick={saveChanges} disabled={loading}>
        {loading ? '⏳ Guardando...' : '💾 Guardar Cambios'}
      </button>
    </div>
  );
}
```

---

## 📊 Endpoint Especial: GET Components (con clasificación)

El endpoint de componentes retorna datos clasificados automáticamente:

```typescript
GET /api/syllabus/123/components

// Respuesta:
{
  "success": true,
  "message": "Componentes y contenidos actitudinales obtenidos correctamente",
  "data": {
    "items": [...],           // Todos los items
    "competencias": [...],    // Solo items con código tipo "a.1", "b.2", etc.
    "actitudinales": [...]    // Solo items con código de 1 letra: "a", "b", etc.
  },
  "total": 10,
  "totalCompetencias": 7,
  "totalActitudinales": 3
}
```

**Uso en el frontend:**

```typescript
async function loadComponents(syllabusId: number) {
  const res = await fetch(`/api/syllabus/${syllabusId}/components`);
  const data = await res.json();

  // Usar solo competencias
  setCompetencias(data.data.competencias);

  // Usar solo actitudinales
  setActitudinales(data.data.actitudinales);

  // O usar todos juntos
  setAllItems(data.data.items);
}
```

---

## ⚠️ Importante: Cuándo Usar POST vs PUT

### **Usar POST cuando:**

- ✅ Solo quieres **agregar** nuevos items sin tocar los existentes
- ✅ Estás creando items por primera vez

### **Usar PUT cuando:**

- ✅ Tienes un formulario con **todos** los items (existentes + nuevos)
- ✅ Quieres **sincronizar** el estado del frontend con la BD
- ✅ Necesitas **actualizar** items existentes
- ✅ Quieres **eliminar** items que el usuario quitó del formulario

### **Usar DELETE cuando:**

- ✅ Solo quieres eliminar **un item específico** sin afectar los demás

---

## 🎯 Recomendación Final

**Para la mayoría de casos, usa PUT:**

```typescript
// ✅ RECOMENDADO: Un solo request para todo
await fetch(`/api/syllabus/${id}/competencies`, {
  method: "PUT",
  body: JSON.stringify({ items: allItems }),
});

// ❌ NO RECOMENDADO: Múltiples requests
for (const item of newItems) {
  await fetch(`/api/syllabus/${id}/competencies`, {
    method: "POST",
    body: JSON.stringify({ items: [item] }),
  });
}
```

---

## 📝 Validación de Datos

Todos los endpoints validan con Zod. Estructura esperada:

```typescript
{
  items: [
    {
      id?: number,           // Opcional (solo para actualizar)
      text: string,          // Requerido
      code?: string | null,  // Opcional
      order?: number | null, // Opcional
      grupo?: string         // Solo para components (opcional)
    }
  ]
}
```

**Errores comunes:**

- ❌ `text` vacío o no es string
- ❌ `order` no es número
- ❌ `items` no es array
