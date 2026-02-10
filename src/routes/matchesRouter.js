import { Router } from "express";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches.js";
import matchesService from "../services/matches.service.js";


const matchRouter = Router();

matchRouter.get('/',async(req,res)=>{
    const parsed = listMatchesQuerySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
        error: "Invalid query.",
        details: parsed.error.issues,
        });
    }
    try {
     const limit = req.query.limit??20;
     const offset = req.query.offset??0;

     const data = await matchesService.getMatches({limit,offset});
     res.status(200).json(data);
  } catch (e) {
    res.status(500).json({
      error: "Failed to get matches.",
      details: e.message,
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