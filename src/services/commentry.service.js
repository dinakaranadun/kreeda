import { db } from "../db/db.js";
import { commentary } from "../db/schema.js";

const commentaryService = {
  async create(paramData, data) {
    const { tags, ...rest } = data;

    const [result] = await db.insert(commentary).values({
      matchId: paramData.id,
      ...rest,
      tags: JSON.stringify(tags),
    }).returning();

    return result;
  },
};

export default commentaryService;
