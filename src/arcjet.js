import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/node";

const ARCJETKEY = process.env.ARCJET_KEY;
const ARCJETMODE = process.env.ARCJET_ENV === 'development' ? "DRY_RUN" : "LIVE"

if(!ARCJETKEY) throw new Error("Arcject_key env variable is missing.");

export const httpArcjet = ARCJETKEY? arcjet({
    key:ARCJETKEY,
    rules:[
        shield({mode:ARCJETMODE}),
        detectBot({mode:ARCJETMODE,allow:['CATEGORY:SEARCH_ENGINE','CATEGORY:PREVIEW']}),
        slidingWindow({mode:ARCJETMODE,interval:'10s',max:50})
    ]
}):null;

export const wsArcjet = ARCJETKEY? arcjet({
    key:ARCJETKEY,
    rules:[
        shield({mode:ARCJETMODE}),
        detectBot({mode:ARCJETMODE,allow:['CATEGORY:SEARCH_ENGINE','CATEGORY:PREVIEW']}),
        slidingWindow({mode:ARCJETMODE,interval:'2s',max:5})
    ]
}):null;

export function arcjetMiddleware(){
    return async(req,res,next)=>{
        if(!httpArcjet) return next();

        try {

            const decision = await httpArcjet.protect(req);

            if(decision.isDenied()){
                if (decision.reason.isRateLimit()) {
                        return res.status(429).json({error:"Too Many Requests"})
                }
                return res.status(403).json({error:"Unauthorized"})
            }
            
        } catch (e) {
            console.error("Arcjet error",e);
            return res.status(503).json({error:"Service unavailable"});
        }
        next();
    }
}