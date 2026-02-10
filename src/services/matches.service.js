import { desc } from "drizzle-orm";
import { db } from "../db/db.js";
import { matches } from "../db/schema.js";
import { getMatchStatus } from "../utils/matchStatus.js";

const matchesService = {
  async getMatches({limit = 20 ,offset = 0} = {}){
    return await db
    .select()
    .from(matches)
    .orderBy(desc(matches.createdAt))
    .limit(Number(limit))
    .offset(Number(offset));
  },

  async create(data, locals) {
    const { startTime, endTime, homeScore, awayScore } = data;
    const status = getMatchStatus(startTime, endTime);
    if (!status) {
      throw new Error("Unable to determine match status from provided times");
    }
    const [event] = await db
      .insert(matches)
      .values({
        ...data,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        status,
      })
      .returning();

    if (locals?.broadcastMatchCreated) {
      locals.broadcastMatchCreated(event);
    }

    return event;
  },
};

export default matchesService;
