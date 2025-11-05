# API Endpoint: GET /api/syllabus/{id}/complete

## Descripción

Obtiene el sílabo completo con TODAS las secciones y relaciones actualizadas, incluyendo:

- Datos Generales
- Sumilla
- Competencias del Curso
- Componentes (Conceptuales, Procedimentales, Actitudinales)
- Resultados de Aprendizaje
- **Unidades Didácticas con sus Semanas (ACTUALIZADO)**
- Estrategias Metodológicas
- Recursos Didácticos (con notas y recursos)
- **Evaluación del Aprendizaje con Fórmula Completa (ACTUALIZADO)**
- Fuentes de Consulta
- Aportes a Resultados del Programa

---

## Request

```http
GET /api/syllabus/123/complete
```

---

## Response Completa

```json
{
  "success": true,
  "message": "Sílabo completo obtenido correctamente",
  "data": {
    "datosGenerales": {
      "id": 123,
      "departamentoAcademico": "Departamento de Ingeniería de Sistemas",
      "escuelaProfesional": "Ingeniería de Sistemas",
      "programaAcademico": "Ingeniería de Sistemas",
      "areaCurricular": "Formación Profesional",
      "cursoCodigo": "IS301",
      "cursoNombre": "Programación Orientada a Objetos",
      "semestreAcademico": "2025-1",
      "tipoAsignatura": "Obligatoria",
      "tipoDeEstudios": "Pregrado",
      "modalidadDeAsignatura": "Presencial",
      "formatoDeCurso": "Teórico-Práctico",
      "ciclo": "3",
      "requisitos": "IS201 - Algoritmos y Estructuras de Datos",
      "horasTeoria": 2,
      "horasPractica": 4,
      "horasLaboratorio": 0,
      "horasTotales": 6,
      "creditosTotales": 4,
      "horasTeoriaLectivaPresencial": 2,
      "horasTeoriaNoLectivaPresencial": 2,
      "horasPracticaLectivaPresencial": 4,
      "horasPracticaNoLectivaPresencial": 4,
      "estadoRevision": "ANALIZANDO",
      "asignadoADocenteId": 10,
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-02-01T15:30:00Z"
    },

    "sumilla": "El curso de Programación Orientada a Objetos es de naturaleza teórico-práctica y tiene como propósito desarrollar en los estudiantes las competencias necesarias para diseñar e implementar soluciones de software utilizando el paradigma orientado a objetos. Se abordan conceptos fundamentales como clases, objetos, herencia, polimorfismo, encapsulamiento y abstracción. Los estudiantes aprenderán a aplicar patrones de diseño y buenas prácticas de programación para crear aplicaciones robustas, mantenibles y escalables.",

    "competenciasCurso": [
      {
        "id": 1,
        "codigo": "COMP-1",
        "descripcion": "Diseña e implementa soluciones de software aplicando los principios de la programación orientada a objetos",
        "orden": 1
      },
      {
        "id": 2,
        "codigo": "COMP-2",
        "descripcion": "Aplica patrones de diseño para resolver problemas complejos de desarrollo de software",
        "orden": 2
      }
    ],

    "componentesConceptuales": [
      {
        "id": 1,
        "silaboId": 123,
        "codigo": "A",
        "descripcion": "Comprende los principios fundamentales de la POO",
        "grupo": "COMP",
        "orden": 1
      },
      {
        "id": 2,
        "silaboId": 123,
        "codigo": "B",
        "descripcion": "Conoce los patrones de diseño más utilizados",
        "grupo": "COMP",
        "orden": 2
      }
    ],

    "componentesProcedimentales": [
      {
        "id": 3,
        "silaboId": 123,
        "codigo": "C",
        "descripcion": "Implementa clases y objetos en un lenguaje de programación",
        "grupo": "PROC",
        "orden": 1
      },
      {
        "id": 4,
        "silaboId": 123,
        "codigo": "D",
        "descripcion": "Aplica herencia y polimorfismo en soluciones prácticas",
        "grupo": "PROC",
        "orden": 2
      }
    ],

    "componentesActitudinales": [
      {
        "id": 5,
        "silaboId": 123,
        "codigo": "E",
        "descripcion": "Trabaja en equipo respetando las ideas de sus compañeros",
        "grupo": "ACT",
        "orden": 1
      },
      {
        "id": 6,
        "silaboId": 123,
        "codigo": "F",
        "descripcion": "Demuestra ética profesional en el desarrollo de software",
        "grupo": "ACT",
        "orden": 2
      }
    ],

    "resultadosAprendizaje": [
      {
        "id": 1,
        "silaboId": 123,
        "codigo": "RA1",
        "descripcion": "Diseña diagramas de clases aplicando los principios SOLID",
        "orden": 1
      },
      {
        "id": 2,
        "silaboId": 123,
        "codigo": "RA2",
        "descripcion": "Implementa aplicaciones completas utilizando POO",
        "orden": 2
      }
    ],

    "unidadesDidacticas": [
      {
        "id": 1,
        "silaboId": 123,
        "numero": 1,
        "titulo": "Introducción a la Programación Orientada a Objetos",
        "capacidadesText": "Comprende los conceptos fundamentales de POO",
        "semanaInicio": 1,
        "semanaFin": 4,
        "contenidosConceptuales": "Paradigmas de programación, clases, objetos",
        "contenidosProcedimentales": "Creación de clases básicas",
        "actividadesAprendizaje": "Ejercicios prácticos de modelado",
        "horasLectivasTeoria": 8,
        "horasLectivasPractica": 16,
        "horasNoLectivasTeoria": 8,
        "horasNoLectivasPractica": 16,
        "creadoEn": "2025-01-15T10:00:00Z",
        "actualizadoEn": "2025-01-15T10:00:00Z",
        "semanas": [
          {
            "id": 1,
            "silaboUnidadId": 1,
            "semana": 1,
            "contenidosConceptuales": "Introducción a POO, paradigmas de programación",
            "contenidosProcedimentales": "Instalación de herramientas de desarrollo",
            "actividadesAprendizaje": "Configuración del entorno de desarrollo",
            "horasLectivasTeoria": 2,
            "horasLectivasPractica": 4,
            "horasNoLectivasTeoria": 2,
            "horasNoLectivasPractica": 4,
            "creadoEn": "2025-01-15T10:00:00Z",
            "actualizadoEn": "2025-01-15T10:00:00Z"
          },
          {
            "id": 2,
            "silaboUnidadId": 1,
            "semana": 2,
            "contenidosConceptuales": "Clases y objetos - Definición y características",
            "contenidosProcedimentales": "Creación de clases básicas con atributos",
            "actividadesAprendizaje": "Ejercicios de creación de clases simples",
            "horasLectivasTeoria": 2,
            "horasLectivasPractica": 4,
            "horasNoLectivasTeoria": 2,
            "horasNoLectivasPractica": 4,
            "creadoEn": "2025-01-16T10:00:00Z",
            "actualizadoEn": "2025-01-16T10:00:00Z"
          },
          {
            "id": 3,
            "silaboUnidadId": 1,
            "semana": 3,
            "contenidosConceptuales": "Métodos y constructores",
            "contenidosProcedimentales": "Implementación de métodos y constructores",
            "actividadesAprendizaje": "Proyecto: Sistema de registro de estudiantes",
            "horasLectivasTeoria": 2,
            "horasLectivasPractica": 4,
            "horasNoLectivasTeoria": 2,
            "horasNoLectivasPractica": 4,
            "creadoEn": "2025-01-17T10:00:00Z",
            "actualizadoEn": "2025-01-17T10:00:00Z"
          },
          {
            "id": 4,
            "silaboUnidadId": 1,
            "semana": 4,
            "contenidosConceptuales": "Encapsulamiento y modificadores de acceso",
            "contenidosProcedimentales": "Aplicación de getters y setters",
            "actividadesAprendizaje": "Evaluación práctica - Unidad 1",
            "horasLectivasTeoria": 2,
            "horasLectivasPractica": 4,
            "horasNoLectivasTeoria": 2,
            "horasNoLectivasPractica": 4,
            "creadoEn": "2025-01-18T10:00:00Z",
            "actualizadoEn": "2025-01-18T10:00:00Z"
          }
        ]
      },
      {
        "id": 2,
        "silaboId": 123,
        "numero": 2,
        "titulo": "Herencia y Polimorfismo",
        "capacidadesText": "Aplica herencia y polimorfismo en diseños de software",
        "semanaInicio": 5,
        "semanaFin": 8,
        "contenidosConceptuales": "Herencia, clases abstractas, interfaces",
        "contenidosProcedimentales": "Implementación de jerarquías de clases",
        "actividadesAprendizaje": "Diseño de sistemas con herencia múltiple",
        "horasLectivasTeoria": 8,
        "horasLectivasPractica": 16,
        "horasNoLectivasTeoria": 8,
        "horasNoLectivasPractica": 16,
        "creadoEn": "2025-01-19T10:00:00Z",
        "actualizadoEn": "2025-01-19T10:00:00Z",
        "semanas": [
          {
            "id": 5,
            "silaboUnidadId": 2,
            "semana": 5,
            "contenidosConceptuales": "Introducción a la herencia",
            "contenidosProcedimentales": "Creación de clases hijas",
            "actividadesAprendizaje": "Ejercicios de herencia simple",
            "horasLectivasTeoria": 2,
            "horasLectivasPractica": 4,
            "horasNoLectivasTeoria": 2,
            "horasNoLectivasPractica": 4,
            "creadoEn": "2025-01-20T10:00:00Z",
            "actualizadoEn": "2025-01-20T10:00:00Z"
          },
          {
            "id": 6,
            "silaboUnidadId": 2,
            "semana": 6,
            "contenidosConceptuales": "Polimorfismo y sobrescritura de métodos",
            "contenidosProcedimentales": "Implementación de polimorfismo",
            "actividadesAprendizaje": "Casos prácticos de polimorfismo",
            "horasLectivasTeoria": 2,
            "horasLectivasPractica": 4,
            "horasNoLectivasTeoria": 2,
            "horasNoLectivasPractica": 4,
            "creadoEn": "2025-01-21T10:00:00Z",
            "actualizadoEn": "2025-01-21T10:00:00Z"
          }
        ]
      }
    ],

    "estrategiasMetodologicas": [
      {
        "nombre": "Método del pensamiento de diseño",
        "descripcion": "Los estudiantes identifican el problema con mayor exactitud, son incluidos en un proceso de creación, innovación y colaboración constante, desarrolla habilidades de empatía y emprendimiento."
      },
      {
        "nombre": "Método basado en proyectos",
        "descripcion": "Los estudiantes son enfrentados a una situación problemática real, promueve y fomenta el trabajo en equipo, la autocapacitación y la autogestión para el desarrollo de un producto final."
      },
      {
        "nombre": "Aprendizaje basado en problemas (ABP)",
        "descripcion": "Metodología activa donde los estudiantes resuelven problemas complejos aplicando los conocimientos adquiridos."
      }
    ],

    "recursosDidacticos": {
      "notas": [
        {
          "nombre": "Computadora, cámara web y conexión a internet",
          "descripcion": "Todo el contenido necesario para la clase virtual"
        },
        {
          "nombre": "Plataforma en nube",
          "descripcion": "para gestión de contenido, gestión de proyecto e implementación"
        },
        {
          "nombre": "Materiales",
          "descripcion": "Material docente, textos bases (ver fuentes de consultas)."
        },
        {
          "nombre": "Plataforma de soporte al aprendizaje remoto",
          "descripcion": "Foros, chats, videos explicativos."
        }
      ],
      "recursos": [
        {
          "id": 1,
          "recursoId": 5,
          "recursoNombre": "Proyector Multimedia",
          "destino": "Aula",
          "observaciones": "Para presentaciones teóricas"
        },
        {
          "id": 2,
          "recursoId": 12,
          "recursoNombre": "Laboratorio de Cómputo",
          "destino": "Laboratorio",
          "observaciones": "Equipos con Java/Python instalado"
        },
        {
          "id": 3,
          "recursoId": 18,
          "recursoNombre": "Plataforma Moodle",
          "destino": "Virtual",
          "observaciones": "Entrega de tareas y evaluaciones"
        }
      ]
    },

    "evaluacionAprendizaje": {
      "planEvaluacion": [
        {
          "id": 1,
          "silaboId": 123,
          "componenteNombre": "Examen Parcial 1",
          "instrumentoNombre": "Evaluación Escrita",
          "semana": 4,
          "fecha": "2025-02-15",
          "peso": 0.15
        },
        {
          "id": 2,
          "silaboId": 123,
          "componenteNombre": "Práctica Calificada 1",
          "instrumentoNombre": "Ejercicio de Laboratorio",
          "semana": 3,
          "fecha": "2025-02-08",
          "peso": 0.1
        },
        {
          "id": 3,
          "silaboId": 123,
          "componenteNombre": "Proyecto Final",
          "instrumentoNombre": "Presentación y Código",
          "semana": 16,
          "fecha": "2025-05-20",
          "peso": 0.3
        }
      ],
      "formulaEvaluacion": {
        "id": 1,
        "silaboId": 123,
        "nombreRegla": "Fórmula de Evaluación POO 2025-1",
        "variableFinalCodigo": "NF",
        "expresionFinal": "(EP1*0.15 + EP2*0.15 + PC1*0.10 + PC2*0.10 + PF*0.30 + TA*0.20)",
        "activo": true,
        "creadoEn": "2025-01-15T10:00:00Z",
        "actualizadoEn": "2025-01-20T15:00:00Z",
        "variables": [
          {
            "codigo": "EP1",
            "nombre": "Examen Parcial 1",
            "tipo": "simple",
            "descripcion": "Primera evaluación teórico-práctica",
            "orden": 1
          },
          {
            "codigo": "EP2",
            "nombre": "Examen Parcial 2",
            "tipo": "simple",
            "descripcion": "Segunda evaluación teórico-práctica",
            "orden": 2
          },
          {
            "codigo": "PC1",
            "nombre": "Práctica Calificada 1",
            "tipo": "simple",
            "descripcion": "Primera práctica de laboratorio",
            "orden": 3
          },
          {
            "codigo": "PC2",
            "nombre": "Práctica Calificada 2",
            "tipo": "compuesta",
            "descripcion": "Segunda práctica de laboratorio",
            "orden": 4
          },
          {
            "codigo": "PF",
            "nombre": "Proyecto Final",
            "tipo": "compuesta",
            "descripcion": "Proyecto integrador del curso",
            "orden": 5
          },
          {
            "codigo": "TA",
            "nombre": "Tareas Académicas",
            "tipo": "compuesta",
            "descripcion": "Promedio de tareas semanales",
            "orden": 6
          }
        ],
        "subformulas": [
          {
            "variableCodigo": "PC2",
            "expresion": "(LAB1 + LAB2) / 2",
            "orden": 1
          },
          {
            "variableCodigo": "PF",
            "expresion": "(COD*0.60 + DOC*0.20 + PRES*0.20)",
            "orden": 2
          },
          {
            "variableCodigo": "TA",
            "expresion": "PROMEDIO(T1, T2, T3, T4, T5)",
            "orden": 3
          }
        ],
        "variablesPlan": [
          {
            "variableCodigo": "EP1",
            "planEvaluacionOfertaId": 1
          },
          {
            "variableCodigo": "PC1",
            "planEvaluacionOfertaId": 2
          },
          {
            "variableCodigo": "PF",
            "planEvaluacionOfertaId": 3
          }
        ],
        "planesEvaluacion": [
          {
            "id": 1,
            "componenteNombre": "Examen Parcial 1",
            "instrumentoNombre": "Evaluación Escrita",
            "semana": 4,
            "fecha": "2025-02-15"
          },
          {
            "id": 2,
            "componenteNombre": "Práctica Calificada 1",
            "instrumentoNombre": "Ejercicio de Laboratorio",
            "semana": 3,
            "fecha": "2025-02-08"
          },
          {
            "id": 3,
            "componenteNombre": "Proyecto Final",
            "instrumentoNombre": "Presentación y Código",
            "semana": 16,
            "fecha": "2025-05-20"
          }
        ]
      }
    },

    "fuentes": [
      {
        "id": 1,
        "tipo": "Libro",
        "autores": "Deitel, P. & Deitel, H.",
        "anio": "2020",
        "titulo": "Java How to Program, Early Objects",
        "editorial": "Pearson",
        "ciudad": "Boston",
        "isbn": "978-0134743356",
        "url": null,
        "notas": "Texto principal del curso"
      },
      {
        "id": 2,
        "tipo": "Libro",
        "autores": "Gamma, E., Helm, R., Johnson, R., & Vlissides, J.",
        "anio": "1994",
        "titulo": "Design Patterns: Elements of Reusable Object-Oriented Software",
        "editorial": "Addison-Wesley",
        "ciudad": "Boston",
        "isbn": "978-0201633610",
        "url": null,
        "notas": "Patrones de diseño clásicos"
      },
      {
        "id": 3,
        "tipo": "Artículo",
        "autores": "Martin, R. C.",
        "anio": "2000",
        "titulo": "Design Principles and Design Patterns",
        "editorial": "Object Mentor",
        "ciudad": null,
        "isbn": null,
        "url": "https://fi.ort.edu.uy/innovaportal/file/2032/1/design_principles.pdf",
        "notas": "Principios SOLID"
      },
      {
        "id": 4,
        "tipo": "Web",
        "autores": "Oracle",
        "anio": "2024",
        "titulo": "The Java Tutorials",
        "editorial": null,
        "ciudad": null,
        "isbn": null,
        "url": "https://docs.oracle.com/javase/tutorial/",
        "notas": "Documentación oficial de Java"
      }
    ],

    "aportesResultadosPrograma": [
      {
        "silaboId": 123,
        "resultadoCodigo": "RP1",
        "resultadoDescripcion": "Aplica conocimientos de matemática, ciencias e ingeniería",
        "aporteValor": "Alto"
      },
      {
        "silaboId": 123,
        "resultadoCodigo": "RP2",
        "resultadoDescripcion": "Diseña y conduce experimentos, analiza e interpreta datos",
        "aporteValor": "Medio"
      },
      {
        "silaboId": 123,
        "resultadoCodigo": "RP3",
        "resultadoDescripcion": "Diseña sistemas, componentes o procesos para satisfacer necesidades",
        "aporteValor": "Alto"
      },
      {
        "silaboId": 123,
        "resultadoCodigo": "RP5",
        "resultadoDescripcion": "Identifica, formula y resuelve problemas de ingeniería",
        "aporteValor": "Alto"
      }
    ]
  }
}
```

---

## Cambios Principales (ACTUALIZADO)

### 1. ✅ Unidades con Semanas Completas

Ahora cada unidad incluye un array `semanas` con el detalle semana por semana:

```json
{
  "id": 1,
  "titulo": "Introducción a POO",
  "semanas": [
    {
      "id": 1,
      "semana": 1,
      "contenidosConceptuales": "...",
      "contenidosProcedimentales": "...",
      "actividadesAprendizaje": "...",
      "horasLectivasTeoria": 2,
      "horasLectivasPractica": 4
    }
  ]
}
```

### 2. ✅ Estrategias Metodológicas Parseadas

El texto plano se convierte automáticamente en un array estructurado:

**Entrada (BD):**

```
Método del pensamiento de diseño|Los estudiantes identifican el problema...
Método basado en proyectos|Los estudiantes son enfrentados a una situación...
```

**Salida (API):**

```json
[
  {
    "nombre": "Método del pensamiento de diseño",
    "descripcion": "Los estudiantes identifican el problema con mayor exactitud..."
  },
  {
    "nombre": "Método basado en proyectos",
    "descripcion": "Los estudiantes son enfrentados a una situación problemática real..."
  }
]
```

### 3. ✅ Recursos Didácticos Parseados y Completo

Las notas se parsean en array estructurado y se incluyen los recursos específicos:

**Entrada (BD):**

```
Computadora, cámara web y conexión a internet.|Todo el contenido necesario...
Plataforma en nube|para gestión de contenido...
```

**Salida (API):**

```json
{
  "recursosDidacticos": {
    "notas": [
      {
        "nombre": "Computadora, cámara web y conexión a internet",
        "descripcion": "Todo el contenido necesario para la clase virtual"
      },
      {
        "nombre": "Plataforma en nube",
        "descripcion": "para gestión de contenido, gestión de proyecto e implementación"
      }
    ],
    "recursos": [
      {
        "id": 1,
        "recursoNombre": "Proyector Multimedia",
        "destino": "Aula"
      }
    ]
  }
}
```

### 4. ✅ Fórmula de Evaluación Completa

Incluye toda la estructura de la fórmula con variables, subfórmulas y planes de evaluación:

```json
{
  "evaluacionAprendizaje": {
    "planEvaluacion": [...],
    "formulaEvaluacion": {
      "id": 1,
      "nombreRegla": "...",
      "expresionFinal": "...",
      "variables": [...],
      "subformulas": [...],
      "variablesPlan": [...],
      "planesEvaluacion": [...]
    }
  }
}
```

### 5. ✅ Fuentes Completas

Incluye el campo `notas` que faltaba:

```json
{
  "id": 1,
  "tipo": "Libro",
  "autores": "...",
  "titulo": "...",
  "notas": "Texto principal del curso"
}
```

---

## Formato de Parseo

### Estrategias Metodológicas

- **Separador de items:** Salto de línea (`\n`)
- **Separador nombre-descripción:** Pipe (`|`)
- **Formato:** `Nombre del método|Descripción del método`

### Recursos Didácticos (Notas)

- **Separador de items:** Salto de línea (`\n`)
- **Separador nombre-descripción:** Pipe (`|`)
- **Formato:** `Nombre del recurso|Descripción del recurso`

**Ejemplo de texto en BD:**

```
Computadora, cámara web y conexión a internet.|Todo el contenido necesario para la clase virtual
Plataforma en nube|para gestión de contenido, gestión de proyecto e implementación
Materiales|Material docente, textos bases (ver fuentes de consultas).
```

**Resultado parseado:**

```json
[
  {
    "nombre": "Computadora, cámara web y conexión a internet.",
    "descripcion": "Todo el contenido necesario para la clase virtual"
  },
  {
    "nombre": "Plataforma en nube",
    "descripcion": "para gestión de contenido, gestión de proyecto e implementación"
  },
  {
    "nombre": "Materiales",
    "descripcion": "Material docente, textos bases (ver fuentes de consultas)."
  }
]
```

---

## Uso en Frontend

```typescript
interface CompleteSyllabus {
  datosGenerales: DatosGenerales;
  sumilla: string | null;
  competenciasCurso: Competencia[];
  componentesConceptuales: Componente[];
  componentesProcedimentales: Componente[];
  componentesActitudinales: Componente[];
  resultadosAprendizaje: ResultadoAprendizaje[];
  unidadesDidacticas: UnidadConSemanas[]; // ✅ ACTUALIZADO
  estrategiasMetodologicas: string | null;
  recursosDidacticos: {
    // ✅ ACTUALIZADO
    notas: string | null;
    recursos: RecursoDidactico[];
  };
  evaluacionAprendizaje: {
    // ✅ ACTUALIZADO
    planEvaluacion: PlanEvaluacion[];
    formulaEvaluacion: FormulaEvaluacionCompleta | null;
  };
  fuentes: Fuente[];
  aportesResultadosPrograma: Aporte[];
}

// Obtener sílabo completo
const fetchCompleteSyllabus = async (id: number): Promise<CompleteSyllabus> => {
  const response = await fetch(`/api/syllabus/${id}/complete`);
  const result = await response.json();
  return result.data;
};

// Ejemplo de uso
const syllabusData = await fetchCompleteSyllabus(123);

// Acceder a unidades con semanas
syllabusData.unidadesDidacticas.forEach((unidad) => {
  console.log(`Unidad ${unidad.numero}: ${unidad.titulo}`);
  unidad.semanas.forEach((semana) => {
    console.log(`  Semana ${semana.semana}: ${semana.contenidosConceptuales}`);
  });
});

// Acceder a fórmula de evaluación completa
if (syllabusData.evaluacionAprendizaje.formulaEvaluacion) {
  const formula = syllabusData.evaluacionAprendizaje.formulaEvaluacion;
  console.log(`Fórmula: ${formula.expresionFinal}`);
  console.log(`Variables: ${formula.variables.length}`);
}
```

---

## Notas Importantes

1. **Performance**: Este endpoint hace múltiples consultas a la base de datos para obtener toda la información. Úsalo solo cuando necesites el sílabo completo.

2. **Unidades con Semanas**: Cada unidad incluye automáticamente sus semanas ordenadas del 1 al 16.

3. **Fórmula de Evaluación**: Si no existe una fórmula activa, el campo será `null`.

4. **Recursos Didácticos**: Ahora es un objeto con dos propiedades: `notas` (texto general) y `recursos` (array de recursos específicos).

5. **Aportes**: No tiene campo `id` porque usa clave primaria compuesta (silaboId + resultadoCodigo).
