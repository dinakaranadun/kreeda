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

    const [event] = await db
      .insert(matches)
      .values({
        ...data,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        status: getMatchStatus(startTime, endTime),
      })
      .returning();

    if (locals?.broadcastMatchCreated) {
      locals.broadcastMatchCreated(event);
    }

    return event;
  },
};

export default matchesService;
