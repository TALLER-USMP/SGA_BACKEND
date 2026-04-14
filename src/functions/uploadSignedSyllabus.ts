import { app } from "@azure/functions";
import * as fs from "fs";
import * as path from "path";
import { sql } from "drizzle-orm";
import { getDb } from "../db";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "silabos_firmados");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.http("director_upload_signed_syllabus", {
  methods: ["POST"],
  route: "director/syllabi/upload-signed",
  authLevel: "anonymous",
  handler: async (req) => {
    try {
      const formData = await req.formData();

      const file = formData.get("file") as File | null;
      const silaboIdRaw = formData.get("silaboId");
      const cicloRaw = formData.get("ciclo");

      const silaboId = Number(silaboIdRaw);
      const ciclo = String(cicloRaw ?? "").trim();

      if (!file) {
        return {
          status: 400,
          jsonBody: { message: "Debe seleccionar un archivo PDF" },
        };
      }

      if (!Number.isFinite(silaboId) || silaboId <= 0) {
        return {
          status: 400,
          jsonBody: { message: "Debe seleccionar una asignatura válida" },
        };
      }

      if (!ciclo) {
        return {
          status: 400,
          jsonBody: { message: "Debe seleccionar un ciclo" },
        };
      }

      if (file.type !== "application/pdf") {
        return {
          status: 400,
          jsonBody: { message: "Solo se permiten archivos PDF" },
        };
      }

      const db = getDb();

      const syllabusResult = await db.execute(sql`
        SELECT id, curso_codigo, curso_nombre
        FROM silabo
        WHERE id = ${silaboId}
        LIMIT 1
      `);

      const syllabus = syllabusResult.rows?.[0];

      if (!syllabus) {
        return {
          status: 404,
          jsonBody: { message: "Sílabo no encontrado" },
        };
      }

      const safeFileName = `${silaboId}_${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const filePath = path.join(UPLOAD_DIR, safeFileName);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      fs.writeFileSync(filePath, buffer);

      await db.execute(sql`
        INSERT INTO silabo_archivo_firmado (
          silabo_id,
          ciclo,
          nombre_archivo,
          ruta_archivo
        )
        VALUES (
          ${silaboId},
          ${ciclo},
          ${file.name},
          ${filePath}
        )
      `);

      return {
        status: 200,
        jsonBody: {
          message: "Archivo subido correctamente",
          fileName: file.name,
          filePath,
        },
      };
    } catch (error) {
      console.error("Error subiendo sílabo firmado:", error);
      return {
        status: 500,
        jsonBody: { message: "Error al subir archivo" },
      };
    }
  },
});
