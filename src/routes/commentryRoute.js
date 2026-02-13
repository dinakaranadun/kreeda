import { Router } from "express";
import { matchIdParamSchema } from "../validation/matches.js";
import { createCommentarySchema } from "../validation/commentary.js";
import commentaryService from "../services/commentry.service.js";



const commentaryRouter = Router({ mergeParams: true });

commentaryRouter.post('/', async (req, res) => {
  const paramResult = matchIdParamSchema.safeParse(req.params);
  
  if (!paramResult.success) {
    return res.status(400).json({ error: 'Invalid match ID.', details: paramResult.error.issues });
  }

  const bodyResult = createCommentarySchema.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({ error: 'Invalid commentry payload.', details: bodyResult.error.issues });
  }

  try {
    const event = await commentaryService.create(paramResult.data, bodyResult.data);

    if(res.app.locals.broadcastCommentary){
        res.app.locals.broadcastCommentary(event.matchId,event)
    }
    return res.status(201).json({ data: event });
  } catch (e) {
    console.error('Failed to create commentary', e);
    return res.status(500).json({ error: 'Failed to create commentary' });
  }
});

export default commentaryRouter;
