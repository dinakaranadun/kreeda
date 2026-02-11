import { Router } from "express";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches.js";
import matchesService from "../services/matches.service.js";


const matchRouter = Router();

matchRouter.get('/',async(req,res)=>{
    const parsed = listMatchesQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({
        error: "Invalid query.",
        details: parsed.error.issues,
        });
    }
    try {
     const { limit = 20, offset = 0 } = parsed.data;
     const data = await matchesService.getMatches({ limit, offset });
     res.status(200).json(data);
  } catch (e) {
    console.error("Failed to get matches:", e);
    res.status(500).json({
      error: "Failed to get matches.",
    });
  }
})

matchRouter.post("/", async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid payload.",
      details: parsed.error.issues,
    });
  }

  try {

    const event = await matchesService.create(
      parsed.data,
      req.app.locals
    );


    res.status(201).json({ data: event });
  } catch (e) {
    res.status(500).json({
      error: "Failed to create match.",
      details: e.message,
    });
  }
});
export default matchRouter;