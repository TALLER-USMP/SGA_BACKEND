import { HttpRequest, HttpResponseInit } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import { controller, route } from "../../lib/decorators";
import { AppError } from "../../error";
import { STATUS_CODES } from "../../status-codes";

const containerName =
  process.env.AZURE_SIGNED_SYLLABI_CONTAINER || "signed-syllabi";

function getBlobServiceClient() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new AppError(
      "StorageConfigError",
      "INTERNAL_SERVER_ERROR",
      "AZURE_STORAGE_CONNECTION_STRING no está configurado",
    );
  }

  return BlobServiceClient.fromConnectionString(connectionString);
}

function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "name" in value
  );
}

@controller("director")
export class DirectorController {
  @route("/syllabi/upload-signed", "POST")
  async uploadSignedSyllabus(req: HttpRequest): Promise<HttpResponseInit> {
    const form = await req.formData();
    const silaboId = String(form.get("silaboId") ?? "").trim();
    const ciclo = String(form.get("ciclo") ?? "").trim();
    const file = form.get("file");

    if (!silaboId || !ciclo || !isUploadedFile(file)) {
      throw new AppError(
        "BadRequest",
        "BAD_REQUEST",
        "silaboId, ciclo y file son requeridos",
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const isPdf = bytes.subarray(0, 5).toString("utf8") === "%PDF-";
    if (!isPdf) {
      throw new AppError(
        "BadRequest",
        "BAD_REQUEST",
        "El archivo debe ser un PDF válido",
      );
    }

    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const blobName = `${silaboId}/${ciclo}/${Date.now()}-${safeFileName}`;
    const container = getBlobServiceClient().getContainerClient(containerName);
    await container.createIfNotExists();

    const blob = container.getBlockBlobClient(blobName);
    await blob.uploadData(bytes, {
      blobHTTPHeaders: {
        blobContentType: file.type || "application/pdf",
      },
      metadata: {
        silaboId,
        ciclo,
        originalName: safeFileName,
      },
    });

    return {
      status: STATUS_CODES.OK,
      headers: { "Content-Type": "application/json" },
      jsonBody: {
        success: true,
        message: "Archivo subido correctamente",
        data: {
          silaboId,
          ciclo,
          container: containerName,
          blobName,
          url: blob.url,
        },
      },
    };
  }
}
