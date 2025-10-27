import { getDb } from "../../db";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";
import { silaboAporteResultadoPrograma } from "../../../drizzle/schema";

class ContributionRepository {
  private db: NodePgDatabase<typeof schema>;

  constructor() {
    this.db = getDb() as unknown as NodePgDatabase<typeof schema>;
  }

  async createContribution(data: {
    silaboId: number;
    resultadoProgramaCodigo: string;
    resultadoProgramaDescripcion?: string;
    aporteValor: "" | "K" | "R";
  }) {
    const result = await this.db
      .insert(silaboAporteResultadoPrograma)
      .values({
        silaboId: data.silaboId,
        resultadoProgramaCodigo: data.resultadoProgramaCodigo,
        resultadoProgramaDescripcion: data.resultadoProgramaDescripcion,
        aporteValor: data.aporteValor,
      })
      .returning();

    return result[0];
  }
}

export const contributionRepository = new ContributionRepository();
