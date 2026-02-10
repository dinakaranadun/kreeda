import express from 'express'
import matcheRouter from './src/routes/matchesRouter.js';

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (req, res) => {
	res.json({ message: "Hello from the Express server!" });
});
app.use('/matches',matcheRouter)

app.listen(PORT, () => {
	console.log(`Server started on http://localhost:${PORT}`);
});
 