import "dotenv/config";
import { Client } from "pg";
import jwt from "jsonwebtoken";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no esta configurado.");
}

function shouldUseSsl() {
  const sslMode = process.env.DATABASE_SSL?.toLowerCase();
  if (sslMode === "false" || sslMode === "disable") return false;
  if (/localhost|127\.0\.0\.1/i.test(connectionString!)) return false;
  return { rejectUnauthorized: false };
}

const client = new Client({
  connectionString,
  ssl: shouldUseSsl(),
});

const roles = [
  [1, "docente", "Docente"],
  [2, "indeterminado", "Usuario pendiente de asignacion de rol"],
  [3, "coordinadora_academica", "Coordinacion academica"],
  [4, "director_escuela", "Direccion de escuela"],
] as const;

const docentes = [
  {
    correo: "docente.demo@usmp.edu.pe",
    categoriaUsuarioId: 1,
    nombreDocente: "Docente Demo",
    numeroCelular: "999999901",
  },
  {
    correo: "coordinador.demo@usmp.edu.pe",
    categoriaUsuarioId: 3,
    nombreDocente: "Coordinadora Demo",
    numeroCelular: "999999902",
  },
  {
    correo: "director.demo@usmp.edu.pe",
    categoriaUsuarioId: 4,
    nombreDocente: "Director Demo",
    numeroCelular: "999999903",
  },
] as const;

const syllabus = {
  departamentoAcademico: "Ingenieria y Arquitectura",
  escuelaProfesional: "Ingenieria de Computacion y Sistemas",
  programaAcademico: "Ingenieria de Computacion y Sistemas",
  cursoCodigo: "09112108051",
  cursoNombre: "Taller de Proyectos",
  semestreAcademico: "2026-I",
  tipoAsignatura: "Obligatoria",
  tipoDeEstudios: "especialidad",
  modalidadDeAsignatura: "aDistancia",
  ciclo: "VIII",
  requisitos:
    "09013707052 - Ingenieria de Software II\n09140707041 - Inteligencia Artificial",
  horasTeoria: 0,
  horasPractica: 10,
  horasLaboratorio: 0,
  creditosTeoria: 0,
  creditosPractica: 5,
  estrategiasMetodologicas:
    "Metodo del pensamiento de diseno|Los estudiantes identifican el problema con mayor exactitud, son incluidos en un proceso de creacion, innovacion y colaboracion constante, desarrolla habilidades de empatia y emprendimiento.\nMetodo basado en proyectos|Los estudiantes son enfrentados a una situacion problematica real, promueve y fomenta el trabajo en equipo, la autocapacitacion y la autogestion para el desarrollo de un producto final.",
  recursosDidacticosNotas:
    "Computadora, camara web y conexion a internet.\nPlataforma en nube|para gestion de contenido, gestion de proyecto e implementacion.",
  estadoRevision: "ANALIZANDO",
};

const sumilla =
  "Es de caracter aplicativo; permite al estudiante desarrollar su capacidad para resolver una situacion problematica real a traves del desarrollo de un proyecto altamente innovador, aplicar competencias de iniciativa, investigacion y creatividad para el diseno de la solucion; responsabilidad, compromiso y autogestion del equipo para gestionar con exito el proyecto; autoexigencia para dar respuesta a parametros de calidad y mejora; comunicacion y reflexion para difundir resultados. La asignatura exige la elaboracion de un trabajo integrador.";

const competencias = [
  {
    codigo: "b",
    descripcion:
      "Utiliza el pensamiento critico, analizando los diferentes contextos, fuentes de informacion y hechos de la realidad.",
    orden: 1,
  },
  {
    codigo: "c",
    descripcion:
      "Realiza investigaciones relacionadas con su profesion bajo la guia de un profesional de mayor experiencia.",
    orden: 2,
  },
];

const componentes = [
  {
    grupo: "COMP",
    codigo: "b.3",
    descripcion:
      "Analiza diferentes dilemas sociales teniendo en cuenta la base del pensamiento critico.",
    orden: 1,
  },
  {
    grupo: "COMP",
    codigo: "c.1",
    descripcion:
      "Determina el tema de investigacion y las fuentes de informacion relacionadas al tema por investigar.",
    orden: 2,
  },
];

const aportes = [
  [
    "RP1",
    "Analizar un sistema complejo de computacion aplicando principios de computacion y otras disciplinas relevantes.",
    "K",
  ],
  [
    "RP2",
    "Disenar, implementar y evaluar una solucion basada en computacion.",
    "R",
  ],
  [
    "RP3",
    "Comunicacion efectiva en una variedad de contextos profesionales.",
    "R",
  ],
  [
    "RP4",
    "Reconoce la responsabilidad profesional y toma decisiones informadas.",
    null,
  ],
  ["RP5", "Trabaja de manera efectiva como miembro o lider de equipos.", "K"],
  ["RP6", "Brinda soporte a la entrega e integracion de soluciones.", "K"],
  ["RP7", "Aprendizaje continuo y adaptacion a nuevas tecnologias.", "R"],
] as const;

async function upsertRoles() {
  for (const [id, nombre, descripcion] of roles) {
    await client.query(
      `
      insert into categoria_usuario (id, nombre_categoria, descripcion, activo)
      values ($1, $2, $3, true)
      on conflict (id) do update set
        nombre_categoria = excluded.nombre_categoria,
        descripcion = excluded.descripcion,
        activo = true,
        actualizado_en = now()
      `,
      [id, nombre, descripcion],
    );
  }

  await client.query(
    "select setval(pg_get_serial_sequence('categoria_usuario', 'id'), greatest((select max(id) from categoria_usuario), 1), true)",
  );
}

async function upsertDocentes() {
  const ids: Record<string, number> = {};

  for (const docente of docentes) {
    const result = await client.query<{ id: number }>(
      `
      insert into docente (
        correo,
        categoria_usuario_id,
        nombre_docente,
        numero_celular,
        activo
      )
      values ($1, $2, $3, $4, true)
      on conflict (correo) do update set
        categoria_usuario_id = excluded.categoria_usuario_id,
        nombre_docente = excluded.nombre_docente,
        numero_celular = excluded.numero_celular,
        activo = true,
        actualizado_en = now()
      returning id
      `,
      [
        docente.correo,
        docente.categoriaUsuarioId,
        docente.nombreDocente,
        docente.numeroCelular,
      ],
    );

    ids[docente.correo] = result.rows[0].id;
  }

  return ids;
}

async function upsertSyllabus(docenteIds: Record<string, number>) {
  const ownerId = docenteIds["coordinador.demo@usmp.edu.pe"];

  const existing = await client.query<{ id: number }>(
    "select id from silabo where curso_codigo = $1 order by id limit 1",
    [syllabus.cursoCodigo],
  );

  const values = [
    syllabus.departamentoAcademico,
    syllabus.escuelaProfesional,
    syllabus.programaAcademico,
    syllabus.cursoCodigo,
    syllabus.cursoNombre,
    syllabus.semestreAcademico,
    syllabus.tipoAsignatura,
    syllabus.tipoDeEstudios,
    syllabus.modalidadDeAsignatura,
    syllabus.ciclo,
    syllabus.requisitos,
    syllabus.horasTeoria,
    syllabus.horasPractica,
    syllabus.horasLaboratorio,
    syllabus.creditosTeoria,
    syllabus.creditosPractica,
    syllabus.estrategiasMetodologicas,
    syllabus.recursosDidacticosNotas,
    syllabus.estadoRevision,
    ownerId,
  ];

  let syllabusId: number;
  if (existing.rowCount) {
    syllabusId = existing.rows[0].id;
    await client.query(
      `
      update silabo set
        departamento_academico = $1,
        escuela_profesional = $2,
        programa_academico = $3,
        curso_codigo = $4,
        curso_nombre = $5,
        semestre_academico = $6,
        tipo_asignatura = $7,
        tipo_de_estudios = $8,
        modalidad_de_asignatura = $9,
        ciclo = $10,
        requisitos = $11,
        horas_teoria = $12,
        horas_practica = $13,
        horas_laboratorio = $14,
        creditos_teoria = $15,
        creditos_practica = $16,
        estrategias_metodologicas = $17,
        recursos_didacticos_notas = $18,
        estado_revision = $19,
        asignado_a_docente_id = $20,
        creado_por_docente_id = coalesce(creado_por_docente_id, $20),
        actualizado_por_docente_id = $20,
        updated_at = now()
      where id = $21
      `,
      [...values, syllabusId],
    );
  } else {
    const inserted = await client.query<{ id: number }>(
      `
      insert into silabo (
        departamento_academico,
        escuela_profesional,
        programa_academico,
        curso_codigo,
        curso_nombre,
        semestre_academico,
        tipo_asignatura,
        tipo_de_estudios,
        modalidad_de_asignatura,
        ciclo,
        requisitos,
        horas_teoria,
        horas_practica,
        horas_laboratorio,
        creditos_teoria,
        creditos_practica,
        estrategias_metodologicas,
        recursos_didacticos_notas,
        estado_revision,
        asignado_a_docente_id,
        creado_por_docente_id,
        actualizado_por_docente_id
      )
      values (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19,
        $20, $20, $20
      )
      returning id
      `,
      values,
    );
    syllabusId = inserted.rows[0].id;
  }

  await client.query(
    `
    insert into silabo_docente (silabo_id, docente_id, rol)
    values ($1, $2, 'responsable')
    on conflict (silabo_id, docente_id) do update set
      rol = excluded.rol,
      actualizado_en = now()
    `,
    [syllabusId, ownerId],
  );

  const updatedSumilla = await client.query(
    `
    update silabo_sumilla set
      contenido = $2,
      palabras_clave = 'proyectos, innovacion, gestion, investigacion',
      es_actual = true,
      updated_at = now()
    where silabo_id = $1 and version = 1
    `,
    [syllabusId, sumilla],
  );

  if (!updatedSumilla.rowCount) {
    await client.query(
      `
      insert into silabo_sumilla (
        silabo_id,
        contenido,
        palabras_clave,
        version,
        es_actual
      )
      values ($1, $2, 'proyectos, innovacion, gestion, investigacion', 1, true)
      `,
      [syllabusId, sumilla],
    );
  }

  for (const item of competencias) {
    await client.query(
      `
      insert into silabo_competencia_curso (silabo_id, codigo, descripcion, orden)
      values ($1, $2, $3, $4)
      on conflict do nothing
      `,
      [syllabusId, item.codigo, item.descripcion, item.orden],
    );
  }

  for (const item of componentes) {
    await client.query(
      `
      insert into silabo_competencia_componente (silabo_id, grupo, codigo, descripcion, orden)
      select $1::integer, $2::varchar, $3::varchar, $4::text, $5::integer
      where not exists (
        select 1 from silabo_competencia_componente
        where silabo_id = $1::integer and codigo = $3::varchar
      )
      `,
      [syllabusId, item.grupo, item.codigo, item.descripcion, item.orden],
    );
  }

  await client.query(
    `
    insert into silabo_unidad (
      silabo_id,
      numero,
      titulo,
      capacidades_text,
      contenidos_conceptuales,
      contenidos_procedimentales,
      actividades_aprendizaje,
      horas_lectivas_teoria,
      horas_lectivas_practica,
      horas_no_lectivas_teoria,
      horas_no_lectivas_practica
    )
    values (
      $1,
      1,
      'Diseno de soluciones innovadoras',
      'Identifica problemas, propone alternativas y estructura una solucion innovadora.',
      'El taller y sus objetivos generales. Modelo de trabajo. Planteamiento del problema.',
      'Analisis del problema, definicion de alcance y propuesta inicial.',
      'Trabajo colaborativo, revision guiada y presentacion de avance.',
      0,
      10,
      0,
      0
    )
    on conflict (silabo_id, numero) do update set
      titulo = excluded.titulo,
      capacidades_text = excluded.capacidades_text,
      contenidos_conceptuales = excluded.contenidos_conceptuales,
      contenidos_procedimentales = excluded.contenidos_procedimentales,
      actividades_aprendizaje = excluded.actividades_aprendizaje,
      horas_lectivas_teoria = excluded.horas_lectivas_teoria,
      horas_lectivas_practica = excluded.horas_lectivas_practica,
      horas_no_lectivas_teoria = excluded.horas_no_lectivas_teoria,
      horas_no_lectivas_practica = excluded.horas_no_lectivas_practica
    `,
    [syllabusId],
  );

  for (const [codigo, descripcion, aporte] of aportes) {
    await client.query(
      `
      insert into silabo_aporte_resultado_programa (
        silabo_id,
        resultado_programa_codigo,
        resultado_programa_descripcion,
        aporte_valor
      )
      values ($1, $2, $3, $4)
      on conflict (silabo_id, resultado_programa_codigo) do update set
        resultado_programa_descripcion = excluded.resultado_programa_descripcion,
        aporte_valor = excluded.aporte_valor
      `,
      [syllabusId, codigo, descripcion, aporte],
    );
  }

  return syllabusId;
}

function printLocalTokens(docenteIds: Record<string, number>) {
  if (!process.env.JWT_SECRET) return;

  console.log("\nTokens locales de prueba para /api/auth/me:");
  for (const docente of docentes) {
    const token = jwt.sign(
      {
        id: docenteIds[docente.correo],
        email: docente.correo,
        role: docente.categoriaUsuarioId,
        name: docente.nombreDocente,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    console.log(`- ${docente.correo}: ${token}`);
  }
}

async function main() {
  await client.connect();
  await client.query("begin");

  try {
    await upsertRoles();
    const docenteIds = await upsertDocentes();
    const syllabusId = await upsertSyllabus(docenteIds);
    await client.query("commit");

    console.log("Seed de desarrollo aplicado correctamente.");
    console.log(`Sílabo demo: ${syllabus.cursoCodigo} - id ${syllabusId}`);
    printLocalTokens(docenteIds);
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("No se pudo aplicar el seed de desarrollo.");
  console.error(error);
  process.exit(1);
});
